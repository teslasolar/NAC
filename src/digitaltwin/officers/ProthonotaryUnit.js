/**
 * Prothonotary Production Unit - Digital Twin Model
 *
 * Models the Prothonotary's office as a production facility with assembly lines for:
 * - Civil Case Filing (civil court filings)
 * - Judgment Processing (judgment entry and indexing)
 * - Lien Management (lien dockets)
 * - Escrow Accounts (funds held in escrow)
 *
 * @module digitaltwin/officers/ProthonotaryUnit
 * @authority 16 Pa.C.S. Article IX (§901-908)
 */

import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../../isa88/ProductionUnit.js';

export const ProthonotaryWorkItemTypes = {
  // Civil Filings
  COMPLAINT_FILED: 'complaint_filed',
  ANSWER_FILED: 'answer_filed',
  MOTION_FILED: 'motion_filed',
  CASE_DOCKETED: 'case_docketed',

  // Judgments
  JUDGMENT_ENTERED: 'judgment_entered',
  JUDGMENT_INDEXED: 'judgment_indexed',
  SATISFACTION_FILED: 'satisfaction_filed',

  // Liens
  LIEN_FILED: 'lien_filed',
  LIEN_INDEXED: 'lien_indexed',
  LIEN_RELEASED: 'lien_released',

  // Escrow
  ESCROW_DEPOSITED: 'escrow_deposited',
  ESCROW_DISBURSED: 'escrow_disbursed',

  // Fees
  FEE_COLLECTED: 'fee_collected'
};

/**
 * Create Civil Filing Line
 */
function createCivilFilingLine() {
  const line = new AssemblyLine({
    id: 'civil-filing',
    name: 'Civil Filing Line',
    description: 'Processing civil court filings and docketing',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'complaint-intake',
    name: 'Complaint Intake',
    description: 'Receive civil complaints and praecipes',
    capacity: 10,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [ProthonotaryWorkItemTypes.COMPLAINT_FILED],
    outputType: 'complaint_received',
    requiredSkills: ['civil-filing', 'document-review'],
    equipment: ['filing-system', 'fee-calculator']
  }));

  line.addStation(new WorkStation({
    id: 'filing-review',
    name: 'Filing Review',
    description: 'Review for compliance with rules of civil procedure',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: ['complaint_received'],
    outputType: 'filing_approved',
    requiredSkills: ['civil-procedure', 'legal-review'],
    equipment: ['rules-reference']
  }));

  line.addStation(new WorkStation({
    id: 'docketing',
    name: 'Docketing Station',
    description: 'Enter case on civil docket',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: ['filing_approved'],
    outputType: ProthonotaryWorkItemTypes.CASE_DOCKETED,
    requiredSkills: ['docketing', 'data-entry'],
    equipment: ['docket-system']
  }));

  line.addStation(new WorkStation({
    id: 'service-issuance',
    name: 'Service Issuance',
    description: 'Issue writ of summons for service',
    capacity: 5,
    cycleTime: 5 * 60 * 1000,
    inputTypes: [ProthonotaryWorkItemTypes.CASE_DOCKETED],
    outputType: 'completed',
    requiredSkills: ['writ-issuance'],
    equipment: ['writ-printer', 'seal']
  }));

  return line;
}

/**
 * Create Judgment Processing Line
 */
