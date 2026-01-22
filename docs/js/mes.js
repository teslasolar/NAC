/**
 * NAC MES - Manufacturing Execution System JavaScript
 * Work order management, scheduling, and tracking
 */

// Sample work order data
const workOrders = [
  { id: 'WO-2024-001847', type: 'permit', title: 'Building Permit - 123 Main St', office: 'recorder', priority: 'normal', status: 'in-progress', assigned: 'M. Johnson', created: '2024-01-15 09:23' },
  { id: 'WO-2024-001846', type: 'deed', title: 'Deed Transfer - Smith to Jones', office: 'recorder', priority: 'high', status: 'in-progress', assigned: 'R. Davis', created: '2024-01-15 08:45' },
  { id: 'WO-2024-001845', type: 'filing', title: 'Civil Case Filing - Case #2024-CV-0234', office: 'prothonotary', priority: 'normal', status: 'queued', assigned: null, created: '2024-01-15 08:30' },
  { id: 'WO-2024-001844', type: 'tax', title: 'Tax Payment Processing', office: 'treasurer', priority: 'normal', status: 'in-progress', assigned: 'S. Wilson', created: '2024-01-15 08:15' },
  { id: 'WO-2024-001843', type: 'deed', title: 'Mortgage Release Filing', office: 'recorder', priority: 'normal', status: 'held', assigned: 'M. Johnson', created: '2024-01-14 16:45' },
  { id: 'WO-2024-001842', type: 'permit', title: 'Demolition Permit - 456 Oak Ave', office: 'recorder', priority: 'high', status: 'queued', assigned: null, created: '2024-01-14 15:30' },
  { id: 'WO-2024-001841', type: 'estate', title: 'Estate Filing - Williams Estate', office: 'register', priority: 'normal', status: 'in-progress', assigned: 'T. Brown', created: '2024-01-14 14:20' },
  { id: 'WO-2024-001840', type: 'filing', title: 'Criminal Case Docket Entry', office: 'clerk', priority: 'high', status: 'in-progress', assigned: 'K. Anderson', created: '2024-01-14 13:45' }
];

let selectedWorkOrder = workOrders[0];
let currentView = 'detail';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateClock();
  setInterval(updateClock, 1000);
  populateWorkOrderList();
  updateWIPCount();
});

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour12: false });
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  // Update shift
  const hour = now.getHours();
  let shift = 'Night Shift';
  if (hour >= 7 && hour < 15) shift = 'Day Shift';
  else if (hour >= 15 && hour < 23) shift = 'Evening Shift';
  document.getElementById('currentShift').textContent = shift;
}

// Populate work order list
function populateWorkOrderList() {
  const container = document.getElementById('workOrderList');
  const officeFilter = document.getElementById('officeFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  const filtered = workOrders.filter(wo => {
    if (officeFilter !== 'all' && wo.office !== officeFilter) return false;
    if (statusFilter !== 'all' && wo.status !== statusFilter) return false;
    return true;
  });

  container.innerHTML = filtered.map(wo => `
    <div class="wo-item status-${wo.status} ${wo.id === selectedWorkOrder?.id ? 'selected' : ''}" onclick="selectWorkOrder('${wo.id}')">
      <div class="wo-header">
        <span class="wo-id">${wo.id}</span>
        <span class="wo-priority priority-${wo.priority}">${wo.priority}</span>
      </div>
      <div class="wo-title">${wo.title}</div>
      <div class="wo-meta">
        <span>${wo.office}</span>
        <span>${wo.assigned || 'Unassigned'}</span>
      </div>
    </div>
  `).join('');
}

// Filter work orders
function filterWorkOrders() {
  populateWorkOrderList();
}

// Select work order
function selectWorkOrder(id) {
  selectedWorkOrder = workOrders.find(wo => wo.id === id);
  populateWorkOrderList();
  if (currentView === 'detail') {
    showWorkOrderDetail();
  }
}

