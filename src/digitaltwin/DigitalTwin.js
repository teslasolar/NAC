/**
 * Digital Twin - Northampton County Government Factory Model
 *
 * Orchestrates the entire county government as a production facility where:
 * - The county is the enterprise
 * - Each row officer is a production unit/cell
 * - Their processes are assembly lines
 * - Work items flow through stations
 *
 * Based on ISA-95 enterprise model with ISA-88 batch control
 *
 * @module digitaltwin/DigitalTwin
 */

import { PackMLStateMachine, PackMLState, PackMLMode } from '../isa88/PackML.js';
import { WorkItem } from '../isa88/ProductionUnit.js';

// Import all officer units
import { createSheriffUnit } from './officers/SheriffUnit.js';
import { createTreasurerUnit } from './officers/TreasurerUnit.js';
import { createCoronerUnit } from './officers/CoronerUnit.js';
import { createDistrictAttorneyUnit } from './officers/DistrictAttorneyUnit.js';
import { createRecorderOfDeedsUnit } from './officers/RecorderOfDeedsUnit.js';
import { createRegisterOfWillsUnit } from './officers/RegisterOfWillsUnit.js';
import { createClerkOfCourtsUnit } from './officers/ClerkOfCourtsUnit.js';
import { createProthonotaryUnit } from './officers/ProthonotaryUnit.js';

/**
 * County metrics for dashboard
 */
export class CountyMetrics {
  constructor() {
    this.totalItemsProcessed = 0;
    this.totalRevenue = 0;
    this.activeWorkItems = 0;
    this.unitStatuses = new Map();
    this.throughputByUnit = new Map();
    this.lastUpdated = new Date().toISOString();
  }

  update(units) {
    this.totalItemsProcessed = 0;
    this.activeWorkItems = 0;

    for (const [unitId, unit] of units) {
      const status = unit.getStatus();
      this.unitStatuses.set(unitId, status);
      this.totalItemsProcessed += status.totalItemsProcessed;

      // Count active items across all lines
      for (const line of status.lines) {
        this.activeWorkItems += line.inputQueueLength;
        for (const station of line.stations) {
          this.activeWorkItems += station.currentLoad;
        }
      }
    }

    this.lastUpdated = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      totalItemsProcessed: this.totalItemsProcessed,
      activeWorkItems: this.activeWorkItems,
      unitCount: this.unitStatuses.size,
      lastUpdated: this.lastUpdated,
      units: Object.fromEntries(this.unitStatuses)
    };
  }
}

/**
 * Digital Twin - The County Government Factory
 */
export class DigitalTwin {
  constructor(config = {}) {
    this.id = config.id || 'northampton-county';
    this.name = config.name || 'Northampton County Government';
    this.description = 'Digital twin of county government operations';

    // Enterprise state machine
    this.stateMachine = new PackMLStateMachine('enterprise');

    // Production units (row officers)
    this.units = new Map();

    // Simulation state
    this.simulationTime = 0;
    this.tickInterval = config.tickInterval || 1000; // 1 second default
    this.isRunning = false;
    this.simulationTimer = null;

    // Metrics
    this.metrics = new CountyMetrics();

    // Event listeners
    this.eventListeners = new Map();

    // Initialize with all row officers
    this._initializeUnits();
  }

  /**
   * Initialize all row officer production units
   */
  _initializeUnits() {
    // Create all 8 row officers as production units
    const unitCreators = [
      createSheriffUnit,
      createTreasurerUnit,
      createCoronerUnit,
      createDistrictAttorneyUnit,
      createRecorderOfDeedsUnit,
      createRegisterOfWillsUnit,
      createClerkOfCourtsUnit,
      createProthonotaryUnit
    ];

    for (const createUnit of unitCreators) {
      const unit = createUnit();
      this.units.set(unit.id, unit);
    }

    // Position units in a grid layout for 3D visualization
    this._layoutUnits();
  }

  /**
   * Layout units in a 3D grid for visualization
   */
  _layoutUnits() {
    const unitsArray = Array.from(this.units.values());
    const cols = 4;
    const spacing = { x: 80, z: 60 };

    unitsArray.forEach((unit, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      unit.position = {
        x: col * spacing.x,
        y: 0,
        z: row * spacing.z
      };
    });
  }

