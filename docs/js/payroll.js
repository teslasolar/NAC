/**
 * NAC Fiscal Module - Payroll & Disbursements (Dimension 2)
 *
 * County payroll processing per PA County Code Sections 1705, 1750
 *
 * @module fiscal/payroll
 */

const PayrollModule = {
  dimension: 2,
  name: "Payroll & Disbursements",

  // Statutory Authority
  authority: {
    sections: ["1705", "1750"],
    mandate: "Pay employees and remit all employment taxes",
    scope: "All county employees and related tax obligations"
  },

  // Payroll Functions
  functions: {
    processing: {
      name: "Payroll Processing",
      frequency: "Biweekly (26 pay periods/year)",
      responsibilities: [
        "Calculate gross pay (regular, overtime, differentials)",
        "Apply mandatory deductions (taxes, garnishments)",
        "Apply voluntary deductions (benefits, retirement, union dues)",
        "Generate direct deposits and checks",
        "Maintain pay records"
      ]
    },
    taxCompliance: {
      name: "Tax Compliance",
      obligations: [
        { type: "Federal Income Tax", form: "941", frequency: "Quarterly" },
        { type: "Social Security/Medicare", form: "941", frequency: "Quarterly" },
        { type: "PA State Income Tax", form: "PA W-3", frequency: "Quarterly" },
        { type: "Local EIT", form: "Various", frequency: "Quarterly" },
        { type: "Unemployment (FUTA/SUTA)", form: "940/UC-2", frequency: "Quarterly/Annual" },
        { type: "W-2 Reporting", form: "W-2/W-3", frequency: "Annual (Jan 31)" }
      ]
    },
    benefits: {
      name: "Benefits Administration",
      items: [
        "Health insurance premiums",
        "Dental/Vision insurance",
        "Life insurance",
        "Retirement contributions (defined benefit/contribution)",
        "Deferred compensation (457 plans)",
        "FSA/HSA contributions"
      ]
    },
    garnishments: {
      name: "Garnishment Processing",
      types: [
        "Child support withholding",
        "Tax levies (IRS, PA DOR)",
        "Student loan garnishments",
        "Creditor garnishments",
        "Bankruptcy orders"
      ],
      limits: "Subject to Consumer Credit Protection Act limits"
    }
  },

  // Employee Categories
  employeeCategories: {
    elected: {
      name: "Elected Officials",
      salaryAuthority: "Set by Salary Board",
      examples: ["Controller", "District Attorney", "Sheriff", "Coroner"]
    },
    appointed: {
      name: "Appointed Officials",
      salaryAuthority: "County Executive / Council approval",
      examples: ["Department Directors", "Deputy positions"]
    },
    unionized: {
      name: "Union Employees",
      salaryAuthority: "Collective bargaining agreements",
      unions: ["AFSCME", "FOP", "Other applicable unions"]
    },
    nonUnion: {
      name: "Non-Union Employees",
      salaryAuthority: "County pay scale / individual contracts"
    }
  },

  // Disbursement Controls
  disbursementControls: {
    workflow: [
      {
        step: 1,
        name: "Invoice Receipt",
        control: "Date stamp, assign tracking number"
      },
      {
        step: 2,
        name: "Verification",
        control: "Match to PO, verify receipt of goods/services"
      },
      {
        step: 3,
        name: "Approval",
        control: "Department head approval for payment"
      },
      {
        step: 4,
        name: "Audit Review",
        control: "Controller staff verify compliance, coding, budget"
      },
      {
        step: 5,
        name: "Payment Generation",
        control: "Batch payments with dual approval for release"
      },
      {
        step: 6,
        name: "Reconciliation",
        control: "Match cleared payments to records"
      }
    ],
    thresholds: {
      standard: { max: 10000, approval: "Department Head" },
      elevated: { max: 50000, approval: "Department Head + Controller" },
      major: { max: 100000, approval: "Above + County Administrator" },
      council: { min: 100000, approval: "Council approval required" }
    }
  },

  // Accounts Payable Metrics
  metrics: {
    efficiency: [
      { name: "Average Days to Pay", target: "< 30 days", benchmark: "Net 30 terms" },
      { name: "Invoices Processed per Staff", target: "500+/month", benchmark: "Industry average" },
      { name: "Error Rate", target: "< 1%", benchmark: "Based on adjustments" },
      { name: "Early Pay Discount Capture", target: "> 90%", benchmark: "Available discounts taken" }
    ],
    compliance: [
      { name: "1099 Accuracy", target: "100%", deadline: "Jan 31" },
      { name: "W-2 Accuracy", target: "100%", deadline: "Jan 31" },
      { name: "Tax Deposit Timeliness", target: "100%", deadline: "Per IRS schedule" }
    ]
  },

  // AI Analysis Prompts
  aiAnalysis: {
    ghostEmployee: {
      name: "Ghost Employee Detection",
      prompt: `Analyze payroll data for potential ghost employees:
        - Employees with no time entries but receiving pay
        - Duplicate SSN or bank accounts
        - Addresses matching other employees or vendors
        - Terminated employees still on payroll
        - No benefits elected (unusual for full-time)`
    },
    duplicatePayment: {
      name: "Duplicate Payment Detection",
      prompt: `Identify potential duplicate payments:
        - Same vendor, amount, date
        - Same invoice number to different vendors
        - Sequential check numbers with same amount
        - Credits followed by reissuance`
    },
    vendorAnalysis: {
      name: "Vendor Payment Analysis",
      prompt: `Review vendor payment patterns:
        - Concentration of payments to single vendors
        - New vendors with immediate large payments
        - Vendors with only round number invoices
        - PO box only addresses
        - Vendors with employee name matches`
    }
  },

  // Payroll Calendar Template
  calendarTemplate: {
    payPeriodStructure: "Biweekly, starting Sunday",
    keyDates: [
      { event: "Pay period ends", dayOffset: 0, description: "Saturday end of period" },
      { event: "Timesheets due", dayOffset: 2, description: "Monday after period end" },
      { event: "Supervisor approval", dayOffset: 3, description: "Tuesday deadline" },
      { event: "Processing", dayOffset: 4, description: "Wednesday batch run" },
      { event: "Review/corrections", dayOffset: 5, description: "Thursday final check" },
      { event: "Pay date", dayOffset: 7, description: "Friday direct deposit" }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PayrollModule;
}

if (typeof window !== 'undefined') {
  window.PayrollModule = PayrollModule;
}
