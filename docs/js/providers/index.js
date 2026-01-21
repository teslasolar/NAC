/**
 * Tag Providers Index - Ignition-style tag management
 * Northampton County Digital Twin - ISA-95 Enterprise Model
 *
 * Architecture:
 * - tags/*.json     - Pure data definitions (like Ignition OPC tags/UDTs)
 * - providers/*.js  - Tag providers (data loading, binding, business logic)
 *
 * Usage:
 *   <script src="js/providers/TagProvider.js"></script>
 *   <script src="js/providers/LedgerProvider.js"></script>
 *   <script src="js/providers/index.js"></script>
 *   <script>
 *     const ledger = await createLedgerProvider();
 *     const records = ledger.getRecords();
 *   </script>
 */

// Initialize global tag provider on load
if (typeof TagProvider !== 'undefined' && !window.tagProvider) {
  window.tagProvider = new TagProvider();
}

/**
 * Available Providers (10):
 * ---------------------------------------------------------
 * TagProvider        - Base tag loading system with caching
 * LedgerProvider     - Blockchain ledger records
 * NoticeProvider     - Public notice board with filtering
 * RiskProvider       - AI risk scoring and analysis
 * GISProvider        - Parcel/GIS data operations
 * OrgChartProvider   - County organization structure
 * AuditProvider      - Audit findings and recommendations
 * ScreenProvider     - SCADA screen navigation/KPIs
 * AcademyProvider    - Citizen Academy course progress
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

console.log('NAC Tag Providers loaded (14 tags, 9 providers)');
