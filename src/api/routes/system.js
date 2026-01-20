/**
 * System Routes
 *
 * Handles health checks, status, validation, policies,
 * and configuration endpoints.
 *
 * @module api/routes/system
 */

import { Router } from 'express';

const router = Router();

/** API Version */
const API_VERSION = '2.0.0';

/** Available API endpoints */
const AVAILABLE_ENDPOINTS = [
  'GET /api/health',
  'GET /api/status',
  'GET /api/units',
  'GET /api/units/:id',
  'GET /api/units/:id/state',
  'POST /api/units/:id/command',
  'GET /api/workitems/types',
  'POST /api/workitems',
  'GET /api/workflows',
  'GET /api/workflows/:id',
  'POST /api/workflows/:id/instances',
  'GET /api/transactions/fees',
  'GET /api/transactions/fees/:officerId',
  'POST /api/transactions/calculate',
  'POST /api/validate',
  'GET /api/rules',
  'GET /api/metrics',
  'GET /api/metrics/officers',
  'GET /api/policies',
  'GET /api/config/export'
];

/**
 * Create system router with injected dependencies
 * @param {Object} deps - Dependencies
 * @param {Object} deps.digitalTwin - Digital twin instance
 * @param {Object} deps.configLoader - Configuration loader
 * @param {Object} deps.ruleEngine - Rule engine
 */
export function createSystemRouter({ digitalTwin, configLoader, ruleEngine }) {

  /**
   * @api {get} /api/health Health Check
   */
  router.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: API_VERSION,
      digitalTwin: digitalTwin ? 'initialized' : 'not initialized'
    });
  });

  /**
   * @api {get} /api/status System Status
   */
  router.get('/status', (req, res) => {
    res.json({
      system: 'Northampton County Digital Twin',
      state: digitalTwin?.state || 'unknown',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  });

  /**
   * @api {post} /api/validate Validate Data Against Rules
   */
  router.post('/validate', (req, res) => {
    try {
      const { data, ruleset } = req.body;

      if (!ruleset) {
        return res.status(400).json({ error: 'ruleset is required' });
      }

      const result = ruleEngine.validate(data, ruleset);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  /**
   * @api {get} /api/rules Get Business Rules
   */
  router.get('/rules', (req, res) => {
    try {
      const rules = configLoader.getConfig('L2', 'businessRules');
      res.json(rules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {get} /api/policies Enterprise Policies
   */
  router.get('/policies', (req, res) => {
    try {
      const policies = configLoader.getPolicies();
      res.json(policies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {get} /api/config/export Export All Configuration
   */
  router.get('/config/export', (req, res) => {
    try {
      const config = configLoader.exportAll();
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

/**
 * Create 404 handler middleware
 */
export function create404Handler() {
  return (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Endpoint not found: ${req.method} ${req.path}`,
      availableEndpoints: AVAILABLE_ENDPOINTS
    });
  };
}

/**
 * Create error handler middleware
 */
export function createErrorHandler() {
  return (err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  };
}

export { API_VERSION, AVAILABLE_ENDPOINTS };
export default createSystemRouter;
