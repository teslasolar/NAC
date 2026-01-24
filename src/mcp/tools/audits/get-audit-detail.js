/**
 * Get Audit Detail Tool
 * Retrieve detailed information about a specific audit by ID
 *
 * @module mcp/tools/audits/get-audit-detail
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDITS_PATH = join(__dirname, '../../../../docs/tags/audits');

/**
 * Load category data including metadata
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

/**
 * Find audit by ID across all categories
 */
function findAuditById(auditId) {
  const categories = [
    'controller',
    'district-courts',
    'pension',
    'vfra',
    'liquid-fuels',
    'row-offices',
    'schools'
  ];

  for (const category of categories) {
    const data = loadCategory(category);
    if (data && data.audits) {
      const audit = data.audits.find(a => a.id === auditId);
      if (audit) {
        return {
          audit,
          category,
          categoryName: data.categoryName,
          auditor: data.auditor,
          website: data.website
        };
      }
    }
  }
  return null;
}

export const getAuditDetailTool = {
  name: 'get_audit_detail',
  description: 'Get detailed information about a specific audit by ID, including all findings, recommendations, and financial data.',
  inputSchema: {
    type: 'object',
    properties: {
      auditId: {
        type: 'string',
        description: 'The audit ID (e.g., "CTRL-2024-001", "MDJ-03-2-11", "PEN-EASTON-PMRS-2020")'
      }
    },
    required: ['auditId']
  },

  async execute(args) {
    const { auditId } = args;

    if (!auditId) {
      return {
        error: 'auditId is required',
        example: 'CTRL-2024-001'
      };
    }

    const result = findAuditById(auditId);

    if (!result) {
      // Try to suggest similar IDs
      const categories = ['controller', 'district-courts', 'pension', 'vfra', 'liquid-fuels', 'row-offices', 'schools'];
      const allIds = [];
      for (const cat of categories) {
        const data = loadCategory(cat);
        if (data && data.audits) {
          data.audits.forEach(a => allIds.push(a.id));
        }
      }

      return {
        error: `Audit "${auditId}" not found`,
        availableIdPrefixes: ['CTRL-', 'MDJ-', 'PEN-', 'VFRA-', 'LF-', 'ROW-', 'SCH-'],
        sampleIds: allIds.slice(0, 10),
        totalAuditsAvailable: allIds.length
      };
    }

    const { audit, category, categoryName, auditor, website } = result;

    return {
      ...audit,
      category,
      categoryName,
      auditor,
      referenceWebsite: website,
      findingsCount: audit.findings || 0,
      findingDetails: audit.findingDetails || [],
      observations: audit.observationDetails || [],
      source: 'NAC Digital Twin - Audit Database v2.0'
    };
  }
};
