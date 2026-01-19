/**
 * @fileoverview Audit finding record
 * @module L1/audits/Finding
 */
export const Finding = {
  type: 'Finding',
  fields: {
    id: { type: 'string', required: true },
    auditId: { type: 'string', required: true },
    title: { type: 'string', maxLength: 100 },
    condition: { type: 'string' },
    criteria: { type: 'string' },
    cause: { type: 'string' },
    effect: { type: 'string' },
    recommendation: { type: 'string' },
    severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
    status: { type: 'string', enum: ['open', 'in_progress', 'resolved', 'closed'] }
  }
};
