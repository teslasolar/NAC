/**
 * NAC Governance Module - County Council (Dimension 3)
 *
 * Northampton County Council structure and Controller interface
 * Per Home Rule Charter
 *
 * @module governance/council
 */

const CouncilModule = {
  dimension: 3,
  name: "County Council",

  // Structure per Home Rule Charter
  structure: {
    composition: {
      members: 9,
      type: "Part-time elected officials",
      term: "4 years",
      districts: "By district representation"
    },
    officers: {
      president: "Elected by Council members",
      vicePresident: "Elected by Council members",
      clerk: "Appointed staff position"
    },
    meetings: {
      regular: "Twice monthly (typically Thursday evenings)",
      special: "As called by President or majority",
      public: "Open Meetings Act compliance required"
    }
  },

  // Council Powers
  powers: {
    legislative: [
      "Adopt ordinances and resolutions",
      "Amend Administrative Code",
      "Establish fees and charges",
      "Create/abolish departments"
    ],
    fiscal: [
      "Adopt annual budget",
      "Appropriate funds",
      "Levy taxes",
      "Authorize borrowing",
      "Accept grants"
    ],
    oversight: [
      "Conduct investigations",
      "Require reports from officials",
      "Confirm executive appointments",
      "Override executive veto (2/3 vote)"
    ]
  },

  // Controller-Council Relationship
  controllerInterface: {
    reporting: {
      regular: [
        "Monthly financial reports",
        "Quarterly budget status",
        "Annual audit results"
      ],
      special: [
        "Audit findings requiring attention",
        "Fraud investigations",
        "Compliance concerns"
      ]
    },
    budgetRole: {
      description: "Controller provides comparative financial data for budget deliberations",
      deliverables: [
        "Prior year actual vs. budget comparison",
        "Revenue collection trends",
        "Department spending patterns",
        "Multi-year financial projections"
      ]
    },
    independence: {
      note: "Controller is independently elected, not appointed by or reporting to Council",
      significance: "Ensures objective fiscal oversight without political pressure"
    }
  },

  // Council Committees
  committees: {
    finance: {
      name: "Finance Committee",
      jurisdiction: "Budget, appropriations, fiscal policy",
      controllerRole: "Primary interface for fiscal matters"
    },
    personnel: {
      name: "Personnel Committee",
      jurisdiction: "Human resources, union negotiations",
      controllerRole: "Provide compensation data, attend salary board"
    },
    publicWorks: {
      name: "Public Works Committee",
      jurisdiction: "Infrastructure, facilities",
      controllerRole: "Audit capital projects, review contracts"
    }
  },

  // Ordinance Process
  ordinanceProcess: {
    steps: [
      {
        step: 1,
        name: "Introduction",
        description: "Ordinance introduced at Council meeting",
        controllerRole: "Review fiscal impact if applicable"
      },
      {
        step: 2,
        name: "Committee Review",
        description: "Assigned to appropriate committee",
        controllerRole: "Provide data/analysis as requested"
      },
      {
        step: 3,
        name: "Public Hearing",
        description: "Required for certain ordinances",
        controllerRole: "Present financial implications"
      },
      {
        step: 4,
        name: "Final Vote",
        description: "Council votes on adoption",
        controllerRole: "Record keeping, compliance verification"
      },
      {
        step: 5,
        name: "Executive Action",
        description: "Executive signs or vetoes",
        controllerRole: "Monitor implementation"
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CouncilModule;
}

if (typeof window !== 'undefined') {
  window.CouncilModule = CouncilModule;
}
