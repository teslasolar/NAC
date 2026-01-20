/**
 * WorkItem - Represents a unit of work flowing through the system
 *
 * Models documents, transactions, and other work items that
 * flow through the production process.
 *
 * @module isa88/helpers/WorkItem
 */

/**
 * Work item priority levels
 */
export const Priority = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Work item status values
 */
export const WorkItemStatus = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  HELD: 'held',
  REJECTED: 'rejected'
};

/**
 * Work Item class
 */
export class WorkItem {
  constructor(id, type, data = {}) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.createdAt = new Date().toISOString();
    this.status = WorkItemStatus.QUEUED;
    this.currentStation = null;
    this.history = [];
    this.priority = data.priority || Priority.NORMAL;
    this.dueDate = data.dueDate || null;
  }

  /**
   * Record station entry
   * @param {string} stationId - Station ID
   */
  enterStation(stationId) {
    this.currentStation = stationId;
    this.status = WorkItemStatus.PROCESSING;
    this.history.push({
      action: 'enter',
      station: stationId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Record station exit
   * @param {string} stationId - Station ID
   * @param {string} result - Exit result
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
    this.status = WorkItemStatus.COMPLETED;
    this.completedAt = new Date().toISOString();
  }

  /**
   * Calculate cycle time in milliseconds
   * @returns {number|null} Cycle time or null if not complete
   */
  getCycleTime() {
    if (!this.completedAt) return null;
    return new Date(this.completedAt) - new Date(this.createdAt);
  }

  /**
   * Check if item is overdue
   * @returns {boolean}
   */
  isOverdue() {
    if (!this.dueDate) return false;
    return new Date() > new Date(this.dueDate);
  }

  /**
   * Get time remaining until due
   * @returns {number|null} Milliseconds remaining or null
   */
  getTimeRemaining() {
    if (!this.dueDate) return null;
    return new Date(this.dueDate) - new Date();
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
      historyLength: this.history.length,
      isOverdue: this.isOverdue()
    };
  }
}

export default WorkItem;
