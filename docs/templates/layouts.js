/**
 * NAC Perspective - Layout Components
 * Flex, Grid, and Docking containers
 */

// ============================================
// FLEX CONTAINER - Flexible box layout
// ============================================
NAC.registerComponent('flex-container', {
  props: {
    direction: 'row', // row, column, row-reverse, column-reverse
    wrap: 'nowrap', // nowrap, wrap, wrap-reverse
    justify: 'flex-start', // flex-start, flex-end, center, space-between, space-around, space-evenly
    align: 'stretch', // stretch, flex-start, flex-end, center, baseline
    gap: '1rem',
    padding: '0',
    content: ''
  },
  template: `
    <div class="nac-flex" style="
      flex-direction: {{direction}};
      flex-wrap: {{wrap}};
      justify-content: {{justify}};
      align-items: {{align}};
      gap: {{gap}};
      padding: {{padding}};
    ">{{{content}}}</div>
  `,
  style: `
    .nac-flex {
      display: flex;
      width: 100%;
    }
  `
});

// ============================================
// GRID CONTAINER - CSS Grid layout
// ============================================
NAC.registerComponent('grid-container', {
  props: {
    columns: 'repeat(auto-fit, minmax(200px, 1fr))',
    rows: 'auto',
    gap: '1rem',
    padding: '1rem',
    areas: null, // grid-template-areas string
    content: ''
  },
  template: `
    <div class="nac-grid" style="
      grid-template-columns: {{columns}};
      grid-template-rows: {{rows}};
      gap: {{gap}};
      padding: {{padding}};
      {{#if areas}}grid-template-areas: {{areas}};{{/if}}
    ">{{{content}}}</div>
  `,
  style: `
    .nac-grid {
      display: grid;
      width: 100%;
    }
  `
});

// ============================================
// DOCK PANEL - Ignition-style docking layout
// ============================================
NAC.registerComponent('dock-panel', {
  props: {
    north: null, // {height, content}
    south: null, // {height, content}
    east: null,  // {width, content}
    west: null,  // {width, content}
    center: '',
    northHeight: '56px',
    southHeight: '32px',
    eastWidth: '280px',
    westWidth: '220px'
  },
  template: `
    <div class="nac-dock-panel">
      {{#if north}}
      <div class="nac-dock-north" style="height: {{northHeight}}">{{{north}}}</div>
      {{/if}}
      <div class="nac-dock-middle">
        {{#if west}}
        <div class="nac-dock-west" style="width: {{westWidth}}">{{{west}}}</div>
        {{/if}}
        <div class="nac-dock-center">{{{center}}}</div>
        {{#if east}}
        <div class="nac-dock-east" style="width: {{eastWidth}}">{{{east}}}</div>
        {{/if}}
      </div>
      {{#if south}}
      <div class="nac-dock-south" style="height: {{southHeight}}">{{{south}}}</div>
      {{/if}}
    </div>
  `,
  style: `
    .nac-dock-panel {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      overflow: hidden;
    }
    .nac-dock-north, .nac-dock-south {
      flex-shrink: 0;
      width: 100%;
    }
    .nac-dock-middle {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    .nac-dock-west, .nac-dock-east {
      flex-shrink: 0;
      overflow-y: auto;
    }
    .nac-dock-center {
      flex: 1;
      overflow: auto;
    }
  `
});

// ============================================
// CARD GRID - Grid of cards
// ============================================
NAC.registerComponent('card-grid', {
  props: {
    columns: 3,
    gap: '1rem',
    cards: [] // [{title, content, icon, status}]
  },
  template: `
    <div class="nac-card-grid" style="grid-template-columns: repeat({{columns}}, 1fr); gap: {{gap}}">
      {{#each cards}}
      <div class="nac-card nac-card-{{this.status}}">
        <div class="nac-card-header">
          {{#if this.icon}}<span class="icon">{{this.icon}}</span>{{/if}}
          <span class="title">{{this.title}}</span>
        </div>
        <div class="nac-card-body">{{{this.content}}}</div>
      </div>
      {{/each}}
    </div>
  `,
  style: `
    .nac-card-grid {
      display: grid;
    }
    .nac-card {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.2s;
    }
    .nac-card:hover {
      border-color: var(--accent, #3b82f6);
      transform: translateY(-2px);
    }
    .nac-card-header {
      padding: 0.75rem 1rem;
      background: var(--bg-surface, #1f2937);
      border-bottom: 1px solid var(--border, #374151);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nac-card-header .icon { font-size: 1rem; }
    .nac-card-header .title { font-weight: 500; font-size: 0.9rem; }
    .nac-card-body { padding: 1rem; }
    .nac-card-good { border-left: 3px solid var(--green, #22c55e); }
    .nac-card-warning { border-left: 3px solid var(--yellow, #f59e0b); }
    .nac-card-bad { border-left: 3px solid var(--red, #ef4444); }
  `
});

