// ACFR Generator
const sections = ['intro', 'financial', 'statements', 'notes', 'rsi', 'statistical'];
let currentSection = 0;
let financialTags = null;
let executiveTags = null;

// Load data from tag files
async function loadTagData() {
  try {
    const tags = new TagLoader();
    const [financial, executives] = await Promise.all([
      tags.load('financial-data'),
      tags.load('executives')
    ]);
    financialTags = financial;
    executiveTags = executives;
    populateFromTags();
  } catch (err) {
    console.warn('Could not load tag data:', err);
  }
}

// Populate form fields from tags
function populateFromTags() {
  if (financialTags?.acfr) {
    const acfr = financialTags.acfr;
    // Set fiscal year end date
    const fyEndField = document.querySelector('input[type="date"][value="2023-12-31"]');
    if (fyEndField) fyEndField.value = acfr.fiscalYearEnd;

    // Set reporting entity
    const entityField = document.querySelector('input[value="County of Northampton, Pennsylvania"]');
    if (entityField) entityField.value = acfr.reportingEntity;

    // Set auditor
    const auditorField = document.querySelector('input[placeholder*="Baker Tilly"]');
    if (auditorField && acfr.auditor) auditorField.value = acfr.auditor;
  }

  if (executiveTags?.countyExecutive) {
    // Update County Executive name in letter
    const letterField = document.querySelector('textarea');
    if (letterField && letterField.value.includes('Controller, Northampton County')) {
      // Update principal officials
      const execField = document.querySelector('input[value*="County Executive"]');
      if (execField) execField.value = executiveTags.countyExecutive.name + ', County Executive';
    }
  }

  console.log('ACFR form populated from tag data');
}

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

  // Load tag data to populate form
  if (typeof TagLoader !== 'undefined') {
    loadTagData();
  }
});
