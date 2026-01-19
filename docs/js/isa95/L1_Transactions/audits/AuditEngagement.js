/**
 * @fileoverview Audit engagement record
 * @module L1/audits/AuditEngagement
 */
export const AuditEngagement = {
  type: 'AuditEngagement',
  authority: '16 Pa.C.S. §1720',
  fields: {
    id: { type: 'string', required: true },
    auditType: { type: 'AuditType', required: true },
    entity: { type: 'string', required: true },
    period: { type: 'DateRange', required: true },
    leadAuditor: { type: 'Person' },
    status: { type: 'string', enum: ['planning', 'fieldwork', 'reporting', 'closed'] },
    riskScore: { type: 'number', min: 0, max: 100 },
    hoursbudget: { type: 'number' },
    hoursActual: { type: 'number' }
  }
};
