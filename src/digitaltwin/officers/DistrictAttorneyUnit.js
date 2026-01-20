/**
 * District Attorney Production Unit - Digital Twin Model
 *
 * Models the DA's office as a production facility with assembly lines for:
 * - Criminal Prosecution (case processing)
 * - Forfeiture Funds (asset forfeiture management)
 * - Grant Management (federal/state grant compliance)
 * - Restitution (victim restitution collection)
 *
 * @module digitaltwin/officers/DistrictAttorneyUnit
 * @authority 16 Pa.C.S. Article VIII (§801-808)
 */

import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../../isa88/ProductionUnit.js';

export const DAWorkItemTypes = {
  // Criminal Prosecution
  CASE_REFERRED: 'case_referred',
  CASE_REVIEWED: 'case_reviewed',
  CHARGES_FILED: 'charges_filed',
  CASE_ADJUDICATED: 'case_adjudicated',

  // Forfeiture
  ASSET_SEIZED: 'asset_seized',
  FORFEITURE_PETITION: 'forfeiture_petition',
  FORFEITURE_ORDERED: 'forfeiture_ordered',
  ASSET_LIQUIDATED: 'asset_liquidated',

  // Grants
  GRANT_APPLICATION: 'grant_application',
  GRANT_AWARDED: 'grant_awarded',
  GRANT_EXPENDITURE: 'grant_expenditure',
  GRANT_REPORT: 'grant_report',

  // Restitution
  RESTITUTION_ORDERED: 'restitution_ordered',
  RESTITUTION_PAYMENT: 'restitution_payment',
  RESTITUTION_DISBURSED: 'restitution_disbursed'
};

/**
 * Create Criminal Prosecution Assembly Line
 */
function createProsecutionLine() {
  const line = new AssemblyLine({
    id: 'prosecution',
    name: 'Criminal Prosecution Line',
    description: 'Processing criminal cases from referral to adjudication',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'case-intake',
    name: 'Case Intake',
    description: 'Receive case referrals from police',
    capacity: 20,
    cycleTime: 30 * 60 * 1000, // 30 minutes
    inputTypes: [DAWorkItemTypes.CASE_REFERRED],
    outputType: DAWorkItemTypes.CASE_REVIEWED,
    requiredSkills: ['legal-intake', 'case-management'],
    equipment: ['case-management-system']
  }));

  line.addStation(new WorkStation({
    id: 'case-review',
    name: 'Case Review',
    description: 'ADA reviews for charges',
    capacity: 10,
    cycleTime: 2 * 60 * 60 * 1000, // 2 hours
    inputTypes: [DAWorkItemTypes.CASE_REVIEWED],
    outputType: DAWorkItemTypes.CHARGES_FILED,
    requiredSkills: ['prosecution', 'legal-analysis'],
    equipment: ['case-management-system', 'legal-research']
  }));

  line.addStation(new WorkStation({
    id: 'preliminary-hearing',
    name: 'Preliminary Hearing',
    description: 'Present case at preliminary hearing',
    capacity: 5,
    cycleTime: 1 * 60 * 60 * 1000, // 1 hour
    inputTypes: [DAWorkItemTypes.CHARGES_FILED],
    outputType: 'bound_over',
    requiredSkills: ['courtroom', 'prosecution'],
    equipment: ['courtroom-tech']
  }));

  line.addStation(new WorkStation({
    id: 'trial-prep',
    name: 'Trial Preparation',
    description: 'Prepare case for trial',
    capacity: 8,
    cycleTime: 20 * 60 * 60 * 1000, // 20 hours
    inputTypes: ['bound_over'],
    outputType: 'trial_ready',
    requiredSkills: ['trial-prep', 'witness-coordination'],
    equipment: ['case-management-system', 'evidence-management']
  }));

  line.addStation(new WorkStation({
    id: 'trial',
    name: 'Trial/Plea',
    description: 'Trial or plea negotiation',
    capacity: 6,
    cycleTime: 8 * 60 * 60 * 1000, // 8 hours average
    inputTypes: ['trial_ready'],
    outputType: DAWorkItemTypes.CASE_ADJUDICATED,
    requiredSkills: ['trial-advocacy', 'negotiation'],
    equipment: ['courtroom-tech']
  }));

  return line;
}

