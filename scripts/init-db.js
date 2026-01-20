#!/usr/bin/env node

/**
 * Initialize SQLite database for PA County Code
 * Creates schema and populates from existing modules
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'nac.db');
const SRC_PATH = path.join(__dirname, '..', 'src');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Remove existing database
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
}

console.log('Creating NAC SQLite Database...\n');

const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create schema
console.log('Creating schema...');

db.exec(`
  -- Articles of Title 16
  CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT
  );

  -- Code sections within articles
  CREATE TABLE sections (
    id TEXT PRIMARY KEY,
    article_id TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT CHECK(status IN ('implemented', 'partial', 'not_started')) DEFAULT 'not_started',
    module_path TEXT,
    description TEXT,
    FOREIGN KEY (article_id) REFERENCES articles(id)
  );

  -- ISA-95 modules
  CREATE TABLE modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL CHECK(level IN ('L0', 'L1', 'L2', 'L3', 'L4')),
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    file_path TEXT UNIQUE,
    authority TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Row officers
  CREATE TABLE row_officers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    article TEXT NOT NULL,
    term_years INTEGER DEFAULT 4,
    elected BOOLEAN DEFAULT 1,
    bond_required BOOLEAN DEFAULT 1,
    duties TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Audit areas for each row officer
  CREATE TABLE audit_areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    officer_id TEXT,
    module_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT,
    requirements TEXT,
    FOREIGN KEY (officer_id) REFERENCES row_officers(id),
    FOREIGN KEY (module_id) REFERENCES modules(id)
  );

  -- Controller board memberships
  CREATE TABLE board_memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_name TEXT NOT NULL,
    authority TEXT,
    role TEXT,
    voting BOOLEAN DEFAULT 1
  );

  -- Statutory duties
  CREATE TABLE statutory_duties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id TEXT,
    duty TEXT NOT NULL,
    description TEXT,
    category TEXT,
    FOREIGN KEY (section_id) REFERENCES sections(id)
  );

  -- Fee schedules
  CREATE TABLE fee_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    officer_id TEXT,
    fee_type TEXT NOT NULL,
    amount REAL,
    authority TEXT,
    FOREIGN KEY (officer_id) REFERENCES row_officers(id)
  );

  -- Audit findings (for tracking)
  CREATE TABLE findings (
    id TEXT PRIMARY KEY,
    audit_year INTEGER,
    officer_id TEXT,
    severity TEXT CHECK(severity IN ('material_weakness', 'significant_deficiency', 'deficiency', 'observation')),
    condition TEXT,
    criteria TEXT,
    cause TEXT,
    effect TEXT,
    recommendation TEXT,
    status TEXT DEFAULT 'open',
    FOREIGN KEY (officer_id) REFERENCES row_officers(id)
  );

  -- Create indexes for common queries
  CREATE INDEX idx_sections_article ON sections(article_id);
  CREATE INDEX idx_sections_status ON sections(status);
  CREATE INDEX idx_modules_level ON modules(level);
  CREATE INDEX idx_audit_areas_officer ON audit_areas(officer_id);
`);

console.log('  ✓ Schema created\n');

// Load coverage data
console.log('Loading PA Code coverage data...');
const coverageFile = path.join(SRC_PATH, 'data', 'pa-code-coverage.json');
const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));

// Insert articles and sections
const insertArticle = db.prepare('INSERT INTO articles (id, title) VALUES (?, ?)');
const insertSection = db.prepare('INSERT INTO sections (id, article_id, title, status, module_path) VALUES (?, ?, ?, ?, ?)');

let articleCount = 0;
let sectionCount = 0;

for (const [articleId, article] of Object.entries(coverage.articles)) {
  insertArticle.run(articleId, article.title);
  articleCount++;

  // Handle sections (may be nested in subchapters)
  const sections = article.sections || {};
  const subchapters = article.subchapters || {};

  // Direct sections
  for (const [sectionId, section] of Object.entries(sections)) {
    insertSection.run(sectionId, articleId, section.title, section.status, section.module || null);
    sectionCount++;
  }

  // Subchapter sections
  for (const [, subchapter] of Object.entries(subchapters)) {
    for (const [sectionId, section] of Object.entries(subchapter.sections || {})) {
      insertSection.run(sectionId, articleId, section.title, section.status, section.module || null);
      sectionCount++;
    }
  }
}

console.log(`  ✓ ${articleCount} articles`);
console.log(`  ✓ ${sectionCount} sections\n`);

// Insert row officers
console.log('Loading row officers...');
const insertOfficer = db.prepare(`
  INSERT INTO row_officers (id, title, article, term_years, elected, bond_required, duties)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const rowOfficers = [
  ['clerk_of_courts', 'Clerk of Courts', 'VI', 4, 1, 1, 'Criminal/civil court records, fees, case management'],
  ['coroner', 'Coroner', 'VII', 4, 1, 1, 'Death investigations, inquests, certifications'],
  ['district_attorney', 'District Attorney', 'VIII', 4, 1, 0, 'Criminal prosecution, civil matters, forfeiture funds'],
  ['prothonotary', 'Prothonotary', 'IX', 4, 1, 1, 'Civil court clerk, judgments, liens'],
  ['recorder_of_deeds', 'Recorder of Deeds', 'X', 4, 1, 1, 'Recording deeds, mortgages, transfer tax'],
  ['register_of_wills', 'Register of Wills', 'XI', 4, 1, 1, 'Probate, estates, inheritance tax, marriage licenses'],
  ['sheriff', 'Sheriff', 'XII', 4, 1, 1, 'Court security, process service, sheriff sales, jail'],
  ['treasurer', 'Treasurer', 'XIII', 4, 1, 1, 'County funds custody, investments, tax collection']
];

rowOfficers.forEach(officer => insertOfficer.run(...officer));
console.log(`  ✓ ${rowOfficers.length} row officers\n`);

// Insert audit areas
console.log('Loading audit areas...');
const insertAuditArea = db.prepare(`
  INSERT INTO audit_areas (officer_id, name, description, frequency, requirements)
  VALUES (?, ?, ?, ?, ?)
`);

const auditAreas = [
  // Clerk of Courts
  ['clerk_of_courts', 'Fee Collection', 'All fees collected for court services', 'Annual', 'Reconcile to Treasurer deposits'],
  ['clerk_of_courts', 'Cash Handling', 'Cash receipts and deposits', 'Monthly', 'Segregation of duties'],
  ['clerk_of_courts', 'Bond Compliance', 'Surety bond adequacy', 'Annual', 'Per Salary Board amount'],

  // Coroner
  ['coroner', 'Case Accounting', 'Track all death investigations', 'Annual', 'Cases opened/closed/pending'],
  ['coroner', 'Fee Collection', 'Cremation permits, copies', 'Annual', 'Reconcile to Treasurer'],
  ['coroner', 'Property Control', 'Decedent property custody', 'Annual', 'Chain of custody docs'],

  // District Attorney
  ['district_attorney', 'Forfeiture Funds', 'Asset forfeiture per 42 Pa.C.S. §6801', 'Annual', 'Separate accounting, permitted uses'],
  ['district_attorney', 'Grant Compliance', 'Federal/state grants', 'Per grant', 'PCCD, VOCA, JAG'],
  ['district_attorney', 'Restitution', 'Victim restitution collection', 'Annual', 'Case-by-case accounting'],

  // Prothonotary
  ['prothonotary', 'Fee Collection', 'Filing, certification, copy fees', 'Annual', 'Reconcile to Treasurer'],
  ['prothonotary', 'Judgment Tracking', 'Entry and satisfaction', 'Annual', 'Docket accuracy'],
  ['prothonotary', 'Escrow Accounts', 'Funds held in escrow', 'Annual', 'Separate accounting'],

  // Recorder of Deeds
  ['recorder_of_deeds', 'Recording Fees', 'State and county fees', 'Annual', 'Split state/county'],
  ['recorder_of_deeds', 'Realty Transfer Tax', 'Collection and remittance', 'Monthly', '72 P.S. §8102-C'],
  ['recorder_of_deeds', 'Technology Fund', 'Automation fund', 'Annual', 'Permitted uses only'],

  // Register of Wills
  ['register_of_wills', 'Probate Fees', 'Fees for probate services', 'Annual', 'Reconcile to Treasurer'],
  ['register_of_wills', 'Inheritance Tax', 'Collection and remittance', 'Monthly', '72 P.S. §9101'],
  ['register_of_wills', 'Estate Accounting', 'Inventory and accounting review', 'Annual', 'Fiduciary compliance'],

  // Sheriff
  ['sheriff', 'Sheriff Sales', 'Real estate/personal property sales', 'Annual', 'Bid deposits, proceeds, distribution'],
  ['sheriff', 'Service Fees', 'Fees for service of process', 'Annual', 'Reconcile to Treasurer'],
  ['sheriff', 'Inmate Accounts', 'Prisoner funds and commissary', 'Annual', 'Individual accounting'],
  ['sheriff', 'Weapons Inventory', 'Firearms and equipment', 'Annual', 'Physical count'],

  // Treasurer
  ['treasurer', 'Bank Reconciliation', 'All accounts reconciled', 'Monthly', 'Controller review'],
  ['treasurer', 'Cash Receipts', 'All receipts recorded', 'Daily', 'Same-day deposit'],
  ['treasurer', 'Investments', 'Policy compliance', 'Monthly', 'Permitted instruments'],
  ['treasurer', 'Tax Collection', 'Real estate tax', 'Annual', 'Duplicate to collections']
];

auditAreas.forEach(area => insertAuditArea.run(...area));
console.log(`  ✓ ${auditAreas.length} audit areas\n`);

// Insert board memberships
console.log('Loading board memberships...');
const insertBoard = db.prepare(`
  INSERT INTO board_memberships (board_name, authority, role, voting)
  VALUES (?, ?, ?, ?)
`);

const boards = [
  ['Salary Board', '16 Pa.C.S. §1501', 'Member', 1],
  ['Retirement Board', '16 Pa.C.S. §1902', 'Member', 1],
  ['Prison Board', '61 Pa.C.S. §1731', 'Member', 1],
  ['Board of Elections', '25 P.S. §2641', 'Member', 1],
  ['Tax Assessment Appeals', '72 P.S. §5020', 'Member', 1]
];

boards.forEach(board => insertBoard.run(...board));
console.log(`  ✓ ${boards.length} board memberships\n`);

// Insert statutory duties
console.log('Loading statutory duties...');
const insertDuty = db.prepare(`
  INSERT INTO statutory_duties (section_id, duty, description, category)
  VALUES (?, ?, ?, ?)
`);

const duties = [
  ['1602', 'System of Accounts', 'Prescribe uniform system of accounts', 'Accounting'],
  ['1705', 'Fiscal Supervision', 'General supervision of fiscal affairs', 'Oversight'],
  ['1704', 'Document Custody', 'Custody of county financial documents', 'Records'],
  ['1720', 'Audit & Settlement', 'Audit and settle accounts of county officers', 'Audit'],
  ['1730', 'Pre-audit Claims', 'Examine all claims before payment', 'Claims'],
  ['1750', 'Scrutiny of Claims', 'Scrutinize claims for validity', 'Claims'],
  ['1760', 'Disbursements', 'Authorize disbursements by warrant', 'Payments'],
  ['17A09', 'Budget Certification', 'Certify funds available', 'Budget'],
  ['1608', 'Subpoena Power', 'Issue subpoenas for audit purposes', 'Authority'],
  ['1609', 'Fraud Reporting', 'Report suspected fraud', 'Compliance']
];

duties.forEach(duty => insertDuty.run(...duty));
console.log(`  ✓ ${duties.length} statutory duties\n`);

// Scan and insert modules
console.log('Scanning ISA-95 modules...');
const insertModule = db.prepare(`
  INSERT INTO modules (level, category, name, file_path, authority, description)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const isa95Dir = path.join(SRC_PATH, 'isa95');
let moduleCount = 0;

function scanModules(dir, level) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir).forEach(category => {
    const categoryPath = path.join(dir, category);
    if (!fs.statSync(categoryPath).isDirectory()) return;

    fs.readdirSync(categoryPath).forEach(file => {
      if (!file.endsWith('.js')) return;

      const filePath = path.join(categoryPath, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract authority from JSDoc
      const authorityMatch = content.match(/@authority\s+(.+)/);
      const authority = authorityMatch ? authorityMatch[1].trim() : null;

      // Extract description from JSDoc
      const descMatch = content.match(/@fileoverview\s+(.+)/);
      const description = descMatch ? descMatch[1].trim() : null;

      const moduleName = file.replace('.js', '');
      const relativePath = `${level}/${category}/${file}`;

      insertModule.run(level.substring(0, 2), category, moduleName, relativePath, authority, description);
      moduleCount++;
    });
  });
}

['L0_Data', 'L1_Transactions', 'L2_Control', 'L3_Operations', 'L4_Enterprise'].forEach(level => {
  scanModules(path.join(isa95Dir, level), level);
});

console.log(`  ✓ ${moduleCount} modules\n`);

// Create views for common queries
console.log('Creating views...');

db.exec(`
  -- Coverage summary by article
  CREATE VIEW v_coverage_by_article AS
  SELECT
    a.id as article,
    a.title,
    COUNT(*) as total_sections,
    SUM(CASE WHEN s.status = 'implemented' THEN 1 ELSE 0 END) as implemented,
    SUM(CASE WHEN s.status = 'partial' THEN 1 ELSE 0 END) as partial,
    SUM(CASE WHEN s.status = 'not_started' THEN 1 ELSE 0 END) as not_started,
    ROUND(100.0 * SUM(CASE WHEN s.status = 'implemented' THEN 1 ELSE 0 END) / COUNT(*), 1) as pct_complete
  FROM articles a
  JOIN sections s ON s.article_id = a.id
  GROUP BY a.id
  ORDER BY a.id;

  -- Modules by level
  CREATE VIEW v_modules_by_level AS
  SELECT
    level,
    COUNT(*) as module_count,
    GROUP_CONCAT(DISTINCT category) as categories
  FROM modules
  GROUP BY level
  ORDER BY level;

  -- Audit areas by officer
  CREATE VIEW v_audit_summary AS
  SELECT
    ro.title as officer,
    COUNT(aa.id) as audit_areas,
    GROUP_CONCAT(aa.name, ', ') as areas
  FROM row_officers ro
  LEFT JOIN audit_areas aa ON aa.officer_id = ro.id
  GROUP BY ro.id;

  -- Controller duties summary
  CREATE VIEW v_controller_duties AS
  SELECT
    sd.category,
    COUNT(*) as duty_count,
    GROUP_CONCAT(sd.duty, ', ') as duties
  FROM statutory_duties sd
  GROUP BY sd.category;
`);

console.log('  ✓ Views created\n');

// Summary
const stats = {
  articles: db.prepare('SELECT COUNT(*) as c FROM articles').get().c,
  sections: db.prepare('SELECT COUNT(*) as c FROM sections').get().c,
  modules: db.prepare('SELECT COUNT(*) as c FROM modules').get().c,
  officers: db.prepare('SELECT COUNT(*) as c FROM row_officers').get().c,
  auditAreas: db.prepare('SELECT COUNT(*) as c FROM audit_areas').get().c,
  duties: db.prepare('SELECT COUNT(*) as c FROM statutory_duties').get().c
};

console.log('═'.repeat(40));
console.log('Database created successfully!');
console.log('═'.repeat(40));
console.log(`\nLocation: ${DB_PATH}`);
console.log(`Size: ${(fs.statSync(DB_PATH).size / 1024).toFixed(1)} KB\n`);
console.log('Contents:');
console.log(`  Articles:        ${stats.articles}`);
console.log(`  Sections:        ${stats.sections}`);
console.log(`  Modules:         ${stats.modules}`);
console.log(`  Row Officers:    ${stats.officers}`);
console.log(`  Audit Areas:     ${stats.auditAreas}`);
console.log(`  Statutory Duties: ${stats.duties}`);

db.close();
console.log('\nDone!');
