/**
 * L4 Tag Provider - Enterprise Tags
 *
 * Provides tag access for enterprise-level data:
 * - Strategic KPIs
 * - Policy compliance
 * - Multi-year planning
 * - Cross-department reporting
 * - Board and governance metrics
 *
 * @module isa95/L4_Enterprise/tags
 */

export class L4TagProvider {
  constructor() {
    this.cache = new Map();
    this.subscriptions = new Map();
    this.prefix = 'L4';
    this.kpis = new Map();
  }

  /**
   * Tag paths for L4 enterprise
   */
  static TAGS = {
    // Strategic KPIs
    KPI_BUDGET_VARIANCE: 'L4.KPI.BudgetVariance',
    KPI_AUDIT_COVERAGE: 'L4.KPI.AuditCoverage',
    KPI_COMPLIANCE_RATE: 'L4.KPI.ComplianceRate',
    KPI_CITIZEN_SATISFACTION: 'L4.KPI.CitizenSatisfaction',
    KPI_PROCESSING_EFFICIENCY: 'L4.KPI.ProcessingEfficiency',

    // Financial overview
    FINANCE_TOTAL_BUDGET: 'L4.Finance.TotalBudget',
    FINANCE_TOTAL_SPENT: 'L4.Finance.TotalSpent',
    FINANCE_TOTAL_REVENUE: 'L4.Finance.TotalRevenue',
    FINANCE_FUND_BALANCE: 'L4.Finance.FundBalance',
    FINANCE_DEBT_SERVICE: 'L4.Finance.DebtService',

    // Workforce
    WORKFORCE_TOTAL: 'L4.Workforce.Total',
    WORKFORCE_FULLTIME: 'L4.Workforce.FullTime',
    WORKFORCE_PARTTIME: 'L4.Workforce.PartTime',
    WORKFORCE_TURNOVER: 'L4.Workforce.Turnover',

    // Compliance
    COMPLIANCE_PA_CODE: 'L4.Compliance.PACode',
    COMPLIANCE_CHARTER: 'L4.Compliance.Charter',
    COMPLIANCE_GAAP: 'L4.Compliance.GAAP',
    COMPLIANCE_AUDIT_STATUS: 'L4.Compliance.AuditStatus',

    // Boards (Controller sits on these per PA Code)
    BOARD_RETIREMENT: 'L4.Boards.Retirement',
    BOARD_SALARY: 'L4.Boards.Salary',
    BOARD_PRISON: 'L4.Boards.Prison',
    BOARD_ELECTIONS: 'L4.Boards.Elections',
    BOARD_CONSTABLE: 'L4.Boards.Constable',

    // Strategic planning
    STRATEGY_GOALS_TOTAL: 'L4.Strategy.GoalsTotal',
    STRATEGY_GOALS_COMPLETE: 'L4.Strategy.GoalsComplete',
    STRATEGY_GOALS_ON_TRACK: 'L4.Strategy.GoalsOnTrack',
    STRATEGY_GOALS_AT_RISK: 'L4.Strategy.GoalsAtRisk',

    // Reporting
    REPORTS_GENERATED: 'L4.Reports.Generated',
    REPORTS_PUBLISHED: 'L4.Reports.Published',
    REPORTS_PENDING: 'L4.Reports.Pending'
  };

  get(tagPath) {
    return this.cache.get(tagPath);
  }

  set(tagPath, value) {
    const oldValue = this.cache.get(tagPath);
    this.cache.set(tagPath, value);
    this._notifySubscribers(tagPath, value, oldValue);
  }

  subscribe(tagPath, callback) {
    if (!this.subscriptions.has(tagPath)) {
      this.subscriptions.set(tagPath, new Set());
    }
    this.subscriptions.get(tagPath).add(callback);

    if (this.cache.has(tagPath)) {
      callback(this.cache.get(tagPath), undefined);
    }

    return () => this.subscriptions.get(tagPath).delete(callback);
  }

  /**
   * Register a KPI
   * @param {string} id - KPI identifier
   * @param {object} config - KPI configuration
   */
  registerKPI(id, config) {
    const kpi = {
      id,
      name: config.name,
      description: config.description,
      target: config.target,
      current: config.current || 0,
      unit: config.unit || '%',
      trend: config.trend || 'stable',
      category: config.category,
      updated: new Date()
    };
    this.kpis.set(id, kpi);
    return kpi;
  }

  /**
   * Update KPI value
   */
  updateKPI(id, value, trend = null) {
    const kpi = this.kpis.get(id);
    if (kpi) {
      const oldValue = kpi.current;
      kpi.current = value;
      kpi.updated = new Date();

      if (trend) {
        kpi.trend = trend;
      } else {
        // Auto-calculate trend
        if (value > oldValue) kpi.trend = 'up';
        else if (value < oldValue) kpi.trend = 'down';
        else kpi.trend = 'stable';
      }
    }
  }

