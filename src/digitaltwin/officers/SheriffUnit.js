/**
 * Sheriff Production Unit - Digital Twin Model
 *
 * Models the Sheriff's office as a production facility with assembly lines for:
 * - Sheriff Sales (real estate and property sales)
 * - Process Service (serving legal documents)
 * - Inmate Accounts (prisoner fund management)
 * - Court Security Operations
 *
 * @module digitaltwin/officers/SheriffUnit
 * @authority 16 Pa.C.S. Article XII (§1201-1210)
 */

import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../../isa88/ProductionUnit.js';

/**
 * Work item types for Sheriff operations
 */
export const SheriffWorkItemTypes = {
  // Sheriff Sales
  SALE_PETITION: 'sale_petition',
  SALE_SCHEDULED: 'sale_scheduled',
  SALE_ADVERTISED: 'sale_advertised',
  SALE_CONDUCTED: 'sale_conducted',
  SALE_DISTRIBUTED: 'sale_distributed',

  // Process Service
  WRIT_RECEIVED: 'writ_received',
  WRIT_ASSIGNED: 'writ_assigned',
  WRIT_SERVED: 'writ_served',
  WRIT_RETURNED: 'writ_returned',

  // Inmate Accounts
  INMATE_DEPOSIT: 'inmate_deposit',
  INMATE_PURCHASE: 'inmate_purchase',
  INMATE_RELEASE: 'inmate_release',

  // Court Security
  SECURITY_ASSIGNMENT: 'security_assignment',
  TRANSPORT_ORDER: 'transport_order'
};

/**
 * Create Sheriff Sales Assembly Line
 * Process: Petition → Schedule → Advertise → Conduct → Distribute
 */
function createSheriffSalesLine() {
  const line = new AssemblyLine({
    id: 'sheriff-sales',
    name: 'Sheriff Sales Line',
    description: 'Real estate and personal property sales process',
    layout: 'linear'
  });

  // Station 1: Receive and Review Petition
  line.addStation(new WorkStation({
    id: 'sales-intake',
    name: 'Sales Intake',
    description: 'Receive writ of execution from court',
    capacity: 5,
    cycleTime: 30 * 60 * 1000, // 30 minutes
    inputTypes: [SheriffWorkItemTypes.SALE_PETITION],
    outputType: SheriffWorkItemTypes.SALE_SCHEDULED,
    requiredSkills: ['legal-review', 'document-processing'],
    equipment: ['document-scanner', 'case-management-system']
  }));

  // Station 2: Schedule Sale
  line.addStation(new WorkStation({
    id: 'sales-scheduling',
    name: 'Sale Scheduling',
    description: 'Schedule sale date per PA Rules of Civil Procedure',
    capacity: 3,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [SheriffWorkItemTypes.SALE_SCHEDULED],
    outputType: SheriffWorkItemTypes.SALE_ADVERTISED,
    requiredSkills: ['scheduling', 'legal-compliance'],
    equipment: ['scheduling-system']
  }));

  // Station 3: Advertise Sale
  line.addStation(new WorkStation({
    id: 'sales-advertising',
    name: 'Sale Advertising',
    description: 'Publish legal notice per statutory requirements',
    capacity: 10,
    cycleTime: 21 * 24 * 60 * 60 * 1000, // 21 days (statutory requirement)
    inputTypes: [SheriffWorkItemTypes.SALE_ADVERTISED],
    outputType: SheriffWorkItemTypes.SALE_CONDUCTED,
    requiredSkills: ['legal-advertising'],
    equipment: ['legal-notice-system']
  }));

  // Station 4: Conduct Sale
  line.addStation(new WorkStation({
    id: 'sales-auction',
    name: 'Auction Room',
    description: 'Conduct public sale at courthouse',
    capacity: 1, // One sale at a time
    cycleTime: 60 * 60 * 1000, // 1 hour per sale
    inputTypes: [SheriffWorkItemTypes.SALE_CONDUCTED],
    outputType: SheriffWorkItemTypes.SALE_DISTRIBUTED,
    requiredSkills: ['auctioneer', 'bid-management'],
    equipment: ['auction-podium', 'bid-recording-system']
  }));

  // Station 5: Distribute Proceeds
  line.addStation(new WorkStation({
    id: 'sales-distribution',
    name: 'Proceeds Distribution',
    description: 'Distribute sale proceeds per court order within 30 days',
    capacity: 5,
    cycleTime: 2 * 60 * 60 * 1000, // 2 hours per distribution
    inputTypes: [SheriffWorkItemTypes.SALE_DISTRIBUTED],
    outputType: 'completed',
    requiredSkills: ['accounting', 'disbursement'],
    equipment: ['accounting-system', 'check-printer']
  }));

  return line;
}

