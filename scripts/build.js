#!/usr/bin/env node

/**
 * NAC Build Script v2.0
 *
 * Auto-discovers and builds ISA-95 modules for GitHub Pages
 * - Discovers all .js modules in ISA-95 structure
 * - Copies JSON schemas to docs/
 * - Generates manifest for auto-loading UI
 * - Copies supporting files (AI engine, prompts, controller)
 */

const fs = require('fs');
const path = require('path');

console.log('NAC Build Script v2.0');
console.log('=====================\n');

const srcDir = path.join(__dirname, '..', 'src');
const docsDir = path.join(__dirname, '..', 'docs');
const jsDir = path.join(docsDir, 'js');
const isa95JsDir = path.join(jsDir, 'isa95');
const dataDir = path.join(docsDir, 'data');
const schemasDir = path.join(docsDir, 'schemas');

// Ensure directories
[jsDir, isa95JsDir, dataDir, schemasDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Copy supporting modules (non-ISA-95)
const supporting = [
  ['controller/index.js', 'controller.js'],
  ['ai/webllm-engine.js', 'webllm-engine.js'],
  ['templates/prompts.js', 'prompts.js']
];

console.log('Supporting modules:');
supporting.forEach(([src, dest]) => {
  const srcPath = path.join(srcDir, src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(jsDir, dest));
    console.log(`  ✓ ${dest}`);
  }
});

// Auto-discover ISA-95 structure
console.log('\nDiscovering ISA-95 modules...\n');

const isa95Src = path.join(srcDir, 'isa95');
const structure = {};
let totalModules = 0;
let totalSchemas = 0;

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
      // Handle JS modules
      if (file.endsWith('.js')) {
        structure[levelName][group].push(file);
        totalModules++;

        const destDir = path.join(isa95JsDir, levelName, group);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(path.join(groupPath, file), path.join(destDir, file));
      }

      // Handle JSON schemas
      if (file.endsWith('.schema.json')) {
        totalSchemas++;
        fs.copyFileSync(path.join(groupPath, file), path.join(schemasDir, file));
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

// Generate manifests
console.log('\nGenerating manifests...\n');

// Calculate coverage stats
let coverageStats = { implemented: 0, partial: 0, not_started: 0 };
const coverageFile = path.join(srcDir, 'data', 'pa-code-coverage.json');
if (fs.existsSync(coverageFile)) {
  try {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    coverageStats = coverage.statusCounts || coverageStats;
  } catch (e) {}
}

const manifest = {
  version: '2.0.0',
  generated: new Date().toISOString(),
  stats: {
    modules: totalModules,
    schemas: totalSchemas,
    paCodeCoverage: coverageStats
  },
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
// Modules: ${totalModules} | Schemas: ${totalSchemas}

export const STRUCTURE = ${JSON.stringify(structure, null, 2)};

export const STATS = {
  modules: ${totalModules},
  schemas: ${totalSchemas},
  paCodeCoverage: ${JSON.stringify(coverageStats)}
};

export const LEVELS = {
  L0_Data: { name: 'Data', icon: '📊', color: '#64748b' },
  L1_Transactions: { name: 'Transactions', icon: '📝', color: '#3b82f6' },
  L2_Control: { name: 'Control', icon: '⚙️', color: '#10b981' },
  L3_Operations: { name: 'Operations', icon: '🏢', color: '#f59e0b' },
  L4_Enterprise: { name: 'Enterprise', icon: '🏛️', color: '#8b5cf6' }
};
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

// Summary
console.log('\n=====================');
console.log('Build complete!\n');

console.log('Statistics:');
console.log(`  ISA-95 Modules: ${totalModules}`);
console.log(`  JSON Schemas:   ${totalSchemas}`);
console.log(`  PA Code:        ${coverageStats.implemented} implemented, ${coverageStats.partial} partial\n`);

console.log('Structure:');
Object.entries(structure).forEach(([level, groups]) => {
  const count = Object.values(groups).flat().length;
  const schemaCount = level === 'L0_Data' && groups.schemas ? groups.schemas.length : 0;
  console.log(`  ${level}: ${count} modules${schemaCount ? ` + ${schemaCount} schemas` : ''}`);
});

console.log('\nCommands:');
console.log('  Preview:  npx serve .');
console.log('  Deploy:   git push');
console.log('  New mod:  node scripts/generate-module.js L2 budget NewModule\n');
