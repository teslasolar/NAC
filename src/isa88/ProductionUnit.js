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

import { PackMLStateMachine, PackMLState, PackMLMode } from './PackML.js';

/**
 * Work Item - Represents a unit of work flowing through the system
 */
export class WorkItem {
  constructor(id, type, data = {}) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.createdAt = new Date().toISOString();
    this.status = 'queued';
    this.currentStation = null;
    this.history = [];
    this.priority = data.priority || 'normal'; // low, normal, high, urgent
    this.dueDate = data.dueDate || null;
  }

  /**
   * Record station entry
   */
  enterStation(stationId) {
    this.currentStation = stationId;
    this.status = 'processing';
    this.history.push({
      action: 'enter',
      station: stationId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Record station exit
   */
  exitStation(stationId, result = 'completed') {
    this.history.push({
      action: 'exit',
      station: stationId,
      result,
      timestamp: new Date().toISOString()
    });
    this.currentStation = null;
  }

  /**
   * Mark as complete
   */
  complete() {
    this.status = 'completed';
    this.completedAt = new Date().toISOString();
  }

  /**
   * Calculate cycle time
   */
  getCycleTime() {
    if (!this.completedAt) return null;
    return new Date(this.completedAt) - new Date(this.createdAt);
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      priority: this.priority,
      currentStation: this.currentStation,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
      cycleTimeMs: this.getCycleTime(),
      historyLength: this.history.length
    };
  }
}

/**
 * WorkStation - Individual process step in an assembly line
 */
export class WorkStation {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description || '';
    this.capacity = config.capacity || 1;          // Items that can be processed simultaneously
    this.cycleTime = config.cycleTime || 1000;     // Base processing time in ms
    this.inputTypes = config.inputTypes || [];     // Accepted work item types
    this.outputType = config.outputType || null;   // Output work item type (if transformed)
    this.requiredSkills = config.requiredSkills || [];
    this.equipment = config.equipment || [];

    // Runtime state
    this.stateMachine = new PackMLStateMachine(`station-${this.id}`);
    this.currentItems = [];
    this.processedCount = 0;
    this.totalProcessingTime = 0;
    this.errors = [];

    // 3D positioning
    this.position = config.position || { x: 0, y: 0, z: 0 };
    this.dimensions = config.dimensions || { width: 2, height: 2, depth: 2 };
  }

  /**
   * Check if station can accept work
   */
  canAccept(workItem) {
    if (this.currentItems.length >= this.capacity) return false;
    if (this.inputTypes.length > 0 && !this.inputTypes.includes(workItem.type)) return false;
    if (!this.stateMachine.isWaiting() && this.stateMachine.getState() !== PackMLState.EXECUTE) return false;
    return true;
  }

  /**
   * Accept a work item for processing
   */
  accept(workItem) {
    if (!this.canAccept(workItem)) {
      throw new Error(`Station ${this.id} cannot accept work item ${workItem.id}`);
    }

    workItem.enterStation(this.id);
    this.currentItems.push(workItem);

    // Start processing if in IDLE
    if (this.stateMachine.getState() === PackMLState.IDLE) {
      this.stateMachine.start(`Processing ${workItem.id}`);
      this.stateMachine.completeActingState(); // -> EXECUTE
    }

    return workItem;
  }

  /**
   * Process current items (simulation step)
   */
  process(deltaTime) {
    if (this.stateMachine.getState() !== PackMLState.EXECUTE) return [];

    const completed = [];
    const remaining = [];

    for (const item of this.currentItems) {
      item._processingTime = (item._processingTime || 0) + deltaTime;

      if (item._processingTime >= this.cycleTime) {
        item.exitStation(this.id, 'completed');
        if (this.outputType) {
          item.type = this.outputType;
        }
        this.processedCount++;
        this.totalProcessingTime += item._processingTime;
        delete item._processingTime;
        completed.push(item);
      } else {
        remaining.push(item);
      }
    }

    this.currentItems = remaining;

    // Return to IDLE if no more items
    if (this.currentItems.length === 0 && this.stateMachine.getState() === PackMLState.EXECUTE) {
      this.stateMachine.transition(PackMLState.COMPLETING, 'Batch complete');
      this.stateMachine.completeActingState(); // -> COMPLETE
      this.stateMachine.reset('Ready for next batch');
      this.stateMachine.completeActingState(); // -> IDLE
    }

    return completed;
  }

  /**
   * Get average processing time
   */
  getAverageProcessingTime() {
    if (this.processedCount === 0) return null;
    return this.totalProcessingTime / this.processedCount;
  }

  /**
   * Get utilization rate
   */
  getUtilization() {
    return this.currentItems.length / this.capacity;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      state: this.stateMachine.getState(),
      capacity: this.capacity,
      currentLoad: this.currentItems.length,
      utilization: this.getUtilization(),
      processedCount: this.processedCount,
      avgProcessingTime: this.getAverageProcessingTime(),
      position: this.position
    };
  }
}

