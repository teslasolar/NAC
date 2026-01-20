/**
 * NAC API Browser Client
 *
 * Lightweight client for browser-side integration with NAC data
 * Include via <script src="src/api/nac-api.browser.js"></script>
 */

(function(global) {
  'use strict';

  // County endpoints
  const NORCOPA = {
    main: 'https://www.norcopa.gov',
    controller: 'https://www.norcopa.gov/government/row-offices/controller',
    treasurer: 'https://www.norcopa.gov/government/row-offices/treasurer',
    assessment: 'https://www.norcopa.gov/government/row-offices/assessment',
    recorder: 'https://www.norcopa.gov/government/row-offices/recorder-of-deeds',
    register: 'https://www.norcopa.gov/government/row-offices/register-of-wills',
    sheriff: 'https://www.norcopa.gov/government/row-offices/sheriff',
    prothonotary: 'https://www.norcopa.gov/government/row-offices/prothonotary',
    clerkOfCourts: 'https://www.norcopa.gov/government/row-offices/clerk-of-courts',
    coroner: 'https://www.norcopa.gov/government/row-offices/coroner',
    da: 'https://www.norcopa.gov/government/row-offices/district-attorney',
    budget: 'https://www.norcopa.gov/government/departments/fiscal-affairs',
    humanServices: 'https://www.norcopa.gov/government/departments/human-services',
    gracedale: 'https://www.norcopa.gov/government/departments/gracedale',
    elections: 'https://www.norcopa.gov/government/departments/voter-registration',
    gis: 'https://gis.norcopa.gov',
  };

  // PA Legislature links
  const PA_LEGIS = {
    title16: 'https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=16',
    title25: 'https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=25',
    title61: 'https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=61',
    title72: 'https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=72',
  };

  // Budget data (2024)
  const BUDGET = {
    year: 2024,
    total: 582000000,
    millage: 10.8,
    expenditures: {
      humanServices: 349800000,
      courtsCorrections: 93600000,
      generalGovernment: 105700000,
      publicWorks: 27500000,
      debtService: 5400000,
    },
    revenues: {
      propertyTax: 118000000,
      intergovernmental: 285000000,
      chargesForServices: 95000000,
      other: 84000000,
    },
    rowOfficers: {
      treasurer: { budget: 1800000, revenue: 118000000 },
      sheriff: { budget: 9100000, revenue: 3200000 },
      registerOfWills: { budget: 1200000, revenue: 4800000 },
      recorderOfDeeds: { budget: 1400000, revenue: 8500000 },
      prothonotary: { budget: 1100000, revenue: 2800000 },
      clerkOfCourts: { budget: 1300000, revenue: 3500000 },
      coroner: { budget: 1600000, revenue: 180000 },
      districtAttorney: { budget: 8200000, revenue: 2100000 },
    },
    debt: {
      authorized: 63500000,
      outstanding: 45000000,
      annualService: 5400000,
    },
    gracedale: {
      budget: 55000000,
      revenue: 52000000,
      beds: 650,
      occupancy: 0.92,
    },
  };

  // NAC API object
  const NAC = {
    // County links
    county: NORCOPA,
    legis: PA_LEGIS,

    // Budget data
    budget: BUDGET,

    // Format helpers
    formatCurrency: function(amount) {
      return '$' + amount.toLocaleString('en-US');
    },

    formatPercent: function(value, decimals) {
      decimals = decimals || 1;
      return value.toFixed(decimals) + '%';
    },

    // Get budget category
    getBudgetCategory: function(name) {
      return BUDGET.expenditures[name] || BUDGET.revenues[name] || null;
    },

    // Get row officer data
    getRowOfficer: function(name) {
      return BUDGET.rowOfficers[name] || null;
    },

    // Get total row officer revenue
    getTotalRowOfficerRevenue: function() {
      let total = 0;
      for (let key in BUDGET.rowOfficers) {
        total += BUDGET.rowOfficers[key].revenue;
      }
      return total;
    },

    // Get county link
    getCountyLink: function(name) {
      return NORCOPA[name] || NORCOPA.main;
    },

    // Open county page
    openCountyPage: function(name) {
      window.open(this.getCountyLink(name), '_blank');
    },

    // Get statute link
    getStatuteLink: function(title, section) {
      return PA_LEGIS['title' + title] + '&section=' + section;
    },

    // Calculate metrics
    getMetrics: function() {
      const pop = 312000;
      return {
        revenuePerCapita: Math.round(BUDGET.total / pop),
        debtPerCapita: Math.round(BUDGET.debt.outstanding / pop),
        taxPerCapita: Math.round(BUDGET.revenues.propertyTax / pop),
        debtServiceRatio: (BUDGET.debt.annualService / BUDGET.revenues.propertyTax * 100).toFixed(1) + '%',
        gracedaleOccupancy: (BUDGET.gracedale.occupancy * 100).toFixed(0) + '%',
      };
    },

    // Render county links into element
    renderCountyLinks: function(elementId) {
      const el = document.getElementById(elementId);
      if (!el) return;

      const links = [
        { name: 'County Home', url: NORCOPA.main },
        { name: 'Controller', url: NORCOPA.controller },
        { name: 'Treasurer', url: NORCOPA.treasurer },
        { name: 'Fiscal Affairs', url: NORCOPA.budget },
        { name: 'GIS Portal', url: NORCOPA.gis },
      ];

      let html = '<ul class="nac-links">';
      links.forEach(function(link) {
        html += '<li><a href="' + link.url + '" target="_blank">' + link.name + '</a></li>';
      });
      html += '</ul>';

      el.innerHTML = html;
    },

    // Version
    version: '1.0.0',
  };

  // Export to global scope
  global.NAC = NAC;

})(typeof window !== 'undefined' ? window : this);
