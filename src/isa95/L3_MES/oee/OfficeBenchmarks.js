/**
 * Office Benchmarks - OEE targets for county row officers
 *
 * Establishes benchmark metrics for each row officer office based on:
 * - Industry standards for government services
 * - Office-specific workload characteristics
 * - Regulatory requirements and SLAs
 *
 * @module L3_MES/oee/OfficeBenchmarks
 */

import { OEERating } from './OEECalculator.js';

/**
 * Benchmark targets by office type
 */
export const OfficeBenchmarks = {
  /**
   * Sheriff's Office
   * High-volume, time-sensitive operations (warrants, process service)
   */
  sheriff: {
    name: "Sheriff's Office",
    targetOEE: 0.78,
    targets: {
      availability: 0.90,  // 24/7 operations reduce target
      performance: 0.88,   // Field operations variable
      quality: 0.98        // High accuracy required
    },
    cycleTimeMinutes: {
      'process-service': 45,
      'warrant-execution': 60,
      'civil-process': 30,
      'inmate-processing': 20
    },
    slaHours: {
      urgentWarrant: 4,
      civilProcess: 72,
      subpoena: 48
    },
    keyMetrics: [
      'warrants_served_rate',
      'process_service_time',
      'civil_paper_return_rate'
    ]
  },

  /**
   * Treasurer's Office
   * Financial precision critical, moderate volume
   */
  treasurer: {
    name: "County Treasurer",
    targetOEE: 0.85,
    targets: {
      availability: 0.95,  // Standard office hours
      performance: 0.90,   // Steady transaction flow
      quality: 0.995       // Financial accuracy critical
    },
    cycleTimeMinutes: {
      'cash-receipt': 5,
      'tax-payment': 8,
      'investment-transaction': 30,
      'reconciliation': 120
    },
    slaHours: {
      depositPosting: 24,
      taxRefund: 720,  // 30 days
      reportGeneration: 8
    },
    keyMetrics: [
      'deposit_accuracy_rate',
      'reconciliation_variance',
      'investment_yield'
    ]
  },

  /**
   * Coroner's Office
   * Unpredictable workload, quality paramount
   */
  coroner: {
    name: "Coroner's Office",
    targetOEE: 0.72,
    targets: {
      availability: 0.95,  // 24/7 on-call
      performance: 0.78,   // Case complexity varies
      quality: 0.97        // Legal/medical accuracy
    },
    cycleTimeMinutes: {
      'death-investigation': 180,
      'autopsy': 240,
      'cremation-permit': 15,
      'death-certificate': 30
    },
    slaHours: {
      sceneResponse: 1,
      deathCertificate: 72,
      cremationPermit: 24
    },
    keyMetrics: [
      'response_time_minutes',
      'autopsy_completion_rate',
      'certificate_accuracy'
    ]
  },

  /**
   * District Attorney's Office
   * Complex cases, high quality requirements
   */
  'district-attorney': {
    name: "District Attorney",
    targetOEE: 0.70,
    targets: {
      availability: 0.92,  // Court schedules
      performance: 0.78,   // Case complexity varies
      quality: 0.97        // Legal accuracy critical
    },
    cycleTimeMinutes: {
      'case-review': 120,
      'charging-decision': 480,
      'plea-preparation': 60,
      'trial-preparation': 2400
    },
    slaHours: {
      preliminaryHearing: 240,  // 10 days
      speedy trial: 4320,       // 180 days
      victimNotification: 48
    },
    keyMetrics: [
      'conviction_rate',
      'case_disposition_time',
      'speedy_trial_compliance'
    ]
  },

  /**
   * Recorder of Deeds
   * High volume, precision recording
   */
  'recorder-of-deeds': {
    name: "Recorder of Deeds",
    targetOEE: 0.82,
    targets: {
      availability: 0.95,  // Standard hours
      performance: 0.88,   // Batch processing efficient
      quality: 0.99        // Recording accuracy critical
    },
    cycleTimeMinutes: {
      'deed-recording': 10,
      'mortgage-recording': 12,
      'ucc-filing': 8,
      'plat-recording': 20
    },
    slaHours: {
      standardRecording: 48,
      expeditedRecording: 4,
      copyRequest: 24
    },
    keyMetrics: [
      'recording_turnaround',
      'indexing_accuracy',
      'search_completion_time'
    ]
  },

  /**
   * Register of Wills
   * Variable complexity, sensitive matters
   */
  'register-of-wills': {
    name: "Register of Wills",
    targetOEE: 0.75,
    targets: {
      availability: 0.93,  // Standard hours
      performance: 0.82,   // Estate complexity varies
      quality: 0.98        // Legal compliance
    },
    cycleTimeMinutes: {
      'marriage-license': 20,
      'will-probate': 60,
      'estate-administration': 180,
      'inheritance-tax': 120
    },
    slaHours: {
      marriageLicense: 1,
      willProbate: 240,  // 10 days
      inheritanceTax: 2160  // 90 days
    },
    keyMetrics: [
      'probate_completion_rate',
      'marriage_license_time',
      'tax_filing_accuracy'
    ]
  },

  /**
   * Clerk of Courts
   * High volume, court-dependent scheduling
   */
  'clerk-of-courts': {
    name: "Clerk of Courts",
    targetOEE: 0.76,
    targets: {
      availability: 0.90,  // Court calendar driven
      performance: 0.86,   // Batch filings efficient
      quality: 0.98        // Legal record accuracy
    },
    cycleTimeMinutes: {
      'case-filing': 15,
      'docket-entry': 5,
      'judgment-entry': 20,
      'certified-copy': 10
    },
    slaHours: {
      caseFiling: 24,
      docketEntry: 4,
      certifiedCopy: 48
    },
    keyMetrics: [
      'filing_turnaround',
      'docket_accuracy',
      'court_support_rating'
    ]
  },

  /**
   * Prothonotary
   * Civil court records, high precision
   */
  prothonotary: {
    name: "Prothonotary",
    targetOEE: 0.80,
    targets: {
      availability: 0.94,  // Standard court hours
      performance: 0.86,   // Steady civil filings
      quality: 0.99        // Legal record integrity
    },
    cycleTimeMinutes: {
      'civil-filing': 12,
      'judgment-entry': 15,
      'lien-filing': 10,
      'passport-application': 25
    },
    slaHours: {
      civilFiling: 24,
      judgmentEntry: 48,
      lienFiling: 24
    },
    keyMetrics: [
      'civil_filing_accuracy',
      'judgment_entry_time',
      'lien_search_time'
    ]
  },

  /**
   * County Controller
   * Fiscal oversight, audit, payroll - accuracy and timeliness critical
   * Current: Tara Zrinski (grades how well current Controller performs)
   */
  controller: {
    name: "County Controller",
    targetOEE: 0.83,
    targets: {
      availability: 0.95,  // Standard office hours
      performance: 0.88,   // Audit cycles and payroll deadlines
      quality: 0.995       // Financial accuracy paramount
    },
    cycleTimeMinutes: {
      'payroll-processing': 480,      // Full payroll cycle
      'voucher-audit': 15,            // Per voucher review
      'department-audit': 2400,       // Full department audit
      'warrant-approval': 30,         // Payment warrant review
      'board-report': 120             // Board meeting prep
    },
    slaHours: {
      payrollDeadline: 48,            // 2 days before pay date
      voucherReview: 24,              // Same-day turnaround target
      auditReport: 720,               // 30 days for audit completion
      annualReport: 2160              // 90 days after fiscal year
    },
    keyMetrics: [
      'payroll_accuracy_rate',
      'audit_finding_resolution',
      'voucher_rejection_rate',
      'board_attendance_rate',
      'report_timeliness'
    ],
    statutoryDuties: [
      '16 P.S. § 1701 - General powers',
      '16 P.S. § 1702 - Audit county accounts',
      '16 P.S. § 1703 - Examine accounts of officers',
      '16 P.S. § 1705 - Pre-audit all vouchers',
      '16 P.S. § 1706 - Countersign warrants',
      '16 P.S. § 1720 - Board memberships'
    ]
  }
};

