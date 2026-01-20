/**
 * NAC Perspective - County Domain Components
 * Specialized components for government/county data
 */

// ============================================
// OEE GAUGE - Circular OEE gauge
// ============================================
NAC.registerComponent('oee-gauge', {
  props: {
    value: 0,
    target: 80,
    label: 'OEE',
    size: 'medium' // small, medium, large
  },
  template: `
    <div class="nac-oee-gauge nac-gauge-{{size}}">
      <svg viewBox="0 0 100 100" class="gauge-svg">
        <circle class="gauge-bg" cx="50" cy="50" r="40" />
        <circle class="gauge-fill" cx="50" cy="50" r="40"
                stroke-dasharray="251.2"
                stroke-dashoffset="calc(251.2 - (251.2 * {{value}} / 100))" />
        <circle class="gauge-target" cx="50" cy="50" r="40"
                stroke-dasharray="2 249.2"
                stroke-dashoffset="calc(-251.2 * {{target}} / 100 + 251.2)" />
      </svg>
      <div class="gauge-center">
        <div class="gauge-value">{{value}}%</div>
        <div class="gauge-label">{{label}}</div>
      </div>
    </div>
  `,
  style: `
    .nac-oee-gauge {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .nac-gauge-small { width: 80px; height: 80px; }
    .nac-gauge-medium { width: 120px; height: 120px; }
    .nac-gauge-large { width: 160px; height: 160px; }
    .gauge-svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }
    .gauge-bg {
      fill: none;
      stroke: rgba(255,255,255,0.1);
      stroke-width: 8;
    }
    .gauge-fill {
      fill: none;
      stroke: var(--green, #22c55e);
      stroke-width: 8;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.5s ease;
    }
    .gauge-target {
      fill: none;
      stroke: var(--yellow, #f59e0b);
      stroke-width: 10;
    }
    .gauge-center {
      position: absolute;
      text-align: center;
    }
    .gauge-value {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Consolas', monospace;
    }
    .nac-gauge-small .gauge-value { font-size: 1rem; }
    .nac-gauge-large .gauge-value { font-size: 2rem; }
    .gauge-label {
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
      text-transform: uppercase;
    }
  `,
  onMount(props) {
    const fill = this.querySelector('.gauge-fill');
    if (props.value >= props.target) {
      fill.style.stroke = 'var(--green, #22c55e)';
    } else if (props.value >= props.target * 0.9) {
      fill.style.stroke = 'var(--yellow, #f59e0b)';
    } else {
      fill.style.stroke = 'var(--red, #ef4444)';
    }
  }
});

// ============================================
// ROW OFFICER CARD - Row officer status card
// ============================================
NAC.registerComponent('row-officer-card', {
  props: {
    office: '',
    name: '',
    icon: '👤',
    oee: 0,
    availability: 0,
    performance: 0,
    quality: 0,
    status: 'normal' // normal, warning, critical
  },
  template: `
    <div class="nac-row-officer-card status-{{status}}">
      <div class="officer-header">
        <span class="officer-icon">{{icon}}</span>
        <div class="officer-info">
          <div class="officer-office">{{office}}</div>
          <div class="officer-name">{{name}}</div>
        </div>
        <div class="officer-oee">
          <div class="oee-value">{{oee}}%</div>
          <div class="oee-label">OEE</div>
        </div>
      </div>
      <div class="officer-metrics">
        <div class="metric">
          <div class="metric-bar">
            <div class="metric-fill" style="width: {{availability}}%"></div>
          </div>
          <span class="metric-label">A: {{availability}}%</span>
        </div>
        <div class="metric">
          <div class="metric-bar">
            <div class="metric-fill" style="width: {{performance}}%"></div>
          </div>
          <span class="metric-label">P: {{performance}}%</span>
        </div>
        <div class="metric">
          <div class="metric-bar">
            <div class="metric-fill" style="width: {{quality}}%"></div>
          </div>
          <span class="metric-label">Q: {{quality}}%</span>
        </div>
      </div>
    </div>
  `,
  style: `
    .nac-row-officer-card {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 10px;
      padding: 1rem;
      transition: all 0.2s;
    }
    .nac-row-officer-card:hover {
      border-color: var(--accent, #3b82f6);
    }
    .nac-row-officer-card.status-warning { border-left: 3px solid var(--yellow, #f59e0b); }
    .nac-row-officer-card.status-critical { border-left: 3px solid var(--red, #ef4444); }
    .officer-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .officer-icon {
      font-size: 2rem;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface, #1f2937);
      border-radius: 8px;
    }
    .officer-info { flex: 1; }
    .officer-office {
      font-weight: 600;
      font-size: 0.95rem;
    }
    .officer-name {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .officer-oee {
      text-align: right;
    }
    .oee-value {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Consolas', monospace;
    }
    .status-normal .oee-value { color: var(--green, #22c55e); }
    .status-warning .oee-value { color: var(--yellow, #f59e0b); }
    .status-critical .oee-value { color: var(--red, #ef4444); }
    .oee-label {
      font-size: 0.65rem;
      color: var(--text-dim, #9ca3af);
      text-transform: uppercase;
    }
    .officer-metrics {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .metric {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .metric-bar {
      flex: 1;
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    .metric-fill {
      height: 100%;
      background: var(--accent, #3b82f6);
      border-radius: 3px;
    }
    .metric-label {
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
      min-width: 50px;
    }
  `
});

