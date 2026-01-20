/**
 * Workflow Engine - ISA-95 L2 Control Layer
 *
 * Orchestrates workflow state transitions for county operations.
 * Reads workflow definitions from config/workflow-rules.json.
 * Integrates with AlarmManager for SLA escalations.
 *
 * @module L2_Control/engine/WorkflowEngine
 * @standard ISA-95 Level 2
 */

import { AlarmPriority, AlarmState, CountyAlarmTypes } from '../alarms/index.js';

/**
 * Workflow instance representing an active workflow
 */
export class WorkflowInstance {
  constructor(workflowId, workflowDef, entityId, initialData = {}) {
    this.id = `${workflowId}-${entityId}-${Date.now()}`;
    this.workflowId = workflowId;
    this.entityId = entityId;
    this.definition = workflowDef;
    this.currentState = workflowDef.states[0];
    this.data = initialData;
    this.history = [];
    this.startedAt = new Date();
    this.updatedAt = new Date();
    this.slaDeadline = this._calculateSlaDeadline();
    this.alarms = [];
  }

  _calculateSlaDeadline() {
    if (!this.definition.slaBusinessDays) return null;
    const deadline = new Date(this.startedAt);
    let daysToAdd = this.definition.slaBusinessDays;
    while (daysToAdd > 0) {
      deadline.setDate(deadline.getDate() + 1);
      const dayOfWeek = deadline.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysToAdd--;
      }
    }
    return deadline;
  }

  recordTransition(fromState, toState, action, user, notes = '') {
    this.history.push({
      timestamp: new Date(),
      fromState,
      toState,
      action,
      user,
      notes
    });
    this.currentState = toState;
    this.updatedAt = new Date();
  }

  isComplete() {
    const states = this.definition.states;
    return this.currentState === states[states.length - 1];
  }

  toJSON() {
    return {
      id: this.id,
      workflowId: this.workflowId,
      entityId: this.entityId,
      currentState: this.currentState,
      data: this.data,
      startedAt: this.startedAt,
      updatedAt: this.updatedAt,
      slaDeadline: this.slaDeadline,
      historyCount: this.history.length,
      isComplete: this.isComplete()
    };
  }
}

/**
 * WorkflowEngine - Main workflow orchestration engine
 */
export class WorkflowEngine {
  constructor(workflowRulesConfig, alarmManager = null) {
    this.config = workflowRulesConfig;
    this.workflows = workflowRulesConfig.workflows || {};
    this.globalRules = workflowRulesConfig.globalRules || {};
    this.approvalThresholds = workflowRulesConfig.approvalThresholds || {};
    this.escalationRules = workflowRulesConfig.escalationRules || [];
    this.alarmManager = alarmManager;

    // Active workflow instances
    this.instances = new Map();

    // Event handlers
    this.handlers = new Map();
  }

  /**
   * Get available workflow types
   */
  getWorkflowTypes() {
    return Object.keys(this.workflows);
  }

  /**
   * Get workflow definition by ID
   */
  getWorkflowDef(workflowId) {
    return this.workflows[workflowId];
  }

  /**
   * Start a new workflow instance
   */
  startWorkflow(workflowId, entityId, initialData = {}, user = 'system') {
    const workflowDef = this.workflows[workflowId];
    if (!workflowDef) {
      throw new Error(`Unknown workflow: ${workflowId}`);
    }

    const instance = new WorkflowInstance(workflowId, workflowDef, entityId, initialData);
    instance.recordTransition(null, instance.currentState, 'start', user, 'Workflow started');

    this.instances.set(instance.id, instance);
    this._emit('workflowStarted', instance);

    if (this.globalRules.auditLogRequired) {
      this._auditLog('workflow_started', instance, user);
    }

    return instance;
  }

