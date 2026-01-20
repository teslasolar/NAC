/**
 * NAC API Client
 *
 * Client library for integrating with Northampton County systems
 * and norcopa.gov data sources.
 */

const NORCOPA_BASE = 'https://www.norcopa.gov';
const COUNTY_ENDPOINTS = {
  // Official county data sources
  main: NORCOPA_BASE,
  controller: `${NORCOPA_BASE}/government/row-offices/controller`,
  treasurer: `${NORCOPA_BASE}/government/row-offices/treasurer`,
  assessment: `${NORCOPA_BASE}/government/row-offices/assessment`,
  recorder: `${NORCOPA_BASE}/government/row-offices/recorder-of-deeds`,
  register: `${NORCOPA_BASE}/government/row-offices/register-of-wills`,
  sheriff: `${NORCOPA_BASE}/government/row-offices/sheriff`,
  prothonotary: `${NORCOPA_BASE}/government/row-offices/prothonotary`,
  clerkOfCourts: `${NORCOPA_BASE}/government/row-offices/clerk-of-courts`,
  coroner: `${NORCOPA_BASE}/government/row-offices/coroner`,
  districtAttorney: `${NORCOPA_BASE}/government/row-offices/district-attorney`,

  // Key services
  budget: `${NORCOPA_BASE}/government/departments/fiscal-affairs`,
  humanServices: `${NORCOPA_BASE}/government/departments/human-services`,
  gracedale: `${NORCOPA_BASE}/government/departments/gracedale`,
  elections: `${NORCOPA_BASE}/government/departments/voter-registration`,

  // External data
  paLegis: 'https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm',
  gis: 'https://gis.norcopa.gov',
};

class NACClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || NORCOPA_BASE;
    this.cache = new Map();
    this.cacheTimeout = options.cacheTimeout || 300000; // 5 minutes
  }

  // Get county endpoint URL
  getEndpoint(name) {
    return COUNTY_ENDPOINTS[name] || null;
  }

  // Get all endpoints for row officers
  getRowOfficerEndpoints() {
    return {
      controller: COUNTY_ENDPOINTS.controller,
      treasurer: COUNTY_ENDPOINTS.treasurer,
      sheriff: COUNTY_ENDPOINTS.sheriff,
      recorder: COUNTY_ENDPOINTS.recorder,
      register: COUNTY_ENDPOINTS.register,
      prothonotary: COUNTY_ENDPOINTS.prothonotary,
      clerkOfCourts: COUNTY_ENDPOINTS.clerkOfCourts,
      coroner: COUNTY_ENDPOINTS.coroner,
      districtAttorney: COUNTY_ENDPOINTS.districtAttorney,
    };
  }

  // Generate statute link
  getStatuteLink(title, section) {
    return `${COUNTY_ENDPOINTS.paLegis}?txtType=HTM&ttl=${title}§ion=${section}`;
  }

  // Get GIS portal link
  getGISLink(layer = '') {
    return layer ? `${COUNTY_ENDPOINTS.gis}/${layer}` : COUNTY_ENDPOINTS.gis;
  }

  // Local API routes (for internal NAC data)
  static routes = {
    budget: '/api/budget',
    statutes: '/api/statutes',
    officers: '/api/officers',
    audit: '/api/audit',
    vectors: '/api/vectors',
    blockchain: '/api/blockchain',
  };

  // Format currency
  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format percentage
  static formatPercent(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
  }
}

module.exports = { NACClient, COUNTY_ENDPOINTS };
