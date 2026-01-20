/**
 * Chain Linker - Reconstructs Legal Documents from Vector Blocks
 *
 * Links blocks together to form complete documents:
 * - Document order (prev/next links)
 * - Semantic similarity (spatial links)
 * - Hierarchical structure (parent/child)
 *
 * Integrates with ISA-80085 blockchain for verification.
 */

const { VectorBlockDB } = require('./VectorBlockDB');
const { EmbeddingGenerator } = require('./EmbeddingGenerator');
const crypto = require('crypto');

class ChainLinker {
  constructor(db) {
    this.db = db;
    this.embedder = new EmbeddingGenerator();
  }

  // Link blocks in document order
  linkDocumentOrder(blockIds) {
    const updates = this.db.db.prepare(`
      UPDATE blocks SET prev_id = ?, next_id = ? WHERE id = ?
    `);

    const transaction = this.db.db.transaction(() => {
      for (let i = 0; i < blockIds.length; i++) {
        const prevId = i > 0 ? blockIds[i - 1] : null;
        const nextId = i < blockIds.length - 1 ? blockIds[i + 1] : null;
        updates.run(prevId, nextId, blockIds[i]);
      }
    });

    transaction();
    return blockIds.length;
  }

  // Build semantic links based on embedding similarity
  buildSemanticLinks(threshold = 0.7, maxLinks = 5) {
    const blocks = this.db.db.prepare(`
      SELECT id, embedding FROM blocks WHERE embedding IS NOT NULL
    `).all();

    let linkCount = 0;

    blocks.forEach(block => {
      const embedding = JSON.parse(block.embedding);
      const similarities = [];

      blocks.forEach(other => {
        if (other.id === block.id) return;
        const otherEmbedding = JSON.parse(other.embedding);
        const sim = this.embedder.cosineSimilarity(embedding, otherEmbedding);

        if (sim >= threshold) {
          similarities.push({ id: other.id, similarity: sim });
        }
      });

      // Sort by similarity and take top N
      similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, maxLinks)
        .forEach(({ id, similarity }) => {
          // Distance = 1 - similarity (closer = more similar)
          this.db.addSpatialLink(block.id, id, 1 - similarity, 'semantic', similarity);
          linkCount++;
        });
    });

    return linkCount;
  }

  // Build hierarchical links (article -> section -> subsection)
  buildHierarchyLinks() {
    const articles = this.db.db.prepare(`
      SELECT DISTINCT article FROM blocks WHERE article IS NOT NULL ORDER BY article
    `).all();

    let linkCount = 0;

    articles.forEach(({ article }) => {
      const sections = this.db.db.prepare(`
        SELECT id, section FROM blocks
        WHERE article = ? AND block_type = 'section'
        ORDER BY sequence
      `).all(article);

      sections.forEach((section, idx) => {
        // Link to article root
        const articleRoot = this.db.db.prepare(`
          SELECT id FROM blocks WHERE article = ? AND block_type = 'article' LIMIT 1
        `).get(article);

        if (articleRoot) {
          this.db.addSpatialLink(section.id, articleRoot.id, 1.0, 'hierarchy', 0.5);
          linkCount++;
        }

        // Link to adjacent sections
        if (idx > 0) {
          this.db.addSpatialLink(section.id, sections[idx - 1].id, 0.5, 'adjacent', 0.8);
          linkCount++;
        }
      });
    });

    return linkCount;
  }

  // Build 3D spatial links based on coordinate proximity
  build3DProximityLinks(maxDistance = 2.0, maxLinks = 3) {
    const blocks = this.db.db.prepare(`
      SELECT id, x, y, z FROM blocks WHERE x IS NOT NULL
    `).all();

    let linkCount = 0;

    blocks.forEach(block => {
      const distances = [];

      blocks.forEach(other => {
        if (other.id === block.id) return;

        const dist = Math.sqrt(
          Math.pow(block.x - other.x, 2) +
          Math.pow(block.y - other.y, 2) +
          Math.pow(block.z - other.z, 2)
        );

        if (dist <= maxDistance) {
          distances.push({ id: other.id, distance: dist });
        }
      });

      distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxLinks)
        .forEach(({ id, distance }) => {
          this.db.addSpatialLink(block.id, id, distance, 'spatial_3d', 1 / (1 + distance));
          linkCount++;
        });
    });

    return linkCount;
  }

  // Reconstruct document by traversing links
  reconstructByTraversal(startBlockId, linkType = null) {
    const visited = new Set();
    const blocks = [];

    const traverse = (blockId) => {
      if (visited.has(blockId)) return;
      visited.add(blockId);

      const block = this.db.getBlock(blockId);
      if (!block) return;

      blocks.push(block);

      // Follow next link for document order
      if (block.next_id && !linkType) {
        traverse(block.next_id);
      }

      // Follow spatial links if specified
      if (linkType) {
        const links = this.db.db.prepare(`
          SELECT target_id FROM spatial_links
          WHERE source_id = ? AND link_type = ?
          ORDER BY distance ASC
        `).all(blockId, linkType);

        links.forEach(({ target_id }) => traverse(target_id));
      }
    };

    traverse(startBlockId);
    return blocks;
  }

  // Generate chain hash (for blockchain integration)
  generateChainHash(blockIds) {
    const hashes = blockIds.map(id => {
      const block = this.db.getBlock(id);
      return block ? block.content_hash : '';
    });

    return crypto.createHash('sha256')
      .update(hashes.join(''))
      .digest('hex');
  }

  // Verify chain integrity
  verifyChain(startBlockId) {
    const blocks = this.reconstructByTraversal(startBlockId);
    const results = {
      valid: true,
      blockCount: blocks.length,
      errors: [],
    };

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];

      // Verify content hash
      const expectedHash = crypto.createHash('sha256')
        .update(block.content)
        .digest('hex');

      if (block.content_hash !== expectedHash) {
        results.valid = false;
        results.errors.push({
          blockId: block.id,
          error: 'content_hash_mismatch',
          expected: expectedHash,
          actual: block.content_hash,
        });
      }

      // Verify link integrity
      if (i < blocks.length - 1) {
        if (block.next_id !== blocks[i + 1].id) {
          results.valid = false;
          results.errors.push({
            blockId: block.id,
            error: 'chain_link_broken',
            expected: blocks[i + 1].id,
            actual: block.next_id,
          });
        }
      }
    }

    results.chainHash = this.generateChainHash(blocks.map(b => b.id));
    return results;
  }

  // Export chain for ISA-80085 blockchain
  exportForBlockchain(documentId) {
    const doc = this.db.reconstructDocument(documentId);

    return {
      documentId,
      blockCount: doc.blockCount,
      chainHash: this.generateChainHash(doc.blocks.map(b => b.id)),
      blocks: doc.blocks.map(b => ({
        id: b.id,
        statute: b.statute,
        contentHash: b.content_hash,
        prevId: b.prev_id,
        nextId: b.next_id,
        coords: { x: b.x, y: b.y, z: b.z },
      })),
      verification: this.verifyChain(doc.blocks[0]?.id),
    };
  }
}

module.exports = { ChainLinker };
