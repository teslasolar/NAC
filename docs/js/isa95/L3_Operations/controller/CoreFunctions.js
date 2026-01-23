/**
 * Controller Core Functions
 *
 * Five core functions of the County Controller per PA County Code Title 16
 *
 * @module L3_Operations/controller/CoreFunctions
 * @authority 16 Pa.C.S. §1602-1764
 */

export const CoreFunctions = {
  fiscalSupervision: {
    id: 'fiscal-supervision',
    name: 'Fiscal Supervision',
    authority: '16 Pa.C.S. §1602',
    description: 'Supervise the fiscal affairs of the County',
    scope: 'All officers or persons who collect, receive, hold, or disburse public monies',
    activities: [
      'Monitor all financial transactions',
      'Review internal controls',
      'Ensure segregation of duties',
      'Track budget adherence',
      'Verify fund balances',
      'Review bank reconciliations'
    ],
    frequency: 'Continuous',
    reportingTo: ['County Council', 'Public']
  },

  internalAudit: {
    id: 'internal-audit',
    name: 'Internal Audit',
    authority: '16 Pa.C.S. §1720',
    description: 'Conduct periodic audits of county operations',
    targets: [
      { entity: 'Sheriff', frequency: 'Annual', areas: ['Sales', 'Service Fees', 'Inmate Accounts'] },
      { entity: 'Treasurer', frequency: 'Annual', areas: ['Cash', 'Investments', 'Tax Collection'] },
      { entity: 'Coroner', frequency: 'Annual', areas: ['Fees', 'Property'] },
      { entity: 'District Attorney', frequency: 'Annual', areas: ['Forfeiture', 'Grants', 'Restitution'] },
      { entity: 'Recorder of Deeds', frequency: 'Annual', areas: ['Recording Fees', 'Transfer Tax'] },
      { entity: 'Register of Wills', frequency: 'Annual', areas: ['Probate Fees', 'Inheritance Tax'] },
      { entity: 'Clerk of Courts', frequency: 'Annual', areas: ['Court Fees', 'Bail Bonds'] },
      { entity: 'Prothonotary', frequency: 'Annual', areas: ['Filing Fees', 'Escrow'] },
      { entity: 'Tax Collectors', frequency: 'Triennial', areas: ['Collections', 'Settlements'] },
      { entity: 'District Judges', frequency: 'Triennial', areas: ['Fines', 'Costs'] }
    ],
    auditTypes: [
      { type: 'Financial', description: 'Financial statement audits per GAGAS' },
      { type: 'Compliance', description: 'Regulatory and policy compliance' },
      { type: 'Operational', description: 'Efficiency and effectiveness' },
      { type: 'Forensic', description: 'Fraud investigation as needed' }
    ]
  },

  payrollAdministration: {
    id: 'payroll-admin',
    name: 'Payroll Administration',
    authority: '16 Pa.C.S. §1760',
    description: 'Process and manage county employee compensation',
    functions: [
      'Biweekly payroll processing',
      'Tax withholding and remittance (Federal, State, Local)',
      'Benefit deduction management',
      'Retirement contribution processing',
      'Direct deposit administration',
      'Garnishment processing'
    ],
    compliance: [
      { regulation: 'IRS', reports: ['W-2', '941', '940', '1099'] },
      { regulation: 'PA DOR', reports: ['UC-2', 'W-2 State Copy'] },
      { regulation: 'Local EIT', reports: ['Quarterly LST/EIT'] }
    ],
    frequency: 'Biweekly'
  },

  accountsPayable: {
    id: 'accounts-payable',
    name: 'Accounts Payable',
    authority: '16 Pa.C.S. §1750',
    description: 'Process vendor payments and county obligations',
    workflow: [
      { step: 1, action: 'Receive invoice', responsible: 'AP Clerk' },
      { step: 2, action: 'Verify against PO/Contract', responsible: 'AP Clerk' },
      { step: 3, action: 'Obtain department approval', responsible: 'Department Head' },
      { step: 4, action: 'Pre-audit review', responsible: 'Controller Staff' },
      { step: 5, action: 'Controller approval', responsible: 'Controller' },
      { step: 6, action: 'Issue warrant to Treasurer', responsible: 'Controller' },
      { step: 7, action: 'Process payment', responsible: 'Treasurer' }
    ],
    approvalThresholds: [
      { maxAmount: 10000, approver: 'Department Head', controllerReview: true },
      { maxAmount: 50000, approver: 'Controller', councilNotification: false },
      { maxAmount: null, approver: 'County Council', controllerReview: true }
    ],
    paymentMethods: ['Check', 'ACH', 'Wire', 'P-Card']
  },

  financialReporting: {
    id: 'financial-reporting',
    name: 'Financial Reporting',
    authority: '16 Pa.C.S. §1705',
    description: 'Prepare and publish county financial reports',
    reports: [
      {
        name: 'Annual Comprehensive Financial Report (ACFR)',
        frequency: 'Annual',
        deadline: 'June 30',
        standard: 'GASB',
        distribution: ['State', 'Bond Rating Agencies', 'Public']
      },
      {
        name: 'Monthly Budget Report',
        frequency: 'Monthly',
        deadline: '15th of following month',
        distribution: ['County Council', 'Department Heads']
      },
      {
        name: 'Quarterly Cash Flow Statement',
        frequency: 'Quarterly',
        deadline: '30 days after quarter end',
        distribution: ['County Council', 'Treasurer']
      },
      {
        name: 'Single Audit Report',
        frequency: 'Annual (if > $750K federal)',
        deadline: '9 months after FY end',
        standard: 'Uniform Guidance',
        distribution: ['Federal Audit Clearinghouse']
      }
    ]
  }
};

/**
 * Get all functions as array
 */
export function getAllFunctions() {
  return Object.values(CoreFunctions);
}

/**
 * Get function by ID
 */
export function getFunction(functionId) {
  return Object.values(CoreFunctions).find(f => f.id === functionId);
}

/**
 * Get functions by authority section
 */
export function getFunctionsByAuthority(section) {
  return Object.values(CoreFunctions).filter(f =>
    f.authority.includes(section)
  );
}

export default CoreFunctions;
