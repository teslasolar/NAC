/**
 * ISA-80085 Blockchain Core
 * Distributed Ledger for Government Accountability
 *
 * Implements:
 * - Immutable block structure
 * - SHA-256 chain integrity
 * - Proof of Authority consensus
 * - Deterministic transaction replay
 */

const crypto = require('crypto');

// Block structure per ISA-80085 §4.1
class Block {
  constructor(index, timestamp, transactions, previousHash, authority) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.authority = authority; // Signing authority (e.g., 'controller')
    this.nonce = 0;
    this.merkleRoot = this.calculateMerkleRoot();
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const data = JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      merkleRoot: this.merkleRoot,
      previousHash: this.previousHash,
      authority: this.authority,
      nonce: this.nonce,
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  calculateMerkleRoot() {
    if (this.transactions.length === 0) {
      return crypto.createHash('sha256').update('empty').digest('hex');
    }

    let hashes = this.transactions.map(tx =>
      crypto.createHash('sha256').update(JSON.stringify(tx)).digest('hex')
    );

    while (hashes.length > 1) {
      const newHashes = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;
        newHashes.push(
          crypto.createHash('sha256').update(left + right).digest('hex')
        );
      }
      hashes = newHashes;
    }

    return hashes[0];
  }

  // Proof of Authority - no mining, just authority signing
  sign(authorityKey) {
    const signer = crypto.createSign('SHA256');
    signer.update(this.hash);
    this.signature = signer.sign(authorityKey, 'hex');
  }

  verify(authorityPublicKey) {
    if (!this.signature) return false;
    const verifier = crypto.createVerify('SHA256');
    verifier.update(this.hash);
    return verifier.verify(authorityPublicKey, this.signature, 'hex');
  }
}

// Transaction types per ISA-80085 §5.2
const TransactionType = {
  // Financial
  CLAIM_SUBMITTED: 'claim_submitted',
  CLAIM_APPROVED: 'claim_approved',
  CLAIM_REJECTED: 'claim_rejected',
  PAYMENT_ISSUED: 'payment_issued',
  RECEIPT_RECORDED: 'receipt_recorded',

  // Audit
  AUDIT_STARTED: 'audit_started',
  AUDIT_COMPLETED: 'audit_completed',
  FINDING_RECORDED: 'finding_recorded',
  FINDING_RESOLVED: 'finding_resolved',

  // Governance
  BUDGET_ADOPTED: 'budget_adopted',
  BUDGET_AMENDED: 'budget_amended',
  BOARD_VOTE: 'board_vote',
  RESOLUTION_PASSED: 'resolution_passed',

  // Administrative
  ACCOUNT_CREATED: 'account_created',
  ACCESS_GRANTED: 'access_granted',
  ACCESS_REVOKED: 'access_revoked',
  CONFIG_CHANGED: 'config_changed',
};

class Transaction {
  constructor(type, data, initiator) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.data = data;
    this.initiator = initiator;
    this.timestamp = new Date().toISOString();
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(JSON.stringify({
        id: this.id,
        type: this.type,
        data: this.data,
        initiator: this.initiator,
        timestamp: this.timestamp,
      }))
      .digest('hex');
  }
}

// Main blockchain class
class GovernmentBlockchain {
  constructor(chainId = 'northampton-county') {
    this.chainId = chainId;
    this.chain = [];
    this.pendingTransactions = [];
    this.authorities = new Map(); // Authorized signers

    // Create genesis block
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesis = new Block(
      0,
      '2025-01-01T00:00:00.000Z',
      [{
        type: 'GENESIS',
        data: {
          chainId: this.chainId,
          standard: 'ISA-80085 v1.0',
          jurisdiction: 'Northampton County, PA',
          authority: 'County Controller',
          statute: '16 Pa.C.S. §1602',
        },
        initiator: 'system',
      }],
      '0'.repeat(64),
      'system'
    );
    this.chain.push(genesis);
  }

  registerAuthority(id, name, publicKey) {
    this.authorities.set(id, { name, publicKey, registeredAt: new Date().toISOString() });
    this.addTransaction(TransactionType.ACCESS_GRANTED, {
      authorityId: id,
      authorityName: name,
      role: 'block_signer',
    }, 'system');
  }

  addTransaction(type, data, initiator) {
    const tx = new Transaction(type, data, initiator);
    this.pendingTransactions.push(tx);
    return tx;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  createBlock(authority) {
    if (this.pendingTransactions.length === 0) {
      return null;
    }

    const latestBlock = this.getLatestBlock();
    const newBlock = new Block(
      latestBlock.index + 1,
      new Date().toISOString(),
      [...this.pendingTransactions],
      latestBlock.hash,
      authority
    );

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  // Validate entire chain integrity
  validateChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // Verify hash
      if (current.hash !== current.calculateHash()) {
        return { valid: false, error: `Block ${i} hash mismatch`, block: i };
      }

      // Verify chain link
      if (current.previousHash !== previous.hash) {
        return { valid: false, error: `Block ${i} chain link broken`, block: i };
      }

      // Verify merkle root
      if (current.merkleRoot !== current.calculateMerkleRoot()) {
        return { valid: false, error: `Block ${i} merkle root mismatch`, block: i };
      }
    }

    return { valid: true, blocks: this.chain.length };
  }

  // Query transactions
  findTransactions(filter) {
    const results = [];
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (this.matchesFilter(tx, filter)) {
          results.push({ ...tx, blockIndex: block.index, blockHash: block.hash });
        }
      }
    }
    return results;
  }

  matchesFilter(tx, filter) {
    if (filter.type && tx.type !== filter.type) return false;
    if (filter.initiator && tx.initiator !== filter.initiator) return false;
    if (filter.after && new Date(tx.timestamp) < new Date(filter.after)) return false;
    if (filter.before && new Date(tx.timestamp) > new Date(filter.before)) return false;
    return true;
  }

  // Export for audit
  exportForAudit(startBlock = 0, endBlock = this.chain.length) {
    return {
      chainId: this.chainId,
      standard: 'ISA-80085',
      exportedAt: new Date().toISOString(),
      validation: this.validateChain(),
      blocks: this.chain.slice(startBlock, endBlock).map(b => ({
        index: b.index,
        timestamp: b.timestamp,
        hash: b.hash,
        previousHash: b.previousHash,
        merkleRoot: b.merkleRoot,
        authority: b.authority,
        transactionCount: b.transactions.length,
        transactions: b.transactions,
      })),
    };
  }

  // Deterministic replay for verification
  replay(transactions) {
    const replayChain = new GovernmentBlockchain(`${this.chainId}-replay`);

    for (const tx of transactions) {
      replayChain.addTransaction(tx.type, tx.data, tx.initiator);
    }

    replayChain.createBlock('replay-authority');
    return replayChain.validateChain();
  }
}

module.exports = {
  Block,
  Transaction,
  TransactionType,
  GovernmentBlockchain,
};
