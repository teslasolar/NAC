/**
 * Search Audits Tool
 * Search all public audits with comprehensive filtering
 *
 * @module mcp/tools/audits/search-audits
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDITS_PATH = join(__dirname, '../../../../docs/tags/audits');

/**
 * Load audit data from a category
 */
function loadCategoryAudits(category) {
  const filePath = join(AUDITS_PATH, category, 'index.json');
  if (!existsSync(filePath)) return null;
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return data.audits || [];
  } catch {
    return [];
  }
}

/**
 * Load all audits from all categories
 */
function loadAllAudits() {
  const categories = [
    'controller',
    'district-courts',
    'pension',
    'vfra',
    'liquid-fuels',
    'row-offices',
    'schools'
  ];

  const allAudits = [];
  for (const category of categories) {
    const audits = loadCategoryAudits(category);
    if (audits) {
      audits.forEach(audit => {
        allAudits.push({ ...audit, category });
      });
    }
  }
  return allAudits;
}

export const searchAuditsTool = {
  name: 'search_audits',
  description: 'Search Northampton County public audits with filters for category, status, date range, municipality, and keyword. Returns matching audits from Controller and PA Auditor General.',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Filter by category: controller, district-courts, pension, vfra, liquid-fuels, row-offices, schools',
        enum: ['controller', 'district-courts', 'pension', 'vfra', 'liquid-fuels', 'row-offices', 'schools']
      },
      status: {
        type: 'string',
        description: 'Filter by status: passed, minor_findings, findings, observation',
        enum: ['passed', 'minor_findings', 'findings', 'observation']
      },
      municipality: {
        type: 'string',
        description: 'Filter by municipality name (partial match)'
      },
      keyword: {
        type: 'string',
        description: 'Search keyword in title and description'
      },
      year: {
        type: 'number',
        description: 'Filter by release year'
      },
      hasFindings: {
        type: 'boolean',
        description: 'Filter to audits with findings only'
      },
      limit: {
        type: 'number',
        description: 'Maximum results (default: 20)'
      },
      offset: {
        type: 'number',
        description: 'Skip first N results for pagination'
      }
    }
  },

  async execute(args) {
    const {
      category,
      status,
      municipality,
      keyword,
      year,
      hasFindings,
      limit = 20,
      offset = 0
    } = args || {};

    let audits = loadAllAudits();

    // Apply filters
    if (category) {
      audits = audits.filter(a => a.category === category);
    }

    if (status) {
      audits = audits.filter(a => a.status === status);
    }

    if (municipality) {
      const m = municipality.toLowerCase();
      audits = audits.filter(a =>
        (a.municipality && a.municipality.toLowerCase().includes(m)) ||
        (a.location && a.location.toLowerCase().includes(m)) ||
        (a.district && a.district.toLowerCase().includes(m))
      );
    }

    if (keyword) {
      const k = keyword.toLowerCase();
      audits = audits.filter(a =>
        (a.title && a.title.toLowerCase().includes(k)) ||
        (a.description && a.description.toLowerCase().includes(k)) ||
        (a.id && a.id.toLowerCase().includes(k))
      );
    }

    if (year) {
      audits = audits.filter(a => {
        const releaseYear = a.releaseDate ? parseInt(a.releaseDate.substring(0, 4)) : null;
        const dateYear = a.date ? parseInt(a.date.substring(0, 4)) : null;
        return releaseYear === year || dateYear === year;
      });
    }

    if (hasFindings) {
      audits = audits.filter(a => a.findings > 0 || a.status === 'findings' || a.status === 'minor_findings');
    }

    // Sort by date (newest first)
    audits.sort((a, b) => {
      const dateA = a.releaseDate || a.date || '1900-01-01';
      const dateB = b.releaseDate || b.date || '1900-01-01';
      return dateB.localeCompare(dateA);
    });

    const totalCount = audits.length;
    const results = audits.slice(offset, offset + limit);

    return {
      totalCount,
      returned: results.length,
      offset,
      limit,
      audits: results.map(a => ({
        id: a.id,
        title: a.title,
        category: a.category,
        status: a.status,
        findings: a.findings || 0,
        date: a.releaseDate || a.date,
        municipality: a.municipality || a.location || a.district,
        description: a.description
      })),
      filters: { category, status, municipality, keyword, year, hasFindings },
      source: 'NAC Digital Twin - Audit Database v2.0'
    };
  }
};
