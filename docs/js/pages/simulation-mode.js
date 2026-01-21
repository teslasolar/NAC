// Simulation Mode
const baselineData = {
  totalBudget: 428.5, staffFTEs: 1847,
  revenues: { propertyTax: 185.2, stateGrants: 98.4, federalGrants: 52.3, fees: 45.8, other: 46.8 },
  expenditures: { personnel: 198.5, benefits: 62.3, operations: 89.4, capital: 35.2, debt: 43.1 },
  officers: [
    { name: 'Controller - Tara Zrinski', budget: 1.8, staff: 12 },
    { name: 'Sheriff - Christopher Zieger', budget: 15.2, staff: 85 },
    { name: 'District Attorney - Stephen Baratta', budget: 8.4, staff: 65 },
    { name: 'Prothonotary - Holly Ruggiero', budget: 1.2, staff: 14 },
    { name: 'Clerk of Courts - Leigh Ann Fisher', budget: 1.5, staff: 18 },
    { name: 'Register of Wills - Patricia J. Manento', budget: 0.9, staff: 11 },
    { name: 'Recorder of Deeds - Dorothy Edelman', budget: 1.1, staff: 13 },
    { name: 'Coroner - Zachary Lysek', budget: 1.4, staff: 8 },
    { name: 'Treasurer', budget: 2.1, staff: 15 }
  ]
};

let budgetChart = null, departmentChart = null;

function initCharts() {
  const budgetCtx = document.getElementById('budgetChart').getContext('2d');
  budgetChart = new Chart(budgetCtx, {
    type: 'line',
    data: { labels: ['2024', '2025', '2026', '2027', '2028', '2029'],
      datasets: [
        { label: 'Revenue', data: [428.5, 428.5, 428.5, 428.5, 428.5, 428.5], borderColor: '#00c853', backgroundColor: 'rgba(0, 200, 83, 0.1)', fill: true, tension: 0.4 },
        { label: 'Expenditure', data: [428.5, 428.5, 428.5, 428.5, 428.5, 428.5], borderColor: '#ff5252', backgroundColor: 'rgba(255, 82, 82, 0.1)', fill: true, tension: 0.4 }
      ]},
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#888' } } },
      scales: { x: { grid: { color: '#333' }, ticks: { color: '#888' } }, y: { grid: { color: '#333' }, ticks: { color: '#888', callback: v => '$' + v + 'M' } } } }
  });

  const deptCtx = document.getElementById('departmentChart').getContext('2d');
  departmentChart = new Chart(deptCtx, {
    type: 'bar',
    data: { labels: ['Personnel', 'Benefits', 'Operations', 'Capital', 'Debt Service'],
      datasets: [
        { label: 'Current', data: [198.5, 62.3, 89.4, 35.2, 43.1], backgroundColor: 'rgba(74, 158, 255, 0.6)' },
        { label: 'Projected', data: [198.5, 62.3, 89.4, 35.2, 43.1], backgroundColor: 'rgba(255, 193, 7, 0.6)' }
      ]},
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#888' } } },
      scales: { x: { grid: { color: '#333' }, ticks: { color: '#888' } }, y: { grid: { color: '#333' }, ticks: { color: '#888', callback: v => '$' + v + 'M' } } } }
  });
}

function updateSlider(id) {
  const slider = document.getElementById(id);
  const valSpan = document.getElementById(id + 'Val');
  let val = parseFloat(slider.value);
  if (id === 'tech') valSpan.textContent = '$' + val + 'M';
  else if (id === 'workforce' || id === 'demand' || id === 'efficiency') valSpan.textContent = val + '%';
  else valSpan.textContent = (val >= 0 ? '+' : '') + val + '%';
}

const scenarios = {
  baseline: { taxRevenue: 0, grants: 0, fees: 0, workforce: 100, salary: 0, benefits: 0, demand: 100, efficiency: 100, tech: 0, consolidation: false, outsourcing: false, automation: false, shared: false },
  austerity: { taxRevenue: -5, grants: -10, fees: 5, workforce: 90, salary: 0, benefits: -5, demand: 100, efficiency: 105, tech: 0, consolidation: true, outsourcing: false, automation: false, shared: true },
  growth: { taxRevenue: 10, grants: 15, fees: 10, workforce: 110, salary: 5, benefits: 3, demand: 115, efficiency: 110, tech: 5, consolidation: false, outsourcing: false, automation: true, shared: false },
  crisis: { taxRevenue: -15, grants: -25, fees: -10, workforce: 85, salary: -3, benefits: 10, demand: 120, efficiency: 90, tech: 0, consolidation: true, outsourcing: true, automation: false, shared: true },
  efficiency: { taxRevenue: 0, grants: 5, fees: 0, workforce: 95, salary: 2, benefits: 0, demand: 100, efficiency: 130, tech: 8, consolidation: false, outsourcing: false, automation: true, shared: true }
};

