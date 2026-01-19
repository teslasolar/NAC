/**
 * @fileoverview Accounts payable operations
 * @module L3/fiscal/AccountsPayable
 */
export const AccountsPayable = {
  department: 'Fiscal',
  processOwner: 'Controller',
  workflow: [
    'receiveInvoice',
    'matchToPO',
    'departmentApproval',
    'controllerAudit',
    'paymentGeneration',
    'disbursement'
  ],
  metrics: {
    daysToPayTarget: 30,
    errorRateTarget: 0.01,
    discountCaptureTarget: 0.90
  },
  controls: [
    'Three-way match',
    'Segregation of duties',
    'Approval thresholds',
    'Positive pay'
  ]
};
