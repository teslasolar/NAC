/**
 * Get Audit Findings Tool
 * Retrieve and analyze findings across all audits
 *
 * @module mcp/tools/audits/get-audit-findings
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDITS_PATH = join(__dirname, '../../../../docs/tags/audits');

/**
 * Load all audits with findings
 */
function loadAuditsWithFindings() {
  const categories = [
    'controller',
    'district-courts',
    'pension',
    'vfra',
    'liquid-fuels',
    'row-offices',
    'schools'
  ];

  const auditsWithFindings = [];

  for (const category of categories) {
    const filePath = join(AUDITS_PATH, category, 'index.json');
    if (!existsSync(filePath)) continue;

    try {
      const data = JSON.parse(readFileSync(filePath, 'utf-8'));
      if (data.audits) {
        data.audits.forEach(audit => {
          if ((audit.findings && audit.findings > 0) || audit.findingDetails) {
            auditsWithFindings.push({
              ...audit,
              category,
              categoryName: data.categoryName
            });
          }
        });
      }
    } catch {
      continue;
    }
  }

  return auditsWithFindings;
}

export const getAuditFindingsTool = {
  name: 'get_audit_findings',
  description: 'Get all audit findings across Northampton County. Analyze common issues, severity levels, and resolution status.',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Filter by category',
        enum: ['controller', 'district-courts', 'pension', 'vfra', 'liquid-fuels', 'row-offices', 'schools']
      },
      severity: {
        type: 'string',
        description: 'Filter by severity level',
        enum: ['low', 'medium', 'high']
      },
      recurring: {
        type: 'boolean',
        description: 'Filter to recurring/repeat findings only'
      },
      resolved: {
        type: 'boolean',
        description: 'Filter by resolution status'
      },
      groupBy: {
        type: 'string',
        description: 'Group results by: category, type, severity',
        enum: ['category', 'type', 'severity']
      }
    }
  },

  async execute(args) {
    const { category, severity, recurring, resolved, groupBy } = args || {};

    let audits = loadAuditsWithFindings();

    if (category) {
      audits = audits.filter(a => a.category === category);
    }

    // Extract all findings
    let allFindings = [];
    audits.forEach(audit => {
      if (audit.findingDetails) {
        audit.findingDetails.forEach(finding => {
          allFindings.push({
            ...finding,
            auditId: audit.id,
            auditTitle: audit.title,
            category: audit.category,
            categoryName: audit.categoryName,
            auditDate: audit.releaseDate || audit.date,
            municipality: audit.municipality || audit.location
          });
        });
      }
    });

    // Apply filters
    if (severity) {
      allFindings = allFindings.filter(f => f.severity === severity);
    }

    if (recurring !== undefined) {
      allFindings = allFindings.filter(f =>
        recurring ? f.type === 'recurring' : f.type !== 'recurring'
      );
    }

    if (resolved !== undefined) {
      allFindings = allFindings.filter(f => f.resolved === resolved);
    }

    // Group if requested
    let grouped = null;
    if (groupBy) {
      grouped = {};
      allFindings.forEach(f => {
        const key = f[groupBy] || 'unknown';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(f);
      });
    }

    // Analyze common patterns
    const typeCount = {};
    allFindings.forEach(f => {
      const type = f.type || f.title || 'unspecified';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const commonIssues = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    return {
      totalFindings: allFindings.length,
      auditsWithFindings: audits.length,
      findings: grouped || allFindings,
      analysis: {
        commonIssues,
        bySeverity: {
          high: allFindings.filter(f => f.severity === 'high').length,
          medium: allFindings.filter(f => f.severity === 'medium').length,
          low: allFindings.filter(f => f.severity === 'low').length,
          unspecified: allFindings.filter(f => !f.severity).length
        },
        recurringCount: allFindings.filter(f => f.type === 'recurring').length,
        resolvedCount: allFindings.filter(f => f.resolved).length
      },
      filters: { category, severity, recurring, resolved, groupBy },
      source: 'NAC Digital Twin - Audit Database v2.0'
    };
  }
};
