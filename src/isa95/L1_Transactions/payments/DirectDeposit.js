/**
 * @fileoverview Direct deposit payment record
 * @module L1/payments/DirectDeposit
 */
export const DirectDeposit = {
  type: 'DirectDeposit',
  fields: {
    id: { type: 'string', required: true },
    employeeId: { type: 'string', required: true },
    amount: { type: 'Money', required: true },
    payPeriod: { type: 'DateRange', required: true },
    routingNumber: { type: 'string', length: 9, masked: true },
    accountNumber: { type: 'string', masked: true },
    accountType: { type: 'string', enum: ['checking', 'savings'] },
    effectiveDate: { type: 'Date' },
    status: { type: 'string', enum: ['pending', 'sent', 'confirmed', 'failed'] }
  }
};