function loadScenario(scenario) {
  document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const s = scenarios[scenario];
  ['taxRevenue', 'grants', 'fees', 'workforce', 'salary', 'benefits', 'demand', 'efficiency', 'tech'].forEach(id => {
    document.getElementById(id).value = s[id]; updateSlider(id);
  });
  ['consolidation', 'outsourcing', 'automation', 'shared'].forEach(id => document.getElementById(id).checked = s[id]);
  runSimulation();
}

function resetParameters() { loadScenario('baseline'); }

function runSimulation() {
  const params = {
    taxRevenue: parseFloat(document.getElementById('taxRevenue').value) / 100,
    grants: parseFloat(document.getElementById('grants').value) / 100,
    fees: parseFloat(document.getElementById('fees').value) / 100,
    workforce: parseFloat(document.getElementById('workforce').value) / 100,
    salary: parseFloat(document.getElementById('salary').value) / 100,
    benefits: parseFloat(document.getElementById('benefits').value) / 100,
    demand: parseFloat(document.getElementById('demand').value) / 100,
    efficiency: parseFloat(document.getElementById('efficiency').value) / 100,
    tech: parseFloat(document.getElementById('tech').value),
    consolidation: document.getElementById('consolidation').checked,
    outsourcing: document.getElementById('outsourcing').checked,
    automation: document.getElementById('automation').checked,
    shared: document.getElementById('shared').checked
  };

  const projRevenue = baselineData.revenues.propertyTax * (1 + params.taxRevenue) +
    (baselineData.revenues.stateGrants + baselineData.revenues.federalGrants) * (1 + params.grants) +
    baselineData.revenues.fees * (1 + params.fees) + baselineData.revenues.other;

  let projPersonnel = baselineData.expenditures.personnel * params.workforce * (1 + params.salary);
  let projBenefits = baselineData.expenditures.benefits * params.workforce * (1 + params.benefits);
  let projOperations = baselineData.expenditures.operations * (params.demand / params.efficiency);
  let projCapital = baselineData.expenditures.capital + params.tech;
  let projDebt = baselineData.expenditures.debt;

  if (params.consolidation) { projOperations *= 0.92; projPersonnel *= 0.95; }
  if (params.outsourcing) { projPersonnel *= 0.90; projOperations *= 1.08; }
  if (params.automation) { projOperations *= 0.85; projPersonnel *= 0.97; }
  if (params.shared) { projOperations *= 0.94; }

  const projExpenditure = projPersonnel + projBenefits + projOperations + projCapital + projDebt;
  const surplus = projRevenue - projExpenditure;
  const projStaff = Math.round(baselineData.staffFTEs * params.workforce);
  const serviceCapacity = (projStaff / baselineData.staffFTEs) * params.efficiency / params.demand * 100;

  // Update metrics
  document.getElementById('projectedBudget').textContent = '$' + projRevenue.toFixed(1) + 'M';
  const budgetChange = ((projRevenue / baselineData.totalBudget - 1) * 100).toFixed(1);
  document.getElementById('budgetChange').textContent = (budgetChange >= 0 ? '+' : '') + budgetChange + '% from baseline';
  document.getElementById('budgetChange').className = 'change ' + (budgetChange >= 0 ? 'up' : 'down');
  document.getElementById('budgetCard').className = 'metric-card ' + (budgetChange >= 0 ? 'positive' : 'negative');

  document.getElementById('surplusDeficit').textContent = (surplus >= 0 ? '+' : '') + '$' + surplus.toFixed(1) + 'M';
  document.getElementById('surplusChange').textContent = surplus >= 0 ? 'Surplus' : 'Deficit';
  document.getElementById('surplusChange').className = 'change ' + (surplus >= 0 ? 'up' : 'down');
  document.getElementById('surplusCard').className = 'metric-card ' + (surplus >= 0 ? 'positive' : 'negative');

  document.getElementById('staffFTEs').textContent = projStaff.toLocaleString();
  const staffChange = projStaff - baselineData.staffFTEs;
  document.getElementById('staffChange').textContent = (staffChange >= 0 ? '+' : '') + staffChange + ' FTEs';
  document.getElementById('staffChange').className = 'change ' + (staffChange >= 0 ? 'up' : 'down');

  document.getElementById('serviceCapacity').textContent = serviceCapacity.toFixed(0) + '%';
  document.getElementById('serviceChange').textContent = serviceCapacity >= 100 ? 'Meets demand' : 'Below demand';
  document.getElementById('serviceChange').className = 'change ' + (serviceCapacity >= 100 ? 'up' : 'down');
  document.getElementById('serviceCard').className = 'metric-card ' + (serviceCapacity >= 100 ? 'positive' : serviceCapacity >= 85 ? 'warning' : 'negative');

  // Update charts
  const revenueProjection = [], expenditureProjection = [];
  for (let i = 0; i <= 5; i++) { revenueProjection.push((projRevenue * Math.pow(1.02, i)).toFixed(1)); expenditureProjection.push((projExpenditure * Math.pow(1.025, i)).toFixed(1)); }
  budgetChart.data.datasets[0].data = revenueProjection;
  budgetChart.data.datasets[1].data = expenditureProjection;
  budgetChart.update();
  departmentChart.data.datasets[1].data = [projPersonnel.toFixed(1), projBenefits.toFixed(1), projOperations.toFixed(1), projCapital.toFixed(1), projDebt.toFixed(1)];
  departmentChart.update();

  // Officer impact table
  const officerTable = document.getElementById('officerImpactTable');
  officerTable.innerHTML = '';
  baselineData.officers.forEach(officer => {
    const projBudget = officer.budget * (projExpenditure / baselineData.totalBudget);
    const change = ((projBudget / officer.budget - 1) * 100).toFixed(1);
    const svcImpact = (Math.round(officer.staff * params.workforce) / officer.staff * params.efficiency / params.demand * 100).toFixed(0);
    let risk = svcImpact < 85 || change < -10 ? 'critical' : svcImpact < 95 || change < -5 ? 'warning' : 'ok';
    officerTable.innerHTML += `<tr><td>${officer.name}</td><td>$${officer.budget.toFixed(1)}M</td><td>$${projBudget.toFixed(1)}M</td><td class="change ${change >= 0 ? 'up' : 'down'}">${change >= 0 ? '+' : ''}${change}%</td><td>${svcImpact}%</td><td><span class="status-badge ${risk}">${risk.toUpperCase()}</span></td></tr>`;
  });

  updateTimeline(revenueProjection, expenditureProjection);
  updateAnalysisNotes(params, surplus, serviceCapacity, projStaff);
}

