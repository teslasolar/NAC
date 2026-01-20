/**
 * Treasurer Production Unit - Digital Twin Model
 *
 * Models the Treasurer's office as a production facility with assembly lines for:
 * - Cash Receipts (receiving all county money)
 * - Disbursements (paying on controller warrants)
 * - Investments (managing idle funds)
 * - Tax Collection (real estate taxes)
 *
 * @module digitaltwin/officers/TreasurerUnit
 * @authority 16 Pa.C.S. Article XIII (§1301-1310)
 */

import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../../isa88/ProductionUnit.js';

/**
 * Work item types for Treasurer operations
 */
export const TreasurerWorkItemTypes = {
  // Cash Receipts
  RECEIPT_INCOMING: 'receipt_incoming',
  RECEIPT_RECORDED: 'receipt_recorded',
  RECEIPT_DEPOSITED: 'receipt_deposited',

  // Disbursements
  WARRANT_RECEIVED: 'warrant_received',
  WARRANT_VERIFIED: 'warrant_verified',
  PAYMENT_ISSUED: 'payment_issued',

  // Investments
  FUNDS_AVAILABLE: 'funds_available',
  INVESTMENT_SELECTED: 'investment_selected',
  INVESTMENT_EXECUTED: 'investment_executed',
  INVESTMENT_MATURED: 'investment_matured',

  // Tax Collection
  TAX_BILL_ISSUED: 'tax_bill_issued',
  TAX_PAYMENT_RECEIVED: 'tax_payment_received',
  TAX_DELINQUENT: 'tax_delinquent'
};

/**
 * Create Cash Receipts Assembly Line
 * Process: Receive → Record → Deposit (same day requirement)
 */
function createCashReceiptsLine() {
  const line = new AssemblyLine({
    id: 'cash-receipts',
    name: 'Cash Receipts Line',
    description: 'Processing all incoming county revenues',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'receipts-intake',
    name: 'Receipt Intake',
    description: 'Receive funds from departments and row officers',
    capacity: 10,
    cycleTime: 5 * 60 * 1000, // 5 minutes
    inputTypes: [TreasurerWorkItemTypes.RECEIPT_INCOMING],
    outputType: TreasurerWorkItemTypes.RECEIPT_RECORDED,
    requiredSkills: ['cash-handling', 'receipting'],
    equipment: ['cash-register', 'receipt-printer', 'safe']
  }));

  line.addStation(new WorkStation({
    id: 'receipts-recording',
    name: 'Recording Station',
    description: 'Record in cash receipts journal',
    capacity: 5,
    cycleTime: 3 * 60 * 1000, // 3 minutes
    inputTypes: [TreasurerWorkItemTypes.RECEIPT_RECORDED],
    outputType: TreasurerWorkItemTypes.RECEIPT_DEPOSITED,
    requiredSkills: ['accounting', 'data-entry'],
    equipment: ['accounting-system']
  }));

  line.addStation(new WorkStation({
    id: 'bank-deposit',
    name: 'Bank Deposit',
    description: 'Same-day deposit to approved depositories',
    capacity: 3,
    cycleTime: 30 * 60 * 1000, // 30 minutes
    inputTypes: [TreasurerWorkItemTypes.RECEIPT_DEPOSITED],
    outputType: 'completed',
    requiredSkills: ['banking', 'security'],
    equipment: ['deposit-bag', 'armored-transport']
  }));

  return line;
}

/**
 * Create Disbursements Assembly Line
 * Process: Receive Warrant → Verify → Issue Payment
 */
