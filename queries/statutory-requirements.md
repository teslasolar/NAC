# Controller Statutory Requirements Query

Get all Controller-related statutory requirements.

## SQL

```sql
SELECT
  'Duty' as type,
  sd.section_id as section,
  sd.duty as item,
  sd.description as detail,
  sd.category as category
FROM statutory_duties sd
UNION ALL
SELECT
  'Board' as type,
  bm.authority as section,
  bm.board_name as item,
  bm.role as detail,
  'Governance' as category
FROM board_memberships bm
UNION ALL
SELECT
  'Section' as type,
  s.id as section,
  s.title as item,
  a.title as detail,
  'Article XVI' as category
FROM sections s
JOIN articles a ON a.id = s.article_id
WHERE s.article_id = 'XVI'
ORDER BY type, section
```

## Usage

```bash
nac query statutory-requirements.md
```
