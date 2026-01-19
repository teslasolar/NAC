/**
 * NAC Governance Module - Judicial Interface (Dimension 5)
 *
 * Controller interaction with judicial branch
 * Per PA County Code
 *
 * @module governance/judicial
 */

const JudicialModule = {
  dimension: 5,
  name: "Judicial Interface",

  // Court System Structure
  courtStructure: {
    commonPleas: {
      name: "Court of Common Pleas",
      jurisdiction: "General trial court",
      divisions: ["Civil", "Criminal", "Family", "Orphans' Court"],
      controllerReporting: "Controller reports certain audits to the Court"
    },
    magisterialDistrict: {
      name: "Magisterial District Courts",
      jurisdiction: "Minor criminal, civil under $12,000, landlord-tenant",
      count: "Multiple districts in county",
      controllerAudit: "Annual audit of each MDJ office"
    }
  },

  // Controller's Judicial Duties
  judicialDuties: {
    treasurerAudit: {
      section: "PA County Code",
      requirement: "Audit county treasurer's accounts of money submitted to state treasurer",
      reporting: "Separate report to Court of Common Pleas"
    },
    probationAudit: {
      section: "PA County Code",
      requirement: "Audit accounts of parole and probation officers who receive moneys",
      scope: "Money paid under sentence, order, or judgment of any court",
      reporting: "Report audit findings to the issuing court"
    },
    mdjAudit: {
      description: "Audit Magisterial District Judge offices",
      focus: [
        "Fine collection and remittance",
        "Bail handling procedures",
        "Fee accounting accuracy",
        "Timely transmittal to county"
      ],
      frequency: "Annual, per state mandate"
    },
    escrowAudits: {
      description: "Review court-ordered escrow and trust accounts",
      types: [
        "Guardian/conservator accounts",
        "Settlement funds held pending distribution",
        "Interpleader funds"
      ]
    }
  },

  // Court-Related Funds
  courtFunds: {
    filingFees: {
      source: "Court filing fees",
      collection: "Prothonotary, Clerk of Courts",
      controllerRole: "Audit collection, verify proper deposit"
    },
    fines: {
      source: "Criminal fines and costs",
      collection: "MDJs, Clerk of Courts",
      controllerRole: "Audit accuracy, timely remittance"
    },
    bail: {
      source: "Cash bail postings",
      handling: "Strict accounting required",
      controllerRole: "Audit bail fund, verify refunds/forfeitures"
    },
    restitution: {
      source: "Court-ordered victim restitution",
      collection: "Probation department",
      controllerRole: "Audit collection rates, disbursement accuracy"
    },
    juryFees: {
      source: "Jury service compensation",
      payment: "Processed through Controller",
      controllerRole: "Verify service, process payment"
    }
  },

  // Constable Review Board
  constableReviewBoard: {
    composition: ["President Judge (chair)", "Controller", "District Attorney"],
    function: "Review and approve constable fee claims",
    controllerRole: {
      membership: "Voting member of board",
      review: "Verify fee claims against fee schedule",
      payment: "Process approved claims"
    },
    auditFocus: [
      "Proper documentation of service",
      "Fees comply with approved schedule",
      "No duplicate billings",
      "Legitimate service performed"
    ]
  },

  // Court Reporting Requirements
  reportingToCourtl: {
    annualReports: [
      {
        report: "Treasurer Audit Report",
        recipient: "Court of Common Pleas",
        content: "Audit of state-remitted funds"
      },
      {
        report: "Probation Audit Report",
        recipient: "Sentencing courts",
        content: "Audit of money collected under court orders"
      }
    ],
    specialReports: [
      {
        trigger: "Fraud or significant irregularity",
        recipient: "President Judge",
        action: "Immediate notification"
      }
    ]
  },

  // AI Analysis for Judicial Interface
  analysisPrompts: {
    mdjAuditRisk: `Assess audit risk for this MDJ office:
      - Case volume and fine amounts
      - Prior audit findings
      - Staffing changes
      - Complaint history
      - Bail fund balance trends`,

    constableFeeReview: `Review these constable fee claims:
      - Compare to approved fee schedule
      - Check for duplicate services
      - Verify documentation completeness
      - Flag unusual patterns`
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = JudicialModule;
}

if (typeof window !== 'undefined') {
  window.JudicialModule = JudicialModule;
}
