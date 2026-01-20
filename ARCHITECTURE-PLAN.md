# NAC Architecture Restructuring Plan

## Current State Analysis

### Critical Issues Identified

| Issue | Impact | Priority |
|-------|--------|----------|
| **Duplicate PackML** | src/isa88/ vs src/packml/ - conflicting implementations | P0 |
| **Disconnected Layers** | L0→L1→L2→L3→L4 not wired together | P0 |
| **Orphaned Modules** | Blockchain, VectorDB, Alarms isolated | P1 |
| **No Orchestration** | No workflow engine connecting components | P1 |
| **Inconsistent Formats** | Mix of JSON schemas and JS modules | P2 |
| **Digital Twin Isolated** | Not connected to ISA-95 definitions | P2 |

### File Inventory

```
Total: 167+ files across 20 directories

ISA Standards:
├── isa95/     77 files (L0-L4 hierarchy)
├── isa88/      4 files (PackML - AUTHORITATIVE)
├── isa18_2/    2 files (Alarms)
├── isa101/     2 files (HMI)
├── isa80085/   5 files (Blockchain)
├── packml/     2 files (DUPLICATE - DELETE)

Application:
├── controller/  1 file  (needs split)
├── api/         6 files (stubs only)
├── tools/       8 files (disconnected)
├── analysis/    2 files (standalone)
├── templates/   1 file  (unused)
├── ai/          1 file  (unused)

Data:
├── persistence/ 6 files (browser-only)
├── vectordb/    5 files (orphaned)
├── data/        2 files (not loaded)

Digital Twin:
└── digitaltwin/ 30+ files (isolated but well-structured)
```

---

## Target State Architecture

