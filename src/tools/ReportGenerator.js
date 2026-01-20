/**
 * Report Generator
 *
 * Standardized financial reports per §1604 (Monthly) and §1605 (Annual)
 */

class ReportGenerator {
  constructor(countyData) {
    this.data = countyData;
  }

  // Monthly Financial Report per §1604
  generateMonthlyReport(month, year) {
    const report = {
      type: 'MONTHLY_FINANCIAL_REPORT',
      period: `${year}-${month.toString().padStart(2, '0')}`,
      generatedAt: new Date().toISOString(),
      preparedBy: 'Office of the Controller',
      authority: '16 Pa.C.S. §1604',
      sections: [],
    };

    // Section 1: Budget Status
    report.sections.push({
      title: 'Budget Status Summary',
      content: {
        totalBudget: this.data.budget.total,
        ytdExpenditures: this.data.budget.ytdExpenditures,
        remainingBudget: this.data.budget.total - this.data.budget.ytdExpenditures,
        percentUsed: ((this.data.budget.ytdExpenditures / this.data.budget.total) * 100).toFixed(1) + '%',
      },
    });

    // Section 2: Cash Position
    report.sections.push({
      title: 'Cash Position',
      content: {
        generalFund: this.data.cash.generalFund,
        specialRevenue: this.data.cash.specialRevenue,
        capitalProjects: this.data.cash.capitalProjects,
        totalCash: this.data.cash.total,
      },
    });

    // Section 3: Outstanding Obligations
    report.sections.push({
      title: 'Outstanding Obligations',
      content: {
        accountsPayable: this.data.obligations.accountsPayable,
        encumbrances: this.data.obligations.encumbrances,
        debtService: this.data.obligations.debtService,
      },
    });

    // Section 4: Revenue Collection
    report.sections.push({
      title: 'Revenue Collection Status',
      content: {
        propertyTax: {
          budgeted: this.data.revenue.propertyTax.budgeted,
          collected: this.data.revenue.propertyTax.collected,
          percentCollected: ((this.data.revenue.propertyTax.collected / this.data.revenue.propertyTax.budgeted) * 100).toFixed(1) + '%',
        },
        intergovernmental: {
          budgeted: this.data.revenue.intergovernmental.budgeted,
          received: this.data.revenue.intergovernmental.received,
        },
      },
    });

    return report;
  }

  // Row Officer Monthly Report Template
  generateRowOfficerReport(officer, month, year) {
    return {
      type: 'ROW_OFFICER_MONTHLY_REPORT',
      officer: officer.name,
      period: `${year}-${month.toString().padStart(2, '0')}`,
      generatedAt: new Date().toISOString(),
      authority: '16 Pa.C.S. §1720',
      sections: [
        {
          title: 'Fee Collection Summary',
          fields: [
            { name: 'Beginning Balance', value: null, required: true },
            { name: 'Collections This Month', value: null, required: true },
            { name: 'Remittances to Treasurer', value: null, required: true },
            { name: 'Ending Balance', value: null, required: true },
          ],
        },
        {
          title: 'Transaction Activity',
          fields: [
            { name: 'Number of Transactions', value: null, required: true },
            { name: 'Total Fees Collected', value: null, required: true },
            { name: 'Refunds Issued', value: null, required: false },
            { name: 'Outstanding Receivables', value: null, required: false },
          ],
        },
        {
          title: 'Reconciliation',
          fields: [
            { name: 'Bank Statement Balance', value: null, required: true },
            { name: 'Book Balance', value: null, required: true },
            { name: 'Reconciling Items', value: null, required: false },
            { name: 'Variance', value: null, required: true },
          ],
        },
        {
          title: 'Certification',
          text: 'I certify that this report accurately represents the financial activity of this office for the period stated.',
          signature: null,
          date: null,
        },
      ],
    };
  }

