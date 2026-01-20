/**
 * 3D Vector Database for Legal Code Blocks
 *
 * Each legal code section is a "block" with:
 * - 3D vector embedding (semantic position in legal space)
 * - Links to adjacent blocks (prev/next in document order)
 * - Spatial links (semantically similar blocks)
 * - Hash for integrity verification
 *
 * Blocks reconstruct the full charter when linked.
 */

const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

class VectorBlockDB {
  constructor(dbPath) {
    this.dbPath = dbPath || path.join(__dirname, '../../data/vectors/legal-vectors.db');
    this.db = new Database(this.dbPath);
    this.dimensions = 384; // Standard embedding size (can use 3D for visualization)
    this.init();
  }

  init() {
    // Main blocks table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS blocks (
        id TEXT PRIMARY KEY,
        statute TEXT NOT NULL,
        title TEXT,
        content TEXT NOT NULL,
        content_hash TEXT NOT NULL,

        -- Vector embedding (stored as JSON array)
        embedding TEXT,

        -- 3D coordinates for visualization
        x REAL DEFAULT 0,
        y REAL DEFAULT 0,
        z REAL DEFAULT 0,

        -- Document structure links
        parent_id TEXT,
        prev_id TEXT,
        next_id TEXT,
        depth INTEGER DEFAULT 0,
        sequence INTEGER DEFAULT 0,

        -- Metadata
        article TEXT,
        section TEXT,
        subsection TEXT,
        block_type TEXT DEFAULT 'section',

        -- Timestamps
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (parent_id) REFERENCES blocks(id),
        FOREIGN KEY (prev_id) REFERENCES blocks(id),
        FOREIGN KEY (next_id) REFERENCES blocks(id)
      );

