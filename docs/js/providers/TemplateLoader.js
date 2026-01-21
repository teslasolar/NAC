/**
 * TemplateLoader - Load tag templates and resolve CSV data sources
 * Combines lightweight JSON templates with token-efficient CSV data
 */

class TemplateLoader {
  constructor(options = {}) {
    this.templatePath = options.templatePath || 'tags/templates';
    this.csvLoader = options.csvLoader || new CSVLoader();
    this.cache = new Map();
  }

  /**
   * Load a template and resolve its data sources
   */
  async load(templateName) {
    const cacheKey = templateName;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Load template JSON
    const url = `${this.templatePath}/${templateName}.template.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${url}`);
    }

    const template = await response.json();

    // Resolve data sources
    if (template.dataSources) {
      const resolved = {};
      const loadPromises = [];

      for (const [name, source] of Object.entries(template.dataSources)) {
        if (source.type === 'csv') {
          loadPromises.push(
            this.csvLoader.load(source.path.replace('data/csv/', ''))
              .then(data => { resolved[name] = data; })
          );
        }
      }

      await Promise.all(loadPromises);

      // Join related data
      for (const [name, source] of Object.entries(template.dataSources)) {
        if (source.foreignKey && resolved[name]) {
          const parentName = this.findParentSource(template.dataSources, source.foreignKey);
          if (parentName && resolved[parentName]) {
            this.joinData(resolved[parentName], resolved[name], source.foreignKey);
          }
        }
      }

      template.data = resolved;
    }

    this.cache.set(cacheKey, template);
    return template;
  }

  /**
   * Find parent data source by key field
   */
  findParentSource(dataSources, foreignKey) {
    for (const [name, source] of Object.entries(dataSources)) {
      if (source.key && foreignKey.includes(source.key)) {
        return name;
      }
    }
    return null;
  }

  /**
   * Join child data to parent records
   */
  joinData(parents, children, foreignKey) {
    const childMap = new Map();

    children.forEach(child => {
      const key = child[foreignKey];
      if (!childMap.has(key)) {
        childMap.set(key, []);
      }
      childMap.get(key).push(child);
    });

    parents.forEach(parent => {
      const key = parent.id || parent.name;
      parent.children = childMap.get(key) || [];
    });
  }

  /**
   * Get specific data from loaded template
   */
  async getData(templateName, dataSource) {
    const template = await this.load(templateName);
    return template.data?.[dataSource] || [];
  }

  /**
   * Query template data
   */
  async query(templateName, dataSource, filters = {}) {
    const data = await this.getData(templateName, dataSource);
    return data.filter(row => {
      for (const [key, value] of Object.entries(filters)) {
        if (row[key] !== value) return false;
      }
      return true;
    });
  }

  clearCache() {
    this.cache.clear();
    this.csvLoader.clearCache();
  }
}

// Factory function
function createTemplateLoader(options) {
  return new TemplateLoader(options);
}

// Export
if (typeof module !== 'undefined') {
  module.exports = { TemplateLoader, createTemplateLoader };
}