  // Annual Comprehensive Financial Report per §1605
  generateAnnualReport(year) {
    return {
      type: 'ANNUAL_COMPREHENSIVE_FINANCIAL_REPORT',
      fiscalYear: year,
      generatedAt: new Date().toISOString(),
      preparedBy: 'Office of the Controller',
      authority: '16 Pa.C.S. §1605',
      dueDate: `${year + 1}-03-31`, // Within 90 days of fiscal year end
      sections: [
        {
          id: 'introductory',
          title: 'Introductory Section',
          contents: [
            'Letter of Transmittal',
            'Certificate of Achievement (GFOA)',
            'Organizational Chart',
            'List of Principal Officials',
          ],
        },
        {
          id: 'financial',
          title: 'Financial Section',
          contents: [
            'Independent Auditor\'s Report',
            'Management\'s Discussion and Analysis',
            'Basic Financial Statements',
            'Required Supplementary Information',
            'Combining Statements',
          ],
        },
        {
          id: 'statistical',
          title: 'Statistical Section',
          contents: [
            'Net Position by Component (10 years)',
            'Changes in Net Position (10 years)',
            'Fund Balances (10 years)',
            'Revenue by Source (10 years)',
            'Tax Revenue by Source',
            'Property Tax Rates',
            'Assessed Value of Taxable Property',
            'Property Tax Levies and Collections',
            'Principal Taxpayers',
            'Ratios of Outstanding Debt',
            'Direct and Overlapping Debt',
            'Demographic and Economic Statistics',
            'Principal Employers',
            'Full-time Equivalent Employees',
            'Operating Indicators',
            'Capital Asset Statistics',
          ],
        },
      ],
    };
  }

  // Export to various formats
  toMarkdown(report) {
    let md = `# ${report.type.replace(/_/g, ' ')}\n\n`;
    md += `**Period:** ${report.period || report.fiscalYear}\n`;
    md += `**Generated:** ${report.generatedAt}\n`;
    md += `**Authority:** ${report.authority}\n\n`;

    for (const section of report.sections) {
      md += `## ${section.title}\n\n`;
      if (section.content) {
        for (const [key, value] of Object.entries(section.content)) {
          if (typeof value === 'object') {
            md += `### ${key}\n`;
            for (const [k, v] of Object.entries(value)) {
              md += `- **${k}:** ${typeof v === 'number' ? '$' + v.toLocaleString() : v}\n`;
            }
          } else {
            md += `- **${key}:** ${typeof value === 'number' ? '$' + value.toLocaleString() : value}\n`;
          }
        }
      }
      if (section.contents) {
        for (const item of section.contents) {
          md += `- ${item}\n`;
        }
      }
      md += '\n';
    }

    return md;
  }

  toHTML(report) {
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>${report.type.replace(/_/g, ' ')}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    h1 { border-bottom: 2px solid #333; }
    h2 { color: #1e3a5f; margin-top: 2rem; }
    .meta { color: #666; font-size: 0.9rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
  <h1>${report.type.replace(/_/g, ' ')}</h1>
  <p class="meta">
    <strong>Period:</strong> ${report.period || report.fiscalYear}<br>
    <strong>Generated:</strong> ${new Date(report.generatedAt).toLocaleDateString()}<br>
    <strong>Authority:</strong> ${report.authority}
  </p>`;

    for (const section of report.sections) {
      html += `<h2>${section.title}</h2>`;
      if (section.content) {
        html += '<table>';
        for (const [key, value] of Object.entries(section.content)) {
          if (typeof value === 'object') {
            html += `<tr><th colspan="2">${key}</th></tr>`;
            for (const [k, v] of Object.entries(value)) {
              html += `<tr><td>${k}</td><td>${typeof v === 'number' ? '$' + v.toLocaleString() : v}</td></tr>`;
            }
          } else {
            html += `<tr><td>${key}</td><td>${typeof value === 'number' ? '$' + value.toLocaleString() : value}</td></tr>`;
          }
        }
        html += '</table>';
      }
    }

    html += '</body></html>';
    return html;
  }
}

module.exports = { ReportGenerator };
