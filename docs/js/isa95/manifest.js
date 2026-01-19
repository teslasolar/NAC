// Auto-generated ISA-95 structure manifest
// Generated: 2026-01-19T22:56:54.271Z
// Modules: 56 | Schemas: 5

export const STRUCTURE = {
  "L0_Data": {
    "enums": [
      "AuditType.js",
      "ClaimStatus.js",
      "Department.js",
      "FundType.js"
    ],
    "schemas": [],
    "types": [
      "Account.js",
      "CodeSection.js",
      "DateRange.js",
      "FiscalYear.js",
      "LegalDefinitions.js",
      "Money.js",
      "Person.js"
    ]
  },
  "L1_Transactions": {
    "audits": [
      "AuditEngagement.js",
      "Finding.js",
      "WorkPaper.js"
    ],
    "claims": [
      "Claim.js",
      "ClaimApproval.js"
    ],
    "payments": [
      "DirectDeposit.js",
      "Disbursement.js",
      "Receipt.js",
      "Warrant.js"
    ]
  },
  "L2_Control": {
    "audit": [
      "AuditFindings.js",
      "AuditPlan.js",
      "InternalControls.js",
      "RiskAssessment.js",
      "SamplingMethod.js"
    ],
    "budget": [
      "AnnualBudget.js",
      "Appropriation.js",
      "BudgetAmendment.js",
      "BudgetCycle.js",
      "LineItemTransfer.js"
    ],
    "payroll": [
      "Deductions.js",
      "PayCycle.js",
      "TaxWithholding.js"
    ],
    "procurement": [
      "BidThresholds.js",
      "ContractReview.js"
    ]
  },
  "L3_Operations": {
    "admin": [
      "RecordsCustody.js"
    ],
    "controller": [
      "AuditAuthority.js",
      "AuditJurisdiction.js",
      "BoardMemberships.js",
      "BudgetCertification.js",
      "DeputyController.js",
      "Independence.js",
      "SalaryBoard.js",
      "StatutoryDuties.js"
    ],
    "fiscal": [
      "AccountsPayable.js",
      "PayrollOps.js"
    ],
    "governance": [
      "CouncilInterface.js",
      "ElectedOfficers.js",
      "JudicialReporting.js"
    ]
  },
  "L4_Enterprise": {
    "policy": [
      "Ethics.js",
      "FiscalPolicy.js",
      "InternalControl.js"
    ],
    "reporting": [
      "ACFR.js",
      "AnnualReport.js"
    ],
    "strategy": [
      "AuditStrategy.js",
      "Transparency.js"
    ]
  }
};

export const STATS = {
  modules: 56,
  schemas: 5,
  paCodeCoverage: {"implemented":52,"partial":48,"not_started":20}
};

export const LEVELS = {
  L0_Data: { name: 'Data', icon: '📊', color: '#64748b' },
  L1_Transactions: { name: 'Transactions', icon: '📝', color: '#3b82f6' },
  L2_Control: { name: 'Control', icon: '⚙️', color: '#10b981' },
  L3_Operations: { name: 'Operations', icon: '🏢', color: '#f59e0b' },
  L4_Enterprise: { name: 'Enterprise', icon: '🏛️', color: '#8b5cf6' }
};