/**
 * Create Forfeiture Funds Line per 42 Pa.C.S. §6801
 */
function createForfeitureLine() {
  const line = new AssemblyLine({
    id: 'forfeiture',
    name: 'Asset Forfeiture Line',
    description: 'Managing asset forfeiture per 42 Pa.C.S. §6801',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'seizure-intake',
    name: 'Seizure Intake',
    description: 'Receive notice of asset seizure from police',
    capacity: 5,
    cycleTime: 30 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.ASSET_SEIZED],
    outputType: DAWorkItemTypes.FORFEITURE_PETITION,
    requiredSkills: ['forfeiture-law', 'documentation'],
    equipment: ['forfeiture-tracking-system']
  }));

  line.addStation(new WorkStation({
    id: 'petition-filing',
    name: 'Petition Filing',
    description: 'File forfeiture petition with court',
    capacity: 3,
    cycleTime: 2 * 60 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.FORFEITURE_PETITION],
    outputType: 'petition_filed',
    requiredSkills: ['legal-drafting', 'e-filing'],
    equipment: ['legal-drafting-system', 'e-filing']
  }));

  line.addStation(new WorkStation({
    id: 'forfeiture-hearing',
    name: 'Forfeiture Hearing',
    description: 'Present case at forfeiture hearing',
    capacity: 2,
    cycleTime: 1 * 60 * 60 * 1000,
    inputTypes: ['petition_filed'],
    outputType: DAWorkItemTypes.FORFEITURE_ORDERED,
    requiredSkills: ['courtroom', 'forfeiture-law'],
    equipment: ['courtroom-tech']
  }));

  line.addStation(new WorkStation({
    id: 'asset-liquidation',
    name: 'Asset Liquidation',
    description: 'Convert assets to cash per court order',
    capacity: 5,
    cycleTime: 30 * 24 * 60 * 60 * 1000, // 30 days
    inputTypes: [DAWorkItemTypes.FORFEITURE_ORDERED],
    outputType: DAWorkItemTypes.ASSET_LIQUIDATED,
    requiredSkills: ['asset-management', 'auction'],
    equipment: ['asset-tracking', 'auction-system']
  }));

  line.addStation(new WorkStation({
    id: 'fund-accounting',
    name: 'Fund Accounting',
    description: 'Deposit to forfeiture fund, track permitted uses',
    capacity: 2,
    cycleTime: 1 * 60 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.ASSET_LIQUIDATED],
    outputType: 'completed',
    requiredSkills: ['fund-accounting', 'compliance'],
    equipment: ['accounting-system']
  }));

  return line;
}

/**
 * Create Grant Management Line
 */
function createGrantLine() {
  const line = new AssemblyLine({
    id: 'grants',
    name: 'Grant Management Line',
    description: 'Managing federal and state grants (PCCD, VOCA, JAG)',
    layout: 'u-shape'
  });

  line.addStation(new WorkStation({
    id: 'grant-application',
    name: 'Grant Application',
    description: 'Prepare and submit grant applications',
    capacity: 2,
    cycleTime: 40 * 60 * 60 * 1000, // 40 hours
    inputTypes: [DAWorkItemTypes.GRANT_APPLICATION],
    outputType: DAWorkItemTypes.GRANT_AWARDED,
    requiredSkills: ['grant-writing', 'budgeting'],
    equipment: ['grant-portal', 'budgeting-system']
  }));

  line.addStation(new WorkStation({
    id: 'grant-setup',
    name: 'Grant Setup',
    description: 'Set up grant accounting and compliance tracking',
    capacity: 1,
    cycleTime: 4 * 60 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.GRANT_AWARDED],
    outputType: 'grant_active',
    requiredSkills: ['grant-accounting', 'compliance'],
    equipment: ['accounting-system', 'compliance-tracker']
  }));

  line.addStation(new WorkStation({
    id: 'expenditure-processing',
    name: 'Expenditure Processing',
    description: 'Process grant expenditures per terms',
    capacity: 5,
    cycleTime: 30 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.GRANT_EXPENDITURE],
    outputType: 'expenditure_recorded',
    requiredSkills: ['grant-accounting'],
    equipment: ['accounting-system']
  }));

  line.addStation(new WorkStation({
    id: 'grant-reporting',
    name: 'Grant Reporting',
    description: 'Prepare and submit required reports',
    capacity: 2,
    cycleTime: 8 * 60 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.GRANT_REPORT],
    outputType: 'completed',
    requiredSkills: ['grant-reporting', 'compliance'],
    equipment: ['grant-portal', 'reporting-system']
  }));

  return line;
}

