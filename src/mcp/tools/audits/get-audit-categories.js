/**
 * Get Audit Categories Tool
 * List all audit categories with counts and metadata
 *
 * @module mcp/tools/audits/get-audit-categories
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDITS_PATH = join(__dirname, '../../../../docs/tags/audits');

/**
 * Load the master index
 */
function loadMasterIndex() {
  const filePath = join(AUDITS_PATH, 'index.json');
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Load category data
 */
function loadCategory(category) {
  const filePath = join(AUDITS_PATH, category, 'index.json');
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export const getAuditCategoriesTool = {
  name: 'get_audit_categories',
  description: 'List all audit categories with counts, descriptions, and recent audit dates. Use this to understand what types of audits are available.',
  inputSchema: {
    type: 'object',
    properties: {
      includeStats: {
        type: 'boolean',
        description: 'Include detailed statistics per category (default: true)'
      }
    }
  },

  async execute(args) {
    const { includeStats = true } = args || {};

    const masterIndex = loadMasterIndex();
    if (!masterIndex) {
      return { error: 'Audit database not available' };
    }

    const categories = [];

    for (const cat of masterIndex.categories) {
      const categoryData = loadCategory(cat.id);

      let stats = null;
      if (includeStats && categoryData && categoryData.audits) {
        const audits = categoryData.audits;
        const passed = audits.filter(a => a.status === 'passed').length;
        const withFindings = audits.filter(a => a.findings > 0).length;

        // Find most recent audit
        const sortedDates = audits
          .map(a => a.releaseDate || a.date)
          .filter(d => d)
          .sort()
          .reverse();

        stats = {
          totalAudits: audits.length,
          passed,
          withFindings,
          passRate: audits.length > 0 ? Math.round((passed / audits.length) * 100) : 0,
          mostRecent: sortedDates[0] || 'N/A'
        };
      }

      categories.push({
        id: cat.id,
        name: cat.name,
        auditor: cat.auditor,
        description: cat.description,
        ...(stats && { stats })
      });
    }

    return {
      totalCategories: categories.length,
      categories,
      overallStats: masterIndex.statistics,
      links: masterIndex.links,
      lastUpdated: masterIndex.lastUpdated,
      source: 'NAC Digital Twin - Audit Database v2.0'
    };
  }
};
