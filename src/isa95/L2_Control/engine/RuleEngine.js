/**
 * Rule Engine - ISA-95 L2 Control Layer
 *
 * Validates business rules and calculations for county operations.
 * Reads rules from config/business-rules.json.
 * Enforces segregation of duties and compliance requirements.
 *
 * @module L2_Control/engine/RuleEngine
 * @standard ISA-95 Level 2
 */

/**
 * Validation result
 */
export class ValidationResult {
  constructor() {
    this.valid = true;
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  addError(ruleId, message, field = null) {
    this.valid = false;
    this.errors.push({ ruleId, message, field, severity: 'error' });
  }

  addWarning(ruleId, message, field = null) {
    this.warnings.push({ ruleId, message, field, severity: 'warning' });
  }

  addInfo(ruleId, message) {
    this.info.push({ ruleId, message, severity: 'info' });
  }

  merge(other) {
    if (!other.valid) this.valid = false;
    this.errors.push(...other.errors);
    this.warnings.push(...other.warnings);
    this.info.push(...other.info);
  }

  toJSON() {
    return {
      valid: this.valid,
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info
    };
  }
}

/**
 * RuleEngine - Main business rules engine
 */
export class RuleEngine {
  constructor(businessRulesConfig) {
    this.config = businessRulesConfig;
    this.validationRules = businessRulesConfig.validation || {};
    this.calculations = businessRulesConfig.calculations || {};
    this.segregationRules = businessRulesConfig.segregationOfDuties?.rules || [];
    this.retentionSchedules = businessRulesConfig.retentionSchedules?.schedules || {};

    // Custom rule evaluators
    this.evaluators = new Map();

    // Register built-in evaluators
    this._registerBuiltInEvaluators();
  }

  /**
   * Register built-in condition evaluators
   */
  _registerBuiltInEvaluators() {
    // Required field check
    this.evaluators.set('required', (value) => {
      return value !== undefined && value !== null && value !== '';
    });

    // Exists in reference
    this.evaluators.set('exists_in_chart_of_accounts', (value, context) => {
      // Would check against actual chart of accounts
      return typeof value === 'string' && value.length > 0;
    });

    // Notarization check
    this.evaluators.set('notarization_valid', (value, context) => {
      return context.notarized === true && context.notaryExpiration > new Date();
    });

    // UPI present
    this.evaluators.set('upi_present', (value, context) => {
      return typeof context.upi === 'string' && /^\d{2}-\d{2}-\d{4}/.test(context.upi);
    });

    // No duplicate invoice
    this.evaluators.set('no_duplicate_invoice', async (value, context, lookupFn) => {
      if (!lookupFn) return true;
      const existing = await lookupFn('invoices', {
        vendorId: context.vendorId,
        invoiceNumber: context.invoiceNumber,
        amount: context.amount
      });
      return !existing || existing.length === 0;
    });
  }

  /**
   * Register custom evaluator
   */
  registerEvaluator(name, evaluator) {
    this.evaluators.set(name, evaluator);
  }

  /**
   * Validate entity against rules
   */
  async validate(entityType, entity, context = {}, lookupFn = null) {
    const result = new ValidationResult();
    const rules = this.validationRules[entityType]?.rules || [];

    for (const rule of rules) {
      const ruleResult = await this._evaluateRule(rule, entity, context, lookupFn);

      if (!ruleResult.passed) {
        if (rule.severity === 'blocking') {
          result.addError(rule.id, rule.description, rule.field);
        } else if (rule.severity === 'warning') {
          result.addWarning(rule.id, rule.description, rule.field);
        }
      } else {
        result.addInfo(rule.id, `Passed: ${rule.name}`);
      }
    }

    return result;
  }

  /**
   * Evaluate single rule
   */
  async _evaluateRule(rule, entity, context, lookupFn) {
    // Check if condition is a registered evaluator
    if (this.evaluators.has(rule.condition)) {
      const evaluator = this.evaluators.get(rule.condition);
      const value = rule.field ? entity[rule.field] : entity;
      const passed = await evaluator(value, { ...entity, ...context }, lookupFn);
      return { passed };
    }

    // Simple field check
    if (rule.field && rule.condition === 'required') {
      const value = entity[rule.field];
      return { passed: value !== undefined && value !== null && value !== '' };
    }

    // Expression-based condition (simplified parser)
    const passed = this._evaluateExpression(rule.condition, entity, context);
    return { passed };
  }

  /**
   * Simple expression evaluator
   */
  _evaluateExpression(expression, entity, context) {
    const combined = { ...entity, ...context };

    // Handle equality: field == value
    if (expression.includes('==')) {
      const [left, right] = expression.split('==').map(s => s.trim());
      const leftVal = this._resolveValue(left, combined);
      const rightVal = this._resolveValue(right, combined);
      return leftVal === rightVal;
    }

    // Handle inequality: field >= value
    if (expression.includes('>=')) {
      const [left, right] = expression.split('>=').map(s => s.trim());
      const leftVal = this._resolveValue(left, combined);
      const rightVal = this._resolveValue(right, combined);
      return leftVal >= rightVal;
    }

    // Handle conditional: if X then Y
    if (expression.includes(' then ')) {
      const [condition, requirement] = expression.split(' then ').map(s => s.trim());
      const conditionStr = condition.replace(/^if\s+/, '');
      const conditionMet = this._evaluateExpression(conditionStr, entity, context);
      if (!conditionMet) return true; // Condition not met, rule doesn't apply
      return this._evaluateExpression(requirement, entity, context);
    }

    // Handle 'or' conditions
    if (expression.includes(' or ')) {
      const parts = expression.split(' or ').map(s => s.trim());
      return parts.some(part => this._evaluateExpression(part, entity, context));
    }

    // Simple boolean check
    return !!this._resolveValue(expression, combined);
  }