// ============================================
// BUDGET CARD - Budget category display
// ============================================
NAC.registerComponent('budget-card', {
  props: {
    category: '',
    icon: '💰',
    allocated: 0,
    spent: 0,
    remaining: 0,
    percentUsed: 0
  },
  template: `
    <div class="nac-budget-card">
      <div class="budget-header">
        <span class="budget-icon">{{icon}}</span>
        <span class="budget-category">{{category}}</span>
      </div>
      <div class="budget-amounts">
        <div class="amount-row">
          <span class="amount-label">Allocated</span>
          <span class="amount-value">{{allocated}}</span>
        </div>
        <div class="amount-row">
          <span class="amount-label">Spent</span>
          <span class="amount-value spent">{{spent}}</span>
        </div>
        <div class="amount-row">
          <span class="amount-label">Remaining</span>
          <span class="amount-value remaining">{{remaining}}</span>
        </div>
      </div>
      <div class="budget-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: {{percentUsed}}%"></div>
        </div>
        <span class="progress-label">{{percentUsed}}% used</span>
      </div>
    </div>
  `,
  style: `
    .nac-budget-card {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 10px;
      padding: 1rem;
    }
    .budget-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border, #374151);
    }
    .budget-icon { font-size: 1.25rem; }
    .budget-category {
      font-weight: 600;
      font-size: 0.95rem;
    }
    .budget-amounts {
      margin-bottom: 1rem;
    }
    .amount-row {
      display: flex;
      justify-content: space-between;
      padding: 0.35rem 0;
      font-size: 0.85rem;
    }
    .amount-label { color: var(--text-dim, #9ca3af); }
    .amount-value { font-family: 'Consolas', monospace; font-weight: 500; }
    .amount-value.spent { color: var(--yellow, #f59e0b); }
    .amount-value.remaining { color: var(--green, #22c55e); }
    .budget-progress {}
    .progress-bar {
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      background: var(--accent, #3b82f6);
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .progress-label {
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
    }
  `
});

