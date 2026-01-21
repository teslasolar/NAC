/**
 * NAC SCADA - Main Control System JavaScript
 * Screen management, navigation, and data display
 */

// Screen configuration
const screens = {
  overview: { name: 'System Overview', icon: 'Overview', category: 'Main', url: null },
  oee: { name: 'OEE Dashboard', icon: 'OEE', category: 'Operations', url: 'oee-dashboard.html' },
  budget: { name: 'Budget Visualization', icon: 'Budget', category: 'Finance', url: 'budget.html' },
  audit: { name: 'Audit Tracker', icon: 'Audit', category: 'Finance', url: 'audit-tracker.html' },
  vendors: { name: 'Vendor Scorecard', icon: 'Vendors', category: 'Operations', url: 'vendor-scorecard.html' },
  grants: { name: 'Grant Tracker', icon: 'Grants', category: 'Finance', url: 'grant-tracker.html' },
  comparison: { name: 'County Comparison', icon: 'Compare', category: 'Analytics', url: 'county-comparison.html' },
  tax: { name: 'Tax Calculator', icon: 'Tax', category: 'Citizen', url: 'tax-calculator.html' },
  capital: { name: 'Capital Projects', icon: 'Capital', category: 'Operations', url: 'capital-projects.html' },
  pension: { name: 'Pension Dashboard', icon: 'Pension', category: 'Finance', url: 'pension-dashboard.html' },
  emergency: { name: '911 Metrics', icon: '911', category: 'Operations', url: 'emergency-metrics.html' },
  issues: { name: 'Issue Tracker', icon: 'Issues', category: 'Citizen', url: 'issue-tracker.html' },
  tickets: { name: 'Citizen Tickets', icon: 'Tickets', category: 'Citizen', url: 'tickets.html' },
  academy: { name: 'NAC Academy', icon: 'Academy', category: 'Citizen', url: 'academy.html' },
  notices: { name: 'Public Notices', icon: 'Notices', category: 'Citizen', url: 'notices.html' },
  ledger: { name: 'County Ledger', icon: 'Ledger', category: 'Citizen', url: 'ledger.html' },
  checkbook: { name: 'Open Checkbook', icon: 'Checkbook', category: 'Finance', url: 'checkbook.html' },
  gracedale: { name: 'Gracedale Dashboard', icon: 'Gracedale', category: 'Operations', url: 'gracedale.html' },
  funding: { name: 'State Funding Tracker', icon: 'Funding', category: 'Finance', url: 'funding.html' },
  gis: { name: 'GIS & Property Maps', icon: 'GIS', category: 'Citizen', url: 'gis.html' },
  meetings: { name: 'Meeting Archive', icon: 'Meetings', category: 'Citizen', url: 'meetings.html' },
  economic: { name: 'Economic Scorecard', icon: 'Economic', category: 'Analytics', url: 'economic-scorecard.html' },
  org: { name: 'Org Chart', icon: 'Org', category: 'Main', url: 'org-chart.html' },
  transform: { name: 'Transformation Plan', icon: 'Transform', category: 'Main', url: 'transformation-plan.html' },
  about: { name: 'About Operator', icon: 'About', category: 'System', url: 'about.html' },
  modules: { name: 'ISA-95 Modules', icon: 'Modules', category: 'System', url: 'modules.html' },
  perspective: { name: 'Perspective Demo', icon: 'Demo', category: 'System', url: 'views/demo-dashboard.html' },
  chat: { name: 'PANAC Chat', icon: 'Chat', category: 'System', url: 'chat.html' }
};

const alarms = [
  { id: 'ALM-001', priority: 'medium', message: 'PCCD Grant 62% unspent - 30 days remaining', screen: 'grants' },
  { id: 'ALM-002', priority: 'low', message: '3 audit findings open >45 days', screen: 'audit' },
  { id: 'ALM-003', priority: 'info', message: 'Police response time above target (9:24)', screen: 'emergency' }
];

const oeeData = [
  { name: 'Treasurer', oee: 86.4, status: 'good' },
  { name: 'Recorder', oee: 82.1, status: 'good' },
  { name: 'Prothonotary', oee: 79.5, status: 'warning' },
  { name: 'Sheriff', oee: 77.8, status: 'warning' },
  { name: 'Controller', oee: 74.2, status: 'warning' },
  { name: 'Clerk of Courts', oee: 74.2, status: 'warning' },
  { name: 'Register of Wills', oee: 73.5, status: 'warning' },
  { name: 'Coroner', oee: 71.2, status: 'bad' },
  { name: 'District Attorney', oee: 68.2, status: 'bad' }
];

let currentScreen = 'overview';