/**
 * Get benchmark for an office
 * @param {string} officeId - Office identifier
 * @returns {Object|null} Benchmark configuration
 */
export function getBenchmark(officeId) {
  return OfficeBenchmarks[officeId] || null;
}

/**
 * Compare actual OEE to benchmark
 * @param {string} officeId - Office identifier
 * @param {Object} actualOEE - Actual OEE scores
 * @returns {Object} Comparison results
 */
export function compareToBenchmark(officeId, actualOEE) {
  const benchmark = getBenchmark(officeId);
  if (!benchmark) return null;

  const comparison = {
    officeId,
    officeName: benchmark.name,
    targetOEE: benchmark.targetOEE,
    actualOEE: actualOEE.oee,
    variance: actualOEE.oee - benchmark.targetOEE,
    meetingTarget: actualOEE.oee >= benchmark.targetOEE,
    components: {}
  };

  for (const component of ['availability', 'performance', 'quality']) {
    comparison.components[component] = {
      target: benchmark.targets[component],
      actual: actualOEE[component],
      variance: actualOEE[component] - benchmark.targets[component],
      meetingTarget: actualOEE[component] >= benchmark.targets[component]
    };
  }

  // Identify gaps
  comparison.gaps = Object.entries(comparison.components)
    .filter(([_, data]) => !data.meetingTarget)
    .map(([name, data]) => ({
      component: name,
      gap: Math.abs(data.variance),
      targetPct: Math.round(data.target * 100),
      actualPct: Math.round(data.actual * 100)
    }))
    .sort((a, b) => b.gap - a.gap);

  return comparison;
}

