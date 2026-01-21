// Org Chart Data
const orgData = {
  rowOfficers: [
    { id: 'sheriff', name: "Sheriff's Office", officer: 'Mark Richter', category: 'row-officer', budget: 11200000, staff: 156, oee: 77.8,
      children: [{ name: 'Administration', staff: 8 }, { name: 'Patrol Division', staff: 45 }, { name: 'Civil Division', staff: 24 }, { name: 'Court Security', staff: 35 }, { name: 'Corrections Division', staff: 42 }] },
    { id: 'treasurer', name: "County Treasurer", officer: 'Veronica Kwoczka', category: 'row-officer', budget: 1850000, staff: 18, oee: 86.4,
      children: [{ name: 'Administration', staff: 3 }, { name: 'Tax Collection', staff: 6 }, { name: 'Investments', staff: 3 }, { name: 'Cash Management', staff: 5 }] },
    { id: 'controller', name: "County Controller", officer: 'Tara Zrinski', category: 'row-officer', budget: 980000, staff: 12, oee: 74.2,
      children: [{ name: 'Administration', staff: 2 }, { name: 'Audit Division', staff: 5 }, { name: 'Payroll Division', staff: 4 }] },
    { id: 'coroner', name: "Coroner's Office", officer: 'Zachary Lysek', category: 'row-officer', budget: 2100000, staff: 14, oee: 71.2,
      children: [{ name: 'Administration', staff: 3 }, { name: 'Investigations', staff: 6 }, { name: 'Medical Services', staff: 4 }] },
    { id: 'district-attorney', name: "District Attorney", officer: 'Terence Houck', category: 'row-officer', budget: 8500000, staff: 89, oee: 68.2,
      children: [{ name: 'Administration', staff: 8 }, { name: 'Major Crimes Unit', staff: 18 }, { name: 'General Crimes Unit', staff: 15 }, { name: 'Juvenile Unit', staff: 8 }, { name: 'Detective Division', staff: 25 }, { name: 'Support Services', staff: 14 }] },
    { id: 'recorder-of-deeds', name: "Recorder of Deeds", officer: 'Amy Cozze', category: 'row-officer', budget: 1450000, staff: 15, oee: 82.1,
      children: [{ name: 'Administration', staff: 3 }, { name: 'Recording Division', staff: 6 }, { name: 'Indexing & Search', staff: 5 }] },
    { id: 'register-of-wills', name: "Register of Wills", officer: 'Ronald Heckman', category: 'row-officer', budget: 1320000, staff: 14, oee: 73.5,
      children: [{ name: 'Administration', staff: 3 }, { name: 'Probate Division', staff: 5 }, { name: 'Marriage Licenses', staff: 3 }, { name: 'Inheritance Tax', staff: 2 }] },
    { id: 'clerk-of-courts', name: "Clerk of Courts", officer: 'Teresa Gordinier', category: 'row-officer', budget: 2800000, staff: 32, oee: 74.2,
      children: [{ name: 'Administration', staff: 4 }, { name: 'Criminal Division', staff: 12 }, { name: 'Jury Management', staff: 6 }, { name: 'Records Management', staff: 8 }] },
    { id: 'prothonotary', name: "Prothonotary", officer: 'Coleen Eckhart', category: 'row-officer', budget: 1680000, staff: 18, oee: 79.5,
      children: [{ name: 'Administration', staff: 3 }, { name: 'Civil Filing Division', staff: 7 }, { name: 'Judgments & Liens', staff: 4 }, { name: 'Passport Services', staff: 3 }] }
  ],
  executive: [
    { id: 'county-executive', name: "County Executive Office", officer: 'Lamont McClure', category: 'administrative', budget: 3200000, staff: 28,
      children: [{ name: 'Chief of Staff', staff: 4 }, { name: 'Communications', staff: 3 }, { name: 'Constituent Services', staff: 5 }, { name: 'Administrative Staff', staff: 8 }, { name: 'County Solicitor', staff: 6 }] },
    { id: 'human-resources', name: "Human Resources", officer: 'HR Director', category: 'administrative', budget: 1450000, staff: 18,
      children: [{ name: 'Recruitment', staff: 4 }, { name: 'Benefits Administration', staff: 5 }, { name: 'Labor Relations', staff: 3 }, { name: 'Training & Development', staff: 3 }] },
    { id: 'fiscal-affairs', name: "Fiscal Affairs", officer: 'Fiscal Affairs Director', category: 'administrative', budget: 2100000, staff: 24,
      children: [{ name: 'Budget Office', staff: 6 }, { name: 'Accounting', staff: 8 }, { name: 'Purchasing', staff: 5 }, { name: 'Grants Management', staff: 4 }] },
    { id: 'information-technology', name: "Information Technology", officer: 'IT Director', category: 'administrative', budget: 4800000, staff: 42,
      children: [{ name: 'Infrastructure', staff: 12 }, { name: 'Applications', staff: 10 }, { name: 'Cybersecurity', staff: 6 }, { name: 'Help Desk', staff: 8 }, { name: 'GIS Services', staff: 5 }] }
  ],
  judiciary: [
    { id: 'court-common-pleas', name: "Court of Common Pleas", officer: 'President Judge', category: 'judicial', budget: 12500000, staff: 145,
      children: [{ name: 'Judges (15)', staff: 15 }, { name: 'Court Administration', staff: 25 }, { name: 'Law Clerks', staff: 30 }, { name: 'Tipstaves', staff: 20 }, { name: 'Court Reporters', staff: 18 }, { name: 'Support Staff', staff: 28 }] },
    { id: 'adult-probation', name: "Adult Probation", officer: 'Chief Probation Officer', category: 'judicial', budget: 6800000, staff: 85,
      children: [{ name: 'Supervision Officers', staff: 55 }, { name: 'Pretrial Services', staff: 12 }, { name: 'Electronic Monitoring', staff: 8 }, { name: 'Administrative', staff: 10 }] },
    { id: 'public-defender', name: "Public Defender", officer: 'Chief Public Defender', category: 'judicial', budget: 4100000, staff: 52,
      children: [{ name: 'Assistant Public Defenders', staff: 28 }, { name: 'Investigators', staff: 8 }, { name: 'Paralegals', staff: 10 }, { name: 'Administrative', staff: 6 }] }
  ],
  humanServices: [
    { id: 'children-youth', name: "Children, Youth & Families", officer: 'CYF Director', category: 'human-services', budget: 42000000, staff: 285,
      children: [{ name: 'Intake & Investigation', staff: 45 }, { name: 'Ongoing Casework', staff: 120 }, { name: 'Foster Care', staff: 35 }, { name: 'Adoption Services', staff: 20 }, { name: 'Prevention Services', staff: 25 }, { name: 'Administration', staff: 40 }] },
    { id: 'aging', name: "Area Agency on Aging", officer: 'AAA Director', category: 'human-services', budget: 18500000, staff: 145,
      children: [{ name: 'Care Management', staff: 45 }, { name: 'Protective Services', staff: 25 }, { name: 'Nutrition Services', staff: 35 }, { name: 'Transportation', staff: 28 }] },
    { id: 'mental-health', name: "Mental Health/Dev Programs", officer: 'MH/DP Administrator', category: 'human-services', budget: 28000000, staff: 165,
      children: [{ name: 'Crisis Services', staff: 35 }, { name: 'Case Management', staff: 55 }, { name: 'Residential Services', staff: 45 }, { name: 'Administration', staff: 30 }] }
  ],
  publicSafety: [
    { id: 'corrections', name: "Department of Corrections", officer: 'Warden', category: 'public-safety', budget: 45000000, staff: 425,
      children: [{ name: 'Security', staff: 280 }, { name: 'Inmate Programs', staff: 35 }, { name: 'Medical Services', staff: 45 }, { name: 'Food Services', staff: 25 }, { name: 'Maintenance', staff: 20 }, { name: 'Administration', staff: 20 }] },
    { id: 'emergency-services', name: "Emergency Management", officer: 'EMS Director', category: 'public-safety', budget: 3200000, staff: 28,
      children: [{ name: '911 Dispatch', staff: 18 }, { name: 'Emergency Planning', staff: 5 }, { name: 'Administration', staff: 5 }] }
  ]
};
