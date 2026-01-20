/**
 * NAC Perspective - Template Engine
 * Inspired by Ignition Perspective's component-based architecture
 *
 * Features:
 * - Reusable view components
 * - Property bindings (one-way and two-way)
 * - Event delegation
 * - Nested/embedded views
 * - Style inheritance
 */

const NAC = window.NAC || {};

// Component Registry
NAC.components = {};

// Active bindings for reactive updates
NAC.bindings = new Map();

// Data store for component state
NAC.store = {
  data: {},
  subscribers: new Map(),

  set(path, value) {
    const parts = path.split('.');
    let obj = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    this.notify(path);
  },

  get(path) {
    const parts = path.split('.');
    let obj = this.data;
    for (const part of parts) {
      if (obj === undefined) return undefined;
      obj = obj[part];
    }
    return obj;
  },

  subscribe(path, callback) {
    if (!this.subscribers.has(path)) {
      this.subscribers.set(path, new Set());
    }
    this.subscribers.get(path).add(callback);
    return () => this.subscribers.get(path).delete(callback);
  },

  notify(path) {
    // Notify exact path subscribers
    if (this.subscribers.has(path)) {
      this.subscribers.get(path).forEach(cb => cb(this.get(path)));
    }
    // Notify parent path subscribers
    const parts = path.split('.');
    for (let i = parts.length - 1; i > 0; i--) {
      const parentPath = parts.slice(0, i).join('.');
      if (this.subscribers.has(parentPath)) {
        this.subscribers.get(parentPath).forEach(cb => cb(this.get(parentPath)));
      }
    }
  }
};

/**
 * Register a component template
 */
NAC.registerComponent = function(name, definition) {
  this.components[name] = {
    name,
    props: definition.props || {},
    template: definition.template,
    style: definition.style || '',
    methods: definition.methods || {},
    onMount: definition.onMount,
    onDestroy: definition.onDestroy
  };

  // Inject component styles once
  if (definition.style && !document.getElementById(`nac-style-${name}`)) {
    const styleEl = document.createElement('style');
    styleEl.id = `nac-style-${name}`;
    styleEl.textContent = definition.style;
    document.head.appendChild(styleEl);
  }
};

/**
 * Render a component instance
 */
NAC.render = function(componentName, props = {}, container) {
  const def = this.components[componentName];
  if (!def) {
    console.error(`Component not found: ${componentName}`);
    return null;
  }

  // Merge default props with provided props
  const mergedProps = { ...def.props };
  for (const [key, value] of Object.entries(props)) {
    mergedProps[key] = value;
  }

  // Generate unique instance ID
  const instanceId = `nac-${componentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Render template with props
  let html = def.template;

  // Replace {{prop}} placeholders
  html = html.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, propPath) => {
    const value = getNestedValue(mergedProps, propPath);
    return value !== undefined ? escapeHtml(String(value)) : '';
  });

  // Replace {{{prop}}} for unescaped HTML
  html = html.replace(/\{\{\{(\w+(?:\.\w+)*)\}\}\}/g, (match, propPath) => {
    const value = getNestedValue(mergedProps, propPath);
    return value !== undefined ? String(value) : '';
  });

  // Handle conditional rendering {{#if prop}}...{{/if}}
  html = html.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, prop, content) => {
    return mergedProps[prop] ? content : '';
  });

  // Handle loops {{#each items}}...{{/each}}
  html = html.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, prop, template) => {
    const items = mergedProps[prop];
    if (!Array.isArray(items)) return '';
    return items.map((item, index) => {
      let itemHtml = template;
      // Replace {{this.prop}} with item properties
      itemHtml = itemHtml.replace(/\{\{this\.(\w+)\}\}/g, (m, key) => {
        return item[key] !== undefined ? escapeHtml(String(item[key])) : '';
      });
      // Replace {{@index}}
      itemHtml = itemHtml.replace(/\{\{@index\}\}/g, index);
      return itemHtml;
    }).join('');
  });

  // Create element
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const element = wrapper.firstElementChild || wrapper;
  element.setAttribute('data-nac-id', instanceId);
  element.setAttribute('data-nac-component', componentName);

  // Attach methods to element
  element._nacMethods = {};
  for (const [methodName, method] of Object.entries(def.methods)) {
    element._nacMethods[methodName] = method.bind(element, mergedProps);
  }

  // Process event bindings (onclick, onchange, etc.)
  element.querySelectorAll('[data-nac-click]').forEach(el => {
    const methodName = el.getAttribute('data-nac-click');
    el.addEventListener('click', (e) => {
      if (element._nacMethods[methodName]) {
        element._nacMethods[methodName](e);
      }
    });
  });

  // Mount to container if provided
  if (container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    container.appendChild(element);
  }

  // Call onMount lifecycle
  if (def.onMount) {
    def.onMount.call(element, mergedProps);
  }

  return element;
};

/**
 * Render multiple components into a container
 */
NAC.renderAll = function(components, container) {
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }
  container.innerHTML = '';

  components.forEach(comp => {
    this.render(comp.component, comp.props, container);
  });
};

/**
 * Create a view (composition of components)
 */
NAC.createView = function(name, definition) {
  this.views = this.views || {};
  this.views[name] = definition;
};

/**
 * Render a view
 */
NAC.renderView = function(viewName, container, params = {}) {
  const view = this.views[viewName];
  if (!view) {
    console.error(`View not found: ${viewName}`);
    return;
  }

  if (typeof container === 'string') {
    container = document.querySelector(container);
  }

  // Clear container
  container.innerHTML = '';

  // Build view structure
  const viewEl = document.createElement('div');
  viewEl.className = `nac-view nac-view-${viewName}`;
  viewEl.setAttribute('data-nac-view', viewName);

  // Render root layout
  if (view.root) {
    renderLayout(view.root, viewEl, params);
  }

  container.appendChild(viewEl);

  // Call view onMount
  if (view.onMount) {
    view.onMount.call(viewEl, params);
  }

  return viewEl;
};

/**
 * Render layout recursively
 */
function renderLayout(layout, parent, params) {
  const el = document.createElement('div');
  el.className = layout.class || '';

  if (layout.style) {
    Object.assign(el.style, layout.style);
  }

  // If it's a component reference
  if (layout.component) {
    const props = { ...layout.props };
    // Resolve param bindings
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'string' && value.startsWith('$params.')) {
        props[key] = getNestedValue(params, value.slice(8));
      }
    }
    const compEl = NAC.render(layout.component, props);
    if (compEl) {
      el.appendChild(compEl);
    }
  }

  // Render children
  if (layout.children) {
    layout.children.forEach(child => {
      renderLayout(child, el, params);
    });
  }

  parent.appendChild(el);
}

// Helper functions
function getNestedValue(obj, path) {
  const parts = path.split('.');
  let value = obj;
  for (const part of parts) {
    if (value === undefined || value === null) return undefined;
    value = value[part];
  }
  return value;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Export
window.NAC = NAC;

console.log('NAC Perspective Engine loaded');
