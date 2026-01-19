/**
 * @fileoverview Payroll cycle process
 * @module L2/payroll/PayCycle
 */
export const PayCycle = {
  process: 'PayCycle',
  authority: '16 Pa.C.S. §1705, §1750',
  frequency: 'biweekly',
  periodsPerYear: 26,
  steps: [
    { day: 0, name: 'periodEnd', desc: 'Pay period ends (Saturday)' },
    { day: 2, name: 'timeDue', desc: 'Timesheets due (Monday)' },
    { day: 3, name: 'approval', desc: 'Supervisor approval (Tuesday)' },
    { day: 4, name: 'processing', desc: 'Batch processing (Wednesday)' },
    { day: 5, name: 'review', desc: 'Controller review (Thursday)' },
    { day: 7, name: 'payDate', desc: 'Pay date (Friday)' }
  ],
  getPayDate: (periodEnd) => {
    const d = new Date(periodEnd);
    d.setDate(d.getDate() + 7);
    return d;
  }
};
