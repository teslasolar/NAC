/**
 * @fileoverview Claim status enumeration
 * @module L0/enums/ClaimStatus
 */
export const ClaimStatus = {
  SUBMITTED: 'submitted',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
  VOIDED: 'voided'
};

export const ClaimStatusFlow = {
  [ClaimStatus.SUBMITTED]: [ClaimStatus.PENDING_REVIEW],
  [ClaimStatus.PENDING_REVIEW]: [ClaimStatus.APPROVED, ClaimStatus.REJECTED],
  [ClaimStatus.APPROVED]: [ClaimStatus.PAID, ClaimStatus.VOIDED],
  [ClaimStatus.REJECTED]: [],
  [ClaimStatus.PAID]: [ClaimStatus.VOIDED],
  [ClaimStatus.VOIDED]: []
};
