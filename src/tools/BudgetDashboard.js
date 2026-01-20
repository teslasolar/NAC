/**
 * Budget Dashboard
 *
 * Real-time budget monitoring and variance detection
 * Per §1705 Fiscal Supervision authority
 */

class BudgetDashboard {
  constructor(budget) {
    this.budget = budget;
    this.alerts = [];
    this.thresholds = {
      warning: 0.80,  // 80% of budget
      critical: 0.95, // 95% of budget
      variance: 0.10, // 10% variance from projected
    };
  }

  // Calculate spending rate (annualized)
  getSpendingRate(actual, budgeted, monthsElapsed) {
    if (monthsElapsed === 0) return 0;
    const monthlyRate = actual / monthsElapsed;
    const annualizedRate = monthlyRate * 12;
    return annualizedRate / budgeted;
  }

  // Check budget status for a department
  checkDepartment(dept) {
    const pctUsed = dept.actual / dept.budgeted;
    const monthsElapsed = this.getMonthsElapsed();
    const expectedPct = monthsElapsed / 12;
    const variance = pctUsed - expectedPct;

    const status = {
      name: dept.name,
      budgeted: dept.budgeted,
      actual: dept.actual,
      remaining: dept.budgeted - dept.actual,
      pctUsed: pctUsed,
      expectedPct: expectedPct,
      variance: variance,
      projectedYearEnd: (dept.actual / monthsElapsed) * 12,
      alerts: [],
    };

    // Check thresholds
    if (pctUsed >= this.thresholds.critical) {
      status.alerts.push({
        level: 'CRITICAL',
        message: `Budget ${(pctUsed * 100).toFixed(1)}% exhausted`,
      });
    } else if (pctUsed >= this.thresholds.warning) {
      status.alerts.push({
        level: 'WARNING',
        message: `Budget ${(pctUsed * 100).toFixed(1)}% used`,
      });
    }

    // Check variance
    if (Math.abs(variance) >= this.thresholds.variance) {
      const direction = variance > 0 ? 'over' : 'under';
      status.alerts.push({
        level: variance > 0 ? 'WARNING' : 'INFO',
        message: `Spending ${(Math.abs(variance) * 100).toFixed(1)}% ${direction} projected`,
      });
    }

    // Projected overrun
    if (status.projectedYearEnd > dept.budgeted * 1.05) {
      const overrun = status.projectedYearEnd - dept.budgeted;
      status.alerts.push({
        level: 'CRITICAL',
        message: `Projected overrun: $${overrun.toLocaleString()}`,
      });
    }

    return status;
  }

  getMonthsElapsed() {
    const now = new Date();
    return now.getMonth() + 1; // Assuming calendar year = fiscal year
  }

  // Analyze full budget
  analyze(departments) {
    const results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalBudget: 0,
        totalActual: 0,
        totalRemaining: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
      },
      departments: [],
      topConcerns: [],
    };

    for (const dept of departments) {
      const status = this.checkDepartment(dept);
      results.departments.push(status);

      results.summary.totalBudget += dept.budgeted;
      results.summary.totalActual += dept.actual;
      results.summary.totalRemaining += status.remaining;

      for (const alert of status.alerts) {
        if (alert.level === 'CRITICAL') results.summary.criticalAlerts++;
        if (alert.level === 'WARNING') results.summary.warningAlerts++;
      }

      if (status.alerts.some(a => a.level === 'CRITICAL')) {
        results.topConcerns.push({
          department: dept.name,
          issue: status.alerts.find(a => a.level === 'CRITICAL').message,
          amount: status.projectedYearEnd - dept.budgeted,
        });
      }
    }

    // Sort concerns by amount
    results.topConcerns.sort((a, b) => b.amount - a.amount);

    return results;
  }

  // Generate dashboard HTML
  generateHTML(results) {
    const statusColor = (pct) => {
      if (pct >= 0.95) return '#ef4444';
      if (pct >= 0.80) return '#f59e0b';
      return '#10b981';
    };

    let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Budget Dashboard - ${new Date().toLocaleDateString()}</title>
  <style>
    body { font-family: system-ui; background: #0f172a; color: #e2e8f0; padding: 2rem; }
    .card { background: #1e293b; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    .metric { font-size: 2rem; font-weight: bold; }
    .label { color: #94a3b8; font-size: 0.875rem; }
    .alert-critical { color: #ef4444; }
    .alert-warning { color: #f59e0b; }
    .bar { height: 8px; background: #334155; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #334155; }
  </style>
</head>
<body>
  <h1>Northampton County Budget Dashboard</h1>
  <p>Generated: ${results.timestamp}</p>

  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
    <div class="card">
      <div class="metric">$${(results.summary.totalBudget / 1000000).toFixed(1)}M</div>
      <div class="label">Total Budget</div>
    </div>
    <div class="card">
      <div class="metric">$${(results.summary.totalActual / 1000000).toFixed(1)}M</div>
      <div class="label">Spent YTD</div>
    </div>
    <div class="card">
      <div class="metric ${results.summary.criticalAlerts > 0 ? 'alert-critical' : ''}">${results.summary.criticalAlerts}</div>
      <div class="label">Critical Alerts</div>
    </div>
    <div class="card">
      <div class="metric ${results.summary.warningAlerts > 0 ? 'alert-warning' : ''}">${results.summary.warningAlerts}</div>
      <div class="label">Warnings</div>
    </div>
  </div>

  <div class="card">
    <h2>Department Status</h2>
    <table>
      <tr><th>Department</th><th>Budget</th><th>Actual</th><th>% Used</th><th>Status</th></tr>
      ${results.departments.map(d => `
        <tr>
          <td>${d.name}</td>
          <td>$${(d.budgeted / 1000000).toFixed(2)}M</td>
          <td>$${(d.actual / 1000000).toFixed(2)}M</td>
          <td>
            <div class="bar"><div class="bar-fill" style="width: ${Math.min(d.pctUsed * 100, 100)}%; background: ${statusColor(d.pctUsed)};"></div></div>
            ${(d.pctUsed * 100).toFixed(1)}%
          </td>
          <td>${d.alerts.map(a => `<span class="alert-${a.level.toLowerCase()}">${a.message}</span>`).join('<br>')}</td>
        </tr>
      `).join('')}
    </table>
  </div>

  ${results.topConcerns.length > 0 ? `
  <div class="card">
    <h2>Top Concerns</h2>
    <ul>
      ${results.topConcerns.map(c => `
        <li class="alert-critical"><strong>${c.department}:</strong> ${c.issue} (Projected overrun: $${c.amount.toLocaleString()})</li>
      `).join('')}
    </ul>
  </div>
  ` : ''}
</body>
</html>`;

    return html;
  }
}

module.exports = { BudgetDashboard };