// ============================================
// SPLIT PANEL - Resizable split view
// ============================================
NAC.registerComponent('split-panel', {
  props: {
    direction: 'horizontal', // horizontal, vertical
    initialSplit: 50, // percentage
    minSize: 100, // minimum panel size in px
    left: '',
    right: '',
    top: '',
    bottom: ''
  },
  template: `
    <div class="nac-split nac-split-{{direction}}">
      <div class="nac-split-pane nac-split-first" style="flex: {{initialSplit}}">
        {{{left}}}{{{top}}}
      </div>
      <div class="nac-split-handle"></div>
      <div class="nac-split-pane nac-split-second" style="flex: calc(100 - {{initialSplit}})">
        {{{right}}}{{{bottom}}}
      </div>
    </div>
  `,
  style: `
    .nac-split {
      display: flex;
      width: 100%;
      height: 100%;
    }
    .nac-split-horizontal { flex-direction: row; }
    .nac-split-vertical { flex-direction: column; }
    .nac-split-pane {
      overflow: auto;
    }
    .nac-split-handle {
      flex-shrink: 0;
      background: var(--border, #374151);
      transition: background 0.2s;
    }
    .nac-split-handle:hover {
      background: var(--accent, #3b82f6);
    }
    .nac-split-horizontal .nac-split-handle {
      width: 4px;
      cursor: col-resize;
    }
    .nac-split-vertical .nac-split-handle {
      height: 4px;
      cursor: row-resize;
    }
  `
});

// ============================================
// TAB CONTAINER - Tabbed interface
// ============================================
NAC.registerComponent('tab-container', {
  props: {
    tabs: [], // [{id, label, icon, content}]
    activeTab: 0,
    position: 'top' // top, bottom, left, right
  },
  template: `
    <div class="nac-tabs nac-tabs-{{position}}">
      <div class="nac-tab-list">
        {{#each tabs}}
        <button class="nac-tab {{#if @index}}{{else}}active{{/if}}" data-tab-id="{{@index}}">
          {{#if this.icon}}<span class="tab-icon">{{this.icon}}</span>{{/if}}
          <span class="tab-label">{{this.label}}</span>
        </button>
        {{/each}}
      </div>
      <div class="nac-tab-panels">
        {{#each tabs}}
        <div class="nac-tab-panel {{#if @index}}{{else}}active{{/if}}" data-panel-id="{{@index}}">
          {{{this.content}}}
        </div>
        {{/each}}
      </div>
    </div>
  `,
  style: `
    .nac-tabs {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .nac-tabs-bottom { flex-direction: column-reverse; }
    .nac-tabs-left { flex-direction: row; }
    .nac-tabs-right { flex-direction: row-reverse; }

    .nac-tab-list {
      display: flex;
      background: var(--bg-surface, #1f2937);
      border-bottom: 1px solid var(--border, #374151);
      overflow-x: auto;
    }
    .nac-tabs-left .nac-tab-list,
    .nac-tabs-right .nac-tab-list {
      flex-direction: column;
      border-bottom: none;
      border-right: 1px solid var(--border);
    }
    .nac-tabs-right .nac-tab-list { border-right: none; border-left: 1px solid var(--border); }
    .nac-tabs-bottom .nac-tab-list { border-bottom: none; border-top: 1px solid var(--border); }

    .nac-tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-dim, #9ca3af);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .nac-tab:hover {
      background: rgba(255,255,255,0.05);
      color: var(--text, #e5e7eb);
    }
    .nac-tab.active {
      color: var(--accent, #3b82f6);
      border-bottom-color: var(--accent);
    }
    .nac-tab-panels {
      flex: 1;
      overflow: hidden;
    }
    .nac-tab-panel {
      display: none;
      height: 100%;
      overflow: auto;
      padding: 1rem;
    }
    .nac-tab-panel.active { display: block; }
  `,
  onMount(props) {
    const tabs = this.querySelectorAll('.nac-tab');
    const panels = this.querySelectorAll('.nac-tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tabId;

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        this.querySelector(`[data-panel-id="${id}"]`).classList.add('active');
      });
    });
  }
});

