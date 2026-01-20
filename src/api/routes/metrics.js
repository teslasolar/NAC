/**
 * Metrics & Reporting Routes
 *
 * Handles county-wide metrics, officer performance,
 * and reporting endpoints.
 *
 * @module api/routes/metrics
 */

import { Router } from 'express';

const router = Router();

/** List of row officers */
const OFFICERS = [
  'sheriff', 'treasurer', 'coroner', 'district-attorney',
  'recorder-of-deeds', 'register-of-wills', 'clerk-of-courts', 'prothonotary'
];

/**
 * Format officer ID to display name
 * @param {string} id - Officer ID (kebab-case)
 * @returns {string} Display name
 */
function formatOfficerName(id) {
  return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Generate simulated real-time metrics
 * @returns {Object} Real-time metrics
 */
function generateRealtimeMetrics() {
  return {
    activeWorkItems: Math.floor(Math.random() * 500) + 200,
    processingRate: (Math.random() * 50 + 150).toFixed(1) + '/hour',
    avgCycleTime: (Math.random() * 2 + 1).toFixed(2) + ' days',
    slaCompliance: (Math.random() * 5 + 94).toFixed(1) + '%'
  };
}

/**
 * Generate officer performance metrics
 * @param {string} id - Officer ID
 * @returns {Object} Officer metrics
 */
function generateOfficerMetrics(id) {
  return {
    id,
    name: formatOfficerName(id),
    workItemsProcessed: Math.floor(Math.random() * 1000) + 100,
    avgProcessingTime: (Math.random() * 3 + 0.5).toFixed(2) + ' days',
    slaCompliance: (Math.random() * 10 + 90).toFixed(1) + '%',
    activeItems: Math.floor(Math.random() * 100) + 10
  };
}

/**
 * Create metrics router with injected dependencies
 * @param {Object} deps - Dependencies
 * @param {Object} deps.configLoader - Configuration loader
 */
export function createMetricsRouter({ configLoader }) {

  /**
   * @api {get} /api/metrics County-wide Metrics
   */
  router.get('/', (req, res) => {
    try {
      const summary = configLoader.getSummary();

      res.json({
        timestamp: new Date().toISOString(),
        enterprise: summary.enterprise,
        production: {
          units: summary.unitCount,
          lines: summary.lineCount,
          workItemTypes: summary.workItemTypeCount
        },
        operations: {
          workflows: summary.workflowCount,
          policies: summary.policies.length
        },
        realtime: generateRealtimeMetrics()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {get} /api/metrics/officers Officer Performance Metrics
   */
  router.get('/officers', (req, res) => {
    try {
      const metrics = OFFICERS.map(generateOfficerMetrics);
      res.json({ officers: metrics });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @api {get} /api/metrics/officers/:id Single Officer Metrics
   */
  router.get('/officers/:id', (req, res) => {
    try {
      const { id } = req.params;
      if (!OFFICERS.includes(id)) {
        return res.status(404).json({ error: `Officer not found: ${id}` });
      }
      res.json(generateOfficerMetrics(id));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

export { OFFICERS, formatOfficerName, generateRealtimeMetrics, generateOfficerMetrics };
export default createMetricsRouter;
