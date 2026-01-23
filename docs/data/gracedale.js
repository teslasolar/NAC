// Gracedale Dashboard Data & Rendering
// Updated: January 2026 with real staffing data
const GD = {
  alert: {
    type: 'critical',
    title: 'Staffing Crisis',
    text: 'Only 20% of nursing positions filled by county employees. 80% reliant on agency staff. Consolidating to Tallavera master vendor.'
  },

  kpis: [
    { value: '20%', label: 'County Nursing Staff', trend: '-60%', status: 'critical' },
    { value: '590', label: 'Total Nursing Staff', trend: '470 agency', status: 'warning' },
    { value: '120', label: 'County Employees', trend: 'vs 470 agency', status: 'critical' },
    { value: '$10M', label: 'Fund Transfer', trend: 'from General Fund', status: 'critical' },
    { value: '14', label: 'Staffing Agencies', trend: 'consolidating', status: 'warning' },
    { value: '$3.5M', label: 'Est. Savings', trend: 'with Tallavera', status: 'good' }
  ],

  staffing: [
    { pos: 'RN (County)', req: 95, cur: 19, status: 'critical' },
    { pos: 'RN (Agency)', req: 0, cur: 76, status: 'warning' },
    { pos: 'LPN (County)', req: 120, cur: 24, status: 'critical' },
    { pos: 'LPN (Agency)', req: 0, cur: 96, status: 'warning' },
    { pos: 'CNA (County)', req: 280, cur: 56, status: 'critical' },
    { pos: 'CNA (Agency)', req: 0, cur: 224, status: 'warning' },
    { pos: 'Other County', req: 95, cur: 21, status: 'critical' }
  ],

  actions: [
    'Transition to Tallavera as master vendor (consolidate 14 agencies)',
    'AFSCME contract: 4% COLA 2025, 3.5% 2026, 3% 2027',
    'Priority Resource Pool for agency nurses with 500+ hours',
    'Negotiate emergency staffing SLAs with fill rate guarantees',
    'Track agency vs county call-out rates during weather events'
  ],

  quality: [
    { label: 'Overall', score: 3 },
    { label: 'Inspections', score: 4 },
    { label: 'Staffing', score: 2 },
    { label: 'Quality', score: 3 }
  ],

  budget: {
    expenses: [
      { label: 'Personnel (County)', amount: '$18.2M' },
      { label: 'Agency Staffing', amount: '$42.0M' },
      { label: 'Medical Supplies', amount: '$6.8M' },
      { label: 'Food Services', amount: '$4.1M' },
      { label: 'Utilities/Other', amount: '$3.3M' }
    ],
    revenue: [
      { label: 'Medicaid', amount: '+$52.1M' },
      { label: 'Medicare', amount: '+$8.4M' },
      { label: 'Private Pay', amount: '+$3.1M' }
    ],
    net: '-$10.8M (requires General Fund transfer)'
  },

  events: [
    { date: 'Jan 22', text: 'Council discusses agency call-out rates during snowstorm' },
    { date: 'Jan 16', text: 'Zrinski Cabinet appointments announced' },
    { date: 'Jan 6', text: 'Tara Zrinski sworn in as County Executive' },
    { date: 'Dec 2025', text: 'AFSCME 88 Local 1435 contract approved by Council' },
    { date: 'Nov 2025', text: 'Tallavera selected as master staffing vendor' },
    { date: 'Sep 2025', text: 'Strategic plan to consolidate nursing staff presented' }
  ],

  resources: [
    { label: '2025 Strategic Plan', url: '#' },
    { label: 'AFSCME Contract Terms', url: '#' },
    { label: 'CMS Compare Data', url: 'https://www.medicare.gov/care-compare/' },
    { label: 'PA Nursing Home Regs', url: 'https://www.health.pa.gov/' }
  ]
};

// Render functions
function render() {
  // Alert
  document.getElementById('alertBanner').innerHTML = `
    <strong>${GD.alert.title}:</strong> ${GD.alert.text}`;

  // KPIs
  document.getElementById('kpiGrid').innerHTML = GD.kpis.map(k => `
    <div class="kpi-card" data-status="${k.status}">
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-trend">${k.trend}</div>
    </div>`).join('');

  // Staffing table
  document.getElementById('staffingTable').innerHTML = GD.staffing.map(s => `
    <tr>
      <td>${s.pos}</td><td>${s.req}</td><td>${s.cur}</td>
      <td>${s.req - s.cur}</td>
      <td><span class="status-badge" data-status="${s.status}">${s.status}</span></td>
    </tr>`).join('');

  // Actions
  document.getElementById('actionItems').innerHTML = '<h4>Actions Required</h4><ul>' +
    GD.actions.map(a => `<li>${a}</li>`).join('') + '</ul>';

  // Quality
  document.getElementById('qualityScores').innerHTML = GD.quality.map(q => `
    <div class="stat-row">
      <span>${q.label}</span>
      <span>${'★'.repeat(q.score)}${'☆'.repeat(5-q.score)}</span>
    </div>`).join('');

  // Budget
  let budgetHtml = GD.budget.expenses.map(b => `
    <div class="stat-row"><span>${b.label}</span><span class="negative">${b.amount}</span></div>`).join('');
  budgetHtml += '<hr>';
  budgetHtml += GD.budget.revenue.map(b => `
    <div class="stat-row"><span>${b.label}</span><span class="positive">${b.amount}</span></div>`).join('');
  budgetHtml += `<hr><div class="stat-row"><strong>Net</strong><span class="negative"><strong>${GD.budget.net}</strong></span></div>`;
  document.getElementById('budgetItems').innerHTML = budgetHtml;

  // Timeline
  document.getElementById('timeline').innerHTML = GD.events.map(e => `
    <div class="timeline-item"><span class="date">${e.date}</span><span>${e.text}</span></div>`).join('');

  // Resources
  document.getElementById('resources').innerHTML = GD.resources.map(r => `
    <a href="${r.url}" class="resource-link">${r.label}</a>`).join('');
}

document.addEventListener('DOMContentLoaded', render);
