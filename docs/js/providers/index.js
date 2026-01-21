/**
 * Tag Providers Index - Ignition-style tag management
 * Northampton County Digital Twin - ISA-95 Enterprise Model
 *
 * Architecture:
 * - tags/*.json           - Full data definitions (legacy)
 * - tags/templates/*.json - Lightweight templates referencing CSVs
 * - data/csv/*.csv        - Token-efficient tabular data
 * - data/db/tags.db       - SQLite database for queries
 * - providers/*.js        - Tag providers (data loading, binding, logic)
 *
 * Data Loaders:
 * - CSVLoader      - Parse and cache CSV files
 * - TemplateLoader - Load templates + resolve CSV data sources
 * - SQLiteLoader   - Query SQLite via sql.js (WebAssembly)
 *
 * Usage (JSON providers):
 *   const ledger = await createLedgerProvider();
 *   const records = ledger.getRecords();
 *
 * Usage (CSV/Template):
 *   const loader = createTemplateLoader();
 *   const template = await loader.load('org-chart');
 *   const depts = template.data.departments;
 *
 * Usage (SQLite):
 *   const db = await createSQLiteLoader('data/db/tags.db');
 *   const depts = db.getDepartments('row-officer');
 */

// Initialize global tag provider on load
if (typeof TagProvider !== 'undefined' && !window.tagProvider) {
  window.tagProvider = new TagProvider();
}

/**
 * Available Providers (12):
 * ---------------------------------------------------------
 * Core Loaders:
 * - CSVLoader        - Parse CSV files (token-efficient)
 * - TemplateLoader   - Load templates + CSV data
 * - SQLiteLoader     - Query SQLite database
 *
 * Tag Providers:
 * - TagProvider      - Base tag loading with caching
 * - LedgerProvider   - Blockchain ledger records
 * - NoticeProvider   - Public notice board with filtering
 * - RiskProvider     - AI risk scoring and analysis
 * - GISProvider      - Parcel/GIS data operations
 * - OrgChartProvider - County organization structure
 * - AuditProvider    - Audit findings and recommendations
 * - ScreenProvider   - SCADA screen navigation/KPIs
 * - AcademyProvider  - Citizen Academy course progress
 */

/**
 * Available Tags (14):
 * ---------------------------------------------------------
 * Core Data:
 * - ledger-records       - County document blockchain
 * - notices              - Public notices and announcements
 * - parcels              - GIS parcel data with coordinates
 *
 * Organization:
 * - org-chart            - County departments (2,847 employees)
 * - county-units         - ISA-95 row officer production units
 * - audit-findings       - Sheriff/DA/Coroner audit results
 *
 * Operations:
 * - gracedale            - Nursing home operations data
 * - screens              - SCADA screen navigation config
 * - risk-areas           - AI risk scoring areas
 * - simulation-settings  - Digital twin simulation params
 *
 * Reference:
 * - academy-courses      - Citizen Academy curriculum
 * - pa-county-code       - PA Title 16 county code sections
 * - isa95-enums          - ISA-95 enumeration types
 * - transformation-plan  - 100-day Controller roadmap
 */

// Provider factory registry
window.NAC_PROVIDERS = {
  ledger: () => createLedgerProvider(),
  notice: () => createNoticeProvider(),
  risk: () => createRiskProvider(),
  gis: () => createGISProvider(),
  orgChart: () => createOrgChartProvider(),
  audit: () => createAuditProvider(),
  screen: () => createScreenProvider(),
  academy: () => createAcademyProvider()
};

// Data loader factories
window.NAC_LOADERS = {
  csv: (basePath) => createCSVLoader(basePath),
  template: (options) => createTemplateLoader(options),
  sqlite: (dbPath) => createSQLiteLoader(dbPath)
};

/**
 * CSV Files (10):
 * ---------------------------------------------------------
 * departments.csv       - 21 county departments
 * divisions.csv         - 91 dept divisions/units
 * parcels.csv           - GIS parcel data
 * municipalities.csv    - 8 townships/cities
 * notices.csv           - Public notices (header)
 * notice_descriptions.csv - Notice descriptions
 * courses.csv           - Academy courses (6)
 * lessons.csv           - Course lessons (34)
 * audit_offices.csv     - Audited offices (3)
 * audit_findings.csv    - Audit findings (15)
 * audit_recommendations.csv - Recommendations (15)
 */

console.log('NAC Tag Providers loaded (14 tags, 12 providers, 10 CSVs, SQLite)');
