/**
 * @fileoverview Tax withholding process
 * @module L2/payroll/TaxWithholding
 */
export const TaxWithholding = {
  process: 'TaxWithholding',
  taxes: {
    federal: { form: '941', frequency: 'quarterly' },
    socialSecurity: { rate: 0.062, wageBase: 168600 },
    medicare: { rate: 0.0145, additional: 0.009, threshold: 200000 },
    paState: { rate: 0.0307, form: 'PA-W3' },
    localEIT: { rate: 'varies', form: 'LST' }
  },
  deposits: {
    semiweekly: { threshold: 50000, schedule: 'Wed/Fri' },
    monthly: { threshold: 50000, dueDay: 15 }
  },
  annualForms: ['W-2', 'W-3', '1099-NEC', '1095-C']
};
