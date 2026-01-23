// Document Workflow Tracker - Loads from centralized tags
let documents = [];
let officeNames = {};
let documentTypes = {};

// Load document data from tags
async function loadDocumentData() {
  try {
    const response = await fetch('tags/document-types.json');
    if (response.ok) {
      const data = await response.json();
      documentTypes = data.documentTypes;
      // Build office names from tag
      Object.entries(data.officeMapping).forEach(([key, val]) => {
        officeNames[key] = val.name;
      });
      console.log('Loaded document types from tags');
      return true;
    }
  } catch (err) {
    console.warn('Could not load document-types tag, using fallback:', err);
  }
  // Fallback office names
  officeNames = {
    recorder: 'Recorder of Deeds', prothonotary: 'Prothonotary', clerk: 'Clerk of Courts',
    register: 'Register of Wills', sheriff: 'Sheriff', da: 'District Attorney', controller: 'Controller'
  };
  return false;
}

// Sample documents (would load from backend in production)
function initSampleDocuments() {
  documents = [
    { id: 'DOC-2026-0101', title: 'Mortgage Recording - 123 Main St', type: 'deed', status: 'pending', priority: 'high', office: 'recorder', party: 'Smith, John', submitted: '2026-01-18', sla: '2026-01-21' },
    { id: 'DOC-2026-0102', title: 'Civil Complaint - Johnson v. ABC Corp', type: 'civil', status: 'pending', priority: 'medium', office: 'prothonotary', party: 'Johnson, Mary', submitted: '2026-01-18', sla: '2026-01-23' },
    { id: 'DOC-2026-0103', title: 'Estate Inventory - Williams Estate', type: 'will', status: 'pending', priority: 'low', office: 'register', party: 'Williams Family', submitted: '2026-01-17', sla: '2026-01-27' },
    { id: 'DOC-2026-0104', title: 'Deed Transfer - 456 Oak Ave', type: 'deed', status: 'processing', priority: 'medium', office: 'recorder', party: 'Davis, Robert', submitted: '2026-01-16', sla: '2026-01-19' },
    { id: 'DOC-2026-0105', title: 'Criminal Filing - Commonwealth v. Brown', type: 'criminal', status: 'processing', priority: 'high', office: 'clerk', party: 'Brown, Michael', submitted: '2026-01-15', sla: '2026-01-17' },
    { id: 'DOC-2026-0106', title: 'Probate Application - Anderson Estate', type: 'will', status: 'processing', priority: 'medium', office: 'register', party: 'Anderson Family', submitted: '2026-01-14', sla: '2026-01-24' },
    { id: 'DOC-2026-0107', title: 'Tax Lien Release - 789 Elm St', type: 'tax', status: 'processing', priority: 'low', office: 'controller', party: 'Harris, Susan', submitted: '2026-01-14', sla: '2026-01-21' },
    { id: 'DOC-2026-0108', title: 'Satisfaction of Mortgage - 321 Pine Rd', type: 'deed', status: 'review', priority: 'medium', office: 'recorder', party: 'Miller, Thomas', submitted: '2026-01-12', sla: '2026-01-15' },
    { id: 'DOC-2026-0109', title: 'Court Order - Custody Modification', type: 'court', status: 'review', priority: 'high', office: 'prothonotary', party: 'Wilson Family', submitted: '2026-01-11', sla: '2026-01-14' },
    { id: 'DOC-2026-0110', title: 'Deed Recording - 555 Cedar Ln', type: 'deed', status: 'completed', priority: 'medium', office: 'recorder', party: 'Taylor, James', submitted: '2026-01-10', completed: '2026-01-13' },
    { id: 'DOC-2026-0111', title: 'Will Probate - Martinez Estate', type: 'will', status: 'completed', priority: 'low', office: 'register', party: 'Martinez Family', submitted: '2026-01-09', completed: '2026-01-16' },
    { id: 'DOC-2026-0112', title: 'Criminal Judgment - Commonwealth v. Lee', type: 'criminal', status: 'completed', priority: 'high', office: 'clerk', party: 'Lee, David', submitted: '2026-01-08', completed: '2026-01-11' },
    { id: 'DOC-2026-0113', title: 'Deed Recording - Missing Signatures', type: 'deed', status: 'rejected', priority: 'medium', office: 'recorder', party: 'Garcia, Maria', submitted: '2026-01-07', rejected: '2026-01-09', reason: 'Missing notarization' }
  ];
}

const statusFilters = { pending: true, processing: true, review: true, completed: true, rejected: true };

function renderBoard() {
  const columns = {
    pending: document.getElementById('columnPending'), processing: document.getElementById('columnProcessing'),
    review: document.getElementById('columnReview'), completed: document.getElementById('columnCompleted'),
    rejected: document.getElementById('columnRejected')
  };
  Object.values(columns).forEach(col => col.innerHTML = '');
  const counts = { pending: 0, processing: 0, review: 0, completed: 0, rejected: 0 };
  const typeFilter = document.getElementById('filterType').value;
  const officeFilter = document.getElementById('filterOffice').value;

  documents.forEach(doc => {
    if (!statusFilters[doc.status]) return;
    if (typeFilter !== 'all' && doc.type !== typeFilter) return;
    if (officeFilter !== 'all' && doc.office !== officeFilter) return;
    counts[doc.status]++;

    const card = document.createElement('div');
    card.className = `document-card ${doc.type}`;
    card.onclick = () => openModal(doc);
    card.innerHTML = `
      <div class="card-header"><span class="card-id">${doc.id}</span><span class="card-priority ${doc.priority}">${doc.priority.toUpperCase()}</span></div>
      <div class="card-title">${doc.title}</div>
      <div class="card-meta"><span>👤 ${doc.party}</span><span>📅 ${doc.submitted}</span></div>
      <div class="card-office">${officeNames[doc.office]}</div>`;
    columns[doc.status].appendChild(card);
  });

  ['pending', 'processing', 'review', 'completed', 'rejected'].forEach(s => {
    document.getElementById('count' + s.charAt(0).toUpperCase() + s.slice(1)).textContent = counts[s];
  });
  document.getElementById('totalDocs').textContent = counts.pending + counts.processing + counts.review;
}

