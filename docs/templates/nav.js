/**
 * NAC Perspective - Navigation Components
 * Headers, sidebars, menus, and navigation elements
 */

// ============================================
// NAV HEADER - Main application header
// ============================================
NAC.registerComponent('nav-header', {
  props: {
    title: 'NAC SCADA',
    subtitle: null,
    version: null,
    showStatus: true,
    status: 'online', // online, warning, offline
    alarmCount: 0,
    user: null,
    logo: null,
    onAlarmClick: null
  },
  template: `
    <header class="nac-nav-header">
      <div class="header-left">
        {{#if logo}}<img src="{{logo}}" alt="Logo" class="header-logo">{{/if}}
        <div class="header-title">
          <h1>{{title}}</h1>
          {{#if subtitle}}<span class="header-subtitle">{{subtitle}}</span>{{/if}}
        </div>
        {{#if version}}<span class="header-version">{{version}}</span>{{/if}}
      </div>
      <div class="header-center"></div>
      <div class="header-right">
        {{#if showStatus}}
        <div class="status-indicator status-{{status}}">
          <span class="status-dot"></span>
          <span class="status-text">{{status}}</span>
        </div>
        {{/if}}
        {{#if alarmCount}}
        <button class="alarm-badge" data-nac-click="showAlarms">
          {{alarmCount}} ALARMS
        </button>
        {{/if}}
        <div class="header-clock">
          <div class="clock-time">--:--:--</div>
          <div class="clock-date">---</div>
        </div>
        {{#if user}}
        <div class="header-user">
          <span class="user-avatar">👤</span>
          <span class="user-name">{{user}}</span>
        </div>
        {{/if}}
      </div>
    </header>
  `,
  style: `
    .nac-nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background: linear-gradient(180deg, #1e3a5f 0%, #0f2744 100%);
      border-bottom: 2px solid var(--accent, #3b82f6);
      height: 56px;
    }
    .header-left, .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .header-logo {
      height: 32px;
      width: auto;
    }
    .header-title h1 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #fff;
      margin: 0;
    }
    .header-subtitle {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
      margin-left: 0.5rem;
    }
    .header-version {
      font-size: 0.7rem;
      color: var(--cyan, #06b6d4);
      background: rgba(6, 182, 212, 0.2);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    .status-online .status-dot { background: var(--green, #22c55e); }
    .status-warning .status-dot { background: var(--yellow, #f59e0b); }
    .status-offline .status-dot { background: var(--red, #ef4444); }
    .status-text { text-transform: capitalize; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .alarm-badge {
      background: var(--yellow, #f59e0b);
      color: #000;
      border: none;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .alarm-badge:hover { background: #fbbf24; }
    .header-clock {
      text-align: right;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    .clock-time {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--cyan, #06b6d4);
    }
    .clock-date {
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
    }
    .header-user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }
    .user-avatar {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface, #1f2937);
      border-radius: 50%;
    }
  `,
  methods: {
    showAlarms(props) {
      if (props.onAlarmClick) props.onAlarmClick();
    }
  },
  onMount() {
    const updateClock = () => {
      const now = new Date();
      const time = this.querySelector('.clock-time');
      const date = this.querySelector('.clock-date');
      if (time) time.textContent = now.toLocaleTimeString('en-US', { hour12: false });
      if (date) date.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };
    updateClock();
    setInterval(updateClock, 1000);
  }
});

