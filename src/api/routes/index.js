/**
 * API Routes Index
 *
 * Exports all route factories for the NAC Digital Twin API.
 *
 * @module api/routes
 */

export { createUnitsRouter } from './units.js';
export { createWorkflowsRouter } from './workflows.js';
export { createTransactionsRouter, createWorkItemsRouter } from './transactions.js';
export { createMetricsRouter, OFFICERS, formatOfficerName } from './metrics.js';
export {
  createSystemRouter,
  create404Handler,
  createErrorHandler,
  API_VERSION,
  AVAILABLE_ENDPOINTS
} from './system.js';
