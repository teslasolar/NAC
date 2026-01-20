/**
 * Coroner Production Unit - Digital Twin Model
 *
 * Models the Coroner's office as a production facility with assembly lines for:
 * - Death Investigations (case management)
 * - Cremation Permits (permit processing)
 * - Property Control (decedent effects)
 * - Inquests (formal hearings)
 *
 * @module digitaltwin/officers/CoronerUnit
 * @authority 16 Pa.C.S. Article VII (§701-708)
 */

import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../../isa88/ProductionUnit.js';

export const CoronerWorkItemTypes = {
  // Death Investigation
  DEATH_REPORTED: 'death_reported',
  CASE_OPENED: 'case_opened',
  INVESTIGATION_COMPLETE: 'investigation_complete',
  CASE_CLOSED: 'case_closed',

  // Autopsy
  AUTOPSY_ORDERED: 'autopsy_ordered',
  AUTOPSY_COMPLETE: 'autopsy_complete',

  // Cremation Permits
  PERMIT_REQUEST: 'permit_request',
  PERMIT_REVIEW: 'permit_review',
  PERMIT_ISSUED: 'permit_issued',

  // Property
  PROPERTY_RECEIVED: 'property_received',
  PROPERTY_INVENTORIED: 'property_inventoried',
  PROPERTY_RELEASED: 'property_released',

  // Inquest
  INQUEST_SCHEDULED: 'inquest_scheduled',
  INQUEST_CONDUCTED: 'inquest_conducted'
};

/**
 * Create Death Investigation Assembly Line
 */
function createDeathInvestigationLine() {
  const line = new AssemblyLine({
    id: 'death-investigation',
    name: 'Death Investigation Line',
    description: 'Processing death investigations per statutory requirements',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'death-intake',
    name: 'Case Intake',
    description: 'Receive death reports from hospitals, police, public',
    capacity: 5,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [CoronerWorkItemTypes.DEATH_REPORTED],
    outputType: CoronerWorkItemTypes.CASE_OPENED,
    requiredSkills: ['intake', 'triage'],
    equipment: ['case-management-system', 'phone-system']
  }));

  line.addStation(new WorkStation({
    id: 'scene-investigation',
    name: 'Scene Investigation',
    description: 'Deputy coroner responds to scene',
    capacity: 3,
    cycleTime: 2 * 60 * 60 * 1000, // 2 hours
    inputTypes: [CoronerWorkItemTypes.CASE_OPENED],
    outputType: 'scene_complete',
    requiredSkills: ['death-investigation', 'evidence-collection'],
    equipment: ['investigation-kit', 'camera', 'vehicle']
  }));

  line.addStation(new WorkStation({
    id: 'autopsy-decision',
    name: 'Autopsy Decision',
    description: 'Coroner determines if autopsy required',
    capacity: 1,
    cycleTime: 30 * 60 * 1000, // 30 minutes
    inputTypes: ['scene_complete'],
    outputType: CoronerWorkItemTypes.INVESTIGATION_COMPLETE,
    requiredSkills: ['medical-review', 'legal'],
    equipment: ['case-management-system']
  }));

  line.addStation(new WorkStation({
    id: 'death-certification',
    name: 'Death Certification',
    description: 'Complete death certificate',
    capacity: 2,
    cycleTime: 45 * 60 * 1000, // 45 minutes
    inputTypes: [CoronerWorkItemTypes.INVESTIGATION_COMPLETE],
    outputType: CoronerWorkItemTypes.CASE_CLOSED,
    requiredSkills: ['certification', 'vital-records'],
    equipment: ['edrs-system'] // Electronic Death Registration System
  }));

  return line;
}

/**
 * Create Autopsy Line
 */
function createAutopsyLine() {
  const line = new AssemblyLine({
    id: 'autopsy',
    name: 'Autopsy Line',
    description: 'Processing autopsies when required',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'body-intake',
    name: 'Morgue Intake',
    description: 'Receive and log body at morgue',
    capacity: 2,
    cycleTime: 30 * 60 * 1000,
    inputTypes: [CoronerWorkItemTypes.AUTOPSY_ORDERED],
    outputType: 'body_received',
    requiredSkills: ['morgue-operations'],
    equipment: ['morgue', 'refrigeration', 'logging-system']
  }));

  line.addStation(new WorkStation({
    id: 'autopsy-procedure',
    name: 'Autopsy Suite',
    description: 'Perform autopsy examination',
    capacity: 1,
    cycleTime: 4 * 60 * 60 * 1000, // 4 hours
    inputTypes: ['body_received'],
    outputType: 'autopsy_done',
    requiredSkills: ['pathology', 'autopsy'],
    equipment: ['autopsy-suite', 'instruments', 'photography']
  }));

  line.addStation(new WorkStation({
    id: 'toxicology',
    name: 'Toxicology Lab',
    description: 'Process toxicology samples',
    capacity: 10,
    cycleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    inputTypes: ['autopsy_done'],
    outputType: 'tox_complete',
    requiredSkills: ['toxicology'],
    equipment: ['lab-equipment', 'mass-spec']
  }));

  line.addStation(new WorkStation({
    id: 'autopsy-report',
    name: 'Report Generation',
    description: 'Complete autopsy report',
    capacity: 2,
    cycleTime: 2 * 60 * 60 * 1000, // 2 hours
    inputTypes: ['tox_complete'],
    outputType: CoronerWorkItemTypes.AUTOPSY_COMPLETE,
    requiredSkills: ['medical-writing', 'pathology'],
    equipment: ['dictation-system', 'report-system']
  }));

  return line;
}