// ============================================
// SIDEBAR NAV - Vertical navigation menu
// ============================================
NAC.registerComponent('sidebar-nav', {
  props: {
    sections: [], // [{title, items: [{id, label, icon, badge, badgeColor, active}]}]
    collapsed: false,
    onSelect: null
  },
  template: `
    <nav class="nac-sidebar-nav {{#if collapsed}}collapsed{{/if}}">
      {{#each sections}}
      <div class="nav-section">
        <div class="nav-section-title">{{this.title}}</div>
        {{#each this.items}}
        <div class="nav-item {{#if this.active}}active{{/if}}" data-nav-id="{{this.id}}">
          <span class="nav-icon">{{this.icon}}</span>
          <span class="nav-label">{{this.label}}</span>
          {{#if this.badge}}
          <span class="nav-badge" style="{{#if this.badgeColor}}background:{{this.badgeColor}}{{/if}}">{{this.badge}}</span>
          {{/if}}
        </div>
        {{/each}}
      </div>
      {{/each}}
    </nav>
  `,
  style: `
    .nac-sidebar-nav {
      width: 220px;
      background: var(--bg-panel, #111827);
      border-right: 1px solid var(--border, #374151);
      overflow-y: auto;
      flex-shrink: 0;
    }
    .nac-sidebar-nav.collapsed { width: 60px; }
    .nac-sidebar-nav.collapsed .nav-label,
    .nac-sidebar-nav.collapsed .nav-section-title,
    .nac-sidebar-nav.collapsed .nav-badge { display: none; }
    .nav-section {
      padding: 0.75rem;
      border-bottom: 1px solid var(--border, #374151);
    }
    .nav-section-title {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-dim, #9ca3af);
      margin-bottom: 0.5rem;
      padding-left: 0.5rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
      font-size: 0.85rem;
      color: var(--text-dim, #9ca3af);
    }
    .nav-item:hover {
      background: var(--bg-surface, #1f2937);
      color: var(--text, #e5e7eb);
    }
    .nav-item.active {
      background: rgba(59, 130, 246, 0.2);
      color: var(--accent, #3b82f6);
      border-left: 3px solid var(--accent);
      margin-left: -3px;
    }
    .nav-icon {
      font-size: 1rem;
      width: 24px;
      text-align: center;
    }
    .nav-label { flex: 1; }
    .nav-badge {
      background: var(--yellow, #f59e0b);
      color: #000;
      font-size: 0.65rem;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-weight: 600;
    }
  `,
  onMount(props) {
    this.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        this.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (props.onSelect) props.onSelect(item.dataset.navId);
      });
    });
  }
});

// ============================================
// PAGE HEADER - Page-level header with actions
// ============================================
NAC.registerComponent('page-header', {
  props: {
    icon: '',
    title: '',
    breadcrumb: '',
    actions: [] // [{label, icon, onClick}]
  },
  template: `
    <div class="nac-page-header">
      <div class="page-title">
        <span class="page-icon">{{icon}}</span>
        <h2>{{title}}</h2>
        {{#if breadcrumb}}<span class="page-breadcrumb">{{breadcrumb}}</span>{{/if}}
      </div>
      <div class="page-actions">
        {{#each actions}}
        <button class="page-action-btn" data-action="{{@index}}">
          {{#if this.icon}}<span>{{this.icon}}</span>{{/if}}
          {{this.label}}
        </button>
        {{/each}}
      </div>
    </div>
  `,
  style: `
    .nac-page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: var(--bg-surface, #1f2937);
      border-bottom: 1px solid var(--border, #374151);
    }
    .page-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .page-icon { font-size: 1.25rem; }
    .page-title h2 {
      font-size: 1rem;
      font-weight: 500;
      margin: 0;
    }
    .page-breadcrumb {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .page-actions {
      display: flex;
      gap: 0.5rem;
    }
    .page-action-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      color: var(--text-dim, #9ca3af);
      padding: 0.4rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .page-action-btn:hover {
      background: var(--bg-surface, #1f2937);
      color: var(--text, #e5e7eb);
    }
  `
});

// ============================================
// STATUS BAR - Bottom status bar
// ============================================
NAC.registerComponent('status-bar', {
  props: {
    leftItems: [], // [{icon, label, status}]
    rightItems: [] // [{label}]
  },
  template: `
    <div class="nac-status-bar">
      <div class="status-left">
        {{#each leftItems}}
        <div class="status-item">
          {{#if this.status}}<span class="status-dot {{this.status}}"></span>{{/if}}
          <span>{{this.label}}</span>
        </div>
        {{/each}}
      </div>
      <div class="status-right">
        {{#each rightItems}}
        <span>{{this.label}}</span>
        {{/each}}
      </div>
    </div>
  `,
  style: `
    .nac-status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 1rem;
      background: var(--bg-panel, #111827);
      border-top: 1px solid var(--border, #374151);
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
      height: 32px;
    }
    .status-left, .status-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .status-right { gap: 1rem; }
    .status-right span:not(:last-child)::after {
      content: '|';
      margin-left: 1rem;
      opacity: 0.3;
    }
    .status-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .status-item .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .status-dot.green { background: var(--green, #22c55e); }
    .status-dot.yellow { background: var(--yellow, #f59e0b); }
    .status-dot.red { background: var(--red, #ef4444); }
  `
});

