/**
 * NAC Data Service
 *
 * Provides data access layer for NAC applications
 * Integrates with local databases and county systems
 */

const { Budget2024, BudgetHistory, ControllerPriorities } = require('../analysis/CountyFinancials');

class DataService {
  constructor() {
    this.budget = Budget2024;
    this.history = BudgetHistory;
    this.priorities = ControllerPriorities;
  }

  // Budget API
  getBudgetSummary() {
    return {
      fiscalYear: this.budget.year,
      total: this.budget.total,
      millageRate: this.budget.millageRate,
      categories: {
        humanServices: this.budget.expenditures.humanServices.amount,
        courtsCorrections: this.budget.expenditures.courtsCorrections.amount,
        generalGovernment: this.budget.expenditures.generalGovernment.amount,
        publicWorks: this.budget.expenditures.publicWorks.amount,
        debtService: this.budget.expenditures.debtService.amount,
      },
    };
  }

  getBudgetHistory() {
    return this.history.map(year => ({
      year: year.year,
      total: year.total,
      millage: year.millage,
      change: year.change,
    }));
  }

  // Row Officer API
  getRowOfficers() {
    return Object.entries(this.budget.rowOfficers).map(([id, data]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
      budget: data.budget,
      revenue: data.revenue,
      auditAreas: data.auditAreas,
      ratio: (data.revenue / data.budget).toFixed(2),
    }));
  }

  getRowOfficer(id) {
    const data = this.budget.rowOfficers[id];
    if (!data) return null;

    return {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
      ...data,
    };
  }

  // Revenue API
  getRevenueSources() {
    const rev = this.budget.revenues;
    return {
      propertyTax: {
        amount: rev.propertyTax.amount,
        percent: rev.propertyTax.percent,
        millage: rev.propertyTax.millage,
      },
      intergovernmental: {
        amount: rev.intergovernmental.amount,
        percent: rev.intergovernmental.percent,
        federal: rev.intergovernmental.subcategories.federalGrants,
        state: rev.intergovernmental.subcategories.stateGrants,
      },
      chargesForServices: {
        amount: rev.chargesForServices.amount,
        percent: rev.chargesForServices.percent,
      },
      other: {
        amount: rev.otherRevenue.amount,
        percent: rev.otherRevenue.percent,
        gaming: rev.otherRevenue.subcategories.gamingRevenue,
        investments: rev.otherRevenue.subcategories.investments,
      },
    };
  }

  // Debt API
  getDebtStatus() {
    return {
      authorizedGO: this.budget.debt.authorizedGO,
      outstanding: this.budget.debt.outstandingEstimate,
      annualService: this.budget.debt.annualService,
      rating: this.budget.debt.rating,
      availableCapacity: this.budget.debt.authorizedGO - this.budget.debt.outstandingEstimate,
    };
  }

  // Audit Priorities API
  getAuditPriorities() {
    return this.priorities;
  }

  // Gracedale API
  getGracedaleStatus() {
    const g = this.budget.gracedale;
    return {
      budget: g.budget,
      revenue: g.revenue,
      deficit: g.deficit,
      beds: g.beds,
      occupancy: g.occupancy,
      occupancyPercent: `${(g.occupancy * 100).toFixed(0)}%`,
      revenuePerBed: Math.round(g.revenue / g.beds),
    };
  }

  // Controller Metrics API
  getControllerMetrics() {
    const population = 312_000;
    return {
      revenuePerCapita: Math.round(this.budget.total / population),
      debtPerCapita: Math.round(this.budget.debt.outstandingEstimate / population),
      taxPerCapita: Math.round(this.budget.revenues.propertyTax.amount / population),
      rowOfficerCount: Object.keys(this.budget.rowOfficers).length,
      totalRowOfficerRevenue: Object.values(this.budget.rowOfficers)
        .reduce((sum, o) => sum + o.revenue, 0),
      claimsPerYear: this.priorities.preAudit.annualVolume,
    };
  }
}

module.exports = { DataService };
