/**
 * @fileoverview Legal definitions from PA County Code
 * @module L0/types/LegalDefinitions
 * @authority 16 Pa.C.S. §102
 */

export const LegalDefinitions = {
  type: 'LegalDefinitions',
  authority: '16 Pa.C.S. §102',
  terms: {
    claim: 'Any demand against the county for payment',
    warrant: 'An order for the payment of money from county funds',
    appropriation: 'An authorization to spend from a specific account',
    encumbrance: 'A commitment of appropriated funds for future payment',
    fiscalYear: 'The period from January 1 to December 31',
    controller: 'The elected county controller',
    rowOfficer: 'An elected county official other than commissioners',
    audit: 'Examination of accounts, records, and operations',
    finding: 'A condition identified during audit that requires attention',
    materialWeakness: 'A deficiency likely to result in material misstatement'
  },
  abbreviations: {
    'Pa.C.S.': 'Pennsylvania Consolidated Statutes',
    'GASB': 'Governmental Accounting Standards Board',
    'GAAP': 'Generally Accepted Accounting Principles',
    'GAGAS': 'Generally Accepted Government Auditing Standards'
  }
};
