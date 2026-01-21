/**
 * NAC Open Checkbook - County Payment Transparency Tool
 * Shows every payment made by Northampton County
 */

// Simulated payment data - in production, this would come from county financial system
const payments = generatePayments();
let filteredPayments = [...payments];
let currentPage = 1;
const perPage = 20;
let sortColumn = 'date';
let sortDir = 'desc';

function generatePayments() {
  const vendors = [
    { name: 'Aramark Services', category: 'services', dept: 'gracedale' },
    { name: 'PNC Bank', category: 'debt', dept: 'administration' },
    { name: 'PPL Electric Utilities', category: 'utilities', dept: 'public-works' },
    { name: 'UGI Energy Services', category: 'utilities', dept: 'administration' },
    { name: 'Lehigh Valley Health Network', category: 'services', dept: 'human-services' },
    { name: 'St. Luke\'s Hospital', category: 'services', dept: 'corrections' },
    { name: 'Highmark Blue Shield', category: 'personnel', dept: 'administration' },
    { name: 'AFSCME Local 3162', category: 'personnel', dept: 'gracedale' },
    { name: 'CDW Government', category: 'supplies', dept: 'administration' },
    { name: 'Office Depot', category: 'supplies', dept: 'courts' },
    { name: 'Staples Business', category: 'supplies', dept: 'elections' },
    { name: 'James J. Anderson Construction', category: 'capital', dept: 'public-works' },
    { name: 'Barry Isett & Associates', category: 'services', dept: 'public-works' },
    { name: 'Keystone Consulting Engineers', category: 'services', dept: 'public-works' },
    { name: 'Northampton County Prison', category: 'services', dept: 'corrections' },
    { name: 'PA Department of Revenue', category: 'grants', dept: 'administration' },
    { name: 'DCED Grant Program', category: 'grants', dept: 'human-services' },
    { name: 'Dominion Voting Systems', category: 'capital', dept: 'elections' },
    { name: 'ES&S Election Systems', category: 'services', dept: 'elections' },
    { name: 'Magellan Behavioral Health', category: 'services', dept: 'human-services' },
    { name: 'County Employees Pension', category: 'personnel', dept: 'administration' },
    { name: 'PA State Retirement', category: 'personnel', dept: 'administration' },
    { name: 'Waste Management', category: 'services', dept: 'public-works' },
    { name: 'Verizon Business', category: 'utilities', dept: 'administration' },
    { name: 'McKesson Medical', category: 'supplies', dept: 'gracedale' },
  ];

  const descriptions = {
    personnel: ['Employee benefits', 'Payroll processing', 'Health insurance premiums', 'Pension contributions', 'Workers compensation'],
    services: ['Professional consulting', 'Medical services', 'Food services contract', 'Security services', 'Legal services', 'Maintenance contract'],
    supplies: ['Office supplies', 'Medical supplies', 'Computer equipment', 'Cleaning supplies', 'Safety equipment'],
    capital: ['Building renovation', 'Equipment purchase', 'Infrastructure upgrade', 'Vehicle acquisition', 'Technology systems'],
    grants: ['Community program', 'Social services grant', 'Housing assistance', 'Youth program funding', 'Senior services'],
    utilities: ['Electric service', 'Natural gas', 'Water/sewer', 'Telecommunications', 'Internet service'],
    debt: ['Bond payment', 'Interest payment', 'Loan repayment', 'Capital lease', 'Note payment']
  };

  const data = [];
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-12-31');

  for (let i = 0; i < 500; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const descList = descriptions[vendor.category];

    let amount;
    switch(vendor.category) {
      case 'personnel': amount = 5000 + Math.random() * 200000; break;
      case 'services': amount = 1000 + Math.random() * 150000; break;
      case 'capital': amount = 10000 + Math.random() * 500000; break;
      case 'grants': amount = 5000 + Math.random() * 100000; break;
      case 'debt': amount = 50000 + Math.random() * 300000; break;
      default: amount = 100 + Math.random() * 20000;
    }

    data.push({
      id: i + 1,
      date: date.toISOString().split('T')[0],
      vendor: vendor.name,
      description: descList[Math.floor(Math.random() * descList.length)],
      department: vendor.dept,
      category: vendor.category,
      amount: Math.round(amount * 100) / 100,
      checkNumber: 'CHK' + (100000 + Math.floor(Math.random() * 50000))
    });
  }

  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDeptName(dept) {
  const names = {
    'gracedale': 'Gracedale',
    'corrections': 'Corrections',
    'courts': 'Courts',
    'human-services': 'Human Services',
    'public-works': 'Public Works',
    'administration': 'Administration',
    'elections': 'Elections',
    'controller': 'Controller'
  };
  return names[dept] || dept;
}

function updateStats() {
  const total = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const uniqueVendors = new Set(filteredPayments.map(p => p.vendor)).size;

  document.getElementById('totalSpending').textContent = formatCurrency(total);
  document.getElementById('totalPayments').textContent = filteredPayments.length.toLocaleString();
  document.getElementById('uniqueVendors').textContent = uniqueVendors;
  document.getElementById('avgPayment').textContent = formatCurrency(total / filteredPayments.length || 0);
}

function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const department = document.getElementById('departmentFilter').value;
  const amountRange = document.getElementById('amountFilter').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  filteredPayments = payments.filter(p => {
    if (query && !p.vendor.toLowerCase().includes(query) &&
        !p.description.toLowerCase().includes(query) &&
        !p.checkNumber.toLowerCase().includes(query)) return false;
    if (category && p.category !== category) return false;
    if (department && p.department !== department) return false;
    if (startDate && p.date < startDate) return false;
    if (endDate && p.date > endDate) return false;

    if (amountRange) {
      const [min, max] = amountRange.split('-').map(v => v === '+' ? Infinity : parseFloat(v));
      if (amountRange.includes('+')) {
        if (p.amount < parseFloat(amountRange)) return false;
      } else if (p.amount < min || p.amount > max) return false;
    }

    return true;
  });

  currentPage = 1;
  sortPayments();
  renderPayments();
  updateStats();
  updateCharts();
}

