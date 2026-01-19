/**
 * @fileoverview Judicial branch reporting
 * @module L3/governance/JudicialReporting
 */
export const JudicialReporting = {
  court: 'Court of Common Pleas',
  controllerDuties: {
    treasurerAudit: {
      authority: '16 Pa.C.S. §1723',
      scope: 'State remittances',
      recipient: 'Court'
    },
    probationAudit: {
      scope: 'Court-ordered funds',
      recipient: 'Sentencing court'
    },
    mdjAudit: {
      scope: 'All MDJ offices',
      frequency: 'annual'
    }
  },
  constableBoard: {
    role: 'Member',
    function: 'Fee claim approval'
  }
};
