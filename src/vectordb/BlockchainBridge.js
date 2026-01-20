/**
 * Blockchain Bridge - Links Vector DB to ISA-80085 Ledger
 *
 * Provides immutable verification of vector block chains:
 * - Records document reconstructions on blockchain
 * - Verifies chain integrity via Merkle proofs
 * - Tracks all block modifications
 */

const { GovernmentBlockchain, TransactionType } = require('../isa80085/BlockchainCore');
const { AuditMerkleTree } = require('../isa80085/MerkleTree');
const crypto = require('crypto');

class BlockchainBridge {
  constructor(vectorDB, blockchain = null) {
    this.vectorDB = vectorDB;
    this.blockchain = blockchain || new GovernmentBlockchain('nac-vector-ledger');
    this.merkleTree = new AuditMerkleTree();
  }

  // Record a document chain on the blockchain
  recordDocumentChain(documentId) {
    const doc = this.vectorDB.reconstructDocument(documentId);
    if (!doc || doc.blocks.length === 0) {
      return { success: false, error: 'Document not found' };
    }

    // Create Merkle tree of block hashes
    const blockRecords = doc.blocks.map(b => ({
      id: b.id,
      type: 'VECTOR_BLOCK',
      timestamp: b.created_at,
      hash: b.content_hash,
      statute: b.statute,
    }));

    this.merkleTree.addRecords(blockRecords);

    // Record on blockchain
    const tx = this.blockchain.addTransaction(
      'document_recorded',
      {
        documentId,
        name: doc.documentId,
        blockCount: doc.blockCount,
        merkleRoot: this.merkleTree.getRoot(),
        firstBlock: doc.blocks[0].id,
        lastBlock: doc.blocks[doc.blocks.length - 1].id,
        chainHash: this.calculateChainHash(doc.blocks),
      },
      'vector-db-bridge'
    );

    return {
      success: true,
      transactionId: tx.id,
      merkleRoot: this.merkleTree.getRoot(),
      blockCount: doc.blockCount,
    };
  }

  // Record a single block modification
  recordBlockModification(blockId, action, previousHash = null) {
    const block = this.vectorDB.getBlock(blockId);
    if (!block) {
      return { success: false, error: 'Block not found' };
    }

    const tx = this.blockchain.addTransaction(
      'block_modified',
      {
        blockId,
        statute: block.statute,
        action, // 'created', 'updated', 'linked', 'deleted'
        contentHash: block.content_hash,
        previousHash,
        coords: { x: block.x, y: block.y, z: block.z },
      },
      'vector-db-bridge'
    );

    return {
      success: true,
      transactionId: tx.id,
      blockHash: block.content_hash,
    };
  }

  // Verify a document chain against blockchain records
  verifyDocumentChain(documentId) {
    const doc = this.vectorDB.reconstructDocument(documentId);
    if (!doc || doc.blocks.length === 0) {
      return { valid: false, error: 'Document not found' };
    }

    // Find blockchain record
    const records = this.blockchain.findTransactions({
      type: 'document_recorded',
    });

    const chainRecord = records.find(r => r.data.documentId === documentId);
    if (!chainRecord) {
      return { valid: false, error: 'No blockchain record found' };
    }

    // Verify chain hash
    const currentChainHash = this.calculateChainHash(doc.blocks);
    const hashMatch = currentChainHash === chainRecord.data.chainHash;

    // Verify block count
    const countMatch = doc.blockCount === chainRecord.data.blockCount;

    // Verify individual blocks
    const blockVerification = doc.blocks.map(block => {
      const expectedHash = crypto.createHash('sha256')
        .update(block.content)
        .digest('hex');
      return {
        blockId: block.id,
        valid: block.content_hash === expectedHash,
      };
    });

    const allBlocksValid = blockVerification.every(b => b.valid);

    return {
      valid: hashMatch && countMatch && allBlocksValid,
      chainHashMatch: hashMatch,
      blockCountMatch: countMatch,
      allBlocksValid,
      recordedAt: chainRecord.timestamp,
      blockchainTx: chainRecord.blockHash,
      details: blockVerification,
    };
  }

  // Generate Merkle proof for a specific block
  getBlockProof(documentId, blockId) {
    const doc = this.vectorDB.reconstructDocument(documentId);
    if (!doc) return null;

    const blockIndex = doc.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return null;

    // Rebuild Merkle tree for this document
    const tree = new AuditMerkleTree();
    tree.addRecords(doc.blocks.map(b => ({
      id: b.id,
      type: 'VECTOR_BLOCK',
      timestamp: b.created_at,
      hash: b.content_hash,
    })));

    return tree.getProof(blockIndex);
  }

  // Finalize and create a blockchain block
  finalizeBlock() {
    return this.blockchain.createBlock('vector-db-authority');
  }

  // Get blockchain validation status
  getValidationStatus() {
    return {
      chainValid: this.blockchain.validateChain(),
      blockCount: this.blockchain.chain.length,
      pendingTransactions: this.blockchain.pendingTransactions.length,
    };
  }

  // Export full audit trail
  exportAuditTrail() {
    return {
      vectorDB: this.vectorDB.getStats(),
      blockchain: this.blockchain.exportForAudit(),
      merkleTree: this.merkleTree.generateCertificate(),
      generated: new Date().toISOString(),
    };
  }

  // Calculate chain hash from blocks
  calculateChainHash(blocks) {
    const hashes = blocks.map(b => b.content_hash);
    return crypto.createHash('sha256')
      .update(hashes.join(''))
      .digest('hex');
  }
}

module.exports = { BlockchainBridge };
