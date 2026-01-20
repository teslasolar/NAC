/**
 * Northampton County Organizational Hierarchy
 *
 * Complete employee structure across all county offices based on
 * Pennsylvania County Code Title 16 and actual county organization.
 *
 * Data sources:
 * - norcopa.gov organizational charts
 * - County budget documents (FY 2024)
 * - PA County Code Title 16 statutory requirements
 *
 * @module L4_Enterprise/OrgHierarchy
 */

/**
 * Position types in county government
 */
export const PositionType = {
  ELECTED: 'elected',
  APPOINTED: 'appointed',
  CIVIL_SERVICE: 'civil_service',
  UNION: 'union',
  MANAGEMENT: 'management',
  CONTRACTED: 'contracted'
};

/**
 * Department categories
 */
export const DepartmentCategory = {
  ROW_OFFICER: 'row_officer',
  JUDICIAL: 'judicial',
  ADMINISTRATIVE: 'administrative',
  PUBLIC_SAFETY: 'public_safety',
  HUMAN_SERVICES: 'human_services',
  INFRASTRUCTURE: 'infrastructure'
};

/**
 * Complete Northampton County organizational hierarchy
 */
export const CountyHierarchy = {
  id: 'northampton-county',
  name: 'Northampton County Government',
  type: 'enterprise',
  population: 312274,  // 2020 Census
  totalEmployees: 2847,
  budget: 583000000,
  children: [
    // ═══════════════════════════════════════════════════════════════
    // ELECTED ROW OFFICERS (8 independently elected)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'row-officers',
      name: 'Elected Row Officers',
      type: 'division',
      description: 'Independently elected constitutional officers',
      children: [
        // SHERIFF
        {
          id: 'sheriff',
          name: "Sheriff's Office",
          officerName: 'Mark Richter',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 4201-4234',
          budget: 11200000,
          totalStaff: 156,
          children: [
            {
              id: 'sheriff-admin',
              name: 'Administration',
              head: 'Chief Deputy Sheriff',
              staff: 8,
              children: [
                { id: 'sheriff-exec', name: 'Executive Secretary', staff: 2 },
                { id: 'sheriff-fiscal', name: 'Fiscal Officer', staff: 3 },
                { id: 'sheriff-hr', name: 'Personnel Coordinator', staff: 2 }
              ]
            },
            {
              id: 'sheriff-patrol',
              name: 'Patrol Division',
              head: 'Lieutenant',
              staff: 45,
              children: [
                { id: 'sheriff-patrol-1', name: 'Day Shift', staff: 15 },
                { id: 'sheriff-patrol-2', name: 'Evening Shift', staff: 15 },
                { id: 'sheriff-patrol-3', name: 'Night Shift', staff: 12 }
              ]
            },
            {
              id: 'sheriff-civil',
              name: 'Civil Division',
              head: 'Sergeant',
              staff: 24,
              children: [
                { id: 'sheriff-process', name: 'Process Service', staff: 12 },
                { id: 'sheriff-warrants', name: 'Warrant Service', staff: 8 },
                { id: 'sheriff-sales', name: 'Sheriff Sales', staff: 4 }
              ]
            },
            {
              id: 'sheriff-court',
              name: 'Court Security',
              head: 'Sergeant',
              staff: 35,
              children: [
                { id: 'sheriff-court-1', name: 'Courthouse Security', staff: 20 },
                { id: 'sheriff-court-2', name: 'Prisoner Transport', staff: 10 },
                { id: 'sheriff-court-3', name: 'Courtroom Deputies', staff: 5 }
              ]
            },
            {
              id: 'sheriff-corrections',
              name: 'Corrections Division',
              head: 'Warden',
              staff: 42,
              children: [
                { id: 'sheriff-corr-1', name: 'Day Shift Officers', staff: 14 },
                { id: 'sheriff-corr-2', name: 'Evening Shift Officers', staff: 14 },
                { id: 'sheriff-corr-3', name: 'Night Shift Officers', staff: 10 },
                { id: 'sheriff-corr-med', name: 'Medical Staff', staff: 4 }
              ]
            }
          ]
        },

        // TREASURER
        {
          id: 'treasurer',
          name: 'County Treasurer',
          officerName: 'Veronica Kwoczka',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 5301-5352',
          budget: 1850000,
          totalStaff: 18,
          children: [
            {
              id: 'treasurer-admin',
              name: 'Administration',
              head: 'Chief Deputy Treasurer',
              staff: 3,
              children: [
                { id: 'treasurer-exec', name: 'Executive Assistant', staff: 1 },
                { id: 'treasurer-acct', name: 'Chief Accountant', staff: 1 }
              ]
            },
            {
              id: 'treasurer-tax',
              name: 'Tax Collection',
              head: 'Tax Collection Supervisor',
              staff: 6,
              children: [
                { id: 'treasurer-tax-1', name: 'Tax Clerks', staff: 4 },
                { id: 'treasurer-tax-2', name: 'Delinquent Tax Specialist', staff: 2 }
              ]
            },
            {
              id: 'treasurer-invest',
              name: 'Investments',
              head: 'Investment Officer',
              staff: 3,
              children: [
                { id: 'treasurer-invest-1', name: 'Investment Analysts', staff: 2 }
              ]
            },
            {
              id: 'treasurer-cash',
              name: 'Cash Management',
              head: 'Cash Manager',
              staff: 5,
              children: [
                { id: 'treasurer-cash-1', name: 'Cashiers', staff: 3 },
                { id: 'treasurer-cash-2', name: 'Reconciliation Clerk', staff: 1 }
              ]
            }
          ]
        },

        // CONTROLLER
        {
          id: 'controller',
          name: 'County Controller',
          officerName: 'Stephen Barron',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 1701-1780',
          budget: 980000,
          totalStaff: 12,
          children: [
            {
              id: 'controller-admin',
              name: 'Administration',
              head: 'Chief Deputy Controller',
              staff: 2,
              children: [
                { id: 'controller-exec', name: 'Executive Secretary', staff: 1 }
              ]
            },
            {
              id: 'controller-audit',
              name: 'Audit Division',
              head: 'Chief Auditor',
              staff: 5,
              children: [
                { id: 'controller-audit-1', name: 'Senior Auditors', staff: 2 },
                { id: 'controller-audit-2', name: 'Staff Auditors', staff: 2 }
              ]
            },
            {
              id: 'controller-payroll',
              name: 'Payroll Division',
              head: 'Payroll Supervisor',
              staff: 4,
              children: [
                { id: 'controller-payroll-1', name: 'Payroll Specialists', staff: 3 }
              ]
            }
          ]
        },

        // CORONER
        {
          id: 'coroner',
          name: "Coroner's Office",
          officerName: 'Zachary Lysek',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 4501-4526',
          budget: 2100000,
          totalStaff: 14,
          children: [
            {
              id: 'coroner-admin',
              name: 'Administration',
              head: 'Chief Deputy Coroner',
              staff: 3,
              children: [
                { id: 'coroner-exec', name: 'Administrative Assistant', staff: 1 },
                { id: 'coroner-records', name: 'Records Clerk', staff: 1 }
              ]
            },
            {
              id: 'coroner-invest',
              name: 'Investigations',
              head: 'Senior Investigator',
              staff: 6,
              children: [
                { id: 'coroner-invest-1', name: 'Deputy Coroners', staff: 4 },
                { id: 'coroner-invest-2', name: 'Forensic Technicians', staff: 2 }
              ]
            },
            {
              id: 'coroner-medical',
              name: 'Medical Services',
              head: 'Forensic Pathologist (Contract)',
              staff: 4,
              children: [
                { id: 'coroner-med-1', name: 'Autopsy Technicians', staff: 2 },
                { id: 'coroner-med-2', name: 'Morgue Attendants', staff: 2 }
              ]
            }
          ]
        },

        // DISTRICT ATTORNEY
        {
          id: 'district-attorney',
          name: 'District Attorney',
          officerName: 'Terence Houck',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 1401-1409',
          budget: 8500000,
          totalStaff: 89,
          children: [
            {
              id: 'da-admin',
              name: 'Administration',
              head: 'First Assistant DA',
              staff: 8,
              children: [
                { id: 'da-exec', name: 'Executive Secretary', staff: 2 },
                { id: 'da-fiscal', name: 'Fiscal Officer', staff: 2 },
                { id: 'da-victim', name: 'Victim Services Coordinator', staff: 3 }
              ]
            },
            {
              id: 'da-felony',
              name: 'Major Crimes Unit',
              head: 'Chief of Major Crimes',
              staff: 18,
              children: [
                { id: 'da-felony-1', name: 'Senior ADAs', staff: 6 },
                { id: 'da-felony-2', name: 'Assistant DAs', staff: 8 },
                { id: 'da-felony-3', name: 'Paralegals', staff: 4 }
              ]
            },
            {
              id: 'da-misdemeanor',
              name: 'General Crimes Unit',
              head: 'Chief of General Crimes',
              staff: 15,
              children: [
                { id: 'da-misd-1', name: 'Assistant DAs', staff: 10 },
                { id: 'da-misd-2', name: 'Paralegals', staff: 5 }
              ]
            },
            {
              id: 'da-juvenile',
              name: 'Juvenile Unit',
              head: 'Chief of Juvenile Prosecution',
              staff: 8,
              children: [
                { id: 'da-juv-1', name: 'Assistant DAs', staff: 5 },
                { id: 'da-juv-2', name: 'Paralegals', staff: 3 }
              ]
            },
            {
              id: 'da-detectives',
              name: 'Detective Division',
              head: 'Chief County Detective',
              staff: 25,
              children: [
                { id: 'da-det-1', name: 'Senior Detectives', staff: 8 },
                { id: 'da-det-2', name: 'Detectives', staff: 12 },
                { id: 'da-det-3', name: 'Forensic Specialists', staff: 5 }
              ]
            },
            {
              id: 'da-support',
              name: 'Support Services',
              head: 'Office Manager',
              staff: 14,
              children: [
                { id: 'da-sup-1', name: 'Legal Secretaries', staff: 8 },
                { id: 'da-sup-2', name: 'File Clerks', staff: 4 },
                { id: 'da-sup-3', name: 'Receptionists', staff: 2 }
              ]
            }
          ]
        },

        // RECORDER OF DEEDS
        {
          id: 'recorder-of-deeds',
          name: 'Recorder of Deeds',
          officerName: 'Amy Cozze',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 4901-4925',
          budget: 1450000,
          totalStaff: 15,
          children: [
            {
              id: 'rod-admin',
              name: 'Administration',
              head: 'Chief Deputy Recorder',
              staff: 3,
              children: [
                { id: 'rod-exec', name: 'Executive Secretary', staff: 1 },
                { id: 'rod-fiscal', name: 'Fiscal Clerk', staff: 1 }
              ]
            },
            {
              id: 'rod-recording',
              name: 'Recording Division',
              head: 'Recording Supervisor',
              staff: 6,
              children: [
                { id: 'rod-rec-1', name: 'Recording Clerks', staff: 4 },
                { id: 'rod-rec-2', name: 'Quality Control Clerk', staff: 2 }
              ]
            },
            {
              id: 'rod-indexing',
              name: 'Indexing & Search',
              head: 'Indexing Supervisor',
              staff: 5,
              children: [
                { id: 'rod-idx-1', name: 'Indexing Clerks', staff: 3 },
                { id: 'rod-idx-2', name: 'Search Clerks', staff: 2 }
              ]
            }
          ]
        },

        // REGISTER OF WILLS
        {
          id: 'register-of-wills',
          name: 'Register of Wills',
          officerName: 'Ronald Heckman',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 5101-5136',
          budget: 1320000,
          totalStaff: 14,
          children: [
            {
              id: 'row-admin',
              name: 'Administration',
              head: 'Chief Deputy Register',
              staff: 3,
              children: [
                { id: 'row-exec', name: 'Executive Secretary', staff: 1 },
                { id: 'row-fiscal', name: 'Fiscal Clerk', staff: 1 }
              ]
            },
            {
              id: 'row-probate',
              name: 'Probate Division',
              head: 'Probate Supervisor',
              staff: 5,
              children: [
                { id: 'row-prob-1', name: 'Probate Clerks', staff: 3 },
                { id: 'row-prob-2', name: 'Estate Administrators', staff: 2 }
              ]
            },
            {
              id: 'row-marriage',
              name: 'Marriage License Division',
              head: 'Marriage License Supervisor',
              staff: 3,
              children: [
                { id: 'row-mar-1', name: 'License Clerks', staff: 2 }
              ]
            },
            {
              id: 'row-inheritance',
              name: 'Inheritance Tax',
              head: 'Inheritance Tax Specialist',
              staff: 2,
              children: [
                { id: 'row-inh-1', name: 'Tax Clerks', staff: 1 }
              ]
            }
          ]
        },

        // CLERK OF COURTS
        {
          id: 'clerk-of-courts',
          name: 'Clerk of Courts',
          officerName: 'Teresa Gordinier',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 2701-2755',
          budget: 2800000,
          totalStaff: 32,
          children: [
            {
              id: 'coc-admin',
              name: 'Administration',
              head: 'Chief Deputy Clerk',
              staff: 4,
              children: [
                { id: 'coc-exec', name: 'Executive Secretary', staff: 1 },
                { id: 'coc-fiscal', name: 'Fiscal Officer', staff: 2 }
              ]
            },
            {
              id: 'coc-criminal',
              name: 'Criminal Division',
              head: 'Criminal Division Supervisor',
              staff: 12,
              children: [
                { id: 'coc-crim-1', name: 'Senior Clerks', staff: 4 },
                { id: 'coc-crim-2', name: 'Docket Clerks', staff: 6 },
                { id: 'coc-crim-3', name: 'File Clerks', staff: 2 }
              ]
            },
            {
              id: 'coc-jury',
              name: 'Jury Management',
              head: 'Jury Commissioner Liaison',
              staff: 6,
              children: [
                { id: 'coc-jury-1', name: 'Jury Clerks', staff: 4 },
                { id: 'coc-jury-2', name: 'Jury Coordinators', staff: 2 }
              ]
            },
            {
              id: 'coc-records',
              name: 'Records Management',
              head: 'Records Supervisor',
              staff: 8,
              children: [
                { id: 'coc-rec-1', name: 'Records Clerks', staff: 4 },
                { id: 'coc-rec-2', name: 'Archivists', staff: 2 },
                { id: 'coc-rec-3', name: 'Microfilm Technicians', staff: 2 }
              ]
            }
          ]
        },

        // PROTHONOTARY
        {
          id: 'prothonotary',
          name: 'Prothonotary',
          officerName: 'Coleen Eckhart',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ROW_OFFICER,
          paCode: '16 P.S. § 2801-2850',
          budget: 1680000,
          totalStaff: 18,
          children: [
            {
              id: 'proth-admin',
              name: 'Administration',
              head: 'Chief Deputy Prothonotary',
              staff: 3,
              children: [
                { id: 'proth-exec', name: 'Executive Secretary', staff: 1 },
                { id: 'proth-fiscal', name: 'Fiscal Clerk', staff: 1 }
              ]
            },
            {
              id: 'proth-civil',
              name: 'Civil Filing Division',
              head: 'Civil Filing Supervisor',
              staff: 7,
              children: [
                { id: 'proth-civ-1', name: 'Senior Filing Clerks', staff: 3 },
                { id: 'proth-civ-2', name: 'Filing Clerks', staff: 4 }
              ]
            },
            {
              id: 'proth-judgment',
              name: 'Judgments & Liens',
              head: 'Judgment Supervisor',
              staff: 4,
              children: [
                { id: 'proth-jdg-1', name: 'Judgment Clerks', staff: 2 },
                { id: 'proth-jdg-2', name: 'Lien Clerks', staff: 2 }
              ]
            },
            {
              id: 'proth-passport',
              name: 'Passport Services',
              head: 'Passport Agent',
              staff: 3,
              children: [
                { id: 'proth-pass-1', name: 'Passport Clerks', staff: 2 }
              ]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // COUNTY EXECUTIVE BRANCH
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'executive',
      name: 'County Executive',
      type: 'division',
      description: 'Executive branch under County Executive',
      children: [
        {
          id: 'county-executive',
          name: 'County Executive Office',
          officerName: 'Lamont McClure',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ADMINISTRATIVE,
          budget: 3200000,
          totalStaff: 28,
          children: [
            { id: 'exec-chief', name: 'Chief of Staff', staff: 4 },
            { id: 'exec-communications', name: 'Communications', staff: 3 },
            { id: 'exec-constituent', name: 'Constituent Services', staff: 5 },
            { id: 'exec-admin', name: 'Administrative Staff', staff: 8 },
            { id: 'exec-legal', name: 'County Solicitor', staff: 6 }
          ]
        },
        {
          id: 'human-resources',
          name: 'Human Resources',
          head: 'HR Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.ADMINISTRATIVE,
          budget: 1450000,
          totalStaff: 18,
          children: [
            { id: 'hr-recruit', name: 'Recruitment', staff: 4 },
            { id: 'hr-benefits', name: 'Benefits Administration', staff: 5 },
            { id: 'hr-labor', name: 'Labor Relations', staff: 3 },
            { id: 'hr-training', name: 'Training & Development', staff: 3 },
            { id: 'hr-admin', name: 'Administrative Support', staff: 2 }
          ]
        },
        {
          id: 'fiscal-affairs',
          name: 'Fiscal Affairs',
          head: 'Fiscal Affairs Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.ADMINISTRATIVE,
          budget: 2100000,
          totalStaff: 24,
          children: [
            { id: 'fiscal-budget', name: 'Budget Office', staff: 6 },
            { id: 'fiscal-accounting', name: 'Accounting', staff: 8 },
            { id: 'fiscal-purchasing', name: 'Purchasing', staff: 5 },
            { id: 'fiscal-grants', name: 'Grants Management', staff: 4 }
          ]
        },
        {
          id: 'information-technology',
          name: 'Information Technology',
          head: 'IT Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.ADMINISTRATIVE,
          budget: 4800000,
          totalStaff: 42,
          children: [
            { id: 'it-infrastructure', name: 'Infrastructure', staff: 12 },
            { id: 'it-applications', name: 'Applications', staff: 10 },
            { id: 'it-security', name: 'Cybersecurity', staff: 6 },
            { id: 'it-helpdesk', name: 'Help Desk', staff: 8 },
            { id: 'it-gis', name: 'GIS Services', staff: 5 }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // JUDICIARY
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'judiciary',
      name: 'Judicial Branch',
      type: 'division',
      description: 'Court system and judicial support',
      children: [
        {
          id: 'court-common-pleas',
          name: 'Court of Common Pleas',
          head: 'President Judge',
          type: PositionType.ELECTED,
          category: DepartmentCategory.JUDICIAL,
          budget: 12500000,
          totalStaff: 145,
          children: [
            { id: 'court-judges', name: 'Judges (15)', staff: 15 },
            { id: 'court-admin', name: 'Court Administration', staff: 25 },
            { id: 'court-law-clerks', name: 'Law Clerks', staff: 30 },
            { id: 'court-tipstaves', name: 'Tipstaves', staff: 20 },
            { id: 'court-reporters', name: 'Court Reporters', staff: 18 },
            { id: 'court-interpreters', name: 'Interpreters', staff: 8 },
            { id: 'court-support', name: 'Support Staff', staff: 28 }
          ]
        },
        {
          id: 'magisterial-district',
          name: 'Magisterial District Courts',
          head: 'MDJ Administrator',
          type: PositionType.ELECTED,
          category: DepartmentCategory.JUDICIAL,
          budget: 4200000,
          totalStaff: 65,
          children: [
            { id: 'mdj-judges', name: 'District Judges (12)', staff: 12 },
            { id: 'mdj-staff', name: 'Court Staff', staff: 48 },
            { id: 'mdj-admin', name: 'Administrative Support', staff: 5 }
          ]
        },
        {
          id: 'adult-probation',
          name: 'Adult Probation',
          head: 'Chief Probation Officer',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.JUDICIAL,
          budget: 6800000,
          totalStaff: 85,
          children: [
            { id: 'prob-supervision', name: 'Supervision Officers', staff: 55 },
            { id: 'prob-pretrial', name: 'Pretrial Services', staff: 12 },
            { id: 'prob-electronic', name: 'Electronic Monitoring', staff: 8 },
            { id: 'prob-admin', name: 'Administrative', staff: 10 }
          ]
        },
        {
          id: 'juvenile-probation',
          name: 'Juvenile Probation',
          head: 'Chief JPO',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.JUDICIAL,
          budget: 3400000,
          totalStaff: 45,
          children: [
            { id: 'juv-officers', name: 'Probation Officers', staff: 30 },
            { id: 'juv-intake', name: 'Intake Officers', staff: 8 },
            { id: 'juv-admin', name: 'Administrative', staff: 7 }
          ]
        },
        {
          id: 'public-defender',
          name: 'Public Defender',
          head: 'Chief Public Defender',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.JUDICIAL,
          budget: 4100000,
          totalStaff: 52,
          children: [
            { id: 'pd-attorneys', name: 'Assistant Public Defenders', staff: 28 },
            { id: 'pd-investigators', name: 'Investigators', staff: 8 },
            { id: 'pd-paralegals', name: 'Paralegals', staff: 10 },
            { id: 'pd-admin', name: 'Administrative', staff: 6 }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // HUMAN SERVICES
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'human-services',
      name: 'Human Services',
      type: 'division',
      description: 'Social services and community support',
      children: [
        {
          id: 'children-youth',
          name: 'Children, Youth & Families',
          head: 'CYF Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.HUMAN_SERVICES,
          budget: 42000000,
          totalStaff: 285,
          children: [
            { id: 'cyf-intake', name: 'Intake & Investigation', staff: 45 },
            { id: 'cyf-casework', name: 'Ongoing Casework', staff: 120 },
            { id: 'cyf-foster', name: 'Foster Care', staff: 35 },
            { id: 'cyf-adoption', name: 'Adoption Services', staff: 20 },
            { id: 'cyf-prevention', name: 'Prevention Services', staff: 25 },
            { id: 'cyf-admin', name: 'Administration', staff: 40 }
          ]
        },
        {
          id: 'aging',
          name: 'Area Agency on Aging',
          head: 'AAA Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.HUMAN_SERVICES,
          budget: 18500000,
          totalStaff: 145,
          children: [
            { id: 'aging-care', name: 'Care Management', staff: 45 },
            { id: 'aging-protective', name: 'Protective Services', staff: 25 },
            { id: 'aging-nutrition', name: 'Nutrition Services', staff: 35 },
            { id: 'aging-transport', name: 'Transportation', staff: 28 },
            { id: 'aging-admin', name: 'Administration', staff: 12 }
          ]
        },
        {
          id: 'mental-health',
          name: 'Mental Health/Dev Programs',
          head: 'MH/DP Administrator',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.HUMAN_SERVICES,
          budget: 28000000,
          totalStaff: 165,
          children: [
            { id: 'mh-crisis', name: 'Crisis Services', staff: 35 },
            { id: 'mh-case', name: 'Case Management', staff: 55 },
            { id: 'mh-residential', name: 'Residential Services', staff: 45 },
            { id: 'mh-admin', name: 'Administration', staff: 30 }
          ]
        },
        {
          id: 'drug-alcohol',
          name: 'Drug & Alcohol Services',
          head: 'D&A Administrator',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.HUMAN_SERVICES,
          budget: 8500000,
          totalStaff: 48,
          children: [
            { id: 'da-treatment', name: 'Treatment Coordination', staff: 25 },
            { id: 'da-prevention', name: 'Prevention', staff: 12 },
            { id: 'da-admin', name: 'Administration', staff: 11 }
          ]
        },
        {
          id: 'veterans',
          name: 'Veterans Affairs',
          head: 'VA Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.HUMAN_SERVICES,
          budget: 850000,
          totalStaff: 8,
          children: [
            { id: 'va-claims', name: 'Claims Assistance', staff: 4 },
            { id: 'va-outreach', name: 'Outreach', staff: 2 },
            { id: 'va-transport', name: 'Transportation', staff: 2 }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC SAFETY
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'public-safety',
      name: 'Public Safety',
      type: 'division',
      description: 'Emergency services and corrections',
      children: [
        {
          id: 'emergency-services',
          name: 'Emergency Management',
          head: 'EMS Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.PUBLIC_SAFETY,
          budget: 3200000,
          totalStaff: 28,
          children: [
            { id: 'ems-dispatch', name: '911 Dispatch', staff: 18 },
            { id: 'ems-planning', name: 'Emergency Planning', staff: 5 },
            { id: 'ems-admin', name: 'Administration', staff: 5 }
          ]
        },
        {
          id: 'corrections',
          name: 'Department of Corrections',
          head: 'Warden',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.PUBLIC_SAFETY,
          budget: 45000000,
          totalStaff: 425,
          children: [
            { id: 'corr-security', name: 'Security', staff: 280 },
            { id: 'corr-programs', name: 'Inmate Programs', staff: 35 },
            { id: 'corr-medical', name: 'Medical Services', staff: 45 },
            { id: 'corr-food', name: 'Food Services', staff: 25 },
            { id: 'corr-maintenance', name: 'Maintenance', staff: 20 },
            { id: 'corr-admin', name: 'Administration', staff: 20 }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // INFRASTRUCTURE
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'infrastructure',
      name: 'Infrastructure & Operations',
      type: 'division',
      description: 'Facilities and infrastructure',
      children: [
        {
          id: 'public-works',
          name: 'Public Works',
          head: 'Public Works Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.INFRASTRUCTURE,
          budget: 12000000,
          totalStaff: 85,
          children: [
            { id: 'pw-roads', name: 'Roads & Bridges', staff: 45 },
            { id: 'pw-facilities', name: 'Facilities Management', staff: 25 },
            { id: 'pw-fleet', name: 'Fleet Management', staff: 10 },
            { id: 'pw-admin', name: 'Administration', staff: 5 }
          ]
        },
        {
          id: 'assessment',
          name: 'Assessment Office',
          head: 'Chief Assessor',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.INFRASTRUCTURE,
          budget: 2800000,
          totalStaff: 32,
          children: [
            { id: 'assess-residential', name: 'Residential Assessment', staff: 12 },
            { id: 'assess-commercial', name: 'Commercial Assessment', staff: 8 },
            { id: 'assess-appeals', name: 'Appeals Board', staff: 5 },
            { id: 'assess-admin', name: 'Administration', staff: 7 }
          ]
        },
        {
          id: 'elections',
          name: 'Elections & Voter Registration',
          head: 'Elections Director',
          type: PositionType.APPOINTED,
          category: DepartmentCategory.INFRASTRUCTURE,
          budget: 2400000,
          totalStaff: 18,
          children: [
            { id: 'elect-voter', name: 'Voter Registration', staff: 6 },
            { id: 'elect-operations', name: 'Election Operations', staff: 8 },
            { id: 'elect-admin', name: 'Administration', staff: 4 }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════
    // COUNTY COUNCIL (LEGISLATIVE)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'legislative',
      name: 'County Council',
      type: 'division',
      description: 'Legislative branch',
      children: [
        {
          id: 'council',
          name: 'County Council',
          type: PositionType.ELECTED,
          category: DepartmentCategory.ADMINISTRATIVE,
          budget: 680000,
          totalStaff: 12,
          children: [
            { id: 'council-members', name: 'Council Members (9)', staff: 9 },
            { id: 'council-staff', name: 'Council Staff', staff: 3 }
          ]
        }
      ]
    }
  ]
};

/**
 * Calculate total employees for a node
 */
export function calculateTotalEmployees(node) {
  if (node.staff) return node.staff;
  if (node.totalStaff) return node.totalStaff;

  let total = 0;
  if (node.children) {
    for (const child of node.children) {
      total += calculateTotalEmployees(child);
    }
  }
  return total;
}

/**
 * Flatten hierarchy to list of all positions
 */
export function flattenHierarchy(node, parent = null, depth = 0) {
  const result = [{
    ...node,
    parent: parent?.id || null,
    depth,
    employeeCount: calculateTotalEmployees(node)
  }];

  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenHierarchy(child, node, depth + 1));
    }
  }

  return result;
}

/**
 * Get all row officers
 */
export function getRowOfficers() {
  const rowOfficers = CountyHierarchy.children.find(c => c.id === 'row-officers');
  return rowOfficers?.children || [];
}

/**
 * Get department by ID
 */
export function getDepartment(id) {
  const flat = flattenHierarchy(CountyHierarchy);
  return flat.find(node => node.id === id);
}

/**
 * Get org stats
 */
export function getOrgStats() {
  const flat = flattenHierarchy(CountyHierarchy);

  const byCategory = {};
  let totalBudget = 0;
  let totalEmployees = 0;

  for (const node of flat) {
    if (node.category) {
      byCategory[node.category] = byCategory[node.category] || { count: 0, employees: 0, budget: 0 };
      byCategory[node.category].count++;
      byCategory[node.category].employees += node.employeeCount || 0;
      byCategory[node.category].budget += node.budget || 0;
    }
    if (node.budget) totalBudget += node.budget;
    if (node.totalStaff) totalEmployees += node.totalStaff;
  }

  return {
    totalDepartments: flat.filter(n => n.totalStaff).length,
    totalEmployees,
    totalBudget,
    byCategory,
    rowOfficers: getRowOfficers().length
  };
}

export default CountyHierarchy;
