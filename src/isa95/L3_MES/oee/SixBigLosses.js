/**
 * Six Big Losses - Government Operations Adaptation
 *
 * The Six Big Losses are the most common causes of efficiency loss
 * in manufacturing, adapted here for county government operations.
 *
 * Original categories (Nakajima, 1982):
 * 1. Equipment Failures (Breakdowns)
 * 2. Setup and Adjustments
 * 3. Idling and Minor Stoppages
 * 4. Reduced Speed
 * 5. Process Defects
 * 6. Reduced Yield (Startup losses)
 *
 * @module L3_MES/oee/SixBigLosses
 * @see https://www.leanproduction.com/oee/
 */

/**
 * Loss categories mapped to government operations
 */
export const LossCategory = {
  // Availability Losses
  SYSTEM_FAILURES: 'system_failures',
  SETUP_TRANSITIONS: 'setup_transitions',

  // Performance Losses
  MINOR_STOPPAGES: 'minor_stoppages',
  REDUCED_SPEED: 'reduced_speed',

  // Quality Losses
  PROCESS_DEFECTS: 'process_defects',
  STARTUP_LOSSES: 'startup_losses'
};

/**
 * OEE Component affected by each loss
 */
export const LossAffects = {
  [LossCategory.SYSTEM_FAILURES]: 'availability',
  [LossCategory.SETUP_TRANSITIONS]: 'availability',
  [LossCategory.MINOR_STOPPAGES]: 'performance',
  [LossCategory.REDUCED_SPEED]: 'performance',
  [LossCategory.PROCESS_DEFECTS]: 'quality',
  [LossCategory.STARTUP_LOSSES]: 'quality'
};

/**
 * Six Big Losses adapted for government offices
 */
export const GovernmentLosses = {
  /**
   * 1. System Failures (Availability Loss)
   * Manufacturing: Equipment breakdowns
   * Government: System outages, network failures, facility closures
   */
  [LossCategory.SYSTEM_FAILURES]: {
    name: 'System Failures',
    description: 'Unplanned downtime due to IT systems, network, or facility issues',
    affects: 'availability',
    examples: [
      'Court management system outage',
      'Network connectivity failure',
      'Building HVAC emergency',
      'Security system lockdown',
      'Database server crash',
      'Power outage'
    ],
    metrics: ['downtime_minutes', 'incidents_count', 'mttr_minutes'],
    mitigations: [
      'Implement redundant systems',
      'Regular preventive maintenance',
      'Disaster recovery planning',
      'Staff training on manual procedures'
    ]
  },

  /**
   * 2. Setup and Transitions (Availability Loss)
   * Manufacturing: Changeovers, setup adjustments
   * Government: Staff transitions, system updates, training sessions
   */
  [LossCategory.SETUP_TRANSITIONS]: {
    name: 'Setup & Transitions',
    description: 'Planned downtime for transitions, updates, and changeovers',
    affects: 'availability',
    examples: [
      'New staff onboarding',
      'System software updates',
      'Mandatory training sessions',
      'Shift changeovers',
      'Departmental meetings',
      'Election preparation'
    ],
    metrics: ['transition_minutes', 'setup_count', 'training_hours'],
    mitigations: [
      'Schedule updates during off-hours',
      'Streamline onboarding process',
      'Reduce mandatory meeting time',
      'Implement rolling shifts'
    ]
  },

  /**
   * 3. Minor Stoppages (Performance Loss)
   * Manufacturing: Idling, small interruptions
   * Government: Customer interruptions, phone calls, walk-ins
   */
  [LossCategory.MINOR_STOPPAGES]: {
    name: 'Minor Stoppages',
    description: 'Brief interruptions that disrupt workflow continuity',
    affects: 'performance',
    examples: [
      'Walk-in customer inquiries',
      'Non-case-related phone calls',
      'Email/message notifications',
      'Printer/copier jams',
      'Missing document searches',
      'Colleague consultations'
    ],
    metrics: ['interruption_count', 'avg_interruption_minutes', 'context_switches'],
    mitigations: [
      'Designated inquiry hours',
      'Queue management system',
      'Document organization',
      'Batch processing periods'
    ]
  },

  /**
   * 4. Reduced Speed (Performance Loss)
   * Manufacturing: Running below optimal speed
   * Government: Processing slower than capacity
   */
  [LossCategory.REDUCED_SPEED]: {
    name: 'Reduced Speed',
    description: 'Processing at less than optimal speed due to various factors',
    affects: 'performance',
    examples: [
      'Complex cases requiring research',
      'Inexperienced staff processing',
      'Outdated software interfaces',
      'Manual data entry requirements',
      'Inter-department coordination',
      'Waiting for approvals'
    ],
    metrics: ['actual_cycle_time', 'target_cycle_time', 'speed_ratio'],
    mitigations: [
      'Process automation',
      'Staff skill development',
      'System modernization',
      'Streamlined approval chains'
    ]
  },

  /**
   * 5. Process Defects (Quality Loss)
   * Manufacturing: Defective products, scrap
   * Government: Errors requiring corrections, appeals, rework
   */
  [LossCategory.PROCESS_DEFECTS]: {
    name: 'Process Defects',
    description: 'Work that fails quality standards and requires rework',
    affects: 'quality',
    examples: [
      'Data entry errors',
      'Incorrect fee calculations',
      'Missing required information',
      'Procedural violations',
      'Document filing errors',
      'Legal compliance issues'
    ],
    metrics: ['defect_count', 'rework_count', 'appeal_rate', 'correction_rate'],
    mitigations: [
      'Input validation systems',
      'Checklists and templates',
      'Peer review process',
      'Staff training on regulations'
    ]
  },

  /**
   * 6. Startup Losses (Quality Loss)
   * Manufacturing: Startup rejects until stable production
   * Government: New process/system learning curve issues
   */
  [LossCategory.STARTUP_LOSSES]: {
    name: 'Startup Losses',
    description: 'Reduced quality during new process or system rollouts',
    affects: 'quality',
    examples: [
      'New employee learning curve',
      'Post-update system bugs',
      'New regulation implementation',
      'Process change adaptation',
      'Seasonal procedure changes',
      'New form version rollout'
    ],
    metrics: ['startup_defects', 'learning_curve_days', 'stabilization_time'],
    mitigations: [
      'Comprehensive training programs',
      'Gradual rollout strategy',
      'Mentorship pairing',
      'Extended testing periods'
    ]
  }
};

