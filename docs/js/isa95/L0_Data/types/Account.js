/**
 * @fileoverview Fund/Account code type
 * @module L0/types/Account
 */
export const Account = {
  type: 'Account',
  fields: {
    fund: { type: 'string', length: 2 },
    department: { type: 'string', length: 3 },
    object: { type: 'string', length: 4 },
    project: { type: 'string', length: 4, optional: true }
  },
  format: (v) => `${v.fund}-${v.department}-${v.object}${v.project ? '-' + v.project : ''}`,
  parse: (s) => {
    const p = s.split('-');
    return { fund: p[0], department: p[1], object: p[2], project: p[3] };
  }
};
