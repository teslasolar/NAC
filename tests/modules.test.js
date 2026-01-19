/**
 * @fileoverview Tests for ISA-95 module structure
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assertTrue, assertEqual, assertDefined, summary } = require('./test-runner');

const srcDir = path.join(__dirname, '..', 'src', 'isa95');
const docsDir = path.join(__dirname, '..', 'docs', 'js', 'isa95');

describe('ISA-95 Directory Structure', () => {
  const levels = ['L0_Data', 'L1_Transactions', 'L2_Control', 'L3_Operations', 'L4_Enterprise'];

  levels.forEach(level => {
    test(`${level} exists in src`, () => {
      assertTrue(fs.existsSync(path.join(srcDir, level)), `${level} directory exists`);
    });
  });

  levels.forEach(level => {
    test(`${level} exists in docs/js`, () => {
      assertTrue(fs.existsSync(path.join(docsDir, level)), `${level} built to docs`);
    });
  });
});

describe('Module File Validation', () => {
  function getJsFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;

    fs.readdirSync(dir).forEach(item => {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        files.push(...getJsFiles(itemPath));
      } else if (item.endsWith('.js')) {
        files.push(itemPath);
      }
    });
    return files;
  }

  const modules = getJsFiles(srcDir);

  test(`Has at least 40 modules`, () => {
    assertTrue(modules.length >= 40, `Found ${modules.length} modules (need 40+)`);
  });

  test('All modules have export statement', () => {
    let valid = 0;
    modules.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('export ')) valid++;
    });
    assertEqual(valid, modules.length, `${valid}/${modules.length} modules export`);
  });

  test('All modules have @authority or @module JSDoc', () => {
    let valid = 0;
    modules.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('@authority') || content.includes('@module')) valid++;
    });
    assertTrue(valid >= modules.length * 0.9, `${valid}/${modules.length} have docs (90%+ required)`);
  });
});

describe('Controller Modules', () => {
  const controllerDir = path.join(srcDir, 'L3_Operations', 'controller');

  test('StatutoryDuties.js exists', () => {
    assertTrue(fs.existsSync(path.join(controllerDir, 'StatutoryDuties.js')), 'StatutoryDuties exists');
  });

  test('BoardMemberships.js exists', () => {
    assertTrue(fs.existsSync(path.join(controllerDir, 'BoardMemberships.js')), 'BoardMemberships exists');
  });

  test('AuditJurisdiction.js exists', () => {
    assertTrue(fs.existsSync(path.join(controllerDir, 'AuditJurisdiction.js')), 'AuditJurisdiction exists');
  });

  test('StatutoryDuties references correct PA Code', () => {
    const content = fs.readFileSync(path.join(controllerDir, 'StatutoryDuties.js'), 'utf8');
    assertTrue(content.includes('1602') || content.includes('1705'), 'References PA Code sections');
  });
});

describe('JSON Schemas', () => {
  const schemasDir = path.join(__dirname, '..', 'src', 'isa95', 'L0_Data', 'schemas');

  test('Schemas directory exists', () => {
    assertTrue(fs.existsSync(schemasDir), 'Schemas directory exists');
  });

  const requiredSchemas = ['Money', 'Account', 'Claim'];

  requiredSchemas.forEach(schema => {
    test(`${schema}.schema.json exists`, () => {
      assertTrue(
        fs.existsSync(path.join(schemasDir, `${schema}.schema.json`)),
        `${schema} schema exists`
      );
    });
  });

  test('Schemas are valid JSON', () => {
    let valid = 0;
    if (fs.existsSync(schemasDir)) {
      fs.readdirSync(schemasDir).forEach(file => {
        if (file.endsWith('.schema.json')) {
          try {
            JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf8'));
            valid++;
          } catch (e) {}
        }
      });
    }
    assertTrue(valid >= 3, `${valid} valid JSON schemas`);
  });
});

describe('PA Code Coverage Tracker', () => {
  const coverageFile = path.join(__dirname, '..', 'src', 'data', 'pa-code-coverage.json');

  test('Coverage tracker exists', () => {
    assertTrue(fs.existsSync(coverageFile), 'pa-code-coverage.json exists');
  });

  test('Coverage tracker is valid JSON', () => {
    let valid = false;
    try {
      JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
      valid = true;
    } catch (e) {}
    assertTrue(valid, 'Valid JSON');
  });

  test('Coverage tracker has required fields', () => {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    assertDefined(coverage.articles, 'Has articles');
    assertDefined(coverage.statusCounts, 'Has statusCounts');
  });

  test('Coverage tracks 50+ sections', () => {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    const counts = coverage.statusCounts;
    const total = counts.implemented + counts.partial + counts.not_started;
    assertTrue(total >= 50, `Tracks ${total} sections (need 50+)`);
  });
});

describe('Manifest Generation', () => {
  const manifestFile = path.join(__dirname, '..', 'docs', 'data', 'isa95-manifest.json');

  test('Manifest exists', () => {
    assertTrue(fs.existsSync(manifestFile), 'isa95-manifest.json exists');
  });

  test('Manifest has structure', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    assertDefined(manifest.structure, 'Has structure');
    assertDefined(manifest.stats, 'Has stats');
  });

  test('Manifest reflects actual modules', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    assertTrue(manifest.stats.modules >= 40, `Manifest shows ${manifest.stats.modules} modules`);
  });
});

summary();