  /**
   * Get a specific unit
   */
  getUnit(unitId) {
    return this.units.get(unitId);
  }

  /**
   * Get all units
   */
  getAllUnits() {
    return Array.from(this.units.values());
  }

  /**
   * Initialize the digital twin (move to IDLE)
   */
  initialize() {
    // Initialize enterprise
    if (this.stateMachine.getState() === PackMLState.STOPPED) {
      this.stateMachine.reset('Initializing county operations');
      this.stateMachine.completeActingState();
    }

    // Initialize all units
    for (const unit of this.units.values()) {
      unit.initialize();
    }

    this._emit('initialized', { timestamp: new Date().toISOString() });
    return this;
  }

  /**
   * Start the digital twin simulation
   */
  start() {
    if (this.isRunning) return this;

    // Start enterprise
    if (this.stateMachine.getState() === PackMLState.IDLE) {
      this.stateMachine.start('Starting county operations');
      this.stateMachine.completeActingState();
    }

    // Start all units
    for (const unit of this.units.values()) {
      unit.start();
    }

    this.isRunning = true;
    this._emit('started', { timestamp: new Date().toISOString() });

    return this;
  }

  /**
   * Stop the simulation
   */
  stop() {
    if (!this.isRunning) return this;

    this.isRunning = false;

    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }

    // Stop all units
    for (const unit of this.units.values()) {
      unit.stop('Simulation stopped');
    }

    this.stateMachine.stop('County operations stopped');
    this.stateMachine.completeActingState();

