/**
 * NAC Perspective - Core Components
 * Reusable UI components for county dashboards
 */

// ============================================
// KPI CARD - Key Performance Indicator display
// ============================================
NAC.registerComponent('kpi-card', {
  props: {
    value: '0',
    label: 'Metric',
    target: null,
    unit: '',
    prefix: '',
    status: 'neutral', // good, warning, bad, neutral
    icon: null,
    trend: null, // up, down, flat
    trendValue: null,
    size: 'medium' // small, medium, large
  },
  template: `
    <div class="nac-kpi-card nac-kpi-{{size}} nac-kpi-{{status}}">
      {{#if icon}}<div class="nac-kpi-icon">{{icon}}</div>{{/if}}
      <div class="nac-kpi-value">
        <span class="prefix">{{prefix}}</span>
        <span class="value">{{value}}</span>
        <span class="unit">{{unit}}</span>
      </div>
      <div class="nac-kpi-label">{{label}}</div>
      {{#if target}}<div class="nac-kpi-target">Target: {{target}}</div>{{/if}}
      {{#if trend}}
      <div class="nac-kpi-trend nac-trend-{{trend}}">
        <span class="trend-arrow"></span>
        <span class="trend-value">{{trendValue}}</span>
      </div>
      {{/if}}
    </div>
  `,
  style: `
    .nac-kpi-card {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: all 0.2s;
    }
    .nac-kpi-card:hover {
      border-color: var(--accent, #3b82f6);
      transform: translateY(-2px);
    }
    .nac-kpi-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .nac-kpi-value {
      font-family: 'Consolas', 'Monaco', monospace;
    }
    .nac-kpi-value .value {
      font-size: 1.75rem;
      font-weight: 700;
    }
    .nac-kpi-value .prefix, .nac-kpi-value .unit {
      font-size: 1rem;
      opacity: 0.7;
    }
    .nac-kpi-label {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
      margin-top: 0.25rem;
    }
    .nac-kpi-target {
      font-size: 0.65rem;
      color: var(--text-dim, #9ca3af);
      margin-top: 0.5rem;
    }
    .nac-kpi-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      margin-top: 0.5rem;
      font-size: 0.75rem;
    }
    .nac-trend-up .trend-arrow::before { content: '▲'; color: var(--green, #22c55e); }
    .nac-trend-down .trend-arrow::before { content: '▼'; color: var(--red, #ef4444); }
    .nac-trend-flat .trend-arrow::before { content: '━'; color: var(--yellow, #f59e0b); }

    .nac-kpi-good .nac-kpi-value .value { color: var(--green, #22c55e); }
    .nac-kpi-warning .nac-kpi-value .value { color: var(--yellow, #f59e0b); }
    .nac-kpi-bad .nac-kpi-value .value { color: var(--red, #ef4444); }
    .nac-kpi-neutral .nac-kpi-value .value { color: var(--cyan, #06b6d4); }

    .nac-kpi-small { padding: 0.75rem; }
    .nac-kpi-small .nac-kpi-value .value { font-size: 1.25rem; }
    .nac-kpi-large { padding: 1.5rem; }
    .nac-kpi-large .nac-kpi-value .value { font-size: 2.5rem; }
  `
});

