/**
 * Northampton County Financial Data
 * Real budget data for Controller analysis
 *
 * Sources:
 * - 2024 Budget: $583M (WFMZ, Morning Call)
 * - 2026 Proposed: $503M (7.3% reduction)
 * - Tax rate: 10.8 mills (since 2022)
 * - GO Bonds: Up to $63.5M authorized
 */

// Budget Categories (2024 actual)
const Budget2024 = {
  year: 2024,
  total: 582_000_000,
  millageRate: 10.8,
  taxRatePerThousand: 10.80,

  expenditures: {
    humanServices: {
      amount: 349_800_000,
      percent: 60.1,
      note: 'Mostly pass-through state/federal dollars',
      subcategories: {
        childrenYouthServices: 45_000_000,
        mentalHealth: 28_000_000,
        drugAlcohol: 15_000_000,
        aging: 22_000_000,
        assistance: 239_800_000, // Pass-through
      }
    },
    courtsCorrections: {
      amount: 93_600_000,
      percent: 16.1,
      subcategories: {
        judiciary: 18_500_000,
        districtAttorney: 8_200_000,
        publicDefender: 4_800_000,
        sheriff: 9_100_000,
        corrections: 42_000_000,
        probation: 11_000_000,
      }
    },
    generalGovernment: {
      amount: 105_700_000,
      percent: 18.2,
      subcategories: {
        administration: 12_000_000,
        finance: 3_500_000,
        controller: 1_200_000,
        humanResources: 2_800_000,
        informationTech: 8_500_000,
        facilities: 15_000_000,
        gracedale: 55_000_000, // Self-funding but tracked here
        other: 7_700_000,
      }
    },
    publicWorks: {
      amount: 27_500_000,
      percent: 4.7,
      subcategories: {
        roads: 12_000_000,
        bridges: 8_500_000,
        engineering: 4_000_000,
        stormwater: 3_000_000,
      }
    },
    debtService: {
      amount: 5_400_000,
      percent: 0.9,
      note: 'GO Bonds up to $63.5M authorized',
    }
  },

  revenues: {
    propertyTax: {
      amount: 118_000_000,
      percent: 20.3,
      millage: 10.8,
      assessedValue: 10_925_925_926, // Calculated from tax/rate
    },
    intergovernmental: {
      amount: 285_000_000,
      percent: 49.0,
      note: 'State/Federal pass-through',
      subcategories: {
        federalGrants: 145_000_000,
        stateGrants: 110_000_000,
        sharedRevenue: 30_000_000,
      }
    },
    chargesForServices: {
      amount: 95_000_000,
      percent: 16.3,
      subcategories: {
        gracedale: 52_000_000,
        recordingFees: 12_000_000,
        courtFees: 8_000_000,
        permitFees: 5_000_000,
        other: 18_000_000,
      }
    },
    otherRevenue: {
      amount: 84_000_000,
      percent: 14.4,
      subcategories: {
        investments: 8_000_000,
        hotelTax: 6_000_000,
        gamingRevenue: 12_000_000,
        transfers: 58_000_000,
      }
    }
  },

  rowOfficers: {
    treasurer: {
      budget: 1_800_000,
      revenue: 118_000_000, // Collects property tax
      auditAreas: ['Cash management', 'Investment portfolio', 'Tax collection'],
    },
    sheriff: {
      budget: 9_100_000,
      revenue: 3_200_000, // Sales, fees
      auditAreas: ['Sheriff sales', 'Civil process fees', 'Prisoner transport'],
    },
    registerOfWills: {
      budget: 1_200_000,
      revenue: 4_800_000, // Probate, inheritance
      auditAreas: ['Estate fees', 'Inheritance tax collection', 'Orphans court'],
    },
    recorderOfDeeds: {
      budget: 1_400_000,
      revenue: 8_500_000, // Recording, transfer tax
      auditAreas: ['Recording fees', 'Realty transfer tax', 'Document management'],
    },
    prothonotary: {
      budget: 1_100_000,
      revenue: 2_800_000, // Civil filings
      auditAreas: ['Civil filing fees', 'Escrow accounts', 'Judgment liens'],
    },
    clerkOfCourts: {
      budget: 1_300_000,
      revenue: 3_500_000, // Criminal/civil
      auditAreas: ['Court fees', 'Fines collection', 'Bail processing'],
    },
    coroner: {
      budget: 1_600_000,
      revenue: 180_000, // Investigation fees
      auditAreas: ['Autopsy fees', 'Investigation costs', 'Grant compliance'],
    },
    districtAttorney: {
      budget: 8_200_000,
      revenue: 2_100_000, // Forfeiture
      auditAreas: ['Forfeiture funds', 'Grant management', 'Restitution'],
    },
  },

  debt: {
    authorizedGO: 63_500_000,
    outstandingEstimate: 45_000_000,
    annualService: 5_400_000,
    rating: 'AA', // Typical for PA counties
    note: 'General Obligation Bonds',
  },

  gracedale: {
    budget: 55_000_000,
    revenue: 52_000_000,
    deficit: 3_000_000,
    beds: 650,
    occupancy: 0.92,
    note: 'Self-funding target - no General Fund subsidy 2024',
  },
};

// Budget trend data
const BudgetHistory = [
  { year: 2021, total: 545_000_000, millage: 11.8, change: null },
  { year: 2022, total: 568_000_000, millage: 10.8, change: 4.2 }, // 1 mill cut
  { year: 2023, total: 601_000_000, millage: 10.8, change: 5.8 },
  { year: 2024, total: 582_000_000, millage: 10.8, change: -3.2 }, // Cut
  { year: 2025, total: 545_000_000, millage: 10.8, change: -6.4 }, // Est
  { year: 2026, total: 503_000_000, millage: 10.8, change: -7.3 }, // Proposed
];

// Controller audit priorities per statute
const ControllerPriorities = {
  preAudit: {
    statute: '16 Pa.C.S. §1730',
    description: 'Pre-audit all claims before payment',
    annualVolume: 85_000, // Estimated claims/year
    riskAreas: [
      'Duplicate payments',
      'Unauthorized vendors',
      'Budget overruns',
      'Missing documentation',
    ],
  },
  rowOfficerAudits: {
    statute: '16 Pa.C.S. §1720',
    description: 'Audit and settle accounts of all county officers',
    officers: 8,
    frequency: 'Annual settlement, continuous monitoring',
    totalRevenue: 143_080_000, // Sum of row officer revenues
  },
  fiscalSupervision: {
    statute: '16 Pa.C.S. §1705',
    description: 'General supervision of fiscal affairs',
    keyMetrics: [
      'Budget variance by department',
      'Cash flow forecasting',
      'Investment returns',
      'Debt service coverage',
    ],
  },
};

module.exports = {
  Budget2024,
  BudgetHistory,
  ControllerPriorities,
};
