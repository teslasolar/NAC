/**
 * @fileoverview Claim against county UDT
 * @module L1/claims/Claim
 */
import { ClaimStatus } from '../../L0_Data/enums/ClaimStatus.js';

export const Claim = {
  type: 'Claim',
  authority: '16 Pa.C.S. §1750',
  fields: {
    id: { type: 'string', required: true },
    vendor: { type: 'Person', required: true },
    amount: { type: 'Money', required: true },
    account: { type: 'Account', required: true },
    description: { type: 'string', maxLength: 500 },
    invoiceDate: { type: 'Date' },
    invoiceNumber: { type: 'string' },
    status: { type: 'ClaimStatus', default: ClaimStatus.SUBMITTED },
    submittedBy: { type: 'Person' },
    submittedDate: { type: 'Date' }
  }
};
