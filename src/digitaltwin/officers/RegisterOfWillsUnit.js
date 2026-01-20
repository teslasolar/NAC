/**
 * Register of Wills Production Unit - Digital Twin Model
 *
 * Models the Register's office as a production facility with assembly lines for:
 * - Probate Processing (wills and letters)
 * - Estate Administration (inventory and accounting)
 * - Inheritance Tax (collection and remittance)
 * - Marriage Licenses (special responsibility)
 * - Guardian Accounts (incapacitated person protection)
 *
 * @module digitaltwin/officers/RegisterOfWillsUnit
 * @authority 16 Pa.C.S. Article XI (§1101-1110)
 */

import { ProductionUnit, AssemblyLine, WorkStation, WorkItem } from '../../isa88/ProductionUnit.js';

export const RegisterWorkItemTypes = {
  // Probate
  WILL_FILED: 'will_filed',
  WILL_PROBATED: 'will_probated',
  LETTERS_ISSUED: 'letters_issued',

  // Estate Administration
  INVENTORY_FILED: 'inventory_filed',
  ACCOUNTING_FILED: 'accounting_filed',
  ESTATE_CLOSED: 'estate_closed',

  // Inheritance Tax
  TAX_RETURN_FILED: 'tax_return_filed',
  TAX_ASSESSED: 'tax_assessed',
  TAX_PAID: 'tax_paid',
  TAX_REMITTED: 'tax_remitted',

  // Marriage Licenses
  LICENSE_APPLICATION: 'license_application',
  LICENSE_ISSUED: 'license_issued',

  // Guardian Accounts
  GUARDIAN_REPORT: 'guardian_report',
  GUARDIAN_REVIEWED: 'guardian_reviewed'
};

/**
 * Create Probate Processing Line
 */
function createProbateLine() {
  const line = new AssemblyLine({
    id: 'probate',
    name: 'Probate Line',
    description: 'Processing wills and granting letters testamentary/administration',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'probate-intake',
    name: 'Probate Intake',
    description: 'Receive will and petition for probate',
    capacity: 5,
    cycleTime: 20 * 60 * 1000, // 20 minutes
    inputTypes: [RegisterWorkItemTypes.WILL_FILED],
    outputType: 'will_received',
    requiredSkills: ['probate-intake', 'document-review'],
    equipment: ['probate-system', 'fee-collection']
  }));

  line.addStation(new WorkStation({
    id: 'will-examination',
    name: 'Will Examination',
    description: 'Examine will for validity and witness attestation',
    capacity: 3,
    cycleTime: 30 * 60 * 1000, // 30 minutes
    inputTypes: ['will_received'],
    outputType: RegisterWorkItemTypes.WILL_PROBATED,
    requiredSkills: ['probate-law', 'document-examination'],
    equipment: ['magnification', 'will-records']
  }));

  line.addStation(new WorkStation({
    id: 'oath-administration',
    name: 'Oath Administration',
    description: 'Administer oath to executor/administrator',
    capacity: 2,
    cycleTime: 15 * 60 * 1000, // 15 minutes
    inputTypes: [RegisterWorkItemTypes.WILL_PROBATED],
    outputType: 'oath_taken',
    requiredSkills: ['oath-administration'],
    equipment: ['oath-book', 'bible']
  }));

  line.addStation(new WorkStation({
    id: 'letters-issuance',
    name: 'Letters Issuance',
    description: 'Issue letters testamentary or administration',
    capacity: 3,
    cycleTime: 10 * 60 * 1000, // 10 minutes
    inputTypes: ['oath_taken'],
    outputType: RegisterWorkItemTypes.LETTERS_ISSUED,
    requiredSkills: ['document-preparation'],
    equipment: ['letters-printer', 'seal']
  }));

  return line;
}

/**
 * Create Estate Administration Line
 */
