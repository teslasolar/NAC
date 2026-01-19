/**
 * NAC Controller Module
 *
 * Comprehensive analysis framework for PA County Controller duties
 * Based on Pennsylvania County Code Title 16, Sections 1602-1764
 *
 * @module controller
 */

const ControllerModule = {
  // Core statutory sections governing the Controller
  statutorySections: {
    1602: {
      title: "System of Accounts",
      duty: "Prescribe the system of accounts to be maintained",
      category: "accounting",
      description: "The Controller has authority to prescribe the accounting system used throughout the county government."
    },
    1704: {
      title: "Custody of Documents",
      duty: "Maintain custody of all contracts, titles, and deeds",
      category: "records",
      description: "Controller serves as custodian of critical county legal documents including contracts, real estate titles, and deeds."
    },
    1705: {
      title: "Official Books and Papers",
      duty: "Prescribe and administer the form and manner of keeping official books",
      category: "accounting",
      description: "Controller determines how fiscal records are maintained throughout all county offices."
    },
    1720: {
      title: "Audit and Settlement",
      duty: "Audit, settle, and adjust accounts of all county offices",
      category: "audit",
      description: "Primary audit function - reviewing and reconciling all county office accounts."
    },
    1750: {
      title: "Claims Against County",
      duty: "Scrutinize, audit, and decide on all claims against the county",
      category: "claims",
      description: "Gatekeeper function for all financial claims submitted to the county."
    },
    1760: {
      title: "Disbursement of County Moneys",
      duty: "Oversee all disbursements of county funds",
      category: "disbursements",
      description: "Authorize and track all outflows of county money."
    }
  },

  // Controller's Board Memberships
  boardMemberships: [
    {
      name: "County Retirement Board",
      role: "Secretary",
      responsibilities: [
        "Maintain meeting minutes",
        "Oversee retirement fund accounting",
        "Ensure actuarial compliance"
      ]
    },
    {
      name: "Salary Board",
      role: "Member",
      responsibilities: [
        "Vote on county employee salaries",
        "Review compensation structures",
        "Approve salary adjustments"
      ]
    },
    {
      name: "Prison Board",
      role: "Member",
      responsibilities: [
        "Oversee prison fiscal operations",
        "Review inmate account funds",
        "Audit commissary operations"
      ]
    },
    {
      name: "Constable Review Board",
      role: "Member",
      responsibilities: [
        "Review constable fee claims",
        "Ensure proper service documentation",
        "Approve constable payments"
      ]
    }
  ],

  // Core Controller Functions
  functions: {
    fiscalSupervision: {
      name: "Fiscal Supervision",
      description: "Supervise the fiscal affairs of the County",
      scope: "All officers or persons who collect, receive, hold, or disburse public monies",
      activities: [
        "Monitor all financial transactions",
        "Review internal controls",
        "Ensure segregation of duties",
        "Track budget adherence"
      ]
    },
    internalAudit: {
      name: "Internal Audit",
      description: "Conduct periodic audits of county operations",
      targets: [
        "Row offices (Recorder, Register, Prothonotary, Clerk)",
        "Tax collectors",
        "County departments",
        "District judges",
        "Entities with financial nexus to county"
      ],
      auditTypes: [
        "Financial statement audits",
        "Compliance audits",
        "Operational audits",
        "Forensic audits (as needed)"
      ]
    },
    payrollAdministration: {
      name: "Payroll Administration",
      description: "Process and manage county employee compensation",
      functions: [
        "Biweekly payroll processing",
        "Tax withholding and remittance",
        "Benefit deduction management",
        "Compliance reporting (W-2, 941, etc.)"
      ]
    },
    accountsPayable: {
      name: "Accounts Payable",
      description: "Process vendor payments and county obligations",
      workflow: [
        "Receive and verify invoices",
        "Match to purchase orders",
        "Obtain department approval",
        "Process payment",
        "Maintain records"
      ]
    },
    financialReporting: {
      name: "Financial Reporting",
      description: "Prepare and publish county financial reports",
      reports: [
        "Annual Comprehensive Financial Report (ACFR)",
        "Monthly budget reports",
        "Quarterly cash flow statements",
        "Special audit reports"
      ]
    }
  },

  // AI Analysis Prompts for Controller Functions
  analysisPrompts: {
    auditRisk: `Analyze the following county department data for audit risk factors:
      - Unusual transaction patterns
      - Segregation of duties concerns
      - Cash handling vulnerabilities
      - Revenue recognition issues
      - Expenditure anomalies`,

    budgetVariance: `Review budget vs. actual performance for:
      - Line item variances exceeding 10%
      - Trending over/under spending
      - Unexplained fluctuations
      - Revenue shortfalls
      - Recommend corrective actions`,

    complianceCheck: `Evaluate compliance with:
      - PA County Code requirements
      - Home Rule Charter provisions
      - GASB accounting standards
      - Federal/state grant requirements
      - Internal policies and procedures`,

    fraudIndicators: `Screen for potential fraud indicators:
      - Duplicate payments
      - Ghost employees
      - Fictitious vendors
      - Unauthorized transactions
      - Missing documentation`
  },

  // Controller's Independent Authority
  independence: {
    description: "The Controller is an independently elected official, separate from executive, legislative, and judicial branches",
    importance: [
      "Provides checks and balances on county spending",
      "Ensures objective fiscal oversight",
      "Maintains public trust through independence",
      "Can report directly to public on fiscal matters"
    ],
    reportingLine: "Reports findings to County Council, Court of Common Pleas, and the public"
  },

  // Quality Assurance Standards
  qualityStandards: {
    framework: "Association of Local Government Auditors (ALGA)",
    requirements: [
      "External peer review every 3 years",
      "Compliance with Government Auditing Standards (Yellow Book)",
      "Continuing professional education for audit staff",
      "Independence documentation"
    ],
    currentStatus: {
      lastReview: "2024",
      rating: "Pass",
      period: "January 1, 2022 - December 31, 2024"
    }
  }
};

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ControllerModule;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.ControllerModule = ControllerModule;
}
