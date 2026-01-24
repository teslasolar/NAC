/**
 * Get Budget Tool
 * Returns Northampton County budget data for a fiscal year
 *
 * @module mcp/tools/get-budget
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getBudgetTool = {
  name: 'get_budget',
  description: 'Get Northampton County budget data. Returns total budget, general fund, department breakdowns, and key highlights.',
  inputSchema: {
    type: 'object',
    properties: {
      fiscalYear: {
        type: 'number',
        description: 'Fiscal year (default: 2026)',
      },
      summary: {
        type: 'boolean',
        description: 'Return summary only (default: false)',
      },
    },
  },

  async execute(args) {
    const { fiscalYear = 2026, summary = false } = args || {};

    // Try to load from tags
    const budgetPath = path.join(__dirname, '../../../docs/tags/financial', `budget-${fiscalYear}.json`);

    try {
      const data = JSON.parse(await fs.readFile(budgetPath, 'utf8'));

      if (summary) {
        return {
          fiscalYear: data.fiscalYear,
          totalBudget: data.totalBudget,
          generalFund: data.generalFund,
          adoptionDate: data.adoptionDate,
          councilVote: data.councilVote,
          highlights: data.highlights,
          source: 'NAC Digital Twin - docs/tags/financial/',
        };
      }

      return {
        ...data,
        departments: await this.getDepartmentBreakdown(fiscalYear),
        source: 'NAC Digital Twin - docs/tags/financial/',
      };
    } catch (error) {
      // Fallback to hardcoded FY2026 data
      return this.getFY2026Fallback(summary);
    }
  },

  async getDepartmentBreakdown(fiscalYear) {
    // FY2026 department breakdown from budget.html
    return [
      { name: 'Human Services', amount: 120000000, percentage: 23.9 },
      { name: 'Courts & Justice', amount: 90000000, percentage: 17.9 },
      { name: 'Corrections', amount: 75000000, percentage: 14.9 },
      { name: 'Gracedale Nursing Home', amount: 65000000, percentage: 12.9 },
      { name: 'Public Works', amount: 45000000, percentage: 8.9 },
      { name: 'Administration', amount: 35000000, percentage: 7.0 },
      { name: '911 Emergency Services', amount: 28000000, percentage: 5.6 },
      { name: 'Open Space & Farmland', amount: 20000000, percentage: 4.0 },
      { name: 'Row Officers', amount: 15000000, percentage: 3.0 },
      { name: 'Community Programs', amount: 10000000, percentage: 2.0 },
    ];
  },

  getFY2026Fallback(summary) {
    const base = {
      fiscalYear: 2026,
      totalBudget: 503000000,
      generalFund: 215000000,
      adoptionDate: '2025-12-04',
      councilVote: '7-2',
      executiveAtAdoption: 'Lamont G. McClure',
      highlights: [
        'No real estate tax increase - 8th consecutive year',
        'Gracedale operates without General Fund contribution',
        '$1.5M savings via Health Insurance Solutions partnership',
        '7.3% spending reduction from FY2025',
        'First budget since COVID without federal relief grants',
      ],
      source: 'NAC Digital Twin (fallback)',
    };

    if (summary) return base;

    return {
      ...base,
      departments: [
        { name: 'Human Services', amount: 120000000, percentage: 23.9 },
        { name: 'Courts & Justice', amount: 90000000, percentage: 17.9 },
        { name: 'Corrections', amount: 75000000, percentage: 14.9 },
        { name: 'Gracedale Nursing Home', amount: 65000000, percentage: 12.9 },
        { name: 'Public Works', amount: 45000000, percentage: 8.9 },
        { name: 'Administration', amount: 35000000, percentage: 7.0 },
        { name: '911 Emergency Services', amount: 28000000, percentage: 5.6 },
        { name: 'Open Space & Farmland', amount: 20000000, percentage: 4.0 },
        { name: 'Row Officers', amount: 15000000, percentage: 3.0 },
        { name: 'Community Programs', amount: 10000000, percentage: 2.0 },
      ],
      spendingChange: {
        direction: 'reduction',
        percentage: 7.3,
        note: 'First budget since COVID without federal relief grants',
      },
    };
  },
};

export const getDepartmentBudgetTool = {
  name: 'get_department_budget',
  description: 'Get budget details for a specific department. Returns allocation, year-over-year change, and line items.',
  inputSchema: {
    type: 'object',
    properties: {
      department: {
        type: 'string',
        description: 'Department name (e.g., "corrections", "human services", "courts")',
      },
      fiscalYear: {
        type: 'number',
        description: 'Fiscal year (default: 2026)',
      },
    },
    required: ['department'],
  },

  async execute(args) {
    const { department, fiscalYear = 2026 } = args;

    // Department budget data
    const departments = {
      'human services': {
        name: 'Human Services',
        fy2026: 120000000,
        fy2025: 135000000,
        change: -11.1,
        divisions: [
          { name: 'Children, Youth & Families', amount: 45000000 },
          { name: 'Area Agency on Aging', amount: 35000000 },
          { name: 'Mental Health/Early Intervention', amount: 25000000 },
          { name: 'Drug & Alcohol Services', amount: 15000000 },
        ],
      },
      'courts': {
        name: 'Courts & Justice',
        fy2026: 90000000,
        fy2025: 88000000,
        change: 2.3,
        divisions: [
          { name: 'Court of Common Pleas', amount: 35000000 },
          { name: 'District Attorney', amount: 22000000 },
          { name: 'Public Defender', amount: 15000000 },
          { name: 'Probation & Parole', amount: 18000000 },
        ],
      },
      'corrections': {
        name: 'Corrections',
        fy2026: 75000000,
        fy2025: 78000000,
        change: -3.8,
        divisions: [
          { name: 'Prison Operations', amount: 55000000 },
          { name: 'Community Corrections', amount: 12000000 },
          { name: 'Work Release Programs', amount: 8000000 },
        ],
      },
      'gracedale': {
        name: 'Gracedale Nursing Home',
        fy2026: 65000000,
        fy2025: 68000000,
        change: -4.4,
        note: 'Self-sustaining - no General Fund contribution',
        divisions: [
          { name: 'Nursing Care', amount: 40000000 },
          { name: 'Dietary Services', amount: 10000000 },
          { name: 'Facility Operations', amount: 15000000 },
        ],
      },
      'public works': {
        name: 'Public Works',
        fy2026: 45000000,
        fy2025: 42000000,
        change: 7.1,
        divisions: [
          { name: 'Roads & Bridges', amount: 25000000 },
          { name: 'Buildings & Grounds', amount: 12000000 },
          { name: 'Fleet Management', amount: 8000000 },
        ],
      },
      '911': {
        name: '911 Emergency Services',
        fy2026: 28000000,
        fy2025: 25000000,
        change: 12.0,
        note: 'P-25 radio system upgrades',
        divisions: [
          { name: 'Dispatch Operations', amount: 18000000 },
          { name: 'Radio Infrastructure', amount: 10000000 },
        ],
      },
    };

    // Normalize department name
    const key = department.toLowerCase().replace('&', '').replace(/\s+/g, ' ').trim();
    const match = Object.keys(departments).find(k =>
      key.includes(k) || k.includes(key.split(' ')[0])
    );

    if (match) {
      const dept = departments[match];
      return {
        fiscalYear,
        ...dept,
        allocation: dept[`fy${fiscalYear}`] || dept.fy2026,
        percentOfTotal: ((dept.fy2026 / 503000000) * 100).toFixed(1),
        source: 'NAC Digital Twin - FY2026 Budget',
      };
    }

    return {
      error: `Department "${department}" not found`,
      availableDepartments: Object.values(departments).map(d => d.name),
    };
  },
};
