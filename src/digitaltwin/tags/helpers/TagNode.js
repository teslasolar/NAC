/**
 * TagNode - Node in the tag browse tree
 *
 * Represents a single node (folder, UDT instance, or leaf tag)
 * in the hierarchical tag structure.
 *
 * @module digitaltwin/tags/helpers/TagNode
 */

/**
 * Tag node in the browse tree
 */
export class TagNode {
  constructor(name, path, nodeType = 'folder') {
    this.name = name;
    this.path = path;
    this.nodeType = nodeType; // folder, udt, tag
    this.dataType = null;
    this.udtType = null;
    this.description = '';
    this.children = new Map();
    this.value = null;
    this.writable = true;
    this.subscribers = [];
  }

  addChild(name, node) {
    this.children.set(name, node);
    return node;
  }

  getChild(name) {
    return this.children.get(name);
  }

  hasChildren() {
    return this.children.size > 0;
  }

  getChildNames() {
    return Array.from(this.children.keys());
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers(oldValue, newValue) {
    for (const callback of this.subscribers) {
      try {
        callback(newValue, oldValue, this.path);
      } catch (e) {
        console.error(`Subscriber error for ${this.path}:`, e);
      }
    }
  }

  toJSON() {
    return {
      name: this.name,
      path: this.path,
      nodeType: this.nodeType,
      dataType: this.dataType,
      udtType: this.udtType,
      description: this.description,
      hasChildren: this.hasChildren(),
      childCount: this.children.size,
      writable: this.writable,
      value: this.value?.toJSON()
    };
  }
}

export default TagNode;
