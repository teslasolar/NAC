/**
 * L1 Tag Provider - Transaction Tags
 *
 * Provides tag access for transaction-level data:
 * - Claims and claim workflows
 * - Warrants and disbursements
 * - Audit engagements and findings
 * - Payroll runs and receipts
 * - Blockchain signatures
 *
 * @module isa95/L1_Transactions/tags
 */

export class L1TagProvider {
  constructor() {
    this.cache = new Map();
    this.subscriptions = new Map();
    this.prefix = 'L1';
    this.transactions = new Map(); // Active transaction tracking
  }

  /**
   * Tag paths for L1 transactions
   */
  static TAGS = {
    // Claims
    CLAIMS_PENDING: 'L1.Claims.Pending',
    CLAIMS_APPROVED: 'L1.Claims.Approved',
    CLAIMS_REJECTED: 'L1.Claims.Rejected',
    CLAIMS_TOTAL_VALUE: 'L1.Claims.TotalValue',
    CLAIMS_QUEUE_DEPTH: 'L1.Claims.QueueDepth',

    // Warrants
    WARRANTS_PENDING: 'L1.Warrants.Pending',
    WARRANTS_ISSUED: 'L1.Warrants.Issued',
    WARRANTS_TOTAL_VALUE: 'L1.Warrants.TotalValue',

    // Disbursements
    DISBURSEMENTS_TODAY: 'L1.Disbursements.Today',
    DISBURSEMENTS_MTD: 'L1.Disbursements.MTD',
    DISBURSEMENTS_YTD: 'L1.Disbursements.YTD',

    // Audits
    AUDITS_ACTIVE: 'L1.Audits.Active',
    AUDITS_FINDINGS_OPEN: 'L1.Audits.FindingsOpen',
    AUDITS_FINDINGS_CLOSED: 'L1.Audits.FindingsClosed',

    // Payroll
    PAYROLL_LAST_RUN: 'L1.Payroll.LastRun',
    PAYROLL_NEXT_RUN: 'L1.Payroll.NextRun',
    PAYROLL_EMPLOYEES: 'L1.Payroll.EmployeeCount',

    // Blockchain
    BLOCKCHAIN_LAST_BLOCK: 'L1.Blockchain.LastBlock',
    BLOCKCHAIN_CHAIN_LENGTH: 'L1.Blockchain.ChainLength',
    BLOCKCHAIN_VERIFIED: 'L1.Blockchain.Verified'
  };

  /**
   * Get a tag value
   */
  get(tagPath) {
    return this.cache.get(tagPath);
  }

  /**
   * Set a tag value
   */
  set(tagPath, value) {
    const oldValue = this.cache.get(tagPath);
    this.cache.set(tagPath, value);
    this._notifySubscribers(tagPath, value, oldValue);
  }

  /**
   * Subscribe to tag changes
   */
  subscribe(tagPath, callback) {
    if (!this.subscriptions.has(tagPath)) {
      this.subscriptions.set(tagPath, new Set());
    }
    this.subscriptions.get(tagPath).add(callback);

    if (this.cache.has(tagPath)) {
      callback(this.cache.get(tagPath), undefined);
    }

    return () => this.subscriptions.get(tagPath).delete(callback);
  }

  /**
   * Register a new transaction
   * @param {string} type - Transaction type (claim, warrant, audit, etc.)
   * @param {object} transaction - Transaction data
   * @returns {string} Transaction ID
   */
  registerTransaction(type, transaction) {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.transactions.set(id, {
      type,
      data: transaction,
      created: new Date(),
      status: 'PENDING'
    });
    this._updateCounters(type);
    return id;
  }

  /**
   * Update transaction status
   */
  updateTransaction(id, status, data = {}) {
    const txn = this.transactions.get(id);
    if (txn) {
      txn.status = status;
      txn.updated = new Date();
      Object.assign(txn.data, data);
      this._updateCounters(txn.type);
    }
  }

  /**
   * Get transactions by type and status
   */
  getTransactions(type, status = null) {
    const results = [];
    for (const [id, txn] of this.transactions) {
      if (txn.type === type && (!status || txn.status === status)) {
        results.push({ id, ...txn });
      }
    }
    return results;
  }

  /**
   * Initialize with default values
   */
  initialize() {
    this.set(L1TagProvider.TAGS.CLAIMS_PENDING, 0);
    this.set(L1TagProvider.TAGS.CLAIMS_APPROVED, 0);
    this.set(L1TagProvider.TAGS.CLAIMS_REJECTED, 0);
    this.set(L1TagProvider.TAGS.CLAIMS_TOTAL_VALUE, 0);
    this.set(L1TagProvider.TAGS.CLAIMS_QUEUE_DEPTH, 0);

    this.set(L1TagProvider.TAGS.WARRANTS_PENDING, 0);
    this.set(L1TagProvider.TAGS.WARRANTS_ISSUED, 0);
    this.set(L1TagProvider.TAGS.WARRANTS_TOTAL_VALUE, 0);

    this.set(L1TagProvider.TAGS.AUDITS_ACTIVE, 0);
    this.set(L1TagProvider.TAGS.AUDITS_FINDINGS_OPEN, 0);
    this.set(L1TagProvider.TAGS.AUDITS_FINDINGS_CLOSED, 0);

    this.set(L1TagProvider.TAGS.BLOCKCHAIN_CHAIN_LENGTH, 0);
    this.set(L1TagProvider.TAGS.BLOCKCHAIN_VERIFIED, true);
  }

  _updateCounters(type) {
    if (type === 'claim') {
      this.set(L1TagProvider.TAGS.CLAIMS_PENDING,
        this.getTransactions('claim', 'PENDING').length);
      this.set(L1TagProvider.TAGS.CLAIMS_APPROVED,
        this.getTransactions('claim', 'APPROVED').length);
    }
  }

  _notifySubscribers(tagPath, newValue, oldValue) {
    const subs = this.subscriptions.get(tagPath);
    if (subs) {
      subs.forEach(cb => cb(newValue, oldValue));
    }
  }
}

export const l1TagProvider = new L1TagProvider();
l1TagProvider.initialize();

export default l1TagProvider;
