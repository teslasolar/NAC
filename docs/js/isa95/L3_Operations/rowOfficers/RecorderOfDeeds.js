/**
 * @fileoverview Recorder of Deeds office audit module
 * @module L3/rowOfficers/RecorderOfDeeds
 * @authority 16 Pa.C.S. §1001-1009
 */

export const RecorderOfDeeds = {
  office: 'Recorder of Deeds',
  authority: '16 Pa.C.S. Article X',
  term: 4,
  elected: true,
  bondRequired: true,

  duties: {
    recording: 'Record deeds and conveyances',
    mortgages: 'Record mortgages and satisfactions',
    instruments: 'Record other legal instruments',
    indexing: 'Maintain grantor/grantee indexes'
  },

  auditAreas: {
    recordingFees: {
      description: 'State and county recording fees',
      frequency: 'Annual',
      split: { state: 'Remit to Commonwealth', county: 'Deposit with Treasurer' }
    },
    realtyTransferTax: {
      description: 'Collection and remittance',
      frequency: 'Monthly',
      rate: '1% state + local rate',
      compliance: '72 P.S. §8102-C'
    },
    documentControl: {
      description: 'Sequential numbering and indexing',
      frequency: 'Annual',
      verification: 'No gaps, accurate indexing'
    },
    technologyFund: {
      description: 'Automation and preservation fund',
      frequency: 'Annual',
      permittedUses: 'Technology improvements only'
    }
  },

  reportingRequirements: {
    monthly: 'Transfer tax remittance to state',
    monthly2: 'Fee collection to Controller',
    annual: 'Financial audit'
  }
};
