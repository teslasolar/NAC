/**
 * Alarm Management Module - ISA-18.2 Compliant
 *
 * Integrated alarm management for county government operations.
 * Provides alarm lifecycle management with workflow integration.
 *
 * @module L2_Control/alarms
 * @standard ISA-18.2
 */

export { default as AlarmManager } from './AlarmManager.js';
export { default as AlarmRationalization } from './AlarmRationalization.js';

/**
 * Alarm priority levels per ISA-18.2
 */
export const AlarmPriority = {
  EMERGENCY: 1,    // Immediate action required - safety/security
  HIGH: 2,         // Prompt action required - significant impact
  MEDIUM: 3,       // Timely action required - moderate impact
  LOW: 4,          // Awareness - minor impact
  DIAGNOSTIC: 5    // Information only - no action required
};

/**
 * Alarm states per ISA-18.2 state model
 */
export const AlarmState = {
  NORMAL: 'NORM',                    // Not in alarm
  UNACKNOWLEDGED: 'UNACK',           // In alarm, not acknowledged
  ACKNOWLEDGED: 'ACK',               // In alarm, acknowledged
  RETURNED_UNACK: 'RTN_UNACK',       // Returned to normal, not acknowledged
  SHELVED: 'SHELVED',                // Temporarily suppressed
  SUPPRESSED: 'SUPPRESSED',          // Suppressed by design
  OUT_OF_SERVICE: 'OOS'              // Disabled
};

/**
 * County-specific alarm types
 */
export const CountyAlarmTypes = {
  // Financial alarms
  BUDGET_OVERRUN: { priority: AlarmPriority.HIGH, category: 'financial' },
  BUDGET_WARNING: { priority: AlarmPriority.MEDIUM, category: 'financial' },
  CASH_VARIANCE: { priority: AlarmPriority.HIGH, category: 'financial' },
  DUPLICATE_PAYMENT: { priority: AlarmPriority.EMERGENCY, category: 'fraud' },

  // Compliance alarms
  AUDIT_FINDING: { priority: AlarmPriority.MEDIUM, category: 'compliance' },
  COMPLIANCE_BREACH: { priority: AlarmPriority.HIGH, category: 'compliance' },
  SLA_WARNING: { priority: AlarmPriority.MEDIUM, category: 'operations' },
  SLA_BREACH: { priority: AlarmPriority.HIGH, category: 'operations' },

  // Operational alarms
  HIGH_BACKLOG: { priority: AlarmPriority.MEDIUM, category: 'operations' },
  CRITICAL_BACKLOG: { priority: AlarmPriority.HIGH, category: 'operations' },
  STAFF_SHORTAGE: { priority: AlarmPriority.MEDIUM, category: 'operations' },
  SYSTEM_ERROR: { priority: AlarmPriority.HIGH, category: 'system' },

  // Security alarms
  UNAUTHORIZED_ACCESS: { priority: AlarmPriority.EMERGENCY, category: 'security' },
  FRAUD_INDICATOR: { priority: AlarmPriority.EMERGENCY, category: 'fraud' }
};

/**
 * Module information
 */
export const moduleInfo = {
  name: 'Alarm Management',
  version: '1.0.0',
  standard: 'ISA-18.2',
  priorities: Object.keys(AlarmPriority).length,
  states: Object.keys(AlarmState).length,
  alarmTypes: Object.keys(CountyAlarmTypes).length
};
