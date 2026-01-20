/**
 * OEE Module Index - Overall Equipment Effectiveness
 *
 * Manufacturing efficiency metrics adapted for county government operations.
 * Based on Nakajima's TPM methodology and industry OEE standards.
 *
 * OEE = Availability × Performance × Quality
 *
 * @module L3_MES/oee
 * @see https://www.oee.com/
 * @see https://www.leanproduction.com/oee/
 */

export {
  OEECalculator,
  OEEScore,
  OEERating,
  getOEERating,
  getOEEColor
} from './OEECalculator.js';

export {
  LossCategory,
  LossAffects,
  GovernmentLosses,
  LossTracker
} from './SixBigLosses.js';

export {
  OfficeBenchmarks,
  getBenchmark,
  compareToBenchmark,
  getCycleTimeBenchmark,
  getOfficesByTargetOEE,
  generateReportCard
} from './OfficeBenchmarks.js';

export {
  OEEAssessmentService,
  OfficeAssessment,
  AssessmentPeriod,
  createOEEAssessmentService
} from './OEEAssessment.js';
