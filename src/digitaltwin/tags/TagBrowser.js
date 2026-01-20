/**
 * TagBrowser - Unified interface for UDT/Tag access
 *
 * Provides OPC UA-style tag browsing and access:
 * - Browse tag hierarchy
 * - Read/write tag values
 * - Subscribe to value changes
 * - Validate against UDT schemas
 *
 * Tag paths follow dot notation: Unit.Line.Station.Member
 * Example: Sheriff.Lines.ProcessService.Stations[0].Status.Utilization
 *
 * @module digitaltwin/tags/TagBrowser
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  TagValue,
  TagDataType,
  TagQuality,
  TagNode
} from './helpers/index.js';

// Re-export for backward compatibility
export { TagValue, TagDataType, TagQuality } from './helpers/TagValue.js';
export { TagNode } from './helpers/TagNode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UDT_PATH = join(__dirname, 'udt');
const INSTANCES_PATH = join(__dirname, 'instances');

/**
 * TagBrowser - Main class for tag access
 */
export class TagBrowser {
  constructor() {
    this.root = new TagNode('Root', '', 'folder');
    this.udtTemplates = new Map();
    this.flatTags = new Map(); // path -> TagNode for fast lookup
    this.loaded = false;
  }

  /**
   * Load all UDT templates
   */
  loadUDTs() {
    const baseUDTs = join(UDT_PATH, 'base');
    if (existsSync(baseUDTs)) {
      const files = readdirSync(baseUDTs).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const content = JSON.parse(readFileSync(join(baseUDTs, file), 'utf-8'));
        this.udtTemplates.set(content.udtType, content);
      }
    }