function createJudgmentLine() {
  const line = new AssemblyLine({
    id: 'judgments',
    name: 'Judgment Line',
    description: 'Processing judgment entries and satisfactions',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'judgment-entry',
    name: 'Judgment Entry',
    description: 'Enter judgments from court orders',
    capacity: 5,
    cycleTime: 15 * 60 * 1000,
    inputTypes: [ProthonotaryWorkItemTypes.JUDGMENT_ENTERED],
    outputType: 'judgment_recorded',
    requiredSkills: ['judgment-entry', 'legal-review'],
    equipment: ['judgment-system']
  }));

  line.addStation(new WorkStation({
    id: 'judgment-indexing',
    name: 'Judgment Indexing',
    description: 'Index by debtor name for title searches',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: ['judgment_recorded'],
    outputType: ProthonotaryWorkItemTypes.JUDGMENT_INDEXED,
    requiredSkills: ['indexing'],
    equipment: ['judgment-index']
  }));

  line.addStation(new WorkStation({
    id: 'satisfaction-processing',
    name: 'Satisfaction Processing',
    description: 'Process satisfaction of judgments',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: [ProthonotaryWorkItemTypes.SATISFACTION_FILED],
    outputType: 'completed',
    requiredSkills: ['satisfaction-processing'],
    equipment: ['judgment-system']
  }));

  return line;
}

/**
 * Create Lien Docket Line
 */
function createLienLine() {
  const line = new AssemblyLine({
    id: 'liens',
    name: 'Lien Docket Line',
    description: 'Managing lien filings and releases',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'lien-filing',
    name: 'Lien Filing',
    description: 'Receive and file liens (mechanic, tax, municipal)',
    capacity: 5,
    cycleTime: 15 * 60 * 1000,
    inputTypes: [ProthonotaryWorkItemTypes.LIEN_FILED],
    outputType: 'lien_received',
    requiredSkills: ['lien-processing'],
    equipment: ['lien-system', 'fee-collection']
  }));

  line.addStation(new WorkStation({
    id: 'lien-indexing',
    name: 'Lien Indexing',
    description: 'Index by property and owner for searches',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: ['lien_received'],
    outputType: ProthonotaryWorkItemTypes.LIEN_INDEXED,
    requiredSkills: ['indexing', 'property-records'],
    equipment: ['lien-index']
  }));

  line.addStation(new WorkStation({
    id: 'lien-search',
    name: 'Lien Search',
    description: 'Provide lien searches for title companies',
    capacity: 4,
    cycleTime: 20 * 60 * 1000,
    inputTypes: ['search_request'],
    outputType: 'search_complete',
    requiredSkills: ['title-search'],
    equipment: ['search-terminal']
  }));

  line.addStation(new WorkStation({
    id: 'lien-release',
    name: 'Lien Release',
    description: 'Process lien satisfactions and releases',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: [ProthonotaryWorkItemTypes.LIEN_RELEASED],
    outputType: 'completed',
    requiredSkills: ['lien-processing'],
    equipment: ['lien-system']
  }));

  return line;
}

/**
 * Create Escrow Account Line
 */
function createEscrowLine() {
  const line = new AssemblyLine({
    id: 'escrow',
    name: 'Escrow Account Line',
    description: 'Managing funds held in escrow',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'escrow-deposit',
    name: 'Escrow Deposit',
    description: 'Receive and deposit escrow funds',
    capacity: 3,
    cycleTime: 15 * 60 * 1000,
    inputTypes: [ProthonotaryWorkItemTypes.ESCROW_DEPOSITED],
    outputType: 'escrow_recorded',
    requiredSkills: ['escrow-accounting', 'cash-handling'],
    equipment: ['escrow-system', 'receipt-printer']
  }));

  line.addStation(new WorkStation({
    id: 'escrow-accounting',
    name: 'Escrow Accounting',
    description: 'Maintain separate escrow account ledger',
    capacity: 2,
    cycleTime: 10 * 60 * 1000,
    inputTypes: ['escrow_recorded'],
    outputType: 'escrow_accounted',
    requiredSkills: ['escrow-accounting'],
    equipment: ['accounting-system']
  }));

  line.addStation(new WorkStation({
    id: 'escrow-disbursement',
    name: 'Escrow Disbursement',
    description: 'Disburse escrow per court order',
    capacity: 3,
    cycleTime: 20 * 60 * 1000,
    inputTypes: [ProthonotaryWorkItemTypes.ESCROW_DISBURSED],
    outputType: 'completed',
    requiredSkills: ['disbursement', 'court-orders'],
    equipment: ['check-printer', 'escrow-system']
  }));

  return line;
}

