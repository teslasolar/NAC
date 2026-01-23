// Public Notice Board - Loads from centralized tags
let notices = [];
let typeLabels = {};

// Load notices from tags
async function loadNotices() {
  try {
    const response = await fetch('tags/public-notices.json');
    if (response.ok) {
      const data = await response.json();
      // Transform tag data to notice format
      notices = data.notices.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        dept: n.department,
        posted: n.posted,
        deadline: n.deadline,
        description: n.description,
        urgent: n.status === 'urgent',
        featured: n.status === 'urgent' || n.type === 'job'
      }));
      // Build type labels from tag
      Object.entries(data.noticeTypes).forEach(([key, val]) => {
        typeLabels[key] = { label: val.label, class: 'type-' + key };
      });
      console.log('Loaded notices from tags:', notices.length);
      return true;
    }
  } catch (err) {
    console.warn('Could not load notices tag, using fallback:', err);
  }
  // Fallback data
  notices = [
    { id: 1, type: 'job', title: 'County Controller - Vacancy Appointment', dept: 'County Council', posted: '2026-01-06', deadline: '2026-02-05', description: 'Controller vacancy following Zrinski election as County Executive.', urgent: true, featured: true },
    { id: 2, type: 'bid', title: 'RFP: County IT Infrastructure Modernization', dept: 'IT', posted: '2026-01-15', deadline: '2026-02-15', description: 'IT modernization contract $2.5M.', urgent: false, featured: false }
  ];
  typeLabels = {
    bid: { label: 'Bid Request', class: 'type-bid' },
    hearing: { label: 'Public Hearing', class: 'type-hearing' },
    job: { label: 'Job Posting', class: 'type-job' },
    ordinance: { label: 'Ordinance', class: 'type-ordinance' },
    meeting: { label: 'Meeting', class: 'type-meeting' },
    election: { label: 'Election', class: 'type-election' },
    general: { label: 'Notice', class: 'type-general' }
  };
  return false;
}

const defaultTypeLabels = {
  bid: { label: 'Bid Request', class: 'type-bid' },
  hearing: { label: 'Public Hearing', class: 'type-hearing' },
  job: { label: 'Job Posting', class: 'type-job' },
  ordinance: { label: 'Ordinance', class: 'type-ordinance' },
  meeting: { label: 'Meeting', class: 'type-meeting' },
  election: { label: 'Election', class: 'type-election' },
  general: { label: 'Notice', class: 'type-general' }
};

function getDaysLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderNotices(filteredNotices) {
  const container = document.getElementById('noticeList');
  if (filteredNotices.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-dim)"><p style="font-size:2rem;margin-bottom:1rem">No notices match your filters</p></div>';
    return;
  }
  container.innerHTML = filteredNotices.map(notice => {
    const type = typeLabels[notice.type] || typeLabels.general;
    const daysLeft = getDaysLeft(notice.deadline);
    const deadlineClass = daysLeft <= 3 ? 'urgent' : daysLeft <= 7 ? 'soon' : '';
    const cardClass = notice.urgent ? 'urgent' : notice.featured ? 'featured' : '';
    return `<div class="notice-card ${cardClass}">
      <div class="notice-header"><div>
        <span class="notice-type ${type.class}">${type.label}</span>
        <h3 class="notice-title">${notice.title}</h3>
        <div class="notice-meta"><span>${notice.dept}</span><span>Posted ${formatDate(notice.posted)}</span></div>
      </div></div>
      <div class="notice-body">${notice.description}</div>
      <div class="notice-footer">
        <div class="notice-deadline ${deadlineClass}">${daysLeft > 0 ? daysLeft + ' days remaining' : 'Deadline passed'}</div>
        <div class="notice-actions"><button onclick="shareNotice(${notice.id})">Share</button><button class="primary" onclick="viewDetails(${notice.id})">View Details</button></div>
      </div></div>`;
  }).join('');
}

function filterNotices() {
  const typeFilter = document.getElementById('filterType').value;
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  let filtered = notices;
  if (typeFilter !== 'all') filtered = filtered.filter(n => n.type === typeFilter);
  if (searchTerm) filtered = filtered.filter(n => n.title.toLowerCase().includes(searchTerm) || n.description.toLowerCase().includes(searchTerm) || n.dept.toLowerCase().includes(searchTerm));
  filtered.sort((a, b) => { if (a.featured && !b.featured) return -1; if (!a.featured && b.featured) return 1; return new Date(a.deadline) - new Date(b.deadline); });
  renderNotices(filtered);
}

function shareNotice(id) {
  const notice = notices.find(n => n.id === id);
  if (notice && navigator.share) { navigator.share({ title: notice.title, text: notice.description, url: window.location.href + '#notice-' + id }); }
  else { navigator.clipboard.writeText(window.location.href + '#notice-' + id); alert('Link copied to clipboard!'); }
}

function viewDetails(id) {
  const notice = notices.find(n => n.id === id);
  if (notice) alert(`Full details for "${notice.title}" would open in a modal or new page.\n\nDeadline: ${formatDate(notice.deadline)}\nDepartment: ${notice.dept}`);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotices();
  // Merge default type labels with loaded ones
  Object.assign(typeLabels, defaultTypeLabels);
  filterNotices();
});