// ============================================
// PANEL - Container with header
// ============================================
NAC.registerComponent('panel', {
  props: {
    title: 'Panel',
    subtitle: null,
    icon: null,
    collapsible: false,
    collapsed: false,
    actions: [], // [{label, icon, action}]
    content: ''
  },
  template: `
    <div class="nac-panel {{#if collapsed}}collapsed{{/if}}">
      <div class="nac-panel-header">
        <div class="nac-panel-title">
          {{#if icon}}<span class="icon">{{icon}}</span>{{/if}}
          <span class="title">{{title}}</span>
          {{#if subtitle}}<span class="subtitle">{{subtitle}}</span>{{/if}}
        </div>
        <div class="nac-panel-actions">
          {{#each actions}}
          <button class="nac-panel-action" data-nac-click="{{this.action}}">
            {{this.icon}} {{this.label}}
          </button>
          {{/each}}
          {{#if collapsible}}
          <button class="nac-panel-toggle" data-nac-click="toggle">▼</button>
          {{/if}}
        </div>
      </div>
      <div class="nac-panel-content">{{{content}}}</div>
    </div>
  `,
  style: `
    .nac-panel {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      overflow: hidden;
    }
    .nac-panel-header {
      background: var(--bg-surface, #1f2937);
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border, #374151);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nac-panel-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nac-panel-title .icon { font-size: 1rem; }
    .nac-panel-title .title { font-weight: 500; font-size: 0.9rem; }
    .nac-panel-title .subtitle { font-size: 0.75rem; color: var(--text-dim, #9ca3af); }
    .nac-panel-actions {
      display: flex;
      gap: 0.5rem;
    }
    .nac-panel-action {
      background: transparent;
      border: 1px solid var(--border, #374151);
      color: var(--text-dim, #9ca3af);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .nac-panel-action:hover {
      background: var(--bg-surface, #1f2937);
      color: var(--text, #e5e7eb);
    }
    .nac-panel-toggle {
      background: transparent;
      border: none;
      color: var(--text-dim, #9ca3af);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .nac-panel.collapsed .nac-panel-toggle { transform: rotate(-90deg); }
    .nac-panel.collapsed .nac-panel-content { display: none; }
    .nac-panel-content {
      padding: 1rem;
      max-height: 400px;
      overflow-y: auto;
    }
  `,
  methods: {
    toggle(props, event) {
      this.classList.toggle('collapsed');
    }
  }
});

// ============================================
// DATA TABLE - Sortable data grid
// ============================================
NAC.registerComponent('data-table', {
  props: {
    columns: [], // [{key, label, width, sortable, format}]
    data: [],
    sortKey: null,
    sortDir: 'asc',
    selectable: false,
    striped: true,
    compact: false,
    emptyMessage: 'No data available'
  },
  template: `
    <div class="nac-table-wrapper {{#if compact}}compact{{/if}}">
      <table class="nac-data-table {{#if striped}}striped{{/if}}">
        <thead>
          <tr>
            {{#each columns}}
            <th style="{{#if this.width}}width:{{this.width}}{{/if}}"
                class="{{#if this.sortable}}sortable{{/if}}"
                data-key="{{this.key}}">
              {{this.label}}
              {{#if this.sortable}}<span class="sort-indicator">↕</span>{{/if}}
            </th>
            {{/each}}
          </tr>
        </thead>
        <tbody data-nac-slot="body">
        </tbody>
      </table>
      <div class="nac-table-empty" style="display:none">{{emptyMessage}}</div>
    </div>
  `,
  style: `
    .nac-table-wrapper {
      overflow-x: auto;
    }
    .nac-data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .nac-data-table th {
      background: var(--bg-surface, #1f2937);
      padding: 0.75rem;
      text-align: left;
      font-weight: 500;
      color: var(--text-dim, #9ca3af);
      border-bottom: 2px solid var(--border, #374151);
      white-space: nowrap;
    }
    .nac-data-table th.sortable {
      cursor: pointer;
      user-select: none;
    }
    .nac-data-table th.sortable:hover {
      color: var(--accent, #3b82f6);
    }
    .nac-data-table th .sort-indicator {
      margin-left: 0.5rem;
      opacity: 0.5;
    }
    .nac-data-table th.sort-asc .sort-indicator::after { content: '▲'; }
    .nac-data-table th.sort-desc .sort-indicator::after { content: '▼'; }
    .nac-data-table td {
      padding: 0.75rem;
      border-bottom: 1px solid var(--border, #374151);
    }
    .nac-data-table.striped tbody tr:nth-child(even) {
      background: rgba(255,255,255,0.02);
    }
    .nac-data-table tbody tr:hover {
      background: rgba(59, 130, 246, 0.1);
    }
    .nac-table-wrapper.compact .nac-data-table td,
    .nac-table-wrapper.compact .nac-data-table th {
      padding: 0.5rem;
      font-size: 0.8rem;
    }
    .nac-table-empty {
      text-align: center;
      padding: 2rem;
      color: var(--text-dim, #9ca3af);
    }
  `,
  onMount(props) {
    const tbody = this.querySelector('tbody');
    const emptyMsg = this.querySelector('.nac-table-empty');

    if (!props.data || props.data.length === 0) {
      emptyMsg.style.display = 'block';
      return;
    }

    // Render rows
    props.data.forEach(row => {
      const tr = document.createElement('tr');
      props.columns.forEach(col => {
        const td = document.createElement('td');
        let value = row[col.key];

        // Apply format if specified
        if (col.format) {
          value = col.format(value, row);
        }

        td.innerHTML = value !== undefined ? value : '';
        if (col.class) td.className = col.class;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // Setup sorting
    this.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        // Implement sorting logic
        console.log('Sort by:', key);
      });
    });
  }
});

