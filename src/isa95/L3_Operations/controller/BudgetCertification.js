/**
 * @fileoverview Controller budget certification duties
 * @module L3/controller/BudgetCertification
 * @authority 16 Pa.C.S. §17A09
 */

export const BudgetCertification = {
  authority: '16 Pa.C.S. §17A09',
  certifications: {
    availableFunds: {
      description: 'Certify funds available before commitment',
      required: true,
      timing: 'Before purchase order/contract'
    },
    budgetBalance: {
      description: 'Certify budget is balanced',
      required: true,
      timing: 'Before adoption'
    },
    yearEndClose: {
      description: 'Certify fiscal year closing entries',
      required: true,
      timing: 'Within 60 days of year end'
    }
  },
  preAuditChecks: [
    'Verify appropriation exists',
    'Verify sufficient balance',
    'Verify proper authorization',
    'Verify compliance with bid requirements'
  ],
  encumbranceTracking: {
    purchaseOrders: true,
    contracts: true,
    payroll: true,
    debtService: true
  },
  reportingDuties: {
    monthly: 'Budget vs actual by department',
    quarterly: 'Financial position summary',
    annual: 'Comprehensive financial report'
  }
};
