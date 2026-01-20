/**
 * SLA Manager - Service Level Agreement tracking
 *
 * Handles SLA status calculation, threshold checking,
 * and escalation triggering.
 *
 * @module L2_Control/engine/helpers/SlaManager
 */

/**
 * SLA status levels
 */
export const SlaStatus = {
  NO_SLA: 'no_sla',
  ON_TRACK: 'on_track',
  WARNING: 'warning',
  BREACHED: 'breached',
  CRITICAL: 'critical'
};

/**
 * SLA threshold ratios
 */
export const SlaThresholds = {
  WARNING: 0.75,
  BREACHED: 1.0,
  CRITICAL: 1.5
};

/**
 * Calculate SLA status for a workflow instance
 * @param {WorkflowInstance} instance - Workflow instance
 * @param {Date} now - Current time
 * @returns {Object} SLA status info
 */
export function calculateSlaStatus(instance, now = new Date()) {
  if (!instance.slaDeadline) {
    return { status: SlaStatus.NO_SLA, ratio: 0 };
  }

  const totalTime = instance.slaDeadline - instance.startedAt;
  const elapsedTime = now - instance.startedAt;
  const ratio = elapsedTime / totalTime;

  const status = getSlaStatusFromRatio(ratio);

  return {
    status,
    ratio,
    deadline: instance.slaDeadline,
    remainingMs: Math.max(0, instance.slaDeadline - now),
    elapsedMs: elapsedTime,
    totalMs: totalTime
  };
}

/**
 * Get SLA status from ratio
 * @param {number} ratio - Elapsed/total time ratio
 * @returns {string} Status
 */
export function getSlaStatusFromRatio(ratio) {
  if (ratio < SlaThresholds.WARNING) {
    return SlaStatus.ON_TRACK;
  } else if (ratio < SlaThresholds.BREACHED) {
    return SlaStatus.WARNING;
  } else if (ratio < SlaThresholds.CRITICAL) {
    return SlaStatus.BREACHED;
  } else {
    return SlaStatus.CRITICAL;
  }
}

/**
 * Check if SLA needs escalation based on rules
 * @param {Object} slaStatus - SLA status from calculateSlaStatus
 * @param {Array} escalationRules - Escalation rule definitions
 * @param {Array} triggeredAlarms - Already triggered alarm types
 * @returns {Array} Rules that should be triggered
 */
export function checkEscalationRules(slaStatus, escalationRules, triggeredAlarms = []) {
  const toTrigger = [];

  for (const rule of escalationRules) {
    if (slaStatus.ratio >= rule.threshold && !triggeredAlarms.includes(rule.trigger)) {
      toTrigger.push(rule);
    }
  }

  return toTrigger;
}

/**
 * Format time remaining for display
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted string
 */
export function formatTimeRemaining(ms) {
  if (ms <= 0) return 'Overdue';

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}

/**
 * SLA Manager class for tracking multiple instances
 */
export class SlaManager {
  constructor(escalationRules = []) {
    this.escalationRules = escalationRules;
  }

  /**
   * Check SLA status for multiple instances
   * @param {Map|Array} instances - Workflow instances
   * @returns {Array} Status for each instance
   */
  checkAll(instances) {
    const now = new Date();
    const results = [];
    const instanceList = instances instanceof Map
      ? Array.from(instances.values())
      : instances;

    for (const instance of instanceList) {
      if (instance.isComplete() || instance.isAborted()) continue;

      const slaStatus = calculateSlaStatus(instance, now);
      const escalations = checkEscalationRules(
        slaStatus,
        this.escalationRules,
        instance.alarms || []
      );

      results.push({
        instanceId: instance.id,
        workflowId: instance.workflowId,
        entityId: instance.entityId,
        currentState: instance.currentState,
        slaStatus,
        escalations
      });
    }

    return results;
  }

  /**
   * Get summary statistics
   * @param {Array} statusResults - Results from checkAll
   * @returns {Object} Summary
   */
  getSummary(statusResults) {
    const summary = {
      total: statusResults.length,
      byStatus: {
        [SlaStatus.ON_TRACK]: 0,
        [SlaStatus.WARNING]: 0,
        [SlaStatus.BREACHED]: 0,
        [SlaStatus.CRITICAL]: 0,
        [SlaStatus.NO_SLA]: 0
      }
    };

    for (const result of statusResults) {
      summary.byStatus[result.slaStatus.status]++;
    }

    return summary;
  }
}

export default SlaManager;
