/**
 * @fileoverview Line item transfer control
 * @module L2/budget/LineItemTransfer
 * @authority 16 Pa.C.S. §17A07
 */

export const LineItemTransfer = {
  process: 'LineItemTransfer',
  authority: '16 Pa.C.S. §17A07',
  categories: {
    personnel: '100-199 object codes',
    benefits: '200-299 object codes',
    services: '300-399 object codes',
    supplies: '400-499 object codes',
    capital: '500-599 object codes',
    debtService: '600-699 object codes'
  },
  rules: {
    withinCategory: {
      approval: 'Controller',
      limit: 'No limit within same category'
    },
    betweenCategories: {
      approval: 'Commissioners + Controller',
      limit: '10% of line item'
    },
    toPersonnel: {
      approval: 'Salary Board',
      limit: 'Per position authorization'
    }
  },
  documentation: {
    required: ['Transfer form', 'Justification', 'Account codes'],
    optional: ['Supporting documents']
  },
  tracking: {
    logAllTransfers: true,
    reportFrequency: 'monthly',
    auditTrail: true
  }
};