    const officerUDTs = join(UDT_PATH, 'officers');
    if (existsSync(officerUDTs)) {
      const files = readdirSync(officerUDTs).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const content = JSON.parse(readFileSync(join(officerUDTs, file), 'utf-8'));
        this.udtTemplates.set(content.udtType, content);
      }
    }

    return this;
  }

  /**
   * Load tag instances from a directory
   */
  loadInstances(unitId = null) {
    const units = unitId ? [unitId] : readdirSync(INSTANCES_PATH);

    for (const unit of units) {
      const unitPath = join(INSTANCES_PATH, unit);
      if (!existsSync(unitPath)) continue;

      this._loadInstancesRecursive(unitPath, unit);
    }

    this.loaded = true;
    return this;
  }

  /**
   * Recursively load tag instances
   */
  _loadInstancesRecursive(dirPath, tagPath) {
    const entries = readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Create folder node
        const folderPath = `${tagPath}.${entry.name}`;
        this._ensurePath(folderPath, 'folder');
        this._loadInstancesRecursive(fullPath, folderPath);
      } else if (entry.name.endsWith('.json')) {
        // Load tag instance
        try {
          const content = JSON.parse(readFileSync(fullPath, 'utf-8'));
          this._loadTagInstance(content, tagPath);
        } catch (e) {
          console.error(`Error loading ${fullPath}:`, e.message);
        }
      }
    }
  }

  /**
   * Load a single tag instance
   */
  _loadTagInstance(instance, basePath) {
    const tagName = instance.tagName || basePath;
    const udtType = instance.udtType;
    const udt = this.udtTemplates.get(udtType);

    // Create the tag node
    const tagNode = this._ensurePath(tagName, 'udt');
    tagNode.udtType = udtType;
    tagNode.description = instance.description || '';

    // Load values into tag tree
    if (instance.values && udt) {
      this._loadValues(tagNode, instance.values, udt.members, tagName);
    }
  }

  /**
   * Load values recursively following UDT structure
   */
  _loadValues(parentNode, values, members, basePath) {
    for (const [memberName, memberDef] of Object.entries(members)) {
      const memberPath = `${basePath}.${memberName}`;
      const value = values[memberName];

      if (memberDef.members) {
        // Nested structure
        const node = this._ensurePath(memberPath, 'folder');
        node.description = memberDef.description || '';
        if (value && typeof value === 'object') {
          this._loadValues(node, value, memberDef.members, memberPath);
        }
      } else {
        // Leaf tag
        const node = this._ensurePath(memberPath, 'tag');
        node.dataType = memberDef.type;
        node.description = memberDef.description || '';
        node.value = new TagValue(value);
      }
    }
  }

  /**
   * Ensure a path exists in the tree, creating nodes as needed
   */
  _ensurePath(path, nodeType = 'folder') {
    const parts = path.split('.');
    let current = this.root;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}.${part}` : part;

      let child = current.getChild(part);
      if (!child) {
        const type = i === parts.length - 1 ? nodeType : 'folder';
        child = new TagNode(part, currentPath, type);
        current.addChild(part, child);
        this.flatTags.set(currentPath, child);
      }
      current = child;
    }

    return current;
  }

  /**
   * Browse children of a path
   */
  browse(path = '') {
    const node = path ? this.getNode(path) : this.root;
    if (!node) return [];

    return Array.from(node.children.values()).map(child => child.toJSON());
  }

  /**
   * Get a node by path
   */
  getNode(path) {
    return this.flatTags.get(path);
  }

  /**
   * Read a tag value
   */
  read(path) {
    const node = this.getNode(path);
    if (!node) {
      throw new Error(`Tag not found: ${path}`);
    }
    return node.value;
  }

  /**
   * Read multiple tags
   */
  readMultiple(paths) {
    const results = {};
    for (const path of paths) {
      try {
        results[path] = this.read(path);
      } catch (e) {
        results[path] = new TagValue(null, TagQuality.BAD_NOT_CONNECTED);
      }
    }
    return results;
  }

  /**
   * Write a tag value
   */
  write(path, value) {
    const node = this.getNode(path);
    if (!node) {
      throw new Error(`Tag not found: ${path}`);
    }
    if (!node.writable) {
      throw new Error(`Tag is read-only: ${path}`);
    }

    const oldValue = node.value;
    node.value = value instanceof TagValue ? value : new TagValue(value);
    node.notifySubscribers(oldValue, node.value);

    return node.value;
  }

  /**
   * Write multiple tags
   */
  writeMultiple(tagValues) {
    const results = {};
    for (const [path, value] of Object.entries(tagValues)) {
      try {
        results[path] = this.write(path, value);
      } catch (e) {
        results[path] = { error: e.message };
      }
    }
    return results;
  }

  /**
   * Subscribe to tag changes
   */
  subscribe(path, callback) {
    const node = this.getNode(path);
    if (!node) {
      throw new Error(`Tag not found: ${path}`);
    }
    return node.subscribe(callback);
  }

  /**
   * Get all tags matching a pattern (glob-style)
   */
  find(pattern) {
    const regex = new RegExp(
      '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
    );
    const matches = [];

    for (const [path, node] of this.flatTags) {
      if (regex.test(path)) {
        matches.push(node.toJSON());
      }
    }

    return matches;
  }

  /**
   * Get all tags for a unit
   */
  getUnitTags(unitId) {
    return this.find(`${unitId}.*`);
  }

  /**
   * Get UDT template
   */
  getUDT(udtType) {
    return this.udtTemplates.get(udtType);
  }

  /**
   * List all loaded UDT types
   */
  listUDTs() {
    return Array.from(this.udtTemplates.keys());
  }

  /**
   * Export tags to JSON (for saving state)
   */
  exportToJSON(path = '') {
    const node = path ? this.getNode(path) : this.root;
    if (!node) return null;

    return this._exportNode(node);
  }

  _exportNode(node) {
    if (node.nodeType === 'tag') {
      return node.value?.value;
    }

    const result = {};
    for (const [name, child] of node.children) {
      result[name] = this._exportNode(child);
    }
    return result;
  }

  /**
   * Save tag instance to file
   */
  saveInstance(path, filePath) {
    const data = this.exportToJSON(path);
    const node = this.getNode(path);

    const instance = {
      tagName: path,
      udtType: node?.udtType,
      description: node?.description,
      values: data
    };

    writeFileSync(filePath, JSON.stringify(instance, null, 2));
    return instance;
  }

  /**
   * Get tag statistics
   */
  getStats() {
    let tagCount = 0;
    let udtCount = 0;
    let folderCount = 0;

    for (const node of this.flatTags.values()) {
      switch (node.nodeType) {
        case 'tag': tagCount++; break;
        case 'udt': udtCount++; break;
        case 'folder': folderCount++; break;
      }
    }

    return {
      totalNodes: this.flatTags.size,
      tags: tagCount,
      udts: udtCount,
      folders: folderCount,
      udtTemplates: this.udtTemplates.size
    };
  }
}

/**
 * Create and initialize a TagBrowser
 */
export function createTagBrowser() {
  const browser = new TagBrowser();
  browser.loadUDTs();
  browser.loadInstances();
  return browser;
}

/**
 * Singleton instance
 */
let browserInstance = null;

export function getTagBrowser() {
  if (!browserInstance) {
    browserInstance = createTagBrowser();
  }
  return browserInstance;
}

export default TagBrowser;
