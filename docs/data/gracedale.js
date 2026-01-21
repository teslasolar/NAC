// Gracedale Dashboard Data & Rendering
const GD = {
  alert: {
    type: 'warning',
    title: 'Staffing Alert',
    text: 'Nursing staff levels below state minimums. Overtime +34% YoY.'
  },

  kpis: [
    { value: '73%', label: 'Nursing Staff', trend: '-12%', status: 'critical' },
    { value: '642', label: 'Census', trend: '-58', status: 'warning' },
    { value: '91.7%', label: 'Occupancy', trend: '-3.2%', status: 'warning' },
    { value: '$4.2M', label: 'YTD Deficit', trend: '+$1.1M', status: 'critical' },
    { value: '4.1', label: 'CMS Stars', trend: '+0.3', status: 'good' },
    { value: '142', label: 'Open Jobs', trend: '+23', status: 'warning' }
  ],

  staffing: [
    { pos: 'RN', req: 95, cur: 68, status: 'critical' },
    { pos: 'LPN', req: 120, cur: 89, status: 'critical' },
    { pos: 'CNA', req: 280, cur: 215, status: 'critical' },
    { pos: 'Dietary', req: 45, cur: 38, status: 'warning' },
    { pos: 'Housekeeping', req: 35, cur: 29, status: 'warning' },
    { pos: 'Maintenance', req: 18, cur: 16, status: 'ok' },
    { pos: 'Admin', req: 25, cur: 22, status: 'ok' }
  ],

  actions: [
    'Increase wages 15% to match competitors',
    'Partner with LCCC/NCC nursing programs',
    'Retention bonuses for night/weekend',
    'Explore agency contracts (short-term)',
    'Review visa sponsorship options'
  ],

  quality: [
    { label: 'Overall', score: 4 },
    { label: 'Inspections', score: 5 },
    { label: 'Staffing', score: 3 },
    { label: 'Quality', score: 4 }
  ],

  budget: {
    expenses: [
      { label: 'Personnel', amount: '$48.2M' },
      { label: 'Medical Supplies', amount: '$6.8M' },
      { label: 'Food Services', amount: '$4.1M' },
      { label: 'Utilities', amount: '$2.3M' },
      { label: 'Other', amount: '$1.0M' }
    ],
    revenue: [
      { label: 'Medicaid', amount: '+$52.1M' },
      { label: 'Medicare', amount: '+$8.4M' },
      { label: 'Private Pay', amount: '+$3.1M' }
    ],
    net: '-$4.2M'
  },

  events: [
    { date: 'Jan 15', text: 'PA DHS inspection - no major deficiencies' },
    { date: 'Jan 8', text: 'Council approved $2.5M staffing fund' },
    { date: 'Dec 20', text: 'AFSCME contract negotiations begin' },
    { date: 'Dec 12', text: 'New EHR system deployed' },
    { date: 'Nov 30', text: 'Medicaid rate increase +3.2%' }
  ],

  resources: [
    { label: '2025 Annual Report', url: '#' },
    { label: 'CMS Compare Data', url: '#' },
    { label: 'Inspection Reports', url: '#' },
    { label: 'Job Openings', url: '#' }
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