  /**
   * Execute a transition on a workflow instance
   */
  async executeTransition(instanceId, action, user, data = {}) {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Workflow instance not found: ${instanceId}`);
    }

    const transition = this._findTransition(instance, action);
    if (!transition) {
      throw new Error(`Invalid action '${action}' from state '${instance.currentState}'`);
    }

    // Check conditions
    const conditionResult = await this._checkConditions(transition, instance, data);
    if (!conditionResult.valid) {
      return {
        success: false,
        error: 'Conditions not met',
        failedConditions: conditionResult.failures
      };
    }

    const fromState = instance.currentState;
    const toState = transition.to;

    // Update instance
    instance.recordTransition(fromState, toState, action, user, data.notes || '');
    Object.assign(instance.data, data);

    this._emit('transitionCompleted', { instance, transition, user });

    if (this.globalRules.auditLogRequired) {
      this._auditLog('transition', instance, user, { fromState, toState, action });
    }

    return {
      success: true,
      instance: instance.toJSON(),
      fromState,
      toState
    };
  }

  /**
   * Find valid transition for action from current state
   */
  _findTransition(instance, action) {
    const transitions = instance.definition.transitions || [];
    return transitions.find(t => {
      const fromStates = Array.isArray(t.from) ? t.from : [t.from];
      return fromStates.includes(instance.currentState) && t.action === action;
    });
  }

  /**
   * Check transition conditions
   */
  async _checkConditions(transition, instance, data) {
    const conditions = transition.conditions || [];
    const failures = [];

    for (const condition of conditions) {
      const met = await this._evaluateCondition(condition, instance, data);
      if (!met) {
        failures.push(condition);
      }
    }

    return {
      valid: failures.length === 0,
      failures
    };
  }

  /**
   * Evaluate a single condition
   */
  async _evaluateCondition(condition, instance, data) {
    // Check if condition is in data flags
    if (data[condition] === true) {
      return true;
    }

    // Check in instance data
    if (instance.data[condition] === true) {
      return true;
    }

    // Custom condition handlers
    const handler = this.handlers.get(`condition:${condition}`);
    if (handler) {
      return await handler(instance, data);
    }

    // Default: condition not met if not explicitly true
    return false;
  }

  /**
   * Handle exception on workflow
   */
  handleException(instanceId, exceptionName, user, notes = '') {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Workflow instance not found: ${instanceId}`);
    }

    const exceptions = instance.definition.exceptions || [];
    const exception = exceptions.find(e => e.name === exceptionName);

    if (!exception) {
      throw new Error(`Unknown exception: ${exceptionName}`);
    }

    const previousState = instance.currentState;

    if (exception.action === 'suspend') {
      instance.data._suspended = true;
      instance.data._suspendedState = previousState;
      instance.data._suspendReason = exceptionName;
    } else if (exception.action === 'abort') {
      instance.data._aborted = true;
      instance.data._abortReason = exceptionName;
    }

    instance.recordTransition(previousState, `${previousState}:${exception.action}`, exceptionName, user, notes);

    this._emit('exceptionHandled', { instance, exception, user });

    if (this.alarmManager) {
      this._raiseAlarm(instance, 'WORKFLOW_EXCEPTION', {
        exception: exceptionName,
        action: exception.action
      });
    }

    return instance;
  }

  /**
   * Resume suspended workflow
   */
  resumeWorkflow(instanceId, user, notes = '') {
    const instance = this.instances.get(instanceId);
    if (!instance || !instance.data._suspended) {
      throw new Error(`Workflow not suspended: ${instanceId}`);
    }

    const suspendedState = instance.data._suspendedState;
    delete instance.data._suspended;
    delete instance.data._suspendedState;
    delete instance.data._suspendReason;

    instance.currentState = suspendedState;
    instance.recordTransition(`${suspendedState}:suspend`, suspendedState, 'resume', user, notes);

    this._emit('workflowResumed', instance);
    return instance;
  }

  /**
   * Get approval threshold for transaction type
   */
  getApprovalThreshold(type, amount) {
    const thresholds = this.approvalThresholds[type];
    if (!thresholds) return null;

    for (const threshold of thresholds) {
      if (threshold.maxAmount === null || amount <= threshold.maxAmount) {
        return threshold;
      }
    }
    return thresholds[thresholds.length - 1];
  }

  /**
   * Check SLA status for all active workflows
   */
  checkSlaStatus() {
    const now = new Date();
    const results = [];

    for (const instance of this.instances.values()) {
      if (instance.isComplete() || instance.data._aborted) continue;

      const slaStatus = this._calculateSlaStatus(instance, now);
      results.push({
        instanceId: instance.id,
        workflowId: instance.workflowId,
        entityId: instance.entityId,
        currentState: instance.currentState,
        slaStatus
      });

      // Check escalation rules
      for (const rule of this.escalationRules) {
        if (slaStatus.ratio >= rule.threshold && !instance.alarms.includes(rule.trigger)) {
          this._escalate(instance, rule);
          instance.alarms.push(rule.trigger);
        }
      }
    }

    return results;
  }

  /**
   * Calculate SLA status for instance
   */
  _calculateSlaStatus(instance, now) {
    if (!instance.slaDeadline) {
      return { status: 'no_sla', ratio: 0 };
    }

    const totalTime = instance.slaDeadline - instance.startedAt;
    const elapsedTime = now - instance.startedAt;
    const ratio = elapsedTime / totalTime;

    let status;
    if (ratio < 0.75) {
      status = 'on_track';
    } else if (ratio < 1.0) {
      status = 'warning';
    } else if (ratio < 1.5) {
      status = 'breached';
    } else {
      status = 'critical';
    }

    return {
      status,
      ratio,
      deadline: instance.slaDeadline,
      remainingMs: Math.max(0, instance.slaDeadline - now)
    };
  }

  /**
   * Escalate based on rule
   */
  _escalate(instance, rule) {
    this._emit('escalation', { instance, rule });

    if (this.alarmManager) {
      const alarmType = rule.trigger === 'sla_critical'
        ? CountyAlarmTypes.SLA_BREACH
        : CountyAlarmTypes.SLA_WARNING;

      this._raiseAlarm(instance, rule.trigger.toUpperCase(), {
        action: rule.action,
        threshold: rule.threshold
      });
    }
  }

  /**
   * Raise alarm through alarm manager
   */
  _raiseAlarm(instance, type, data) {
    if (!this.alarmManager) return;

    this.alarmManager.raiseAlarm({
      type,
      source: `workflow:${instance.workflowId}`,
      entityId: instance.entityId,
      instanceId: instance.id,
      data
    });
  }

  /**
   * Register event handler
   */
  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    const handlers = this.handlers.get(event);
    if (Array.isArray(handlers)) {
      handlers.push(handler);
    } else {
      this.handlers.set(event, [handlers, handler]);
    }
  }

  /**
   * Register condition evaluator
   */
  registerCondition(conditionName, evaluator) {
    this.handlers.set(`condition:${conditionName}`, evaluator);
  }

  /**
   * Emit event to handlers
   */
  _emit(event, data) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      const handlerList = Array.isArray(handlers) ? handlers : [handlers];
      for (const handler of handlerList) {
        try {
          handler(data);
        } catch (err) {
          console.error(`Error in event handler for ${event}:`, err);
        }
      }
    }
  }

  /**
   * Audit log entry
   */
  _auditLog(action, instance, user, extra = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      workflowId: instance.workflowId,
      instanceId: instance.id,
      entityId: instance.entityId,
      currentState: instance.currentState,
      user,
      ...extra
    };
    this._emit('auditLog', entry);
  }

  /**
   * Get instance by ID
   */
  getInstance(instanceId) {
    return this.instances.get(instanceId);
  }

  /**
   * Get all active instances for a workflow type
   */
  getActiveInstances(workflowId = null) {
    const active = [];
    for (const instance of this.instances.values()) {
      if (!instance.isComplete() && !instance.data._aborted) {
        if (!workflowId || instance.workflowId === workflowId) {
          active.push(instance.toJSON());
        }
      }
    }
    return active;
  }

  /**
   * Get workflow statistics
   */
  getStatistics() {
    const stats = {
      total: this.instances.size,
      active: 0,
      completed: 0,
      suspended: 0,
      aborted: 0,
      byWorkflow: {}
    };

    for (const instance of this.instances.values()) {
      const wfId = instance.workflowId;
      if (!stats.byWorkflow[wfId]) {
        stats.byWorkflow[wfId] = { total: 0, active: 0, completed: 0 };
      }
      stats.byWorkflow[wfId].total++;

      if (instance.isComplete()) {
        stats.completed++;
        stats.byWorkflow[wfId].completed++;
      } else if (instance.data._aborted) {
        stats.aborted++;
      } else if (instance.data._suspended) {
        stats.suspended++;
      } else {
        stats.active++;
        stats.byWorkflow[wfId].active++;
      }
    }

    return stats;
  }
}

/**
 * Create workflow engine from config file
 */
export async function createWorkflowEngine(configPath, alarmManager = null) {
  const fs = await import('fs/promises');
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  return new WorkflowEngine(config, alarmManager);
}

export default WorkflowEngine;