function toggleStatus(chip, status) { chip.classList.toggle('active'); statusFilters[status] = !statusFilters[status]; renderBoard(); }
function applyFilters() { renderBoard(); }

function switchView(view) {
  document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  if (view === 'kanban') { document.getElementById('kanbanView').classList.remove('hidden'); document.getElementById('timelineView').classList.remove('active'); }
  else { document.getElementById('kanbanView').classList.add('hidden'); document.getElementById('timelineView').classList.add('active'); renderTimeline(); }
}

function renderTimeline() {
  const timeline = document.getElementById('timelineView');
  timeline.innerHTML = '';
  const sortedDocs = [...documents].sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
  sortedDocs.forEach(doc => {
    const date = new Date(doc.submitted);
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-date"><div class="day">${date.getDate()}</div><div class="month">${date.toLocaleString('default', { month: 'short' })}</div></div>
      <div class="timeline-content"><div class="card-title">${doc.title}</div><div class="card-meta"><span>${doc.id}</span><span>👤 ${doc.party}</span><span>${officeNames[doc.office]}</span></div></div>
      <div class="timeline-dots"><div class="timeline-dot" style="background: ${getStatusColor(doc.status)}"></div></div>`;
    item.onclick = () => openModal(doc);
    timeline.appendChild(item);
  });
}

function getStatusColor(status) {
  return { pending: '#ffc107', processing: '#4a9eff', review: '#ce93d8', completed: '#00c853', rejected: '#ff5252' }[status];
}

let currentDoc = null;

function openModal(doc) {
  currentDoc = doc;
  document.getElementById('modalTitle').textContent = doc.title;
  document.getElementById('modalId').textContent = doc.id;
  document.getElementById('modalInfo').innerHTML = `<strong>Type:</strong> ${doc.type}<br><strong>Party:</strong> ${doc.party}<br><strong>Submitted:</strong> ${doc.submitted}<br><strong>Priority:</strong> ${doc.priority}<br><strong>Status:</strong> ${doc.status}`;
  document.getElementById('modalAssignment').textContent = officeNames[doc.office];

  const steps = getWorkflowSteps(doc);
  document.getElementById('modalWorkflow').innerHTML = steps.map(step => `
    <div class="workflow-step"><div class="step-icon ${step.status}">${step.icon}</div>
    <div class="step-info"><div class="title">${step.title}</div><div class="detail">${step.detail}</div></div>
    <div class="step-time">${step.time || ''}</div></div>`).join('');
  document.getElementById('detailModal').classList.add('active');
}

function getWorkflowSteps(doc) {
  const statusOrder = ['pending', 'processing', 'review', 'completed'];
  const i = statusOrder.indexOf(doc.status);
  return [
    { title: 'Submitted', detail: 'Document received and logged', icon: '📥', status: 'complete', time: doc.submitted },
    { title: 'Processing', detail: 'Being processed by ' + officeNames[doc.office], icon: '⚙️', status: i >= 1 ? 'complete' : i === 0 ? 'current' : 'pending', time: i >= 1 ? '2024-01-14' : '' },
    { title: 'Review', detail: 'Under supervisor review', icon: '👁️', status: i >= 2 ? 'complete' : i === 1 ? 'current' : 'pending', time: i >= 2 ? '2024-01-15' : '' },
    { title: 'Completed', detail: 'Finalized and recorded', icon: '✅', status: i >= 3 ? 'complete' : 'pending', time: doc.completed || '' }
  ];
}

function closeModal() { document.getElementById('detailModal').classList.remove('active'); currentDoc = null; }

function advanceWorkflow() {
  if (!currentDoc) return;
  const statusOrder = ['pending', 'processing', 'review', 'completed'];
  const i = statusOrder.indexOf(currentDoc.status);
  if (i < statusOrder.length - 1) { currentDoc.status = statusOrder[i + 1]; renderBoard(); openModal(currentDoc); }
}

function addNote() { const note = prompt('Enter note:'); if (note) alert('Note added: ' + note); }

function rejectDocument() {
  if (!currentDoc) return;
  const reason = prompt('Enter rejection reason:');
  if (reason) { currentDoc.status = 'rejected'; currentDoc.reason = reason; renderBoard(); closeModal(); }
}

function searchDocuments() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const results = documents.filter(doc => doc.id.toLowerCase().includes(query) || doc.title.toLowerCase().includes(query) || doc.party.toLowerCase().includes(query));
  if (results.length === 1) openModal(results[0]);
  else if (results.length > 1) alert(`Found ${results.length} documents matching "${query}"`);
  else alert('No documents found');
}

function newDocument() { alert('New Document form would open here'); }
function bulkUpdate() { alert('Bulk update dialog would open here'); }
function exportReport() {
  const data = documents.map(d => ({ id: d.id, title: d.title, type: d.type, status: d.status, office: officeNames[d.office], party: d.party, submitted: d.submitted }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'document-workflow-report.json'; a.click();
}
function viewAnalytics() { window.location.href = 'controller-dashboard.html'; }

document.addEventListener('DOMContentLoaded', async () => {
  await loadDocumentData();
  initSampleDocuments();
  renderBoard();
  document.getElementById('searchInput').addEventListener('keypress', e => { if (e.key === 'Enter') searchDocuments(); });
});
