/**
 * L1 Transactions Layer - Basic Control
 *
 * ISA-95 Level 1: Basic control and sensing
 * Contains transaction types for claims, payments, audits, and recordings.
 *
 * @module L1_Transactions
 * @standard ISA-95 Level 1
 */

// Claims
export { Claim } from './claims/Claim.js';
export { ClaimApproval } from './claims/ClaimApproval.js';

// Payments
export { Warrant } from './payments/Warrant.js';
export { Disbursement } from './payments/Disbursement.js';
export { DirectDeposit } from './payments/DirectDeposit.js';
export { Receipt } from './payments/Receipt.js';

// Audits
export { AuditEngagement } from './audits/AuditEngagement.js';
export { Finding } from './audits/Finding.js';
export { WorkPaper } from './audits/WorkPaper.js';

// Blockchain signing integration
export {
  BlockchainSigner,
  SignedTransaction,
  SignedTransactionFactory,
  L1TransactionTypes,
  createBlockchainSigner
} from './signing/BlockchainSigner.js';

/**
 * Configuration paths
 */
export const ConfigPaths = {
  feeSchedules: './config/fee-schedules.json',
  transactionSchemas: './config/transaction-schemas.json'
};

/**
 * Load transaction configuration
 */
export async function loadConfig(configName) {
  const path = ConfigPaths[configName];
  if (!path) {
    throw new Error(`Unknown config: ${configName}`);
  }
  const fs = await import('fs/promises');
  const { dirname, join } = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return JSON.parse(await fs.readFile(join(__dirname, path), 'utf8'));
}

/**
 * Transaction categories
 */
export const TransactionCategories = {
  FINANCIAL: {
    claims: ['Claim', 'ClaimApproval'],
    payments: ['Warrant', 'Disbursement', 'DirectDeposit'],
    receipts: ['Receipt']
  },
  AUDIT: {
    engagements: ['AuditEngagement'],
    findings: ['Finding'],
    documentation: ['WorkPaper']
  }
};

/**
 * Get all transaction types
 */
export function getAllTransactionTypes() {
  return [
    'Claim', 'ClaimApproval',
    'Warrant', 'Disbursement', 'DirectDeposit', 'Receipt',
    'AuditEngagement', 'Finding', 'WorkPaper'
  ];
}

/**
 * Module information
 */
export const moduleInfo = {
  name: 'L1 Transactions Layer',
  version: '1.0.0',
  standard: 'ISA-95 Level 1',
  description: 'Basic control and transaction processing',
  authorities: {
    claims: '16 Pa.C.S. §1750',
    payments: '16 Pa.C.S. §1760',
    audits: '16 Pa.C.S. §1720'
  },
  transactionTypes: getAllTransactionTypes().length,
  hasBlockchainSigning: true
};
