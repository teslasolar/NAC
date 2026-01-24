/**
 * Get Audit Statistics Tool
 * Dashboard-style statistics and trends for all audits
 *
 * @module mcp/tools/audits/get-audit-statistics
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDITS_PATH = join(__dirname, '../../../../docs/tags/audits');

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
  const categoryStats = {};

  for (const category of categories) {
    const filePath = join(AUDITS_PATH, category, 'index.json');
    if (!existsSync(filePath)) continue;

    try {
      const data = JSON.parse(readFileSync(filePath, 'utf-8'));
      if (data.audits) {
        categoryStats[category] = {
          name: data.categoryName,
          auditor: data.auditor,
          count: data.audits.length,
          passed: data.audits.filter(a => a.status === 'passed').length,
          withFindings: data.audits.filter(a => a.findings > 0).length
        };
        data.audits.forEach(audit => {
          allAudits.push({ ...audit, category });
        });
      }
    } catch {
      continue;
    }
  }

  return { allAudits, categoryStats };
}

export const getAuditStatisticsTool = {
  name: 'get_audit_statistics',
  description: 'Get comprehensive audit statistics for Northampton County including pass rates, trends, and compliance metrics.',
  inputSchema: {
    type: 'object',
    properties: {
      year: {
        type: 'number',
        description: 'Filter statistics to a specific year'
      },
      includeTimeline: {
        type: 'boolean',
        description: 'Include audit timeline by year (default: true)'
      },
      includeByCategory: {
        type: 'boolean',
        description: 'Include breakdown by category (default: true)'
      }
    }
  },

  async execute(args) {
    const { year, includeTimeline = true, includeByCategory = true } = args || {};

    const { allAudits, categoryStats } = loadAllAudits();

    let audits = allAudits;
    if (year) {
      audits = audits.filter(a => {
        const auditYear = (a.releaseDate || a.date || '').substring(0, 4);
        return parseInt(auditYear) === year;
      });
    }

    // Calculate overall stats
    const total = audits.length;
    const passed = audits.filter(a => a.status === 'passed').length;
    const minorFindings = audits.filter(a => a.status === 'minor_findings').length;
    const majorFindings = audits.filter(a => a.status === 'findings').length;
    const observations = audits.filter(a => a.status === 'observation').length;

    const totalFindings = audits.reduce((sum, a) => sum + (a.findings || 0), 0);

    // Calculate financial data
    let totalDisbursed = 0;
    let totalStateAid = 0;
    audits.forEach(a => {
      if (a.disbursements) {
        totalDisbursed += a.disbursements.toDepartmentOfRevenue || 0;
        totalDisbursed += a.disbursements.toCommonwealth || 0;
        totalDisbursed += a.disbursements.inheritanceTaxCollected || 0;
      }
      if (a.stateAidReceived) {
        totalStateAid += a.stateAidReceived;
      }
    });

    // Timeline by year
    let timeline = null;
    if (includeTimeline && !year) {
      timeline = {};
      allAudits.forEach(a => {
        const y = (a.releaseDate || a.date || '').substring(0, 4);
        if (y && y !== '') {
          if (!timeline[y]) {
            timeline[y] = { total: 0, passed: 0, findings: 0 };
          }
          timeline[y].total++;
          if (a.status === 'passed') timeline[y].passed++;
          if (a.findings > 0) timeline[y].findings += a.findings;
        }
      });
    }

    // By auditor
    const byAuditor = {
      controller: audits.filter(a => a.category === 'controller').length,
      paAuditorGeneral: audits.filter(a => a.category !== 'controller').length
    };

    return {
      summary: {
        totalAudits: total,
        passed,
        minorFindings,
        majorFindings,
        observations,
        passRate: total > 0 ? Math.round((passed / total) * 100 * 10) / 10 : 0,
        totalFindings,
        averageFindingsPerAudit: total > 0 ? Math.round((totalFindings / total) * 100) / 100 : 0
      },
      financial: {
        totalDisbursedToState: totalDisbursed,
        totalStateAidReviewed: totalStateAid,
        note: 'Amounts in USD'
      },
      byAuditor,
      ...(includeByCategory && { byCategory: categoryStats }),
      ...(timeline && { timeline }),
      complianceStatus: {
        overall: passed / total >= 0.75 ? 'good' : passed / total >= 0.5 ? 'fair' : 'needs_improvement',
        description: `${Math.round((passed / total) * 100)}% of audits passed without findings`
      },
      dateRange: {
        filter: year || 'all years',
        recordsAnalyzed: total
      },
      links: {
        controllerReports: 'https://norcopa.gov/controller-reports',
        paAuditorGeneral: 'https://www.paauditor.gov/audit_county/northampton-county/'
      },
      source: 'NAC Digital Twin - Audit Database v2.0'
    };
  }
};
