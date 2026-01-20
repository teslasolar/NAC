/**
 * Budget Analyzer for Controller's Office
 *
 * Identifies improvement opportunities in county finances:
 * - Expense reduction targets
 * - Revenue enhancement opportunities
 * - Debt optimization
 * - Audit focus areas
 */

const { Budget2024, BudgetHistory, ControllerPriorities } = require('./CountyFinancials');

class BudgetAnalyzer {
  constructor(budget = Budget2024) {
    this.budget = budget;
  }

  // Analyze expenditure efficiency
  analyzeExpenditures() {
    const exp = this.budget.expenditures;
    const findings = [];

    // 1. Human Services pass-through ratio
    const passThrough = exp.humanServices.subcategories.assistance;
    const passRatio = passThrough / exp.humanServices.amount;
    findings.push({
      category: 'Human Services',
      metric: 'Pass-through ratio',
      value: (passRatio * 100).toFixed(1) + '%',
      benchmark: '> 65%',
      status: passRatio > 0.65 ? 'OK' : 'REVIEW',
      recommendation: passRatio > 0.65
        ? 'Pass-through ratio healthy - state/federal funds flowing correctly'
        : 'Administrative costs may be high relative to program delivery',
    });

    // 2. Corrections cost per capita
    const population = 312_000; // Northampton County pop estimate
    const correctionsCostPerCap = exp.courtsCorrections.subcategories.corrections / population;
    findings.push({
      category: 'Corrections',
      metric: 'Cost per capita',
      value: '$' + correctionsCostPerCap.toFixed(2),
      benchmark: '< $150',
      status: correctionsCostPerCap < 150 ? 'OK' : 'HIGH',
      recommendation: correctionsCostPerCap > 150
        ? 'Review alternatives to incarceration, pretrial services expansion'
        : 'Corrections costs within normal range',
    });

    // 3. IT spending as % of budget
    const itPercent = exp.generalGovernment.subcategories.informationTech / this.budget.total;
    findings.push({
      category: 'Information Technology',
      metric: 'IT as % of budget',
      value: (itPercent * 100).toFixed(2) + '%',
      benchmark: '1-2%',
      status: itPercent < 0.02 ? 'OK' : 'REVIEW',
      recommendation: itPercent > 0.02
        ? 'Review IT contracts, consider cloud migration, shared services'
        : 'IT spending reasonable - continue monitoring major contracts',
    });

    // 4. Facilities cost analysis
    const facilitiesPerSqFt = exp.generalGovernment.subcategories.facilities / 500_000; // Est 500k sqft
    findings.push({
      category: 'Facilities',
      metric: 'Cost per sq ft',
      value: '$' + facilitiesPerSqFt.toFixed(2),
      benchmark: '< $25/sqft',
      status: facilitiesPerSqFt < 25 ? 'OK' : 'HIGH',
      recommendation: 'Energy audits, preventive maintenance scheduling, space consolidation',
    });

    // 5. Debt service ratio
    const debtServiceRatio = this.budget.debt.annualService / this.budget.revenues.propertyTax.amount;
    findings.push({
      category: 'Debt Service',
      metric: 'Debt service / Property tax',
      value: (debtServiceRatio * 100).toFixed(1) + '%',
      benchmark: '< 10%',
      status: debtServiceRatio < 0.10 ? 'EXCELLENT' : debtServiceRatio < 0.15 ? 'OK' : 'HIGH',
      recommendation: debtServiceRatio < 0.10
        ? 'Strong debt position - capacity for strategic investments'
        : 'Monitor debt levels, refinance if rates favorable',
    });

    return findings;
  }

