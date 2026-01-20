/**
 * Recorder of Deeds Production Unit - Digital Twin Model
 *
 * Models the Recorder's office as a production facility with assembly lines for:
 * - Document Recording (deeds, mortgages, liens)
 * - Transfer Tax Collection (realty transfer tax)
 * - Public Records Access (copies and searches)
 * - Technology Fund Management
 *
 * @module digitaltwin/officers/RecorderOfDeedsUnit
 * @authority 16 Pa.C.S. Article X (§1001-1009)
 */

import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../../isa88/ProductionUnit.js';

export const RecorderWorkItemTypes = {
  // Document Recording
  DOC_SUBMITTED: 'doc_submitted',
  DOC_REVIEWED: 'doc_reviewed',
  DOC_RECORDED: 'doc_recorded',
  DOC_INDEXED: 'doc_indexed',

  // Transfer Tax
  TRANSFER_RECEIVED: 'transfer_received',
  TAX_CALCULATED: 'tax_calculated',
  TAX_COLLECTED: 'tax_collected',
  TAX_REMITTED: 'tax_remitted',

  // Public Records
  SEARCH_REQUEST: 'search_request',
  COPY_REQUEST: 'copy_request',

  // Technology Fund
  TECH_EXPENDITURE: 'tech_expenditure'
};

/**
 * Create Document Recording Assembly Line
 */
function createRecordingLine() {
  const line = new AssemblyLine({
    id: 'recording',
    name: 'Document Recording Line',
    description: 'Recording deeds, mortgages, and other instruments',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'doc-intake',
    name: 'Document Intake',
    description: 'Receive documents for recording',
    capacity: 10,
    cycleTime: 5 * 60 * 1000, // 5 minutes
    inputTypes: [RecorderWorkItemTypes.DOC_SUBMITTED],
    outputType: RecorderWorkItemTypes.DOC_REVIEWED,
    requiredSkills: ['document-intake', 'fee-collection'],
    equipment: ['intake-counter', 'fee-calculator']
  }));

  line.addStation(new WorkStation({
    id: 'doc-review',
    name: 'Document Review',
    description: 'Review for recording requirements',
    capacity: 5,
    cycleTime: 10 * 60 * 1000, // 10 minutes
    inputTypes: [RecorderWorkItemTypes.DOC_REVIEWED],
    outputType: RecorderWorkItemTypes.DOC_RECORDED,
    requiredSkills: ['legal-review', 'recording-requirements'],
    equipment: ['checklist-system']
  }));

  line.addStation(new WorkStation({
    id: 'recording',
    name: 'Recording Station',
    description: 'Assign recording number and timestamp',
    capacity: 5,
    cycleTime: 3 * 60 * 1000, // 3 minutes
    inputTypes: [RecorderWorkItemTypes.DOC_RECORDED],
    outputType: RecorderWorkItemTypes.DOC_INDEXED,
    requiredSkills: ['recording', 'data-entry'],
    equipment: ['recording-system', 'scanner']
  }));

  line.addStation(new WorkStation({
    id: 'indexing',
    name: 'Indexing Station',
    description: 'Index by grantor/grantee for searchability',
    capacity: 5,
    cycleTime: 5 * 60 * 1000, // 5 minutes
    inputTypes: [RecorderWorkItemTypes.DOC_INDEXED],
    outputType: 'completed',
    requiredSkills: ['indexing', 'data-entry'],
    equipment: ['indexing-system']
  }));

  return line;
}

/**
 * Create Transfer Tax Collection Line
 */
function createTransferTaxLine() {
  const line = new AssemblyLine({
    id: 'transfer-tax',
    name: 'Realty Transfer Tax Line',
    description: 'Collecting and remitting transfer tax per 72 P.S. §8102-C',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'transfer-intake',
    name: 'Transfer Intake',
    description: 'Receive deed with transfer tax statement',
    capacity: 10,
    cycleTime: 5 * 60 * 1000,
    inputTypes: [RecorderWorkItemTypes.TRANSFER_RECEIVED],
    outputType: RecorderWorkItemTypes.TAX_CALCULATED,
    requiredSkills: ['transfer-tax', 'verification'],
    equipment: ['intake-system']
  }));

  line.addStation(new WorkStation({
    id: 'tax-calculation',
    name: 'Tax Calculation',
    description: 'Calculate state (1%) and local transfer tax',
    capacity: 5,
    cycleTime: 5 * 60 * 1000,
    inputTypes: [RecorderWorkItemTypes.TAX_CALCULATED],
    outputType: RecorderWorkItemTypes.TAX_COLLECTED,
    requiredSkills: ['tax-calculation'],
    equipment: ['tax-calculator', 'exemption-checker']
  }));

  line.addStation(new WorkStation({
    id: 'tax-collection',
    name: 'Tax Collection',
    description: 'Collect transfer tax payment',
    capacity: 5,
    cycleTime: 3 * 60 * 1000,
    inputTypes: [RecorderWorkItemTypes.TAX_COLLECTED],
    outputType: 'tax_deposited',
    requiredSkills: ['cash-handling', 'receipting'],
    equipment: ['payment-system', 'receipt-printer']
  }));

  line.addStation(new WorkStation({
    id: 'state-remittance',
    name: 'State Remittance',
    description: 'Monthly remittance to Commonwealth',
    capacity: 1,
    cycleTime: 2 * 60 * 60 * 1000, // 2 hours monthly
    inputTypes: [RecorderWorkItemTypes.TAX_REMITTED],
    outputType: 'completed',
    requiredSkills: ['state-reporting', 'accounting'],
    equipment: ['state-portal', 'accounting-system']
  }));

  return line;
}

