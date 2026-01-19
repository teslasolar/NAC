/**
 * @fileoverview Deputy Controller role and responsibilities
 * @module L3/controller/DeputyController
 * @authority 16 Pa.C.S. §1603
 */

export const DeputyController = {
  role: 'Deputy Controller',
  authority: '16 Pa.C.S. §1603',
  appointment: {
    appointedBy: 'Controller',
    requiresApproval: false,
    bondRequired: true
  },
  responsibilities: [
    'Act in absence of Controller',
    'Assist with audit functions',
    'Review claims under delegation',
    'Maintain accounting records',
    'Supervise office staff'
  ],
  delegatedAuthority: {
    claimApproval: { maxAmount: 5000, requiresControllerReview: false },
    auditSignoff: false,
    warrantSigning: { inControllerAbsence: true }
  },
  succession: {
    order: 1,
    fullAuthority: true,
    conditions: ['Controller absence', 'Controller incapacity', 'Vacancy']
  }
};
