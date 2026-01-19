/**
 * @fileoverview Payment warrant UDT
 * @module L1/payments/Warrant
 * @authority 16 Pa.C.S. §1751, §1760
 */
export const Warrant = {
  type: 'Warrant',
  authority: '16 Pa.C.S. §1760',
  fields: {
    number: { type: 'string', required: true },
    claimId: { type: 'string', required: true },
    payee: { type: 'Person', required: true },
    amount: { type: 'Money', required: true },
    account: { type: 'Account', required: true },
    description: { type: 'string', maxLength: 100 },
    issueDate: { type: 'Date', required: true },
    issuedBy: { type: 'Person' },
    status: { type: 'string', enum: ['issued', 'cleared', 'voided', 'stale'] }
  }
};
