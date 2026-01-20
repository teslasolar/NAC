#!/usr/bin/env node

/**
 * NAC CLI - Query PA County Code database
 *
 * Usage:
 *   node nac-cli.js <command> [args...]
 *   node nac-cli.js query <sql-file.md> [param=value...]
 *   node nac-cli.js run <query-name> [param=value...]
 *
 * Examples:
 *   node nac-cli.js coverage
 *   node nac-cli.js officers
 *   node nac-cli.js query queries/audit-areas.md officer=sheriff
 *   node nac-cli.js run audit-by-officer officer=treasurer
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'nac.db');
const QUERIES_PATH = path.join(__dirname, '..', 'queries');

// Open database
const db = new Database(DB_PATH, { readonly: true });

// Built-in queries
const BUILT_IN = {
  // Coverage summary
  coverage: {
    sql: 'SELECT * FROM v_coverage_by_article',
    description: 'Show PA Code coverage by article'
  },

  // All row officers
  officers: {
    sql: 'SELECT id, title, article, bond_required, duties FROM row_officers',
    description: 'List all row officers'
  },

  // Modules by level
  modules: {
    sql: 'SELECT * FROM v_modules_by_level',
    description: 'Show modules by ISA-95 level'
  },

  // Audit areas summary
  audits: {
    sql: 'SELECT * FROM v_audit_summary',
    description: 'Show audit areas by officer'
  },

  // Controller duties
  duties: {
    sql: 'SELECT * FROM v_controller_duties',
    description: 'Show controller statutory duties'
  },

  // Sections by status
  'sections-status': {
    sql: `SELECT status, COUNT(*) as count FROM sections GROUP BY status`,
    description: 'Count sections by implementation status'
  },

  // Search sections
  'search-sections': {
    sql: `SELECT id, article_id, title, status FROM sections WHERE title LIKE '%' || :term || '%'`,
    params: ['term'],
    description: 'Search sections by title'
  },

  // Officer audit areas
  'audit-by-officer': {
    sql: `SELECT aa.name, aa.description, aa.frequency, aa.requirements
          FROM audit_areas aa
          JOIN row_officers ro ON ro.id = aa.officer_id
          WHERE ro.id = :officer OR ro.title LIKE '%' || :officer || '%'`,
    params: ['officer'],
    description: 'Get audit areas for a specific officer'
  },

  // Sections by article
  'sections-by-article': {
    sql: `SELECT id, title, status, module_path FROM sections WHERE article_id = :article`,
    params: ['article'],
    description: 'List sections in an article'
  },

  // Implemented sections
  'implemented': {
    sql: `SELECT s.id, a.title as article, s.title, s.module_path
          FROM sections s
          JOIN articles a ON a.id = s.article_id
          WHERE s.status = 'implemented'
          ORDER BY s.id`,
    description: 'List all implemented sections'
  },

  // Not started sections
  'not-started': {
    sql: `SELECT s.id, a.title as article, s.title
          FROM sections s
          JOIN articles a ON a.id = s.article_id
          WHERE s.status = 'not_started'
          ORDER BY s.id`,
    description: 'List sections not yet started'
  },

  // Board memberships
  boards: {
    sql: 'SELECT board_name, authority, role FROM board_memberships',
    description: 'List controller board memberships'
  },

  // Stats
  stats: {
    sql: `SELECT
            (SELECT COUNT(*) FROM articles) as articles,
            (SELECT COUNT(*) FROM sections) as sections,
            (SELECT COUNT(*) FROM modules) as modules,
            (SELECT COUNT(*) FROM row_officers) as row_officers,
            (SELECT COUNT(*) FROM audit_areas) as audit_areas`,
    description: 'Database statistics'
  }
};

/**
 * Parse markdown file for SQL query
 * Looks for ```sql code blocks
 */