function createEstateAdministrationLine() {
  const line = new AssemblyLine({
    id: 'estate-admin',
    name: 'Estate Administration Line',
    description: 'Processing estate inventories and accountings',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'inventory-filing',
    name: 'Inventory Filing',
    description: 'Receive and file estate inventory',
    capacity: 5,
    cycleTime: 15 * 60 * 1000,
    inputTypes: [RegisterWorkItemTypes.INVENTORY_FILED],
    outputType: 'inventory_received',
    requiredSkills: ['estate-admin', 'data-entry'],
    equipment: ['estate-system']
  }));

  line.addStation(new WorkStation({
    id: 'inventory-review',
    name: 'Inventory Review',
    description: 'Review inventory for completeness',
    capacity: 3,
    cycleTime: 30 * 60 * 1000,
    inputTypes: ['inventory_received'],
    outputType: 'inventory_approved',
    requiredSkills: ['estate-review'],
    equipment: ['estate-system']
  }));

  line.addStation(new WorkStation({
    id: 'accounting-filing',
    name: 'Accounting Filing',
    description: 'Receive and file estate accounting',
    capacity: 5,
    cycleTime: 20 * 60 * 1000,
    inputTypes: [RegisterWorkItemTypes.ACCOUNTING_FILED],
    outputType: 'accounting_received',
    requiredSkills: ['estate-admin', 'accounting-review'],
    equipment: ['estate-system']
  }));

  line.addStation(new WorkStation({
    id: 'accounting-audit',
    name: 'Accounting Audit',
    description: 'Audit estate accounting for accuracy',
    capacity: 2,
    cycleTime: 2 * 60 * 60 * 1000, // 2 hours
    inputTypes: ['accounting_received'],
    outputType: 'accounting_approved',
    requiredSkills: ['estate-accounting', 'audit'],
    equipment: ['accounting-software']
  }));

  line.addStation(new WorkStation({
    id: 'estate-closing',
    name: 'Estate Closing',
    description: 'Close estate file upon final distribution',
    capacity: 3,
    cycleTime: 30 * 60 * 1000,
    inputTypes: ['accounting_approved'],
    outputType: RegisterWorkItemTypes.ESTATE_CLOSED,
    requiredSkills: ['estate-admin'],
    equipment: ['estate-system']
  }));

  return line;
}

/**
 * Create Inheritance Tax Line per 72 P.S. §9101
 */
function createInheritanceTaxLine() {
  const line = new AssemblyLine({
    id: 'inheritance-tax',
    name: 'Inheritance Tax Line',
    description: 'Processing PA inheritance tax per 72 P.S. §9101',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'return-filing',
    name: 'Return Filing',
    description: 'Receive inheritance tax return (REV-1500)',
    capacity: 5,
    cycleTime: 15 * 60 * 1000,
    inputTypes: [RegisterWorkItemTypes.TAX_RETURN_FILED],
    outputType: 'return_received',
    requiredSkills: ['tax-processing'],
    equipment: ['tax-system']
  }));

  line.addStation(new WorkStation({
    id: 'tax-assessment',
    name: 'Tax Assessment',
    description: 'Review and assess inheritance tax (0%, 4.5%, 12%, 15%)',
    capacity: 3,
    cycleTime: 1 * 60 * 60 * 1000, // 1 hour
    inputTypes: ['return_received'],
    outputType: RegisterWorkItemTypes.TAX_ASSESSED,
    requiredSkills: ['inheritance-tax', 'tax-law'],
    equipment: ['tax-calculator', 'rate-schedule']
  }));

  line.addStation(new WorkStation({
    id: 'tax-collection',
    name: 'Tax Collection',
    description: 'Collect inheritance tax payment',
    capacity: 5,
    cycleTime: 10 * 60 * 1000,
    inputTypes: [RegisterWorkItemTypes.TAX_PAID],
    outputType: 'tax_collected',
    requiredSkills: ['cash-handling', 'receipting'],
    equipment: ['payment-system']
  }));

  line.addStation(new WorkStation({
    id: 'state-remittance',
    name: 'State Remittance',
    description: 'Monthly remittance to PA Department of Revenue',
    capacity: 1,
    cycleTime: 4 * 60 * 60 * 1000, // 4 hours monthly
    inputTypes: [RegisterWorkItemTypes.TAX_REMITTED],
    outputType: 'completed',
    requiredSkills: ['state-reporting', 'accounting'],
    equipment: ['state-portal', 'accounting-system']
  }));

  return line;
}

/**
 * Create Marriage License Line
 */