// ============================================
// STATUS BADGE - Status indicator
// ============================================
NAC.registerComponent('status-badge', {
  props: {
    status: 'info', // success, warning, error, info, pending
    label: '',
    size: 'medium', // small, medium, large
    pulse: false,
    icon: null
  },
  template: `
    <span class="nac-badge nac-badge-{{status}} nac-badge-{{size}} {{#if pulse}}pulse{{/if}}">
      {{#if icon}}<span class="badge-icon">{{icon}}</span>{{/if}}
      <span class="badge-label">{{label}}</span>
    </span>
  `,
  style: `
    .nac-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .nac-badge-small { padding: 0.15rem 0.5rem; font-size: 0.65rem; }
    .nac-badge-large { padding: 0.35rem 1rem; font-size: 0.85rem; }

    .nac-badge-success { background: rgba(34,197,94,0.2); color: #22c55e; }
    .nac-badge-warning { background: rgba(245,158,11,0.2); color: #f59e0b; }
    .nac-badge-error { background: rgba(239,68,68,0.2); color: #ef4444; }
    .nac-badge-info { background: rgba(59,130,246,0.2); color: #3b82f6; }
    .nac-badge-pending { background: rgba(156,163,175,0.2); color: #9ca3af; }

    .nac-badge.pulse .badge-icon::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      margin-right: 0.25rem;
      animation: badge-pulse 2s infinite;
    }
    @keyframes badge-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `
});

// ============================================
// PROGRESS BAR - Linear progress indicator
// ============================================
NAC.registerComponent('progress-bar', {
  props: {
    value: 0,
    max: 100,
    label: '',
    showValue: true,
    status: 'default', // default, success, warning, error
    size: 'medium', // small, medium, large
    segments: null // [{value, color, label}] for multi-segment
  },
  template: `
    <div class="nac-progress nac-progress-{{size}}">
      {{#if label}}<div class="nac-progress-label">{{label}}</div>{{/if}}
      <div class="nac-progress-track">
        <div class="nac-progress-fill nac-progress-{{status}}" style="width: calc({{value}} / {{max}} * 100%)"></div>
      </div>
      {{#if showValue}}<div class="nac-progress-value">{{value}}%</div>{{/if}}
    </div>
  `,
  style: `
    .nac-progress {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .nac-progress-label {
      min-width: 80px;
      font-size: 0.8rem;
      color: var(--text-dim, #9ca3af);
    }
    .nac-progress-track {
      flex: 1;
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    .nac-progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .nac-progress-default { background: var(--accent, #3b82f6); }
    .nac-progress-success { background: var(--green, #22c55e); }
    .nac-progress-warning { background: var(--yellow, #f59e0b); }
    .nac-progress-error { background: var(--red, #ef4444); }
    .nac-progress-value {
      min-width: 50px;
      text-align: right;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .nac-progress-small .nac-progress-track { height: 4px; }
    .nac-progress-large .nac-progress-track { height: 12px; }
  `
});

