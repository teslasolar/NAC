/**
 * Blockchain Signer - L1 Transaction Integration
 *
 * Bridges L1 transactions with ISA-80085 blockchain for
 * immutable audit trails and cryptographic verification.
 *
 * @module L1_Transactions/signing/BlockchainSigner
 * @standard ISA-80085, ISA-95 Level 1
 */

/**
 * Transaction types mapping to ISA-80085
 */
export const L1TransactionTypes = {
  // Claims
  CLAIM_CREATE: 'claim_submitted',
  CLAIM_APPROVE: 'claim_approved',
  CLAIM_REJECT: 'claim_rejected',

  // Payments
  WARRANT_ISSUE: 'payment_issued',
  WARRANT_CLEAR: 'payment_cleared',
  WARRANT_VOID: 'payment_voided',

  // Receipts
  RECEIPT_RECORD: 'receipt_recorded',
  RECEIPT_DEPOSIT: 'receipt_deposited',

  // Audits
  AUDIT_START: 'audit_started',
  AUDIT_COMPLETE: 'audit_completed',
  FINDING_RECORD: 'finding_recorded',
  FINDING_RESOLVE: 'finding_resolved',

  // Recordings
  DOCUMENT_RECORD: 'document_recorded',
  DOCUMENT_INDEX: 'document_indexed'
};

/**
 * Signature wrapper for L1 transactions
 */
export class SignedTransaction {
  constructor(transaction, signature, blockchainRef) {
    this.transaction = transaction;
    this.signature = signature;
    this.blockchainRef = blockchainRef;
    this.signedAt = new Date();
    this.verified = false;
  }

  toJSON() {
    return {
      transactionId: this.transaction.id,
      type: this.transaction.type,
      signature: this.signature,
      blockchainRef: this.blockchainRef,
      signedAt: this.signedAt.toISOString(),
      verified: this.verified
    };
  }
}

/**
 * BlockchainSigner - Main signing interface for L1 transactions
 */
export class BlockchainSigner {
  constructor(governmentLedger = null) {
    this.ledger = governmentLedger;
    this.pendingTransactions = [];
    this.signedTransactions = new Map();
    this.signers = new Map();

    // Hooks for pre/post signing
    this.hooks = {
      preSigning: [],
      postSigning: [],
      onBlock: []
    };
  }

  /**
   * Set the government ledger (late binding)
   */
  setLedger(ledger) {
    this.ledger = ledger;
  }

  /**
   * Register a signer (authority)
   */
  registerSigner(id, name, role, keyPair = null) {
    const signer = {
      id,
      name,
      role,
      keyPair,
      registeredAt: new Date()
    };
    this.signers.set(id, signer);

    if (this.ledger) {
      this.ledger.registerOfficial(id, name, role);
    }

    return signer;
  }

  /**
   * Sign an L1 transaction
   */
  async signTransaction(transaction, signerId, options = {}) {
    const signer = this.signers.get(signerId);
    if (!signer) {
      throw new Error(`Unknown signer: ${signerId}`);
    }

    // Run pre-signing hooks
    for (const hook of this.hooks.preSigning) {
      const result = await hook(transaction, signer);
      if (result === false) {
        throw new Error('Pre-signing hook rejected transaction');
      }
    }

    // Map L1 transaction type to blockchain type
    const blockchainType = this._mapTransactionType(transaction);

    // Prepare transaction data for blockchain
    const blockchainData = {
      l1TransactionId: transaction.id,
      l1Type: transaction.type,
      entityType: transaction.entityType,
      entityId: transaction.entityId,
      amount: transaction.amount,
      authority: transaction.authority,
      timestamp: new Date().toISOString(),
      ...options.additionalData
    };

    let signature = null;
    let blockchainRef = null;

    if (this.ledger) {
      // Record in blockchain
      const tx = this.ledger.blockchain.addTransaction(
        blockchainType,
        blockchainData,
        signerId
      );

      signature = tx.hash;
      blockchainRef = {
        chainId: this.ledger.blockchain.chainId,
        transactionHash: tx.hash,
        pending: true
      };
    } else {
      // Generate local signature without blockchain
      signature = await this._generateLocalSignature(transaction, signer);
      blockchainRef = {
        chainId: 'local',
        transactionHash: signature,
        pending: false
      };
    }

    const signedTx = new SignedTransaction(transaction, signature, blockchainRef);
    this.signedTransactions.set(transaction.id, signedTx);
    this.pendingTransactions.push(signedTx);

    // Run post-signing hooks
    for (const hook of this.hooks.postSigning) {
      await hook(signedTx, signer);
    }

    return signedTx;
  }

  /**
   * Map L1 transaction to blockchain type
   */
  _mapTransactionType(transaction) {
    const typeMap = {
      'Claim': L1TransactionTypes.CLAIM_CREATE,
      'ClaimApproval': L1TransactionTypes.CLAIM_APPROVE,
      'Warrant': L1TransactionTypes.WARRANT_ISSUE,
      'Receipt': L1TransactionTypes.RECEIPT_RECORD,
      'AuditEngagement': L1TransactionTypes.AUDIT_START,
      'Finding': L1TransactionTypes.FINDING_RECORD
    };

    return typeMap[transaction.entityType] || transaction.type;
  }

