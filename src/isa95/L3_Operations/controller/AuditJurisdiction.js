/**
 * @fileoverview Controller audit jurisdiction
 * @module L3/controller/AuditJurisdiction
 */
export const AuditJurisdiction = {
  office: 'Controller',
  mandatory: {
    rowOffices: ['Recorder', 'Register', 'Prothonotary', 'Clerk', 'Sheriff'],
    mdjOffices: 'all',
    treasurer: 'stateRemittances',
    probation: 'courtOrderedFunds'
  },
  discretionary: {
    departments: 'risk_based',
    programs: 'grant_compliance',
    vendors: 'contract_audit'
  },
  reporting: {
    council: 'quarterly',
    court: 'as_required',
    public: 'annual_report'
  }
};
