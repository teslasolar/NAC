/**
 * NAC Digital Twin REST API Server
 *
 * Exposes the Northampton County Digital Twin through a REST API.
 * Provides endpoints for:
 * - Production unit status (Row Officers)
 * - Workflow management
 * - Transaction processing
 * - Metrics and reporting
 * - Real-time alerts
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

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize digital twin
let digitalTwin = null;
let configLoader = null;
let workflowEngine = null;
let ruleEngine = null;
let blockchainSigner = null;

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

// =============================================================================
// Health & Status Endpoints
// =============================================================================

/**
 * @api {get} /api/health Health Check
 * @apiName GetHealth
 * @apiGroup System
 * @apiDescription Returns API health status
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    digitalTwin: digitalTwin ? 'initialized' : 'not initialized'
  });
});

/**
 * @api {get} /api/status System Status
 * @apiName GetStatus
 * @apiGroup System
 */
app.get('/api/status', (req, res) => {
  res.json({
    system: 'Northampton County Digital Twin',
    state: digitalTwin?.state || 'unknown',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// =============================================================================
// Production Units (Row Officers) Endpoints
// =============================================================================

/**
 * @api {get} /api/units Get All Production Units
 * @apiName GetUnits
 * @apiGroup Units
 */
app.get('/api/units', (req, res) => {
  try {
    const unitsConfig = configLoader.getConfig('L3', 'productionUnits');
    const units = Object.entries(unitsConfig.units).map(([id, unit]) => ({
      id,
      name: unit.name,
      type: unit.type,
      authority: unit.authority,
      assemblyLines: unit.assemblyLines.length,
      staffing: unit.staffing
    }));

    res.json({
      enterprise: unitsConfig.enterprise,
      count: units.length,
      units
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @api {get} /api/units/:id Get Production Unit by ID
 * @apiName GetUnit
 * @apiGroup Units
 */
app.get('/api/units/:id', (req, res) => {
  try {
    const unit = configLoader.createProductionUnit(req.params.id);
    res.json({
      id: unit.id,
      name: unit.name,
      type: unit.type,
      state: unit.stateMachine.currentState,
      mode: unit.stateMachine.currentMode,
      lines: unit.lines.map(l => ({
        id: l.id,
        name: l.name,
        stations: l.stations.length
      })),
      metrics: unit.getMetrics()
    });
  } catch (error) {
    res.status(404).json({ error: `Unit not found: ${req.params.id}` });
  }
});

/**
 * @api {get} /api/units/:id/state Get Unit State Machine Status
 * @apiName GetUnitState
 * @apiGroup Units
 */
app.get('/api/units/:id/state', (req, res) => {
  try {
    const unit = configLoader.createProductionUnit(req.params.id);
    const sm = unit.stateMachine;

    res.json({
      unitId: req.params.id,
      currentState: sm.currentState,
      currentMode: sm.currentMode,
      availableTransitions: sm.getAvailableTransitions(),
      stateHistory: sm.stateHistory.slice(-10)
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @api {post} /api/units/:id/command Send Command to Unit
 * @apiName CommandUnit
 * @apiGroup Units
 */
app.post('/api/units/:id/command', (req, res) => {
  try {
    const { command } = req.body;
    const unit = configLoader.createProductionUnit(req.params.id);

    const validCommands = ['start', 'stop', 'hold', 'reset', 'abort', 'clear'];
    if (!validCommands.includes(command)) {
      return res.status(400).json({
        error: `Invalid command. Valid commands: ${validCommands.join(', ')}`
      });
    }

    const previousState = unit.stateMachine.currentState;
    const success = unit.stateMachine[command]?.();

    res.json({
      unitId: req.params.id,
      command,
      success: success !== false,
      previousState,
      currentState: unit.stateMachine.currentState
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// Work Items Endpoints
// =============================================================================

/**
 * @api {get} /api/workitems/types Get Work Item Types
 * @apiName GetWorkItemTypes
 * @apiGroup WorkItems
 */
app.get('/api/workitems/types', (req, res) => {
  try {
    const types = configLoader.getConfig('L0', 'workItemTypes');
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @api {post} /api/workitems Create Work Item
 * @apiName CreateWorkItem
 * @apiGroup WorkItems
 */
app.post('/api/workitems', (req, res) => {
  try {
    const { unitId, typeId, data } = req.body;

    if (!unitId || !typeId) {
      return res.status(400).json({ error: 'unitId and typeId are required' });
    }

    const workItem = configLoader.createWorkItem(unitId, typeId, data);

    // Sign with blockchain
    const signature = blockchainSigner.signTransaction({
      type: 'WORK_ITEM_CREATED',
      workItemId: workItem.id,
      unitId,
      typeId,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      workItem: {
        id: workItem.id,
        type: workItem.type,
        status: workItem.status,
        priority: workItem.priority,
        createdAt: workItem.createdAt
      },
      signature
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =============================================================================
// Workflow Endpoints
// =============================================================================

/**
 * @api {get} /api/workflows Get Available Workflows
 * @apiName GetWorkflows
 * @apiGroup Workflows
 */
app.get('/api/workflows', (req, res) => {
  try {
    const workflowConfig = configLoader.getConfig('L2', 'workflowRules');
    const workflows = Object.entries(workflowConfig.workflows).map(([id, wf]) => ({
      id,
      name: wf.name,
      steps: wf.steps?.length || 0,
      defaultSLA: wf.defaultSLA
    }));

    res.json({ workflows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @api {get} /api/workflows/:id Get Workflow Details
 * @apiName GetWorkflow
 * @apiGroup Workflows
 */
app.get('/api/workflows/:id', (req, res) => {
  try {
    const workflow = configLoader.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: `Workflow not found: ${req.params.id}` });
    }
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @api {post} /api/workflows/:id/instances Start Workflow Instance
 * @apiName StartWorkflow
 * @apiGroup Workflows
 */
app.post('/api/workflows/:id/instances', (req, res) => {
  try {
    const { workItemId, initiator, data } = req.body;

    const instance = workflowEngine.createInstance(req.params.id, {
      workItemId,
      initiator,
      data,
      startedAt: new Date().toISOString()
    });

    res.status(201).json({
      instanceId: instance.id,
      workflowId: req.params.id,
      status: instance.status,
      currentStep: instance.currentStep
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =============================================================================
// Transactions Endpoints
// =============================================================================

/**
 * @api {get} /api/transactions/fees Fee Schedules
 * @apiName GetFeeSchedules
 * @apiGroup Transactions
 */
app.get('/api/transactions/fees', (req, res) => {
  try {
    const fees = configLoader.getConfig('L1', 'feeSchedules');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @api {get} /api/transactions/fees/:officerId Get Officer Fee Schedule
 * @apiName GetOfficerFees
 * @apiGroup Transactions
 */
app.get('/api/transactions/fees/:officerId', (req, res) => {
  try {
    const schedule = configLoader.getFeeSchedule(req.params.officerId);
    if (!schedule) {
      return res.status(404).json({ error: `Fee schedule not found: ${req.params.officerId}` });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @api {post} /api/transactions/calculate Calculate Fee
 * @apiName CalculateFee
 * @apiGroup Transactions
 */
app.post('/api/transactions/calculate', (req, res) => {
  try {
    const { officerId, feeType, params } = req.body;
    const fee = configLoader.calculateFee(officerId, feeType, params);
    res.json(fee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =============================================================================
// Validation Endpoints
// =============================================================================

/**
 * @api {post} /api/validate Validate Data Against Rules
 * @apiName Validate
 * @apiGroup Validation
 */
app.post('/api/validate', (req, res) => {
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
 * @apiName GetRules
 * @apiGroup Validation
 */
app.get('/api/rules', (req, res) => {
  try {
    const rules = configLoader.getConfig('L2', 'businessRules');
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// Metrics & Reporting Endpoints
// =============================================================================

/**
 * @api {get} /api/metrics County-wide Metrics
 * @apiName GetMetrics
 * @apiGroup Metrics
 */
app.get('/api/metrics', (req, res) => {
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
      // Simulated real-time metrics
      realtime: {
        activeWorkItems: Math.floor(Math.random() * 500) + 200,
        processingRate: (Math.random() * 50 + 150).toFixed(1) + '/hour',
        avgCycleTime: (Math.random() * 2 + 1).toFixed(2) + ' days',
        slaCompliance: (Math.random() * 5 + 94).toFixed(1) + '%'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @api {get} /api/metrics/officers Officer Performance Metrics
 * @apiName GetOfficerMetrics
 * @apiGroup Metrics
 */
app.get('/api/metrics/officers', (req, res) => {
  try {
    const officers = [
      'sheriff', 'treasurer', 'coroner', 'district-attorney',
      'recorder-of-deeds', 'register-of-wills', 'clerk-of-courts', 'prothonotary'
    ];

    const metrics = officers.map(id => ({
      id,
      name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      workItemsProcessed: Math.floor(Math.random() * 1000) + 100,
      avgProcessingTime: (Math.random() * 3 + 0.5).toFixed(2) + ' days',
      slaCompliance: (Math.random() * 10 + 90).toFixed(1) + '%',
      activeItems: Math.floor(Math.random() * 100) + 10
    }));

    res.json({ officers: metrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// Policies Endpoints
// =============================================================================

/**
 * @api {get} /api/policies Enterprise Policies
 * @apiName GetPolicies
 * @apiGroup Policies
 */
app.get('/api/policies', (req, res) => {
  try {
    const policies = configLoader.getPolicies();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// Configuration Export
// =============================================================================

/**
 * @api {get} /api/config/export Export All Configuration
 * @apiName ExportConfig
 * @apiGroup Config
 */
app.get('/api/config/export', (req, res) => {
  try {
    const config = configLoader.exportAll();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// Error Handling
// =============================================================================

app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint not found: ${req.method} ${req.path}`,
    availableEndpoints: [
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
    ]
  });
});

// =============================================================================
// Server Startup
// =============================================================================

const server = createServer(app);

export async function startServer(port = PORT) {
  await initializeDigitalTwin();

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
║  Endpoints:                                                  ║
║    GET  /api/health          - Health check                  ║
║    GET  /api/units           - List production units         ║
║    GET  /api/workflows       - List workflows                ║
║    GET  /api/metrics         - County-wide metrics           ║
║    GET  /api/config/export   - Export configuration          ║
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
