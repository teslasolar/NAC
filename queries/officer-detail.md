# Officer Detail Report

Get full details for a row officer including all audit areas.

## Parameters

```csv
officer,treasurer
```

## SQL

```sql
SELECT
  ro.title as Officer,
  ro.article as Article,
  CASE WHEN ro.bond_required THEN 'Yes' ELSE 'No' END as Bond,
  ro.duties as Duties,
  aa.name as AuditArea,
  aa.frequency as Frequency,
  aa.requirements as Requirements
FROM row_officers ro
LEFT JOIN audit_areas aa ON aa.officer_id = ro.id
WHERE ro.id = :officer
   OR LOWER(ro.title) LIKE '%' || LOWER(:officer) || '%'
ORDER BY aa.name
```

## Usage

```bash
nac query officer-detail.md officer=sheriff
nac query officer-detail.md officer=treasurer
nac query officer-detail.md officer=coroner
```
