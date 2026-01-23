/**
 * Controller Module - L3 Operations
 *
 * Comprehensive framework for PA County Controller operations
 * Based on Pennsylvania County Code Title 16, Sections 1602-1764
 *
 * @module L3_Operations/controller
 * @authority 16 Pa.C.S. Chapter 16
 */

// Core module exports
export { default as StatutoryDuties } from './StatutoryDuties.js';
export { default as AuditAuthority } from './AuditAuthority.js';
export { default as AuditJurisdiction } from './AuditJurisdiction.js';
export { default as BoardMemberships } from './BoardMemberships.js';
export { default as BudgetCertification } from './BudgetCertification.js';
export { default as DeputyController } from './DeputyController.js';
export { default as Independence } from './Independence.js';
export { default as SalaryBoard } from './SalaryBoard.js';
export { CoreFunctions, getAllFunctions, getFunction, getFunctionsByAuthority } from './CoreFunctions.js';

/**
 * Controller statutory sections (16 Pa.C.S.)
 */
export const StatutorySections = {
  1602: {
    title: 'System of Accounts',
    duty: 'Prescribe the system of accounts to be maintained',
    category: 'accounting'
  },
  1704: {
    title: 'Custody of Documents',
    duty: 'Maintain custody of all contracts, titles, and deeds',
    category: 'records'
  },
  1705: {
    title: 'Official Books and Papers',
    duty: 'Prescribe and administer the form and manner of keeping official books',
    category: 'accounting'
  },
  1720: {
    title: 'Audit and Settlement',
    duty: 'Audit, settle, and adjust accounts of all county offices',
    category: 'audit'
  },
  1750: {
    title: 'Claims Against County',
    duty: 'Scrutinize, audit, and decide on all claims against the county',
    category: 'claims'
  },
  1760: {
    title: 'Disbursement of County Moneys',
    duty: 'Oversee all disbursements of county funds',
    category: 'disbursements'
  }
};

/**
 * Controller quality standards
 */
export const QualityStandards = {
  framework: 'Association of Local Government Auditors (ALGA)',
  auditingStandards: 'Government Auditing Standards (Yellow Book)',
  requirements: [
    'External peer review every 3 years',
    'Compliance with Government Auditing Standards',
    'Continuing professional education for audit staff',
    'Independence documentation'
  ]
};

/**
 * Module information
 */
export const moduleInfo = {
  name: 'Controller Module',
  version: '1.0.0',
  authority: '16 Pa.C.S. Chapter 16',
  sections: Object.keys(StatutorySections).length,
  functions: 5,
  boards: 4
};
