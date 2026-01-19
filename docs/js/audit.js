/**
 * NAC Fiscal Module - Audit & Compliance (Dimension 1)
 *
 * Comprehensive audit framework per PA County Code Section 1720
 *
 * @module fiscal/audit
 */

const AuditModule = {
  dimension: 1,
  name: "Audit & Compliance",

  // Statutory Authority
  authority: {
    section: "PA County Code Section 1720",
    mandate: "Audit, settle, and adjust the accounts of all County offices",
    scope: "All officers and persons collecting, receiving, holding, or disbursing county money"
  },

  // Audit Types
  auditTypes: {
    financial: {
      name: "Financial Statement Audit",
      objective: "Express opinion on fair presentation of financial statements",
      frequency: "Annual",
      standards: "Government Auditing Standards (Yellow Book), GASB",
      output: "Annual Comprehensive Financial Report (ACFR)"
    },
    compliance: {
      name: "Compliance Audit",
      objective: "Verify adherence to laws, regulations, and policies",
      frequency: "As needed / risk-based",
      standards: "Single Audit Act (if federal funds > $750k)",
      areas: [
        "Grant compliance",
        "Procurement rules",
        "Contract terms",
        "Personnel policies"
      ]
    },
    operational: {
      name: "Operational Audit",
      objective: "Evaluate efficiency and effectiveness of operations",
      frequency: "Risk-based rotation",
      focus: [
        "Process efficiency",
        "Cost savings opportunities",
        "Best practice comparison",
        "Performance metrics"
      ]
    },
    forensic: {
      name: "Forensic Audit",
      objective: "Investigate suspected fraud or irregularities",
      trigger: "Tip, complaint, or audit finding",
      procedures: [
        "Evidence preservation",
        "Transaction reconstruction",
        "Interview witnesses",
        "Document chain of custody"
      ]
    },
    special: {
      name: "Special Examination",
      objective: "Address specific concerns or requests",
      examples: [
        "Elected official expense review",
        "Program-specific audit",
        "Pre-merger due diligence",
        "Grant closeout"
      ]
    }
  },

  // Audit Targets (Entities Subject to Controller Audit)
  auditTargets: {
    rowOffices: {
      name: "Row Offices",
      entities: [
        { name: "Recorder of Deeds", risks: ["Fee collection", "Document security"] },
        { name: "Register of Wills", risks: ["Estate funds", "Fee accuracy"] },
        { name: "Prothonotary", risks: ["Court fees", "Civil filing"] },
        { name: "Clerk of Courts", risks: ["Criminal fees", "Bail funds"] },
        { name: "Sheriff", risks: ["Sale proceeds", "Service fees"] }
      ]
    },
    taxCollectors: {
      name: "Tax Collectors",
      entities: "All municipal tax collectors handling county taxes",
      risks: [
        "Timely remittance",
        "Accurate accounting",
        "Penalty/interest application",
        "Exoneration documentation"
      ],
      frequency: "Annual review, detailed audit on rotation"
    },
    districtJudges: {
      name: "Magisterial District Judges",
      count: "Multiple districts",
      risks: [
        "Fine collection",
        "Bail handling",
        "Fee accounting",
        "Timely transmittal"
      ]
    },
    departments: {
      name: "County Departments",
      categories: [
        "Human Services",
        "Courts",
        "Corrections",
        "Public Works",
        "Administration"
      ],
      auditCycle: "Risk-based rotation, major departments every 2-3 years"
    }
  },

  // Audit Process
  process: {
    phases: [
      {
        name: "Planning",
        activities: [
          "Assess risk",
          "Determine scope and objectives",
          "Develop audit program",
          "Assign staff",
          "Notify auditee"
        ],
        deliverable: "Audit Plan/Engagement Letter"
      },
      {
        name: "Fieldwork",
        activities: [
          "Gather documentation",
          "Test transactions",
          "Interview personnel",
          "Analyze data",
          "Document findings"
        ],
        deliverable: "Working Papers"
      },
      {
        name: "Reporting",
        activities: [
          "Draft findings",
          "Discuss with management",
          "Obtain management response",
          "Finalize report",
          "Distribute"
        ],
        deliverable: "Audit Report"
      },
      {
        name: "Follow-up",
        activities: [
          "Track corrective actions",
          "Verify implementation",
          "Report status",
          "Close finding or escalate"
        ],
        deliverable: "Follow-up Report"
      }
    ]
  },

  // Risk Assessment Framework
  riskAssessment: {
    factors: [
      { name: "Dollar Volume", weight: 25, description: "Amount of money handled" },
      { name: "Complexity", weight: 20, description: "Transaction/process complexity" },
      { name: "Prior Findings", weight: 20, description: "History of audit issues" },
      { name: "Time Since Audit", weight: 15, description: "Years since last comprehensive audit" },
      { name: "Control Environment", weight: 10, description: "Quality of internal controls" },
      { name: "Public Sensitivity", weight: 10, description: "Public interest/exposure" }
    ],
    scoring: {
      low: { range: [0, 33], auditFrequency: "Every 4-5 years" },
      moderate: { range: [34, 66], auditFrequency: "Every 2-3 years" },
      high: { range: [67, 100], auditFrequency: "Annual" }
    }
  },

  // Common Audit Findings
  commonFindings: {
    categories: [
      {
        type: "Internal Control Weakness",
        examples: [
          "Lack of segregation of duties",
          "Inadequate review/approval",
          "Missing documentation",
          "Poor physical security"
        ],
        significance: "Increases risk of errors or fraud"
      },
      {
        type: "Compliance Violation",
        examples: [
          "Procurement without bidding",
          "Expenditure without appropriation",
          "Grant terms not followed",
          "Reporting deadline missed"
        ],
        significance: "Legal/regulatory exposure"
      },
      {
        type: "Financial Error",
        examples: [
          "Calculation mistakes",
          "Duplicate payments",
          "Incorrect account coding",
          "Revenue not recorded"
        ],
        significance: "Misstated financial records"
      },
      {
        type: "Efficiency Issue",
        examples: [
          "Redundant processes",
          "Excessive costs",
          "Underutilized resources",
          "Manual processes that could be automated"
        ],
        significance: "Waste of taxpayer resources"
      }
    ]
  },

  // AI-Assisted Audit Tools
  aiTools: {
    transactionAnalysis: {
      name: "Automated Transaction Review",
      prompt: `Analyze the following transaction data for:
        - Benford's Law distribution anomalies
        - Duplicate invoice detection
        - Round number clustering
        - Vendor concentration
        - Temporal patterns (month-end, year-end spikes)`,
      useCase: "Identify transactions requiring detailed review"
    },
    documentExtraction: {
      name: "Document Data Extraction",
      prompt: `Extract and validate from these documents:
        - Invoice amounts and dates
        - Contract terms and limits
        - Approval signatures
        - Budget account codes
        - Vendor information`,
      useCase: "Automate data gathering from source documents"
    },
    complianceChecker: {
      name: "Compliance Rule Engine",
      prompt: `Check these transactions against:
        - Bid threshold requirements ($X for quotes, $Y for bids)
        - Budget appropriation limits
        - Grant allowable costs
        - Policy spending limits
        - Approval authority levels`,
      useCase: "Flag potential compliance violations"
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuditModule;
}

if (typeof window !== 'undefined') {
  window.AuditModule = AuditModule;
}
