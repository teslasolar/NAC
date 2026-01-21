// ACFR Generator
const sections = ['intro', 'financial', 'statements', 'notes', 'rsi', 'statistical'];
let currentSection = 0;

function showSection(sectionId) {
  document.querySelectorAll('.section-panel').forEach(s => s.style.display = 'none');
  const panelMap = { 'intro': 'sectionIntro', 'financial': 'sectionFinancial', 'statements': 'sectionStatements', 'notes': 'sectionStatements', 'rsi': 'sectionStatements', 'statistical': 'sectionStatements' };
  const panel = document.getElementById(panelMap[sectionId]);
  if (panel) panel.style.display = 'block';
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  event.target.closest('.nav-item').classList.add('active');
  currentSection = sections.indexOf(sectionId);
}

function nextSection() {
  if (currentSection < sections.length - 1) { currentSection++; document.querySelectorAll('.nav-item')[currentSection].click(); }
}

function previousSection() {
  if (currentSection > 0) { currentSection--; document.querySelectorAll('.nav-item')[currentSection].click(); }
}

function saveDraft() {
  const data = { savedAt: new Date().toISOString(), currentSection: currentSection };
  localStorage.setItem('acfr_draft', JSON.stringify(data));
  alert('Draft saved successfully!');
}

function validateReport() {
  const issues = [];
  document.querySelectorAll('input[required], textarea[required]').forEach(field => {
    if (!field.value.trim()) issues.push(`Missing: ${field.previousElementSibling?.textContent || 'Required field'}`);
  });
  if (issues.length === 0) alert('Validation passed! All required fields complete.');
  else alert('Validation issues found:\n\n' + issues.join('\n'));
}

function previewReport() {
  document.querySelectorAll('.section-panel').forEach(s => s.style.display = 'none');
  document.getElementById('sectionPreview').style.display = 'block';
}

function generateReport() {
  const confirmed = confirm('Generate ACFR PDF Report?\n\nThis will create a formatted PDF document following GASB standards.');
  if (confirmed) alert('PDF generation started...\n\nIn production, this would generate a properly formatted ACFR document.');
}

document.addEventListener('DOMContentLoaded', () => {
  const draft = localStorage.getItem('acfr_draft');
  if (draft) console.log('Draft found:', JSON.parse(draft));
});
