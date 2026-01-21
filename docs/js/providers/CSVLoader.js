/**
 * CSVLoader - Load and parse CSV files for tag data
 * More token-efficient than JSON for tabular data
 */

class CSVLoader {
  constructor(basePath = 'data/csv') {
    this.basePath = basePath;
    this.cache = new Map();
  }

  /**
   * Parse CSV string into array of objects
   */
  parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = this.parseCSVLine(lines[0]);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((h, idx) => {
        let val = values[idx] || '';
        // Auto-convert numbers
        if (/^-?\d+\.?\d*$/.test(val)) {
          val = parseFloat(val);
        }
        row[h] = val;
      });
      rows.push(row);
    }
    return rows;
  }

  /**
   * Parse a single CSV line (handles quoted fields)
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  /**
   * Load CSV file and return parsed data
   */
  async load(filename) {
    const cacheKey = filename;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const url = `${this.basePath}/${filename}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${url}`);
    }

    const text = await response.text();
    const data = this.parseCSV(text);
    this.cache.set(cacheKey, data);
    return data;
  }

  /**
   * Load and join two CSVs by foreign key
   */
  async loadWithChildren(parentFile, childFile, foreignKey) {
    const [parents, children] = await Promise.all([
      this.load(parentFile),
      this.load(childFile)
    ]);

    // Group children by foreign key
    const childMap = new Map();
    children.forEach(child => {
      const key = child[foreignKey];
      if (!childMap.has(key)) {
        childMap.set(key, []);
      }
      childMap.get(key).push(child);
    });

    // Attach children to parents
    return parents.map(parent => ({
      ...parent,
      children: childMap.get(parent.id) || []
    }));
  }

  /**
   * Query loaded data with filters
   */
  query(data, filters = {}) {
    return data.filter(row => {
      for (const [key, value] of Object.entries(filters)) {
        if (row[key] !== value) return false;
      }
      return true;
    });
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Factory function
function createCSVLoader(basePath) {
  return new CSVLoader(basePath);
}

// Export for module use
if (typeof module !== 'undefined') {
  module.exports = { CSVLoader, createCSVLoader };
}
