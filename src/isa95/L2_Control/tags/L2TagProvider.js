/**
 * L2 Tag Provider - Control System Tags
 *
 * Provides tag access for control-level data:
 * - Budget cycles and appropriations
 * - Audit plans and schedules
 * - Payroll processing
 * - Procurement workflows
 * - Alarms and alerts
 * - Process control states
 *
 * @module isa95/L2_Control/tags
 */

export class L2TagProvider {
  constructor() {
    this.cache = new Map();
    this.subscriptions = new Map();
    this.prefix = 'L2';
    this.alarms = new Map();
  }

  /**
   * Tag paths for L2 control
   */
  static TAGS = {
    // Budget control
    BUDGET_FISCAL_YEAR: 'L2.Budget.FiscalYear',
    BUDGET_TOTAL: 'L2.Budget.Total',
    BUDGET_SPENT: 'L2.Budget.Spent',
    BUDGET_REMAINING: 'L2.Budget.Remaining',
    BUDGET_PERCENT_USED: 'L2.Budget.PercentUsed',

    // Audit control
    AUDIT_PLAN_ACTIVE: 'L2.Audit.PlanActive',
    AUDIT_ENGAGEMENTS_SCHEDULED: 'L2.Audit.EngagementsScheduled',
    AUDIT_ENGAGEMENTS_COMPLETE: 'L2.Audit.EngagementsComplete',
    AUDIT_RISK_SCORE: 'L2.Audit.RiskScore',

    // Payroll control
    PAYROLL_CYCLE: 'L2.Payroll.Cycle',
    PAYROLL_NEXT_DATE: 'L2.Payroll.NextDate',
    PAYROLL_TOTAL_GROSS: 'L2.Payroll.TotalGross',
    PAYROLL_STATUS: 'L2.Payroll.Status',

    // Procurement control
    PROCUREMENT_ACTIVE_BIDS: 'L2.Procurement.ActiveBids',
    PROCUREMENT_PENDING_AWARDS: 'L2.Procurement.PendingAwards',
    PROCUREMENT_THRESHOLD: 'L2.Procurement.Threshold',

    // Alarm management (ISA-18.2)
    ALARMS_TOTAL: 'L2.Alarms.Total',
    ALARMS_CRITICAL: 'L2.Alarms.Critical',
    ALARMS_WARNING: 'L2.Alarms.Warning',
    ALARMS_UNACKNOWLEDGED: 'L2.Alarms.Unacknowledged',

    // Process state
    PROCESS_MODE: 'L2.Process.Mode',
    PROCESS_STATE: 'L2.Process.State',
    PROCESS_HEALTH: 'L2.Process.Health'
  };

  /**
   * Process modes (ISA-88)
   */
  static MODES = {
    PRODUCTION: 'PRODUCTION',
    MAINTENANCE: 'MAINTENANCE',
    MANUAL: 'MANUAL',
    AUDIT: 'AUDIT',
    TRAINING: 'TRAINING'
  };

  /**
   * Process states (PackML)
   */
  static STATES = {
    STOPPED: 'STOPPED',
    IDLE: 'IDLE',
    STARTING: 'STARTING',
    EXECUTE: 'EXECUTE',
    COMPLETING: 'COMPLETING',
    COMPLETE: 'COMPLETE',
    HOLDING: 'HOLDING',
    HELD: 'HELD',
    SUSPENDING: 'SUSPENDING',
    SUSPENDED: 'SUSPENDED',
    ABORTING: 'ABORTING',
    ABORTED: 'ABORTED'
  };

  get(tagPath) {
    return this.cache.get(tagPath);
  }

  set(tagPath, value) {
    const oldValue = this.cache.get(tagPath);
    this.cache.set(tagPath, value);
    this._notifySubscribers(tagPath, value, oldValue);
  }

  subscribe(tagPath, callback) {
    if (!this.subscriptions.has(tagPath)) {
      this.subscriptions.set(tagPath, new Set());
    }
    this.subscriptions.get(tagPath).add(callback);

    if (this.cache.has(tagPath)) {
      callback(this.cache.get(tagPath), undefined);
    }

    return () => this.subscriptions.get(tagPath).delete(callback);
  }

  /**
   * Raise an alarm
   * @param {string} id - Alarm ID
   * @param {string} severity - CRITICAL, WARNING, INFO
   * @param {string} message - Alarm message
   * @param {object} context - Additional context
   */
  raiseAlarm(id, severity, message, context = {}) {
    const alarm = {
      id,
      severity,
      message,
      context,
      raised: new Date(),
      acknowledged: false
    };
    this.alarms.set(id, alarm);
    this._updateAlarmCounters();
    return alarm;
  }

  /**
   * Acknowledge an alarm
   */
  acknowledgeAlarm(id, by) {
    const alarm = this.alarms.get(id);
    if (alarm) {
      alarm.acknowledged = true;
      alarm.acknowledgedBy = by;
      alarm.acknowledgedAt = new Date();
      this._updateAlarmCounters();
    }
  }

  /**
   * Clear an alarm
   */
  clearAlarm(id) {
    this.alarms.delete(id);
    this._updateAlarmCounters();
  }

  /**
   * Get active alarms
   */
  getActiveAlarms(severity = null) {
    const results = [];
    for (const [id, alarm] of this.alarms) {
      if (!severity || alarm.severity === severity) {
        results.push(alarm);
      }
    }
    return results;
  }

  /**
   * Initialize with defaults
   */
  initialize() {
    this.set(L2TagProvider.TAGS.BUDGET_FISCAL_YEAR, new Date().getFullYear());
    this.set(L2TagProvider.TAGS.BUDGET_TOTAL, 0);
    this.set(L2TagProvider.TAGS.BUDGET_SPENT, 0);
    this.set(L2TagProvider.TAGS.BUDGET_REMAINING, 0);
    this.set(L2TagProvider.TAGS.BUDGET_PERCENT_USED, 0);

    this.set(L2TagProvider.TAGS.PROCESS_MODE, L2TagProvider.MODES.PRODUCTION);
    this.set(L2TagProvider.TAGS.PROCESS_STATE, L2TagProvider.STATES.IDLE);
    this.set(L2TagProvider.TAGS.PROCESS_HEALTH, 100);

    this.set(L2TagProvider.TAGS.ALARMS_TOTAL, 0);
    this.set(L2TagProvider.TAGS.ALARMS_CRITICAL, 0);
    this.set(L2TagProvider.TAGS.ALARMS_WARNING, 0);
    this.set(L2TagProvider.TAGS.ALARMS_UNACKNOWLEDGED, 0);
  }

  _updateAlarmCounters() {
    const alarms = Array.from(this.alarms.values());
    this.set(L2TagProvider.TAGS.ALARMS_TOTAL, alarms.length);
    this.set(L2TagProvider.TAGS.ALARMS_CRITICAL,
      alarms.filter(a => a.severity === 'CRITICAL').length);
    this.set(L2TagProvider.TAGS.ALARMS_WARNING,
      alarms.filter(a => a.severity === 'WARNING').length);
    this.set(L2TagProvider.TAGS.ALARMS_UNACKNOWLEDGED,
      alarms.filter(a => !a.acknowledged).length);
  }

  _notifySubscribers(tagPath, newValue, oldValue) {
    const subs = this.subscriptions.get(tagPath);
    if (subs) {
      subs.forEach(cb => cb(newValue, oldValue));
    }
  }
}

export const l2TagProvider = new L2TagProvider();
l2TagProvider.initialize();

export default l2TagProvider;