/**
 * Create Restitution Line
 */
function createRestitutionLine() {
  const line = new AssemblyLine({
    id: 'restitution',
    name: 'Victim Restitution Line',
    description: 'Collecting and disbursing victim restitution',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'restitution-order',
    name: 'Order Processing',
    description: 'Receive restitution orders from court',
    capacity: 10,
    cycleTime: 15 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.RESTITUTION_ORDERED],
    outputType: 'order_recorded',
    requiredSkills: ['data-entry', 'case-management'],
    equipment: ['restitution-tracking-system']
  }));

  line.addStation(new WorkStation({
    id: 'payment-collection',
    name: 'Payment Collection',
    description: 'Collect payments from defendants',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.RESTITUTION_PAYMENT],
    outputType: 'payment_received',
    requiredSkills: ['collections', 'customer-service'],
    equipment: ['payment-system']
  }));

  line.addStation(new WorkStation({
    id: 'victim-disbursement',
    name: 'Victim Disbursement',
    description: 'Disburse funds to victims',
    capacity: 5,
    cycleTime: 20 * 60 * 1000,
    inputTypes: [DAWorkItemTypes.RESTITUTION_DISBURSED],
    outputType: 'completed',
    requiredSkills: ['disbursement', 'victim-services'],
    equipment: ['check-printer', 'victim-database']
  }));

  return line;
}

export function createDistrictAttorneyUnit() {
  const unit = new ProductionUnit({
    id: 'district-attorney',
    name: 'District Attorney\'s Office',
    type: 'row_officer',
    authority: '16 Pa.C.S. Article VIII (§801-808)',
    description: 'Criminal prosecution, asset forfeiture, grant management, restitution',
    staffing: {
      fte: 35,
      positions: [
        { title: 'District Attorney', count: 1, elected: true },
        { title: 'First Assistant DA', count: 1 },
        { title: 'Assistant District Attorney', count: 20 },
        { title: 'Detective', count: 5 },
        { title: 'Victim Advocate', count: 3 },
        { title: 'Administrative Staff', count: 5 }
      ]
    },
    operatingHours: { start: 8, end: 17 },
    position: { x: 300, y: 0, z: 0 },
    dimensions: { width: 55, height: 7, depth: 35 }
  });

  unit.addLine(createProsecutionLine());
  unit.addLine(createForfeitureLine());
  unit.addLine(createGrantLine());
  unit.addLine(createRestitutionLine());

  return unit;
}

export function createDAWorkItems() {
  return {
    caseReferral: (id, defendant, charges, agency) => new WorkItem(
      `case-${id}`,
      DAWorkItemTypes.CASE_REFERRED,
      { defendant, charges, agency }
    ),
    seizure: (id, assetDescription, value, caseNumber) => new WorkItem(
      `seizure-${id}`,
      DAWorkItemTypes.ASSET_SEIZED,
      { assetDescription, value, caseNumber }
    ),
    restitutionPayment: (id, defendant, victim, amount) => new WorkItem(
      `restitution-${id}`,
      DAWorkItemTypes.RESTITUTION_PAYMENT,
      { defendant, victim, amount }
    )
  };
}

export default createDistrictAttorneyUnit;
