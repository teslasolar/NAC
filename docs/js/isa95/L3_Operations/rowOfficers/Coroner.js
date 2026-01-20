/**
 * @fileoverview Coroner office audit module
 * @module L3/rowOfficers/Coroner
 * @authority 16 Pa.C.S. §701-708
 */

export const Coroner = {
  office: 'Coroner',
  authority: '16 Pa.C.S. Article VII',
  term: 4,
  elected: true,
  bondRequired: true,

  duties: {
    deathInvestigation: 'Investigate deaths per statute',
    inquests: 'Conduct coroner inquests',
    certification: 'Issue death certificates',
    evidence: 'Preserve physical evidence'
  },

  auditAreas: {
    caseAccounting: {
      description: 'Track all death investigations',
      frequency: 'Annual',
      metrics: ['cases opened', 'cases closed', 'pending']
    },
    feeCollection: {
      description: 'Cremation permits, copies, certifications',
      frequency: 'Annual',
      reconcileTo: 'Treasurer deposits'
    },
    budgetCompliance: {
      description: 'Operating within appropriations',
      frequency: 'Monthly',
      items: ['autopsies', 'transport', 'supplies']
    },
    propertyControl: {
      description: 'Decedent property custody',
      frequency: 'Annual',
      controls: 'Chain of custody documentation'
    }
  },

  reportingRequirements: {
    monthly: 'Case statistics to Controller',
    annual: 'Financial audit and case review'
  }
};
