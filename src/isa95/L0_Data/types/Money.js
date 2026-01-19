/**
 * @fileoverview Money amount type
 * @module L0/types/Money
 */
export const Money = {
  type: 'Money',
  fields: {
    amount: { type: 'number', precision: 2 },
    currency: { type: 'string', default: 'USD' }
  },
  validate: (v) => typeof v.amount === 'number' && v.amount >= 0,
  format: (v) => `$${v.amount.toFixed(2)}`
};
