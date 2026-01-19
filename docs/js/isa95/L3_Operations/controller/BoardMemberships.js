/**
 * @fileoverview Controller board memberships
 * @module L3/controller/BoardMemberships
 */
export const BoardMemberships = {
  office: 'Controller',
  boards: {
    retirement: {
      name: 'Retirement Board',
      role: 'Secretary',
      authority: '16 Pa.C.S. §1653',
      duties: ['Record minutes', 'Manage fund accounting']
    },
    salary: {
      name: 'Salary Board',
      role: 'Member',
      authority: '16 Pa.C.S. §1601',
      duties: ['Vote on compensation', 'Review salary requests']
    },
    prison: {
      name: 'Prison Board',
      role: 'Member',
      duties: ['Fiscal oversight', 'Budget review']
    },
    constable: {
      name: 'Constable Review Board',
      role: 'Member',
      duties: ['Approve fee claims', 'Verify documentation']
    }
  }
};
