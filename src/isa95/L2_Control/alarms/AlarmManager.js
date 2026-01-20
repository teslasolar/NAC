/**
 * ISA-18.2 Alarm Management System
 * Comprehensive alarm lifecycle for county fiscal compliance
 *
 * ISA-18.2 Core Concepts:
 * - Alarm Rationalization (is this alarm necessary?)
 * - Alarm Priority (how urgent?)
 * - Alarm State Model (clear, unack, ack, etc.)
 * - Shelving & Suppression (temporary disable)
 * - Metrics & KPIs (alarm flood, stale alarms)
 */

// ISA-18.2 Alarm Priority Levels
const AlarmPriority = {
  EMERGENCY: 1,    // Immediate action required - potential legal violation
  HIGH: 2,         // Prompt action required - significant financial risk
  MEDIUM: 3,       // Timely action required - procedural deviation
  LOW: 4,          // Awareness - minor deviation
  DIAGNOSTIC: 5,   // Information only - system status
};

const PriorityConfig = {
  [AlarmPriority.EMERGENCY]: {
    name: 'Emergency',
    color: '#dc2626',
    responseTime: '< 5 min',
    sound: true,
    escalation: true,
  },
  [AlarmPriority.HIGH]: {
    name: 'High',
    color: '#ea580c',
    responseTime: '< 30 min',
    sound: true,
    escalation: true,
  },
  [AlarmPriority.MEDIUM]: {
    name: 'Medium',
    color: '#ca8a04',
    responseTime: '< 4 hours',
    sound: false,
    escalation: false,
  },
  [AlarmPriority.LOW]: {
    name: 'Low',
    color: '#2563eb',
    responseTime: '< 24 hours',
    sound: false,
    escalation: false,
  },
  [AlarmPriority.DIAGNOSTIC]: {
    name: 'Diagnostic',
    color: '#6b7280',
    responseTime: 'N/A',
    sound: false,
    escalation: false,
  },
};

// ISA-18.2 Alarm States
const AlarmState = {
  NORMAL: 'normal',              // Condition cleared, acknowledged
  UNACK_ACTIVE: 'unack_active',  // Alarm active, not acknowledged
  ACK_ACTIVE: 'ack_active',      // Alarm active, acknowledged
  UNACK_CLEAR: 'unack_clear',    // Condition cleared, not acknowledged
  SHELVED: 'shelved',            // Temporarily suppressed
  SUPPRESSED: 'suppressed',      // Suppressed by design
  OUT_OF_SERVICE: 'oos',         // Disabled for maintenance
};

// Alarm Types for County Operations
const AlarmType = {
  // Financial Alarms
  BUDGET_OVERSPEND: 'budget_overspend',
  UNAUTHORIZED_EXPENSE: 'unauthorized_expense',
  DUPLICATE_CLAIM: 'duplicate_claim',
  MISSING_DOCUMENTATION: 'missing_documentation',
  RECONCILIATION_MISMATCH: 'reconciliation_mismatch',

  // Compliance Alarms
  AUDIT_OVERDUE: 'audit_overdue',
  FINDING_UNRESOLVED: 'finding_unresolved',
  DEADLINE_APPROACHING: 'deadline_approaching',
  STATUTORY_VIOLATION: 'statutory_violation',

  // Process Alarms
  APPROVAL_PENDING: 'approval_pending',
  WORKFLOW_STALLED: 'workflow_stalled',
  BATCH_FAILED: 'batch_failed',

  // Security Alarms
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  ANOMALY_DETECTED: 'anomaly_detected',
  THRESHOLD_EXCEEDED: 'threshold_exceeded',
};

class Alarm {
  constructor(id, type, priority, source, message) {
    this.id = id;
    this.type = type;
    this.priority = priority;
    this.source = source;
    this.message = message;
    this.state = AlarmState.UNACK_ACTIVE;
    this.timestamp = new Date().toISOString();
    this.ackTimestamp = null;
    this.ackUser = null;
    this.clearTimestamp = null;
    this.shelvedUntil = null;
    this.shelvedBy = null;
    this.shelvedReason = null;
    this.notes = [];
    this.relatedStatute = null;
    this.value = null;
    this.limit = null;
  }

  acknowledge(user) {
    if (this.state === AlarmState.UNACK_ACTIVE) {
      this.state = AlarmState.ACK_ACTIVE;
      this.ackTimestamp = new Date().toISOString();
      this.ackUser = user;
      return true;
    }
    if (this.state === AlarmState.UNACK_CLEAR) {
      this.state = AlarmState.NORMAL;
      this.ackTimestamp = new Date().toISOString();
      this.ackUser = user;
      return true;
    }
    return false;
  }

  clear() {
    if (this.state === AlarmState.UNACK_ACTIVE) {
      this.state = AlarmState.UNACK_CLEAR;
      this.clearTimestamp = new Date().toISOString();
      return true;
    }
    if (this.state === AlarmState.ACK_ACTIVE) {
      this.state = AlarmState.NORMAL;
      this.clearTimestamp = new Date().toISOString();
      return true;
    }
    return false;
  }

  shelve(user, duration, reason) {
    this.state = AlarmState.SHELVED;
    this.shelvedUntil = new Date(Date.now() + duration).toISOString();
    this.shelvedBy = user;
    this.shelvedReason = reason;
    return true;
  }

