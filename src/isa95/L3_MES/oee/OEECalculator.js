/**
 * OEE Calculator - Overall Equipment Effectiveness for Government Operations
 *
 * Adapts the manufacturing OEE framework to measure county office efficiency:
 * - Availability: Office operational time vs scheduled time
 * - Performance: Actual throughput vs theoretical capacity
 * - Quality: First-pass success rate (work completed without rework)
 *
 * OEE = Availability × Performance × Quality
 *
 * Based on Seiichi Nakajima's TPM methodology (1982) adapted for services.
 *
 * @module L3_MES/oee/OEECalculator
 * @see https://www.oee.com/calculating-oee/
 * @see https://www.leanproduction.com/oee/
 */

/**
 * OEE Rating thresholds based on industry benchmarks
 */
export const OEERating = {
  WORLD_CLASS: 0.85,    // 85%+ is world-class
  GOOD: 0.75,           // 75-85% is good
  ACCEPTABLE: 0.65,     // 65-75% is acceptable/average
  POOR: 0.50,           // 50-65% needs improvement
  CRITICAL: 0.0         // Below 50% is critical
};

/**
 * Get rating label for an OEE score
 * @param {number} oee - OEE score (0-1)
 * @returns {string} Rating label
 */
export function getOEERating(oee) {
  if (oee >= OEERating.WORLD_CLASS) return 'World Class';
  if (oee >= OEERating.GOOD) return 'Good';
  if (oee >= OEERating.ACCEPTABLE) return 'Acceptable';
  if (oee >= OEERating.POOR) return 'Needs Improvement';
  return 'Critical';
}

/**
 * Get rating color for visualization
 * @param {number} oee - OEE score (0-1)
 * @returns {string} Color code
 */
export function getOEEColor(oee) {
  if (oee >= OEERating.WORLD_CLASS) return '#22c55e';  // green
  if (oee >= OEERating.GOOD) return '#84cc16';         // lime
  if (oee >= OEERating.ACCEPTABLE) return '#eab308';   // yellow
  if (oee >= OEERating.POOR) return '#f97316';         // orange
  return '#ef4444';                                     // red
}

/**
 * OEE Component scores
 */
export class OEEScore {
  constructor(availability, performance, quality) {
    this.availability = Math.min(1, Math.max(0, availability));
    this.performance = Math.min(1, Math.max(0, performance));
    this.quality = Math.min(1, Math.max(0, quality));
    this.oee = this.availability * this.performance * this.quality;
    this.rating = getOEERating(this.oee);
    this.color = getOEEColor(this.oee);
    this.timestamp = new Date().toISOString();
  }

  /**
   * Get the weakest component (bottleneck)
   */
  getBottleneck() {
    const components = [
      { name: 'Availability', value: this.availability },
      { name: 'Performance', value: this.performance },
      { name: 'Quality', value: this.quality }
    ];
    return components.reduce((min, c) => c.value < min.value ? c : min);
  }

  /**
   * Get improvement recommendations
   */
  getRecommendations() {
    const recommendations = [];
    const bottleneck = this.getBottleneck();

    if (this.availability < OEERating.GOOD) {
      recommendations.push({
        component: 'Availability',
        issue: 'Office availability below target',
        actions: [
          'Review staffing schedules for coverage gaps',
          'Implement cross-training for backup coverage',
          'Analyze system downtime patterns',
          'Consider extended service hours'
        ]
      });
    }

    if (this.performance < OEERating.GOOD) {
      recommendations.push({
        component: 'Performance',
        issue: 'Processing speed below capacity',
        actions: [
          'Identify bottleneck processes',
          'Streamline document workflows',
          'Upgrade outdated systems',
          'Review staff training needs'
        ]
      });
    }

    if (this.quality < OEERating.GOOD) {
      recommendations.push({
        component: 'Quality',
        issue: 'High rework/correction rate',
        actions: [
          'Implement quality checkpoints',
          'Standardize procedures',
          'Improve data entry validation',
          'Enhance staff training on regulations'
        ]
      });
    }

    return recommendations;
  }

  toJSON() {
    return {
      oee: Math.round(this.oee * 1000) / 10,  // percentage with 1 decimal
      availability: Math.round(this.availability * 1000) / 10,
      performance: Math.round(this.performance * 1000) / 10,
      quality: Math.round(this.quality * 1000) / 10,
      rating: this.rating,
      color: this.color,
      bottleneck: this.getBottleneck(),
      timestamp: this.timestamp
    };
  }
}

/**
 * OEE Calculator for government offices
 */
export class OEECalculator {
  constructor(config = {}) {
    this.config = {
      scheduledHoursPerDay: config.scheduledHoursPerDay || 8,
      workingDaysPerWeek: config.workingDaysPerWeek || 5,
      targetCycleTimeMinutes: config.targetCycleTimeMinutes || 15, // target time per transaction
      ...config
    };
  }