  // Analyze revenue opportunities
  analyzeRevenue() {
    const rev = this.budget.revenues;
    const opportunities = [];

    // 1. Row officer fee collection efficiency
    const rowOfficers = this.budget.rowOfficers;
    let totalRowRevenue = 0;
    let totalRowBudget = 0;

    Object.entries(rowOfficers).forEach(([name, data]) => {
      totalRowRevenue += data.revenue;
      totalRowBudget += data.budget;

      const ratio = data.revenue / data.budget;
      if (ratio < 1.5 && data.revenue > 1_000_000) {
        opportunities.push({
          category: 'Row Officer Revenue',
          officer: name,
          currentRevenue: data.revenue,
          potentialIncrease: data.revenue * 0.05, // 5% improvement
          recommendation: `Review fee schedules for ${name}, ensure full collection`,
        });
      }
    });

    // 2. Investment income optimization
    const investmentReturn = rev.otherRevenue.subcategories.investments;
    const estimatedCash = 80_000_000; // Typical county cash position
    const impliedReturn = (investmentReturn / estimatedCash) * 100;

    opportunities.push({
      category: 'Investment Income',
      metric: 'Implied return',
      value: impliedReturn.toFixed(2) + '%',
      benchmark: '4-5% (current rates)',
      potential: estimatedCash * 0.01, // 1% improvement
      recommendation: impliedReturn < 4
        ? 'Review investment policy, consider higher-yield instruments within policy limits'
        : 'Investment returns competitive - continue monitoring',
    });

    // 3. Grant recovery
    const grantTotal = rev.intergovernmental.subcategories.federalGrants +
                       rev.intergovernmental.subcategories.stateGrants;
    opportunities.push({
      category: 'Grant Revenue',
      currentTotal: grantTotal,
      potentialIncrease: grantTotal * 0.03, // 3% from better tracking
      recommendation: 'Implement grant management system, maximize indirect cost recovery',
    });

    // 4. Gaming revenue share
    opportunities.push({
      category: 'Gaming Revenue',
      currentAmount: rev.otherRevenue.subcategories.gamingRevenue,
      note: 'Wind Creek Bethlehem local share',
      recommendation: 'Monitor legislative changes to gaming revenue distribution',
    });

    return opportunities;
  }

  // Identify audit priorities based on risk
  identifyAuditPriorities() {
    const priorities = [];

    // High-dollar departments
    const exp = this.budget.expenditures;
    priorities.push({
      priority: 1,
      area: 'Human Services Pass-Through',
      amount: exp.humanServices.amount,
      risk: 'HIGH',
      rationale: 'Largest budget area, federal compliance requirements',
      auditFocus: ['Eligibility verification', 'Provider payments', 'Grant compliance'],
    });

    priorities.push({
      priority: 2,
      area: 'Corrections Operations',
      amount: exp.courtsCorrections.subcategories.corrections,
      risk: 'HIGH',
      rationale: 'Large contracts, safety/liability concerns',
      auditFocus: ['Vendor contracts', 'Inmate accounts', 'Medical services'],
    });

    priorities.push({
      priority: 3,
      area: 'Gracedale Nursing Home',
      amount: this.budget.gracedale.budget,
      risk: 'MEDIUM-HIGH',
      rationale: 'Enterprise fund, Medicaid billing, staffing costs',
      auditFocus: ['Census/billing accuracy', 'Payroll', 'Supplies inventory'],
    });

    // Row officers with highest revenue
    const rowOfficers = Object.entries(this.budget.rowOfficers)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    rowOfficers.slice(0, 3).forEach((officer, idx) => {
      priorities.push({
        priority: 4 + idx,
        area: `${officer.name.charAt(0).toUpperCase() + officer.name.slice(1)} Office`,
        amount: officer.revenue,
        risk: 'MEDIUM',
        rationale: 'Fee collection, cash handling',
        auditFocus: officer.auditAreas,
      });
    });

    return priorities;
  }

