/**
 * @fileoverview Sheriff office audit module
 * @module L3/rowOfficers/Sheriff
 * @authority 16 Pa.C.S. §1201-1210
 */

export const Sheriff = {
  office: 'Sheriff',
  authority: '16 Pa.C.S. Article XII',
  term: 4,
  elected: true,
  bondRequired: true,

  duties: {
    courtSecurity: 'Provide courthouse security',
    process: 'Serve legal process',
    sales: 'Conduct sheriff sales',
    transport: 'Transport prisoners',
    jail: 'Operate county jail (if applicable)'
  },

  auditAreas: {
    sheriffSales: {
      description: 'Real estate and personal property sales',
      frequency: 'Annual',
      requirements: ['bid deposits', 'sale proceeds', 'distribution']
    },
    serviceFees: {
      description: 'Fees for service of process',
      frequency: 'Annual',
      reconcileTo: 'Treasurer deposits'
    },
    inmateAccounts: {
      description: 'Prisoner funds and commissary',
      frequency: 'Annual',
      controls: 'Individual inmate accounting'
    },
    weaponsInventory: {
      description: 'Firearms and equipment tracking',
      frequency: 'Annual',
      verification: 'Physical count and condition'
    },
    grantCompliance: {
      description: 'Law enforcement grants',
      frequency: 'Per grant terms',
      types: ['PCCD', 'Homeland Security', 'JAG']
    }
  },

  specialFunds: {
    sheriffSale: {
      description: 'Proceeds from sheriff sales',
      distribution: 'Per court order',
      timeline: '30 days to distribute'
    }
  },

  reportingRequirements: {
    monthly: 'Fee collection to Controller',
    monthly2: 'Jail population statistics',
    annual: 'Financial audit and inventory'
  }
};
