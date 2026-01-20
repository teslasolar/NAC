# NAC Query Library

Define SQL queries in markdown files. Execute with:

```bash
node scripts/nac-cli.js query <filename> [param=value...]
```

## Query File Format

Each `.md` file should contain:

1. A `sql` code block with the query
2. An optional `csv` block with default parameters

## Example Query File

```markdown
# My Query

Description of what this query does.

## Parameters

```csv
officer,sheriff
status,implemented
```

## SQL

```sql
SELECT * FROM sections
WHERE status = :status
```
```

## Available Tables

| Table | Description |
|-------|-------------|
| `articles` | PA Code Title 16 articles |
| `sections` | Individual code sections |
| `modules` | ISA-95 modules |
| `row_officers` | 8 elected row officers |
| `audit_areas` | Audit areas per officer |
| `board_memberships` | Controller board seats |
| `statutory_duties` | Controller duties |
| `findings` | Audit findings (tracking) |

## Available Views

| View | Description |
|------|-------------|
| `v_coverage_by_article` | Coverage % by article |
| `v_modules_by_level` | Module count by ISA level |
| `v_audit_summary` | Audit areas by officer |
| `v_controller_duties` | Duties by category |