      -- Spatial links (semantic similarity)
      CREATE TABLE IF NOT EXISTS spatial_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        distance REAL NOT NULL,
        link_type TEXT DEFAULT 'semantic',
        weight REAL DEFAULT 1.0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (source_id) REFERENCES blocks(id),
        FOREIGN KEY (target_id) REFERENCES blocks(id),
        UNIQUE(source_id, target_id, link_type)
      );

      -- Document reconstruction paths
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        root_block_id TEXT,
        block_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (root_block_id) REFERENCES blocks(id)
      );

      -- Block to document mapping
      CREATE TABLE IF NOT EXISTS document_blocks (
        document_id TEXT NOT NULL,
        block_id TEXT NOT NULL,
        position INTEGER NOT NULL,

        PRIMARY KEY (document_id, block_id),
        FOREIGN KEY (document_id) REFERENCES documents(id),
        FOREIGN KEY (block_id) REFERENCES blocks(id)
      );

      -- Indexes for fast queries
      CREATE INDEX IF NOT EXISTS idx_blocks_statute ON blocks(statute);
      CREATE INDEX IF NOT EXISTS idx_blocks_article ON blocks(article);
      CREATE INDEX IF NOT EXISTS idx_blocks_coords ON blocks(x, y, z);
      CREATE INDEX IF NOT EXISTS idx_spatial_source ON spatial_links(source_id);
      CREATE INDEX IF NOT EXISTS idx_spatial_target ON spatial_links(target_id);
      CREATE INDEX IF NOT EXISTS idx_spatial_distance ON spatial_links(distance);
    `);

    // Prepare statements
    this.stmts = {
      insertBlock: this.db.prepare(`
        INSERT OR REPLACE INTO blocks
        (id, statute, title, content, content_hash, embedding, x, y, z,
         parent_id, prev_id, next_id, depth, sequence, article, section, subsection, block_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `),

      getBlock: this.db.prepare(`SELECT * FROM blocks WHERE id = ?`),

      getByStatute: this.db.prepare(`SELECT * FROM blocks WHERE statute = ?`),

      getByArticle: this.db.prepare(`SELECT * FROM blocks WHERE article = ? ORDER BY sequence`),

      insertLink: this.db.prepare(`
        INSERT OR REPLACE INTO spatial_links (source_id, target_id, distance, link_type, weight)
        VALUES (?, ?, ?, ?, ?)
      `),

      getNearestNeighbors: this.db.prepare(`
        SELECT b.*, sl.distance
        FROM spatial_links sl
        JOIN blocks b ON sl.target_id = b.id
        WHERE sl.source_id = ?
        ORDER BY sl.distance ASC
        LIMIT ?
      `),

      getChain: this.db.prepare(`
        WITH RECURSIVE chain AS (
          SELECT * FROM blocks WHERE id = ?
          UNION ALL
          SELECT b.* FROM blocks b
          JOIN chain c ON b.id = c.next_id
        )
        SELECT * FROM chain
      `),

      insertDocument: this.db.prepare(`
        INSERT OR REPLACE INTO documents (id, name, description, root_block_id, block_count)
        VALUES (?, ?, ?, ?, ?)
      `),

      insertDocBlock: this.db.prepare(`
        INSERT OR REPLACE INTO document_blocks (document_id, block_id, position)
        VALUES (?, ?, ?)
      `),
    };
  }

  // Generate content hash
  hash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Generate block ID from statute
  blockId(statute) {
    return `BLK-${this.hash(statute).substring(0, 12)}`;
  }

  // Insert a legal code block
  insertBlock(block) {
    const id = block.id || this.blockId(block.statute);
    const contentHash = this.hash(block.content);
    const embedding = block.embedding ? JSON.stringify(block.embedding) : null;

    this.stmts.insertBlock.run(
      id,
      block.statute,
      block.title || null,
      block.content,
      contentHash,
      embedding,
      block.x || 0,
      block.y || 0,
      block.z || 0,
      block.parentId || null,
      block.prevId || null,
      block.nextId || null,
      block.depth || 0,
      block.sequence || 0,
      block.article || null,
      block.section || null,
      block.subsection || null,
      block.blockType || 'section'
    );

    return id;
  }

  // Get a block by ID
  getBlock(id) {
    const row = this.stmts.getBlock.get(id);
    if (row && row.embedding) {
      row.embedding = JSON.parse(row.embedding);
    }
    return row;
  }

  // Get blocks by statute reference
  getByStatute(statute) {
    return this.stmts.getByStatute.all(statute);
  }

  // Get all blocks in an article
  getArticle(article) {
    return this.stmts.getByArticle.all(article);
  }

  // Add spatial link between blocks
  addSpatialLink(sourceId, targetId, distance, linkType = 'semantic', weight = 1.0) {
    this.stmts.insertLink.run(sourceId, targetId, distance, linkType, weight);
  }

  // Find nearest neighbors to a block
  findNearest(blockId, limit = 10) {
    return this.stmts.getNearestNeighbors.all(blockId, limit);
  }

  // Get linked chain starting from a block
  getChain(startId) {
    return this.stmts.getChain.all(startId);
  }

  // Create a document from linked blocks
  createDocument(id, name, description, blockIds) {
    const rootId = blockIds[0];
    this.stmts.insertDocument.run(id, name, description, rootId, blockIds.length);

    blockIds.forEach((blockId, idx) => {
      this.stmts.insertDocBlock.run(id, blockId, idx);
    });

    return id;
  }

  // Reconstruct document content from blocks
  reconstructDocument(documentId) {
    const blocks = this.db.prepare(`
      SELECT b.* FROM document_blocks db
      JOIN blocks b ON db.block_id = b.id
      WHERE db.document_id = ?
      ORDER BY db.position
    `).all(documentId);

    return {
      documentId,
      blockCount: blocks.length,
      content: blocks.map(b => b.content).join('\n\n'),
      blocks,
    };
  }

  // Get all blocks as 3D points for visualization
  get3DPoints() {
    return this.db.prepare(`
      SELECT id, statute, title, x, y, z, article, block_type
      FROM blocks
      WHERE x IS NOT NULL AND y IS NOT NULL AND z IS NOT NULL
    `).all();
  }

  // Get spatial links for visualization
  getSpatialLinks() {
    return this.db.prepare(`
      SELECT
        sl.*,
        b1.x as source_x, b1.y as source_y, b1.z as source_z,
        b2.x as target_x, b2.y as target_y, b2.z as target_z
      FROM spatial_links sl
      JOIN blocks b1 ON sl.source_id = b1.id
      JOIN blocks b2 ON sl.target_id = b2.id
    `).all();
  }

  // Stats
  getStats() {
    return {
      blocks: this.db.prepare(`SELECT COUNT(*) as count FROM blocks`).get().count,
      links: this.db.prepare(`SELECT COUNT(*) as count FROM spatial_links`).get().count,
      documents: this.db.prepare(`SELECT COUNT(*) as count FROM documents`).get().count,
      articles: this.db.prepare(`SELECT COUNT(DISTINCT article) as count FROM blocks`).get().count,
    };
  }

  close() {
    this.db.close();
  }
}

module.exports = { VectorBlockDB };
