/**
 * @fileoverview Treasurer office audit module
 * @module L3/rowOfficers/Treasurer
 * @authority 16 Pa.C.S. §1301-1310
 */

export const Treasurer = {
  office: 'County Treasurer',
  authority: '16 Pa.C.S. Article XIII',
  term: 4,
  elected: true,
  bondRequired: true,

  duties: {
    custody: 'Custodian of all county funds',
    receipts: 'Receive all county moneys',
    disbursements: 'Make payments on controller warrants',
    investments: 'Invest idle funds',
    taxCollection: 'Collect county taxes'
  },

  auditAreas: {
    bankReconciliation: {
      description: 'All bank accounts reconciled',
      frequency: 'Monthly',
      verification: 'Controller review'
    },
    cashReceipts: {
      description: 'All receipts properly recorded',
      frequency: 'Daily',
      controls: 'Same-day deposit requirement'
    },
    disbursements: {
      description: 'Payments only on valid warrants',
      frequency: 'Daily',
      verification: 'Controller warrant matching'
    },
    investments: {
      description: 'Investment policy compliance',
      frequency: 'Monthly',
      requirements: ['permitted instruments', 'diversification', 'maturity limits']
    },
    taxCollection: {
      description: 'Real estate tax collection',
      frequency: 'Annual',
      reconciliation: 'Tax duplicate to collections'
    }
  },

  bankingRequirements: {
    depositories: 'Board-approved banks only',
    collateral: '102% collateralization required',
    insurance: 'FDIC coverage verification',
    reporting: 'Monthly bank statements to Controller'
  },

  investmentPolicy: {
    authority: '16 Pa.C.S. §1307',
    permittedInstruments: [
      'US Treasury',
      'Federal agency',
      'Insured CDs',
      'PA local government pools'
    ],
    maxMaturity: '3 years',
    reporting: 'Quarterly investment report'
  },

  reportingRequirements: {
    daily: 'Cash position report',
    monthly: 'Bank reconciliation to Controller',
    monthly2: 'Investment report',
    annual: 'Financial audit'
  }
};