// ============================================
// TOOLBAR - Horizontal toolbar with buttons
// ============================================
NAC.registerComponent('toolbar', {
  props: {
    items: [], // [{id, icon, label, tooltip, active, divider}]
    onSelect: null
  },
  template: `
    <div class="nac-toolbar">
      {{#each items}}
      {{#if this.divider}}
      <div class="toolbar-divider"></div>
      {{else}}
      <button class="toolbar-btn {{#if this.active}}active{{/if}}" data-tool-id="{{this.id}}" title="{{this.tooltip}}">
        {{#if this.icon}}<span class="tool-icon">{{this.icon}}</span>{{/if}}
        {{#if this.label}}<span class="tool-label">{{this.label}}</span>{{/if}}
      </button>
      {{/if}}
      {{/each}}
    </div>
  `,
  style: `
    .nac-toolbar {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem;
      background: var(--bg-surface, #1f2937);
      border-radius: 6px;
    }
    .toolbar-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 0.75rem;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: var(--text-dim, #9ca3af);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .toolbar-btn:hover {
      background: var(--bg-panel, #111827);
      color: var(--text, #e5e7eb);
    }
    .toolbar-btn.active {
      background: rgba(59, 130, 246, 0.2);
      color: var(--accent, #3b82f6);
    }
    .tool-icon { font-size: 1rem; }
    .toolbar-divider {
      width: 1px;
      height: 24px;
      background: var(--border, #374151);
      margin: 0 0.5rem;
    }
  `,
  onMount(props) {
    this.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (props.onSelect) props.onSelect(btn.dataset.toolId);
      });
    });
  }
});

// ============================================
// DROPDOWN MENU - Popup menu
// ============================================
NAC.registerComponent('dropdown-menu', {
  props: {
    trigger: '', // HTML for trigger button
    items: [], // [{id, label, icon, divider, disabled}]
    align: 'left', // left, right
    onSelect: null
  },
  template: `
    <div class="nac-dropdown">
      <button class="dropdown-trigger">{{{trigger}}}</button>
      <div class="dropdown-menu dropdown-{{align}}">
        {{#each items}}
        {{#if this.divider}}
        <div class="dropdown-divider"></div>
        {{else}}
        <div class="dropdown-item {{#if this.disabled}}disabled{{/if}}" data-item-id="{{this.id}}">
          {{#if this.icon}}<span class="item-icon">{{this.icon}}</span>{{/if}}
          <span>{{this.label}}</span>
        </div>
        {{/if}}
        {{/each}}
      </div>
    </div>
  `,
  style: `
    .nac-dropdown {
      position: relative;
      display: inline-block;
    }
    .dropdown-trigger {
      background: var(--bg-surface, #1f2937);
      border: 1px solid var(--border, #374151);
      color: var(--text, #e5e7eb);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .dropdown-trigger:hover { background: var(--bg-panel, #111827); }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      margin-top: 4px;
      min-width: 180px;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: none;
      z-index: 100;
    }
    .nac-dropdown.open .dropdown-menu { display: block; }
    .dropdown-left { left: 0; }
    .dropdown-right { right: 0; }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 1rem;
      cursor: pointer;
      font-size: 0.85rem;
      transition: background 0.15s;
    }
    .dropdown-item:hover { background: var(--bg-surface, #1f2937); }
    .dropdown-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .dropdown-item:first-child { border-radius: 8px 8px 0 0; }
    .dropdown-item:last-child { border-radius: 0 0 8px 8px; }
    .item-icon { font-size: 1rem; width: 20px; }
    .dropdown-divider {
      height: 1px;
      background: var(--border, #374151);
      margin: 0.25rem 0;
    }
  `,
  onMount(props) {
    const trigger = this.querySelector('.dropdown-trigger');
    const dropdown = this;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });

    this.querySelectorAll('.dropdown-item:not(.disabled)').forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('open');
        if (props.onSelect) props.onSelect(item.dataset.itemId);
      });
    });
  }
});

console.log('NAC Navigation Components loaded');
