/**
 * @fileoverview Prothonotary office audit module
 * @module L3/rowOfficers/Prothonotary
 * @authority 16 Pa.C.S. §901-908
 */

export const Prothonotary = {
  office: 'Prothonotary',
  authority: '16 Pa.C.S. Article IX',
  term: 4,
  elected: true,
  bondRequired: true,

  duties: {
    civilCourt: 'Clerk of civil court of common pleas',
    judgments: 'Enter and index judgments',
    liens: 'Maintain lien dockets',
    filings: 'Accept and process civil filings'
  },

  auditAreas: {
    feeCollection: {
      description: 'Filing fees, certification fees, copy fees',
      frequency: 'Annual',
      reconcileTo: 'Treasurer deposits'
    },
    judgmentTracking: {
      description: 'Judgment entry and satisfaction',
      frequency: 'Annual',
      verification: 'Docket accuracy'
    },
    escrowAccounts: {
      description: 'Funds held in escrow',
      frequency: 'Annual',
      requirements: ['separate accounting', 'timely disbursement']
    },
    lienIndex: {
      description: 'Accuracy of lien index',
      frequency: 'Annual',
      compliance: 'Title search reliability'
    }
  },

  reportingRequirements: {
    monthly: 'Fee collection to Controller',
    annual: 'Financial audit'
  }
};
