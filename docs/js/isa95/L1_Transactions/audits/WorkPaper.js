/**
 * @fileoverview Audit work paper reference
 * @module L1/audits/WorkPaper
 */
export const WorkPaper = {
  type: 'WorkPaper',
  fields: {
    id: { type: 'string', required: true },
    auditId: { type: 'string', required: true },
    reference: { type: 'string' },
    title: { type: 'string' },
    preparedBy: { type: 'Person' },
    preparedDate: { type: 'Date' },
    reviewedBy: { type: 'Person' },
    reviewedDate: { type: 'Date' },
    objective: { type: 'string' },
    conclusion: { type: 'string' },
    attachments: { type: 'array', items: 'string' }
  }
};
