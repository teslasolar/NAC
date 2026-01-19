/**
 * @fileoverview Payroll operations
 * @module L3/fiscal/PayrollOps
 */
export const PayrollOps = {
  department: 'Fiscal',
  processOwner: 'Controller',
  frequency: 'biweekly',
  employeeCount: 'varies',
  systems: ['HRIS', 'TimeTracking', 'PayrollEngine'],
  outputs: [
    'DirectDeposits',
    'PayStubs',
    'TaxRemittances',
    'DeductionRemittances'
  ],
  audits: [
    'ghostEmployeeCheck',
    'overtimeReview',
    'benefitReconciliation'
  ]
};
