/**
 * OEE Assessment Service - Assess efficiency of county offices
 *
 * Provides real-time and historical OEE assessment for all row officer
 * production units in the digital twin.
 *
 * @module L3_MES/oee/OEEAssessment
 */

import { OEECalculator, OEEScore } from './OEECalculator.js';
import { LossTracker, LossCategory } from './SixBigLosses.js';
import {
  OfficeBenchmarks,
  compareToBenchmark,
  generateReportCard
} from './OfficeBenchmarks.js';

/**
 * Assessment period types
 */
export const AssessmentPeriod = {
  SHIFT: 'shift',       // 8-hour shift
  DAY: 'day',           // Full day
  WEEK: 'week',         // 5-day work week
  MONTH: 'month',       // Calendar month
  QUARTER: 'quarter',   // Fiscal quarter
  YEAR: 'year'          // Fiscal year
};

/**
 * Period durations in minutes
 */
const PeriodMinutes = {
  [AssessmentPeriod.SHIFT]: 480,
  [AssessmentPeriod.DAY]: 480,
  [AssessmentPeriod.WEEK]: 2400,
  [AssessmentPeriod.MONTH]: 10560,
  [AssessmentPeriod.QUARTER]: 31680,
  [AssessmentPeriod.YEAR]: 126720
};

/**
 * OEE Assessment for a single office
 */
export class OfficeAssessment {
  constructor(officeId, calculator = null) {
    this.officeId = officeId;
    this.calculator = calculator || new OEECalculator();
    this.lossTracker = new LossTracker(officeId);
    this.benchmark = OfficeBenchmarks[officeId];
    this.history = [];
    this.currentScore = null;
  }

  /**
   * Calculate OEE from operational data
   * @param {Object} data - Operational metrics
   * @returns {OEEScore}
   */
  assess(data) {
    const score = this.calculator.calculate({
      scheduledMinutes: data.scheduledMinutes || 480,
      actualMinutes: data.actualMinutes,
      plannedDowntime: data.plannedDowntime || 0,
      unplannedDowntime: data.unplannedDowntime || 0,
      itemsProcessed: data.itemsProcessed || 0,
      idealCycleTimeMinutes: this.benchmark?.cycleTimeMinutes?.[data.processType] ||
        data.idealCycleTimeMinutes || 15,
      goodItems: data.goodItems,
      reworkItems: data.reworkItems || 0,
      rejectedItems: data.rejectedItems || 0
    });

    this.currentScore = score;
    this.history.push({
      timestamp: new Date().toISOString(),
      score: score.toJSON(),
      period: data.period || AssessmentPeriod.SHIFT
    });

    // Trim history to last 90 days
    const cutoff = Date.now() - (90 * 24 * 60 * 60 * 1000);
    this.history = this.history.filter(h =>
      new Date(h.timestamp).getTime() > cutoff
    );

    return score;
  }

  /**
   * Generate assessment from production unit status
   * @param {Object} unitStatus - Status from ProductionUnit.getStatus()
   * @param {Object} options - Assessment options
   * @returns {OEEScore}
   */
  assessFromUnit(unitStatus, options = {}) {
    const period = options.period || AssessmentPeriod.SHIFT;
    const scheduledMinutes = PeriodMinutes[period] || 480;

    // Extract metrics from unit
    const totalProcessed = unitStatus.totalItemsProcessed || 0;

    // Calculate active processing time from lines
    let activeStations = 0;
    let totalCapacity = 0;
    let queueLength = 0;

    for (const line of (unitStatus.lines || [])) {
      queueLength += line.inputQueueLength || 0;
      for (const station of (line.stations || [])) {
        totalCapacity += station.capacity || 1;
        if (station.currentLoad > 0) activeStations++;
      }
    }

    // Estimate availability based on station activity
    const utilizationRate = totalCapacity > 0
      ? activeStations / totalCapacity
      : 0.9;

    // Estimate actual minutes based on utilization
    const actualMinutes = scheduledMinutes * Math.max(0.7, utilizationRate);

    // Quality rate from benchmark or default
    const qualityRate = options.qualityRate ||
      (this.benchmark?.targets?.quality) || 0.95;

    return this.assess({
      scheduledMinutes,
      actualMinutes,
      plannedDowntime: options.plannedDowntime || 30,
      unplannedDowntime: options.unplannedDowntime || 0,
      itemsProcessed: totalProcessed,
      goodItems: Math.floor(totalProcessed * qualityRate),
      reworkItems: Math.floor(totalProcessed * (1 - qualityRate)),
      period
    });
  }

  /**
   * Compare to benchmark
   */
  getBenchmarkComparison() {
    if (!this.currentScore) return null;
    return compareToBenchmark(this.officeId, this.currentScore);
  }

