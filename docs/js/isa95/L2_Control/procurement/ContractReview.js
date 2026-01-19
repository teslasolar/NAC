/**
 * @fileoverview Contract review checklist
 * @module L2/procurement/ContractReview
 */
export const ContractReview = {
  process: 'ContractReview',
  authority: '16 Pa.C.S. §1704',
  checklist: [
    { item: 'Proper procurement method', required: true },
    { item: 'Budget authority exists', required: true },
    { item: 'Insurance certificates', required: true },
    { item: 'Performance bond (if applicable)', required: false },
    { item: 'Non-collusion affidavit', required: true },
    { item: 'Authorized signatures', required: true },
    { item: 'Scope clearly defined', required: true },
    { item: 'Payment terms specified', required: true }
  ],
  validate: (contract) => ({
    passed: ContractReview.checklist
      .filter(c => c.required)
      .every(c => contract[c.item]),
    missing: ContractReview.checklist
      .filter(c => c.required && !contract[c.item])
  })
};
