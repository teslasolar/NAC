/**
 * L0 Data Layer - Process Instrumentation
 *
 * ISA-95 Level 0: Field devices and data acquisition
 * Contains base types, enums, schemas, and UDT definitions.
 *
 * @module L0_Data
 * @standard ISA-95 Level 0
 */

// Base Types
export { Money } from './types/Money.js';
export { Account } from './types/Account.js';
export { Person } from './types/Person.js';
export { CodeSection } from './types/CodeSection.js';
export { DateRange } from './types/DateRange.js';
export { FiscalYear } from './types/FiscalYear.js';
export { LegalDefinitions } from './types/LegalDefinitions.js';

// Enumerations
export { FundType } from './enums/FundType.js';
export { AuditType } from './enums/AuditType.js';
export { ClaimStatus } from './enums/ClaimStatus.js';
export { Department } from './enums/Department.js';

/**
 * UDT (User Defined Type) Definitions
 * These are JSON schemas - load via ConfigLoader
 */
export const UDTTypes = {
  Station: './udt/base/UDT_Station.json',
  AssemblyLine: './udt/base/UDT_AssemblyLine.json',
  ProductionUnit: './udt/base/UDT_ProductionUnit.json',
  WorkItem: './udt/base/UDT_WorkItem.json',
  Alarm: './udt/base/UDT_Alarm.json'
};

/**
 * JSON Schemas for validation
 */
export const Schemas = {
  Money: './schemas/Money.schema.json',
  Account: './schemas/Account.schema.json',
  Claim: './schemas/Claim.schema.json',
  Finding: './schemas/Finding.schema.json',
  AuditEngagement: './schemas/AuditEngagement.schema.json'
};

/**
 * Configuration data paths
 */
export const ConfigPaths = {
  packmlStates: './config/packml-states.json',
  workItemTypes: './config/work-item-types.json',
  skillsEquipment: './config/skills-equipment.json'
};

/**
 * Load a JSON configuration file
 */
export async function loadConfig(configPath) {
  const fs = await import('fs/promises');
  const path = await import('path');
  const fullPath = path.join(import.meta.url.replace('file://', '').replace('/index.js', ''), configPath);
  return JSON.parse(await fs.readFile(fullPath.replace('file:', ''), 'utf8'));
}

/**
 * Load a UDT definition
 */
export async function loadUDT(udtType) {
  const path = UDTTypes[udtType];
  if (!path) {
    throw new Error(`Unknown UDT type: ${udtType}`);
  }
  return loadConfig(path);
}

/**
 * Load a JSON schema
 */
export async function loadSchema(schemaType) {
  const path = Schemas[schemaType];
  if (!path) {
    throw new Error(`Unknown schema type: ${schemaType}`);
  }
  return loadConfig(path);
}

/**
 * Module information
 */
export const moduleInfo = {
  name: 'L0 Data Layer',
  version: '1.0.0',
  standard: 'ISA-95 Level 0',
  description: 'Process instrumentation and data definitions',
  components: {
    types: ['Money', 'Account', 'Person', 'CodeSection', 'DateRange', 'FiscalYear', 'LegalDefinitions'],
    enums: ['FundType', 'AuditType', 'ClaimStatus', 'Department'],
    udts: Object.keys(UDTTypes),
    schemas: Object.keys(Schemas)
  }
};
