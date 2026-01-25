# Northampton County - ERP Architecture

This directory contains the complete ERP-level architecture mapping for the Northampton County Legal Code Intelligence System.

## Files

| File | Description |
|------|-------------|
| `system-map.json` | Complete system architecture with all 62 components mapped to ISA-95 layers |
| `integrations.json` | Data flows, integration points, and security zones |
| `erp-overview.html` | Interactive visual architecture diagram |

## ISA-95 Layer Structure

| Layer | Name | Components | Description |
|-------|------|------------|-------------|
| L4 | Enterprise/ERP | 14 | Business planning, financial systems, organizational structure |
| L3 | Operations/MES | 21 | Row officers, audits, citizen services, workflow management |
| L2 | Control/SCADA | 13 | Monitoring, GIS, security, protocol handling, AI services |
| L1 | Basic Control/PLC | 9 | PLC simulation, alarms, historians, batch control |
| L0 | Process/Field | 5 | Field devices, I/O monitoring, sensor calibration |

## Security Zones

1. **Public Zone** - Unrestricted access (index, about, how-government-works)
2. **Citizen Services Zone** - Authenticated citizens (payments, tickets)
3. **Operations Zone** - Authorized staff (row officers, clerk, sheriff)
4. **Financial Zone** - Privileged access (budget, ledger, controller)
5. **Control Zone** - Critical systems (SCADA, L0, L1, MES)
6. **Security Zone** - Administrative access (security scanner, audits)

## Data Flows

- **Financial Reporting Pipeline** - L4 → L3 → L2
- **Audit & Compliance Flow** - L3 → L4, L2
- **Security Monitoring Flow** - L2 → L3 → L4
- **Citizen Services Pipeline** - L4 → L3
- **GIS Data Flow** - L2 → L3 → L4
- **Industrial Control Data** - L0 → L1 → L2 → L3
- **Row Officer Operations** - L3 → L4
- **AI Services Integration** - L2 → L3 → L4

## External Systems

| System | Type | Integration Point |
|--------|------|-------------------|
| ESRI ArcGIS | Geospatial | GIS Portal |
| ES&S ExpressVote XL | Voting | Elections |
| Tyler CountySuite | ERP | Financial Systems |
| Stripe | Payments | Payment Portal |
| Coinbase Commerce | Crypto Payments | Payment Portal |

## Usage

Open `erp-overview.html` in a browser to view the interactive architecture diagram. Click on layers to expand and see all components. Click on components to navigate to their respective pages.

## Version

- **Version**: 1.0.0
- **Generated**: 2026-01-24
- **Framework**: ISA-95
