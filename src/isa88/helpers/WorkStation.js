/**
 * WorkStation - Individual process step in an assembly line
 *
 * Represents a single processing station with capacity,
 * cycle time, and state machine integration.
 *
 * @module isa88/helpers/WorkStation
 */

import { PackMLStateMachine, PackMLState } from '../PackML.js';

/**
 * Default station configuration
 */
export const DEFAULT_STATION_CONFIG = {
  capacity: 1,
  cycleTime: 1000,
  inputTypes: [],
  outputType: null,
  requiredSkills: [],
  equipment: [],
  position: { x: 0, y: 0, z: 0 },
  dimensions: { width: 2, height: 2, depth: 2 }
};

/**
 * WorkStation class
 */
export class WorkStation {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description || '';
    this.capacity = config.capacity || DEFAULT_STATION_CONFIG.capacity;
    this.cycleTime = config.cycleTime || DEFAULT_STATION_CONFIG.cycleTime;
    this.inputTypes = config.inputTypes || DEFAULT_STATION_CONFIG.inputTypes;
    this.outputType = config.outputType || DEFAULT_STATION_CONFIG.outputType;
    this.requiredSkills = config.requiredSkills || DEFAULT_STATION_CONFIG.requiredSkills;
    this.equipment = config.equipment || DEFAULT_STATION_CONFIG.equipment;

    // Runtime state
    this.stateMachine = new PackMLStateMachine(`station-${this.id}`);
    this.currentItems = [];
    this.processedCount = 0;
    this.totalProcessingTime = 0;
    this.errors = [];

    // 3D positioning
    this.position = config.position || DEFAULT_STATION_CONFIG.position;
    this.dimensions = config.dimensions || DEFAULT_STATION_CONFIG.dimensions;
  }

  /**
   * Check if station can accept work
   * @param {WorkItem} workItem - Item to check
   * @returns {boolean}
   */
  canAccept(workItem) {
    if (this.currentItems.length >= this.capacity) return false;
    if (this.inputTypes.length > 0 && !this.inputTypes.includes(workItem.type)) return false;
    if (!this.stateMachine.isWaiting() && this.stateMachine.getState() !== PackMLState.EXECUTE) return false;
    return true;
  }

  /**
   * Accept a work item for processing
   * @param {WorkItem} workItem - Item to accept
   * @returns {WorkItem}
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
      this.stateMachine.completeActingState();
    }

    return workItem;
  }

  /**
   * Process current items (simulation step)
   * @param {number} deltaTime - Time elapsed in ms
   * @returns {WorkItem[]} Completed items
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
      this.stateMachine.completeActingState();
      this.stateMachine.reset('Ready for next batch');
      this.stateMachine.completeActingState();
    }

    return completed;
  }

  /**
   * Get average processing time
   * @returns {number|null}
   */
  getAverageProcessingTime() {
    if (this.processedCount === 0) return null;
    return this.totalProcessingTime / this.processedCount;
  }

  /**
   * Get utilization rate (0-1)
   * @returns {number}
   */
  getUtilization() {
    return this.currentItems.length / this.capacity;
  }

  /**
   * Get current state
   * @returns {string}
   */
  getState() {
    return this.stateMachine.getState();
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

export default WorkStation;