### Unified ISA-95 + Digital Twin Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        L4_ENTERPRISE (County Strategy)                       │
│  policies/ │ reporting/ │ strategy/ │ kpis/ │ compliance/                   │
│  ────────────────────────────────────────────────────────────────────────── │
│  JSON: policies.json, kpis.json, compliance-matrix.json                     │
│  JS:   EnterpriseController.js (orchestrates L3)                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     L3_OPERATIONS (Production Units)                         │
│  rowOfficers/  │ controller/ │ governance/ │ fiscal/ │ admin/               │
│  ────────────────────────────────────────────────────────────────────────── │
│  UDT:  UDT_ProductionUnit.json, UDT_AssemblyLine.json, UDT_Station.json     │
│  Tags: instances/{officer}/unit.json, lines/*.json, stations/*.json         │
│  JS:   {Officer}Unit.js (production unit with PackML state machine)         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       L2_CONTROL (Process Control)                           │
│  workflows/ │ rules/ │ alarms/ │ audit/ │ budget/ │ payroll/ │ procurement/ │
│  ────────────────────────────────────────────────────────────────────────── │
│  JSON: workflow-rules.json, business-rules.json, alarm-config.json          │
│  JS:   WorkflowEngine.js, RuleEngine.js, AlarmManager.js (ISA-18.2)         │
│        AuditPlan.js, BudgetCycle.js, PayCycle.js (process controllers)      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     L1_TRANSACTIONS (Work Items)                             │
│  claims/ │ payments/ │ audits/ │ records/ │ filings/                        │
│  ────────────────────────────────────────────────────────────────────────── │
│  UDT:  UDT_WorkItem.json, UDT_Claim.json, UDT_Warrant.json, UDT_Finding.json│
│  JSON: transaction-schemas.json, fee-schedules.json                         │
│  JS:   TransactionManager.js (lifecycle with PackML states)                 │
│        BlockchainSigner.js (ISA-80085 integration)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        L0_DATA (Foundation)                                  │
│  types/ │ enums/ │ schemas/ │ udt/                                          │
│  ────────────────────────────────────────────────────────────────────────── │
│  JSON: All base schemas, enums as JSON, UDT templates                       │
│  JS:   Type classes with validation, TagBrowser.js                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     INFRASTRUCTURE (Cross-Cutting)                           │
│  isa88/      PackML state machines (SINGLE source of truth)                 │
│  isa18_2/    Alarm management (integrated with L2)                          │
│  isa80085/   Blockchain ledger (integrated with L1)                         │
│  isa101/     HMI standards (integrated with digital twin)                   │
│  persistence/ Repository pattern (SQLite + IndexedDB)                       │
│  vectordb/   Semantic search (loaded with PA Code)                          │
│  api/        REST API (full implementation)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Restructuring Plan

### Phase 1: Consolidation (Remove Duplicates)

#### 1.1 Delete src/packml/ (DUPLICATE)
```bash
# Remove duplicate - isa88/PackML.js is authoritative
rm -rf src/packml/
```

#### 1.2 Merge controller/ into L3_Operations
```
src/controller/index.js → src/isa95/L3_Operations/controller/
  - Split into: StatutoryAuthority.js, BoardMemberships.js, CoreFunctions.js
  - Move prompts to templates/controller/
```

### Phase 2: Standardize Formats

#### 2.1 L0_Data - All JSON + Validation Classes
```
src/isa95/L0_Data/
├── schemas/           # JSON Schema definitions (existing)
├── enums/             # Convert to JSON
│   ├── packml-states.json      # From digitaltwin/config
│   ├── claim-status.json       # NEW
│   ├── audit-type.json         # NEW
│   ├── fund-type.json          # NEW
│   └── department.json         # NEW
├── udt/               # Move from digitaltwin/tags/udt
│   ├── base/
│   │   ├── UDT_Station.json
│   │   ├── UDT_AssemblyLine.json
│   │   ├── UDT_ProductionUnit.json
│   │   ├── UDT_WorkItem.json
│   │   └── UDT_Alarm.json
│   └── transactions/
│       ├── UDT_Claim.json       # NEW
│       ├── UDT_Warrant.json     # NEW
│       └── UDT_Finding.json     # NEW
├── types/             # JS classes with validation
└── index.js           # Unified exports
```

#### 2.2 L1_Transactions - Add State Machines
```
src/isa95/L1_Transactions/
├── claims/
│   ├── Claim.js              # Add PackML state machine
│   ├── ClaimApproval.js
│   └── claim.tags.json       # Tag instances
├── payments/
│   ├── Warrant.js            # Add PackML state machine
│   ├── Receipt.js
│   └── warrant.tags.json
├── audits/
│   ├── AuditEngagement.js    # Add PackML state machine
│   ├── Finding.js
│   └── engagement.tags.json
├── TransactionManager.js     # NEW: Lifecycle orchestration
├── BlockchainSigner.js       # NEW: ISA-80085 integration
└── index.js
```

#### 2.3 L2_Control - Add Workflow Engine
```
src/isa95/L2_Control/
├── engine/                   # NEW: Orchestration
│   ├── WorkflowEngine.js     # Execute workflows from JSON
│   ├── RuleEngine.js         # Validate business rules
│   └── EscalationManager.js  # Handle exceptions
├── alarms/                   # Move from isa18_2/
│   ├── AlarmManager.js       # Integrated with workflows
│   ├── AlarmRationalization.js
│   └── alarm-config.json     # Alarm definitions
├── audit/                    # Existing + enhancements
├── budget/
├── payroll/
├── procurement/
├── config/                   # Move from digitaltwin/config/L2
│   ├── workflow-rules.json
│   └── business-rules.json
└── index.js
```

#### 2.4 L3_Operations - Production Units with State
```
src/isa95/L3_Operations/
├── units/                    # Rename from rowOfficers/
│   ├── SheriffUnit.js        # Merge with digitaltwin officer
│   ├── TreasurerUnit.js
│   ├── CoronerUnit.js
│   ├── DistrictAttorneyUnit.js
│   ├── RecorderOfDeedsUnit.js
│   ├── RegisterOfWillsUnit.js
│   ├── ClerkOfCourtsUnit.js
│   ├── ProthonotaryUnit.js
│   └── index.js
├── controller/               # Merge from src/controller/
│   ├── StatutoryAuthority.js
│   ├── BoardMemberships.js
│   ├── CoreFunctions.js
│   └── index.js
├── governance/
├── fiscal/
├── admin/
├── tags/                     # Move from digitaltwin/tags/instances
│   ├── sheriff/
│   ├── treasurer/
│   └── ...
├── config/                   # Move from digitaltwin/config/L3
│   ├── production-units.json
│   └── assembly-lines.json
└── index.js
```

#### 2.5 L4_Enterprise - Add KPIs and Orchestration
```
src/isa95/L4_Enterprise/
├── policy/
├── reporting/
├── strategy/
├── metrics/                  # NEW
│   ├── KPIDefinitions.js
│   ├── PerformanceMonitor.js
│   └── kpis.json
├── orchestration/            # NEW
│   ├── EnterpriseController.js
│   └── ComplianceMonitor.js
├── config/                   # Move from digitaltwin/config/L4
│   └── policies.json
└── index.js
```

### Phase 3: Infrastructure Integration

#### 3.1 ISA-88 (PackML) - Single Source
```
src/isa88/
├── PackML.js                 # AUTHORITATIVE state machine
├── ProductionUnit.js         # Base class for L3 units
├── RecipeManager.js          # Batch recipes
├── BatchExecutor.js          # Batch execution
└── index.js                  # Unified exports

# All L3 units import from here
# Digital twin uses these classes
```

#### 3.2 ISA-18.2 (Alarms) - Integrate with L2
```
src/isa18_2/
├── AlarmManager.js           # Core alarm handling
├── AlarmRationalization.js   # Alarm evaluation
├── AlarmEscalation.js        # NEW: Escalate to L2 workflows
└── index.js

# L2_Control/engine/WorkflowEngine.js imports AlarmManager
# Alarms trigger workflow escalations
```

#### 3.3 ISA-80085 (Blockchain) - Integrate with L1
```
src/isa80085/
├── BlockchainCore.js
├── TransactionVerifier.js
├── MerkleTree.js
├── GovernmentLedger.js
├── TransactionSigner.js      # NEW: Sign L1 transactions
└── index.js

# L1_Transactions/BlockchainSigner.js uses this
# All claims, warrants, findings get signed
```

#### 3.4 Persistence - Add SQLite Backend
```
src/persistence/
├── Database.js               # Abstract interface
├── IndexedDBAdapter.js       # Browser storage
├── SQLiteAdapter.js          # NEW: Node.js storage
├── repositories/
│   ├── ClaimRepository.js
│   ├── WarrantRepository.js
│   ├── FindingRepository.js
│   ├── AuditRepository.js
│   ├── BudgetRepository.js
│   └── TagRepository.js      # NEW: Persist tag values
├── migrations/               # NEW: Schema migrations
└── index.js
```

#### 3.5 VectorDB - Load PA Code
```
src/vectordb/
├── VectorBlockDB.js
├── EmbeddingGenerator.js
├── BlockchainBridge.js
├── ChainLinker.js
├── SpatialIndex.js
├── PACodeLoader.js           # NEW: Load from data/
└── index.js

# scripts/init-vectors.js calls PACodeLoader
```

#### 3.6 API - Full Implementation
```
src/api/
├── server/                   # NEW: Express server
│   ├── app.js
│   ├── middleware/
│   └── routes/
│       ├── claims.js
│       ├── warrants.js
│       ├── audits.js
│       ├── officers.js
│       ├── tags.js           # Tag browser API
│       ├── blockchain.js
│       └── vectors.js
├── client/
│   ├── NACClient.js
│   └── nac-api.browser.js
└── index.js
```

### Phase 4: Digital Twin Integration

#### 4.1 Merge into L3_Operations
```
src/digitaltwin/
├── DigitalTwin.js            # Keep as orchestrator
├── SceneRenderer.js          # NEW: 3D visualization
├── SimulationEngine.js       # NEW: Time-based simulation
├── index.js
└── config/                   # REMOVE - moved to ISA-95 levels
    └── (configs moved to respective L0-L4 directories)

# Officer units merged into L3_Operations/units/
# Tags merged into L3_Operations/tags/
# UDTs merged into L0_Data/udt/
```

#### 4.2 Visualization (ISA-101)
```
src/isa101/
├── HMIStandards.js
├── ScreenBuilder.js
├── components/               # NEW: Reusable HMI components
│   ├── StateIndicator.js     # PackML state display
│   ├── AlarmBanner.js        # Active alarms
│   ├── TrendChart.js         # Historical data
│   └── DigitalTwinView.js    # 3D factory view
├── themes/                   # NEW: Color schemes
│   ├── standard.json
│   └── high-contrast.json
└── index.js
```

---

## Integration Points

### 1. Transaction Lifecycle (L1 ↔ L2 ↔ L3)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  L3: Unit   │────▶│ L1: Claim   │────▶│ L2: Workflow│────▶│ L1: Warrant │
│  (Sheriff)  │     │  SUBMITTED  │     │   Engine    │     │   ISSUED    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │                   ▼                   ▼                   ▼
       │            ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
       │            │  Blockchain │     │   Alarms    │     │  Blockchain │
       │            │   Sign Tx   │     │  (if error) │     │   Sign Tx   │
       │            └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Persistence Layer                               │
│                    (Claims, Warrants, Findings, Tags)                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Alarm Flow (L2 ↔ L3 ↔ L4)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ L3: Station │────▶│ L2: Alarm   │────▶│ L2: Workflow│────▶│ L4: KPI     │
│  (overload) │     │  Manager    │     │  Escalation │     │  Dashboard  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   ▼                   ▼
       │            ┌─────────────┐     ┌─────────────┐
       │            │  ISA-18.2   │     │   Finding   │
       │            │   States    │     │  (if audit) │
       │            └─────────────┘     └─────────────┘
```

### 3. Tag Data Flow (L0 ↔ All Levels)

```
┌─────────────┐
│  L0: UDTs   │◀───── Define structure
└─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ L3: Tags    │────▶│ TagBrowser  │◀────│ HMI Screens │
│ (instances) │     │   (read)    │     │  (display)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Persistence │     │ Digital Twin│
│   (save)    │     │   (render)  │
└─────────────┘     └─────────────┘
```

---

## Migration Steps

### Step 1: Foundation (Week 1)
- [ ] Delete src/packml/ (duplicate)
- [ ] Convert L0 enums to JSON format
- [ ] Move UDTs from digitaltwin to L0_Data
- [ ] Create unified TagBrowser in L0

### Step 2: Transactions (Week 2)
- [ ] Add PackML state machines to L1 transactions
- [ ] Create TransactionManager.js
- [ ] Integrate BlockchainSigner.js
- [ ] Create UDTs for Claim, Warrant, Finding

### Step 3: Control (Week 3)
- [ ] Create WorkflowEngine.js in L2
- [ ] Move AlarmManager to L2_Control
- [ ] Wire alarms to workflow escalation
- [ ] Load workflow-rules.json and business-rules.json

### Step 4: Operations (Week 4)
- [ ] Merge digitaltwin officers into L3_Operations/units
- [ ] Move tag instances to L3_Operations/tags
- [ ] Connect units to L2 workflows
- [ ] Merge src/controller into L3_Operations/controller

### Step 5: Enterprise (Week 5)
- [ ] Create KPI definitions in L4
- [ ] Create EnterpriseController.js
- [ ] Wire L4 dashboards to L3 metrics
- [ ] Implement compliance monitoring

### Step 6: Infrastructure (Week 6)
- [ ] Implement full API server
- [ ] Add SQLite persistence adapter
- [ ] Load PA Code into VectorDB
- [ ] Create HMI components

### Step 7: Integration Testing (Week 7)
- [ ] Test claim lifecycle end-to-end
- [ ] Test alarm escalation flow
- [ ] Test tag persistence and retrieval
- [ ] Test blockchain signing

### Step 8: Visualization (Week 8)
- [ ] Connect Digital Twin to L3 tag values
- [ ] Build HMI dashboards with ISA-101 components
- [ ] Create real-time monitoring views
- [ ] Deploy and document

---

## File Movement Summary

| From | To | Action |
|------|-----|--------|
| src/packml/* | (delete) | Remove duplicate |
| src/controller/index.js | src/isa95/L3_Operations/controller/ | Split & move |
| src/digitaltwin/tags/udt/* | src/isa95/L0_Data/udt/ | Move |
| src/digitaltwin/tags/instances/* | src/isa95/L3_Operations/tags/ | Move |
| src/digitaltwin/config/L0/* | src/isa95/L0_Data/config/ | Move |
| src/digitaltwin/config/L1/* | src/isa95/L1_Transactions/config/ | Move |
| src/digitaltwin/config/L2/* | src/isa95/L2_Control/config/ | Move |
| src/digitaltwin/config/L3/* | src/isa95/L3_Operations/config/ | Move |
| src/digitaltwin/config/L4/* | src/isa95/L4_Enterprise/config/ | Move |
| src/digitaltwin/officers/* | src/isa95/L3_Operations/units/ | Merge |
| src/isa18_2/* | src/isa95/L2_Control/alarms/ | Move & integrate |

---

## Success Criteria

1. **No Duplicates**: Single PackML implementation, single source of truth for each concept
2. **Connected Layers**: L0→L1→L2→L3→L4 all wired with clear interfaces
3. **Working Workflows**: Claim submission through payment fully automated
4. **Signed Transactions**: All L1 transactions have blockchain signatures
5. **Active Alarms**: Alarms trigger workflow escalations
6. **Persisted Tags**: Tag values survive restart
7. **Queryable Code**: Vector search on PA County Code works
8. **Visual Dashboard**: Real-time 3D view of county operations
9. **Full API**: All operations accessible via REST
10. **Consistent Format**: JSON configs, JS classes, clear separation
