/**
 * L3 Tag Provider - Operations Tags
 *
 * Provides tag access for operations-level data:
 * - Row officer production units
 * - Assembly line status
 * - Work-in-progress tracking
 * - OEE metrics
 * - Throughput and cycle times
 *
 * @module isa95/L3_Operations/tags
 */

export class L3TagProvider {
  constructor() {
    this.cache = new Map();
    this.subscriptions = new Map();
    this.prefix = 'L3';
    this.units = new Map(); // Production units (row officers)
  }

  /**
   * Row officer unit IDs
   */
  static UNITS = {
    SHERIFF: 'Sheriff',
    TREASURER: 'Treasurer',
    CORONER: 'Coroner',
    DISTRICT_ATTORNEY: 'DistrictAttorney',
    RECORDER_OF_DEEDS: 'RecorderOfDeeds',
    REGISTER_OF_WILLS: 'RegisterOfWills',
    CLERK_OF_COURTS: 'ClerkOfCourts',
    PROTHONOTARY: 'Prothonotary'
  };

  /**
   * Tag path builders for units
   */
  static unitTag(unit, ...path) {
    return `L3.Units.${unit}.${path.join('.')}`;
  }

  /**
   * Common tag suffixes for units
   */
  static UNIT_TAGS = {
    STATUS: 'Status',
    STATE: 'State',
    MODE: 'Mode',
    BACKLOG: 'Backlog',
    THROUGHPUT: 'Throughput',
    CYCLE_TIME: 'CycleTime',
    OEE: 'OEE',
    AVAILABILITY: 'Availability',
    PERFORMANCE: 'Performance',
    QUALITY: 'Quality',
    ITEMS_PROCESSED: 'ItemsProcessed',
    ITEMS_IN_PROGRESS: 'ItemsInProgress',
    STAFF_COUNT: 'StaffCount',
    STAFF_AVAILABLE: 'StaffAvailable'
  };

  /**
   * Global L3 tags
   */
  static TAGS = {
    TOTAL_UNITS: 'L3.TotalUnits',
    UNITS_RUNNING: 'L3.UnitsRunning',
    UNITS_IDLE: 'L3.UnitsIdle',
    TOTAL_BACKLOG: 'L3.TotalBacklog',
    TOTAL_THROUGHPUT: 'L3.TotalThroughput',
    AVERAGE_OEE: 'L3.AverageOEE',
    TOTAL_STAFF: 'L3.TotalStaff'
  };

  get(tagPath) {
    return this.cache.get(tagPath);
  }

  set(tagPath, value) {
    const oldValue = this.cache.get(tagPath);
    this.cache.set(tagPath, value);
    this._notifySubscribers(tagPath, value, oldValue);
  }

  subscribe(tagPath, callback) {
    if (!this.subscriptions.has(tagPath)) {
      this.subscriptions.set(tagPath, new Set());
    }
    this.subscriptions.get(tagPath).add(callback);

    if (this.cache.has(tagPath)) {
      callback(this.cache.get(tagPath), undefined);
    }

    return () => this.subscriptions.get(tagPath).delete(callback);
  }

  /**
   * Initialize a production unit
   * @param {string} unitId - Unit ID from UNITS
   * @param {object} config - Unit configuration
   */
  initializeUnit(unitId, config = {}) {
    const defaults = {
      status: 'ONLINE',
      state: 'IDLE',
      mode: 'PRODUCTION',
      backlog: 0,
      throughput: 0,
      cycleTime: 0,
      oee: 100,
      availability: 100,
      performance: 100,
      quality: 100,
      itemsProcessed: 0,
      itemsInProgress: 0,
      staffCount: 0,
      staffAvailable: 0
    };

    const unitConfig = { ...defaults, ...config };
    this.units.set(unitId, unitConfig);

    // Set tags
    const t = L3TagProvider.UNIT_TAGS;
    this.set(L3TagProvider.unitTag(unitId, t.STATUS), unitConfig.status);
    this.set(L3TagProvider.unitTag(unitId, t.STATE), unitConfig.state);
    this.set(L3TagProvider.unitTag(unitId, t.MODE), unitConfig.mode);
    this.set(L3TagProvider.unitTag(unitId, t.BACKLOG), unitConfig.backlog);
    this.set(L3TagProvider.unitTag(unitId, t.THROUGHPUT), unitConfig.throughput);
    this.set(L3TagProvider.unitTag(unitId, t.CYCLE_TIME), unitConfig.cycleTime);
    this.set(L3TagProvider.unitTag(unitId, t.OEE), unitConfig.oee);
    this.set(L3TagProvider.unitTag(unitId, t.AVAILABILITY), unitConfig.availability);
    this.set(L3TagProvider.unitTag(unitId, t.PERFORMANCE), unitConfig.performance);
    this.set(L3TagProvider.unitTag(unitId, t.QUALITY), unitConfig.quality);
    this.set(L3TagProvider.unitTag(unitId, t.ITEMS_PROCESSED), unitConfig.itemsProcessed);
    this.set(L3TagProvider.unitTag(unitId, t.ITEMS_IN_PROGRESS), unitConfig.itemsInProgress);
    this.set(L3TagProvider.unitTag(unitId, t.STAFF_COUNT), unitConfig.staffCount);
    this.set(L3TagProvider.unitTag(unitId, t.STAFF_AVAILABLE), unitConfig.staffAvailable);

    this._updateGlobalCounters();
  }

