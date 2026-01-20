/**
 * Digital Twin Module - County Government Factory Model
 *
 * Exports all components for the NAC digital twin system
 *
 * @module digitaltwin
 */

// Core ISA-88 components
export { PackMLStateMachine, PackMLState, PackMLMode, PackMLTransitions, PackMLStateColors } from '../isa88/PackML.js';
export { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../isa88/ProductionUnit.js';

// Digital Twin orchestrator
export { DigitalTwin, CountyMetrics, createDigitalTwin } from './DigitalTwin.js';

// Officer production units
export { createSheriffUnit, SheriffWorkItemTypes, createSheriffWorkItems } from './officers/SheriffUnit.js';
export { createTreasurerUnit, TreasurerWorkItemTypes, createTreasurerWorkItems } from './officers/TreasurerUnit.js';
export { createCoronerUnit, CoronerWorkItemTypes, createCoronerWorkItems } from './officers/CoronerUnit.js';
export { createDistrictAttorneyUnit, DAWorkItemTypes, createDAWorkItems } from './officers/DistrictAttorneyUnit.js';
export { createRecorderOfDeedsUnit, RecorderWorkItemTypes, createRecorderWorkItems } from './officers/RecorderOfDeedsUnit.js';
export { createRegisterOfWillsUnit, RegisterWorkItemTypes, createRegisterWorkItems } from './officers/RegisterOfWillsUnit.js';
export { createClerkOfCourtsUnit, ClerkWorkItemTypes, createClerkWorkItems } from './officers/ClerkOfCourtsUnit.js';
export { createProthonotaryUnit, ProthonotaryWorkItemTypes, createProthonotaryWorkItems } from './officers/ProthonotaryUnit.js';

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
 * Module information
 */
export const moduleInfo = {
  name: 'NAC Digital Twin',
  version: '1.0.0',
  description: 'Digital twin of Northampton County government operations',
  standards: ['ISA-95', 'ISA-88', 'PackML'],
  units: [
    'Sheriff',
    'Treasurer',
    'Coroner',
    'District Attorney',
    'Recorder of Deeds',
    'Register of Wills',
    'Clerk of Courts',
    'Prothonotary'
  ]
};