/**
 * Create Cremation Permit Line
 */
function createCremationPermitLine() {
  const line = new AssemblyLine({
    id: 'cremation-permits',
    name: 'Cremation Permit Line',
    description: 'Processing cremation permit requests',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'permit-intake',
    name: 'Permit Request Intake',
    description: 'Receive cremation permit applications',
    capacity: 10,
    cycleTime: 10 * 60 * 1000, // 10 minutes
    inputTypes: [CoronerWorkItemTypes.PERMIT_REQUEST],
    outputType: CoronerWorkItemTypes.PERMIT_REVIEW,
    requiredSkills: ['intake', 'verification'],
    equipment: ['permit-system', 'fee-collection']
  }));

  line.addStation(new WorkStation({
    id: 'permit-review',
    name: 'Coroner Review',
    description: 'Coroner reviews for any objections',
    capacity: 1,
    cycleTime: 30 * 60 * 1000, // 30 minutes
    inputTypes: [CoronerWorkItemTypes.PERMIT_REVIEW],
    outputType: CoronerWorkItemTypes.PERMIT_ISSUED,
    requiredSkills: ['medical-review', 'legal'],
    equipment: ['case-review-system']
  }));

  line.addStation(new WorkStation({
    id: 'permit-issuance',
    name: 'Permit Issuance',
    description: 'Issue signed cremation permit',
    capacity: 5,
    cycleTime: 5 * 60 * 1000, // 5 minutes
    inputTypes: [CoronerWorkItemTypes.PERMIT_ISSUED],
    outputType: 'completed',
    requiredSkills: ['document-processing'],
    equipment: ['permit-printer', 'seal']
  }));

  return line;
}

/**
 * Create Property Control Line
 */
function createPropertyControlLine() {
  const line = new AssemblyLine({
    id: 'property-control',
    name: 'Decedent Property Line',
    description: 'Managing decedent personal effects',
    layout: 'u-shape'
  });

  line.addStation(new WorkStation({
    id: 'property-intake',
    name: 'Property Intake',
    description: 'Receive and log decedent property',
    capacity: 5,
    cycleTime: 20 * 60 * 1000,
    inputTypes: [CoronerWorkItemTypes.PROPERTY_RECEIVED],
    outputType: CoronerWorkItemTypes.PROPERTY_INVENTORIED,
    requiredSkills: ['evidence-handling', 'inventory'],
    equipment: ['evidence-bags', 'camera', 'inventory-system']
  }));

  line.addStation(new WorkStation({
    id: 'property-storage',
    name: 'Secure Storage',
    description: 'Store property in secure evidence room',
    capacity: 100,
    cycleTime: 5 * 60 * 1000,
    inputTypes: [CoronerWorkItemTypes.PROPERTY_INVENTORIED],
    outputType: 'property_stored',
    requiredSkills: ['evidence-handling'],
    equipment: ['evidence-room', 'safe']
  }));

  line.addStation(new WorkStation({
    id: 'property-release',
    name: 'Property Release',
    description: 'Release property to next of kin',
    capacity: 3,
    cycleTime: 30 * 60 * 1000,
    inputTypes: [CoronerWorkItemTypes.PROPERTY_RELEASED],
    outputType: 'completed',
    requiredSkills: ['verification', 'customer-service'],
    equipment: ['id-verification', 'release-forms']
  }));

  return line;
}

export function createCoronerUnit() {
  const unit = new ProductionUnit({
    id: 'coroner',
    name: 'Coroner\'s Office',
    type: 'row_officer',
    authority: '16 Pa.C.S. Article VII (§701-708)',
    description: 'Death investigations, autopsies, cremation permits, inquests',
    staffing: {
      fte: 8,
      positions: [
        { title: 'Coroner', count: 1, elected: true },
        { title: 'Chief Deputy Coroner', count: 1 },
        { title: 'Deputy Coroner', count: 4 },
        { title: 'Administrative Staff', count: 2 }
      ]
    },
    operatingHours: { start: 0, end: 24 }, // 24/7 for death response
    position: { x: 200, y: 0, z: 0 },
    dimensions: { width: 40, height: 6, depth: 25 }
  });

  unit.addLine(createDeathInvestigationLine());
  unit.addLine(createAutopsyLine());
  unit.addLine(createCremationPermitLine());
  unit.addLine(createPropertyControlLine());

  return unit;
}

export function createCoronerWorkItems() {
  return {
    deathReport: (id, decedentName, location, reportedBy) => new WorkItem(
      `death-${id}`,
      CoronerWorkItemTypes.DEATH_REPORTED,
      { decedentName, location, reportedBy, priority: 'high' }
    ),
    cremationPermit: (id, decedentName, funeralHome) => new WorkItem(
      `permit-${id}`,
      CoronerWorkItemTypes.PERMIT_REQUEST,
      { decedentName, funeralHome }
    )
  };
}

export default createCoronerUnit;
