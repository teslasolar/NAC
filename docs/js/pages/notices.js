// Public Notice Board
const notices = [
  { id: 1, type: 'bid', title: 'RFP: County IT Infrastructure Modernization', dept: 'Information Technology', posted: '2026-01-10', deadline: '2026-01-24', description: 'Seeking proposals for comprehensive IT infrastructure upgrade including network, security systems, and cloud migration. Estimated project value: $2.5M over 3 years.', urgent: false, featured: true },
  { id: 2, type: 'hearing', title: '2026 Budget Amendment Public Hearing', dept: 'County Council', posted: '2026-01-15', deadline: '2026-01-28', description: 'Public hearing on proposed budget amendments for human services funding. Citizens may provide testimony in person or submit written comments.', urgent: false, featured: false },
  { id: 3, type: 'job', title: 'County Controller - Vacancy Appointment', dept: 'County Council', posted: '2026-01-06', deadline: '2026-01-31', description: 'The position of County Controller is vacant following the election of Tara Zrinski as County Executive. County Council is accepting applications for appointment to fill the remainder of the term.', urgent: true, featured: true },
  { id: 4, type: 'bid', title: 'Bridge Repair - Route 248 Overpass', dept: 'Public Works', posted: '2026-01-12', deadline: '2026-02-05', description: 'Sealed bids for structural repairs to the Route 248 overpass bridge. Pre-bid meeting required. Prevailing wage applies.', urgent: false, featured: false },
  { id: 5, type: 'ordinance', title: 'Ordinance 2026-03: Short-Term Rental Regulations', dept: 'County Council', posted: '2026-01-08', deadline: '2026-02-08', description: 'Proposed ordinance establishing registration requirements and safety standards for short-term rental properties. 30-day public comment period.', urgent: false, featured: false },
  { id: 6, type: 'meeting', title: 'County Council Regular Meeting', dept: 'County Council', posted: '2026-01-18', deadline: '2026-01-23', description: 'Regular meeting of County Council. Agenda includes Controller appointment discussion, budget amendments, and zoning appeals.', urgent: false, featured: false },
  { id: 7, type: 'job', title: 'Assistant District Attorney - Criminal Division', dept: 'District Attorney', posted: '2026-01-14', deadline: '2026-02-14', description: 'Full-time position prosecuting felony cases. JD required, 2+ years criminal law experience preferred. Salary range: $65,000-$85,000.', urgent: false, featured: false },
  { id: 8, type: 'bid', title: 'Janitorial Services - Government Center', dept: 'General Services', posted: '2026-01-11', deadline: '2026-01-30', description: '3-year contract for janitorial services at the Government Center complex. Includes daily cleaning, floor maintenance, and window washing.', urgent: false, featured: false },
  { id: 9, type: 'election', title: 'School Board Election - Petition Filing Deadline', dept: 'Elections', posted: '2026-01-05', deadline: '2026-02-18', description: 'Candidates for school board positions must file nomination petitions by February 18, 2026. Petition forms available at the Elections Office.', urgent: false, featured: false },
  { id: 10, type: 'hearing', title: 'Zoning Variance - 123 Main Street', dept: 'Planning & Zoning', posted: '2026-01-16', deadline: '2026-01-30', description: 'Public hearing on variance request for mixed-use development. Applicant seeks exception to height restrictions. Public comment welcome.', urgent: false, featured: false }
];

const typeLabels = {
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

document.addEventListener('DOMContentLoaded', () => { filterNotices(); });