/**
 * AssemblyLine - A sequence of work stations forming a process flow
 */
export class AssemblyLine {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description || '';
    this.stations = [];
    this.stationMap = new Map();
    this.inputQueue = [];
    this.outputQueue = [];
    this.stateMachine = new PackMLStateMachine(`line-${this.id}`);

    // Metrics
    this.itemsStarted = 0;
    this.itemsCompleted = 0;

    // 3D layout
    this.layout = config.layout || 'linear'; // linear, u-shape, parallel
    this.basePosition = config.position || { x: 0, y: 0, z: 0 };
  }

  /**
   * Add a station to the line
   */
  addStation(station, afterStationId = null) {
    if (afterStationId) {
      const index = this.stations.findIndex(s => s.id === afterStationId);
      if (index >= 0) {
        this.stations.splice(index + 1, 0, station);
      } else {
        this.stations.push(station);
      }
    } else {
      this.stations.push(station);
    }
    this.stationMap.set(station.id, station);
    this._updatePositions();
    return this;
  }

  /**
   * Update station positions based on layout
   */
  _updatePositions() {
    const spacing = 4;
    this.stations.forEach((station, index) => {
      switch (this.layout) {
        case 'linear':
          station.position = {
            x: this.basePosition.x + (index * spacing),
            y: this.basePosition.y,
            z: this.basePosition.z
          };
          break;
        case 'u-shape':
          const mid = Math.floor(this.stations.length / 2);
          if (index <= mid) {
            station.position = {
              x: this.basePosition.x + (index * spacing),
              y: this.basePosition.y,
              z: this.basePosition.z
            };
          } else {
            station.position = {
              x: this.basePosition.x + ((this.stations.length - index) * spacing),
              y: this.basePosition.y,
              z: this.basePosition.z + spacing
            };
          }
          break;
        case 'parallel':
          station.position = {
            x: this.basePosition.x + (index * spacing),
            y: this.basePosition.y,
            z: this.basePosition.z + ((index % 2) * spacing)
          };
          break;
      }
    });
  }

  /**
   * Get station by ID
   */
  getStation(stationId) {
    return this.stationMap.get(stationId);
  }

  /**
   * Submit work item to the line
   */
  submit(workItem) {
    workItem.history.push({
      action: 'submitted',
      line: this.id,
      timestamp: new Date().toISOString()
    });
    this.inputQueue.push(workItem);
    this.itemsStarted++;
    return workItem;
  }

  /**
   * Process one simulation step
   */
  tick(deltaTime = 1000) {
    // Initialize all stations if needed
    for (const station of this.stations) {
      if (station.stateMachine.getState() === PackMLState.STOPPED) {
        station.stateMachine.reset('Initialize');
        station.stateMachine.completeActingState(); // -> IDLE
      }
    }

    // Move items from input queue to first station
    while (this.inputQueue.length > 0 && this.stations.length > 0) {
      const station = this.stations[0];
      if (station.canAccept(this.inputQueue[0])) {
        station.accept(this.inputQueue.shift());
      } else {
        break;
      }
    }

    // Process each station and move completed items to next
    for (let i = 0; i < this.stations.length; i++) {
      const station = this.stations[i];
      const completed = station.process(deltaTime);

      for (const item of completed) {
        if (i < this.stations.length - 1) {
          // Move to next station
          const nextStation = this.stations[i + 1];
          if (nextStation.canAccept(item)) {
            nextStation.accept(item);
          } else {
            // Buffer between stations (simplified: just queue)
            this.stations[i]._outputBuffer = this.stations[i]._outputBuffer || [];
            this.stations[i]._outputBuffer.push(item);
          }
        } else {
          // Final station - move to output
          item.complete();
          this.outputQueue.push(item);
          this.itemsCompleted++;
        }
      }
    }

    return {
      inputQueueLength: this.inputQueue.length,
      outputQueueLength: this.outputQueue.length,
      stationStates: this.stations.map(s => s.toJSON())
    };
  }

  /**
   * Get throughput (items per hour)
   */
  getThroughput(timeWindowMs = 3600000) {
    // Simplified: based on completed items
    return this.itemsCompleted;
  }

  /**
   * Get line efficiency
   */
  getEfficiency() {
    if (this.itemsStarted === 0) return 0;
    return this.itemsCompleted / this.itemsStarted;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      state: this.stateMachine.getState(),
      layout: this.layout,
      stationCount: this.stations.length,
      inputQueueLength: this.inputQueue.length,
      outputQueueLength: this.outputQueue.length,
      itemsStarted: this.itemsStarted,
      itemsCompleted: this.itemsCompleted,
      efficiency: this.getEfficiency(),
      stations: this.stations.map(s => s.toJSON())
    };
  }
}

