/**
 * L3 Operations Layer - Manufacturing Operations Management
 *
 * ISA-95 Level 3: Manufacturing operations and execution
 * Contains operational modules for controller, row officers, governance, fiscal, and admin.
 *
 * @module L3_Operations
 * @standard ISA-95 Level 3
 */

// Controller module
export {
  StatutorySections,
  QualityStandards,
  moduleInfo as controllerModuleInfo
} from './controller/index.js';

export {
  CoreFunctions,
  getAllFunctions,
  getFunction,
  getFunctionsByAuthority
} from './controller/CoreFunctions.js';

// Row Officers
export {
  RowOfficers,
  getOfficer,
  getAllOfficers,
  getOfficersByFunction
} from './rowOfficers/index.js';

// Governance
export { default as CouncilInterface } from './governance/CouncilInterface.js';
export { default as JudicialReporting } from './governance/JudicialReporting.js';
export { default as ElectedOfficers } from './governance/ElectedOfficers.js';

// Fiscal Operations
export { default as AccountsPayable } from './fiscal/AccountsPayable.js';
export { default as PayrollOps } from './fiscal/PayrollOps.js';

// Administrative
export { default as RecordsCustody } from './admin/RecordsCustody.js';

// Individual Controller components (for selective imports)
export { default as StatutoryDuties } from './controller/StatutoryDuties.js';
export { default as AuditAuthority } from './controller/AuditAuthority.js';
export { default as AuditJurisdiction } from './controller/AuditJurisdiction.js';
export { default as BoardMemberships } from './controller/BoardMemberships.js';
export { default as BudgetCertification } from './controller/BudgetCertification.js';
export { default as DeputyController } from './controller/DeputyController.js';
export { default as Independence } from './controller/Independence.js';
export { default as SalaryBoard } from './controller/SalaryBoard.js';

// Individual Row Officers (for selective imports)
export { default as Sheriff } from './rowOfficers/Sheriff.js';
export { default as Treasurer } from './rowOfficers/Treasurer.js';
export { default as Coroner } from './rowOfficers/Coroner.js';
export { default as DistrictAttorney } from './rowOfficers/DistrictAttorney.js';
export { default as RecorderOfDeeds } from './rowOfficers/RecorderOfDeeds.js';
export { default as RegisterOfWills } from './rowOfficers/RegisterOfWills.js';
export { default as ClerkOfCourts } from './rowOfficers/ClerkOfCourts.js';
export { default as Prothonotary } from './rowOfficers/Prothonotary.js';

/**
 * Operations categories
 */
export const OperationsCategories = {
  CONTROLLER: {
    description: 'County Controller statutory functions',
    authority: '16 Pa.C.S. Chapter 16',
    components: ['StatutoryDuties', 'AuditAuthority', 'AuditJurisdiction', 'BoardMemberships',
                 'BudgetCertification', 'DeputyController', 'Independence', 'SalaryBoard', 'CoreFunctions']
  },
  ROW_OFFICERS: {
    description: 'Elected row office operations',
    officers: ['Sheriff', 'Treasurer', 'Coroner', 'DistrictAttorney',
               'RecorderOfDeeds', 'RegisterOfWills', 'ClerkOfCourts', 'Prothonotary']
  },
  GOVERNANCE: {
    description: 'County governance interfaces',
    components: ['CouncilInterface', 'JudicialReporting', 'ElectedOfficers']
  },
  FISCAL: {
    description: 'Fiscal operations',
    components: ['AccountsPayable', 'PayrollOps']
  },
  ADMIN: {
    description: 'Administrative functions',
    components: ['RecordsCustody']
  }
};

/**
 * Module information
 */
export const moduleInfo = {
  name: 'L3 Operations Layer',
  version: '1.0.0',
  standard: 'ISA-95 Level 3',
  description: 'Manufacturing operations management for county government',
  jurisdiction: 'Northampton County, PA',
  authority: '16 Pa.C.S. (County Code)',
  categories: Object.keys(OperationsCategories),
  rowOfficerCount: 8,
  controllerFunctions: 5
};
