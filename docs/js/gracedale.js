/**
 * NAC Gracedale Dashboard - Nursing Home Metrics
 */

// Census chart data - 12 months of resident counts
const censusData = [685, 678, 670, 665, 658, 652, 648, 645, 650, 648, 644, 642];
const maxCensus = 700;

document.addEventListener('DOMContentLoaded', function() {
  const chartContainer = document.getElementById('censusChart');

  if (chartContainer) {
    censusData.forEach((val, i) => {
      const bar = document.createElement('div');
      bar.className = 'census-bar';
      bar.style.height = `${(val / maxCensus) * 100}%`;

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = `${val} residents`;
      bar.appendChild(tooltip);

      chartContainer.appendChild(bar);
    });
  }
});