  /**
   * Get trend analysis
   * @param {number} periods - Number of periods to analyze
   */
  getTrend(periods = 10) {
    const recent = this.history.slice(-periods);
    if (recent.length < 2) return { trend: 'insufficient_data' };

    const oeeValues = recent.map(h => h.score.oee);
    const avgOEE = oeeValues.reduce((a, b) => a + b, 0) / oeeValues.length;

    // Calculate trend direction
    const firstHalf = oeeValues.slice(0, Math.floor(oeeValues.length / 2));
    const secondHalf = oeeValues.slice(Math.floor(oeeValues.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const trendDirection = secondAvg > firstAvg ? 'improving' :
      secondAvg < firstAvg ? 'declining' : 'stable';

    return {
      trend: trendDirection,
      averageOEE: avgOEE,
      changePercent: ((secondAvg - firstAvg) / firstAvg) * 100,
      dataPoints: recent.length,
      range: {
        min: Math.min(...oeeValues),
        max: Math.max(...oeeValues)
      }
    };
  }

  toJSON() {
    return {
      officeId: this.officeId,
      officeName: this.benchmark?.name || this.officeId,
      currentScore: this.currentScore?.toJSON(),
      benchmark: this.benchmark ? {
        targetOEE: this.benchmark.targetOEE,
        targets: this.benchmark.targets
      } : null,
      comparison: this.getBenchmarkComparison(),
      trend: this.getTrend(),
      lossesssummary: this.lossTracker.getSummary()
    };
  }
}

/**
 * OEE Assessment Service for all offices
 */
export class OEEAssessmentService {
  constructor() {
    this.assessments = new Map();
    this.calculator = new OEECalculator();

    // Initialize assessments for all offices
    for (const officeId of Object.keys(OfficeBenchmarks)) {
      this.assessments.set(officeId, new OfficeAssessment(officeId, this.calculator));
    }
  }

  /**
   * Get assessment for an office
   */
  getAssessment(officeId) {
    return this.assessments.get(officeId);
  }

  /**
   * Assess all offices from digital twin status
   * @param {Object} digitalTwinStatus - Status from DigitalTwin.getStatus()
   * @param {Object} options - Assessment options
   * @returns {Object} All office assessments
   */
  assessAll(digitalTwinStatus, options = {}) {
    const results = {};

    for (const [unitId, unitStatus] of Object.entries(digitalTwinStatus.units || {})) {
      const assessment = this.assessments.get(unitId);
      if (assessment) {
        assessment.assessFromUnit(unitStatus, options);
        results[unitId] = assessment.toJSON();
      }
    }

    return results;
  }

  /**
   * Generate county-wide report card
   */
  generateReportCard() {
    const scores = {};
    for (const [officeId, assessment] of this.assessments) {
      if (assessment.currentScore) {
        scores[officeId] = assessment.currentScore;
      }
    }
    return generateReportCard(scores);
  }

  /**
   * Get offices needing attention (below target)
   */
  getOfficesNeedingAttention() {
    const needsAttention = [];

    for (const [officeId, assessment] of this.assessments) {
      const comparison = assessment.getBenchmarkComparison();
      if (comparison && !comparison.meetingTarget) {
        needsAttention.push({
          officeId,
          officeName: comparison.officeName,
          actualOEE: comparison.actualOEE,
          targetOEE: comparison.targetOEE,
          gap: Math.abs(comparison.variance),
          gaps: comparison.gaps
        });
      }
    }

    return needsAttention.sort((a, b) => b.gap - a.gap);
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    let totalOEE = 0;
    let count = 0;
    let meetingTargets = 0;

    for (const assessment of this.assessments.values()) {
      if (assessment.currentScore) {
        totalOEE += assessment.currentScore.oee;
        count++;
        const comparison = assessment.getBenchmarkComparison();
        if (comparison?.meetingTarget) meetingTargets++;
      }
    }

    return {
      timestamp: new Date().toISOString(),
      officesAssessed: count,
      averageOEE: count > 0 ? totalOEE / count : 0,
      meetingTargets,
      needsImprovement: count - meetingTargets,
      complianceRate: count > 0 ? meetingTargets / count : 0
    };
  }

  toJSON() {
    return {
      summary: this.getSummary(),
      offices: Object.fromEntries(
        Array.from(this.assessments.entries())
          .map(([id, a]) => [id, a.toJSON()])
      ),
      needingAttention: this.getOfficesNeedingAttention()
    };
  }
}

/**
 * Create OEE Assessment Service
 */
export function createOEEAssessmentService() {
  return new OEEAssessmentService();
}

export default OEEAssessmentService;