/**
 * Get cycle time benchmark for a process
 * @param {string} officeId - Office identifier
 * @param {string} processId - Process/line identifier
 * @returns {number|null} Target cycle time in minutes
 */
export function getCycleTimeBenchmark(officeId, processId) {
  const benchmark = getBenchmark(officeId);
  return benchmark?.cycleTimeMinutes?.[processId] || null;
}

/**
 * Get all offices ranked by target OEE
 * @returns {Array} Offices sorted by target OEE
 */
export function getOfficesByTargetOEE() {
  return Object.entries(OfficeBenchmarks)
    .map(([id, data]) => ({
      id,
      name: data.name,
      targetOEE: data.targetOEE,
      targets: data.targets
    }))
    .sort((a, b) => b.targetOEE - a.targetOEE);
}

/**
 * Generate OEE report card for all offices
 * @param {Map|Object} actualScores - Map of officeId -> OEE scores
 * @returns {Object} Report card with rankings and comparisons
 */
export function generateReportCard(actualScores) {
  const scores = actualScores instanceof Map
    ? Object.fromEntries(actualScores)
    : actualScores;

  const reportCard = {
    timestamp: new Date().toISOString(),
    summary: {
      averageOEE: 0,
      meetingTargets: 0,
      needsImprovement: 0,
      topPerformer: null,
      biggestGap: null
    },
    offices: []
  };

  let totalOEE = 0;
  let maxOEE = 0;
  let maxGap = 0;

  for (const [officeId, benchmark] of Object.entries(OfficeBenchmarks)) {
    const actual = scores[officeId];
    if (!actual) continue;

    const comparison = compareToBenchmark(officeId, actual);
    reportCard.offices.push(comparison);

    totalOEE += actual.oee;

    if (comparison.meetingTarget) {
      reportCard.summary.meetingTargets++;
    } else {
      reportCard.summary.needsImprovement++;
    }

    if (actual.oee > maxOEE) {
      maxOEE = actual.oee;
      reportCard.summary.topPerformer = officeId;
    }

    if (Math.abs(comparison.variance) > maxGap && comparison.variance < 0) {
      maxGap = Math.abs(comparison.variance);
      reportCard.summary.biggestGap = officeId;
    }
  }

  reportCard.summary.averageOEE = totalOEE / reportCard.offices.length;

  // Sort by actual OEE descending
  reportCard.offices.sort((a, b) => b.actualOEE - a.actualOEE);

  return reportCard;
}

export default OfficeBenchmarks;
