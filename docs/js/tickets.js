/**
 * NAC Citizen Tickets - Issue Reporting System
 * Integrates with GitHub Issues for ticket tracking
 */

const REPO_OWNER = 'teslasolar';
const REPO_NAME = 'NAC';
const LABELS_MAP = {
  'roads': 'citizen:roads',
  'budget': 'citizen:budget',
  'services': 'citizen:services',
  'safety': 'citizen:safety',
  'suggestion': 'citizen:suggestion',
  'other': 'citizen:other'
};

let selectedCategory = '';
let ticketData = {};

function selectCategory(el) {
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedCategory = el.dataset.category;
  document.getElementById('category').value = selectedCategory;
}

function showPanel(panel) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

  document.querySelector(`[onclick="showPanel('${panel}')"]`).classList.add('active');
  document.getElementById(`panel-${panel}`).classList.add('active');

  if (panel === 'view') {
    loadTickets();
  }
}

function previewTicket(e) {
  e.preventDefault();

  if (!selectedCategory) {
    alert('Please select a category');
    return;
  }

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const location = document.getElementById('location').value.trim();
  const contact = document.getElementById('contact').value.trim();

  // Build the issue body
  let body = description;

  body += '\n\n---\n';
  body += `**Category:** ${getCategoryName(selectedCategory)}\n`;
  if (location) body += `**Location:** ${location}\n`;
  if (contact) body += `**Contact:** ${contact}\n`;
  body += `**Submitted via:** [Citizen Tickets](https://thomasfrumkin.com/tickets.html)\n`;
  body += `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`;

  ticketData = {
    title: `[Citizen] ${title}`,
    body: body,
    labels: [LABELS_MAP[selectedCategory], 'citizen-ticket'],
    category: getCategoryName(selectedCategory)
  };

  // Show preview
  document.getElementById('preview-title').textContent = ticketData.title;
  document.getElementById('preview-category').textContent = ticketData.category;
  document.getElementById('preview-body').textContent = body;
  document.getElementById('previewModal').classList.add('active');
}

function closePreview() {
  document.getElementById('previewModal').classList.remove('active');
}

function submitToGitHub() {
  const params = new URLSearchParams({
    title: ticketData.title,
    body: ticketData.body,
    labels: ticketData.labels.join(',')
  });

  const url = `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/new?${params.toString()}`;
  window.open(url, '_blank');
  closePreview();

  // Show success message
  alert('Opening GitHub to complete your submission. Thank you for your feedback!');
}

function getCategoryName(cat) {
  const names = {
    'roads': 'Roads & Infrastructure',
    'budget': 'Budget & Finance',
    'services': 'County Services',
    'safety': 'Public Safety',
    'suggestion': 'Suggestion',
    'other': 'Other'
  };
  return names[cat] || cat;
}

async function loadTickets() {
  const container = document.getElementById('ticketList');

  try {
    // Fetch issues with citizen-ticket label
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=citizen-ticket&state=all&per_page=50`
    );

    if (!response.ok) throw new Error('Failed to fetch');

    const issues = await response.json();

    // Update stats
    const open = issues.filter(i => i.state === 'open' && !i.labels.find(l => l.name === 'in-progress')).length;
    const inProgress = issues.filter(i => i.labels.find(l => l.name === 'in-progress')).length;
    const closed = issues.filter(i => i.state === 'closed').length;

    document.getElementById('stat-open').textContent = open;
    document.getElementById('stat-progress').textContent = inProgress;
    document.getElementById('stat-closed').textContent = closed;
    document.getElementById('stat-total').textContent = issues.length;

    if (issues.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-dim);">
          <p style="font-size: 2rem; margin-bottom: 1rem;">No tickets</p>
          <p>No citizen tickets yet. Be the first to submit one!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = issues.map(issue => {
      const categoryLabel = issue.labels.find(l => l.name.startsWith('citizen:'));
      const category = categoryLabel ? categoryLabel.name.split(':')[1] : 'other';
      const isInProgress = issue.labels.find(l => l.name === 'in-progress');
      const status = issue.state === 'closed' ? 'closed' : (isInProgress ? 'progress' : 'open');
      const statusText = status === 'closed' ? 'Closed' : (status === 'progress' ? 'In Progress' : 'Open');

      return `
        <div class="ticket-item" onclick="window.open('${issue.html_url}', '_blank')">
          <div class="ticket-header">
            <div>
              <span class="ticket-label label-${category}">${getCategoryEmoji(category)} ${category}</span>
              <div class="ticket-title">${escapeHtml(issue.title.replace('[Citizen] ', ''))}</div>
            </div>
            <span class="ticket-status status-${status}">${statusText}</span>
          </div>
          <div class="ticket-meta">
            <span class="ticket-number">#${issue.number}</span>
            <span>Opened ${timeAgo(new Date(issue.created_at))}</span>
            <span>${issue.comments} comments</span>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Error loading tickets:', err);
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-dim);">
        <p style="margin-bottom: 1rem;">Unable to load tickets</p>
        <a href="https://github.com/${REPO_OWNER}/${REPO_NAME}/issues?q=label%3Acitizen-ticket"
           target="_blank" style="color: var(--cyan);">View on GitHub</a>
      </div>
    `;
  }
}

function getCategoryEmoji(cat) {
  const emojis = {
    'roads': 'Roads',
    'budget': 'Budget',
    'services': 'Services',
    'safety': 'Safety',
    'suggestion': 'Suggestion',
    'other': 'Other'
  };
  return emojis[cat] || 'Other';
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Close modal on outside click
  const modal = document.getElementById('previewModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'previewModal') closePreview();
    });
  }
});
