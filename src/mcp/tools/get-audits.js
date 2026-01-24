/**
 * Get Audits Tool
 * Returns public audit information for Northampton County
 *
 * @module mcp/tools/get-audits
 */

export const getAuditsTool = {
  name: 'get_audits',
  description: 'Get public audit reports for Northampton County. Returns audits from Controller and PA Auditor General.',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Filter by category: "controller", "state", "courts", "elections", "pension", or "all" (default)',
      },
      year: {
        type: 'number',
        description: 'Filter by year (e.g., 2025, 2026)',
      },
      status: {
        type: 'string',
        description: 'Filter by status: "passed", "findings", or "all" (default)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of audits to return (default: 20)',
      },
    },
  },

  async execute(args) {
    const { category = 'all', year, status = 'all', limit = 20 } = args || {};

    // Current audit data (from public-audits.html)
    const audits = [
      // 2026 Audits
      { date: '2026-01-22', title: 'Magisterial District Courts Annual Review', source: 'PA Auditor General', status: 'announced', category: 'state', description: 'AG DeFoor announced review of county MDJ operations' },
      { date: '2026-01-15', title: 'Allen Township Municipal Authority', source: 'Controller', status: 'passed', category: 'controller', description: 'Water/sewer fund compliance review' },
      { date: '2026-01-10', title: 'Q4 2025 Payroll Verification', source: 'Controller', status: 'passed', category: 'controller', description: 'Quarterly payroll audit completed' },

      // 2025 Audits
      { date: '2025-12-15', title: 'Gracedale Nursing Home Operations', source: 'Controller', status: 'passed', category: 'controller', description: 'Self-sustaining operations verified' },
      { date: '2025-11-20', title: '2025 General Election', source: 'Controller', status: 'passed', category: 'elections', description: 'Vote tabulation and certification review' },
      { date: '2025-11-08', title: 'Election Equipment Certification', source: 'PA DOS', status: 'passed', category: 'elections', description: 'Dominion ICE machines certified' },
      { date: '2025-10-30', title: 'County Pension Fund', source: 'PA Auditor General', status: 'passed', category: 'pension', description: '$458M fund actuarial review' },
      { date: '2025-10-15', title: 'Q3 2025 Payroll Verification', source: 'Controller', status: 'passed', category: 'controller', description: 'Quarterly payroll audit completed' },
      { date: '2025-09-28', title: 'Criminal Justice Technology', source: 'Controller', status: 'findings', category: 'courts', findings: 'Minor finding: Updated documentation needed for JMS interfaces', description: 'Court technology systems review' },
      { date: '2025-09-10', title: 'Sheriff Vehicle Fleet', source: 'Controller', status: 'passed', category: 'controller', description: 'Fleet maintenance and fuel compliance' },
      { date: '2025-08-22', title: 'Open Space Farmland Preservation', source: 'Controller', status: 'passed', category: 'controller', description: '20,000 acres milestone audit' },
      { date: '2025-07-30', title: 'Children & Youth Services', source: 'PA DHS', status: 'passed', category: 'state', description: 'Federal Title IV-E compliance' },
      { date: '2025-07-15', title: 'Q2 2025 Payroll Verification', source: 'Controller', status: 'passed', category: 'controller', description: 'Quarterly payroll audit completed' },
      { date: '2025-06-20', title: 'Recorder of Deeds Fee Account', source: 'Controller', status: 'passed', category: 'controller', description: 'Recording fee fund reconciliation' },
      { date: '2025-06-05', title: 'Register of Wills Estate Funds', source: 'Controller', status: 'findings', category: 'controller', findings: 'Minor finding: One estate account had delayed distribution', description: 'Estate fund management review' },
      { date: '2025-05-18', title: '2024 Liquid Fuels', source: 'PennDOT', status: 'passed', category: 'state', description: 'State highway aid fund compliance' },
      { date: '2025-05-02', title: 'Prothonotary Civil Fees', source: 'Controller', status: 'passed', category: 'courts', description: 'Civil filing fee reconciliation' },
      { date: '2025-04-15', title: 'Q1 2025 Payroll Verification', source: 'Controller', status: 'passed', category: 'controller', description: 'Quarterly payroll audit completed' },
      { date: '2025-03-28', title: 'Coroner Office Operations', source: 'Controller', status: 'findings', category: 'controller', findings: 'Minor finding: Lab equipment calibration documentation gaps', description: 'Coroner procedures and equipment review' },
      { date: '2025-03-10', title: 'District Attorney PCCD Grants', source: 'PA PCCD', status: 'passed', category: 'state', description: 'Federal/state grant compliance' },
      { date: '2025-02-20', title: 'Clerk of Courts Criminal Fees', source: 'Controller', status: 'passed', category: 'courts', description: 'Criminal fee collection audit' },
      { date: '2025-01-30', title: '2024 Annual Financial Report', source: 'External Auditor', status: 'passed', category: 'controller', description: 'Maher Duessel annual audit - unqualified opinion' },

      // 2024 Audits
      { date: '2024-12-10', title: 'Emergency Management Agency', source: 'Controller', status: 'passed', category: 'controller', description: 'FEMA grant fund management' },
      { date: '2024-11-15', title: '2024 General Election', source: 'Controller', status: 'passed', category: 'elections', description: 'Presidential election certification' },
      { date: '2024-10-30', title: 'Q3 2024 Payroll Verification', source: 'Controller', status: 'passed', category: 'controller', description: 'Quarterly payroll audit completed' },
      { date: '2024-09-25', title: 'County Bridge Inspection', source: 'PennDOT', status: 'findings', category: 'state', findings: 'Minor finding: 2 bridges require structural updates within 18 months', description: 'Biennial bridge safety review' },
      { date: '2024-08-15', title: 'Human Services Block Grant', source: 'PA DHS', status: 'passed', category: 'state', description: 'HSDF program audit' },
    ];

    // Apply filters
    let filtered = audits;

    if (category !== 'all') {
      filtered = filtered.filter(a => a.category === category || a.source.toLowerCase().includes(category));
    }

    if (year) {
      filtered = filtered.filter(a => a.date.startsWith(year.toString()));
    }

    if (status !== 'all') {
      filtered = filtered.filter(a => a.status === status);
    }

    // Apply limit
    filtered = filtered.slice(0, limit);

    // Calculate summary stats
    const stats = {
      total: audits.length,
      passed: audits.filter(a => a.status === 'passed').length,
      findings: audits.filter(a => a.status === 'findings').length,
      announced: audits.filter(a => a.status === 'announced').length,
    };

    return {
      audits: filtered,
      summary: stats,
      filterApplied: { category, year, status, limit },
      source: 'NAC Digital Twin - Public Audit Records',
    };
  },
};

