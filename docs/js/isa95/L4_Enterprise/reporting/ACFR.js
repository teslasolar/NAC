/**
 * @fileoverview Annual Comprehensive Financial Report
 * @module L4/reporting/ACFR
 */
export const ACFR = {
  level: 'enterprise',
  standard: 'GASB',
  components: {
    introductory: ['Letter of transmittal', 'Org chart', 'Officials list'],
    financial: ['MD&A', 'Basic statements', 'Notes', 'RSI'],
    statistical: ['10-year trends', 'Demographic data']
  },
  audit: {
    type: 'external',
    standard: 'GAGAS',
    opinion: 'Unmodified target'
  },
  award: {
    target: 'GFOA Certificate of Achievement',
    requirement: 'Exceed minimum requirements'
  }
};