// ============================================
// FILTER BAR - Search and filter controls
// ============================================
NAC.registerComponent('filter-bar', {
  props: {
    searchPlaceholder: 'Search...',
    filters: [], // [{key, label, options: [{value, label}]}]
    showSearch: true,
    onFilter: null // callback function name
  },
  template: `
    <div class="nac-filter-bar">
      {{#if showSearch}}
      <div class="nac-filter-search">
        <input type="text" class="nac-search-input" placeholder="{{searchPlaceholder}}">
        <span class="nac-search-icon">🔍</span>
      </div>
      {{/if}}
      <div class="nac-filter-controls">
        {{#each filters}}
        <select class="nac-filter-select" data-filter-key="{{this.key}}">
          <option value="">{{this.label}}</option>
        </select>
        {{/each}}
      </div>
      <button class="nac-filter-btn nac-filter-apply">Apply</button>
      <button class="nac-filter-btn nac-filter-reset">Reset</button>
    </div>
  `,
  style: `
    .nac-filter-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-surface, #1f2937);
      border-radius: 8px;
      flex-wrap: wrap;
    }
    .nac-filter-search {
      position: relative;
      flex: 1;
      min-width: 200px;
    }
    .nac-search-input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 6px;
      color: var(--text, #e5e7eb);
      font-size: 0.9rem;
    }
    .nac-search-input:focus {
      outline: none;
      border-color: var(--accent, #3b82f6);
    }
    .nac-search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.5;
    }
    .nac-filter-controls {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .nac-filter-select {
      padding: 0.6rem 1rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 6px;
      color: var(--text, #e5e7eb);
      font-size: 0.85rem;
      cursor: pointer;
    }
    .nac-filter-btn {
      padding: 0.6rem 1.25rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }
    .nac-filter-apply {
      background: var(--accent, #3b82f6);
      border: none;
      color: #fff;
    }
    .nac-filter-apply:hover { opacity: 0.9; }
    .nac-filter-reset {
      background: transparent;
      border: 1px solid var(--border, #374151);
      color: var(--text-dim, #9ca3af);
    }
    .nac-filter-reset:hover {
      background: var(--bg-panel, #111827);
      color: var(--text, #e5e7eb);
    }
  `,
  onMount(props) {
    // Populate filter options
    props.filters.forEach(filter => {
      const select = this.querySelector(`[data-filter-key="${filter.key}"]`);
      if (select && filter.options) {
        filter.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          select.appendChild(option);
        });
      }
    });
  }
});

// ============================================
// ALARM ITEM - Alert/notification display
// ============================================
NAC.registerComponent('alarm-item', {
  props: {
    id: '',
    priority: 'info', // high, medium, low, info
    message: '',
    timestamp: null,
    acknowledged: false,
    source: ''
  },
  template: `
    <div class="nac-alarm nac-alarm-{{priority}} {{#if acknowledged}}acknowledged{{/if}}">
      <div class="nac-alarm-priority">{{priority}}</div>
      <div class="nac-alarm-content">
        <div class="nac-alarm-message">{{message}}</div>
        <div class="nac-alarm-meta">
          {{#if source}}<span class="source">{{source}}</span>{{/if}}
          {{#if timestamp}}<span class="time">{{timestamp}}</span>{{/if}}
        </div>
      </div>
      <button class="nac-alarm-ack" data-nac-click="acknowledge">ACK</button>
    </div>
  `,
  style: `
    .nac-alarm {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      background: var(--bg-surface, #1f2937);
      transition: all 0.2s;
    }
    .nac-alarm:hover { background: rgba(255,255,255,0.05); }
    .nac-alarm.acknowledged { opacity: 0.5; }

    .nac-alarm-high { border-left: 3px solid var(--red, #ef4444); }
    .nac-alarm-medium { border-left: 3px solid var(--yellow, #f59e0b); }
    .nac-alarm-low { border-left: 3px solid var(--cyan, #06b6d4); }
    .nac-alarm-info { border-left: 3px solid var(--text-dim, #9ca3af); }

    .nac-alarm-priority {
      font-size: 0.65rem;
      text-transform: uppercase;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      min-width: 50px;
      text-align: center;
    }
    .nac-alarm-high .nac-alarm-priority { background: rgba(239,68,68,0.2); color: var(--red); }
    .nac-alarm-medium .nac-alarm-priority { background: rgba(245,158,11,0.2); color: var(--yellow); }
    .nac-alarm-low .nac-alarm-priority { background: rgba(6,182,212,0.2); color: var(--cyan); }
    .nac-alarm-info .nac-alarm-priority { background: rgba(156,163,175,0.2); color: var(--text-dim); }

    .nac-alarm-content { flex: 1; }
    .nac-alarm-message { font-size: 0.85rem; }
    .nac-alarm-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
      margin-top: 0.25rem;
    }
    .nac-alarm-ack {
      background: transparent;
      border: 1px solid var(--border, #374151);
      color: var(--text-dim, #9ca3af);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.7rem;
      cursor: pointer;
    }
    .nac-alarm-ack:hover {
      background: var(--accent, #3b82f6);
      border-color: var(--accent);
      color: #fff;
    }
  `,
  methods: {
    acknowledge(props, event) {
      this.classList.add('acknowledged');
      console.log('Acknowledged alarm:', props.id);
    }
  }
});

