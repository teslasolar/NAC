// Audits Page Renderer
function renderAudits() {
  // Summary cards
  document.getElementById('summary').innerHTML = AUDITS.summary.map(s =>
    `<div class="summary-card"><h2>${s.name}</h2><div class="deficit">${s.deficit}</div><div class="budget">${s.budget}</div></div>`).join('');

  // Render each office
  ['sheriff', 'da', 'coroner'].forEach(id => renderOffice(AUDITS.offices[id]));

  // Total summary
  document.getElementById('totals').innerHTML = `<h2>Combined Audit Summary</h2><table>
    <tr><th>Office</th><th class="amount">Budget</th><th class="amount">Revenue</th><th class="amount">Net</th><th class="amount">Potential Savings</th></tr>
    ${AUDITS.totals.map((r,i) => `<tr${i===3?' style="font-weight:700;border-top:2px solid var(--red)"':''}>
      <td>${r[0]}</td><td class="amount">${r[1]}</td><td class="amount positive">${r[2]}</td>
      <td class="amount negative">${r[3]}</td><td class="amount positive">${r[4]}</td></tr>`).join('')}</table>
    <p style="margin-top:1rem;color:var(--muted);font-size:0.9rem"><strong>Key Finding:</strong> These three public safety offices consume 3.2% of the total county budget ($583M). <strong>$854,000 in improvements</strong> can be achieved through fee updates, contract rebidding, and grant optimization.</p>`;
}

function renderOffice(o) {
  const el = document.getElementById(o.id);
  const bm = b => b ? `<span class="benchmark ${b}">${b.toUpperCase()}</span>` : '';

  const personnelRows = o.personnel.sections.map(s => {
    let html = `<tr><td class="category" colspan="3">${s.cat}</td></tr>`;
    html += s.rows.map(r => `<tr><td>${r[0]}${r[3]?`<span class="personnel-detail"> - ${r[3]}</span>`:''}${bm(r[4])}</td><td>${r[1]}</td><td class="amount">${r[2]}</td></tr>`).join('');
    if (s.subtotal) html += `<tr class="subtotal"><td>${s.subtotal[0]}</td><td>${s.subtotal[1]}</td><td class="amount">${s.subtotal[2]}</td></tr>`;
    return html;
  }).join('');

  const operatingRows = o.operating.sections.map(s => {
    let html = `<tr><td class="category" colspan="3">${s.cat}</td></tr>`;
    html += s.rows.map(r => `<tr><td>${r[0]}${bm(r[3])}</td><td class="amount">${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    return html;
  }).join('');

  const revenueRows = o.revenue.sections.map(s => {
    let html = `<tr><td class="category" colspan="3">${s.cat}</td></tr>`;
    html += s.rows.map(r => `<tr><td>${r[0]}${bm(r[3])}</td><td class="amount positive">${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    return html;
  }).join('');

  el.innerHTML = `
    <div class="office-header"><h2>${o.title}</h2><div class="status">AUDIT PRIORITY: ${o.status}</div></div>
    <div class="audit-content">
      <p style="color:var(--muted);margin-bottom:1rem"><strong>Authority:</strong> <a href="statutes.html#1720" style="color:var(--accent)">16 Pa.C.S. §1720</a> - Controller shall audit accounts of all county officers</p>
      <div class="audit-grid">
        <div>
          <h3 class="section-title">Personnel Expenditures (${o.personnel.total})</h3>
          <table class="audit-table"><thead><tr><th>Position/Category</th><th>FTEs</th><th class="amount">Amount</th></tr></thead>
          <tbody>${personnelRows}<tr class="total-row"><td>TOTAL PERSONNEL</td><td>${o.personnel.ftes}</td><td class="amount">${o.personnel.total}</td></tr></tbody></table>
          <h3 class="section-title">Operating Expenditures (${o.operating.total})</h3>
          <table class="audit-table"><thead><tr><th>Category</th><th class="amount">Amount</th><th>Notes</th></tr></thead>
          <tbody>${operatingRows}<tr class="total-row"><td>TOTAL OPERATING</td><td class="amount">${o.operating.total}</td><td></td></tr></tbody></table>
        </div>
        <div>
          <h3 class="section-title">Revenue Sources (${o.revenue.total})</h3>
          <table class="audit-table"><thead><tr><th>Source</th><th class="amount">Amount</th><th>Notes</th></tr></thead>
          <tbody>${revenueRows}
          <tr class="total-row"><td>TOTAL REVENUE</td><td class="amount positive">${o.revenue.total}</td><td></td></tr>
          <tr class="total-row" style="border-top:3px solid var(--red)"><td><strong>NET DEFICIT</strong></td><td class="amount negative"><strong>${o.revenue.net}</strong></td><td></td></tr></tbody></table>
          <div class="findings"><h4>Audit Findings</h4><ul>${o.findings.map(f=>`<li><strong>${f[0]}:</strong> ${f[1]}</li>`).join('')}</ul></div>
          <div class="recommendations"><h4>Controller Recommendations</h4><ul>${o.recommendations.map(r=>`<li><strong>${r[0]}:</strong> ${r[1]}</li>`).join('')}</ul>
          <p style="color:var(--green);font-weight:600;margin-top:0.75rem">Potential Improvement: ${o.potential}</p></div>
        </div>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', renderAudits);