// Clock update
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour12: false });
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// Load screen
function loadScreen(screenId) {
  const screen = screens[screenId];
  if (!screen) return;

  currentScreen = screenId;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  event.target.closest('.nav-item')?.classList.add('active');

  // Update header
  document.getElementById('screenIcon').textContent = screen.icon;
  document.getElementById('screenName').textContent = screen.name;
  document.getElementById('screenBreadcrumb').textContent = `${screen.category} > ${screen.name}`;

  // Load content
  const content = document.getElementById('screenContent');
  if (screen.url) {
    content.innerHTML = `<iframe src="${screen.url}" title="${screen.name}"></iframe>`;
  } else {
    content.innerHTML = getOverviewHTML();
  }
}

// Overview HTML
function getOverviewHTML() {
  return `
    <div class="overview-grid">
      <div class="kpi-row">
        <div class="kpi-card warning">
          <div class="value">78.2%</div>
          <div class="label">Avg OEE</div>
          <div class="target">Target: 80%</div>
        </div>
        <div class="kpi-card good">
          <div class="value">89%</div>
          <div class="label">Audit Resolution</div>
          <div class="target">Target: 85%</div>
        </div>
        <div class="kpi-card warning">
          <div class="value">67%</div>
          <div class="label">Grant Utilization</div>
          <div class="target">Target: 80%</div>
        </div>
        <div class="kpi-card good">
          <div class="value">87.4%</div>
          <div class="label">Pension Funded</div>
          <div class="target">Target: 80%</div>
        </div>
        <div class="kpi-card good">
          <div class="value">92%</div>
          <div class="label">Citizen Satisfaction</div>
          <div class="target">Target: 90%</div>
        </div>
        <div class="kpi-card good">
          <div class="value">6:42</div>
          <div class="label">EMS Response</div>
          <div class="target">Target: 8:00</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">Operations Screens</div>
        <div class="panel-content">
          ${['oee', 'vendors', 'capital', 'emergency'].map(id => {
            const s = screens[id];
            return `<div class="screen-tile" onclick="loadScreen('${id}')">
              <div class="icon">${s.icon}</div>
              <div class="info"><h4>${s.name}</h4><p>${s.category}</p></div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">Finance Screens</div>
        <div class="panel-content">
          ${['budget', 'audit', 'grants', 'pension'].map(id => {
            const s = screens[id];
            return `<div class="screen-tile" onclick="loadScreen('${id}')">
              <div class="icon">${s.icon}</div>
              <div class="info"><h4>${s.name}</h4><p>${s.category}</p></div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">Analytics Screens</div>
        <div class="panel-content">
          ${['comparison', 'economic', 'tax', 'issues'].map(id => {
            const s = screens[id];
            return `<div class="screen-tile" onclick="loadScreen('${id}')">
              <div class="icon">${s.icon}</div>
              <div class="info"><h4>${s.name}</h4><p>${s.category}</p></div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// Populate alarms
function populateAlarms() {
  const container = document.getElementById('alarmList');
  container.innerHTML = alarms.map(a => `
    <div class="alarm-item ${a.priority}" onclick="loadScreen('${a.screen}')">
      <span class="priority">${a.priority}</span>
      <span>${a.message}</span>
    </div>
  `).join('');
}

// Populate OEE list
function populateOEE() {
  const container = document.getElementById('oeeList');
  container.innerHTML = oeeData.map(o => `
    <div class="row-officer-item">
      <span class="name">${o.name}</span>
      <span class="oee" style="color: var(--${o.status === 'good' ? 'green' : o.status === 'warning' ? 'yellow' : 'red'})">${o.oee}%</span>
    </div>
  `).join('');
}

// Populate call chart
function populateCallChart() {
  const container = document.getElementById('callChart');
  const data = [3, 2, 1, 4, 8, 12, 15, 14, 16, 18, 12, 8, 6, 5, 7, 9, 11, 14, 12, 10, 8, 6, 4, 3];
  const max = Math.max(...data);
  container.innerHTML = data.map(v => `<div class="bar" style="height: ${(v/max)*100}%"></div>`).join('');
}

// Actions
function refreshScreen() {
  loadScreen(currentScreen);
}

function popoutScreen() {
  const screen = screens[currentScreen];
  if (screen.url) {
    window.open(screen.url, '_blank', 'width=1200,height=800');
  }
}

function printScreen() {
  window.print();
}

function showAlarms() {
  loadScreen('audit');
}

// Mobile menu toggle
function toggleMobileMenu() {
  const sidebar = document.querySelector('.dock-west');
  const overlay = document.getElementById('mobileOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function closeMobileMenu() {
  const sidebar = document.querySelector('.dock-west');
  const overlay = document.getElementById('mobileOverlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Clock
  setInterval(updateClock, 1000);
  updateClock();

  // Populate widgets
  populateAlarms();
  populateOEE();
  populateCallChart();
  document.getElementById('screenContent').innerHTML = getOverviewHTML();

  // Close menu when clicking nav items on mobile
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 640) {
        closeMobileMenu();
      }
    });
  });
});