function parseMarkdownQuery(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract SQL from code block
  const sqlMatch = content.match(/```sql\n([\s\S]*?)\n```/);
  if (!sqlMatch) {
    throw new Error('No SQL code block found in markdown file');
  }

  // Extract params from csv block (optional)
  const paramsMatch = content.match(/```csv\n([\s\S]*?)\n```/);
  let defaultParams = {};
  if (paramsMatch) {
    paramsMatch[1].split('\n').forEach(line => {
      const [key, value] = line.split(',').map(s => s.trim());
      if (key && value) defaultParams[key] = value;
    });
  }

  return {
    sql: sqlMatch[1].trim(),
    defaultParams
  };
}

/**
 * Parse command line params (key=value format)
 */
function parseParams(args) {
  const params = {};
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
}

/**
 * Execute query and format output
 */
function executeQuery(sql, params = {}) {
  try {
    const stmt = db.prepare(sql);
    const results = stmt.all(params);
    return results;
  } catch (err) {
    console.error('Query error:', err.message);
    process.exit(1);
  }
}

/**
 * Format results as table
 */
function formatTable(results) {
  if (!results || results.length === 0) {
    console.log('No results');
    return;
  }

  const columns = Object.keys(results[0]);
  const widths = {};

  // Calculate column widths
  columns.forEach(col => {
    widths[col] = Math.max(
      col.length,
      ...results.map(r => String(r[col] || '').length)
    );
  });

  // Header
  const header = columns.map(c => c.padEnd(widths[c])).join(' | ');
  const separator = columns.map(c => '-'.repeat(widths[c])).join('-+-');

  console.log(header);
  console.log(separator);

  // Rows
  results.forEach(row => {
    const line = columns.map(c => String(row[c] || '').padEnd(widths[c])).join(' | ');
    console.log(line);
  });

  console.log(`\n(${results.length} rows)`);
}

/**
 * Format results as JSON
 */
function formatJSON(results) {
  console.log(JSON.stringify(results, null, 2));
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
NAC CLI - Query Northampton County PA Code Database

Usage:
  nac <command> [options]
  nac query <file.md> [param=value...]
  nac sql "<raw sql>"

Built-in Commands:
${Object.entries(BUILT_IN).map(([name, q]) =>
  `  ${name.padEnd(20)} ${q.description}${q.params ? ` (params: ${q.params.join(', ')})` : ''}`
).join('\n')}

Options:
  --json    Output as JSON
  --help    Show this help

Examples:
  nac coverage
  nac officers
  nac audit-by-officer officer=sheriff
  nac search-sections term=tax
  nac query queries/custom.md param=value
  nac sql "SELECT * FROM sections WHERE status='partial'"
`);
}

// Main
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const command = args[0];
const isJSON = args.includes('--json');
const params = parseParams(args.slice(1).filter(a => !a.startsWith('--')));

let results;

if (command === 'query' && args[1]) {
  // Execute query from markdown file
  const filePath = args[1].endsWith('.md') ? args[1] : `${args[1]}.md`;
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(QUERIES_PATH, filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`Query file not found: ${fullPath}`);
    process.exit(1);
  }

  const query = parseMarkdownQuery(fullPath);
  const mergedParams = { ...query.defaultParams, ...params };
  results = executeQuery(query.sql, mergedParams);

} else if (command === 'sql' && args[1]) {
  // Execute raw SQL
  results = executeQuery(args[1], params);

} else if (BUILT_IN[command]) {
  // Execute built-in query
  const query = BUILT_IN[command];

  // Check required params
  if (query.params) {
    const missing = query.params.filter(p => !params[p]);
    if (missing.length > 0) {
      console.error(`Missing required params: ${missing.join(', ')}`);
      console.error(`Usage: nac ${command} ${query.params.map(p => `${p}=value`).join(' ')}`);
      process.exit(1);
    }
  }

  results = executeQuery(query.sql, params);

} else {
  console.error(`Unknown command: ${command}`);
  console.error('Run "nac --help" for usage');
  process.exit(1);
}

// Output
if (isJSON) {
  formatJSON(results);
} else {
  formatTable(results);
}

db.close();