  // Generate Controller improvement recommendations
  generateRecommendations() {
    const recommendations = {
      immediate: [], // 0-6 months
      shortTerm: [], // 6-12 months
      longTerm: [],  // 1-3 years
    };

    // Immediate
    recommendations.immediate.push({
      title: 'Implement Real-Time Budget Monitoring Dashboard',
      statute: '16 Pa.C.S. §1705',
      impact: 'Catch budget variances before overruns',
      estimatedSavings: 500_000,
      effort: 'LOW - Use existing data, new visualization',
    });

    recommendations.immediate.push({
      title: 'Automate Duplicate Payment Detection',
      statute: '16 Pa.C.S. §1730',
      impact: 'Prevent duplicate vendor payments',
      estimatedSavings: 250_000,
      effort: 'MEDIUM - AI/ML pattern matching',
    });

    recommendations.immediate.push({
      title: 'Standardize Row Officer Monthly Reports',
      statute: '16 Pa.C.S. §1720',
      impact: 'Earlier detection of fee collection issues',
      estimatedSavings: 150_000,
      effort: 'LOW - Template + training',
    });

    // Short-term
    recommendations.shortTerm.push({
      title: 'Energy Audit of County Facilities',
      statute: '16 Pa.C.S. §1705 (fiscal supervision)',
      impact: 'Reduce utility costs 10-15%',
      estimatedSavings: 1_500_000,
      effort: 'MEDIUM - External audit, capital for upgrades',
    });

    recommendations.shortTerm.push({
      title: 'Review Major Contracts (>$100K)',
      statute: '16 Pa.C.S. §1730',
      impact: 'Ensure competitive pricing',
      estimatedSavings: 2_000_000,
      effort: 'MEDIUM - Staff time for review',
    });

    recommendations.shortTerm.push({
      title: 'Implement Continuous Audit Monitoring',
      statute: '16 Pa.C.S. §1720',
      impact: 'Real-time anomaly detection vs. annual audits',
      estimatedSavings: 800_000,
      effort: 'MEDIUM - Technology + process change',
    });

    // Long-term
    recommendations.longTerm.push({
      title: 'Shared Services Study with Lehigh County',
      statute: 'Home Rule Charter authority',
      impact: 'IT, purchasing, back-office consolidation',
      estimatedSavings: 5_000_000,
      effort: 'HIGH - Political will, negotiation',
    });

    recommendations.longTerm.push({
      title: 'Debt Refinancing Analysis',
      statute: '16 Pa.C.S. §1602 (fiscal affairs)',
      impact: 'Lower interest costs if rates favorable',
      estimatedSavings: 500_000,
      effort: 'LOW - Financial advisor analysis',
    });

    recommendations.longTerm.push({
      title: 'Grant Maximization Program',
      statute: '16 Pa.C.S. §1705',
      impact: 'Increase federal/state revenue capture',
      estimatedSavings: 3_000_000,
      effort: 'MEDIUM - Dedicated grant writer, tracking system',
    });

    // Calculate totals
    const totalSavings = [
      ...recommendations.immediate,
      ...recommendations.shortTerm,
      ...recommendations.longTerm,
    ].reduce((sum, r) => sum + r.estimatedSavings, 0);

    return {
      recommendations,
      totalEstimatedSavings: totalSavings,
      percentOfBudget: ((totalSavings / this.budget.total) * 100).toFixed(2),
    };
  }

  // Full analysis report
  generateReport() {
    return {
      generated: new Date().toISOString(),
      fiscalYear: this.budget.year,
      totalBudget: this.budget.total,
      millageRate: this.budget.millageRate,

      expenditureAnalysis: this.analyzeExpenditures(),
      revenueOpportunities: this.analyzeRevenue(),
      auditPriorities: this.identifyAuditPriorities(),
      recommendations: this.generateRecommendations(),

      summary: {
        budgetTrend: BudgetHistory,
        controllerPriorities: ControllerPriorities,
        keyMetrics: {
          revenuePerCapita: Math.round(this.budget.total / 312_000),
          debtPerCapita: Math.round(this.budget.debt.outstandingEstimate / 312_000),
          employeesEstimate: 2_800,
          rowOfficerCount: 8,
        },
      },
    };
  }
}

module.exports = { BudgetAnalyzer };
