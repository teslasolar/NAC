/**
 * TagProvider - Ignition-style tag management system
 * Loads JSON tag definitions and provides data binding
 */
class TagProvider {
  constructor(basePath = 'tags') {
    this.basePath = basePath;
    this.cache = new Map();
    this.subscriptions = new Map();
    this.loaded = new Set();
  }

  /**
   * Load a tag file by name
   * @param {string} tagName - Name of tag file (without .json)
   * @returns {Promise<object>} Tag data
   */
  async load(tagName) {
    if (this.cache.has(tagName)) return this.cache.get(tagName);

    try {
      const response = await fetch(`${this.basePath}/${tagName}.json`);
      if (!response.ok) throw new Error(`Tag ${tagName} not found`);
      const data = await response.json();
      this.cache.set(tagName, data);
      this.loaded.add(tagName);
      this._notifySubscribers(tagName, data);
      return data;
    } catch (error) {
      console.error(`TagProvider: Failed to load ${tagName}`, error);
      throw error;
    }
  }

  /**
   * Get tag value by path (e.g., "notices/notices[0]/title")
   * @param {string} tagName - Tag file name
   * @param {string} path - Dot-notation path to value
   */
  async getValue(tagName, path) {
    const data = await this.load(tagName);
    return this._resolvePath(data, path);
  }

  /**
   * Get all loaded tags
   */
  getLoadedTags() {
    return Array.from(this.loaded);
  }

  /**
   * Subscribe to tag changes
   * @param {string} tagName - Tag to subscribe to
   * @param {function} callback - Called when tag loads/changes
   */
  subscribe(tagName, callback) {
    if (!this.subscriptions.has(tagName)) {
      this.subscriptions.set(tagName, new Set());
    }
    this.subscriptions.get(tagName).add(callback);

    // If already loaded, call immediately
    if (this.cache.has(tagName)) {
      callback(this.cache.get(tagName));
    }

    return () => this.subscriptions.get(tagName).delete(callback);
  }

  /**
   * Preload multiple tags
   * @param {string[]} tagNames - Array of tag names
   */
  async preload(tagNames) {
    return Promise.all(tagNames.map(name => this.load(name)));
  }

  /**
   * Clear cache for a tag or all tags
   */
  clearCache(tagName = null) {
    if (tagName) {
      this.cache.delete(tagName);
      this.loaded.delete(tagName);
    } else {
      this.cache.clear();
      this.loaded.clear();
    }
  }

  /**
   * Get tag metadata
   */
  async getMetadata(tagName) {
    const data = await this.load(tagName);
    return {
      tagType: data.tagType,
      name: data.name,
      description: data.description,
      version: data.version
    };
  }

  // Private methods
  _resolvePath(obj, path) {
    return path.split('.').reduce((acc, part) => {
      const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        return acc?.[arrayMatch[1]]?.[parseInt(arrayMatch[2])];
      }
      return acc?.[part];
    }, obj);
  }

  _notifySubscribers(tagName, data) {
    const subs = this.subscriptions.get(tagName);
    if (subs) subs.forEach(cb => cb(data));
  }
}

// Singleton instance
const tagProvider = new TagProvider();

// Convenience functions for global use
async function loadTag(name) { return tagProvider.load(name); }
async function getTagValue(name, path) { return tagProvider.getValue(name, path); }
function subscribeTag(name, cb) { return tagProvider.subscribe(name, cb); }

// Export for module usage
if (typeof module !== 'undefined') module.exports = { TagProvider, tagProvider };