export const getAuditStatusTool = {
  name: 'get_audit_status',
  description: 'Get summary audit status for Northampton County offices.',
  inputSchema: {
    type: 'object',
    properties: {
      office: {
        type: 'string',
        description: 'Specific office to check (e.g., "controller", "sheriff", "coroner")',
      },
    },
  },

  async execute(args) {
    const { office } = args || {};

    // Office audit status summary
    const officeStatus = {
      controller: { lastAudit: '2025-01-30', status: 'passed', nextDue: '2026-01', auditor: 'Maher Duessel', note: 'Annual financial audit - unqualified opinion' },
      sheriff: { lastAudit: '2025-09-10', status: 'passed', nextDue: '2026-09', auditor: 'Controller', note: 'Fleet and operations audit' },
      coroner: { lastAudit: '2025-03-28', status: 'findings', nextDue: '2026-03', auditor: 'Controller', note: 'Minor finding - lab calibration docs' },
      'district attorney': { lastAudit: '2025-03-10', status: 'passed', nextDue: '2026-03', auditor: 'PA PCCD', note: 'Grant compliance audit' },
      'clerk of courts': { lastAudit: '2025-02-20', status: 'passed', nextDue: '2026-02', auditor: 'Controller', note: 'Fee collection audit' },
      prothonotary: { lastAudit: '2025-05-02', status: 'passed', nextDue: '2026-05', auditor: 'Controller', note: 'Civil fees reconciliation' },
      'recorder of deeds': { lastAudit: '2025-06-20', status: 'passed', nextDue: '2026-06', auditor: 'Controller', note: 'Recording fee audit' },
      'register of wills': { lastAudit: '2025-06-05', status: 'findings', nextDue: '2026-06', auditor: 'Controller', note: 'Minor finding - estate distribution delay' },
      gracedale: { lastAudit: '2025-12-15', status: 'passed', nextDue: '2026-12', auditor: 'Controller', note: 'Self-sustaining operations verified' },
      elections: { lastAudit: '2025-11-20', status: 'passed', nextDue: '2026-11', auditor: 'Controller', note: '2025 General Election certified' },
      pension: { lastAudit: '2025-10-30', status: 'passed', nextDue: '2028-10', auditor: 'PA Auditor General', note: '$458M fund - triennial review' },
    };

    if (office) {
      const key = office.toLowerCase();
      const match = Object.keys(officeStatus).find(k => k.includes(key) || key.includes(k));

      if (match) {
        return {
          office: match,
          ...officeStatus[match],
          source: 'NAC Digital Twin - Audit Status',
        };
      }

      return {
        error: `Office "${office}" not found`,
        availableOffices: Object.keys(officeStatus),
      };
    }

    // Return all office statuses
    return {
      offices: Object.entries(officeStatus).map(([name, data]) => ({
        office: name,
        ...data,
      })),
      overallStatus: {
        compliant: Object.values(officeStatus).filter(s => s.status === 'passed').length,
        findings: Object.values(officeStatus).filter(s => s.status === 'findings').length,
        total: Object.keys(officeStatus).length,
      },
      source: 'NAC Digital Twin - Audit Status',
    };
  },
};