  /**
   * Update unit metrics
   */
  updateUnit(unitId, metrics) {
    const unit = this.units.get(unitId);
    if (!unit) return;

    Object.assign(unit, metrics);

    const t = L3TagProvider.UNIT_TAGS;
    for (const [key, value] of Object.entries(metrics)) {
      const tagSuffix = t[key.toUpperCase()];
      if (tagSuffix) {
        this.set(L3TagProvider.unitTag(unitId, tagSuffix), value);
      }
    }

    // Recalculate OEE if components change
    if (metrics.availability || metrics.performance || metrics.quality) {
      const oee = (unit.availability * unit.performance * unit.quality) / 10000;
      unit.oee = oee;
      this.set(L3TagProvider.unitTag(unitId, t.OEE), oee);
    }

    this._updateGlobalCounters();
  }

  /**
   * Get unit status
   */
  getUnit(unitId) {
    return this.units.get(unitId);
  }

  /**
   * Get all units
   */
  getAllUnits() {
    return Array.from(this.units.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }

  /**
   * Initialize all row officer units
   */
  initialize() {
    Object.values(L3TagProvider.UNITS).forEach(unitId => {
      this.initializeUnit(unitId);
    });

    this.set(L3TagProvider.TAGS.TOTAL_UNITS, 8);
    this.set(L3TagProvider.TAGS.UNITS_RUNNING, 0);
    this.set(L3TagProvider.TAGS.UNITS_IDLE, 8);
    this.set(L3TagProvider.TAGS.TOTAL_BACKLOG, 0);
    this.set(L3TagProvider.TAGS.TOTAL_THROUGHPUT, 0);
    this.set(L3TagProvider.TAGS.AVERAGE_OEE, 100);
    this.set(L3TagProvider.TAGS.TOTAL_STAFF, 0);
  }

  _updateGlobalCounters() {
    const units = Array.from(this.units.values());

    const running = units.filter(u => u.state === 'EXECUTE').length;
    const idle = units.filter(u => u.state === 'IDLE').length;
    const totalBacklog = units.reduce((sum, u) => sum + u.backlog, 0);
    const totalThroughput = units.reduce((sum, u) => sum + u.throughput, 0);
    const avgOee = units.reduce((sum, u) => sum + u.oee, 0) / units.length;
    const totalStaff = units.reduce((sum, u) => sum + u.staffCount, 0);

    this.set(L3TagProvider.TAGS.UNITS_RUNNING, running);
    this.set(L3TagProvider.TAGS.UNITS_IDLE, idle);
    this.set(L3TagProvider.TAGS.TOTAL_BACKLOG, totalBacklog);
    this.set(L3TagProvider.TAGS.TOTAL_THROUGHPUT, totalThroughput);
    this.set(L3TagProvider.TAGS.AVERAGE_OEE, avgOee);
    this.set(L3TagProvider.TAGS.TOTAL_STAFF, totalStaff);
  }

  _notifySubscribers(tagPath, newValue, oldValue) {
    const subs = this.subscriptions.get(tagPath);
    if (subs) {
      subs.forEach(cb => cb(newValue, oldValue));
    }
  }
}

export const l3TagProvider = new L3TagProvider();
l3TagProvider.initialize();

export default l3TagProvider;
