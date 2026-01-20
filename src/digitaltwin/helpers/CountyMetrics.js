/**
 * CountyMetrics - Aggregates metrics across all production units
 *
 * Tracks county-wide statistics for dashboard display including
 * total items processed, active work items, and per-unit status.
 *
 * @module digitaltwin/helpers/CountyMetrics
 */

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

export default CountyMetrics;
