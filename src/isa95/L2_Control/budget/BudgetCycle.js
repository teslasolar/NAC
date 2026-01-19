/**
 * @fileoverview Annual budget cycle
 * @module L2/budget/BudgetCycle
 */
export const BudgetCycle = {
  process: 'BudgetCycle',
  fiscalYear: 'calendar',
  milestones: [
    { month: 7, task: 'Budget instructions issued' },
    { month: 8, task: 'Department requests due' },
    { month: 9, task: 'Executive review' },
    { month: 10, task: 'Proposed budget to Council' },
    { month: 11, task: 'Public hearings' },
    { month: 12, task: 'Budget adoption' }
  ],
  controllerRole: [
    'Provide historical data',
    'Revenue projections',
    'Variance analysis',
    'Monitor execution'
  ]
};
