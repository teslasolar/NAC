// Auto-generated ISA-95 structure manifest
// Generated: 2026-01-23T18:21:37.857Z
// Modules: 74 | Schemas: 5

export const STRUCTURE = {
  "L0_Data": {
    "config": [],
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
    ],
    "udt": []
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
    "config": [],
    "payments": [
      "DirectDeposit.js",
      "Disbursement.js",
      "Receipt.js",
      "Warrant.js"
    ],
    "signing": [
      "BlockchainSigner.js"
    ]
  },
  "L2_Control": {
    "alarms": [
      "AlarmManager.js",
      "AlarmRationalization.js",
      "index.js"
    ],
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
    "config": [],
    "engine": [
      "ProcessControllers.js",
      "RuleEngine.js",
      "WorkflowEngine.js"
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
    "config": [],
    "controller": [
      "AuditAuthority.js",
      "AuditJurisdiction.js",
      "BoardMemberships.js",
      "BudgetCertification.js",
      "CoreFunctions.js",
      "DeputyController.js",
      "Independence.js",
      "SalaryBoard.js",
      "StatutoryDuties.js",
      "index.js"
    ],
    "fiscal": [
      "AccountsPayable.js",
      "PayrollOps.js"
    ],
    "governance": [
      "CouncilInterface.js",
      "ElectedOfficers.js",
      "JudicialReporting.js"
    ],
    "rowOfficers": [
      "ClerkOfCourts.js",
      "Coroner.js",
      "DistrictAttorney.js",
      "Prothonotary.js",
      "RecorderOfDeeds.js",
      "RegisterOfWills.js",
      "Sheriff.js",
      "Treasurer.js",
      "index.js"
    ],
    "tags": []
  },
  "L4_Enterprise": {
    "config": [],
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
  modules: 74,
  schemas: 5,
  paCodeCoverage: {"implemented":195,"partial":30,"not_started":5}
};

export const LEVELS = {
  L0_Data: { name: 'Data', icon: '📊', color: '#64748b' },
  L1_Transactions: { name: 'Transactions', icon: '📝', color: '#3b82f6' },
  L2_Control: { name: 'Control', icon: '⚙️', color: '#10b981' },
  L3_Operations: { name: 'Operations', icon: '🏢', color: '#f59e0b' },
  L4_Enterprise: { name: 'Enterprise', icon: '🏛️', color: '#8b5cf6' }
};