  /**
   * Generate local signature (for testing without blockchain)
   */
  async _generateLocalSignature(transaction, signer) {
    // Create a hash of transaction data
    const data = JSON.stringify({
      id: transaction.id,
      type: transaction.type,
      entityType: transaction.entityType,
      entityId: transaction.entityId,
      signerId: signer.id,
      timestamp: new Date().toISOString()
    });

    // Use Web Crypto if available, otherwise simple hash
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Fallback simple hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  /**
   * Finalize pending transactions into a block
   */
  finalizeBlock(authority) {
    if (!this.ledger) {
      // Mark all pending as finalized locally
      for (const signedTx of this.pendingTransactions) {
        signedTx.blockchainRef.pending = false;
        signedTx.verified = true;
      }
      const count = this.pendingTransactions.length;
      this.pendingTransactions = [];
      return { local: true, transactionCount: count };
    }

    const block = this.ledger.finalizeBlock(authority);

    if (block) {
      // Update signed transactions with block reference
      for (const signedTx of this.pendingTransactions) {
        signedTx.blockchainRef.blockIndex = block.index;
        signedTx.blockchainRef.blockHash = block.hash;
        signedTx.blockchainRef.pending = false;
        signedTx.verified = true;
      }

      // Notify hooks
      for (const hook of this.hooks.onBlock) {
        hook(block, this.pendingTransactions);
      }

      this.pendingTransactions = [];
    }

    return block;
  }

  /**
   * Verify a signed transaction
   */
  async verifyTransaction(transactionId) {
    const signedTx = this.signedTransactions.get(transactionId);
    if (!signedTx) {
      return { valid: false, error: 'Transaction not found' };
    }

    if (!this.ledger) {
      // Local verification only
      return {
        valid: true,
        local: true,
        signature: signedTx.signature
      };
    }

    // Verify on blockchain
    const chainTx = this.ledger.query({
      after: signedTx.signedAt.toISOString()
    }).find(tx => tx.data?.l1TransactionId === transactionId);

    if (!chainTx) {
      return { valid: false, error: 'Transaction not found on blockchain' };
    }

    return {
      valid: true,
      signature: signedTx.signature,
      blockchainRef: signedTx.blockchainRef,
      chainTransaction: chainTx
    };
  }

  /**
   * Get audit proof for transaction
   */
  getAuditProof(transactionId) {
    const signedTx = this.signedTransactions.get(transactionId);
    if (!signedTx) {
      return null;
    }

    if (!this.ledger) {
      return {
        transactionId,
        signature: signedTx.signature,
        signedAt: signedTx.signedAt,
        proofType: 'local'
      };
    }

    return {
      transactionId,
      signature: signedTx.signature,
      blockchainRef: signedTx.blockchainRef,
      signedAt: signedTx.signedAt,
      chainValidation: this.ledger.validate(),
      proofType: 'blockchain'
    };
  }

  /**
   * Register hook
   */
  addHook(type, handler) {
    if (this.hooks[type]) {
      this.hooks[type].push(handler);
    }
  }

  /**
   * Get signing statistics
   */
  getStatistics() {
    return {
      totalSigned: this.signedTransactions.size,
      pendingCount: this.pendingTransactions.length,
      signerCount: this.signers.size,
      hasLedger: !!this.ledger,
      ledgerValidation: this.ledger ? this.ledger.validate() : null
    };
  }
}

/**
 * Create blockchain signer with optional ledger
 */
export function createBlockchainSigner(ledger = null) {
  return new BlockchainSigner(ledger);
}

/**
 * L1 Transaction factory with automatic signing
 */
export class SignedTransactionFactory {
  constructor(signer, defaultSignerId) {
    this.signer = signer;
    this.defaultSignerId = defaultSignerId;
  }

  async createSignedClaim(claimData, signerId = null) {
    const transaction = {
      id: `CLM-${Date.now()}`,
      type: 'CLAIM_CREATE',
      entityType: 'Claim',
      entityId: claimData.id,
      amount: claimData.amount,
      authority: '16 Pa.C.S. §1750',
      data: claimData
    };

    return this.signer.signTransaction(
      transaction,
      signerId || this.defaultSignerId
    );
  }

  async createSignedWarrant(warrantData, signerId = null) {
    const transaction = {
      id: `WAR-${Date.now()}`,
      type: 'WARRANT_ISSUE',
      entityType: 'Warrant',
      entityId: warrantData.number,
      amount: warrantData.amount,
      authority: '16 Pa.C.S. §1760',
      data: warrantData
    };

    return this.signer.signTransaction(
      transaction,
      signerId || this.defaultSignerId
    );
  }

  async createSignedReceipt(receiptData, signerId = null) {
    const transaction = {
      id: `RCT-${Date.now()}`,
      type: 'RECEIPT_RECORD',
      entityType: 'Receipt',
      entityId: receiptData.id,
      amount: receiptData.amount,
      authority: '16 Pa.C.S. §1710',
      data: receiptData
    };

    return this.signer.signTransaction(
      transaction,
      signerId || this.defaultSignerId
    );
  }
}

export default BlockchainSigner;
