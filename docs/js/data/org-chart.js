// Org Chart Data - Loaded from tag files
// This module loads data from centralized tags for single-source-of-truth

let orgData = null;
let orgDataLoaded = false;
let orgDataPromise = null;

// Load org data from tags
async function loadOrgData() {
  if (orgDataLoaded) return orgData;
  if (orgDataPromise) return orgDataPromise;

  orgDataPromise = (async () => {
    try {
      const tags = new TagLoader();
      const [rowOfficers, executives, oee] = await Promise.all([
        tags.load('row-officers'),
        tags.load('executives'),
        tags.load('oee-benchmarks')
      ]);

      // Build orgData structure from tags
      orgData = {
        rowOfficers: rowOfficers.officers.map(o => ({
          id: o.id,
          name: o.office,
          officer: o.name,
          category: 'row-officer',
          budget: o.budget,
          staff: o.staff,
          oee: oee.offices.find(x => x.id === o.id)?.oee || 0,
          children: o.divisions?.map(d => ({ name: d.name, staff: d.staff })) || []
        })),
        executive: executives.administrativeDepartments.map(d => ({
          id: d.id,
          name: d.name,
          officer: d.head,
          category: 'administrative',
          budget: d.budget,
          staff: d.staff,
          children: d.divisions?.map(name => ({ name, staff: Math.floor(d.staff / d.divisions.length) })) || []
        })),
        countyExecutive: {
          id: 'county-executive',
          name: 'County Executive Office',
          officer: executives.countyExecutive.name,
          category: 'administrative',
          budget: executives.countyExecutive.budget,
          staff: executives.countyExecutive.staff
        },
        // Static data for judiciary, human services, public safety (not yet in tags)
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

      // Add county executive to executive array
      orgData.executive.unshift(orgData.countyExecutive);

      orgDataLoaded = true;
      return orgData;
    } catch (err) {
      console.error('Failed to load org data from tags:', err);
      // Return fallback static data
      return getFallbackOrgData();
    }
  })();

  return orgDataPromise;
}

// Fallback data if tags fail to load
function getFallbackOrgData() {
  return {
    rowOfficers: [
      { id: 'sheriff', name: "Sheriff's Office", officer: 'Christopher Zieger', category: 'row-officer', budget: 11200000, staff: 156, oee: 77.8, children: [] },
      { id: 'fiscal-affairs-revenue', name: "Fiscal Affairs - Revenue", officer: 'Anthony Morris', category: 'row-officer', budget: 1850000, staff: 18, oee: 86.4, children: [] },
      { id: 'controller', name: "County Controller", officer: 'Acting Controller', category: 'row-officer', budget: 980000, staff: 12, oee: 74.2, children: [] },
      { id: 'coroner', name: "Coroner's Office", officer: 'Zachary Lysek', category: 'row-officer', budget: 2100000, staff: 14, oee: 71.2, children: [] },
      { id: 'district-attorney', name: "District Attorney", officer: 'Stephen G. Baratta', category: 'row-officer', budget: 8500000, staff: 89, oee: 68.2, children: [] },
      { id: 'recorder-of-deeds', name: "Recorder of Deeds", officer: 'Dorothy Edelman', category: 'row-officer', budget: 1450000, staff: 15, oee: 82.1, children: [] },
      { id: 'register-of-wills', name: "Register of Wills", officer: 'Patricia J. Manento', category: 'row-officer', budget: 1320000, staff: 14, oee: 73.5, children: [] },
      { id: 'clerk-of-courts', name: "Clerk of Courts", officer: 'Leigh Ann Fisher', category: 'row-officer', budget: 2800000, staff: 32, oee: 74.2, children: [] },
      { id: 'prothonotary', name: "Prothonotary", officer: 'Holly Ruggiero', category: 'row-officer', budget: 1680000, staff: 18, oee: 79.5, children: [] }
    ],
    executive: [],
    judiciary: [],
    humanServices: [],
    publicSafety: []
  };
}

// Sync getter (returns null if not loaded)
function getOrgData() {
  return orgData;
}

// Helper: Get all row officers
function getRowOfficers() {
  return orgData?.rowOfficers || [];
}

// Helper: Get officer by ID
function getOfficerById(id) {
  if (!orgData) return null;
  const all = [...orgData.rowOfficers, ...orgData.executive, ...orgData.judiciary, ...orgData.humanServices, ...orgData.publicSafety];
  return all.find(o => o.id === id);
}
