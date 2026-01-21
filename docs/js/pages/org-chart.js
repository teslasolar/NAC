// Org Chart Renderer
function getOEEClass(oee) {
  if (oee >= 85) return 'world-class';
  if (oee >= 75) return 'good';
  if (oee >= 65) return 'acceptable';
  if (oee >= 50) return 'needs-improvement';
  return 'critical';
}

function getOEELabel(oee) {
  if (oee >= 85) return 'World Class';
  if (oee >= 75) return 'Good';
  if (oee >= 65) return 'Acceptable';
  if (oee >= 50) return 'Needs Improvement';
  return 'Critical';
}

function formatBudget(amount) {
  return amount >= 1000000 ? '$' + (amount / 1000000).toFixed(1) + 'M' : '$' + (amount / 1000).toFixed(0) + 'K';
}

function renderNode(dept) {
  const oeeClass = dept.oee ? getOEEClass(dept.oee) : '';
  return `<div class="org-node ${dept.category}" data-id="${dept.id}" onclick="showDetails('${dept.id}')">
    <div class="node-header"><div class="node-title">${dept.name}</div>${dept.oee ? `<div class="node-badge">${dept.oee}%</div>` : ''}</div>
    <div class="node-officer">${dept.officer}</div>
    <div class="node-stats"><div class="node-stat"><span class="node-stat-value">${dept.staff}</span><span class="node-stat-label">Staff</span></div>
    <div class="node-stat"><span class="node-stat-value">${formatBudget(dept.budget)}</span><span class="node-stat-label">Budget</span></div></div>
    ${dept.oee ? `<div class="oee-grade ${oeeClass}">${getOEELabel(dept.oee)}</div>` : ''}</div>`;
}

function renderSection(title, description, departments) {
  return `<div class="division-header"><h3>${title}</h3><p>${description}</p></div><div class="org-level">${departments.map(d => renderNode(d)).join('')}</div>`;
}

function renderOrgChart(view = 'all') {
  const chart = document.getElementById('orgChart');
  let html = '';
  if (view === 'all' || view === 'row-officers') html += renderSection('Elected Row Officers', '9 independently elected constitutional officers', orgData.rowOfficers);
  if (view === 'all' || view === 'executive') html += renderSection('Executive Branch', 'County Executive and administrative departments', orgData.executive);
  if (view === 'all' || view === 'judiciary') html += renderSection('Judicial Branch', 'Court system and judicial support services', orgData.judiciary);
  if (view === 'all' || view === 'human-services') html += renderSection('Human Services', 'Social services and community support programs', orgData.humanServices);
  if (view === 'all') html += renderSection('Public Safety', 'Emergency services and corrections', orgData.publicSafety);
  chart.innerHTML = html;
}

function showDetails(id) {
  const allDepts = [...orgData.rowOfficers, ...orgData.executive, ...orgData.judiciary, ...orgData.humanServices, ...orgData.publicSafety];
  const dept = allDepts.find(d => d.id === id);
  if (!dept) return;

  const panel = document.getElementById('detailsPanel');
  const content = document.getElementById('detailsContent');
  const oeeClass = dept.oee ? getOEEClass(dept.oee) : '';

  content.innerHTML = `<h2>${dept.name}</h2><p class="officer-name">${dept.officer}</p>
    <div class="stat-grid">
      <div class="stat-card"><div class="value">${dept.staff}</div><div class="label">Total Staff</div></div>
      <div class="stat-card"><div class="value">${formatBudget(dept.budget)}</div><div class="label">Annual Budget</div></div>
      ${dept.oee ? `<div class="stat-card"><div class="value" style="color:${oeeClass==='world-class'?'#22c55e':oeeClass==='good'?'#84cc16':'#eab308'}">${dept.oee}%</div><div class="label">OEE Score</div></div>
      <div class="stat-card"><div class="value">${getOEELabel(dept.oee)}</div><div class="label">Rating</div></div>` : ''}
    </div>
    ${dept.oee ? `<div class="oee-grade ${oeeClass}" style="display:block;text-align:center">OEE Grade: ${getOEELabel(dept.oee)} (${dept.oee}%)</div>` : ''}
    <h3>Divisions & Staff</h3>
    ${dept.children.map(c => `<div class="sub-dept"><span class="name">${c.name}</span><span class="staff">${c.staff} staff</span></div>`).join('')}
    <h3>Budget per Employee</h3>
    <div class="sub-dept"><span class="name">Average Cost</span><span class="staff">${formatBudget(dept.budget / dept.staff)}/employee</span></div>`;
  panel.classList.add('open');
}

function closeDetails() { document.getElementById('detailsPanel').classList.remove('open'); }
function changeView(view) { renderOrgChart(view); }

function searchOrg(query) {
  const nodes = document.querySelectorAll('.org-node');
  const q = query.toLowerCase();
  nodes.forEach(node => { node.style.opacity = node.textContent.toLowerCase().includes(q) || q === '' ? '1' : '0.3'; });
}

function expandAll() {}
function collapseAll() {}

document.addEventListener('DOMContentLoaded', () => renderOrgChart('all'));
