/**
 * @fileoverview Multi-year audit strategy
 * @module L4/strategy/AuditStrategy
 */
export const AuditStrategy = {
  level: 'enterprise',
  horizon: '3_year',
  priorities: [
    'High-risk areas annually',
    'Full coverage in cycle',
    'Follow-up on findings',
    'Continuous improvement'
  ],
  coverage: {
    year1: ['Row offices', 'Major grants'],
    year2: ['Departments', 'MDJs'],
    year3: ['Programs', 'Vendors']
  },
  staffing: {
    model: 'internal + co-source',
    training: 'CPE required'
  }
};