  /**
   * Resolve value from object path or literal
   */
  _resolveValue(path, obj) {
    // Check if it's a literal number
    if (/^\d+(\.\d+)?$/.test(path)) {
      return parseFloat(path);
    }

    // Check if it's a string literal
    if (/^["'].*["']$/.test(path)) {
      return path.slice(1, -1);
    }

    // Resolve object path (e.g., "fund.balance")
    const parts = path.split('.');
    let value = obj;
    for (const part of parts) {
      if (value === undefined || value === null) return undefined;
      value = value[part];
    }
    return value;
  }

  /**
   * Calculate value using calculation rules
   */
  calculate(calculationType, params) {
    const calcDef = this.calculations[calculationType];
    if (!calcDef) {
      throw new Error(`Unknown calculation: ${calculationType}`);
    }

    // Merge default parameters with provided params
    const allParams = { ...calcDef.parameters, ...params };

    // Check for exemptions
    if (calcDef.exemptions && params.exemptionCode) {
      const exemption = calcDef.exemptions.find(e => e.code === params.exemptionCode);
      if (exemption) {
        return {
          value: 0,
          exemption: exemption.description,
          formula: calcDef.formula,
          params: allParams
        };
      }
    }

    // Evaluate formula
    const value = this._evaluateFormula(calcDef.formula, allParams);

    // Apply discounts/penalties if applicable
    let adjustedValue = value;
    let adjustments = [];

    if (calcDef.discounts) {
      for (const [key, discount] of Object.entries(calcDef.discounts)) {
        if (params[key] || (discount.withinDays && params.daysSinceEvent <= discount.withinDays)) {
          const reduction = value * discount.discountRate;
          adjustedValue -= reduction;
          adjustments.push({
            type: 'discount',
            name: key,
            description: discount.description,
            amount: -reduction
          });
        }
      }
    }

    if (calcDef.penalties) {
      for (const [key, penalty] of Object.entries(calcDef.penalties)) {
        if (params[key] || (penalty.afterDays && params.daysSinceEvent > penalty.afterDays)) {
          const addition = value * penalty.penaltyRate;
          adjustedValue += addition;
          adjustments.push({
            type: 'penalty',
            name: key,
            description: penalty.description,
            amount: addition
          });
        }
      }
    }

    return {
      baseValue: value,
      adjustedValue,
      adjustments,
      formula: calcDef.formula,
      params: allParams
    };
  }

  /**
   * Simple formula evaluator
   */
  _evaluateFormula(formula, params) {
    // Replace parameter references with values
    let expression = formula;
    for (const [key, value] of Object.entries(params)) {
      expression = expression.replace(new RegExp(key, 'g'), value);
    }

    // Evaluate the expression (simplified - would need proper parser for production)
    try {
      // Only allow safe operations
      if (!/^[\d\s+\-*/().]+$/.test(expression)) {
        throw new Error('Invalid formula expression');
      }
      return Function('"use strict"; return (' + expression + ')')();
    } catch (e) {
      console.error('Formula evaluation error:', e);
      return 0;
    }
  }

  /**
   * Check segregation of duties
   */
  checkSegregation(function1, function2, user1, user2) {
    const result = new ValidationResult();

    for (const rule of this.segregationRules) {
      const matchesF1 = rule.function1 === function1 || rule.function2 === function1;
      const matchesF2 = rule.function1 === function2 || rule.function2 === function2;

      if (matchesF1 && matchesF2 && rule.mustBeDifferent) {
        if (user1 === user2) {
          result.addError(
            rule.id,
            `Segregation violation: ${function1} and ${function2} must be performed by different users`
          );
        }
      }
    }

    return result;
  }

  /**
   * Get retention period for record type
   */
  getRetentionPeriod(category, recordType) {
    const schedule = this.retentionSchedules[category]?.[recordType];
    if (!schedule) {
      return { found: false };
    }

    return {
      found: true,
      years: schedule.years,
      afterEvent: schedule.afterEvent,
      isPermanent: schedule.years === 'permanent'
    };
  }

  /**
   * Check if record can be destroyed
   */
  canDestroyRecord(category, recordType, eventDate) {
    const retention = this.getRetentionPeriod(category, recordType);

    if (!retention.found) {
      return {
        canDestroy: false,
        reason: 'No retention schedule found - default to permanent'
      };
    }

    if (retention.isPermanent) {
      return {
        canDestroy: false,
        reason: 'Permanent retention required'
      };
    }

    const retentionEndDate = new Date(eventDate);
    retentionEndDate.setFullYear(retentionEndDate.getFullYear() + retention.years);

    const now = new Date();
    const canDestroy = now > retentionEndDate;

    return {
      canDestroy,
      retentionYears: retention.years,
      afterEvent: retention.afterEvent,
      retentionEndDate,
      reason: canDestroy
        ? `Retention period expired on ${retentionEndDate.toISOString()}`
        : `Must retain until ${retentionEndDate.toISOString()}`
    };
  }

  /**
   * Get all validation rules for entity type
   */
  getRules(entityType) {
    return this.validationRules[entityType]?.rules || [];
  }

  /**
   * Get all calculation types
   */
  getCalculationTypes() {
    return Object.keys(this.calculations);
  }

  /**
   * Get calculation definition
   */
  getCalculationDef(calculationType) {
    return this.calculations[calculationType];
  }
}

/**
 * Create rule engine from config file
 */
export async function createRuleEngine(configPath) {
  const fs = await import('fs/promises');
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  return new RuleEngine(config);
}

export default RuleEngine;
