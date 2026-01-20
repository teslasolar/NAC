/**
 * Clerk of Courts Production Unit - Digital Twin Model
 *
 * Models the Clerk's office as a production facility with assembly lines for:
 * - Criminal Case Filing (criminal court records)
 * - Civil Case Processing (civil filings)
 * - Fee Collection (court fees)
 * - Records Management (document custody)
 *
 * @module digitaltwin/officers/ClerkOfCourtsUnit
 * @authority 16 Pa.C.S. Article VI (§601-608)
 */

import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../../isa88/ProductionUnit.js';

export const ClerkWorkItemTypes = {
  // Criminal Cases
  CRIMINAL_FILED: 'criminal_filed',
  CRIMINAL_DOCKETED: 'criminal_docketed',
  CRIMINAL_DISPOSED: 'criminal_disposed',

  // Civil Cases
  CIVIL_FILED: 'civil_filed',
  CIVIL_DOCKETED: 'civil_docketed',

  // Fees
  FEE_ASSESSED: 'fee_assessed',
  FEE_COLLECTED: 'fee_collected',

  // Records
  RECORD_REQUEST: 'record_request',
  CERTIFICATION_REQUEST: 'certification_request',
  SUBPOENA_ISSUED: 'subpoena_issued'
};

/**
 * Create Criminal Case Filing Line
 */
function createCriminalFilingLine() {
  const line = new AssemblyLine({
    id: 'criminal-filing',
    name: 'Criminal Case Line',
    description: 'Processing criminal court filings and dispositions',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'criminal-intake',
    name: 'Criminal Intake',
    description: 'Receive informations and indictments from DA',
    capacity: 10,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [ClerkWorkItemTypes.CRIMINAL_FILED],
    outputType: ClerkWorkItemTypes.CRIMINAL_DOCKETED,
    requiredSkills: ['criminal-filing', 'data-entry'],
    equipment: ['case-management-system']
  }));

  line.addStation(new WorkStation({
    id: 'criminal-docketing',
    name: 'Criminal Docketing',
    description: 'Enter case on criminal docket',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: [ClerkWorkItemTypes.CRIMINAL_DOCKETED],
    outputType: 'case_docketed',
    requiredSkills: ['docketing'],
    equipment: ['docket-system']
  }));

  line.addStation(new WorkStation({
    id: 'scheduling',
    name: 'Court Scheduling',
    description: 'Schedule hearings and trials',
    capacity: 3,
    cycleTime: 10 * 60 * 1000,
    inputTypes: ['case_docketed'],
    outputType: 'case_scheduled',
    requiredSkills: ['scheduling', 'court-calendar'],
    equipment: ['scheduling-system']
  }));

  line.addStation(new WorkStation({
    id: 'disposition-entry',
    name: 'Disposition Entry',
    description: 'Record case dispositions and sentences',
    capacity: 5,
    cycleTime: 20 * 60 * 1000,
    inputTypes: [ClerkWorkItemTypes.CRIMINAL_DISPOSED],
    outputType: 'completed',
    requiredSkills: ['disposition-entry', 'sentencing'],
    equipment: ['case-management-system']
  }));

  line.addStation(new WorkStation({
    id: 'aopc-reporting',
    name: 'AOPC Reporting',
    description: 'Report statistics to Administrative Office of PA Courts',
    capacity: 1,
    cycleTime: 4 * 60 * 60 * 1000, // Quarterly
    inputTypes: ['quarterly_report'],
    outputType: 'completed',
    requiredSkills: ['state-reporting'],
    equipment: ['aopc-portal']
  }));

  return line;
}

/**
 * Create Fee Collection Line per 42 Pa.C.S. §1725
 */
function createFeeCollectionLine() {
  const line = new AssemblyLine({
    id: 'fee-collection',
    name: 'Fee Collection Line',
    description: 'Processing court fees per 42 Pa.C.S. §1725',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'fee-assessment',
    name: 'Fee Assessment',
    description: 'Assess fees per statutory schedule',
    capacity: 10,
    cycleTime: 5 * 60 * 1000, // 5 minutes
    inputTypes: [ClerkWorkItemTypes.FEE_ASSESSED],
    outputType: 'fee_calculated',
    requiredSkills: ['fee-calculation'],
    equipment: ['fee-schedule', 'calculator']
  }));

  line.addStation(new WorkStation({
    id: 'fee-collection',
    name: 'Fee Collection',
    description: 'Collect filing fees, certification fees, copy fees',
    capacity: 5,
    cycleTime: 5 * 60 * 1000,
    inputTypes: ['fee_calculated'],
    outputType: ClerkWorkItemTypes.FEE_COLLECTED,
    requiredSkills: ['cash-handling', 'receipting'],
    equipment: ['cash-register', 'receipt-printer']
  }));

  line.addStation(new WorkStation({
    id: 'daily-deposit',
    name: 'Daily Deposit',
    description: 'Prepare daily deposit to Treasurer',
    capacity: 1,
    cycleTime: 30 * 60 * 1000,
    inputTypes: ['daily_close'],
    outputType: 'deposited',
    requiredSkills: ['cash-handling', 'reconciliation'],
    equipment: ['deposit-system', 'safe']
  }));

  line.addStation(new WorkStation({
    id: 'controller-report',
    name: 'Controller Report',
    description: 'Monthly fee collection report to Controller',
    capacity: 1,
    cycleTime: 2 * 60 * 60 * 1000, // Monthly
    inputTypes: ['monthly_close'],
    outputType: 'completed',
    requiredSkills: ['reporting'],
    equipment: ['reporting-system']
  }));

  return line;
}

