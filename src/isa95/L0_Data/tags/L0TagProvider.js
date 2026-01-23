/**
 * L0 Tag Provider - Base Data Type Tags
 *
 * Provides tag access for foundational data types:
 * - Money values and currency
 * - Person records
 * - Account structures
 * - Legal references
 * - Enumerations
 *
 * @module isa95/L0_Data/tags
 */

export class L0TagProvider {
  constructor() {
    this.cache = new Map();
    this.subscriptions = new Map();
    this.prefix = 'L0';
  }

  /**
   * Tag paths for L0 data types
   */
  static TAGS = {
    // Money type tags
    MONEY_FORMAT: 'L0.Money.Format',
    MONEY_CURRENCY: 'L0.Money.Currency',
    MONEY_PRECISION: 'L0.Money.Precision',

    // Person type tags
    PERSON_SCHEMA: 'L0.Person.Schema',
    PERSON_ROLES: 'L0.Person.Roles',

    // Account structure tags
    ACCOUNT_FUND_TYPES: 'L0.Account.FundTypes',
    ACCOUNT_DEPARTMENTS: 'L0.Account.Departments',
    ACCOUNT_OBJECT_CODES: 'L0.Account.ObjectCodes',

    // Legal reference tags
    LEGAL_PA_CODE: 'L0.Legal.PACode',
    LEGAL_CHARTER: 'L0.Legal.Charter',
    LEGAL_ORDINANCES: 'L0.Legal.Ordinances',

    // Enum tags
    ENUM_CLAIM_STATUS: 'L0.Enums.ClaimStatus',
    ENUM_AUDIT_TYPE: 'L0.Enums.AuditType',
    ENUM_FINDING_SEVERITY: 'L0.Enums.FindingSeverity',
    ENUM_FUND_TYPE: 'L0.Enums.FundType'
  };

  /**
   * Get a tag value
   * @param {string} tagPath - Full tag path (e.g., 'L0.Money.Currency')
   * @returns {*} Tag value
   */
  get(tagPath) {
    return this.cache.get(tagPath);
  }

  /**
   * Set a tag value
   * @param {string} tagPath - Full tag path
   * @param {*} value - Value to set
   */
  set(tagPath, value) {
    const oldValue = this.cache.get(tagPath);
    this.cache.set(tagPath, value);
    this._notifySubscribers(tagPath, value, oldValue);
  }

  /**
   * Subscribe to tag changes
   * @param {string} tagPath - Tag path to subscribe to
   * @param {function} callback - Called with (newValue, oldValue)
   * @returns {function} Unsubscribe function
   */
  subscribe(tagPath, callback) {
    if (!this.subscriptions.has(tagPath)) {
      this.subscriptions.set(tagPath, new Set());
    }
    this.subscriptions.get(tagPath).add(callback);

    // Call immediately with current value
    if (this.cache.has(tagPath)) {
      callback(this.cache.get(tagPath), undefined);
    }

    return () => this.subscriptions.get(tagPath).delete(callback);
  }

  /**
   * Initialize with default enum values
   */
  initialize() {
    // Claim statuses
    this.set(L0TagProvider.TAGS.ENUM_CLAIM_STATUS, [
      'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED',
      'REJECTED', 'PAID', 'VOIDED'
    ]);

    // Audit types
    this.set(L0TagProvider.TAGS.ENUM_AUDIT_TYPE, [
      'FINANCIAL', 'COMPLIANCE', 'PERFORMANCE', 'SPECIAL', 'FOLLOW_UP'
    ]);

    // Finding severities
    this.set(L0TagProvider.TAGS.ENUM_FINDING_SEVERITY, [
      'MATERIAL_WEAKNESS', 'SIGNIFICANT_DEFICIENCY',
      'CONTROL_DEFICIENCY', 'OBSERVATION'
    ]);

    // Fund types
    this.set(L0TagProvider.TAGS.ENUM_FUND_TYPE, [
      'GENERAL', 'SPECIAL_REVENUE', 'CAPITAL_PROJECTS',
      'DEBT_SERVICE', 'ENTERPRISE', 'INTERNAL_SERVICE'
    ]);

    // Money defaults
    this.set(L0TagProvider.TAGS.MONEY_CURRENCY, 'USD');
    this.set(L0TagProvider.TAGS.MONEY_PRECISION, 2);
    this.set(L0TagProvider.TAGS.MONEY_FORMAT, 'en-US');
  }

  /**
   * Get all tags under a prefix
   * @param {string} prefix - Tag path prefix
   * @returns {Map} Matching tags
   */
  getByPrefix(prefix) {
    const result = new Map();
    for (const [key, value] of this.cache) {
      if (key.startsWith(prefix)) {
        result.set(key, value);
      }
    }
    return result;
  }

  _notifySubscribers(tagPath, newValue, oldValue) {
    const subs = this.subscriptions.get(tagPath);
    if (subs) {
      subs.forEach(cb => cb(newValue, oldValue));
    }
  }
}

// Singleton instance
export const l0TagProvider = new L0TagProvider();

// Initialize on load
l0TagProvider.initialize();

export default l0TagProvider;
