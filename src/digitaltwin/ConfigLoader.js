/**
 * ConfigLoader - Loads JSON configurations and hydrates Digital Twin classes
 *
 * Reads ISA-95 level configurations and instantiates:
 * - PackML state machines from L0 definitions
 * - Work items from L0 type definitions
 * - Transactions from L1 schemas
 * - Workflow rules from L2 control configs
 * - Production units from L3 operations
 * - Enterprise policies from L4
 *
 * @module digitaltwin/ConfigLoader
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { PackMLStateMachine, PackMLState, PackMLMode } from '../isa88/PackML.js';
import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../isa88/ProductionUnit.js';

// Get config directory path - now using ISA-95 structure
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ISA95_BASE = join(__dirname, '..', 'isa95');

/**
 * Load and parse a JSON config file from ISA-95 structure
 */
function loadJSON(relativePath) {
  const fullPath = join(ISA95_BASE, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Config file not found: ${fullPath}`);
  }
  const content = readFileSync(fullPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * ConfigLoader class
 */
export class ConfigLoader {
  constructor() {
    this.configs = {
      L0: {},
      L1: {},
      L2: {},
      L3: {},
      L4: {}
    };
    this.loaded = false;
  }

  /**
   * Load all configuration files from ISA-95 structure
   */
  loadAll() {
    // L0 - Data definitions (src/isa95/L0_Data/config/)
    this.configs.L0.packmlStates = loadJSON('L0_Data/config/packml-states.json');
    this.configs.L0.workItemTypes = loadJSON('L0_Data/config/work-item-types.json');
    this.configs.L0.skillsEquipment = loadJSON('L0_Data/config/skills-equipment.json');

    // L1 - Transaction definitions (src/isa95/L1_Transactions/config/)
    this.configs.L1.feeSchedules = loadJSON('L1_Transactions/config/fee-schedules.json');
    this.configs.L1.transactionSchemas = loadJSON('L1_Transactions/config/transaction-schemas.json');

    // L2 - Control configurations (src/isa95/L2_Control/config/)
    this.configs.L2.workflowRules = loadJSON('L2_Control/config/workflow-rules.json');
    this.configs.L2.businessRules = loadJSON('L2_Control/config/business-rules.json');

    // L3 - Operations configurations (src/isa95/L3_Operations/config/)
    this.configs.L3.productionUnits = loadJSON('L3_Operations/config/production-units.json');
    this.configs.L3.assemblyLines = loadJSON('L3_Operations/config/assembly-lines.json');

    // L4 - Enterprise policies (src/isa95/L4_Enterprise/config/)
    this.configs.L4.policies = loadJSON('L4_Enterprise/config/policies.json');

    this.loaded = true;
    return this;
  }

  /**
   * Get a specific config
   */
  getConfig(level, name) {
    if (!this.loaded) {
      this.loadAll();
    }
    return this.configs[level]?.[name];
  }

  /**
   * Create a PackML state machine from config
   */
  createStateMachine(unitId) {
    const config = this.getConfig('L0', 'packmlStates');
    const sm = new PackMLStateMachine(unitId);
    // State machine is initialized with default states from PackML.js
    // Config provides additional metadata like colors and descriptions
    return sm;
  }

  /**
   * Create a WorkItem from config
   */
  createWorkItem(unitId, typeId, data = {}) {
    const config = this.getConfig('L0', 'workItemTypes');
    const unitTypes = config.types[unitId];

    if (!unitTypes || !unitTypes[typeId]) {
      throw new Error(`Unknown work item type: ${unitId}/${typeId}`);
    }

    const typeConfig = unitTypes[typeId];
    const id = `${typeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const workItem = new WorkItem(id, typeId, {
      ...data,
      priority: data.priority || typeConfig.defaultPriority,
      slaHours: typeConfig.slaHours,
      category: typeConfig.category
    });

    return workItem;
  }

  /**
   * Create a WorkStation from config
   */
  createStation(stationConfig) {
    return new WorkStation({
      id: stationConfig.id,
      name: stationConfig.name,
      description: stationConfig.description,
      capacity: stationConfig.capacity,
      cycleTime: stationConfig.cycleTimeMinutes * 60 * 1000, // Convert to ms
      inputTypes: stationConfig.inputTypes,
      outputType: stationConfig.outputType,
      requiredSkills: stationConfig.requiredSkills,
      equipment: stationConfig.equipment
    });
  }

  /**
   * Create an AssemblyLine from config
   */
  createAssemblyLine(lineId) {
    const linesConfig = this.getConfig('L3', 'assemblyLines');
    const lineConfig = linesConfig.lines[lineId];

    if (!lineConfig) {
      throw new Error(`Unknown assembly line: ${lineId}`);
    }

    const line = new AssemblyLine({
      id: lineConfig.id,
      name: lineConfig.name,
      description: lineConfig.description,
      layout: lineConfig.layout
    });

    // Add stations
    for (const stationConfig of lineConfig.stations) {
      const station = this.createStation(stationConfig);
      line.addStation(station);
    }

    return line;
  }

  /**
   * Create a ProductionUnit from config
   */
  createProductionUnit(unitId) {
    const unitsConfig = this.getConfig('L3', 'productionUnits');
    const unitConfig = unitsConfig.units[unitId];

    if (!unitConfig) {
      throw new Error(`Unknown production unit: ${unitId}`);
    }

    const unit = new ProductionUnit({
      id: unitConfig.id,
      name: unitConfig.name,
      type: unitConfig.type,
      authority: `${unitConfig.authority.statute}`,
      description: unitConfig.name,
      staffing: unitConfig.staffing,
      operatingHours: unitConfig.operatingHours,
      position: unitConfig.position,
      dimensions: unitConfig.dimensions
    });

    // Add assembly lines
    for (const lineId of unitConfig.assemblyLines) {
      try {
        const line = this.createAssemblyLine(lineId);
        unit.addLine(line);
      } catch (e) {
        console.warn(`Could not create line ${lineId}: ${e.message}`);
      }
    }

    return unit;
  }

  /**
   * Create all production units
   */
  createAllUnits() {
    const unitsConfig = this.getConfig('L3', 'productionUnits');
    const units = new Map();

    for (const unitId of Object.keys(unitsConfig.units)) {
      try {
        const unit = this.createProductionUnit(unitId);
        units.set(unitId, unit);
      } catch (e) {
        console.warn(`Could not create unit ${unitId}: ${e.message}`);
      }
    }

    return units;
  }

  /**
   * Get workflow rules for a specific workflow
   */
  getWorkflow(workflowId) {
    const config = this.getConfig('L2', 'workflowRules');
    return config.workflows[workflowId];
  }

  /**
   * Get approval thresholds
   */
  getApprovalThresholds(type = 'claims') {
    const config = this.getConfig('L2', 'workflowRules');
    return config.approvalThresholds[type];
  }

  /**
   * Get fee schedule for an officer
   */
  getFeeSchedule(officerId) {
    const config = this.getConfig('L1', 'feeSchedules');
    return config[officerId];
  }

  /**
   * Get enterprise policies
   */
  getPolicies() {
    return this.getConfig('L4', 'policies');
  }

  /**
   * Get unit connections (inter-unit workflows)
   */
  getConnections() {
    const config = this.getConfig('L3', 'productionUnits');
    return config.connections;
  }

  /**
   * Validate a work item against business rules
   */
  validateWorkItem(workItem, ruleset) {
    const config = this.getConfig('L2', 'businessRules');
    const rules = config.validation[ruleset]?.rules || [];
    const results = [];

    for (const rule of rules) {
      // Simplified validation - in production would use a rules engine
      results.push({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        passed: true, // Placeholder - actual validation logic needed
        message: null
      });
    }

    return {
      valid: results.every(r => r.passed || r.severity !== 'blocking'),
      results
    };
  }

  /**
   * Calculate fee from schedule
   */
  calculateFee(officerId, feeType, params = {}) {
    const schedule = this.getFeeSchedule(officerId);
    if (!schedule || !schedule.fees[feeType]) {
      throw new Error(`Unknown fee: ${officerId}/${feeType}`);
    }

    const fee = schedule.fees[feeType];
    let amount = fee.amount;

    // Handle per-unit fees
    if (fee.per === 'page' && params.pages) {
      amount = fee.amount * params.pages;
    } else if (fee.per === 'mile' && params.miles) {
      amount = fee.amount * params.miles;
    }

    return {
      feeType,
      baseAmount: fee.amount,
      quantity: params.pages || params.miles || 1,
      totalAmount: amount,
      description: fee.description
    };
  }

  /**
   * Get summary of loaded configuration
   */
  getSummary() {
    if (!this.loaded) {
      this.loadAll();
    }

    const unitsConfig = this.getConfig('L3', 'productionUnits');
    const linesConfig = this.getConfig('L3', 'assemblyLines');

    return {
      enterprise: unitsConfig.enterprise,
      unitCount: Object.keys(unitsConfig.units).length,
      lineCount: Object.keys(linesConfig.lines).length,
      workItemTypeCount: Object.values(this.configs.L0.workItemTypes.types)
        .reduce((sum, unit) => sum + Object.keys(unit).length, 0),
      workflowCount: Object.keys(this.configs.L2.workflowRules.workflows).length,
      policies: Object.keys(this.configs.L4.policies)
    };
  }

  /**
   * Export all configs as a single object (for browser use)
   */
  exportAll() {
    if (!this.loaded) {
      this.loadAll();
    }
    return { ...this.configs };
  }
}

/**
 * Create a configured Digital Twin from JSON configs
 */
export function createConfiguredTwin() {
  const loader = new ConfigLoader();
  loader.loadAll();

  // Dynamic import to avoid circular dependency
  return import('./DigitalTwin.js').then(({ DigitalTwin }) => {
    const twin = new DigitalTwin({
      id: 'northampton-county',
      name: 'Northampton County Government'
    });

    // Replace default units with config-based units
    twin.units = loader.createAllUnits();
    twin._layoutUnits();

    // Attach loader for runtime access to configs
    twin.configLoader = loader;

    return twin;
  });
}

/**
 * Singleton loader instance
 */
let loaderInstance = null;

export function getConfigLoader() {
  if (!loaderInstance) {
    loaderInstance = new ConfigLoader();
    loaderInstance.loadAll();
  }
  return loaderInstance;
}

export default ConfigLoader;
