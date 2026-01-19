/**
 * @fileoverview Controller audit authority and access rights
 * @module L3/controller/AuditAuthority
 * @authority 16 Pa.C.S. §1607
 */

export const AuditAuthority = {
  authority: '16 Pa.C.S. §1607',
  accessRights: {
    allRecords: true,
    allAccounts: true,
    allContracts: true,
    allFacilities: true
  },
  scope: [
    'All county departments',
    'All row offices',
    'All authorities',
    'All agencies receiving county funds',
    'All contractors'
  ],
  powers: [
    'Subpoena records',
    'Interview employees',
    'Inspect facilities',
    'Review contracts',
    'Examine bank accounts'
  ],
  limitations: [
    'Attorney-client privilege',
    'Active criminal investigations',
    'Personnel medical records'
  ],
  enforcement: {
    nonCompliance: 'Report to Commissioners',
    escalation: 'Court order',
    penalties: 'Contempt'
  }
};
