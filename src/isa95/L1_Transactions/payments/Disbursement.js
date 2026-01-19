/**
 * @fileoverview Disbursement transaction record
 * @module L1/payments/Disbursement
 * @authority 16 Pa.C.S. §1305
 */

export const Disbursement = {
  type: 'Disbursement',
  authority: '16 Pa.C.S. §1305',
  fields: {
    id: { type: 'string', pattern: '^DIS-[0-9]{4}-[0-9]{6}$', required: true },
    warrantId: { type: 'string', ref: 'Warrant', required: true },
    amount: { type: 'Money', required: true },
    payee: { type: 'string', required: true },
    payeeType: { type: 'string', enum: ['vendor', 'employee', 'agency', 'refund'] },
    method: { type: 'string', enum: ['check', 'ach', 'wire', 'card'] },
    account: { type: 'Account', required: true },
    status: { type: 'string', enum: ['pending', 'issued', 'cleared', 'voided', 'stale'] }
  },
  workflow: {
    pending: ['issued'],
    issued: ['cleared', 'voided', 'stale'],
    cleared: [],
    voided: [],
    stale: ['reissued', 'voided']
  },
  controls: {
    dualSignature: { threshold: 10000 },
    positivePayVerification: true,
    bankReconciliation: 'daily'
  }
};
