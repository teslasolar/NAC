/**
 * NAC ERP - Enterprise Resource Planning JavaScript
 * Budget planning, workforce, procurement, strategic planning
 */

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateClock();
  setInterval(updateClock, 1000);
});

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour12: false });
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// Change fiscal year
function changeFiscalYear() {
  const year = document.getElementById('fiscalYear').value;
  console.log('Switching to fiscal year:', year);
  // In a real app, this would reload data for the selected fiscal year
}
