/**
 * @fileoverview Fiscal year type definition
 * @module L0/types/FiscalYear
 * @authority 16 Pa.C.S. §1701
 */

export const FiscalYear = {
  type: 'FiscalYear',
  authority: '16 Pa.C.S. §1701',
  definition: {
    startMonth: 1,
    startDay: 1,
    endMonth: 12,
    endDay: 31,
    calendarYear: true
  },
  periods: {
    q1: { start: '01-01', end: '03-31' },
    q2: { start: '04-01', end: '06-30' },
    q3: { start: '07-01', end: '09-30' },
    q4: { start: '10-01', end: '12-31' }
  },
  validation: (year) => {
    return Number.isInteger(year) && year >= 1900 && year <= 2100;
  },
  format: (year) => `FY${year}`,
  current: () => new Date().getFullYear(),
  isClosed: (year) => year < new Date().getFullYear()
};
