# Coverage Gaps Report

Find sections that are not fully implemented.

## Parameters

```csv
min_status,partial
```

## SQL

```sql
SELECT
  a.id as Article,
  a.title as ArticleTitle,
  s.id as Section,
  s.title as SectionTitle,
  s.status as Status,
  COALESCE(s.module_path, 'NONE') as Module
FROM sections s
JOIN articles a ON a.id = s.article_id
WHERE s.status IN ('partial', 'not_started')
ORDER BY
  CASE s.status WHEN 'not_started' THEN 1 ELSE 2 END,
  a.id,
  s.id
```

## Usage

```bash
nac query coverage-gaps.md
```
