/**
 * NAC Governance Module - Executive Branch (Dimension 4)
 *
 * County Executive structure and Controller interface
 * Per Northampton County Home Rule Charter
 *
 * @module governance/executive
 */

const ExecutiveModule = {
  dimension: 4,
  name: "Executive Branch",

  // County Executive
  countyExecutive: {
    election: "Independently elected countywide",
    term: "4 years",
    termLimits: "Two terms total (per recent amendment)",
    powers: [
      "Chief executive officer of county",
      "Prepare and submit annual budget",
      "Appoint department heads (with Council confirmation)",
      "Execute ordinances and policies",
      "Veto power (subject to Council override)"
    ]
  },

  // Executive Departments
  departments: {
    administration: {
      name: "Department of Administration",
      functions: ["HR", "IT", "Purchasing", "General Services"],
      controllerAuditFocus: "Procurement compliance, HR policies"
    },
    fiscalAffairs: {
      name: "Department of Fiscal Affairs",
      functions: ["Treasury", "Tax claim", "Assessment"],
      controllerAuditFocus: "Revenue collection, cash management"
    },
    humanServices: {
      name: "Department of Human Services",
      functions: ["Children & Youth", "Mental Health", "Aging", "Drug & Alcohol"],
      controllerAuditFocus: "Grant compliance, service delivery"
    },
    publicWorks: {
      name: "Department of Public Works",
      functions: ["Roads", "Bridges", "Buildings", "Parks"],
      controllerAuditFocus: "Capital projects, maintenance contracts"
    },
    corrections: {
      name: "Department of Corrections",
      functions: ["Prison operations", "Work release", "Community corrections"],
      controllerAuditFocus: "Inmate accounts, commissary, vendor contracts"
    },
    courts: {
      name: "Court Administration",
      functions: ["Court scheduling", "Jury management", "Court reporting"],
      controllerAuditFocus: "Fee collection, grant funds"
    }
  },

  // Controller-Executive Relationship
  controllerInterface: {
    independence: {
      key: "Separate elected official",
      description: "Controller is NOT subordinate to Executive",
      checkAndBalance: "Provides independent fiscal oversight of Executive operations"
    },
    collaboration: {
      budgetProcess: "Controller provides historical data; Executive prepares budget",
      payroll: "Controller processes pay for Executive branch employees",
      audits: "Controller audits Executive departments objectively"
    },
    potentialTension: {
      scenario: "Audit findings critical of Executive operations",
      resolution: "Controller reports to Council and public; Executive responds",
      importance: "System designed for healthy tension - ensures accountability"
    }
  },

  // Row Offices (Independently Elected)
  rowOffices: {
    description: "Elected officials independent of Executive, subject to Controller audit",
    offices: [
      {
        name: "District Attorney",
        function: "Criminal prosecution",
        controllerFocus: "Forfeiture funds, grant compliance"
      },
      {
        name: "Sheriff",
        function: "Court security, civil process, sales",
        controllerFocus: "Sale proceeds, fee accounting"
      },
      {
        name: "Coroner",
        function: "Death investigations",
        controllerFocus: "Fee collection, grant funds"
      },
      {
        name: "Recorder of Deeds",
        function: "Land record recording",
        controllerFocus: "Fee collection, fund remittance"
      },
      {
        name: "Register of Wills",
        function: "Probate, estate administration",
        controllerFocus: "Estate funds, fee accuracy"
      },
      {
        name: "Clerk of Courts",
        function: "Criminal court records",
        controllerFocus: "Fine/fee collection, bail funds"
      },
      {
        name: "Prothonotary",
        function: "Civil court records",
        controllerFocus: "Filing fees, judgment liens"
      }
    ]
  },

  // Budget Process with Executive
  budgetProcess: {
    executiveRole: {
      preparation: [
        "Issue budget instructions to departments",
        "Review department requests",
        "Prepare proposed budget",
        "Present to Council"
      ],
      execution: [
        "Implement adopted budget",
        "Request transfers/amendments",
        "Monitor spending"
      ]
    },
    controllerRole: {
      support: [
        "Provide historical financial data",
        "Calculate revenue projections",
        "Analyze department trends"
      ],
      oversight: [
        "Monitor budget execution",
        "Report variances to Council",
        "Process approved expenditures"
      ]
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExecutiveModule;
}

if (typeof window !== 'undefined') {
  window.ExecutiveModule = ExecutiveModule;
}