function updateTimeline(revenue, expenditure) {
  const timeline = document.getElementById('projectionTimeline');
  timeline.innerHTML = '';
  ['2024', '2025', '2026', '2027', '2028', '2029'].forEach((year, i) => {
    const balance = (parseFloat(revenue[i]) - parseFloat(expenditure[i])).toFixed(1);
    timeline.innerHTML += `<div class="timeline-point"><div class="dot" style="background:${balance >= 0 ? '#00c853' : '#ff5252'}"></div><div class="year">${year}</div><div class="metric">${balance >= 0 ? '+' : ''}$${balance}M</div></div>`;
  });
}

function updateAnalysisNotes(params, surplus, serviceCapacity, staff) {
  const notes = [];
  if (surplus < -10) notes.push('<strong>Critical:</strong> Projected deficit exceeds $10M - immediate corrective action required');
  else if (surplus < 0) notes.push('Projected deficit - consider revenue enhancement or expenditure reduction');
  else if (surplus > 20) notes.push('Significant surplus projected - consider capital investment or reserve building');
  if (serviceCapacity < 85) notes.push('<strong>Warning:</strong> Service capacity below 85% - quality of service at risk');
  else if (serviceCapacity < 95) notes.push('Service capacity slightly below demand - monitor workload closely');
  if (staff < baselineData.staffFTEs * 0.9) notes.push('Significant workforce reduction - consider phased implementation');
  if (params.automation && params.tech < 3) notes.push('Automation selected but low technology investment - increase tech budget');
  if (params.consolidation && params.outsourcing) notes.push('Both consolidation and outsourcing selected - potential conflicts');
  if (params.efficiency > 1.2 && params.tech < 5) notes.push('High efficiency targets require significant technology investment');
  if (notes.length === 0) { notes.push('Scenario appears balanced with manageable risks'); notes.push('Continue monitoring key metrics during implementation'); }
  document.getElementById('notesList').innerHTML = notes.map(n => `<li>${n}</li>`).join('');
}

document.addEventListener('DOMContentLoaded', () => { initCharts(); loadScenario('baseline'); });
