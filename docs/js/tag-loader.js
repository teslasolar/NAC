/**
 * Tag Loader - Centralized data loading from UDT tag files
 *
 * Usage:
 *   const tags = new TagLoader();
 *   const officers = await tags.load('row-officers');
 *   const execs = await tags.load('executives');
 *
 * Or load multiple:
 *   const { rowOfficers, executives, oee } = await tags.loadAll(['row-officers', 'executives', 'oee-benchmarks']);
 */

class TagLoader {
  constructor(basePath = 'tags/') {
    this.basePath = basePath;
    this.cache = new Map();
    this.loading = new Map();
  }

  /**
   * Load a single tag file
   * @param {string} tagName - Tag name without .json extension
   * @returns {Promise<Object>} - Tag data
   */
  async load(tagName) {
    // Return from cache if available
    if (this.cache.has(tagName)) {
      return this.cache.get(tagName);
    }

    // Return existing promise if already loading
    if (this.loading.has(tagName)) {
      return this.loading.get(tagName);
    }

    // Start loading
    const loadPromise = this._fetch(tagName);
    this.loading.set(tagName, loadPromise);

    try {
      const data = await loadPromise;
      this.cache.set(tagName, data);
      this.loading.delete(tagName);
      return data;
    } catch (error) {
      this.loading.delete(tagName);
      throw error;
    }
  }

  /**
   * Load multiple tags at once
   * @param {string[]} tagNames - Array of tag names
   * @returns {Promise<Object>} - Object with tag data keyed by camelCase name
   */
  async loadAll(tagNames) {
    const results = await Promise.all(tagNames.map(name => this.load(name)));
    const output = {};

    tagNames.forEach((name, i) => {
      const key = this._toCamelCase(name);
      output[key] = results[i];
    });

    return output;
  }

  /**
   * Get cached tag (sync, returns null if not loaded)
   * @param {string} tagName - Tag name
   * @returns {Object|null} - Cached data or null
   */
  get(tagName) {
    return this.cache.get(tagName) || null;
  }

  /**
   * Clear cache
   * @param {string} [tagName] - Optional specific tag to clear
   */
  clearCache(tagName) {
    if (tagName) {
      this.cache.delete(tagName);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Internal fetch method
   */
  async _fetch(tagName) {
    const url = `${this.basePath}${tagName}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load tag: ${tagName} (${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error(`TagLoader: Error loading ${tagName}:`, error);
      throw error;
    }
  }

  /**
   * Convert kebab-case to camelCase
   */
  _toCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}

// Convenience functions for common data access patterns

/**
 * Get row officer by ID
 * @param {Object} data - Row officers tag data
 * @param {string} id - Officer ID
 * @returns {Object|null} - Officer data
 */
function getOfficerById(data, id) {
  return data.officers?.find(o => o.id === id) || null;
}

/**
 * Get executive department by ID
 * @param {Object} data - Executives tag data
 * @param {string} id - Department ID
 * @returns {Object|null} - Department data
 */
function getDepartmentById(data, id) {
  return data.administrativeDepartments?.find(d => d.id === id) || null;
}

/**
 * Get OEE benchmark for office
 * @param {Object} data - OEE benchmarks tag data
 * @param {string} id - Office ID
 * @returns {Object|null} - OEE data
 */
function getOEEById(data, id) {
  return data.offices?.find(o => o.id === id) || null;
}

/**
 * Get council member by name
 * @param {Object} data - Executives tag data
 * @param {string} name - Member name
 * @returns {Object|null} - Council member data
 */
function getCouncilMember(data, name) {
  return data.countyCouncil?.members?.find(m =>
    m.name.toLowerCase().includes(name.toLowerCase())
  ) || null;
}

/**
 * Format currency
 * @param {number} amount - Amount in dollars
 * @returns {string} - Formatted string
 */
function formatCurrency(amount) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

/**
 * Get OEE rating color
 * @param {number} oee - OEE percentage
 * @returns {string} - Hex color
 */
function getOEEColor(oee) {
  if (oee >= 85) return '#22c55e';
  if (oee >= 75) return '#84cc16';
  if (oee >= 65) return '#eab308';
  if (oee >= 50) return '#f97316';
  return '#ef4444';
}

/**
 * Get OEE rating label
 * @param {number} oee - OEE percentage
 * @returns {string} - Rating label
 */
function getOEERating(oee) {
  if (oee >= 85) return 'World Class';
  if (oee >= 75) return 'Good';
  if (oee >= 65) return 'Acceptable';
  if (oee >= 50) return 'Needs Improvement';
  return 'Critical';
}

// Export for ES modules (if supported)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TagLoader,
    getOfficerById,
    getDepartmentById,
    getOEEById,
    getCouncilMember,
    formatCurrency,
    getOEEColor,
    getOEERating
  };
}