/**
 * Create Records Management Line
 */
function createRecordsManagementLine() {
  const line = new AssemblyLine({
    id: 'records-management',
    name: 'Records Management Line',
    description: 'Managing court records and providing copies',
    layout: 'parallel'
  });

  line.addStation(new WorkStation({
    id: 'record-search',
    name: 'Record Search',
    description: 'Search court records for public/attorneys',
    capacity: 4,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [ClerkWorkItemTypes.RECORD_REQUEST],
    outputType: 'record_found',
    requiredSkills: ['records-search', 'customer-service'],
    equipment: ['search-terminal', 'archive-access']
  }));

  line.addStation(new WorkStation({
    id: 'certification',
    name: 'Certification Station',
    description: 'Certify copies of court documents',
    capacity: 3,
    cycleTime: 10 * 60 * 1000,
    inputTypes: [ClerkWorkItemTypes.CERTIFICATION_REQUEST],
    outputType: 'certified',
    requiredSkills: ['certification'],
    equipment: ['copy-machine', 'seal', 'certification-stamp']
  }));

  line.addStation(new WorkStation({
    id: 'subpoena-issuance',
    name: 'Subpoena Issuance',
    description: 'Issue subpoenas for court appearances',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: [ClerkWorkItemTypes.SUBPOENA_ISSUED],
    outputType: 'completed',
    requiredSkills: ['subpoena-processing'],
    equipment: ['subpoena-system', 'seal']
  }));

  line.addStation(new WorkStation({
    id: 'archive',
    name: 'Archive Management',
    description: 'Maintain and preserve court records',
    capacity: 2,
    cycleTime: 30 * 60 * 1000,
    inputTypes: ['archive_request'],
    outputType: 'archived',
    requiredSkills: ['records-management', 'preservation'],
    equipment: ['archive-system', 'climate-control']
  }));

  return line;
}

/**
 * Create Bail/Bond Processing Line
 */
function createBailBondLine() {
  const line = new AssemblyLine({
    id: 'bail-bond',
    name: 'Bail/Bond Line',
    description: 'Processing bail and bond postings',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'bail-posting',
    name: 'Bail Posting',
    description: 'Accept and record bail postings',
    capacity: 3,
    cycleTime: 20 * 60 * 1000,
    inputTypes: ['bail_posted'],
    outputType: 'bail_recorded',
    requiredSkills: ['bail-processing', 'cash-handling'],
    equipment: ['bail-system', 'safe']
  }));

  line.addStation(new WorkStation({
    id: 'bond-processing',
    name: 'Bond Processing',
    description: 'Process surety bonds from bail bondsmen',
    capacity: 3,
    cycleTime: 15 * 60 * 1000,
    inputTypes: ['bond_filed'],
    outputType: 'bond_recorded',
    requiredSkills: ['bond-processing'],
    equipment: ['bond-system']
  }));

  line.addStation(new WorkStation({
    id: 'bail-return',
    name: 'Bail Return',
    description: 'Return bail upon case disposition',
    capacity: 3,
    cycleTime: 30 * 60 * 1000,
    inputTypes: ['bail_return'],
    outputType: 'completed',
    requiredSkills: ['bail-processing', 'disbursement'],
    equipment: ['bail-system', 'check-printer']
  }));

  return line;
}

export function createClerkOfCourtsUnit() {
  const unit = new ProductionUnit({
    id: 'clerk-of-courts',
    name: 'Clerk of Courts',
    type: 'row_officer',
    authority: '16 Pa.C.S. Article VI (§601-608)',
    description: 'Criminal/civil court records, fee collection, records custodian',
    staffing: {
      fte: 18,
      positions: [
        { title: 'Clerk of Courts', count: 1, elected: true },
        { title: 'Chief Deputy', count: 1 },
        { title: 'Criminal Division Clerk', count: 6 },
        { title: 'Civil Division Clerk', count: 4 },
        { title: 'Records Clerk', count: 3 },
        { title: 'Cashier', count: 2 },
        { title: 'Administrative Staff', count: 1 }
      ]
    },
    operatingHours: { start: 8, end: 17 },
    position: { x: 600, y: 0, z: 0 },
    dimensions: { width: 45, height: 6, depth: 30 }
  });

  unit.addLine(createCriminalFilingLine());
  unit.addLine(createFeeCollectionLine());
  unit.addLine(createRecordsManagementLine());
  unit.addLine(createBailBondLine());

  return unit;
}

export function createClerkWorkItems() {
  return {
    criminalFiling: (id, defendant, charges, docketNumber) => new WorkItem(
      `criminal-${id}`,
      ClerkWorkItemTypes.CRIMINAL_FILED,
      { defendant, charges, docketNumber }
    ),
    certificationRequest: (id, caseNumber, documentType) => new WorkItem(
      `cert-${id}`,
      ClerkWorkItemTypes.CERTIFICATION_REQUEST,
      { caseNumber, documentType }
    ),
    feePayment: (id, caseNumber, feeType, amount) => new WorkItem(
      `fee-${id}`,
      ClerkWorkItemTypes.FEE_ASSESSED,
      { caseNumber, feeType, amount }
    )
  };
}

export default createClerkOfCourtsUnit;