/**
 * Create Process Service Assembly Line
 * Process: Receive Writ → Assign Deputy → Serve → Return to Court
 */
function createProcessServiceLine() {
  const line = new AssemblyLine({
    id: 'process-service',
    name: 'Process Service Line',
    description: 'Serving legal documents and court orders',
    layout: 'linear'
  });

  // Station 1: Receive Writ/Order
  line.addStation(new WorkStation({
    id: 'process-intake',
    name: 'Process Intake',
    description: 'Receive writs and orders from court/attorneys',
    capacity: 20,
    cycleTime: 10 * 60 * 1000, // 10 minutes
    inputTypes: [SheriffWorkItemTypes.WRIT_RECEIVED],
    outputType: SheriffWorkItemTypes.WRIT_ASSIGNED,
    requiredSkills: ['document-processing'],
    equipment: ['intake-system', 'fee-collection']
  }));

  // Station 2: Assignment & Routing
  line.addStation(new WorkStation({
    id: 'process-assignment',
    name: 'Deputy Assignment',
    description: 'Assign to deputy based on location/type',
    capacity: 10,
    cycleTime: 5 * 60 * 1000, // 5 minutes
    inputTypes: [SheriffWorkItemTypes.WRIT_ASSIGNED],
    outputType: SheriffWorkItemTypes.WRIT_SERVED,
    requiredSkills: ['dispatch', 'routing'],
    equipment: ['dispatch-system', 'gps-tracking']
  }));

  // Station 3: Field Service
  line.addStation(new WorkStation({
    id: 'process-service',
    name: 'Field Service',
    description: 'Deputy serves papers in the field',
    capacity: 15, // Multiple deputies
    cycleTime: 4 * 60 * 60 * 1000, // 4 hours average
    inputTypes: [SheriffWorkItemTypes.WRIT_SERVED],
    outputType: SheriffWorkItemTypes.WRIT_RETURNED,
    requiredSkills: ['field-service', 'legal-process'],
    equipment: ['vehicle', 'mobile-device', 'body-camera']
  }));

  // Station 4: Return of Service
  line.addStation(new WorkStation({
    id: 'process-return',
    name: 'Return Processing',
    description: 'Complete return of service to court',
    capacity: 10,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [SheriffWorkItemTypes.WRIT_RETURNED],
    outputType: 'completed',
    requiredSkills: ['legal-documentation'],
    equipment: ['return-system', 'e-filing']
  }));

  return line;
}

/**
 * Create Inmate Accounts Assembly Line
 * Process: Deposit → Account Credit → Purchase/Release
 */
function createInmateAccountsLine() {
  const line = new AssemblyLine({
    id: 'inmate-accounts',
    name: 'Inmate Accounts Line',
    description: 'Prisoner fund management and commissary',
    layout: 'u-shape'
  });

  // Station 1: Deposit Intake
  line.addStation(new WorkStation({
    id: 'inmate-deposit',
    name: 'Deposit Station',
    description: 'Receive and process inmate deposits',
    capacity: 5,
    cycleTime: 5 * 60 * 1000, // 5 minutes
    inputTypes: [SheriffWorkItemTypes.INMATE_DEPOSIT],
    outputType: 'account_credited',
    requiredSkills: ['cash-handling', 'accounting'],
    equipment: ['cash-register', 'inmate-banking-system']
  }));

  // Station 2: Account Management
  line.addStation(new WorkStation({
    id: 'inmate-ledger',
    name: 'Account Ledger',
    description: 'Maintain individual inmate accounts',
    capacity: 100, // Many accounts
    cycleTime: 1 * 60 * 1000, // 1 minute per transaction
    inputTypes: ['account_credited'],
    outputType: 'account_updated',
    requiredSkills: ['accounting'],
    equipment: ['inmate-banking-system']
  }));

  // Station 3: Commissary Sales
  line.addStation(new WorkStation({
    id: 'commissary',
    name: 'Commissary',
    description: 'Process commissary purchases',
    capacity: 20,
    cycleTime: 3 * 60 * 1000, // 3 minutes
    inputTypes: [SheriffWorkItemTypes.INMATE_PURCHASE, 'account_updated'],
    outputType: 'purchase_complete',
    requiredSkills: ['retail', 'inventory'],
    equipment: ['pos-system', 'inventory-system']
  }));

  // Station 4: Release Processing
  line.addStation(new WorkStation({
    id: 'inmate-release',
    name: 'Release Accounting',
    description: 'Close account and disburse funds on release',
    capacity: 5,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [SheriffWorkItemTypes.INMATE_RELEASE],
    outputType: 'completed',
    requiredSkills: ['accounting', 'disbursement'],
    equipment: ['inmate-banking-system', 'check-printer']
  }));

  return line;
}

