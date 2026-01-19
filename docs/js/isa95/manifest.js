// Auto-generated ISA-95 structure manifest
// Generated: 2026-01-19T22:53:00.956Z
// Modules: 41 | Schemas: 5

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
      "Warrant.js"
    ]
  },
  "L2_Control": {
    "audit": [
      "AuditPlan.js",
      "RiskAssessment.js",
      "SamplingMethod.js"
    ],
    "budget": [
      "Appropriation.js",
      "BudgetCycle.js"
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
      "AuditJurisdiction.js",
      "BoardMemberships.js",
      "StatutoryDuties.js"
    ],
    "fiscal": [
      "AccountsPayable.js",
      "PayrollOps.js"
    ],
    "governance": [
      "CouncilInterface.js",
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
  modules: 41,
  schemas: 5,
  paCodeCoverage: {"implemented":13,"partial":12,"not_started":25}
};

export const LEVELS = {
  L0_Data: { name: 'Data', icon: '📊', color: '#64748b' },
  L1_Transactions: { name: 'Transactions', icon: '📝', color: '#3b82f6' },
  L2_Control: { name: 'Control', icon: '⚙️', color: '#10b981' },
  L3_Operations: { name: 'Operations', icon: '🏢', color: '#f59e0b' },
  L4_Enterprise: { name: 'Enterprise', icon: '🏛️', color: '#8b5cf6' }
};
