/**
 * L4 Enterprise Layer - Business Planning and Logistics
 *
 * ISA-95 Level 4: Business planning, logistics, and enterprise management
 * Contains policy, reporting, and strategic planning modules.
 *
 * @module L4_Enterprise
 * @standard ISA-95 Level 4
 */

// Policy modules
export { default as InternalControl } from './policy/InternalControl.js';
export { default as Ethics } from './policy/Ethics.js';
export { default as FiscalPolicy } from './policy/FiscalPolicy.js';

// Reporting modules
export { default as AnnualReport } from './reporting/AnnualReport.js';
export { default as ACFR } from './reporting/ACFR.js';

// Strategy modules
export { default as Transparency } from './strategy/Transparency.js';
export { default as AuditStrategy } from './strategy/AuditStrategy.js';

/**
 * Configuration paths
 */
export const ConfigPaths = {
  policies: './config/policies.json'
};

/**
 * Load enterprise configuration
 */
export async function loadConfig(configName) {
  const path = ConfigPaths[configName];
  if (!path) {
    throw new Error(`Unknown config: ${configName}`);
  }
  const fs = await import('fs/promises');
  const { dirname, join } = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return JSON.parse(await fs.readFile(join(__dirname, path), 'utf8'));
}

/**
 * Enterprise layer categories
 */
export const EnterpriseCategories = {
  POLICY: {
    description: 'Enterprise policies and internal controls',
    components: ['InternalControl', 'Ethics', 'FiscalPolicy'],
    standards: ['COSO', 'Yellow Book', 'GAGAS']
  },
  REPORTING: {
    description: 'Financial and operational reporting',
    components: ['AnnualReport', 'ACFR'],
    standards: ['GASB', 'GFOA']
  },
  STRATEGY: {
    description: 'Strategic planning and transparency',
    components: ['Transparency', 'AuditStrategy'],
    objectives: ['Accountability', 'Efficiency', 'Public Trust']
  }
};

/**
 * Regulatory frameworks at enterprise level
 */
export const RegulatoryFrameworks = {
  GASB: {
    name: 'Governmental Accounting Standards Board',
    scope: 'Financial reporting standards',
    applicability: 'All governmental entities'
  },
  GAGAS: {
    name: 'Generally Accepted Government Auditing Standards',
    scope: 'Audit standards (Yellow Book)',
    applicability: 'Government audits'
  },
  COSO: {
    name: 'Committee of Sponsoring Organizations',
    scope: 'Internal control framework',
    applicability: 'Enterprise risk management'
  },
  GFOA: {
    name: 'Government Finance Officers Association',
    scope: 'Best practices for government finance',
    applicability: 'Financial management'
  },
  PA_COUNTY_CODE: {
    name: 'Pennsylvania County Code',
    scope: '16 Pa.C.S.',
    applicability: 'All county operations'
  }
};

/**
 * Enterprise reporting schedule
 */
export const ReportingSchedule = {
  ACFR: {
    name: 'Annual Comprehensive Financial Report',
    frequency: 'Annual',
    deadline: 'June 30 (following FY end)',
    recipients: ['State', 'Bond Rating Agencies', 'Public'],
    standard: 'GASB'
  },
  BUDGET: {
    name: 'Annual Budget',
    frequency: 'Annual',
    deadline: 'December 31 (prior to FY)',
    recipients: ['County Council', 'Public'],
    authority: '16 Pa.C.S. §1780'
  },
  QUARTERLY: {
    name: 'Quarterly Financial Report',
    frequency: 'Quarterly',
    deadline: '30 days after quarter end',
    recipients: ['County Council', 'Department Heads']
  },
  SINGLE_AUDIT: {
    name: 'Single Audit Report',
    frequency: 'Annual (if > $750K federal)',
    deadline: '9 months after FY end',
    recipients: ['Federal Audit Clearinghouse'],
    standard: 'Uniform Guidance'
  }
};

/**
 * Module information
 */
export const moduleInfo = {
  name: 'L4 Enterprise Layer',
  version: '1.0.0',
  standard: 'ISA-95 Level 4',
  description: 'Business planning, logistics, and enterprise management',
  categories: Object.keys(EnterpriseCategories),
  frameworks: Object.keys(RegulatoryFrameworks),
  reportingCycles: Object.keys(ReportingSchedule)
};
