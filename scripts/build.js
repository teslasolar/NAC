#!/usr/bin/env node

/**
 * NAC Build Script
 *
 * Builds the static site for GitHub Pages deployment
 * Includes ISA-95 enterprise UDT structure
 */

const fs = require('fs');
const path = require('path');

console.log('NAC Build Script');
console.log('================\n');

const srcDir = path.join(__dirname, '..', 'src');
const docsDir = path.join(__dirname, '..', 'docs');
const jsDir = path.join(docsDir, 'js');
const isa95JsDir = path.join(jsDir, 'isa95');

// Ensure directories exist
[jsDir, isa95JsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy legacy module files
const modulesToCopy = [
  { src: 'controller/index.js', dest: 'controller.js' },
  { src: 'modules/fiscal/audit.js', dest: 'audit.js' },
  { src: 'modules/fiscal/payroll.js', dest: 'payroll.js' },
  { src: 'ai/webllm-engine.js', dest: 'webllm-engine.js' },
  { src: 'templates/prompts.js', dest: 'prompts.js' }
];

console.log('Copying legacy modules...\n');

modulesToCopy.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(jsDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ ${src} -> js/${dest}`);
  }
});

// Copy ISA-95 modules
console.log('\nCopying ISA-95 modules...\n');

const isa95Src = path.join(srcDir, 'isa95');

function copyDir(src, dest, prefix = '') {
  if (!fs.existsSync(src)) return;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath, prefix + item + '/');
    } else if (item.endsWith('.js')) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ isa95/${prefix}${item}`);
    }
  });
}

copyDir(isa95Src, isa95JsDir);

// Copy data files
const dataDir = path.join(docsDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const srcDataDir = path.join(srcDir, 'data');
if (fs.existsSync(srcDataDir)) {
  console.log('\nCopying data files...\n');
  fs.readdirSync(srcDataDir).forEach(file => {
    fs.copyFileSync(
      path.join(srcDataDir, file),
      path.join(dataDir, file)
    );
    console.log(`  ✓ data/${file}`);
  });
}

// Generate ISA-95 module index
console.log('\nGenerating ISA-95 index...\n');

const isa95Index = {
  version: '1.0.0',
  generated: new Date().toISOString(),
  structure: 'ISA-95 Enterprise UDT',
  levels: {
    L0: {
      name: 'Data',
      description: 'Base types and enumerations',
      modules: ['types', 'enums', 'schemas']
    },
    L1: {
      name: 'Transactions',
      description: 'Individual transaction records',
      modules: ['claims', 'payments', 'audits']
    },
    L2: {
      name: 'Control',
      description: 'Process control and workflows',
      modules: ['audit', 'payroll', 'budget', 'procurement']
    },
    L3: {
      name: 'Operations',
      description: 'Department-level operations',
      modules: ['controller', 'fiscal', 'governance', 'admin']
    },
    L4: {
      name: 'Enterprise',
      description: 'Policy and strategy',
      modules: ['policy', 'strategy', 'reporting']
    }
  },
  mapping: {
    countyGovernment: {
      L4: 'County Policy/Charter',
      L3: 'Departments/Offices',
      L2: 'Processes/Workflows',
      L1: 'Individual Transactions',
      L0: 'Data Records'
    }
  }
};

fs.writeFileSync(
  path.join(dataDir, 'isa95-index.json'),
  JSON.stringify(isa95Index, null, 2)
);
console.log('  ✓ data/isa95-index.json');

// Count files
let fileCount = 0;
function countFiles(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(item => {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) countFiles(p);
    else if (item.endsWith('.js')) fileCount++;
  });
}
countFiles(isa95Src);

console.log('\n================');
console.log(`Build complete! ${fileCount} ISA-95 modules\n`);
console.log('To preview: npx serve docs');
console.log('To deploy: git push to GitHub with Pages enabled on /docs\n');