  /**
   * Get KPI status (on-target, at-risk, off-target)
   */
  getKPIStatus(id) {
    const kpi = this.kpis.get(id);
    if (!kpi) return null;

    const variance = Math.abs(kpi.current - kpi.target) / kpi.target;
    if (variance <= 0.05) return 'on-target';
    if (variance <= 0.15) return 'at-risk';
    return 'off-target';
  }

  /**
   * Get all KPIs
   */
  getAllKPIs() {
    return Array.from(this.kpis.entries()).map(([id, kpi]) => ({
      ...kpi,
      status: this.getKPIStatus(id)
    }));
  }

  /**
   * Get KPIs by category
   */
  getKPIsByCategory(category) {
    return this.getAllKPIs().filter(kpi => kpi.category === category);
  }

  /**
   * Initialize with default values
   */
  initialize() {
    // KPIs
    this.set(L4TagProvider.TAGS.KPI_BUDGET_VARIANCE, 0);
    this.set(L4TagProvider.TAGS.KPI_AUDIT_COVERAGE, 100);
    this.set(L4TagProvider.TAGS.KPI_COMPLIANCE_RATE, 100);
    this.set(L4TagProvider.TAGS.KPI_CITIZEN_SATISFACTION, 0);
    this.set(L4TagProvider.TAGS.KPI_PROCESSING_EFFICIENCY, 100);

    // Finance
    this.set(L4TagProvider.TAGS.FINANCE_TOTAL_BUDGET, 503000000); // $503M FY2026
    this.set(L4TagProvider.TAGS.FINANCE_TOTAL_SPENT, 0);
    this.set(L4TagProvider.TAGS.FINANCE_TOTAL_REVENUE, 0);
    this.set(L4TagProvider.TAGS.FINANCE_FUND_BALANCE, 0);

    // Workforce
    this.set(L4TagProvider.TAGS.WORKFORCE_TOTAL, 0);
    this.set(L4TagProvider.TAGS.WORKFORCE_FULLTIME, 0);
    this.set(L4TagProvider.TAGS.WORKFORCE_PARTTIME, 0);

    // Compliance
    this.set(L4TagProvider.TAGS.COMPLIANCE_PA_CODE, true);
    this.set(L4TagProvider.TAGS.COMPLIANCE_CHARTER, true);
    this.set(L4TagProvider.TAGS.COMPLIANCE_GAAP, true);

    // Boards
    this.set(L4TagProvider.TAGS.BOARD_RETIREMENT, { nextMeeting: null, status: 'active' });
    this.set(L4TagProvider.TAGS.BOARD_SALARY, { nextMeeting: null, status: 'active' });
    this.set(L4TagProvider.TAGS.BOARD_PRISON, { nextMeeting: null, status: 'active' });
    this.set(L4TagProvider.TAGS.BOARD_ELECTIONS, { nextMeeting: null, status: 'active' });
    this.set(L4TagProvider.TAGS.BOARD_CONSTABLE, { nextMeeting: null, status: 'active' });

    // Strategy
    this.set(L4TagProvider.TAGS.STRATEGY_GOALS_TOTAL, 0);
    this.set(L4TagProvider.TAGS.STRATEGY_GOALS_COMPLETE, 0);
    this.set(L4TagProvider.TAGS.STRATEGY_GOALS_ON_TRACK, 0);
    this.set(L4TagProvider.TAGS.STRATEGY_GOALS_AT_RISK, 0);

    // Register default KPIs
    this.registerKPI('budget-variance', {
      name: 'Budget Variance',
      description: 'Deviation from approved budget',
      target: 0,
      current: 0,
      unit: '%',
      category: 'financial'
    });

    this.registerKPI('audit-coverage', {
      name: 'Audit Coverage',
      description: 'Percentage of required audits completed',
      target: 100,
      current: 100,
      unit: '%',
      category: 'compliance'
    });

    this.registerKPI('processing-time', {
      name: 'Average Processing Time',
      description: 'Average days to process claims',
      target: 5,
      current: 0,
      unit: 'days',
      category: 'operations'
    });
  }

  _notifySubscribers(tagPath, newValue, oldValue) {
    const subs = this.subscriptions.get(tagPath);
    if (subs) {
      subs.forEach(cb => cb(newValue, oldValue));
    }
  }
}

export const l4TagProvider = new L4TagProvider();
l4TagProvider.initialize();

export default l4TagProvider;
