/**
 * @fileoverview Register of Wills office audit module
 * @module L3/rowOfficers/RegisterOfWills
 * @authority 16 Pa.C.S. §1101-1110
 */

export const RegisterOfWills = {
  office: 'Register of Wills',
  authority: '16 Pa.C.S. Article XI',
  term: 4,
  elected: true,
  bondRequired: true,

  duties: {
    probate: 'Probate wills and grant letters',
    estates: 'Oversee estate administration',
    orphansCourt: 'Clerk of Orphans Court',
    guardianships: 'Process guardianship matters'
  },

  auditAreas: {
    probateFees: {
      description: 'Fees for probate services',
      frequency: 'Annual',
      reconcileTo: 'Treasurer deposits'
    },
    inheritanceTax: {
      description: 'Collection and remittance to state',
      frequency: 'Monthly',
      compliance: '72 P.S. §9101 et seq.'
    },
    estateAccounting: {
      description: 'Estate inventory and accounting review',
      frequency: 'Annual',
      fiduciary: 'Executor/Administrator compliance'
    },
    guardianAccounts: {
      description: 'Guardian financial reports',
      frequency: 'Annual',
      protection: 'Incapacitated person assets'
    }
  },

  specialResponsibilities: {
    marriageLicenses: {
      description: 'Issue marriage licenses',
      fees: 'Per fee schedule',
      reporting: 'Vital statistics'
    }
  },

  reportingRequirements: {
    monthly: 'Inheritance tax to state',
    monthly2: 'Fee collection to Controller',
    annual: 'Financial audit'
  }
};