/**
 * Create Public Records Access Line
 */
function createPublicRecordsLine() {
  const line = new AssemblyLine({
    id: 'public-records',
    name: 'Public Records Line',
    description: 'Processing public record requests',
    layout: 'parallel'
  });

  line.addStation(new WorkStation({
    id: 'search-counter',
    name: 'Search Counter',
    description: 'Assist public with record searches',
    capacity: 4,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [RecorderWorkItemTypes.SEARCH_REQUEST],
    outputType: 'search_complete',
    requiredSkills: ['customer-service', 'search'],
    equipment: ['search-terminal', 'microfiche-reader']
  }));

  line.addStation(new WorkStation({
    id: 'copy-station',
    name: 'Copy Station',
    description: 'Provide certified copies',
    capacity: 3,
    cycleTime: 10 * 60 * 1000, // 10 minutes
    inputTypes: [RecorderWorkItemTypes.COPY_REQUEST],
    outputType: 'completed',
    requiredSkills: ['copying', 'certification'],
    equipment: ['copy-machine', 'certification-seal']
  }));

  line.addStation(new WorkStation({
    id: 'online-access',
    name: 'Online Access Portal',
    description: 'Online document search and ordering',
    capacity: 100, // High capacity automated
    cycleTime: 1 * 60 * 1000, // 1 minute
    inputTypes: ['online_request'],
    outputType: 'completed',
    requiredSkills: [],
    equipment: ['web-portal', 'document-management']
  }));

  return line;
}

/**
 * Create Technology Fund Line
 */
function createTechnologyFundLine() {
  const line = new AssemblyLine({
    id: 'technology-fund',
    name: 'Technology Fund Line',
    description: 'Managing automation and preservation fund',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'fee-collection',
    name: 'Tech Fee Collection',
    description: 'Collect technology surcharge on recordings',
    capacity: 10,
    cycleTime: 1 * 60 * 1000,
    inputTypes: ['tech_fee'],
    outputType: 'fee_collected',
    requiredSkills: ['fee-collection'],
    equipment: ['fee-system']
  }));

  line.addStation(new WorkStation({
    id: 'tech-expenditure',
    name: 'Expenditure Processing',
    description: 'Process technology improvement expenditures',
    capacity: 2,
    cycleTime: 30 * 60 * 1000,
    inputTypes: [RecorderWorkItemTypes.TECH_EXPENDITURE],
    outputType: 'completed',
    requiredSkills: ['procurement', 'it-management'],
    equipment: ['procurement-system']
  }));

  return line;
}

export function createRecorderOfDeedsUnit() {
  const unit = new ProductionUnit({
    id: 'recorder-of-deeds',
    name: 'Recorder of Deeds',
    type: 'row_officer',
    authority: '16 Pa.C.S. Article X (§1001-1009)',
    description: 'Recording deeds, mortgages, instruments; transfer tax collection; public records',
    staffing: {
      fte: 12,
      positions: [
        { title: 'Recorder of Deeds', count: 1, elected: true },
        { title: 'Chief Deputy', count: 1 },
        { title: 'Recording Clerk', count: 5 },
        { title: 'Index Clerk', count: 3 },
        { title: 'Customer Service', count: 2 }
      ]
    },
    operatingHours: { start: 8, end: 17 },
    position: { x: 400, y: 0, z: 0 },
    dimensions: { width: 35, height: 5, depth: 25 }
  });

  unit.addLine(createRecordingLine());
  unit.addLine(createTransferTaxLine());
  unit.addLine(createPublicRecordsLine());
  unit.addLine(createTechnologyFundLine());

  return unit;
}

export function createRecorderWorkItems() {
  return {
    deed: (id, grantor, grantee, propertyAddress, consideration) => new WorkItem(
      `deed-${id}`,
      RecorderWorkItemTypes.DOC_SUBMITTED,
      { docType: 'deed', grantor, grantee, propertyAddress, consideration }
    ),
    mortgage: (id, mortgagor, mortgagee, amount) => new WorkItem(
      `mortgage-${id}`,
      RecorderWorkItemTypes.DOC_SUBMITTED,
      { docType: 'mortgage', mortgagor, mortgagee, amount }
    ),
    searchRequest: (id, propertyAddress, searchType) => new WorkItem(
      `search-${id}`,
      RecorderWorkItemTypes.SEARCH_REQUEST,
      { propertyAddress, searchType }
    )
  };
}

export default createRecorderOfDeedsUnit;