// ============================================
// GRANT TRACKER - Grant status tracker
// ============================================
NAC.registerComponent('grant-tracker', {
  props: {
    name: '',
    source: '',
    amount: 0,
    spent: 0,
    deadline: '',
    daysRemaining: 0,
    status: 'on-track' // on-track, at-risk, critical
  },
  template: `
    <div class="nac-grant-tracker status-{{status}}">
      <div class="grant-main">
        <div class="grant-info">
          <div class="grant-name">{{name}}</div>
          <div class="grant-source">{{source}}</div>
        </div>
        <div class="grant-amount">{{amount}}</div>
      </div>
      <div class="grant-progress">
        <div class="progress-track">
          <div class="progress-fill" style="width: calc({{spent}} / {{amount}} * 100)"></div>
        </div>
        <div class="progress-info">
          <span>{{spent}} spent</span>
          <span class="deadline">{{daysRemaining}} days left</span>
        </div>
      </div>
      <div class="grant-status-badge">{{status}}</div>
    </div>
  `,
  style: `
    .nac-grant-tracker {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      padding: 1rem;
      position: relative;
    }
    .nac-grant-tracker.status-at-risk { border-left: 3px solid var(--yellow, #f59e0b); }
    .nac-grant-tracker.status-critical { border-left: 3px solid var(--red, #ef4444); }
    .grant-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    .grant-name {
      font-weight: 600;
      font-size: 0.95rem;
    }
    .grant-source {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .grant-amount {
      font-size: 1.1rem;
      font-weight: 700;
      font-family: 'Consolas', monospace;
      color: var(--green, #22c55e);
    }
    .grant-progress {}
    .progress-track {
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      border-radius: 3px;
    }
    .status-on-track .progress-fill { background: var(--green, #22c55e); }
    .status-at-risk .progress-fill { background: var(--yellow, #f59e0b); }
    .status-critical .progress-fill { background: var(--red, #ef4444); }
    .progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .deadline { color: var(--yellow, #f59e0b); }
    .grant-status-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      font-size: 0.65rem;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .status-on-track .grant-status-badge { background: rgba(34,197,94,0.2); color: var(--green); }
    .status-at-risk .grant-status-badge { background: rgba(245,158,11,0.2); color: var(--yellow); }
    .status-critical .grant-status-badge { background: rgba(239,68,68,0.2); color: var(--red); }
  `
});

// ============================================
// VENDOR CARD - Vendor scorecard
// ============================================
NAC.registerComponent('vendor-card', {
  props: {
    name: '',
    category: '',
    contract: '',
    score: 0,
    onTime: 0,
    quality: 0,
    cost: 0,
    trend: 'stable' // up, down, stable
  },
  template: `
    <div class="nac-vendor-card">
      <div class="vendor-header">
        <div class="vendor-info">
          <div class="vendor-name">{{name}}</div>
          <div class="vendor-category">{{category}}</div>
        </div>
        <div class="vendor-score">
          <div class="score-value">{{score}}</div>
          <div class="score-trend trend-{{trend}}"></div>
        </div>
      </div>
      <div class="vendor-metrics">
        <div class="v-metric">
          <span class="v-metric-label">On-Time</span>
          <span class="v-metric-value">{{onTime}}%</span>
        </div>
        <div class="v-metric">
          <span class="v-metric-label">Quality</span>
          <span class="v-metric-value">{{quality}}%</span>
        </div>
        <div class="v-metric">
          <span class="v-metric-label">Cost</span>
          <span class="v-metric-value">{{cost}}%</span>
        </div>
      </div>
      <div class="vendor-contract">Contract: {{contract}}</div>
    </div>
  `,
  style: `
    .nac-vendor-card {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 10px;
      padding: 1rem;
    }
    .vendor-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .vendor-name {
      font-weight: 600;
      font-size: 0.95rem;
    }
    .vendor-category {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .vendor-score {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .score-value {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Consolas', monospace;
      color: var(--green, #22c55e);
    }
    .score-trend::after {
      font-size: 0.8rem;
    }
    .trend-up::after { content: '▲'; color: var(--green, #22c55e); }
    .trend-down::after { content: '▼'; color: var(--red, #ef4444); }
    .trend-stable::after { content: '━'; color: var(--yellow, #f59e0b); }
    .vendor-metrics {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-top: 1px solid var(--border, #374151);
      border-bottom: 1px solid var(--border, #374151);
      margin-bottom: 0.75rem;
    }
    .v-metric {
      text-align: center;
    }
    .v-metric-label {
      display: block;
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
      margin-bottom: 0.25rem;
    }
    .v-metric-value {
      font-weight: 600;
      font-family: 'Consolas', monospace;
    }
    .vendor-contract {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
  `
});

