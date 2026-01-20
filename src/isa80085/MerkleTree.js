/**
 * ISA-80085 Merkle Tree Implementation
 * Efficient cryptographic verification structure
 *
 * Use cases:
 * - Batch transaction verification
 * - Audit record integrity
 * - Incremental sync verification
 * - Proof generation for third parties
 */

const crypto = require('crypto');

class MerkleNode {
  constructor(hash, left = null, right = null, data = null) {
    this.hash = hash;
    this.left = left;
    this.right = right;
    this.data = data; // Only leaf nodes have data
  }

  isLeaf() {
    return this.left === null && this.right === null;
  }
}

class MerkleTree {
  constructor(dataItems = [], hashFn = null) {
    this.hashFn = hashFn || this.defaultHash;
    this.leaves = [];
    this.root = null;

    if (dataItems.length > 0) {
      this.build(dataItems);
    }
  }

  defaultHash(data) {
    const input = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  // Build tree from data items
  build(dataItems) {
    if (dataItems.length === 0) {
      this.root = new MerkleNode(this.hashFn('empty'));
      return this;
    }

    // Create leaf nodes
    this.leaves = dataItems.map(item => {
      const hash = this.hashFn(item);
      return new MerkleNode(hash, null, null, item);
    });

    // Build tree bottom-up
    let currentLevel = this.leaves;

    while (currentLevel.length > 1) {
      const nextLevel = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left; // Duplicate last if odd

        const combinedHash = this.hashFn(left.hash + right.hash);
        const parent = new MerkleNode(combinedHash, left, right);
        nextLevel.push(parent);
      }

      currentLevel = nextLevel;
    }

    this.root = currentLevel[0];
    return this;
  }

  getRoot() {
    return this.root?.hash || null;
  }

  // Generate proof for a specific leaf
  getProof(index) {
    if (index < 0 || index >= this.leaves.length) {
      return null;
    }

    const proof = [];
    let currentIndex = index;
    let currentLevel = this.leaves;

    while (currentLevel.length > 1) {
      const isRightNode = currentIndex % 2 === 1;
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

      if (siblingIndex < currentLevel.length) {
        proof.push({
          hash: currentLevel[siblingIndex].hash,
          position: isRightNode ? 'left' : 'right',
        });
      } else {
        // Odd number - sibling is self
        proof.push({
          hash: currentLevel[currentIndex].hash,
          position: 'right',
        });
      }

      // Move to parent level
      currentIndex = Math.floor(currentIndex / 2);

      // Rebuild next level (simplified - in production, cache levels)
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left;
        const combinedHash = this.hashFn(left.hash + right.hash);
        nextLevel.push(new MerkleNode(combinedHash, left, right));
      }
      currentLevel = nextLevel;
    }

    return {
      leaf: this.leaves[index].hash,
      leafData: this.leaves[index].data,
      proof,
      root: this.root.hash,
    };
  }

  // Verify a proof
  static verifyProof(leafHash, proof, rootHash, hashFn = null) {
    const hash = hashFn || ((d) => crypto.createHash('sha256').update(d).digest('hex'));

    let currentHash = leafHash;

    for (const step of proof) {
      if (step.position === 'left') {
        currentHash = hash(step.hash + currentHash);
      } else {
        currentHash = hash(currentHash + step.hash);
      }
    }

    return currentHash === rootHash;
  }

  // Verify entire tree integrity
  verify() {
    if (!this.root) return false;
    return this.verifyNode(this.root);
  }

  verifyNode(node) {
    if (node.isLeaf()) {
      return node.hash === this.hashFn(node.data);
    }

    const expectedHash = this.hashFn(node.left.hash + node.right.hash);
    if (node.hash !== expectedHash) return false;

    return this.verifyNode(node.left) && this.verifyNode(node.right);
  }

  // Export tree structure
  export() {
    return {
      root: this.root.hash,
      leafCount: this.leaves.length,
      leaves: this.leaves.map((l, i) => ({
        index: i,
        hash: l.hash,
        data: l.data,
      })),
    };
  }

  // Get all hashes at a specific level (0 = root)
  getLevel(level) {
    let currentLevel = [this.root];
    let currentDepth = 0;

    while (currentDepth < level) {
      const nextLevel = [];
      for (const node of currentLevel) {
        if (node.left) nextLevel.push(node.left);
        if (node.right && node.right !== node.left) nextLevel.push(node.right);
      }
      if (nextLevel.length === 0) break;
      currentLevel = nextLevel;
      currentDepth++;
    }

    return currentLevel.map(n => n.hash);
  }
}

// Specialized tree for audit records
class AuditMerkleTree extends MerkleTree {
  constructor(auditRecords = []) {
    super();
    this.records = [];
    if (auditRecords.length > 0) {
      this.addRecords(auditRecords);
    }
  }

  addRecords(records) {
    this.records = [...this.records, ...records];
    const dataItems = this.records.map(r => ({
      id: r.id,
      type: r.type,
      timestamp: r.timestamp,
      hash: r.hash || this.hashFn(r),
    }));
    this.build(dataItems);
    return this;
  }

  getRecordProof(recordId) {
    const index = this.records.findIndex(r => r.id === recordId);
    if (index === -1) return null;
    return this.getProof(index);
  }

  // Generate audit certificate
  generateCertificate() {
    return {
      type: 'ISA-80085-AUDIT-CERTIFICATE',
      version: '1.0',
      generated: new Date().toISOString(),
      merkleRoot: this.getRoot(),
      recordCount: this.records.length,
      integrity: this.verify() ? 'VERIFIED' : 'FAILED',
      records: this.records.map((r, i) => ({
        index: i,
        id: r.id,
        type: r.type,
        timestamp: r.timestamp,
      })),
    };
  }
}

module.exports = {
  MerkleNode,
  MerkleTree,
  AuditMerkleTree,
};