/**
 * ProductionUnit - Represents a row officer's complete production cell
 */
export class ProductionUnit {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type || 'row_officer';
    this.authority = config.authority || '';      // PA Code reference
    this.description = config.description || '';

    // Assembly lines (multiple process types)
    this.assemblyLines = new Map();

    // State machine for the entire unit
    this.stateMachine = new PackMLStateMachine(`unit-${this.id}`);

    // Capacity and resources
    this.staffing = config.staffing || { fte: 1, positions: [] };
    this.operatingHours = config.operatingHours || { start: 8, end: 17 };

    // 3D positioning for the unit
    this.position = config.position || { x: 0, y: 0, z: 0 };
    this.dimensions = config.dimensions || { width: 20, height: 5, depth: 15 };

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
   */
  getLine(lineId) {
    return this.assemblyLines.get(lineId);
  }

  /**
   * Submit work to a specific line
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
   */
  tick(deltaTime = 1000) {
    const results = {};
    for (const [lineId, line] of this.assemblyLines) {
      results[lineId] = line.tick(deltaTime);
    }

    // Update metrics
    this.metrics.totalItemsProcessed = Array.from(this.assemblyLines.values())
      .reduce((sum, line) => sum + line.itemsCompleted, 0);
    this.metrics.lastUpdated = new Date().toISOString();

    return results;
  }

  /**
   * Get unit status summary
   */
  getStatus() {
    const lines = Array.from(this.assemblyLines.values());
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
   * Initialize the unit (move to IDLE state)
   */
  initialize() {
    if (this.stateMachine.getState() === PackMLState.STOPPED) {
      this.stateMachine.reset('Initializing unit');
      this.stateMachine.completeActingState(); // -> IDLE
    }
    return this;
  }

  /**
   * Start production
   */
  start() {
    if (this.stateMachine.getState() === PackMLState.IDLE) {
      this.stateMachine.start('Starting production');
      this.stateMachine.completeActingState(); // -> EXECUTE
    }
    return this;
  }

  /**
   * Stop production
   */
  stop(reason = 'Production stopped') {
    this.stateMachine.stop(reason);
    this.stateMachine.completeActingState(); // -> STOPPED
    return this;
  }

  toJSON() {
    return this.getStatus();
  }
}

export default ProductionUnit;