function createDisbursementsLine() {
  const line = new AssemblyLine({
    id: 'disbursements',
    name: 'Disbursements Line',
    description: 'Processing payments on controller warrants only',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'warrant-intake',
    name: 'Warrant Intake',
    description: 'Receive warrants from Controller',
    capacity: 50,
    cycleTime: 2 * 60 * 1000, // 2 minutes
    inputTypes: [TreasurerWorkItemTypes.WARRANT_RECEIVED],
    outputType: TreasurerWorkItemTypes.WARRANT_VERIFIED,
    requiredSkills: ['document-verification'],
    equipment: ['warrant-log']
  }));

  line.addStation(new WorkStation({
    id: 'warrant-verification',
    name: 'Warrant Verification',
    description: 'Verify controller signature and fund availability',
    capacity: 10,
    cycleTime: 5 * 60 * 1000, // 5 minutes
    inputTypes: [TreasurerWorkItemTypes.WARRANT_VERIFIED],
    outputType: TreasurerWorkItemTypes.PAYMENT_ISSUED,
    requiredSkills: ['verification', 'fund-accounting'],
    equipment: ['signature-card', 'fund-balance-system']
  }));

  line.addStation(new WorkStation({
    id: 'check-printing',
    name: 'Check Printing',
    description: 'Print and mail checks or process ACH',
    capacity: 20,
    cycleTime: 1 * 60 * 1000, // 1 minute per check
    inputTypes: [TreasurerWorkItemTypes.PAYMENT_ISSUED],
    outputType: 'completed',
    requiredSkills: ['check-processing', 'ach'],
    equipment: ['check-printer', 'positive-pay-system', 'ach-system']
  }));

  return line;
}

/**
 * Create Investments Assembly Line
 * Process: Identify Idle Funds → Select Investment → Execute → Monitor → Mature
 */
function createInvestmentsLine() {
  const line = new AssemblyLine({
    id: 'investments',
    name: 'Investment Line',
    description: 'Managing county investment portfolio per 16 Pa.C.S. §1307',
    layout: 'u-shape'
  });

  line.addStation(new WorkStation({
    id: 'cash-analysis',
    name: 'Cash Flow Analysis',
    description: 'Identify available funds for investment',
    capacity: 1,
    cycleTime: 60 * 60 * 1000, // 1 hour
    inputTypes: [TreasurerWorkItemTypes.FUNDS_AVAILABLE],
    outputType: TreasurerWorkItemTypes.INVESTMENT_SELECTED,
    requiredSkills: ['cash-management', 'forecasting'],
    equipment: ['cash-flow-model', 'treasury-system']
  }));

  line.addStation(new WorkStation({
    id: 'investment-selection',
    name: 'Investment Selection',
    description: 'Select permitted instruments per policy',
    capacity: 1,
    cycleTime: 30 * 60 * 1000, // 30 minutes
    inputTypes: [TreasurerWorkItemTypes.INVESTMENT_SELECTED],
    outputType: TreasurerWorkItemTypes.INVESTMENT_EXECUTED,
    requiredSkills: ['investment-analysis'],
    equipment: ['bloomberg-terminal', 'investment-policy']
  }));

  line.addStation(new WorkStation({
    id: 'trade-execution',
    name: 'Trade Execution',
    description: 'Execute investment purchase',
    capacity: 5,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [TreasurerWorkItemTypes.INVESTMENT_EXECUTED],
    outputType: 'investment_held',
    requiredSkills: ['trading', 'settlement'],
    equipment: ['trading-platform', 'custody-account']
  }));

  line.addStation(new WorkStation({
    id: 'maturity-processing',
    name: 'Maturity Processing',
    description: 'Process maturing investments',
    capacity: 10,
    cycleTime: 30 * 60 * 1000, // 30 minutes
    inputTypes: [TreasurerWorkItemTypes.INVESTMENT_MATURED],
    outputType: 'completed',
    requiredSkills: ['settlement', 'accounting'],
    equipment: ['custody-account', 'accounting-system']
  }));

  return line;
}

/**
 * Create Tax Collection Assembly Line
 * Process: Issue Bills → Receive Payments → Process Delinquents
 */
