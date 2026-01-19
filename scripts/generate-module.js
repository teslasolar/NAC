#!/usr/bin/env node

/**
 * NAC Module Generator
 *
 * Creates new ISA-95 modules with consistent structure
 *
 * Usage:
 *   node scripts/generate-module.js <level> <group> <name> [--authority "16 Pa.C.S. §XXXX"]
 *
 * Examples:
 *   node scripts/generate-module.js L1 claims PurchaseOrder --authority "16 Pa.C.S. §2102"
 *   node scripts/generate-module.js L2 budget BudgetAmendment
 *   node scripts/generate-module.js L0 enums PaymentMethod
 */

const fs = require('fs');
const path = require('path');

const LEVELS = {
  L0: { name: 'Data', types: ['types', 'enums', 'schemas'] },
  L1: { name: 'Transactions', types: ['claims', 'payments', 'audits', 'contracts'] },
  L2: { name: 'Control', types: ['audit', 'payroll', 'budget', 'procurement'] },
  L3: { name: 'Operations', types: ['controller', 'fiscal', 'governance', 'admin'] },
  L4: { name: 'Enterprise', types: ['policy', 'strategy', 'reporting'] }
};

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(`
NAC Module Generator
====================

Usage: node scripts/generate-module.js <level> <group> <name> [options]

Levels:
  L0  Data          (types, enums, schemas)
  L1  Transactions  (claims, payments, audits, contracts)
  L2  Control       (audit, payroll, budget, procurement)
  L3  Operations    (controller, fiscal, governance, admin)
  L4  Enterprise    (policy, strategy, reporting)

Options:
  --authority "16 Pa.C.S. §XXXX"  PA Code section reference
  --type enum|type|process|ops    Module type template

Examples:
  node scripts/generate-module.js L1 claims PurchaseOrder --authority "16 Pa.C.S. §2102"
  node scripts/generate-module.js L0 enums PaymentMethod
  node scripts/generate-module.js L2 budget BudgetAmendment
`);
  process.exit(1);
}

const [level, group, name] = args;
const authorityIdx = args.indexOf('--authority');
const authority = authorityIdx > -1 ? args[authorityIdx + 1] : null;

// Validate level
if (!LEVELS[level]) {
  console.error(`Error: Invalid level "${level}". Use: ${Object.keys(LEVELS).join(', ')}`);
  process.exit(1);
}

// Create directory path
const levelDir = `${level}_${LEVELS[level].name}`;
const modulePath = path.join(__dirname, '..', 'src', 'isa95', levelDir, group);
const filePath = path.join(modulePath, `${name}.js`);

// Ensure directory exists
if (!fs.existsSync(modulePath)) {
  fs.mkdirSync(modulePath, { recursive: true });
  console.log(`Created directory: ${modulePath}`);
}

// Check if file exists
if (fs.existsSync(filePath)) {
  console.error(`Error: Module already exists: ${filePath}`);
  process.exit(1);
}

// Generate template based on level
function generateTemplate() {
  const authorityLine = authority ? `  authority: '${authority}',\n` : '';

  if (level === 'L0' && group === 'enums') {
    return `/**
 * @fileoverview ${name} enumeration
 * @module L0/enums/${name}
 */

export const ${name} = {
  // Add enum values
  VALUE_ONE: 'value_one',
  VALUE_TWO: 'value_two'
};

export const ${name}Labels = {
  value_one: 'Value One',
  value_two: 'Value Two'
};
`;
  }

  if (level === 'L0' && group === 'types') {
    return `/**
 * @fileoverview ${name} type definition
 * @module L0/types/${name}
 */

export const ${name} = {
  type: '${name}',
  fields: {
    id: { type: 'string', required: true },
    // Add more fields
  },
  validate: (v) => v.id != null,
  format: (v) => \`${name}: \${v.id}\`
};
`;
  }

  if (level === 'L1') {
    return `/**
 * @fileoverview ${name} transaction record
 * @module L1/${group}/${name}
 */

export const ${name} = {
  type: '${name}',
${authorityLine}  fields: {
    id: { type: 'string', required: true },
    status: { type: 'string', enum: ['draft', 'submitted', 'approved', 'completed'] },
    createdAt: { type: 'Date', default: () => new Date() },
    createdBy: { type: 'Person' }
    // Add transaction-specific fields
  },
  statusFlow: {
    draft: ['submitted'],
    submitted: ['approved', 'rejected'],
    approved: ['completed'],
    rejected: ['draft'],
    completed: []
  }
};
`;
  }

  if (level === 'L2') {
    return `/**
 * @fileoverview ${name} process control
 * @module L2/${group}/${name}
 */

export const ${name} = {
  process: '${name}',
${authorityLine}  steps: [
    { name: 'initiate', description: 'Start the process' },
    { name: 'review', description: 'Review and validate' },
    { name: 'approve', description: 'Obtain approvals' },
    { name: 'complete', description: 'Finalize and record' }
  ],
  controls: [
    'Segregation of duties',
    'Management review',
    'Documentation requirements'
  ],
  metrics: {
    cycleTimeTarget: 5, // days
    errorRateTarget: 0.01
  }
};
`;
  }

  if (level === 'L3') {
    return `/**
 * @fileoverview ${name} operations
 * @module L3/${group}/${name}
 */

export const ${name} = {
  department: '${group.charAt(0).toUpperCase() + group.slice(1)}',
  processOwner: 'TBD',
${authorityLine}  responsibilities: [
    // Add key responsibilities
  ],
  procedures: [
    // Add procedure references
  ],
  reporting: {
    frequency: 'monthly',
    recipients: ['Council', 'Executive']
  },
  metrics: {
    // Add KPIs
  }
};
`;
  }

  if (level === 'L4') {
    return `/**
 * @fileoverview ${name} enterprise module
 * @module L4/${group}/${name}
 */

export const ${name} = {
  level: 'enterprise',
${authorityLine}  scope: 'county-wide',
  objectives: [
    // Add strategic objectives
  ],
  policies: [
    // Add policy references
  ],
  governance: {
    owner: 'TBD',
    reviewCycle: 'annual'
  }
};
`;
  }

  // Default template
  return `/**
 * @fileoverview ${name} module
 * @module ${level}/${group}/${name}
 */

export const ${name} = {
  name: '${name}',
${authorityLine}  // Add module content
};
`;
}

// Write file
const content = generateTemplate();
fs.writeFileSync(filePath, content);

console.log(`
✓ Created module: ${filePath}

Module: ${name}
Level:  ${level} (${LEVELS[level].name})
Group:  ${group}
${authority ? `Auth:   ${authority}` : ''}

Next steps:
1. Edit ${filePath} to add content
2. Run: node scripts/build.js
3. Module will appear in UI automatically
`);
