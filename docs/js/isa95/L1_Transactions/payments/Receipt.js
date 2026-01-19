/**
 * @fileoverview Receipt transaction record
 * @module L1/payments/Receipt
 * @authority 16 Pa.C.S. §1304
 */

export const Receipt = {
  type: 'Receipt',
  authority: '16 Pa.C.S. §1304',
  fields: {
    id: { type: 'string', pattern: '^RCP-[0-9]{4}-[0-9]{6}$', required: true },
    amount: { type: 'Money', required: true },
    source: { type: 'string', required: true },
    sourceType: { type: 'string', enum: ['tax', 'fee', 'grant', 'transfer', 'other'] },
    method: { type: 'string', enum: ['cash', 'check', 'ach', 'wire', 'card'] },
    account: { type: 'Account', required: true },
    receivedBy: { type: 'string', required: true },
    receivedDate: { type: 'Date', required: true },
    depositDate: { type: 'Date' },
    status: { type: 'string', enum: ['received', 'deposited', 'returned', 'adjusted'] }
  },
  controls: {
    sameDayDeposit: { required: true, exception: 'Under $500' },
    dualCustody: true,
    prenumberedReceipts: true,
    dailyReconciliation: true
  }
};
