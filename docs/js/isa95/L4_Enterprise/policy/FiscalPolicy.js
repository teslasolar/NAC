/**
 * @fileoverview County fiscal policies
 * @module L4/policy/FiscalPolicy
 */
export const FiscalPolicy = {
  level: 'enterprise',
  fundBalance: {
    target: 0.10,
    minimum: 0.05,
    description: 'Unrestricted fund balance as % of expenditures'
  },
  debtPolicy: {
    maxDebtService: 0.10,
    description: 'Debt service as % of general fund'
  },
  reserves: {
    operating: '60 days',
    capital: 'per CIP plan',
    emergency: 0.02
  },
  investments: {
    permitted: ['US Treasury', 'Agencies', 'CDs', 'PLGIT'],
    maturityLimit: '5 years'
  }
};
