/**
 * @fileoverview Council reporting interface
 * @module L3/governance/CouncilInterface
 */
export const CouncilInterface = {
  body: 'County Council',
  members: 9,
  meetings: 'twice_monthly',
  controllerReports: {
    monthly: ['Revenue summary', 'Expenditure summary', 'Cash position'],
    quarterly: ['Budget variance', 'Audit status', 'Investment report'],
    annual: ['ACFR', 'Audit findings', 'Performance report']
  },
  budgetRole: [
    'Historical data provision',
    'Revenue projections',
    'Variance explanations'
  ]
};
