/**
 * Tag Providers Index - Ignition-style tag management
 *
 * Architecture:
 * - tags/*.json     - Pure data definitions (like OPC tags)
 * - providers/*.js  - Tag providers (data loading, binding, logic)
 *
 * Usage:
 *   <script src="js/providers/index.js"></script>
 *   <script>
 *     // Load tag provider
 *     const ledger = await createLedgerProvider();
 *     const records = ledger.getRecords();
 *   </script>
 */

// Initialize global tag provider
if (typeof TagProvider !== 'undefined') {
  window.tagProvider = new TagProvider();
}

// Available providers:
// - TagProvider      - Base tag loading system
// - LedgerProvider   - Blockchain ledger records
// - NoticeProvider   - Public notice board
// - RiskProvider     - AI risk scoring
// - GISProvider      - Parcel/GIS data

// Available tags:
// - ledger-records   - County document blockchain
// - notices          - Public notices and announcements
// - county-units     - ISA-95 production units (row officers)
// - risk-areas       - AI risk scoring areas
// - parcels          - GIS parcel data

console.log('NAC Tag Providers loaded');
