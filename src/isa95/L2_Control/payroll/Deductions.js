/**
 * @fileoverview Payroll deduction types
 * @module L2/payroll/Deductions
 */
export const Deductions = {
  process: 'Deductions',
  mandatory: ['federal_tax', 'state_tax', 'local_eit', 'fica', 'garnishments'],
  voluntary: ['health', 'dental', 'vision', 'life', 'retirement', 'deferred_comp', 'union_dues', 'fsa', 'hsa'],
  garnishmentPriority: [
    { type: 'child_support', limit: 0.65 },
    { type: 'tax_levy', limit: 'varies' },
    { type: 'student_loan', limit: 0.15 },
    { type: 'creditor', limit: 0.25 }
  ],
  calculate: (gross, deductions) =>
    gross - deductions.reduce((sum, d) => sum + d.amount, 0)
};
