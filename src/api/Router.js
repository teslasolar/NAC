/**
 * NAC API Router
 *
 * Simple API routing for NAC data endpoints
 * Can be used standalone or integrated with Express
 */

const { DataService } = require('./DataService');
const { NACClient, COUNTY_ENDPOINTS } = require('./NACClient');

class APIRouter {
  constructor() {
    this.dataService = new DataService();
    this.client = new NACClient();
    this.routes = new Map();
    this.setupRoutes();
  }

  setupRoutes() {
    // Budget endpoints
    this.routes.set('GET /api/budget', () => this.dataService.getBudgetSummary());
    this.routes.set('GET /api/budget/history', () => this.dataService.getBudgetHistory());

    // Row officers endpoints
    this.routes.set('GET /api/officers', () => this.dataService.getRowOfficers());
    this.routes.set('GET /api/officers/:id', (params) => this.dataService.getRowOfficer(params.id));

    // Revenue endpoints
    this.routes.set('GET /api/revenue', () => this.dataService.getRevenueSources());

    // Debt endpoints
    this.routes.set('GET /api/debt', () => this.dataService.getDebtStatus());

    // Gracedale endpoints
    this.routes.set('GET /api/gracedale', () => this.dataService.getGracedaleStatus());

    // Controller metrics
    this.routes.set('GET /api/metrics', () => this.dataService.getControllerMetrics());

    // Audit priorities
    this.routes.set('GET /api/audit/priorities', () => this.dataService.getAuditPriorities());

    // External links
    this.routes.set('GET /api/links/county', () => COUNTY_ENDPOINTS);
    this.routes.set('GET /api/links/officers', () => this.client.getRowOfficerEndpoints());
  }

  // Handle API request
  handle(method, path, params = {}) {
    const routeKey = `${method} ${path}`;

    // Check exact match
    if (this.routes.has(routeKey)) {
      return {
        status: 200,
        data: this.routes.get(routeKey)(params),
      };
    }

    // Check parameterized routes
    for (const [route, handler] of this.routes) {
      const [routeMethod, routePath] = route.split(' ');
      if (routeMethod !== method) continue;

      const routeParts = routePath.split('/');
      const pathParts = path.split('/');

      if (routeParts.length !== pathParts.length) continue;

      const extractedParams = {};
      let match = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          extractedParams[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return {
          status: 200,
          data: handler({ ...params, ...extractedParams }),
        };
      }
    }

    return { status: 404, error: 'Not found' };
  }

  // Get all available routes
  getRoutes() {
    return Array.from(this.routes.keys());
  }

  // Generate OpenAPI spec
  generateSpec() {
    return {
      openapi: '3.0.0',
      info: {
        title: 'NAC API',
        version: '1.0.0',
        description: 'Northampton County Legal Intelligence API',
      },
      servers: [
        { url: 'https://teslasolar.github.io/NAC', description: 'GitHub Pages' },
        { url: 'https://www.norcopa.gov', description: 'Northampton County' },
      ],
      paths: {
        '/api/budget': {
          get: { summary: 'Get budget summary', tags: ['Budget'] },
        },
        '/api/budget/history': {
          get: { summary: 'Get budget history', tags: ['Budget'] },
        },
        '/api/officers': {
          get: { summary: 'Get all row officers', tags: ['Officers'] },
        },
        '/api/officers/{id}': {
          get: { summary: 'Get row officer by ID', tags: ['Officers'] },
        },
        '/api/revenue': {
          get: { summary: 'Get revenue sources', tags: ['Revenue'] },
        },
        '/api/debt': {
          get: { summary: 'Get debt status', tags: ['Debt'] },
        },
        '/api/gracedale': {
          get: { summary: 'Get Gracedale status', tags: ['Gracedale'] },
        },
        '/api/metrics': {
          get: { summary: 'Get controller metrics', tags: ['Metrics'] },
        },
        '/api/audit/priorities': {
          get: { summary: 'Get audit priorities', tags: ['Audit'] },
        },
        '/api/links/county': {
          get: { summary: 'Get county website links', tags: ['Links'] },
        },
      },
    };
  }
}

module.exports = { APIRouter };