// ============================================
// MEETING ITEM - Meeting list item
// ============================================
NAC.registerComponent('meeting-item', {
  props: {
    title: '',
    board: '',
    date: '',
    time: '',
    location: '',
    hasVideo: false,
    hasTranscript: false,
    hasMinutes: false
  },
  template: `
    <div class="nac-meeting-item">
      <div class="meeting-date-badge">
        <div class="meeting-day"></div>
        <div class="meeting-month"></div>
      </div>
      <div class="meeting-info">
        <div class="meeting-title">{{title}}</div>
        <div class="meeting-meta">
          <span class="meeting-board">{{board}}</span>
          <span>{{time}}</span>
          <span>{{location}}</span>
        </div>
      </div>
      <div class="meeting-actions">
        {{#if hasVideo}}<button class="meeting-btn">▶️ Video</button>{{/if}}
        {{#if hasTranscript}}<button class="meeting-btn">📝 Transcript</button>{{/if}}
        {{#if hasMinutes}}<button class="meeting-btn">📄 Minutes</button>{{/if}}
      </div>
    </div>
  `,
  style: `
    .nac-meeting-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      margin-bottom: 0.75rem;
    }
    .meeting-date-badge {
      width: 50px;
      height: 50px;
      background: var(--accent, #3b82f6);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
    }
    .meeting-day {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1;
    }
    .meeting-month {
      font-size: 0.65rem;
      text-transform: uppercase;
    }
    .meeting-info { flex: 1; }
    .meeting-title {
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }
    .meeting-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .meeting-board {
      background: rgba(59, 130, 246, 0.2);
      color: var(--accent, #3b82f6);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }
    .meeting-actions {
      display: flex;
      gap: 0.5rem;
    }
    .meeting-btn {
      background: var(--bg-surface, #1f2937);
      border: 1px solid var(--border, #374151);
      color: var(--text-dim, #9ca3af);
      padding: 0.4rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .meeting-btn:hover {
      background: var(--bg-panel, #111827);
      color: var(--text, #e5e7eb);
    }
  `,
  onMount(props) {
    const date = new Date(props.date);
    const dayEl = this.querySelector('.meeting-day');
    const monthEl = this.querySelector('.meeting-month');
    if (dayEl) dayEl.textContent = date.getDate();
    if (monthEl) monthEl.textContent = date.toLocaleString('en', { month: 'short' });
  }
});

// ============================================
// NOTICE ITEM - Public notice item
// ============================================
NAC.registerComponent('notice-item', {
  props: {
    type: 'general', // general, bid, job, hearing
    title: '',
    department: '',
    posted: '',
    deadline: '',
    urgent: false
  },
  template: `
    <div class="nac-notice-item notice-{{type}} {{#if urgent}}urgent{{/if}}">
      <div class="notice-type-icon"></div>
      <div class="notice-content">
        <div class="notice-title">{{title}}</div>
        <div class="notice-meta">
          <span class="notice-dept">{{department}}</span>
          <span>Posted: {{posted}}</span>
          {{#if deadline}}<span class="notice-deadline">Deadline: {{deadline}}</span>{{/if}}
        </div>
      </div>
      {{#if urgent}}<span class="urgent-badge">URGENT</span>{{/if}}
    </div>
  `,
  style: `
    .nac-notice-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      position: relative;
    }
    .nac-notice-item.urgent { border-color: var(--red, #ef4444); }
    .notice-type-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .notice-general .notice-type-icon { background: rgba(59,130,246,0.2); }
    .notice-general .notice-type-icon::after { content: '📋'; }
    .notice-bid .notice-type-icon { background: rgba(34,197,94,0.2); }
    .notice-bid .notice-type-icon::after { content: '💼'; }
    .notice-job .notice-type-icon { background: rgba(155,89,182,0.2); }
    .notice-job .notice-type-icon::after { content: '👔'; }
    .notice-hearing .notice-type-icon { background: rgba(245,158,11,0.2); }
    .notice-hearing .notice-type-icon::after { content: '⚖️'; }
    .notice-content { flex: 1; }
    .notice-title {
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }
    .notice-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .notice-dept {
      background: var(--bg-surface, #1f2937);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }
    .notice-deadline { color: var(--yellow, #f59e0b); }
    .urgent-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--red, #ef4444);
      color: #fff;
      font-size: 0.6rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
  `
});

console.log('NAC County Components loaded');
