/**
 * @fileoverview Clerk of Courts office audit module
 * @module L3/rowOfficers/ClerkOfCourts
 * @authority 16 Pa.C.S. §601-608
 */

export const ClerkOfCourts = {
  office: 'Clerk of Courts',
  authority: '16 Pa.C.S. Article VI',
  term: 4,
  elected: true,
  bondRequired: true,

  duties: {
    criminal: 'Maintain criminal court records',
    civil: 'Process civil court filings',
    fees: 'Collect and remit court fees',
    records: 'Custodian of court documents'
  },

  auditAreas: {
    feeCollection: {
      description: 'All fees collected for court services',
      frequency: 'Annual',
      reconcileTo: 'Treasurer deposits'
    },
    caseManagement: {
      description: 'Case filing and disposition tracking',
      frequency: 'Annual',
      compliance: 'State reporting requirements'
    },
    cashHandling: {
      description: 'Cash receipts and deposits',
      frequency: 'Monthly',
      controls: 'Segregation of duties'
    },
    bondCompliance: {
      description: 'Surety bond adequacy',
      frequency: 'Annual',
      amount: 'Per Salary Board'
    }
  },

  feeSchedule: {
    authority: '42 Pa.C.S. §1725',
    categories: ['filing fees', 'certification fees', 'copy fees', 'subpoena fees']
  },

  reportingRequirements: {
    monthly: 'Fee collection report to Controller',
    quarterly: 'Case statistics to AOPC',
    annual: 'Financial statement audit'
  }
};
