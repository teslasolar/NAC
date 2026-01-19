/**
 * @fileoverview Annual budget process control
 * @module L2/budget/AnnualBudget
 * @authority 16 Pa.C.S. §17A01
 */

export const AnnualBudget = {
  process: 'AnnualBudget',
  authority: '16 Pa.C.S. §17A01',
  timeline: {
    departmentRequests: 'August 1',
    executiveReview: 'September 15',
    proposedBudget: 'October 15',
    publicHearing: 'November (min 10 days notice)',
    adoption: 'December 31'
  },
  components: [
    'Operating budget',
    'Capital budget',
    'Debt service',
    'Reserve requirements'
  ],
  requirements: {
    balanced: true,
    format: 'Line item by department',
    revenueEstimates: true,
    expenditureLimits: true
  },
  approvals: {
    department: 'Department head',
    executive: 'County Executive/Commissioners',
    legislative: 'County Council/Commissioners',
    controller: 'Certification of balance'
  },
  amendments: {
    allowed: true,
    process: 'BudgetAmendment',
    threshold: 'Any increase in total appropriations'
  }
};