/**
 * Create Fee Collection Line
 */
function createFeeCollectionLine() {
  const line = new AssemblyLine({
    id: 'fees',
    name: 'Fee Collection Line',
    description: 'Processing filing fees, certification fees, copy fees',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'fee-calculation',
    name: 'Fee Calculation',
    description: 'Calculate fees per statutory schedule',
    capacity: 10,
    cycleTime: 3 * 60 * 1000,
    inputTypes: ['fee_request'],
    outputType: 'fee_calculated',
    requiredSkills: ['fee-calculation'],
    equipment: ['fee-schedule']
  }));

  line.addStation(new WorkStation({
    id: 'fee-collection',
    name: 'Fee Collection',
    description: 'Collect and receipt fees',
    capacity: 5,
    cycleTime: 5 * 60 * 1000,
    inputTypes: ['fee_calculated'],
    outputType: ProthonotaryWorkItemTypes.FEE_COLLECTED,
    requiredSkills: ['cash-handling', 'receipting'],
    equipment: ['cash-register', 'receipt-printer']
  }));

  line.addStation(new WorkStation({
    id: 'daily-reconciliation',
    name: 'Daily Reconciliation',
    description: 'Reconcile and deposit with Treasurer',
    capacity: 1,
    cycleTime: 30 * 60 * 1000,
    inputTypes: ['daily_close'],
    outputType: 'completed',
    requiredSkills: ['reconciliation', 'cash-handling'],
    equipment: ['reconciliation-system']
  }));

  return line;
}

export function createProthonotaryUnit() {
  const unit = new ProductionUnit({
    id: 'prothonotary',
    name: 'Prothonotary',
    type: 'row_officer',
    authority: '16 Pa.C.S. Article IX (§901-908)',
    description: 'Clerk of civil court, judgment entry, lien dockets, escrow accounts',
    staffing: {
      fte: 16,
      positions: [
        { title: 'Prothonotary', count: 1, elected: true },
        { title: 'Chief Deputy', count: 1 },
        { title: 'Civil Filing Clerk', count: 5 },
        { title: 'Judgment Clerk', count: 3 },
        { title: 'Lien Clerk', count: 3 },
        { title: 'Cashier', count: 2 },
        { title: 'Administrative Staff', count: 1 }
      ]
    },
    operatingHours: { start: 8, end: 17 },
    position: { x: 700, y: 0, z: 0 },
    dimensions: { width: 45, height: 6, depth: 30 }
  });

  unit.addLine(createCivilFilingLine());
  unit.addLine(createJudgmentLine());
  unit.addLine(createLienLine());
  unit.addLine(createEscrowLine());
  unit.addLine(createFeeCollectionLine());

  return unit;
}

export function createProthonotaryWorkItems() {
  return {
    complaint: (id, plaintiff, defendant, amount) => new WorkItem(
      `civil-${id}`,
      ProthonotaryWorkItemTypes.COMPLAINT_FILED,
      { plaintiff, defendant, amount, caseType: 'civil' }
    ),
    judgment: (id, creditor, debtor, amount, caseNumber) => new WorkItem(
      `judgment-${id}`,
      ProthonotaryWorkItemTypes.JUDGMENT_ENTERED,
      { creditor, debtor, amount, caseNumber }
    ),
    lien: (id, lienType, property, amount, claimant) => new WorkItem(
      `lien-${id}`,
      ProthonotaryWorkItemTypes.LIEN_FILED,
      { lienType, property, amount, claimant }
    ),
    escrowDeposit: (id, caseNumber, amount, depositor) => new WorkItem(
      `escrow-${id}`,
      ProthonotaryWorkItemTypes.ESCROW_DEPOSITED,
      { caseNumber, amount, depositor }
    )
  };
}

export default createProthonotaryUnit;
