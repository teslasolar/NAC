/**
 * ProductionUnit - Base class for county officer production cells
 *
 * Models each row officer as a manufacturing production unit with:
 * - Assembly lines (major process flows)
 * - Work stations (individual process steps)
 * - Input/output queues
 * - Capacity and throughput metrics
 *
 * @module isa88/ProductionUnit
 */

import { PackMLStateMachine, PackMLState } from './PackML.js';

// Re-export helpers for backward compatibility
export { WorkItem, Priority, WorkItemStatus } from './helpers/WorkItem.js';
export { WorkStation, DEFAULT_STATION_CONFIG } from './helpers/WorkStation.js';
export { AssemblyLine, LineLayout } from './helpers/AssemblyLine.js';

/**
 * Default unit configuration
 */
export const DEFAULT_UNIT_CONFIG = {
  type: 'row_officer',
  staffing: { fte: 1, positions: [] },
  operatingHours: { start: 8, end: 17 },
  position: { x: 0, y: 0, z: 0 },
  dimensions: { width: 20, height: 5, depth: 15 }
};

/**
 * ProductionUnit - Represents a row officer's complete production cell
 */
export class ProductionUnit {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type || DEFAULT_UNIT_CONFIG.type;
    this.authority = config.authority || '';
    this.description = config.description || '';

    // Assembly lines (multiple process types)
    this.assemblyLines = new Map();

    // State machine for the entire unit
    this.stateMachine = new PackMLStateMachine(`unit-${this.id}`);

    // Capacity and resources
    this.staffing = config.staffing || DEFAULT_UNIT_CONFIG.staffing;
    this.operatingHours = config.operatingHours || DEFAULT_UNIT_CONFIG.operatingHours;

    // 3D positioning for the unit
    this.position = config.position || DEFAULT_UNIT_CONFIG.position;
    this.dimensions = config.dimensions || DEFAULT_UNIT_CONFIG.dimensions;

    // Metrics
    this.metrics = {
      totalItemsProcessed: 0,
      totalRevenue: 0,
      totalErrors: 0,
      uptime: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Add an assembly line to this unit
   * @param {AssemblyLine} line - Line to add
   * @returns {ProductionUnit}
   */
  addLine(line) {
    line.basePosition = {
      x: this.position.x + (this.assemblyLines.size * 25),
      y: this.position.y,
      z: this.position.z
    };
    line._updatePositions();
    this.assemblyLines.set(line.id, line);
    return this;
  }

  /**
   * Get assembly line by ID
   * @param {string} lineId - Line ID
   * @returns {AssemblyLine|undefined}
   */
  getLine(lineId) {
    return this.assemblyLines.get(lineId);
  }

  /**
   * Get all lines
   * @returns {AssemblyLine[]}
   */
  getLines() {
    return Array.from(this.assemblyLines.values());
  }

  /**
   * Submit work to a specific line
   * @param {string} lineId - Target line ID
   * @param {WorkItem} workItem - Item to submit
   * @returns {WorkItem}
   */
  submit(lineId, workItem) {
    const line = this.assemblyLines.get(lineId);
    if (!line) {
      throw new Error(`Line ${lineId} not found in unit ${this.id}`);
    }
    return line.submit(workItem);
  }

  /**
   * Process one simulation tick across all lines
   * @param {number} deltaTime - Time elapsed in ms
   * @returns {Object} Results by line ID
   */
  tick(deltaTime = 1000) {
    const results = {};
    for (const [lineId, line] of this.assemblyLines) {
      results[lineId] = line.tick(deltaTime);
    }
    this._updateMetrics();
    return results;
  }

  /**
   * Update unit metrics
   * @private
   */
  _updateMetrics() {
    this.metrics.totalItemsProcessed = this.getLines()
      .reduce((sum, line) => sum + line.itemsCompleted, 0);
    this.metrics.lastUpdated = new Date().toISOString();
  }

  /**
   * Get unit status summary
   * @returns {Object}
   */
  getStatus() {
    const lines = this.getLines();
    return {
      id: this.id,
      name: this.name,
      state: this.stateMachine.getState(),
      mode: this.stateMachine.getMode(),
      lineCount: lines.length,
      totalStations: lines.reduce((sum, l) => sum + l.stations.length, 0),
      totalItemsProcessed: this.metrics.totalItemsProcessed,
      position: this.position,
      lines: lines.map(l => l.toJSON())
    };
  }

  /**
   * Get metrics summary
   * @returns {Object}
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Initialize the unit (move to IDLE state)
   * @returns {ProductionUnit}
   */
  initialize() {
    if (this.stateMachine.getState() === PackMLState.STOPPED) {
      this.stateMachine.reset('Initializing unit');
      this.stateMachine.completeActingState();
    }
    return this;
  }

  /**
   * Start production
   * @returns {ProductionUnit}
   */
  start() {
    if (this.stateMachine.getState() === PackMLState.IDLE) {
      this.stateMachine.start('Starting production');
      this.stateMachine.completeActingState();
    }
    return this;
  }

  /**
   * Stop production
   * @param {string} reason - Stop reason
   * @returns {ProductionUnit}
   */
  stop(reason = 'Production stopped') {
    this.stateMachine.stop(reason);
    this.stateMachine.completeActingState();
    return this;
  }

  /**
   * Hold production
   * @param {string} reason - Hold reason
   * @returns {ProductionUnit}
   */
  hold(reason = 'Production held') {
    this.stateMachine.hold(reason);
    return this;
  }

  /**
   * Resume from hold
   * @returns {ProductionUnit}
   */
  resume() {
    this.stateMachine.unhold('Resuming');
    this.stateMachine.completeActingState();
    return this;
  }

  toJSON() {
    return this.getStatus();
  }
}

export default ProductionUnit;