// Update WIP count
function updateWIPCount() {
  const wipCount = workOrders.filter(wo => wo.status === 'in-progress' || wo.status === 'queued').length;
  document.getElementById('wipCount').textContent = wipCount;
}

// Show view
function showView(view) {
  currentView = view;
  document.querySelectorAll('.view-tabs .tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  const content = document.getElementById('viewContent');

  switch(view) {
    case 'detail':
      showWorkOrderDetail();
      break;
    case 'kanban':
      showKanbanBoard();
      break;
    case 'schedule':
      showScheduleView();
      break;
    case 'genealogy':
      showGenealogyView();
      break;
  }
}

// Show work order detail
function showWorkOrderDetail() {
  const wo = selectedWorkOrder;
  if (!wo) return;

  const stateMap = {
    'queued': 'idle',
    'in-progress': 'execute',
    'held': 'held',
    'completed': 'complete'
  };
  const state = stateMap[wo.status] || 'idle';

  document.getElementById('viewContent').innerHTML = `
    <div class="work-order-detail" id="workOrderDetail">
      <div class="detail-header">
        <div class="wo-info">
          <span class="wo-id">${wo.id}</span>
          <span class="wo-type type-${wo.type}">${wo.type}</span>
          <span class="wo-priority priority-${wo.priority}">${wo.priority}</span>
        </div>
        <div class="wo-state">
          <div class="packml-state state-${state}">
            <span class="state-icon"></span>
            <span class="state-name">${state.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-card">
          <h3>Request Information</h3>
          <dl>
            <dt>Title</dt><dd>${wo.title}</dd>
            <dt>Office</dt><dd>${wo.office}</dd>
            <dt>Created</dt><dd>${wo.created}</dd>
            <dt>Assigned To</dt><dd>${wo.assigned || 'Unassigned'}</dd>
            <dt>Priority</dt><dd>${wo.priority}</dd>
          </dl>
        </div>

        <div class="detail-card">
          <h3>Current Step</h3>
          <div class="step-progress">
            <div class="step ${wo.status !== 'queued' ? 'completed' : 'active'}">1. Intake</div>
            <div class="step ${wo.status === 'in-progress' || wo.status === 'completed' ? 'completed' : ''} ${wo.status === 'in-progress' ? 'active' : ''}">2. Processing</div>
            <div class="step ${wo.status === 'completed' ? 'completed' : ''}">3. Review</div>
            <div class="step ${wo.status === 'completed' ? 'completed active' : ''}">4. Complete</div>
          </div>
          <div class="step-timer">
            <span class="label">Status:</span>
            <span class="value">${wo.status.replace('-', ' ').toUpperCase()}</span>
          </div>
        </div>

        <div class="detail-card">
          <h3>Documents</h3>
          <ul class="doc-list">
            <li class="doc"><span class="doc-icon">PDF</span> Application Form</li>
            <li class="doc"><span class="doc-icon">PDF</span> Supporting Documents</li>
          </ul>
        </div>

        <div class="detail-card">
          <h3>Activity Log</h3>
          <ul class="activity-log">
            <li><span class="time">Now</span> Viewing work order</li>
            <li><span class="time">${wo.created.split(' ')[1]}</span> Work order created</li>
          </ul>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn btn-hold" onclick="holdWorkOrder()">Hold</button>
        <button class="btn btn-reassign" onclick="reassignWorkOrder()">Reassign</button>
        <button class="btn btn-complete" onclick="completeStep()">Complete Step</button>
      </div>
    </div>
  `;
}

// Show Kanban board
function showKanbanBoard() {
  const statuses = ['queued', 'in-progress', 'held', 'completed'];
  const statusLabels = { 'queued': 'Queued', 'in-progress': 'In Progress', 'held': 'On Hold', 'completed': 'Completed' };

  document.getElementById('viewContent').innerHTML = `
    <div class="kanban-board" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; height: 100%;">
      ${statuses.map(status => `
        <div class="kanban-column" style="background: var(--bg-secondary); border-radius: 8px; padding: 12px;">
          <h3 style="font-size: 12px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">
            ${statusLabels[status]} (${workOrders.filter(wo => wo.status === status).length})
          </h3>
          <div class="kanban-cards" style="display: flex; flex-direction: column; gap: 8px;">
            ${workOrders.filter(wo => wo.status === status).map(wo => `
              <div class="kanban-card" style="background: var(--bg-tertiary); padding: 10px; border-radius: 6px; border-left: 3px solid ${wo.priority === 'high' ? 'var(--red)' : 'var(--accent)'}; cursor: pointer;" onclick="selectWorkOrder('${wo.id}'); showView('detail');">
                <div style="font-size: 10px; font-family: monospace; color: var(--text-muted); margin-bottom: 4px;">${wo.id}</div>
                <div style="font-size: 12px; margin-bottom: 4px;">${wo.title.substring(0, 30)}...</div>
                <div style="font-size: 10px; color: var(--text-muted);">${wo.assigned || 'Unassigned'}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Show schedule view
function showScheduleView() {
  document.getElementById('viewContent').innerHTML = `
    <div class="schedule-view" style="padding: 20px;">
      <h2 style="margin-bottom: 20px; color: var(--text-secondary);">Today's Schedule</h2>
      <div style="display: grid; gap: 8px;">
        ${workOrders.filter(wo => wo.assigned).map(wo => `
          <div style="display: grid; grid-template-columns: 100px 200px 1fr auto; gap: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 6px; align-items: center;">
            <span style="font-family: monospace; color: var(--text-muted);">${wo.created.split(' ')[1]}</span>
            <span style="font-weight: 600;">${wo.assigned}</span>
            <span>${wo.title}</span>
            <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; background: var(--bg-tertiary);">${wo.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Show genealogy view
function showGenealogyView() {
  const wo = selectedWorkOrder;
  document.getElementById('viewContent').innerHTML = `
    <div class="genealogy-view" style="padding: 20px;">
      <h2 style="margin-bottom: 20px; color: var(--text-secondary);">Work Order Genealogy: ${wo?.id || 'None Selected'}</h2>
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: var(--green); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">1</div>
          <div style="flex: 1; padding: 12px; background: var(--bg-secondary); border-radius: 6px;">
            <div style="font-weight: 600;">Created</div>
            <div style="font-size: 12px; color: var(--text-muted);">${wo?.created || 'N/A'} - Intake System</div>
          </div>
        </div>
        <div style="width: 2px; height: 20px; background: var(--border); margin-left: 19px;"></div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: var(--blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">2</div>
          <div style="flex: 1; padding: 12px; background: var(--bg-secondary); border-radius: 6px;">
            <div style="font-weight: 600;">Assigned</div>
            <div style="font-size: 12px; color: var(--text-muted);">To ${wo?.assigned || 'Unassigned'} at ${wo?.office || 'N/A'}</div>
          </div>
        </div>
        <div style="width: 2px; height: 20px; background: var(--border); margin-left: 19px;"></div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--bg-primary); font-weight: bold;">3</div>
          <div style="flex: 1; padding: 12px; background: var(--bg-secondary); border-radius: 6px;">
            <div style="font-weight: 600;">Current Status</div>
            <div style="font-size: 12px; color: var(--text-muted);">${wo?.status?.toUpperCase() || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Actions
function showNewWorkOrder() {
  alert('New Work Order dialog would open here');
}

function holdWorkOrder() {
  if (selectedWorkOrder) {
    selectedWorkOrder.status = 'held';
    populateWorkOrderList();
    showWorkOrderDetail();
    updateWIPCount();
  }
}

function reassignWorkOrder() {
  alert('Reassign dialog would open here');
}

function completeStep() {
  if (selectedWorkOrder && selectedWorkOrder.status === 'in-progress') {
    selectedWorkOrder.status = 'completed';
    populateWorkOrderList();
    showWorkOrderDetail();
    updateWIPCount();
  }
}
