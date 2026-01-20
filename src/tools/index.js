/**
 * NAC Controller Tools
 *
 * Comprehensive toolkit for Northampton County Controller operations
 */

const { DuplicateDetector } = require('./DuplicateDetector');
const { BudgetDashboard } = require('./BudgetDashboard');
const { AuditWorkpapers } = require('./AuditWorkpapers');
const { ContractAnalyzer } = require('./ContractAnalyzer');
const { ClaimsProcessor } = require('./ClaimsProcessor');
const { ReportGenerator } = require('./ReportGenerator');

module.exports = {
  // Detection & Analysis
  DuplicateDetector,
  BudgetDashboard,
  ContractAnalyzer,

  // Audit & Compliance
  AuditWorkpapers,
  ClaimsProcessor,

  // Reporting
  ReportGenerator,

  // Quick factory methods
  createDuplicateDetector: (opts) => new DuplicateDetector(opts),
  createBudgetDashboard: (budget) => new BudgetDashboard(budget),
  createAudit: (info) => new AuditWorkpapers(info),
  createContractAnalyzer: () => new ContractAnalyzer(),
  createClaimsProcessor: (opts) => new ClaimsProcessor(opts),
  createReportGenerator: (data) => new ReportGenerator(data),
};
