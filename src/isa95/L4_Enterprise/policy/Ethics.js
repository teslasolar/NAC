/**
 * @fileoverview Ethics and conduct policy
 * @module L4/policy/Ethics
 */
export const Ethics = {
  level: 'enterprise',
  authority: 'PA Ethics Act',
  requirements: {
    financialDisclosure: 'annual',
    conflictOfInterest: 'disclose and recuse',
    gifts: { limit: 250, lobbyist: 0 },
    postEmployment: '1 year restriction'
  },
  reporting: {
    hotline: true,
    anonymousOk: true,
    retaliation: 'prohibited'
  },
  controllerRole: 'Receive and investigate tips'
};
