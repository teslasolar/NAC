# NAC - Northampton County Legal Code Intelligence System

A modular, AI-powered framework for analyzing and understanding Northampton County, Pennsylvania's legal code structure, with emphasis on the County Controller's statutory responsibilities.

## Project Purpose

This project demonstrates a comprehensive understanding of:
- Pennsylvania County Code (Title 16)
- Northampton County Home Rule Charter
- County Controller statutory duties and responsibilities
- Modern approaches to legal code analysis and governance transparency

## Architecture

The system is organized into **dimensional modules** inspired by multi-dimensional data structures:

### Fiscal Dimensions [0-2]
- **Dim 0**: Budget & Appropriations
- **Dim 1**: Audit & Compliance
- **Dim 2**: Payroll & Disbursements

### Governance Dimensions [3-5]
- **Dim 3**: County Council
- **Dim 4**: Executive Branch
- **Dim 5**: Judicial Interface

### Administrative Dimensions [6-8]
- **Dim 6**: Personnel & HR
- **Dim 7**: Procurement & Contracts
- **Dim 8**: Records & Archives

### Extended Dimensions [9+]
- **Dim 9**: Inter-agency Relations
- **Dim 10**: Public Transparency
- **Dim 11**: Emergency Operations

## Controller Focus Areas

Based on PA County Code sections 1602, 1704, 1705, 1720-1739, 1750-1764:

1. **Fiscal Supervision** - Supervising all county fiscal affairs
2. **Account Prescription** - Prescribing accounting systems
3. **Audit Functions** - Auditing all county offices
4. **Claims Review** - Scrutinizing claims against the county
5. **Payroll Administration** - Managing employee compensation
6. **Contract Custody** - Maintaining contracts, titles, deeds
7. **Board Memberships** - Retirement, Salary, Prison, Constable Review boards

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Structure

```
NAC/
├── src/
│   ├── modules/           # Legal code modules
│   │   ├── fiscal/        # Dimensions 0-2
│   │   ├── governance/    # Dimensions 3-5
│   │   ├── admin/         # Dimensions 6-8
│   │   └── extended/      # Dimensions 9+
│   ├── controller/        # Controller-specific analysis
│   ├── templates/         # Code templates and prompts
│   ├── data/              # Parsed legal code data
│   └── components/        # UI components
├── docs/                  # GitHub Pages site
└── scripts/               # Build and analysis scripts
```

## Legal Code Sources

- [PA County Code Title 16](https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=16)
- [Northampton County Home Rule Charter](https://norcopa.gov/executive-resources)
- [PA State Association of County Controllers](https://psacc.org/about)

## Author

Built for the Northampton County Controller interview demonstration.

## License

MIT License - Open source for government transparency.
