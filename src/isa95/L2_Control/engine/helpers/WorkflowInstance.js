/**
 * WorkflowInstance - Active workflow state container
 *
 * Represents a running workflow instance with state tracking,
 * history, and SLA management.
 *
 * @module L2_Control/engine/helpers/WorkflowInstance
 */

/**
 * Calculate SLA deadline based on business days
 * @param {Date} startDate - Start date
 * @param {number} businessDays - Number of business days
 * @returns {Date} Deadline
 */
export function calculateBusinessDayDeadline(startDate, businessDays) {
  const deadline = new Date(startDate);
  let daysToAdd = businessDays;
  while (daysToAdd > 0) {
    deadline.setDate(deadline.getDate() + 1);
    const dayOfWeek = deadline.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysToAdd--;
    }
  }
  return deadline;
}

/**
 * Workflow instance status
 */
export const InstanceStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  SUSPENDED: 'suspended',
  ABORTED: 'aborted'
};

/**
 * WorkflowInstance class
 */
export class WorkflowInstance {
  /**
   * @param {string} workflowId - Workflow type ID
   * @param {Object} workflowDef - Workflow definition
   * @param {string} entityId - Entity being processed
   * @param {Object} initialData - Initial workflow data
   */
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
    this.alarms = [];

    // Calculate SLA deadline
    this.slaDeadline = workflowDef.slaBusinessDays
      ? calculateBusinessDayDeadline(this.startedAt, workflowDef.slaBusinessDays)
      : null;
  }

  /**
   * Record a state transition
   * @param {string} fromState - Previous state
   * @param {string} toState - New state
   * @param {string} action - Action taken
   * @param {string} user - User who took action
   * @param {string} notes - Optional notes
   */
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

  /**
   * Check if workflow is complete
   * @returns {boolean}
   */
  isComplete() {
    const states = this.definition.states;
    return this.currentState === states[states.length - 1];
  }

  /**
   * Check if workflow is suspended
   * @returns {boolean}
   */
  isSuspended() {
    return this.data._suspended === true;
  }

  /**
   * Check if workflow is aborted
   * @returns {boolean}
   */
  isAborted() {
    return this.data._aborted === true;
  }

  /**
   * Get current status
   * @returns {string}
   */
  getStatus() {
    if (this.isComplete()) return InstanceStatus.COMPLETED;
    if (this.isAborted()) return InstanceStatus.ABORTED;
    if (this.isSuspended()) return InstanceStatus.SUSPENDED;
    return InstanceStatus.ACTIVE;
  }

  /**
   * Suspend the workflow
   * @param {string} reason - Suspension reason
   */
  suspend(reason) {
    this.data._suspended = true;
    this.data._suspendedState = this.currentState;
    this.data._suspendReason = reason;
  }

  /**
   * Resume from suspension
   * @returns {string} Previous state
   */
  resume() {
    const suspendedState = this.data._suspendedState;
    delete this.data._suspended;
    delete this.data._suspendedState;
    delete this.data._suspendReason;
    this.currentState = suspendedState;
    return suspendedState;
  }

  /**
   * Abort the workflow
   * @param {string} reason - Abort reason
   */
  abort(reason) {
    this.data._aborted = true;
    this.data._abortReason = reason;
  }

  /**
   * Get time elapsed since start
   * @returns {number} Milliseconds
   */
  getElapsedTime() {
    return Date.now() - this.startedAt.getTime();
  }

  /**
   * Get time remaining until SLA deadline
   * @returns {number|null} Milliseconds or null if no SLA
   */
  getTimeRemaining() {
    if (!this.slaDeadline) return null;
    return Math.max(0, this.slaDeadline.getTime() - Date.now());
  }

  toJSON() {
    return {
      id: this.id,
      workflowId: this.workflowId,
      entityId: this.entityId,
      currentState: this.currentState,
      status: this.getStatus(),
      data: this.data,
      startedAt: this.startedAt,
      updatedAt: this.updatedAt,
      slaDeadline: this.slaDeadline,
      historyCount: this.history.length,
      isComplete: this.isComplete()
    };
  }
}

export default WorkflowInstance;
