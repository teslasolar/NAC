/**
 * L2 Control Layer - Process Control
 *
 * ISA-95 Level 2: Manufacturing Operations Management
 * Applied to county government as process control for:
 * - Audit processes
 * - Budget processes
 * - Payroll processes
 * - Procurement processes
 * - Alarm management (ISA-18.2)
 * - Workflow orchestration
 *
 * @module L2_Control
 * @standard ISA-95, ISA-18.2
 */

// Audit control
export { default as AuditPlan } from './audit/AuditPlan.js';
export { default as AuditFindings } from './audit/AuditFindings.js';
export { default as InternalControls } from './audit/InternalControls.js';
export { default as RiskAssessment } from './audit/RiskAssessment.js';
export { default as SamplingMethod } from './audit/SamplingMethod.js';

// Budget control
export { default as AnnualBudget } from './budget/AnnualBudget.js';
export { default as BudgetCycle } from './budget/BudgetCycle.js';
export { default as BudgetAmendment } from './budget/BudgetAmendment.js';
export { default as Appropriation } from './budget/Appropriation.js';
export { default as LineItemTransfer } from './budget/LineItemTransfer.js';

// Payroll control
export { default as PayCycle } from './payroll/PayCycle.js';
export { default as Deductions } from './payroll/Deductions.js';
export { default as TaxWithholding } from './payroll/TaxWithholding.js';

// Procurement control
export { default as BidThresholds } from './procurement/BidThresholds.js';
export { default as ContractReview } from './procurement/ContractReview.js';

// Alarm management (ISA-18.2)
export * from './alarms/index.js';

// Process controllers (PackML-based)
export {
  ClaimProcessorUnit,
  AuditExecutorUnit,
  BudgetCycleUnit,
  BoardMeetingUnit
} from './engine/ProcessControllers.js';

/**
 * Module information
 */
export const moduleInfo = {
  name: 'L2 Control Layer',
  version: '1.0.0',
  standard: 'ISA-95 Level 2',
  domains: ['audit', 'budget', 'payroll', 'procurement', 'alarms'],
  configPath: './config/'
};
