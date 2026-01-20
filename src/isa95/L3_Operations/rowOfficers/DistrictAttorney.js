/**
 * @fileoverview District Attorney office audit module
 * @module L3/rowOfficers/DistrictAttorney
 * @authority 16 Pa.C.S. §801-808
 */

export const DistrictAttorney = {
  office: 'District Attorney',
  authority: '16 Pa.C.S. Article VIII',
  term: 4,
  elected: true,
  bondRequired: false,

  duties: {
    prosecution: 'Prosecute criminal cases',
    civilMatters: 'Represent county in civil matters',
    grandJury: 'Present cases to grand jury',
    appeals: 'Handle criminal appeals'
  },

  auditAreas: {
    forfeitureFunds: {
      description: 'Asset forfeiture account per 42 Pa.C.S. §6801',
      frequency: 'Annual',
      requirements: ['separate accounting', 'permitted uses only', 'annual report']
    },
    grantFunds: {
      description: 'Federal and state grant compliance',
      frequency: 'Per grant terms',
      types: ['PCCD', 'VOCA', 'JAG']
    },
    budgetCompliance: {
      description: 'Operating budget adherence',
      frequency: 'Monthly',
      items: ['salaries', 'expert witnesses', 'investigations']
    },
    restitution: {
      description: 'Victim restitution collection',
      frequency: 'Annual',
      tracking: 'Case-by-case accounting'
    }
  },

  specialFunds: {
    forfeiture: {
      authority: '42 Pa.C.S. §6801',
      permittedUses: ['law enforcement', 'prosecution', 'drug education'],
      prohibitedUses: ['salaries of elected officials', 'routine expenses']
    }
  },

  reportingRequirements: {
    monthly: 'Budget vs actual to Controller',
    annual: 'Forfeiture fund report to Commissioners'
  }
};
