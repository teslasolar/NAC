/**
 * @fileoverview Budget amendment process
 * @module L2/budget/BudgetAmendment
 * @authority 16 Pa.C.S. §17A06
 */

export const BudgetAmendment = {
  process: 'BudgetAmendment',
  authority: '16 Pa.C.S. §17A06',
  types: {
    supplemental: 'Increase total appropriations',
    transfer: 'Move between line items',
    reduction: 'Decrease appropriations'
  },
  approvalRequirements: {
    supplemental: {
      requires: 'Council/Commissioner vote',
      publicNotice: true,
      controllerCertification: true
    },
    interdepartmental: {
      requires: 'Council/Commissioner vote',
      publicNotice: false,
      controllerCertification: true
    },
    intradepartmental: {
      requires: 'Department head + Controller',
      publicNotice: false,
      controllerCertification: true
    }
  },
  documentation: [
    'Justification memo',
    'Funding source identification',
    'Impact analysis',
    'Controller certification'
  ],
  restrictions: [
    'Cannot exceed revenue estimates',
    'Cannot reduce debt service below required',
    'Cannot eliminate required reserves'
  ]
};
