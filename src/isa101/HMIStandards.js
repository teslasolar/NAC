/**
 * ISA-101 Human Machine Interface Standards
 * Defines HMI design principles for county government dashboards
 *
 * ISA-101 Core Principles:
 * - Situational Awareness
 * - Appropriate Information Density
 * - Consistent Navigation
 * - Alarm Integration
 * - Performance Monitoring
 */

// ISA-101 Color Palette - High Performance HMI
const HMIColors = {
  // Process States (muted backgrounds)
  NORMAL: '#2d4a3d',        // Dark green-gray - normal operation
  ABNORMAL: '#4a4a2d',      // Dark yellow-gray - attention needed
  ALARM: '#4a2d2d',         // Dark red-gray - alarm active
  INACTIVE: '#3d3d3d',      // Gray - not in service

  // Dynamic Elements (vivid for attention)
  VALUE_NORMAL: '#10b981',  // Green - within limits
  VALUE_HIGH: '#f59e0b',    // Amber - approaching limit
  VALUE_ALARM: '#ef4444',   // Red - out of limits
  VALUE_LOW: '#3b82f6',     // Blue - below normal

  // Navigation
  NAV_PRIMARY: '#1e3a5f',
  NAV_ACTIVE: '#c9a227',
  NAV_HOVER: '#2d4a6f',

  // Text
  TEXT_PRIMARY: '#e2e8f0',
  TEXT_SECONDARY: '#94a3b8',
  TEXT_MUTED: '#64748b',

  // Backgrounds
  BG_L1: '#0f172a',         // Level 1 - Overview
  BG_L2: '#1e293b',         // Level 2 - Area
  BG_L3: '#334155',         // Level 3 - Detail
  BG_L4: '#475569',         // Level 4 - Diagnostic
};

// ISA-101 Display Hierarchy
const DisplayLevel = {
  L1_OVERVIEW: 1,     // Enterprise/County overview - key KPIs only
  L2_AREA: 2,         // Functional area (e.g., all row officers)
  L3_UNIT: 3,         // Single unit detail (e.g., Sheriff accounts)
  L4_DIAGNOSTIC: 4,   // Troubleshooting/raw data
};

// ISA-101 Navigation Model
const NavigationPattern = {
  HIERARCHY: 'hierarchy',   // Drill down L1 -> L2 -> L3 -> L4
  SITUATION: 'situation',   // Jump to alarm source
  SEQUENCE: 'sequence',     // Follow process flow
  DIRECT: 'direct',         // Bookmark/favorite access
};

// Display Element Types
class DisplayElement {
  constructor(id, type, level) {
    this.id = id;
    this.type = type;
    this.level = level;
    this.visible = true;
    this.position = { x: 0, y: 0 };
    this.size = { width: 100, height: 50 };
  }
}

class KPIIndicator extends DisplayElement {
  constructor(id, label, unit, limits) {
    super(id, 'kpi', DisplayLevel.L1_OVERVIEW);
    this.label = label;
    this.unit = unit;
    this.value = null;
    this.limits = limits; // { low, lowLow, high, highHigh }
    this.trend = [];
    this.sparkline = true;
  }

  setValue(val) {
    this.value = val;
    this.trend.push({ ts: Date.now(), val });
    if (this.trend.length > 60) this.trend.shift();
  }

  getStatus() {
    if (!this.limits || this.value === null) return 'normal';
    if (this.value >= this.limits.highHigh || this.value <= this.limits.lowLow) return 'alarm';
    if (this.value >= this.limits.high || this.value <= this.limits.low) return 'warning';
    return 'normal';
  }

  getColor() {
    const status = this.getStatus();
    return {
      normal: HMIColors.VALUE_NORMAL,
      warning: HMIColors.VALUE_HIGH,
      alarm: HMIColors.VALUE_ALARM,
    }[status];
  }
}

class ProcessGraphic extends DisplayElement {
  constructor(id, processId) {
    super(id, 'process', DisplayLevel.L2_AREA);
    this.processId = processId;
    this.state = 'idle';
    this.children = [];
  }

  setState(state) {
    this.state = state;
  }

  getBackgroundColor() {
    return {
      idle: HMIColors.INACTIVE,
      running: HMIColors.NORMAL,
      warning: HMIColors.ABNORMAL,
      alarm: HMIColors.ALARM,
    }[this.state] || HMIColors.INACTIVE;
  }
}

class FaceplatePanel extends DisplayElement {
  constructor(id, equipmentId) {
    super(id, 'faceplate', DisplayLevel.L3_UNIT);
    this.equipmentId = equipmentId;
    this.mode = 'auto';
    this.setpoint = null;
    this.processValue = null;
    this.output = null;
    this.alarms = [];
  }
}

// County Government HMI Templates
const CountyHMITemplates = {
  // L1 - County Overview
  COUNTY_OVERVIEW: {
    level: DisplayLevel.L1_OVERVIEW,
    layout: 'grid',
    elements: [
      { type: 'kpi', id: 'budget-variance', label: 'Budget Variance', unit: '%' },
      { type: 'kpi', id: 'claims-pending', label: 'Claims Pending', unit: '' },
      { type: 'kpi', id: 'audits-complete', label: 'Audits Complete', unit: '%' },
      { type: 'kpi', id: 'findings-open', label: 'Open Findings', unit: '' },
      { type: 'status', id: 'row-officers', label: 'Row Officer Status' },
      { type: 'alarm-summary', id: 'active-alarms', label: 'Active Alarms' },
    ],
  },

  // L2 - Row Officers Area
  ROW_OFFICERS_AREA: {
    level: DisplayLevel.L2_AREA,
    layout: 'process-flow',
    elements: [
      { type: 'process', id: 'treasurer', label: 'Treasurer' },
      { type: 'process', id: 'sheriff', label: 'Sheriff' },
      { type: 'process', id: 'register-wills', label: 'Register of Wills' },
      { type: 'process', id: 'recorder-deeds', label: 'Recorder of Deeds' },
      { type: 'process', id: 'prothonotary', label: 'Prothonotary' },
      { type: 'process', id: 'clerk-courts', label: 'Clerk of Courts' },
      { type: 'process', id: 'coroner', label: 'Coroner' },
      { type: 'process', id: 'da', label: 'District Attorney' },
    ],
  },

  // L3 - Single Officer Detail
  OFFICER_DETAIL: {
    level: DisplayLevel.L3_UNIT,
    layout: 'detail',
    elements: [
      { type: 'faceplate', id: 'officer-control' },
      { type: 'trend', id: 'revenue-trend', label: 'Revenue' },
      { type: 'trend', id: 'expense-trend', label: 'Expenses' },
      { type: 'table', id: 'recent-transactions', label: 'Recent Transactions' },
      { type: 'alarm-list', id: 'officer-alarms', label: 'Alarms' },
    ],
  },
};

module.exports = {
  HMIColors,
  DisplayLevel,
  NavigationPattern,
  DisplayElement,
  KPIIndicator,
  ProcessGraphic,
  FaceplatePanel,
  CountyHMITemplates,
};
