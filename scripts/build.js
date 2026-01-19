#!/usr/bin/env node

/**
 * NAC Build Script
 *
 * Auto-discovers and builds ISA-95 modules for GitHub Pages
 * Generates structure manifest for auto-loading UI
 */

const fs = require('fs');
const path = require('path');

console.log('NAC Build Script');
console.log('================\n');

const srcDir = path.join(__dirname, '..', 'src');
const docsDir = path.join(__dirname, '..', 'docs');
const jsDir = path.join(docsDir, 'js');
const isa95JsDir = path.join(jsDir, 'isa95');
const dataDir = path.join(docsDir, 'data');

// Ensure directories
[jsDir, isa95JsDir, dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Copy legacy modules
const legacy = [
  ['controller/index.js', 'controller.js'],
  ['modules/fiscal/audit.js', 'audit.js'],
  ['modules/fiscal/payroll.js', 'payroll.js'],
  ['ai/webllm-engine.js', 'webllm-engine.js'],
  ['templates/prompts.js', 'prompts.js']
];

console.log('Legacy modules:');
legacy.forEach(([src, dest]) => {
  const srcPath = path.join(srcDir, src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(jsDir, dest));
    console.log(`  ✓ ${dest}`);
  }
});

// Auto-discover ISA-95 structure
console.log('\nDiscovering ISA-95 structure...\n');

const isa95Src = path.join(srcDir, 'isa95');
const structure = {};
let totalModules = 0;

function scanLevel(levelDir, levelName) {
  if (!fs.existsSync(levelDir)) return;

  structure[levelName] = {};
  const groups = fs.readdirSync(levelDir);

  groups.forEach(group => {
    const groupPath = path.join(levelDir, group);
    if (!fs.statSync(groupPath).isDirectory()) return;

    structure[levelName][group] = [];
    const files = fs.readdirSync(groupPath);

    files.forEach(file => {
      if (file.endsWith('.js')) {
        structure[levelName][group].push(file);
        totalModules++;

        // Copy to docs
        const destDir = path.join(isa95JsDir, levelName, group);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(path.join(groupPath, file), path.join(destDir, file));
      }
    });

    if (structure[levelName][group].length > 0) {
      console.log(`  ${levelName}/${group}: ${structure[levelName][group].length} modules`);
    }
  });
}

// Scan all levels
['L0_Data', 'L1_Transactions', 'L2_Control', 'L3_Operations', 'L4_Enterprise'].forEach(level => {
  scanLevel(path.join(isa95Src, level), level);
});

// Copy index.js if exists
const indexSrc = path.join(isa95Src, 'index.js');
if (fs.existsSync(indexSrc)) {
  fs.copyFileSync(indexSrc, path.join(isa95JsDir, 'index.js'));
}

// Generate structure manifest for auto-loading UI
console.log('\nGenerating manifests...\n');

const manifest = {
  version: '1.0.0',
  generated: new Date().toISOString(),
  totalModules,
  structure
};

fs.writeFileSync(
  path.join(dataDir, 'isa95-manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log('  ✓ data/isa95-manifest.json');

// Generate JS module for direct import
const structureJS = `// Auto-generated ISA-95 structure manifest
// Generated: ${new Date().toISOString()}
export const STRUCTURE = ${JSON.stringify(structure, null, 2)};
export const TOTAL_MODULES = ${totalModules};
`;

fs.writeFileSync(path.join(isa95JsDir, 'manifest.js'), structureJS);
console.log('  ✓ js/isa95/manifest.js');

// Copy data files
const srcDataDir = path.join(srcDir, 'data');
if (fs.existsSync(srcDataDir)) {
  fs.readdirSync(srcDataDir).forEach(file => {
    fs.copyFileSync(path.join(srcDataDir, file), path.join(dataDir, file));
  });
  console.log('  ✓ data/*.json');
}

console.log('\n================');
console.log(`Build complete! ${totalModules} ISA-95 modules\n`);

// Print structure summary
console.log('Structure:');
Object.entries(structure).forEach(([level, groups]) => {
  const count = Object.values(groups).flat().length;
  console.log(`  ${level}: ${count} modules`);
});

console.log('\nTo preview: npx serve docs');
console.log('To deploy:  git push (GitHub Pages on /docs)\n');
