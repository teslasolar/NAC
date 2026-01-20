# Annual Audit Plan Generator

Generate audit areas for annual audit planning.

## SQL

```sql
SELECT
  ro.title as Entity,
  aa.name as AuditArea,
  aa.frequency as Frequency,
  aa.description as Scope,
  aa.requirements as Procedures
FROM row_officers ro
JOIN audit_areas aa ON aa.officer_id = ro.id
WHERE aa.frequency IN ('Annual', 'Monthly')
ORDER BY
  CASE aa.frequency WHEN 'Annual' THEN 1 ELSE 2 END,
  ro.title,
  aa.name
```

## Usage

```bash
nac query annual-audit-plan.md
nac query annual-audit-plan.md --json > audit-plan.json
```
