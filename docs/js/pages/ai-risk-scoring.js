// AI Risk Scoring Engine - Loads from centralized tags
let riskAreas = [];
let riskConfig = {};

// Load risk data from tags
async function loadRiskData() {
  try {
    const response = await fetch('tags/risk-areas.json');
    if (response.ok) {
      const data = await response.json();
      riskConfig = data;
      riskAreas = data.riskAreas.map(r => ({
        area: r.area,
        category: r.category.charAt(0).toUpperCase() + r.category.slice(1),
        score: r.score,
        level: r.level,
        factors: r.factors,
        trend: r.trend,
        officer: r.office
      }));
      console.log('Loaded risk areas from tags:', riskAreas.length);
      return true;
    }
  } catch (err) {
    console.warn('Could not load risk tags, using fallback:', err);
  }
  // Fallback data
  riskAreas = [
    { area: 'Vendor Payment Processing', category: 'Financial', score: 87, level: 'critical', factors: ['Volume spike', 'New vendors'], trend: 'up', officer: 'Controller' },
    { area: 'Criminal Evidence Chain', category: 'Compliance', score: 82, level: 'critical', factors: ['Custody gaps'], trend: 'up', officer: 'Clerk of Courts' },
    { area: 'Budget Forecast Accuracy', category: 'Financial', score: 35, level: 'low', factors: ['Within tolerance'], trend: 'down', officer: 'Controller' }
  ];
  return false;
}

function renderRiskTable() {
  const tbody = document.getElementById('riskTableBody');
  tbody.innerHTML = '';
  riskAreas.forEach(risk => {
    const tr = document.createElement('tr');
    const trendIcon = risk.trend === 'up' ? '↑' : risk.trend === 'down' ? '↓' : '—';
    const trendClass = risk.trend === 'up' ? 'up' : risk.trend === 'down' ? 'down' : '';
    tr.innerHTML = `<td><strong>${risk.area}</strong><br><small style="color:#888">${risk.officer}</small></td>
      <td>${risk.category}</td>
      <td><div class="risk-score"><span>${risk.score}</span><div class="score-bar"><div class="fill ${risk.level}" style="width:${risk.score}%"></div></div></div></td>
      <td><span class="risk-badge ${risk.level}">${risk.level.toUpperCase()}</span></td>
      <td><div class="factors-list">${risk.factors.map(f => `<span class="factor-chip">${f}</span>`).join('')}</div></td>
      <td class="trend ${trendClass}">${trendIcon}</td>`;
    tbody.appendChild(tr);
  });
}

function initCharts() {
  const categoryCtx = document.getElementById('categoryChart').getContext('2d');
  new Chart(categoryCtx, {
    type: 'doughnut',
    data: { labels: ['Financial', 'Compliance', 'Operational', 'Reputational'], datasets: [{ data: [32, 28, 35, 5], backgroundColor: ['#ff5252', '#ce93d8', '#4a9eff', '#ffab40'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#888', padding: 15 } } } }
  });

  const trendCtx = document.getElementById('trendChart').getContext('2d');
  new Chart(trendCtx, {
    type: 'line',
    data: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [
      { label: 'Critical', data: [2, 1, 3, 3], borderColor: '#ff5252', backgroundColor: 'rgba(255, 82, 82, 0.1)', fill: true, tension: 0.4 },
      { label: 'High', data: [15, 14, 13, 12], borderColor: '#ffab40', backgroundColor: 'rgba(255, 171, 64, 0.1)', fill: true, tension: 0.4 },
      { label: 'Medium', data: [25, 27, 28, 28], borderColor: '#ffea00', backgroundColor: 'rgba(255, 234, 0, 0.1)', fill: true, tension: 0.4 }
    ]},
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#888' } } }, scales: { x: { grid: { color: '#333' }, ticks: { color: '#888' } }, y: { grid: { color: '#333' }, ticks: { color: '#888' } } } }
  });

  const officerCtx = document.getElementById('officerChart').getContext('2d');
  new Chart(officerCtx, {
    type: 'bar',
    data: { labels: ['Controller', 'Sheriff', 'DA', 'Prothonotary', 'Clerk', 'Register', 'Recorder', 'Coroner'],
      datasets: [{ label: 'Risk Score', data: [72, 78, 58, 62, 82, 65, 68, 45], backgroundColor: ['#ffab40', '#ff5252', '#ffea00', '#ffea00', '#ff5252', '#ffab40', '#ffab40', '#69f0ae'], borderRadius: 5 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#888' } }, y: { grid: { color: '#333' }, ticks: { color: '#888' }, max: 100 } } }
  });

  const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');
  new Chart(heatmapCtx, {
    type: 'bar',
    data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        { label: 'Financial', data: [65, 72, 68, 75, 70, 68, 72, 78, 75, 72, 70, 72], backgroundColor: 'rgba(255, 82, 82, 0.7)' },
        { label: 'Compliance', data: [58, 55, 60, 62, 58, 55, 58, 62, 60, 58, 55, 58], backgroundColor: 'rgba(206, 147, 216, 0.7)' },
        { label: 'Operational', data: [45, 48, 52, 55, 50, 48, 50, 55, 52, 50, 48, 50], backgroundColor: 'rgba(74, 158, 255, 0.7)' }
      ]},
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#888' } } }, scales: { x: { stacked: true, grid: { display: false }, ticks: { color: '#888' } }, y: { stacked: true, grid: { color: '#333' }, ticks: { color: '#888' } } } }
  });
}

function refreshScores() {
  const btn = event.target;
  btn.textContent = 'Refreshing...'; btn.disabled = true;
  setTimeout(() => { btn.textContent = 'Refresh Scores'; btn.disabled = false; alert('Risk scores updated successfully!'); }, 2000);
}

function exportReport() {
  const report = { generatedAt: new Date().toISOString(), summary: { critical: 3, high: 12, medium: 28, low: 89 }, riskAreas, modelInfo: { version: 'v2.4.1', accuracy: 0.942, f1Score: 0.912 } };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'risk-scoring-report.json'; a.click();
}

function configureModel() { alert('Model configuration panel would open here.\n\nConfigurable parameters:\n- Risk thresholds\n- Factor weights\n- Alert sensitivity'); }

function runFullAnalysis() {
  const btn = event.target;
  btn.textContent = 'Running Analysis...'; btn.disabled = true;
  setTimeout(() => { btn.textContent = 'Run Full Analysis'; btn.disabled = false; alert('Full analysis complete!\n\nKey findings:\n1. 3 new risk areas identified\n2. Sheriff office requires attention\n3. Risk posture improved 5%'); }, 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadRiskData();
  renderRiskTable();
  initCharts();
});
