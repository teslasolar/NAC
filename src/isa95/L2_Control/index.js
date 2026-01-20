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

// Workflow and Rule engines
export {
  WorkflowEngine,
  WorkflowInstance,
  createWorkflowEngine
} from './engine/WorkflowEngine.js';

export {
  RuleEngine,
  ValidationResult,
  createRuleEngine
} from './engine/RuleEngine.js';

/**
 * Configuration paths
 */
export const ConfigPaths = {
  workflowRules: './config/workflow-rules.json',
  businessRules: './config/business-rules.json'
};

/**
 * Load control configuration
 */
export async function loadConfig(configName) {
  const path = ConfigPaths[configName];
  if (!path) {
    throw new Error(`Unknown config: ${configName}`);
  }
  const fs = await import('fs/promises');
  const { dirname, join } = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return JSON.parse(await fs.readFile(join(__dirname, path), 'utf8'));
}

/**
 * Module information
 */
export const moduleInfo = {
  name: 'L2 Control Layer',
  version: '2.0.0',
  standard: 'ISA-95 Level 2',
  description: 'Process control for county government operations',
  domains: ['audit', 'budget', 'payroll', 'procurement', 'alarms', 'workflows'],
  configPath: './config/',
  engines: ['WorkflowEngine', 'RuleEngine'],
  processControllers: ['ClaimProcessorUnit', 'AuditExecutorUnit', 'BudgetCycleUnit', 'BoardMeetingUnit']
};