function createTaxCollectionLine() {
  const line = new AssemblyLine({
    id: 'tax-collection',
    name: 'Tax Collection Line',
    description: 'Real estate tax collection and processing',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'tax-billing',
    name: 'Tax Billing',
    description: 'Generate and mail tax bills',
    capacity: 1000, // Bulk processing
    cycleTime: 0.5 * 60 * 1000, // 30 seconds per bill
    inputTypes: [TreasurerWorkItemTypes.TAX_BILL_ISSUED],
    outputType: 'bill_mailed',
    requiredSkills: ['tax-billing'],
    equipment: ['tax-system', 'mail-house']
  }));

  line.addStation(new WorkStation({
    id: 'tax-payment',
    name: 'Payment Processing',
    description: 'Process tax payments (mail, online, in-person)',
    capacity: 20,
    cycleTime: 3 * 60 * 1000, // 3 minutes
    inputTypes: [TreasurerWorkItemTypes.TAX_PAYMENT_RECEIVED],
    outputType: 'payment_applied',
    requiredSkills: ['payment-processing', 'customer-service'],
    equipment: ['tax-system', 'payment-gateway', 'lockbox']
  }));

  line.addStation(new WorkStation({
    id: 'delinquent-processing',
    name: 'Delinquent Processing',
    description: 'Process delinquent accounts for collection',
    capacity: 100,
    cycleTime: 10 * 60 * 1000, // 10 minutes
    inputTypes: [TreasurerWorkItemTypes.TAX_DELINQUENT],
    outputType: 'to_tax_claim',
    requiredSkills: ['collections', 'tax-law'],
    equipment: ['tax-system', 'notice-generation']
  }));

  return line;
}

/**
 * Create Bank Reconciliation Line
 */
function createBankReconciliationLine() {
  const line = new AssemblyLine({
    id: 'bank-reconciliation',
    name: 'Bank Reconciliation Line',
    description: 'Monthly reconciliation of all county bank accounts',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'statement-intake',
    name: 'Statement Intake',
    description: 'Receive bank statements from all depositories',
    capacity: 20,
    cycleTime: 5 * 60 * 1000,
    inputTypes: ['bank_statement'],
    outputType: 'statement_received',
    requiredSkills: ['banking'],
    equipment: ['document-management']
  }));

  line.addStation(new WorkStation({
    id: 'reconciliation',
    name: 'Reconciliation',
    description: 'Reconcile book to bank balance',
    capacity: 5,
    cycleTime: 2 * 60 * 60 * 1000, // 2 hours per account
    inputTypes: ['statement_received'],
    outputType: 'reconciled',
    requiredSkills: ['reconciliation', 'accounting'],
    equipment: ['reconciliation-software', 'accounting-system']
  }));

  line.addStation(new WorkStation({
    id: 'controller-review',
    name: 'Controller Review',
    description: 'Submit to Controller for review',
    capacity: 10,
    cycleTime: 30 * 60 * 1000,
    inputTypes: ['reconciled'],
    outputType: 'completed',
    requiredSkills: ['reporting'],
    equipment: ['reporting-system']
  }));

  return line;
}

/**
 * Create the complete Treasurer Production Unit
 */
export function createTreasurerUnit() {
  const unit = new ProductionUnit({
    id: 'treasurer',
    name: 'County Treasurer',
    type: 'row_officer',
    authority: '16 Pa.C.S. Article XIII (§1301-1310)',
    description: 'Custodian of all county funds - receipts, disbursements, investments, tax collection',
    staffing: {
      fte: 15,
      positions: [
        { title: 'Treasurer', count: 1, elected: true },
        { title: 'Chief Deputy', count: 1 },
        { title: 'Investment Officer', count: 1 },
        { title: 'Tax Collector', count: 3 },
        { title: 'Accounting Clerk', count: 5 },
        { title: 'Customer Service', count: 4 }
      ]
    },
    operatingHours: { start: 8, end: 17 },
    position: { x: 100, y: 0, z: 0 },
    dimensions: { width: 50, height: 6, depth: 30 }
  });

  unit.addLine(createCashReceiptsLine());
  unit.addLine(createDisbursementsLine());
  unit.addLine(createInvestmentsLine());
  unit.addLine(createTaxCollectionLine());
  unit.addLine(createBankReconciliationLine());

  return unit;
}

export function createTreasurerWorkItems() {
  return {
    receipt: (id, source, amount, fund) => new WorkItem(
      `receipt-${id}`,
      TreasurerWorkItemTypes.RECEIPT_INCOMING,
      { source, amount, fund }
    ),
    warrant: (id, payee, amount, fund, controllerSignature) => new WorkItem(
      `warrant-${id}`,
      TreasurerWorkItemTypes.WARRANT_RECEIVED,
      { payee, amount, fund, controllerSignature }
    ),
    taxPayment: (id, parcelId, amount, year) => new WorkItem(
      `tax-${id}`,
      TreasurerWorkItemTypes.TAX_PAYMENT_RECEIVED,
      { parcelId, amount, year }
    )
  };
}

export default createTreasurerUnit;