function createMarriageLicenseLine() {
  const line = new AssemblyLine({
    id: 'marriage-licenses',
    name: 'Marriage License Line',
    description: 'Processing marriage license applications',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'license-application',
    name: 'Application Processing',
    description: 'Receive and process marriage license applications',
    capacity: 4,
    cycleTime: 20 * 60 * 1000, // 20 minutes
    inputTypes: [RegisterWorkItemTypes.LICENSE_APPLICATION],
    outputType: 'application_received',
    requiredSkills: ['customer-service', 'data-entry'],
    equipment: ['license-system', 'id-verification']
  }));

  line.addStation(new WorkStation({
    id: 'waiting-period',
    name: 'Waiting Period',
    description: '3-day waiting period (unless waived)',
    capacity: 100,
    cycleTime: 3 * 24 * 60 * 60 * 1000, // 3 days
    inputTypes: ['application_received'],
    outputType: 'waiting_complete',
    requiredSkills: [],
    equipment: ['calendar-system']
  }));

  line.addStation(new WorkStation({
    id: 'license-issuance',
    name: 'License Issuance',
    description: 'Issue marriage license',
    capacity: 4,
    cycleTime: 10 * 60 * 1000, // 10 minutes
    inputTypes: ['waiting_complete'],
    outputType: RegisterWorkItemTypes.LICENSE_ISSUED,
    requiredSkills: ['document-preparation'],
    equipment: ['license-printer', 'seal']
  }));

  line.addStation(new WorkStation({
    id: 'vital-records',
    name: 'Vital Records Reporting',
    description: 'Report to PA vital statistics',
    capacity: 10,
    cycleTime: 5 * 60 * 1000,
    inputTypes: [RegisterWorkItemTypes.LICENSE_ISSUED],
    outputType: 'completed',
    requiredSkills: ['vital-records'],
    equipment: ['vital-records-system']
  }));

  return line;
}

/**
 * Create Guardian Accounts Line
 */
function createGuardianAccountsLine() {
  const line = new AssemblyLine({
    id: 'guardian-accounts',
    name: 'Guardian Accounts Line',
    description: 'Reviewing guardian financial reports for incapacitated persons',
    layout: 'linear'
  });

  line.addStation(new WorkStation({
    id: 'report-filing',
    name: 'Report Filing',
    description: 'Receive annual guardian reports',
    capacity: 10,
    cycleTime: 10 * 60 * 1000,
    inputTypes: [RegisterWorkItemTypes.GUARDIAN_REPORT],
    outputType: 'report_received',
    requiredSkills: ['document-processing'],
    equipment: ['guardian-system']
  }));

  line.addStation(new WorkStation({
    id: 'report-review',
    name: 'Report Review',
    description: 'Review guardian accounting for compliance',
    capacity: 3,
    cycleTime: 1 * 60 * 60 * 1000, // 1 hour
    inputTypes: ['report_received'],
    outputType: RegisterWorkItemTypes.GUARDIAN_REVIEWED,
    requiredSkills: ['guardian-review', 'accounting'],
    equipment: ['review-checklist']
  }));

  line.addStation(new WorkStation({
    id: 'court-referral',
    name: 'Court Referral',
    description: 'Refer issues to Orphans Court if needed',
    capacity: 2,
    cycleTime: 30 * 60 * 1000,
    inputTypes: ['issues_found'],
    outputType: 'completed',
    requiredSkills: ['court-procedures'],
    equipment: ['court-referral-system']
  }));

  return line;
}

export function createRegisterOfWillsUnit() {
  const unit = new ProductionUnit({
    id: 'register-of-wills',
    name: 'Register of Wills',
    type: 'row_officer',
    authority: '16 Pa.C.S. Article XI (§1101-1110)',
    description: 'Probate, estate administration, inheritance tax, marriage licenses, Clerk of Orphans Court',
    staffing: {
      fte: 14,
      positions: [
        { title: 'Register of Wills', count: 1, elected: true },
        { title: 'Chief Deputy', count: 1 },
        { title: 'Probate Clerk', count: 4 },
        { title: 'Estate Clerk', count: 3 },
        { title: 'Tax Clerk', count: 2 },
        { title: 'Marriage License Clerk', count: 2 },
        { title: 'Administrative Staff', count: 1 }
      ]
    },
    operatingHours: { start: 8, end: 17 },
    position: { x: 500, y: 0, z: 0 },
    dimensions: { width: 45, height: 6, depth: 30 }
  });

  unit.addLine(createProbateLine());
  unit.addLine(createEstateAdministrationLine());
  unit.addLine(createInheritanceTaxLine());
  unit.addLine(createMarriageLicenseLine());
  unit.addLine(createGuardianAccountsLine());

  return unit;
}

export function createRegisterWorkItems() {
  return {
    willFiling: (id, decedent, executor, dateOfDeath) => new WorkItem(
      `will-${id}`,
      RegisterWorkItemTypes.WILL_FILED,
      { decedent, executor, dateOfDeath }
    ),
    marriageApplication: (id, applicant1, applicant2) => new WorkItem(
      `marriage-${id}`,
      RegisterWorkItemTypes.LICENSE_APPLICATION,
      { applicant1, applicant2 }
    ),
    inheritanceTaxReturn: (id, estate, taxableValue) => new WorkItem(
      `tax-${id}`,
      RegisterWorkItemTypes.TAX_RETURN_FILED,
      { estate, taxableValue }
    )
  };
}

export default createRegisterOfWillsUnit;
