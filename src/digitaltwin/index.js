/**
 * Digital Twin Module - County Government Factory Model
 *
 * Exports all components for the NAC digital twin system.
 * Integrates ISA-88 batch control, ISA-95 enterprise structure,
 * and ISA-18.2 alarm management.
 *
 * @module digitaltwin
 */

// Core ISA-88 components
export { PackMLStateMachine, PackMLState, PackMLMode, PackMLTransitions, PackMLStateColors } from '../isa88/PackML.js';
export { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../isa88/ProductionUnit.js';

// Digital Twin orchestrator
export { DigitalTwin, CountyMetrics, createDigitalTwin } from './DigitalTwin.js';

// Configuration loader
export { ConfigLoader, getConfigLoader, createConfiguredTwin } from './ConfigLoader.js';

// Officer production units
export { createSheriffUnit, SheriffWorkItemTypes, createSheriffWorkItems } from './officers/SheriffUnit.js';
export { createTreasurerUnit, TreasurerWorkItemTypes, createTreasurerWorkItems } from './officers/TreasurerUnit.js';
export { createCoronerUnit, CoronerWorkItemTypes, createCoronerWorkItems } from './officers/CoronerUnit.js';
export { createDistrictAttorneyUnit, DAWorkItemTypes, createDAWorkItems } from './officers/DistrictAttorneyUnit.js';
export { createRecorderOfDeedsUnit, RecorderWorkItemTypes, createRecorderWorkItems } from './officers/RecorderOfDeedsUnit.js';
export { createRegisterOfWillsUnit, RegisterWorkItemTypes, createRegisterWorkItems } from './officers/RegisterOfWillsUnit.js';
export { createClerkOfCourtsUnit, ClerkWorkItemTypes, createClerkWorkItems } from './officers/ClerkOfCourtsUnit.js';
export { createProthonotaryUnit, ProthonotaryWorkItemTypes, createProthonotaryWorkItems } from './officers/ProthonotaryUnit.js';

// ISA-95 Layer integration (re-exports for convenience)
export * as L0_Data from '../isa95/L0_Data/index.js';
export * as L1_Transactions from '../isa95/L1_Transactions/index.js';
export * as L2_Control from '../isa95/L2_Control/index.js';
export * as L3_Operations from '../isa95/L3_Operations/index.js';
export * as L4_Enterprise from '../isa95/L4_Enterprise/index.js';

// L2 Control engines
export { WorkflowEngine, WorkflowInstance, createWorkflowEngine } from '../isa95/L2_Control/engine/WorkflowEngine.js';
export { RuleEngine, ValidationResult, createRuleEngine } from '../isa95/L2_Control/engine/RuleEngine.js';

// Alarm management
export { AlarmPriority, AlarmState, CountyAlarmTypes } from '../isa95/L2_Control/alarms/index.js';

// Blockchain signing
export { BlockchainSigner, createBlockchainSigner } from '../isa95/L1_Transactions/signing/BlockchainSigner.js';

/**
 * Quick start function to create and initialize a digital twin
 */
export function quickStart() {
  const twin = createDigitalTwin({
    id: 'northampton-county',
    name: 'Northampton County Government'
  });

  twin.initialize();
  twin.start();

  return twin;
}

/**
 * Create a fully integrated digital twin with engines
 */
export async function createIntegratedTwin() {
  const twin = createDigitalTwin({
    id: 'northampton-county',
    name: 'Northampton County Government'
  });

  // Load workflow engine with config
  const { createWorkflowEngine } = await import('../isa95/L2_Control/engine/WorkflowEngine.js');
  const { createRuleEngine } = await import('../isa95/L2_Control/engine/RuleEngine.js');
  const { createBlockchainSigner } = await import('../isa95/L1_Transactions/signing/BlockchainSigner.js');

  // Attach engines to twin
  twin.workflowEngine = null; // Will be created when config is loaded
  twin.ruleEngine = null;
  twin.blockchainSigner = createBlockchainSigner();

  twin.initialize();

  return twin;
}

/**
 * Module information
 */
export const moduleInfo = {
  name: 'NAC Digital Twin',
  version: '2.0.0',
  description: 'Digital twin of Northampton County government operations',
  standards: ['ISA-95', 'ISA-88', 'ISA-18.2', 'ISA-80085', 'PackML'],
  layers: {
    L0: 'Data definitions, UDTs, schemas',
    L1: 'Transactions with blockchain signing',
    L2: 'Control with workflow and rule engines',
    L3: 'Operations for 8 row officers',
    L4: 'Enterprise policies and reporting'
  },
  units: [
    'Sheriff',
    'Treasurer',
    'Coroner',
    'District Attorney',
    'Recorder of Deeds',
    'Register of Wills',
    'Clerk of Courts',
    'Prothonotary'
  ],
  features: [
    'PackML state machines',
    'Workflow orchestration',
    'Business rule validation',
    'Blockchain audit trails',
    'ISA-18.2 alarm management',
    '3D visualization support'
  ]
};
