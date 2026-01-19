/**
 * @fileoverview Annual audit plan process
 * @module L2/audit/AuditPlan
 */
export const AuditPlan = {
  process: 'AuditPlan',
  authority: '16 Pa.C.S. §1720-1721',
  phases: ['planning', 'fieldwork', 'reporting', 'followup'],
  required: {
    rowOffices: ['recorder', 'register', 'prothonotary', 'clerk', 'sheriff'],
    mdjOffices: 'all',
    taxCollectors: 'rotation'
  },
  outputs: ['engagement_letter', 'audit_program', 'timeline'],
  generate: (fiscalYear, riskScores) => ({
    year: fiscalYear,
    engagements: Object.entries(riskScores)
      .sort((a, b) => b[1] - a[1])
      .map(([entity, score]) => ({ entity, score, priority: score > 66 ? 1 : 2 }))
  })
};
