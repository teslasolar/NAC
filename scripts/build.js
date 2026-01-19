#!/usr/bin/env node

/**
 * NAC Build Script
 *
 * Builds the static site for GitHub Pages deployment
 */

const fs = require('fs');
const path = require('path');

console.log('NAC Build Script');
console.log('================\n');

const srcDir = path.join(__dirname, '..', 'src');
const docsDir = path.join(__dirname, '..', 'docs');
const jsDir = path.join(docsDir, 'js');

// Ensure docs/js directory exists
if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir, { recursive: true });
}

// Copy module files to docs/js for browser access
const modulesToCopy = [
  { src: 'controller/index.js', dest: 'controller.js' },
  { src: 'modules/fiscal/budget.js', dest: 'budget.js' },
  { src: 'modules/fiscal/audit.js', dest: 'audit.js' },
  { src: 'modules/fiscal/payroll.js', dest: 'payroll.js' },
  { src: 'modules/governance/council.js', dest: 'council.js' },
  { src: 'modules/governance/executive.js', dest: 'executive.js' },
  { src: 'modules/governance/judicial.js', dest: 'judicial.js' },
  { src: 'ai/webllm-engine.js', dest: 'webllm-engine.js' },
  { src: 'templates/prompts.js', dest: 'prompts.js' }
];

console.log('Copying modules to docs/js...\n');

modulesToCopy.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(jsDir, dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ ${src} -> js/${dest}`);
  } else {
    console.log(`  ✗ ${src} (not found)`);
  }
});

// Copy data files
const dataDir = path.join(docsDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const srcDataDir = path.join(srcDir, 'data');
if (fs.existsSync(srcDataDir)) {
  const dataFiles = fs.readdirSync(srcDataDir);
  console.log('\nCopying data files...\n');
  dataFiles.forEach(file => {
    fs.copyFileSync(
      path.join(srcDataDir, file),
      path.join(dataDir, file)
    );
    console.log(`  ✓ data/${file}`);
  });
}

// Generate module index
console.log('\nGenerating module index...\n');

const moduleIndex = {
  version: '1.0.0',
  generated: new Date().toISOString(),
  modules: {
    fiscal: ['budget', 'audit', 'payroll'],
    governance: ['council', 'executive', 'judicial'],
    admin: ['personnel', 'procurement', 'records'],
    extended: ['interagency', 'transparency', 'emergency']
  },
  dimensions: {
    0: 'Budget & Appropriations',
    1: 'Audit & Compliance',
    2: 'Payroll & Disbursements',
    3: 'County Council',
    4: 'Executive Branch',
    5: 'Judicial Interface',
    6: 'Personnel & HR',
    7: 'Procurement & Contracts',
    8: 'Records & Archives',
    9: 'Inter-agency Relations',
    10: 'Public Transparency',
    11: 'Emergency Operations'
  }
};

fs.writeFileSync(
  path.join(dataDir, 'module-index.json'),
  JSON.stringify(moduleIndex, null, 2)
);
console.log('  ✓ data/module-index.json');

console.log('\n================');
console.log('Build complete!\n');
console.log('To preview: npx serve docs');
console.log('To deploy: git push to GitHub with Pages enabled on /docs\n');
