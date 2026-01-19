/**
 * @fileoverview Controller statutory duties
 * @module L3/controller/StatutoryDuties
 */
export const StatutoryDuties = {
  office: 'Controller',
  authority: '16 Pa.C.S. Article XVII',
  duties: {
    s1602: { title: 'System of Accounts', scope: 'all_offices' },
    s1704: { title: 'Document Custody', scope: 'contracts_deeds' },
    s1705: { title: 'Fiscal Supervision', scope: 'all_fiscal' },
    s1720: { title: 'Audit Settlement', scope: 'all_accounts' },
    s1750: { title: 'Claims Review', scope: 'all_claims' },
    s1760: { title: 'Disbursements', scope: 'all_payments' }
  },
  independence: true,
  electedOffice: true,
  term: 4
};