  /**
   * Calculate Availability
   * Availability = Run Time / Planned Production Time
   *
   * For government: Actual service hours / Scheduled hours
   *
   * @param {Object} data - Availability data
   * @param {number} data.scheduledMinutes - Total scheduled operating minutes
   * @param {number} data.actualMinutes - Actual operating minutes
   * @param {number} data.plannedDowntime - Planned closures, meetings (minutes)
   * @param {number} data.unplannedDowntime - System outages, absences (minutes)
   * @returns {number} Availability ratio (0-1)
   */
  calculateAvailability(data) {
    const {
      scheduledMinutes,
      actualMinutes,
      plannedDowntime = 0,
      unplannedDowntime = 0
    } = data;

    if (scheduledMinutes <= 0) return 0;

    // Net available time = scheduled - planned stops
    const plannedTime = scheduledMinutes - plannedDowntime;
    if (plannedTime <= 0) return 0;

    // Run time = actual operating time (already accounts for unplanned)
    const runTime = actualMinutes || (plannedTime - unplannedDowntime);

    return Math.min(1, runTime / plannedTime);
  }

  /**
   * Calculate Performance
   * Performance = (Ideal Cycle Time × Total Count) / Run Time
   *
   * For government: Actual throughput vs theoretical capacity
   *
   * @param {Object} data - Performance data
   * @param {number} data.itemsProcessed - Total items/transactions processed
   * @param {number} data.runTimeMinutes - Actual operating time in minutes
   * @param {number} data.idealCycleTimeMinutes - Target time per item (optional)
   * @returns {number} Performance ratio (0-1)
   */
  calculatePerformance(data) {
    const {
      itemsProcessed,
      runTimeMinutes,
      idealCycleTimeMinutes = this.config.targetCycleTimeMinutes
    } = data;

    if (runTimeMinutes <= 0 || idealCycleTimeMinutes <= 0) return 0;

    // Theoretical max items = run time / ideal cycle time
    const theoreticalMax = runTimeMinutes / idealCycleTimeMinutes;

    return Math.min(1, itemsProcessed / theoreticalMax);
  }

  /**
   * Calculate Quality
   * Quality = Good Count / Total Count
   *
   * For government: First-pass yield (completed correctly first time)
   *
   * @param {Object} data - Quality data
   * @param {number} data.totalItems - Total items processed
   * @param {number} data.goodItems - Items completed correctly first time
   * @param {number} data.reworkItems - Items requiring corrections (optional)
   * @param {number} data.rejectedItems - Items rejected/returned (optional)
   * @returns {number} Quality ratio (0-1)
   */
  calculateQuality(data) {
    const {
      totalItems,
      goodItems,
      reworkItems = 0,
      rejectedItems = 0
    } = data;

    if (totalItems <= 0) return 0;

    // Good items = total - rework - rejected (if goodItems not provided)
    const actualGood = goodItems ?? (totalItems - reworkItems - rejectedItems);

    return Math.min(1, actualGood / totalItems);
  }

  /**
   * Calculate complete OEE score
   * @param {Object} data - Complete OEE data
   * @returns {OEEScore} OEE score with all components
   */
  calculate(data) {
    const availability = this.calculateAvailability({
      scheduledMinutes: data.scheduledMinutes,
      actualMinutes: data.actualMinutes,
      plannedDowntime: data.plannedDowntime,
      unplannedDowntime: data.unplannedDowntime
    });

    const performance = this.calculatePerformance({
      itemsProcessed: data.itemsProcessed,
      runTimeMinutes: data.actualMinutes || (data.scheduledMinutes - (data.plannedDowntime || 0) - (data.unplannedDowntime || 0)),
      idealCycleTimeMinutes: data.idealCycleTimeMinutes
    });

    const quality = this.calculateQuality({
      totalItems: data.itemsProcessed,
      goodItems: data.goodItems,
      reworkItems: data.reworkItems,
      rejectedItems: data.rejectedItems
    });

    return new OEEScore(availability, performance, quality);
  }

  /**
   * Calculate OEE from production unit metrics
   * @param {Object} unitStatus - Production unit status from getStatus()
   * @param {Object} periodData - Period-specific data
   * @returns {OEEScore}
   */
  calculateFromUnit(unitStatus, periodData = {}) {
    // Extract metrics from unit status
    const processed = unitStatus.totalItemsProcessed || 0;
    const activeItems = unitStatus.lines?.reduce((sum, line) => {
      return sum + (line.inputQueueLength || 0) +
        line.stations?.reduce((s, st) => s + (st.currentLoad || 0), 0);
    }, 0) || 0;

    // Default period: 8 hour day
    const scheduledMinutes = periodData.scheduledMinutes || 480;
    const actualMinutes = periodData.actualMinutes || scheduledMinutes * 0.9;

    // Estimate quality from unit type benchmarks
    const qualityRate = periodData.qualityRate || 0.95;

    return this.calculate({
      scheduledMinutes,
      actualMinutes,
      plannedDowntime: periodData.plannedDowntime || 30,
      unplannedDowntime: periodData.unplannedDowntime || 0,
      itemsProcessed: processed,
      idealCycleTimeMinutes: periodData.idealCycleTimeMinutes || this.config.targetCycleTimeMinutes,
      goodItems: Math.floor(processed * qualityRate),
      reworkItems: Math.floor(processed * (1 - qualityRate))
    });
  }
}

export default OEECalculator;