/**
 * Create Court Security Operations Line
 */
function createCourtSecurityLine() {
  const line = new AssemblyLine({
    id: 'court-security',
    name: 'Court Security Line',
    description: 'Courthouse security and prisoner transport',
    layout: 'parallel'
  });

  // Station 1: Daily Assignment
  line.addStation(new WorkStation({
    id: 'security-roster',
    name: 'Duty Roster',
    description: 'Daily security assignment and scheduling',
    capacity: 1,
    cycleTime: 30 * 60 * 1000, // 30 minutes daily
    inputTypes: [SheriffWorkItemTypes.SECURITY_ASSIGNMENT],
    outputType: 'deputies_assigned',
    requiredSkills: ['scheduling', 'security-management'],
    equipment: ['scheduling-system']
  }));

  // Station 2: Checkpoint Operations
  line.addStation(new WorkStation({
    id: 'security-checkpoint',
    name: 'Security Checkpoint',
    description: 'Entrance screening operations',
    capacity: 4, // Multiple checkpoints
    cycleTime: 30 * 1000, // 30 seconds per person
    inputTypes: ['visitor'],
    outputType: 'visitor_cleared',
    requiredSkills: ['security-screening'],
    equipment: ['metal-detector', 'x-ray-scanner', 'wand']
  }));

  // Station 3: Courtroom Security
  line.addStation(new WorkStation({
    id: 'courtroom-security',
    name: 'Courtroom Post',
    description: 'In-courtroom security coverage',
    capacity: 12, // Multiple courtrooms
    cycleTime: 8 * 60 * 60 * 1000, // Full day
    inputTypes: ['deputies_assigned'],
    outputType: 'courtroom_secured',
    requiredSkills: ['courtroom-security', 'emergency-response'],
    equipment: ['radio', 'restraints', 'emergency-button']
  }));

  // Station 4: Prisoner Transport
  line.addStation(new WorkStation({
    id: 'transport',
    name: 'Transport Unit',
    description: 'Transport prisoners to/from facilities',
    capacity: 3, // Transport vehicles
    cycleTime: 2 * 60 * 60 * 1000, // 2 hours average
    inputTypes: [SheriffWorkItemTypes.TRANSPORT_ORDER],
    outputType: 'transport_complete',
    requiredSkills: ['transport', 'custody'],
    equipment: ['transport-vehicle', 'restraints', 'radio']
  }));

  return line;
}

/**
 * Create the complete Sheriff Production Unit
 */
export function createSheriffUnit() {
  const unit = new ProductionUnit({
    id: 'sheriff',
    name: 'Sheriff\'s Office',
    type: 'row_officer',
    authority: '16 Pa.C.S. Article XII (§1201-1210)',
    description: 'County Sheriff - Court security, process service, sales, and corrections',
    staffing: {
      fte: 45,
      positions: [
        { title: 'Sheriff', count: 1, elected: true },
        { title: 'Chief Deputy', count: 1 },
        { title: 'Deputy Sheriff', count: 30 },
        { title: 'Corrections Officer', count: 8 },
        { title: 'Administrative Staff', count: 5 }
      ]
    },
    operatingHours: { start: 0, end: 24 }, // 24/7 for jail operations
    position: { x: 0, y: 0, z: 0 },
    dimensions: { width: 60, height: 8, depth: 40 }
  });

  // Add all assembly lines
  unit.addLine(createSheriffSalesLine());
  unit.addLine(createProcessServiceLine());
  unit.addLine(createInmateAccountsLine());
  unit.addLine(createCourtSecurityLine());

  return unit;
}

/**
 * Create sample work items for simulation
 */
export function createSheriffWorkItems() {
  return {
    salePetition: (id, propertyAddress, amount) => new WorkItem(
      `sale-${id}`,
      SheriffWorkItemTypes.SALE_PETITION,
      { propertyAddress, amount, petitioner: '', defendant: '' }
    ),

    writ: (id, type, defendant, address) => new WorkItem(
      `writ-${id}`,
      SheriffWorkItemTypes.WRIT_RECEIVED,
      { writType: type, defendant, address, priority: 'normal' }
    ),

    inmateDeposit: (id, inmateId, amount, source) => new WorkItem(
      `deposit-${id}`,
      SheriffWorkItemTypes.INMATE_DEPOSIT,
      { inmateId, amount, source }
    ),

    transportOrder: (id, inmateId, destination, courtDate) => new WorkItem(
      `transport-${id}`,
      SheriffWorkItemTypes.TRANSPORT_ORDER,
      { inmateId, destination, courtDate, priority: 'high' }
    )
  };
}

export default createSheriffUnit;