/**
 * Track losses for an office
 */
export class LossTracker {
  constructor(officeId) {
    this.officeId = officeId;
    this.losses = new Map();
    this.periodStart = new Date();

    // Initialize all categories
    for (const category of Object.values(LossCategory)) {
      this.losses.set(category, {
        count: 0,
        totalMinutes: 0,
        items: []
      });
    }
  }

  /**
   * Record a loss event
   */
  recordLoss(category, durationMinutes, description = '') {
    const loss = this.losses.get(category);
    if (!loss) return;

    loss.count++;
    loss.totalMinutes += durationMinutes;
    loss.items.push({
      timestamp: new Date().toISOString(),
      duration: durationMinutes,
      description
    });
  }

  /**
   * Get total availability losses (minutes)
   */
  getAvailabilityLosses() {
    const failures = this.losses.get(LossCategory.SYSTEM_FAILURES);
    const transitions = this.losses.get(LossCategory.SETUP_TRANSITIONS);
    return (failures?.totalMinutes || 0) + (transitions?.totalMinutes || 0);
  }

  /**
   * Get total performance losses (as ratio)
   * @param {number} totalRunTime - Total run time in minutes
   */
  getPerformanceLossRatio(totalRunTime) {
    if (totalRunTime <= 0) return 0;
    const stoppages = this.losses.get(LossCategory.MINOR_STOPPAGES);
    const slowdowns = this.losses.get(LossCategory.REDUCED_SPEED);
    const lostTime = (stoppages?.totalMinutes || 0) + (slowdowns?.totalMinutes || 0);
    return lostTime / totalRunTime;
  }

  /**
   * Get total quality losses (as count)
   */
  getQualityLosses() {
    const defects = this.losses.get(LossCategory.PROCESS_DEFECTS);
    const startup = this.losses.get(LossCategory.STARTUP_LOSSES);
    return (defects?.count || 0) + (startup?.count || 0);
  }

  /**
   * Get summary of all losses
   */
  getSummary() {
    const summary = {
      officeId: this.officeId,
      periodStart: this.periodStart.toISOString(),
      periodEnd: new Date().toISOString(),
      byCategory: {},
      totals: {
        availabilityLossMinutes: 0,
        performanceLossMinutes: 0,
        qualityLossCount: 0
      }
    };

    for (const [category, data] of this.losses) {
      const def = GovernmentLosses[category];
      summary.byCategory[category] = {
        name: def.name,
        affects: def.affects,
        count: data.count,
        totalMinutes: data.totalMinutes
      };

      if (def.affects === 'availability') {
        summary.totals.availabilityLossMinutes += data.totalMinutes;
      } else if (def.affects === 'performance') {
        summary.totals.performanceLossMinutes += data.totalMinutes;
      } else if (def.affects === 'quality') {
        summary.totals.qualityLossCount += data.count;
      }
    }

    return summary;
  }

  /**
   * Reset tracker for new period
   */
  reset() {
    for (const loss of this.losses.values()) {
      loss.count = 0;
      loss.totalMinutes = 0;
      loss.items = [];
    }
    this.periodStart = new Date();
  }
}

export default {
  LossCategory,
  LossAffects,
  GovernmentLosses,
  LossTracker
};
