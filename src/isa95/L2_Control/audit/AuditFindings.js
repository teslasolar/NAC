/**
 * @fileoverview Audit findings management
 * @module L2/audit/AuditFindings
 * @authority 16 Pa.C.S. §1727
 */

export const AuditFindings = {
  process: 'AuditFindings',
  authority: '16 Pa.C.S. §1727',
  severityLevels: {
    materialWeakness: { priority: 1, reportingRequired: true },
    significantDeficiency: { priority: 2, reportingRequired: true },
    deficiency: { priority: 3, reportingRequired: false },
    observation: { priority: 4, reportingRequired: false }
  },
  findingElements: [
    'Condition (what we found)',
    'Criteria (what should be)',
    'Cause (why it happened)',
    'Effect (impact/risk)',
    'Recommendation'
  ],
  responseProcess: {
    draftFinding: 'Controller prepares',
    managementResponse: '15 business days',
    finalReport: 'Include response',
    followUp: 'Next audit cycle'
  },
  tracking: {
    openFindings: true,
    correctiveActions: true,
    statusUpdates: 'quarterly',
    closureCriteria: 'Implementation verified'
  },
  escalation: {
    unresolved30Days: 'Notify Commissioners',
    unresolved90Days: 'Public report',
    fraud: 'Immediate referral'
  }
};
