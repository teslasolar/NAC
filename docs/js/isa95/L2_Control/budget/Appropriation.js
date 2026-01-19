/**
 * @fileoverview Budget appropriation process
 * @module L2/budget/Appropriation
 */
export const Appropriation = {
  process: 'Appropriation',
  levels: {
    departmental: 'sum by department',
    lineItem: 'individual object codes',
    programmatic: 'by program/grant'
  },
  controls: {
    encumbrance: 'reserve for PO/contracts',
    preAudit: 'verify before payment',
    transfer: 'move between lines (rules apply)'
  },
  validate: (claim, budget) => ({
    hasAuthority: claim.amount <= budget.available,
    account: claim.account,
    remaining: budget.available - claim.amount
  })
};
