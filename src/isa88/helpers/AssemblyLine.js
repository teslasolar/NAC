/**
 * AssemblyLine - A sequence of work stations forming a process flow
 *
 * Represents a series of connected stations that process
 * work items from input to output.
 *
 * @module isa88/helpers/AssemblyLine
 */

import { PackMLStateMachine, PackMLState } from '../PackML.js';

/**
 * Line layout types
 */
export const LineLayout = {
  LINEAR: 'linear',
  U_SHAPE: 'u-shape',
  PARALLEL: 'parallel'
};

/**
 * AssemblyLine class
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
    this.layout = config.layout || LineLayout.LINEAR;
    this.basePosition = config.position || { x: 0, y: 0, z: 0 };
  }

  /**
   * Add a station to the line
   * @param {WorkStation} station - Station to add
   * @param {string} afterStationId - Optional: insert after this station
   * @returns {AssemblyLine}
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
   * @private
   */
  _updatePositions() {
    const spacing = 4;
    this.stations.forEach((station, index) => {
      station.position = this._calculatePosition(index, spacing);
    });
  }

  /**
   * Calculate position for a station based on layout
   * @private
   */
  _calculatePosition(index, spacing) {
    switch (this.layout) {
      case LineLayout.U_SHAPE:
        return this._calculateUShapePosition(index, spacing);
      case LineLayout.PARALLEL:
        return this._calculateParallelPosition(index, spacing);
      case LineLayout.LINEAR:
      default:
        return this._calculateLinearPosition(index, spacing);
    }
  }

  _calculateLinearPosition(index, spacing) {
    return {
      x: this.basePosition.x + (index * spacing),
      y: this.basePosition.y,
      z: this.basePosition.z
    };
  }

  _calculateUShapePosition(index, spacing) {
    const mid = Math.floor(this.stations.length / 2);
    if (index <= mid) {
      return {
        x: this.basePosition.x + (index * spacing),
        y: this.basePosition.y,
        z: this.basePosition.z
      };
    } else {
      return {
        x: this.basePosition.x + ((this.stations.length - index) * spacing),
        y: this.basePosition.y,
        z: this.basePosition.z + spacing
      };
    }
  }

  _calculateParallelPosition(index, spacing) {
    return {
      x: this.basePosition.x + (index * spacing),
      y: this.basePosition.y,
      z: this.basePosition.z + ((index % 2) * spacing)
    };
  }

  /**
   * Get station by ID
   * @param {string} stationId - Station ID
   * @returns {WorkStation|undefined}
   */
  getStation(stationId) {
    return this.stationMap.get(stationId);
  }

  /**
   * Submit work item to the line
   * @param {WorkItem} workItem - Item to submit
   * @returns {WorkItem}
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
   * @param {number} deltaTime - Time elapsed in ms
   * @returns {Object} Tick results
   */
  tick(deltaTime = 1000) {
    this._initializeStations();
    this._feedInputQueue();
    this._processStations(deltaTime);

    return {
      inputQueueLength: this.inputQueue.length,
      outputQueueLength: this.outputQueue.length,
      stationStates: this.stations.map(s => s.toJSON())
    };
  }

  /**
   * Initialize stations if needed
   * @private
   */
  _initializeStations() {
    for (const station of this.stations) {
      if (station.stateMachine.getState() === PackMLState.STOPPED) {
        station.stateMachine.reset('Initialize');
        station.stateMachine.completeActingState();
      }
    }
  }

  /**
   * Feed items from input queue to first station
   * @private
   */
  _feedInputQueue() {
    while (this.inputQueue.length > 0 && this.stations.length > 0) {
      const station = this.stations[0];
      if (station.canAccept(this.inputQueue[0])) {
        station.accept(this.inputQueue.shift());
      } else {
        break;
      }
    }
  }

  /**
   * Process all stations and move completed items
   * @private
   */
  _processStations(deltaTime) {
    for (let i = 0; i < this.stations.length; i++) {
      const station = this.stations[i];
      const completed = station.process(deltaTime);

      for (const item of completed) {
        if (i < this.stations.length - 1) {
          this._moveToNextStation(item, i);
        } else {
          this._completeItem(item);
        }
      }
    }
  }

  /**
   * Move item to next station
   * @private
   */
  _moveToNextStation(item, currentIndex) {
    const nextStation = this.stations[currentIndex + 1];
    if (nextStation.canAccept(item)) {
      nextStation.accept(item);
    } else {
      // Buffer between stations
      this.stations[currentIndex]._outputBuffer = this.stations[currentIndex]._outputBuffer || [];
      this.stations[currentIndex]._outputBuffer.push(item);
    }
  }

  /**
   * Complete an item
   * @private
   */
  _completeItem(item) {
    item.complete();
    this.outputQueue.push(item);
    this.itemsCompleted++;
  }

  /**
   * Get throughput
   * @returns {number}
   */
  getThroughput() {
    return this.itemsCompleted;
  }

  /**
   * Get line efficiency
   * @returns {number}
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

export default AssemblyLine;
