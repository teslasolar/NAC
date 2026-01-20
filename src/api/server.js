/**
 * NAC Digital Twin REST API Server
 *
 * Exposes the Northampton County Digital Twin through a REST API.
 * Routes are organized into separate modules for maintainability.
 *
 * @module api/server
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

// Import digital twin components
import { getConfigLoader } from '../digitaltwin/ConfigLoader.js';
import { createDigitalTwin } from '../digitaltwin/DigitalTwin.js';
import { createWorkflowEngine } from '../isa95/L2_Control/engine/WorkflowEngine.js';
import { createRuleEngine } from '../isa95/L2_Control/engine/RuleEngine.js';
import { createBlockchainSigner } from '../isa95/L1_Transactions/signing/BlockchainSigner.js';

// Import route factories
import {
  createUnitsRouter,
  createWorkflowsRouter,
  createTransactionsRouter,
  createWorkItemsRouter,
  createMetricsRouter,
  createSystemRouter,
  create404Handler,
  createErrorHandler
} from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Service instances
let digitalTwin = null;
let configLoader = null;
let workflowEngine = null;
let ruleEngine = null;
let blockchainSigner = null;

/**
 * Initialize digital twin and all services
 */
async function initializeDigitalTwin() {
  try {
    configLoader = getConfigLoader();
    digitalTwin = createDigitalTwin({
      id: 'northampton-county',
      name: 'Northampton County Government'
    });

    workflowEngine = createWorkflowEngine();
    ruleEngine = createRuleEngine();
    blockchainSigner = createBlockchainSigner();

    digitalTwin.initialize();
    console.log('Digital Twin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Digital Twin:', error.message);
  }
}

/**
 * Mount all API routes
 */
function mountRoutes() {
  const deps = {
    digitalTwin,
    configLoader,
    workflowEngine,
    ruleEngine,
    blockchainSigner
  };

  // Mount route modules
  app.use('/api/units', createUnitsRouter(deps));
  app.use('/api/workflows', createWorkflowsRouter(deps));
  app.use('/api/transactions', createTransactionsRouter(deps));
  app.use('/api/workitems', createWorkItemsRouter(deps));
  app.use('/api/metrics', createMetricsRouter(deps));
  app.use('/api', createSystemRouter(deps));

  // Error handling
  app.use(createErrorHandler());
  app.use(create404Handler());
}

// HTTP Server
const server = createServer(app);

/**
 * Start the API server
 * @param {number} port - Port to listen on
 * @returns {Promise<Server>} HTTP server instance
 */
export async function startServer(port = PORT) {
  await initializeDigitalTwin();
  mountRoutes();

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║     NAC Digital Twin REST API Server                         ║
║     Northampton County Government                            ║
╠══════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${port}                   ║
║  API Base URL: http://localhost:${port}/api                    ║
║                                                              ║
║  Routes:                                                     ║
║    /api/units        - Production units (Row Officers)       ║
║    /api/workflows    - Workflow management                   ║
║    /api/transactions - Fee schedules & calculations          ║
║    /api/workitems    - Work item management                  ║
║    /api/metrics      - County-wide metrics                   ║
║    /api/health       - Health check                          ║
╚══════════════════════════════════════════════════════════════╝
      `);
      resolve(server);
    });
  });
}

// Auto-start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export { app, server };
export default app;