function sortBy(column) {
  if (sortColumn === column) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = column;
    sortDir = 'desc';
  }
  sortPayments();
  renderPayments();
}

function sortPayments() {
  filteredPayments.sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (sortColumn === 'date') {
      valA = new Date(valA);
      valB = new Date(valB);
    } else if (sortColumn === 'amount') {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

function renderPayments() {
  const start = (currentPage - 1) * perPage;
  const pageData = filteredPayments.slice(start, start + perPage);

  const tbody = document.getElementById('paymentsBody');
  tbody.innerHTML = pageData.map(p => `
    <tr>
      <td>${formatDate(p.date)}</td>
      <td><a href="#" class="vendor-link" onclick="filterByVendor('${p.vendor}')">${p.vendor}</a></td>
      <td>${p.description}</td>
      <td>${getDeptName(p.department)}</td>
      <td><span class="category-badge ${p.category}">${p.category}</span></td>
      <td class="amount">${formatCurrency(p.amount)}</td>
      <td>${p.checkNumber}</td>
    </tr>
  `).join('');

  document.getElementById('resultsCount').textContent =
    `Showing ${start + 1}-${Math.min(start + perPage, filteredPayments.length)} of ${filteredPayments.length.toLocaleString()} payments`;

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredPayments.length / perPage);
  const pagination = document.getElementById('pagination');

  let html = '';
  if (currentPage > 1) {
    html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">Prev</button>`;
  }

  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  if (currentPage < totalPages) {
    html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">Next</button>`;
  }

  pagination.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderPayments();
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

function filterByVendor(vendor) {
  document.getElementById('searchInput').value = vendor;
  performSearch();
}

function updateCharts() {
  // Category spending chart
  const categoryTotals = {};
  filteredPayments.forEach(p => {
    categoryTotals[p.category] = (categoryTotals[p.category] || 0) + p.amount;
  });

  const maxCategory = Math.max(...Object.values(categoryTotals));
  const colors = {
    personnel: '#4a90e2',
    services: '#9b59b6',
    supplies: '#f1c40f',
    capital: '#e67e22',
    grants: '#2ecc71',
    utilities: '#3498db',
    debt: '#e74c3c'
  };

  document.getElementById('categoryChart').innerHTML = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amount]) => `
      <div class="spending-bar">
        <div class="label">${cat}</div>
        <div class="bar-container">
          <div class="bar" style="width: ${(amount/maxCategory)*100}%; background: ${colors[cat] || '#00d4aa'}"></div>
        </div>
        <div class="value">${formatCurrency(amount)}</div>
      </div>
    `).join('');

  // Top vendors
  const vendorTotals = {};
  filteredPayments.forEach(p => {
    vendorTotals[p.vendor] = (vendorTotals[p.vendor] || 0) + p.amount;
  });

  const topVendors = Object.entries(vendorTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  document.getElementById('topVendors').innerHTML = topVendors
    .map(([vendor, amount], i) => `
      <li>
        <span><span class="rank">#${i + 1}</span> ${vendor}</span>
        <span class="amount">${formatCurrency(amount)}</span>
      </li>
    `).join('');
}

function exportCSV() {
  const headers = ['Date', 'Vendor', 'Description', 'Department', 'Category', 'Amount', 'Check Number'];
  const rows = filteredPayments.map(p => [
    p.date, p.vendor, p.description, getDeptName(p.department), p.category, p.amount, p.checkNumber
  ]);

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `northampton-county-payments-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') performSearch();
  });

  // Set default date range to current year
  document.getElementById('startDate').value = '2025-01-01';
  document.getElementById('endDate').value = '2025-12-31';

  performSearch();
});
