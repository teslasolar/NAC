/**
 * NAC UDT Loader - User Defined Type system for reusable components
 * Similar to Ignition Perspective UDTs
 */

const UDT = {
  cache: {},

  // Register a UDT definition inline (for bundled builds)
  define(name, template, styles) {
    this.cache[name] = { template, styles };
  },

  // Create instance of UDT with props
  create(name, props = {}) {
    const def = this.cache[name];
    if (!def) {
      console.warn(`UDT "${name}" not found`);
      return document.createElement('div');
    }

    // Parse template
    const wrapper = document.createElement('div');
    wrapper.innerHTML = def.template.trim();
    const el = wrapper.firstElementChild;

    // Bind props
    el.querySelectorAll('[data-bind]').forEach(node => {
      const key = node.dataset.bind;
      if (props[key] !== undefined) {
        node.textContent = props[key];
      }
    });

    // Set data attributes
    Object.entries(props).forEach(([key, val]) => {
      if (key.startsWith('data-') || key === 'status' || key === 'priority') {
        el.dataset[key.replace('data-', '')] = val;
      }
    });

    // Handle click/screen navigation
    if (props.screen) {
      el.dataset.screen = props.screen;
      el.style.cursor = 'pointer';
      el.onclick = () => {
        if (typeof loadScreen === 'function') loadScreen(props.screen);
      };
    }

    if (props.href) {
      el.querySelector('a')?.setAttribute('href', props.href);
    }

    return el;
  },

  // Render multiple UDTs into a container
  renderList(containerSelector, udtName, items) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = '';
    items.forEach(props => {
      container.appendChild(this.create(udtName, props));
    });
  }
};

// Pre-define common UDTs inline for zero-fetch usage
UDT.define('kpi-card', `
  <div class="kpi-card">
    <div class="kpi-value" data-bind="value">0</div>
    <div class="kpi-label" data-bind="label">Label</div>
    <div class="kpi-trend" data-bind="trend"></div>
  </div>
`);

UDT.define('panel', `
  <div class="panel">
    <div class="panel-header" data-bind="title">Panel</div>
    <div class="panel-content" data-bind="content"></div>
  </div>
`);

UDT.define('status-badge', `
  <span class="status-badge" data-bind="text">OK</span>
`);

UDT.define('nav-item', `
  <div class="nav-item">
    <span class="icon" data-bind="icon">-</span>
    <span data-bind="label">Item</span>
    <span class="badge" data-bind="badge"></span>
  </div>
`);

UDT.define('alarm-item', `
  <div class="alarm-item">
    <span class="alarm-priority" data-bind="priority">info</span>
    <span class="alarm-message" data-bind="message">Message</span>
  </div>
`);

UDT.define('stat-row', `
  <div class="stat-row">
    <span class="stat-label" data-bind="label">Label</span>
    <span class="stat-value" data-bind="value">0</span>
  </div>
`);

UDT.define('page-header', `
  <div class="page-header">
    <h1 data-bind="title">Title</h1>
    <a href="scada.html" class="back-btn" data-bind="backText">Back</a>
  </div>
`);

UDT.define('progress-bar', `
  <div class="progress-bar">
    <div class="progress-fill" data-bind="percent" style="width: 0%"></div>
    <span class="progress-label" data-bind="label"></span>
  </div>
`);

// Export for module usage
if (typeof module !== 'undefined') module.exports = UDT;