    this._emit('stopped', { timestamp: new Date().toISOString() });
    return this;
  }

  /**
   * Run one simulation tick
   */
  tick(deltaTime = null) {
    const dt = deltaTime || this.tickInterval;
    this.simulationTime += dt;

    const results = {};

    // Tick each unit
    for (const [unitId, unit] of this.units) {
      results[unitId] = unit.tick(dt);
    }

    // Update metrics
    this.metrics.update(this.units);

    this._emit('tick', {
      simulationTime: this.simulationTime,
      deltaTime: dt,
      metrics: this.metrics.toJSON()
    });

    return results;
  }

  /**
   * Run continuous simulation
   */
  runSimulation(intervalMs = 1000) {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
    }

    this.tickInterval = intervalMs;
    this.simulationTimer = setInterval(() => {
      if (this.isRunning) {
        this.tick();
      }
    }, intervalMs);

    return this;
  }

  /**
   * Submit work to a specific unit and line
   */
  submitWork(unitId, lineId, workItem) {
    const unit = this.units.get(unitId);
    if (!unit) {
      throw new Error(`Unit ${unitId} not found`);
    }

    const result = unit.submit(lineId, workItem);
    this._emit('workSubmitted', {
      unitId,
      lineId,
      workItemId: workItem.id,
      timestamp: new Date().toISOString()
    });

    return result;
  }

  /**
   * Get comprehensive status
   */
  getStatus() {
    const units = {};
    for (const [id, unit] of this.units) {
      units[id] = unit.getStatus();
    }

    return {
      id: this.id,
      name: this.name,
      state: this.stateMachine.getState(),
      mode: this.stateMachine.getMode(),
      isRunning: this.isRunning,
      simulationTime: this.simulationTime,
      metrics: this.metrics.toJSON(),
      units
    };
  }

  /**
   * Get 3D scene data for visualization
   */
  getSceneData() {
    const scene = {
      enterprise: {
        id: this.id,
        name: this.name,
        state: this.stateMachine.getState(),
        bounds: { width: 400, height: 50, depth: 200 }
      },
      units: [],
      connections: []
    };

    for (const unit of this.units.values()) {
      const unitData = {
        id: unit.id,
        name: unit.name,
        position: unit.position,
        dimensions: unit.dimensions,
        state: unit.stateMachine.getState(),
        lines: []
      };

      for (const [lineId, line] of unit.assemblyLines) {
        const lineData = {
          id: line.id,
          name: line.name,
          layout: line.layout,
          stations: line.stations.map(station => ({
            id: station.id,
            name: station.name,
            position: station.position,
            dimensions: station.dimensions,
            state: station.stateMachine.getState(),
            utilization: station.getUtilization(),
            currentLoad: station.currentItems.length,
            capacity: station.capacity
          }))
        };
        unitData.lines.push(lineData);
      }

      scene.units.push(unitData);
    }

    // Add inter-unit connections (e.g., Sheriff -> Treasurer for fee deposits)
    scene.connections = this._getUnitConnections();

    return scene;
  }

  /**
   * Get connections between units (workflow dependencies)
   */
  _getUnitConnections() {
    // Define the financial flow: fees/funds -> Treasurer
    return [
      { from: 'sheriff', to: 'treasurer', type: 'fee-deposit', label: 'Fee Collection' },
      { from: 'coroner', to: 'treasurer', type: 'fee-deposit', label: 'Permit Fees' },
      { from: 'clerk-of-courts', to: 'treasurer', type: 'fee-deposit', label: 'Court Fees' },
      { from: 'prothonotary', to: 'treasurer', type: 'fee-deposit', label: 'Filing Fees' },
      { from: 'recorder-of-deeds', to: 'treasurer', type: 'fee-deposit', label: 'Recording Fees' },
      { from: 'register-of-wills', to: 'treasurer', type: 'fee-deposit', label: 'Probate Fees' },
      // Criminal justice flow
      { from: 'sheriff', to: 'district-attorney', type: 'case-referral', label: 'Arrests' },
      { from: 'district-attorney', to: 'clerk-of-courts', type: 'case-filing', label: 'Criminal Cases' },
      { from: 'district-attorney', to: 'prothonotary', type: 'case-filing', label: 'Civil Matters' },
      // Court documents
      { from: 'prothonotary', to: 'sheriff', type: 'service-request', label: 'Writs' },
      { from: 'clerk-of-courts', to: 'sheriff', type: 'service-request', label: 'Subpoenas' },
      // Death investigations
      { from: 'coroner', to: 'district-attorney', type: 'referral', label: 'Suspicious Deaths' },
      // Property records
      { from: 'sheriff', to: 'recorder-of-deeds', type: 'deed-recording', label: 'Sheriff Deeds' },
      // Estate matters
      { from: 'register-of-wills', to: 'prothonotary', type: 'judgment', label: 'Estate Judgments' }
    ];
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
    return this;
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  /**
   * Emit event
   */
  _emit(event, data) {
    if (this.eventListeners.has(event)) {
      for (const callback of this.eventListeners.get(event)) {
        try {
          callback(data);
        } catch (e) {
          console.error(`Event listener error for ${event}:`, e);
        }
      }
    }
  }

  /**
   * Generate sample workload for simulation
   */
  generateSampleWorkload() {
    const now = Date.now();

    // Sheriff: Process service
    this.submitWork('sheriff', 'process-service', new WorkItem(
      `writ-${now}-1`,
      'writ_received',
      { writType: 'summons', defendant: 'Sample Defendant', address: '123 Main St' }
    ));

    // Treasurer: Cash receipt
    this.submitWork('treasurer', 'cash-receipts', new WorkItem(
      `receipt-${now}-1`,
      'receipt_incoming',
      { source: 'Sheriff', amount: 150.00, fund: 'General' }
    ));

    // Recorder: Deed recording
    this.submitWork('recorder-of-deeds', 'recording', new WorkItem(
      `deed-${now}-1`,
      'doc_submitted',
      { docType: 'deed', grantor: 'Seller', grantee: 'Buyer', consideration: 250000 }
    ));

    // Register of Wills: Marriage license
    this.submitWork('register-of-wills', 'marriage-licenses', new WorkItem(
      `marriage-${now}-1`,
      'license_application',
      { applicant1: 'Person A', applicant2: 'Person B' }
    ));

    // DA: Case referral
    this.submitWork('district-attorney', 'prosecution', new WorkItem(
      `case-${now}-1`,
      'case_referred',
      { defendant: 'Accused Person', charges: ['Theft'], agency: 'Police' }
    ));

    return this;
  }

  toJSON() {
    return this.getStatus();
  }
}

/**
 * Create a new Digital Twin instance
 */
export function createDigitalTwin(config) {
  return new DigitalTwin(config);
}

export default DigitalTwin;