// ============================================
// ACCORDION - Collapsible sections
// ============================================
NAC.registerComponent('accordion', {
  props: {
    sections: [], // [{title, icon, content, expanded}]
    allowMultiple: false
  },
  template: `
    <div class="nac-accordion">
      {{#each sections}}
      <div class="nac-accordion-section {{#if this.expanded}}expanded{{/if}}">
        <button class="nac-accordion-header" data-section="{{@index}}">
          {{#if this.icon}}<span class="icon">{{this.icon}}</span>{{/if}}
          <span class="title">{{this.title}}</span>
          <span class="toggle">▼</span>
        </button>
        <div class="nac-accordion-content">
          <div class="nac-accordion-body">{{{this.content}}}</div>
        </div>
      </div>
      {{/each}}
    </div>
  `,
  style: `
    .nac-accordion {
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      overflow: hidden;
    }
    .nac-accordion-section {
      border-bottom: 1px solid var(--border, #374151);
    }
    .nac-accordion-section:last-child { border-bottom: none; }
    .nac-accordion-header {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--bg-surface, #1f2937);
      border: none;
      color: var(--text, #e5e7eb);
      font-size: 0.9rem;
      cursor: pointer;
      text-align: left;
    }
    .nac-accordion-header:hover { background: rgba(255,255,255,0.05); }
    .nac-accordion-header .title { flex: 1; font-weight: 500; }
    .nac-accordion-header .toggle {
      transition: transform 0.2s;
      color: var(--text-dim, #9ca3af);
    }
    .nac-accordion-section.expanded .nac-accordion-header .toggle {
      transform: rotate(180deg);
    }
    .nac-accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    .nac-accordion-section.expanded .nac-accordion-content {
      max-height: 500px;
    }
    .nac-accordion-body {
      padding: 1rem;
      background: var(--bg-panel, #111827);
    }
  `,
  onMount(props) {
    const sections = this.querySelectorAll('.nac-accordion-section');

    this.querySelectorAll('.nac-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const section = header.closest('.nac-accordion-section');

        if (!props.allowMultiple) {
          sections.forEach(s => {
            if (s !== section) s.classList.remove('expanded');
          });
        }

        section.classList.toggle('expanded');
      });
    });
  }
});

// ============================================
// BREADCRUMB - Navigation breadcrumb
// ============================================
NAC.registerComponent('breadcrumb', {
  props: {
    items: [], // [{label, url, icon}]
    separator: '/'
  },
  template: `
    <nav class="nac-breadcrumb">
      {{#each items}}
      <span class="nac-breadcrumb-item">
        {{#if this.url}}
        <a href="{{this.url}}">
          {{#if this.icon}}<span class="icon">{{this.icon}}</span>{{/if}}
          {{this.label}}
        </a>
        {{else}}
        <span>
          {{#if this.icon}}<span class="icon">{{this.icon}}</span>{{/if}}
          {{this.label}}
        </span>
        {{/if}}
      </span>
      {{/each}}
    </nav>
  `,
  style: `
    .nac-breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }
    .nac-breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .nac-breadcrumb-item:not(:last-child)::after {
      content: '/';
      margin-left: 0.5rem;
      color: var(--text-dim, #9ca3af);
    }
    .nac-breadcrumb-item a {
      color: var(--accent, #3b82f6);
      text-decoration: none;
    }
    .nac-breadcrumb-item a:hover { text-decoration: underline; }
    .nac-breadcrumb-item:last-child span {
      color: var(--text, #e5e7eb);
    }
    .nac-breadcrumb-item .icon { font-size: 0.9rem; }
  `
});

console.log('NAC Layout Components loaded');