  unshelve() {
    if (this.state === AlarmState.SHELVED) {
      this.state = this.clearTimestamp ? AlarmState.UNACK_CLEAR : AlarmState.UNACK_ACTIVE;
      this.shelvedUntil = null;
      return true;
    }
    return false;
  }

  addNote(user, text) {
    this.notes.push({
      timestamp: new Date().toISOString(),
      user,
      text,
    });
  }
}

class AlarmManager {
  constructor() {
    this.alarms = new Map();
    this.history = [];
    this.alarmCount = 0;
    this.config = {
      maxShelveTime: 24 * 60 * 60 * 1000, // 24 hours
      staleAlarmThreshold: 7 * 24 * 60 * 60 * 1000, // 7 days
      floodThreshold: 10, // alarms per minute
    };
  }

  raise(type, priority, source, message, options = {}) {
    const id = `ALM-${++this.alarmCount}-${Date.now()}`;
    const alarm = new Alarm(id, type, priority, source, message);

    if (options.statute) alarm.relatedStatute = options.statute;
    if (options.value !== undefined) alarm.value = options.value;
    if (options.limit !== undefined) alarm.limit = options.limit;

    this.alarms.set(id, alarm);
    this.log('ALARM_RAISED', alarm);

    return alarm;
  }

  acknowledge(alarmId, user) {
    const alarm = this.alarms.get(alarmId);
    if (!alarm) return false;

    const result = alarm.acknowledge(user);
    if (result) this.log('ALARM_ACK', alarm, { user });
    return result;
  }

  clear(alarmId) {
    const alarm = this.alarms.get(alarmId);
    if (!alarm) return false;

    const result = alarm.clear();
    if (result) this.log('ALARM_CLEAR', alarm);

    // Archive if fully cleared
    if (alarm.state === AlarmState.NORMAL) {
      this.archive(alarmId);
    }
    return result;
  }

  shelve(alarmId, user, duration, reason) {
    const alarm = this.alarms.get(alarmId);
    if (!alarm) return false;

    const maxDuration = Math.min(duration, this.config.maxShelveTime);
    alarm.shelve(user, maxDuration, reason);
    this.log('ALARM_SHELVED', alarm, { user, duration: maxDuration, reason });
    return true;
  }

  archive(alarmId) {
    const alarm = this.alarms.get(alarmId);
    if (alarm) {
      this.history.push({ ...alarm, archivedAt: new Date().toISOString() });
      this.alarms.delete(alarmId);
    }
  }

  getActive() {
    return Array.from(this.alarms.values()).filter(
      a => a.state !== AlarmState.NORMAL && a.state !== AlarmState.SHELVED
    );
  }

  getByPriority(priority) {
    return this.getActive().filter(a => a.priority === priority);
  }

  getBySource(source) {
    return this.getActive().filter(a => a.source === source);
  }

  getUnacknowledged() {
    return Array.from(this.alarms.values()).filter(
      a => a.state === AlarmState.UNACK_ACTIVE || a.state === AlarmState.UNACK_CLEAR
    );
  }

  getShelved() {
    return Array.from(this.alarms.values()).filter(
      a => a.state === AlarmState.SHELVED
    );
  }

  // ISA-18.2 Alarm Metrics
  getMetrics() {
    const active = this.getActive();
    const now = Date.now();

    return {
      totalActive: active.length,
      byPriority: {
        emergency: active.filter(a => a.priority === AlarmPriority.EMERGENCY).length,
        high: active.filter(a => a.priority === AlarmPriority.HIGH).length,
        medium: active.filter(a => a.priority === AlarmPriority.MEDIUM).length,
        low: active.filter(a => a.priority === AlarmPriority.LOW).length,
      },
      unacknowledged: this.getUnacknowledged().length,
      shelved: this.getShelved().length,
      staleAlarms: active.filter(a =>
        now - new Date(a.timestamp).getTime() > this.config.staleAlarmThreshold
      ).length,
      historyCount: this.history.length,
    };
  }

  log(event, alarm, extra = {}) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      alarmId: alarm.id,
      type: alarm.type,
      priority: alarm.priority,
      source: alarm.source,
      state: alarm.state,
      ...extra,
    }));
  }
}

// Pre-configured County Alarms
const CountyAlarms = {
  budgetOverspend: (source, amount, budget) =>
    ['budget_overspend', AlarmPriority.HIGH, source,
     `Budget overspend: $${amount.toLocaleString()} exceeds allocation of $${budget.toLocaleString()}`,
     { statute: '16 Pa.C.S. §1705', value: amount, limit: budget }],

  duplicateClaim: (source, claimId, originalId) =>
    ['duplicate_claim', AlarmPriority.MEDIUM, source,
     `Potential duplicate claim: ${claimId} matches ${originalId}`,
     { statute: '16 Pa.C.S. §1730' }],

  auditOverdue: (source, officer, dueDate) =>
    ['audit_overdue', AlarmPriority.HIGH, source,
     `Audit overdue: ${officer} was due ${dueDate}`,
     { statute: '16 Pa.C.S. §1720' }],

  statutoryViolation: (source, statute, description) =>
    ['statutory_violation', AlarmPriority.EMERGENCY, source,
     `Statutory violation: ${statute} - ${description}`,
     { statute }],
};

export {
  AlarmPriority,
  PriorityConfig,
  AlarmState,
  AlarmType,
  Alarm,
  AlarmManager,
  CountyAlarms,
};