// ============================================
// MINI CHART - Small sparkline/bar chart
// ============================================
NAC.registerComponent('mini-chart', {
  props: {
    type: 'bar', // bar, line, sparkline
    data: [],
    color: '#3b82f6',
    height: 60,
    showLabels: false
  },
  template: `
    <div class="nac-mini-chart" style="height: {{height}}px">
      <div class="nac-chart-bars" data-nac-slot="bars"></div>
    </div>
  `,
  style: `
    .nac-mini-chart {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      padding: 0.5rem;
    }
    .nac-chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      width: 100%;
      height: 100%;
    }
    .nac-chart-bar {
      flex: 1;
      border-radius: 2px 2px 0 0;
      min-height: 2px;
      transition: height 0.3s ease;
    }
    .nac-chart-bar:hover {
      opacity: 0.8;
    }
  `,
  onMount(props) {
    const container = this.querySelector('.nac-chart-bars');
    if (!props.data || props.data.length === 0) return;

    const max = Math.max(...props.data);
    props.data.forEach(value => {
      const bar = document.createElement('div');
      bar.className = 'nac-chart-bar';
      bar.style.height = `${(value / max) * 100}%`;
      bar.style.background = props.color;
      bar.title = value;
      container.appendChild(bar);
    });
  }
});

// ============================================
// STAT ROW - Horizontal stat display
// ============================================
NAC.registerComponent('stat-row', {
  props: {
    label: '',
    value: '',
    subvalue: null,
    icon: null,
    status: 'neutral'
  },
  template: `
    <div class="nac-stat-row">
      <div class="nac-stat-left">
        {{#if icon}}<span class="icon">{{icon}}</span>{{/if}}
        <span class="label">{{label}}</span>
      </div>
      <div class="nac-stat-right nac-stat-{{status}}">
        <span class="value">{{value}}</span>
        {{#if subvalue}}<span class="subvalue">{{subvalue}}</span>{{/if}}
      </div>
    </div>
  `,
  style: `
    .nac-stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0;
      border-bottom: 1px solid var(--border, #374151);
    }
    .nac-stat-row:last-child { border-bottom: none; }
    .nac-stat-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-dim, #9ca3af);
      font-size: 0.85rem;
    }
    .nac-stat-left .icon { font-size: 1rem; }
    .nac-stat-right {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .nac-stat-right .value {
      font-weight: 600;
      font-family: 'Consolas', monospace;
    }
    .nac-stat-right .subvalue {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .nac-stat-good .value { color: var(--green, #22c55e); }
    .nac-stat-warning .value { color: var(--yellow, #f59e0b); }
    .nac-stat-bad .value { color: var(--red, #ef4444); }
  `
});

console.log('NAC Core Components loaded:', Object.keys(NAC.components).length, 'components');
