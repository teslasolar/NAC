/**
 * @fileoverview Controller independence requirements
 * @module L3/controller/Independence
 * @authority 16 Pa.C.S. §1606
 */

export const Independence = {
  principle: 'Controller Independence',
  authority: '16 Pa.C.S. §1606',
  requirements: {
    elected: true,
    separateBranch: true,
    noExecutiveReporting: true,
    independentBudget: true
  },
  protections: [
    'Elected by voters, not appointed',
    'Cannot be removed except by due process',
    'Independent audit authority',
    'Direct access to all records',
    'Separate office budget'
  ],
  prohibitions: [
    'Cannot hold other county office',
    'Cannot have financial interest in county contracts',
    'Cannot approve own expenses without review'
  ],
  auditIndependence: {
    selfAudit: false,
    externalAuditRequired: true,
    auditCommitteeOversight: true
  },
  ethicsRequirements: {
    financialDisclosure: true,
    conflictOfInterest: true,
    outsideEmployment: 'restricted'
  }
};
