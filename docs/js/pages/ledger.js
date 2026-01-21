// County Ledger Data & Functions
const records = [
  { id: 1, type: 'budget', title: '2026 Adopted Budget', dept: 'Controller', date: '2025-12-15', hash: 'a7f3b2c8e9d4f1a6b5c3d2e8f7a9b4c6d1e3f5a8b2c7d9e4f6a1b3c5d8e2f4a7', block: 1245, size: '4.2 MB', verified: true },
  { id: 2, type: 'audit', title: 'Treasurer Annual Audit FY2025', dept: 'Controller', date: '2025-11-30', hash: 'b8c4d5e6f7a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8', block: 1198, size: '12.8 MB', verified: true },
  { id: 3, type: 'report', title: 'Q4 2025 Financial Report', dept: 'Controller', date: '2026-01-10', hash: 'c9d5e6f7a8b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', block: 1240, size: '2.1 MB', verified: true },
  { id: 4, type: 'budget', title: '2025 Amended Budget - Human Services', dept: 'Controller', date: '2025-06-20', hash: 'd0e6f7a8b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0', block: 1087, size: '1.8 MB', verified: true },
  { id: 5, type: 'audit', title: 'Sheriff Office Audit FY2025', dept: 'Controller', date: '2025-10-15', hash: 'e1f7a8b9c0d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1', block: 1165, size: '8.4 MB', verified: true },
  { id: 6, type: 'ordinance', title: 'Ordinance 2025-47: Tax Rate Adjustment', dept: 'County Council', date: '2025-11-01', hash: 'f2a8b9c0d1e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2', block: 1172, size: '340 KB', verified: true },
  { id: 7, type: 'contract', title: 'IT Services Contract - Acme Tech', dept: 'General Services', date: '2025-08-22', hash: 'a3b9c0d1e2f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', block: 1120, size: '2.7 MB', verified: true },
  { id: 8, type: 'audit', title: 'Register of Wills Audit FY2025', dept: 'Controller', date: '2025-09-30', hash: 'b4c0d1e2f3a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', block: 1145, size: '6.2 MB', verified: true },
  { id: 9, type: 'report', title: 'ACFR - Annual Comprehensive Financial Report 2024', dept: 'Controller', date: '2025-03-31', hash: 'c5d1e2f3a4b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', block: 1012, size: '45.6 MB', verified: true },
  { id: 10, type: 'budget', title: '2025 Adopted Budget', dept: 'Controller', date: '2024-12-18', hash: 'd6e2f3a4b5c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6', block: 892, size: '3.9 MB', verified: true }
];

const typeLabels = {
  budget: { label: 'Budget', class: 'type-budget' },
  audit: { label: 'Audit', class: 'type-audit' },
  report: { label: 'Report', class: 'type-report' },
  ordinance: { label: 'Ordinance', class: 'type-ordinance' },
  contract: { label: 'Contract', class: 'type-contract' }
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderRecords(filteredRecords) {
  const container = document.getElementById('recordList');
  container.innerHTML = filteredRecords.map(record => {
    const type = typeLabels[record.type];
    return `<div class="record-card">
      <div class="record-header"><div>
        <span class="record-type ${type.class}">${type.label}</span>
        <h3 class="record-title">${record.title}</h3>
        <div class="record-meta"><span>${record.dept}</span><span>${formatDate(record.date)}</span><span>${record.size}</span></div>
      </div></div>
      <div class="record-hash"><code>SHA-256: ${record.hash}</code><span class="verify-badge">Verified</span></div>
      <div class="record-footer">
        <div class="record-block">Block <strong>#${record.block}</strong></div>
        <div class="record-actions">
          <button onclick="copyHash('${record.hash}')">Copy Hash</button>
          <button onclick="viewRecord(${record.id})">View Details</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterRecords() {
  const typeFilter = document.getElementById('filterType').value;
  const yearFilter = document.getElementById('filterYear').value;
  let filtered = records;
  if (typeFilter !== 'all') filtered = filtered.filter(r => r.type === typeFilter);
  if (yearFilter !== 'all') filtered = filtered.filter(r => r.date.startsWith(yearFilter));
  renderRecords(filtered);
}

function showPanel(panel) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`[onclick="showPanel('${panel}')"]`).classList.add('active');
  document.getElementById(`panel-${panel}`).classList.add('active');
}

function copyHash(hash) { navigator.clipboard.writeText(hash); alert('Hash copied to clipboard!'); }

function viewRecord(id) {
  const record = records.find(r => r.id === id);
  if (record) alert(`Document: ${record.title}\n\nHash: ${record.hash}\n\nBlock: #${record.block}\nDate: ${record.date}\nSize: ${record.size}\n\nVerified on chain`);
}

async function hashFile(input) {
  const file = input.files[0];
  if (!file) return;
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  document.getElementById('hashInput').value = hashHex;
  verifyHash();
}

function verifyHash() {
  const hash = document.getElementById('hashInput').value.trim().toLowerCase();
  const result = document.getElementById('verifyResult');
  if (!hash) { result.innerHTML = ''; return; }
  const found = records.find(r => r.hash.toLowerCase() === hash);
  if (found) {
    result.className = 'verify-result valid';
    result.innerHTML = `<strong>Document Verified!</strong><br><br><strong>${found.title}</strong><br>Recorded in Block #${found.block}<br>Date: ${formatDate(found.date)}<br>Department: ${found.dept}`;
  } else {
    result.className = 'verify-result invalid';
    result.innerHTML = `<strong>Not Found</strong><br><br>This hash is not recorded on the county ledger.<br>The document may have been modified or was never recorded.`;
  }
}

function quickVerify() {
  const hash = document.getElementById('quickHash').value.trim().toLowerCase();
  if (!hash) return;
  const found = records.find(r => r.hash.toLowerCase().includes(hash));
  if (found) alert(`VERIFIED\n\n${found.title}\nBlock #${found.block}`);
  else alert('NOT FOUND\n\nThis hash is not on the ledger.');
}

document.addEventListener('DOMContentLoaded', filterRecords);
