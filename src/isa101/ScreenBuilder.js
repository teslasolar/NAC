/**
 * ISA-101 Screen Builder
 * Generates compliant HMI screens for county operations
 */

const { HMIColors, DisplayLevel, CountyHMITemplates } = require('./HMIStandards');

class Screen {
  constructor(id, title, level) {
    this.id = id;
    this.title = title;
    this.level = level;
    this.elements = [];
    this.navigation = {
      parent: null,
      children: [],
      related: [],
    };
    this.refreshRate = 5000; // ms
    this.created = new Date().toISOString();
  }

  addElement(element) {
    this.elements.push(element);
    return this;
  }

  setNavigation(parent, children = [], related = []) {
    this.navigation = { parent, children, related };
    return this;
  }

  toHTML() {
    const bgColor = {
      [DisplayLevel.L1_OVERVIEW]: HMIColors.BG_L1,
      [DisplayLevel.L2_AREA]: HMIColors.BG_L2,
      [DisplayLevel.L3_UNIT]: HMIColors.BG_L3,
      [DisplayLevel.L4_DIAGNOSTIC]: HMIColors.BG_L4,
    }[this.level];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.title} - NAC HMI</title>
  <style>
    :root {
      --bg: ${bgColor};
      --text: ${HMIColors.TEXT_PRIMARY};
      --text-secondary: ${HMIColors.TEXT_SECONDARY};
      --normal: ${HMIColors.VALUE_NORMAL};
      --warning: ${HMIColors.VALUE_HIGH};
      --alarm: ${HMIColors.VALUE_ALARM};
      --nav: ${HMIColors.NAV_PRIMARY};
      --nav-active: ${HMIColors.NAV_ACTIVE};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    .header {
      background: var(--nav);
      padding: 0.75rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--nav-active);
    }
    .header h1 { font-size: 1.25rem; font-weight: 500; }
    .nav-breadcrumb { font-size: 0.875rem; color: var(--text-secondary); }
    .nav-breadcrumb a { color: var(--nav-active); text-decoration: none; }
    .content { padding: 1.5rem; }
    .grid { display: grid; gap: 1rem; }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }
    .kpi-card {
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 1rem;
      border-left: 3px solid var(--normal);
    }
    .kpi-card.warning { border-color: var(--warning); }
    .kpi-card.alarm { border-color: var(--alarm); }
    .kpi-label { font-size: 0.75rem; color: var(--text-secondary); }
    .kpi-value { font-size: 2rem; font-weight: 600; }
    .kpi-unit { font-size: 0.875rem; color: var(--text-secondary); }
  </style>
</head>
<body>
  <div class="header">
    <h1>${this.title}</h1>
    <div class="nav-breadcrumb">
      ${this.navigation.parent ? `<a href="${this.navigation.parent}.html">↑ Up</a>` : ''}
    </div>
  </div>
  <div class="content">
    <div class="grid grid-4">
      ${this.elements.map(e => this.renderElement(e)).join('\n')}
    </div>
  </div>
  <script>
    // Auto-refresh every ${this.refreshRate}ms
    setTimeout(() => location.reload(), ${this.refreshRate});
  </script>
</body>
</html>`;
  }

  renderElement(el) {
    if (el.type === 'kpi') {
      return `
      <div class="kpi-card" id="${el.id}">
        <div class="kpi-label">${el.label}</div>
        <div class="kpi-value">--<span class="kpi-unit">${el.unit || ''}</span></div>
      </div>`;
    }
    return `<div id="${el.id}">${el.label}</div>`;
  }
}

class ScreenBuilder {
  constructor() {
    this.screens = new Map();
  }

  createFromTemplate(templateName, id, title) {
    const template = CountyHMITemplates[templateName];
    if (!template) throw new Error(`Unknown template: ${templateName}`);

    const screen = new Screen(id, title, template.level);
    template.elements.forEach(el => screen.addElement({ ...el }));

    this.screens.set(id, screen);
    return screen;
  }

  buildCountyHMI() {
    // L1 Overview
    const overview = this.createFromTemplate(
      'COUNTY_OVERVIEW',
      'county-overview',
      'Northampton County Controller - Overview'
    );

    // L2 Row Officers
    const rowOfficers = this.createFromTemplate(
      'ROW_OFFICERS_AREA',
      'row-officers',
      'Row Officers Status'
    );
    rowOfficers.setNavigation('county-overview', [
      'treasurer', 'sheriff', 'register-wills', 'recorder-deeds',
      'prothonotary', 'clerk-courts', 'coroner', 'da'
    ]);

    overview.setNavigation(null, ['row-officers', 'claims', 'audits']);

    return this;
  }

  getScreen(id) {
    return this.screens.get(id);
  }

  exportAll() {
    const output = {};
    this.screens.forEach((screen, id) => {
      output[id] = screen.toHTML();
    });
    return output;
  }
}

module.exports = { Screen, ScreenBuilder };
