/**
 * @fileoverview Row Officer audit modules index
 * @module L3/rowOfficers
 * @description All 8 elected row officers subject to Controller audit
 */

// Clerk of Courts - Article VI
export { ClerkOfCourts } from './ClerkOfCourts.js';

// Coroner - Article VII
export { Coroner } from './Coroner.js';

// District Attorney - Article VIII
export { DistrictAttorney } from './DistrictAttorney.js';

// Prothonotary - Article IX
export { Prothonotary } from './Prothonotary.js';

// Recorder of Deeds - Article X
export { RecorderOfDeeds } from './RecorderOfDeeds.js';

// Register of Wills - Article XI
export { RegisterOfWills } from './RegisterOfWills.js';

// Sheriff - Article XII
export { Sheriff } from './Sheriff.js';

// Treasurer - Article XIII
export { Treasurer } from './Treasurer.js';

export const ROW_OFFICERS = [
  'Clerk of Courts',
  'Coroner',
  'District Attorney',
  'Prothonotary',
  'Recorder of Deeds',
  'Register of Wills',
  'Sheriff',
  'Treasurer'
];

export const AUDIT_REQUIREMENTS = {
  annual: ['fee accounts', 'cash receipts', 'disbursements'],
  bond: 'Required per Article III §306',
  reporting: 'Monthly to Controller per §1720'
};
