/**
 * @fileoverview Claim approval record
 * @module L1/claims/ClaimApproval
 */
export const ClaimApproval = {
  type: 'ClaimApproval',
  fields: {
    claimId: { type: 'string', required: true },
    approver: { type: 'Person', required: true },
    action: { type: 'string', enum: ['approve', 'reject', 'hold'] },
    reason: { type: 'string', maxLength: 250 },
    timestamp: { type: 'Date', default: () => new Date() },
    level: { type: 'number', min: 1, max: 3 }
  },
  thresholds: {
    1: { max: 10000, title: 'Department Head' },
    2: { max: 50000, title: 'Controller' },
    3: { max: Infinity, title: 'Council' }
  }
};
