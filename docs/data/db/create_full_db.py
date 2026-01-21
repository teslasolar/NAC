#!/usr/bin/env python3
"""
Create full SQLite database from all NAC data sources.
Consolidates tags/*.json and data/*.json into queryable SQLite.
"""

import sqlite3
import json
import csv
import os
from pathlib import Path

BASE = Path(__file__).parent.parent.parent
DB_PATH = Path(__file__).parent / 'nac.db'
CSV_DIR = BASE / 'data' / 'csv'
TAGS_DIR = BASE / 'tags'
DATA_DIR = BASE / 'data'

def create_tables(conn):
    """Create all tables."""
    c = conn.cursor()

    # Core tables from CSV
    c.executescript('''
        -- Departments & Divisions
        CREATE TABLE IF NOT EXISTS departments (
            id TEXT PRIMARY KEY, name TEXT, officer TEXT, category TEXT,
            budget INTEGER, staff INTEGER, oee REAL
        );
        CREATE TABLE IF NOT EXISTS divisions (
            id INTEGER PRIMARY KEY, dept_id TEXT, name TEXT, staff INTEGER
        );

        -- GIS Data
        CREATE TABLE IF NOT EXISTS parcels (
            id TEXT PRIMARY KEY, owner TEXT, address TEXT, land_use TEXT,
            assessed INTEGER, acres REAL, municipality TEXT,
            lat1 REAL, lon1 REAL, lat2 REAL, lon2 REAL
        );
        CREATE TABLE IF NOT EXISTS municipalities (
            name TEXT PRIMARY KEY, color TEXT,
            lat_min REAL, lon_min REAL, lat_max REAL, lon_max REAL
        );

        -- Notices
        CREATE TABLE IF NOT EXISTS notices (
            id INTEGER PRIMARY KEY, type TEXT, title TEXT, dept TEXT,
            posted TEXT, deadline TEXT, urgent INTEGER, featured INTEGER, description TEXT
        );

        -- Academy
        CREATE TABLE IF NOT EXISTS courses (
            id TEXT PRIMARY KEY, title TEXT, icon TEXT, description TEXT
        );
        CREATE TABLE IF NOT EXISTS lessons (
            id TEXT PRIMARY KEY, course_id TEXT, title TEXT, duration TEXT, is_quiz INTEGER
        );

        -- Audits
        CREATE TABLE IF NOT EXISTS audit_offices (
            id TEXT PRIMARY KEY, title TEXT, status TEXT,
            personnel_total INTEGER, ftes INTEGER,
            operating_total INTEGER, revenue_total INTEGER, net INTEGER, potential INTEGER
        );
        CREATE TABLE IF NOT EXISTS audit_findings (
            id INTEGER PRIMARY KEY, office_id TEXT, item TEXT, detail TEXT
        );
        CREATE TABLE IF NOT EXISTS audit_recommendations (
            id INTEGER PRIMARY KEY, office_id TEXT, action TEXT, impact TEXT
        );

        -- Ledger (blockchain records)
        CREATE TABLE IF NOT EXISTS ledger_records (
            id INTEGER PRIMARY KEY, type TEXT, title TEXT, dept TEXT,
            date TEXT, hash TEXT, block INTEGER, size TEXT, verified INTEGER
        );

        -- Risk Scoring
        CREATE TABLE IF NOT EXISTS risk_areas (
            id INTEGER PRIMARY KEY, area TEXT, category TEXT, score INTEGER,
            level TEXT, factors TEXT, trend TEXT, officer TEXT
        );

        -- Screens/Navigation
        CREATE TABLE IF NOT EXISTS screens (
            id TEXT PRIMARY KEY, name TEXT, icon TEXT, category TEXT,
            url TEXT, description TEXT
        );
        CREATE TABLE IF NOT EXISTS screen_categories (
            id TEXT PRIMARY KEY, name TEXT, color TEXT
        );
        CREATE TABLE IF NOT EXISTS kpis (
            id TEXT PRIMARY KEY, value REAL, target REAL, unit TEXT, status TEXT
        );
        CREATE TABLE IF NOT EXISTS alarms (
            id TEXT PRIMARY KEY, priority TEXT, message TEXT, screen TEXT
        );

        -- Transformation Plan
        CREATE TABLE IF NOT EXISTS transformation_phases (
            id TEXT PRIMARY KEY, name TEXT, timeline TEXT
        );
        CREATE TABLE IF NOT EXISTS transformation_items (
            id TEXT PRIMARY KEY, phase_id TEXT, title TEXT, description TEXT
        );

        -- County Units (ISA-95)
        CREATE TABLE IF NOT EXISTS county_units (
            id TEXT PRIMARY KEY, name TEXT, color TEXT, staffing INTEGER,
            pos_x REAL, pos_y REAL, pos_z REAL,
            width REAL, height REAL, depth REAL
        );
        CREATE TABLE IF NOT EXISTS county_unit_lines (
            id TEXT PRIMARY KEY, unit_id TEXT, name TEXT, stations INTEGER
        );
        CREATE TABLE IF NOT EXISTS county_unit_connections (
            id INTEGER PRIMARY KEY, from_unit TEXT, to_unit TEXT, label TEXT
        );

        -- Gracedale
        CREATE TABLE IF NOT EXISTS gracedale_facility (
            id TEXT PRIMARY KEY, name TEXT, type TEXT, beds INTEGER,
            location TEXT, founded INTEGER, current_census INTEGER,
            occupancy REAL, occupancy_target REAL, annual_budget INTEGER
        );
        CREATE TABLE IF NOT EXISTS gracedale_units (
            id TEXT PRIMARY KEY, name TEXT, beds INTEGER, census INTEGER, staff_ratio TEXT
        );
        CREATE TABLE IF NOT EXISTS gracedale_staffing (
            category TEXT PRIMARY KEY, count INTEGER
        );
        CREATE TABLE IF NOT EXISTS gracedale_kpis (
            id TEXT PRIMARY KEY, value REAL
        );

        -- PA County Code
        CREATE TABLE IF NOT EXISTS pa_code_sections (
            id TEXT PRIMARY KEY, title TEXT, chapter TEXT, section TEXT,
            summary TEXT, officer TEXT
        );

        -- ISA-95 Enums
        CREATE TABLE IF NOT EXISTS isa95_enums (
            id TEXT PRIMARY KEY, type TEXT, value TEXT, description TEXT
        );

        -- Metadata
        CREATE TABLE IF NOT EXISTS tag_metadata (
            name TEXT PRIMARY KEY, tag_type TEXT, description TEXT, version TEXT
        );
    ''')
    conn.commit()

def load_csv_files(conn):
    """Load existing CSV files."""
    c = conn.cursor()

    # table: (filename, column_mapping)
    csv_tables = {
        'departments': ('departments.csv', {}),
        'divisions': ('divisions.csv', {}),
        'parcels': ('parcels.csv', {'landUse': 'land_use'}),
        'municipalities': ('municipalities.csv', {}),
        'notices': ('notices.csv', {}),
        'courses': ('courses.csv', {}),
        'lessons': ('lessons.csv', {'isQuiz': 'is_quiz'}),
        'audit_offices': ('audit_offices.csv', {}),
        'audit_findings': ('audit_findings.csv', {}),
        'audit_recommendations': ('audit_recommendations.csv', {})
    }

    for table, (filename, col_map) in csv_tables.items():
        filepath = CSV_DIR / filename
        if not filepath.exists():
            continue

        with open(filepath, 'r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            if not rows:
                continue

            csv_cols = list(rows[0].keys())
            db_cols = [col_map.get(c, c) for c in csv_cols]
            placeholders = ','.join(['?' for _ in db_cols])
            col_str = ','.join(db_cols)

            for row in rows:
                values = [row[c] if row[c] != '' else None for c in csv_cols]
                c.execute(f'INSERT OR REPLACE INTO {table} ({col_str}) VALUES ({placeholders})', values)

    conn.commit()

def load_json_tag(conn, filepath, loader_func):
    """Load JSON tag file using custom loader."""
    if not filepath.exists():
        return 0

    with open(filepath, 'r') as f:
        data = json.load(f)

    # Save metadata
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO tag_metadata VALUES (?, ?, ?, ?)',
              (data.get('name', filepath.stem), data.get('tagType', 'UDT'),
               data.get('description', ''), data.get('version', '1.0.0')))

    return loader_func(conn, data)

def load_ledger(conn, data):
    c = conn.cursor()
    for r in data.get('records', []):
        c.execute('''INSERT OR REPLACE INTO ledger_records
                     (id, type, title, dept, date, hash, block, size, verified)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (r['id'], r['type'], r['title'], r['dept'], r['date'],
                   r['hash'], r['block'], r['size'], 1 if r['verified'] else 0))
    conn.commit()
    return len(data.get('records', []))

def load_risk(conn, data):
    c = conn.cursor()
    for i, r in enumerate(data.get('riskAreas', []), 1):
        c.execute('''INSERT OR REPLACE INTO risk_areas
                     (id, area, category, score, level, factors, trend, officer)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                  (i, r['area'], r['category'], r['score'], r['level'],
                   json.dumps(r['factors']), r['trend'], r['officer']))
    conn.commit()
    return len(data.get('riskAreas', []))

def load_screens(conn, data):
    c = conn.cursor()
    count = 0

    # Screens
    for sid, s in data.get('screens', {}).items():
        c.execute('''INSERT OR REPLACE INTO screens
                     (id, name, icon, category, url, description)
                     VALUES (?, ?, ?, ?, ?, ?)''',
                  (sid, s['name'], s.get('icon', ''), s.get('category', ''),
                   s.get('url', ''), s.get('description', '')))
        count += 1

    # Categories
    for cid, cat in data.get('categories', {}).items():
        c.execute('INSERT OR REPLACE INTO screen_categories VALUES (?, ?, ?)',
                  (cid, cat['name'], cat['color']))

    # KPIs
    for kid, k in data.get('kpis', {}).items():
        c.execute('INSERT OR REPLACE INTO kpis VALUES (?, ?, ?, ?, ?)',
                  (kid, k['value'], k['target'], k['unit'], k['status']))

    # Alarms
    for a in data.get('alarms', {}).get('active', []):
        c.execute('INSERT OR REPLACE INTO alarms VALUES (?, ?, ?, ?)',
                  (a['id'], a['priority'], a['message'], a['screen']))

    conn.commit()
    return count

def load_county_units(conn, data):
    c = conn.cursor()
    count = 0
    for u in data.get('units', []):
        pos = u.get('position', {})
        dim = u.get('dimensions', {})
        c.execute('''INSERT OR REPLACE INTO county_units
                     (id, name, color, staffing, pos_x, pos_y, pos_z, width, height, depth)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (u['id'], u['name'], u.get('color', ''), u.get('staffing', 0),
                   pos.get('x', 0), pos.get('y', 0), pos.get('z', 0),
                   dim.get('width', 0), dim.get('height', 0), dim.get('depth', 0)))
        count += 1
        # Load production lines
        for line in u.get('lines', []):
            c.execute('INSERT OR REPLACE INTO county_unit_lines VALUES (?, ?, ?, ?)',
                      (line['id'], u['id'], line['name'], line.get('stations', 0)))

    # Load connections
    for i, conn_data in enumerate(data.get('connections', []), 1):
        c.execute('INSERT OR REPLACE INTO county_unit_connections VALUES (?, ?, ?, ?)',
                  (i, conn_data['from'], conn_data['to'], conn_data.get('label', '')))

    conn.commit()
    return count

def load_gracedale(conn, data):
    c = conn.cursor()
    count = 0

    # Facility info
    fac = data.get('facility', {})
    census = data.get('census', {})
    fin = data.get('financials', {})
    c.execute('''INSERT OR REPLACE INTO gracedale_facility
                 (id, name, type, beds, location, founded, current_census,
                  occupancy, occupancy_target, annual_budget)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
              ('gracedale', fac.get('name', ''), fac.get('type', ''),
               fac.get('beds', 0), fac.get('location', ''), fac.get('founded', 0),
               census.get('current', 0), census.get('occupancy', 0),
               census.get('target', 0), fin.get('annualBudget', 0)))

    # Units
    for u in data.get('units', []):
        c.execute('''INSERT OR REPLACE INTO gracedale_units
                     (id, name, beds, census, staff_ratio)
                     VALUES (?, ?, ?, ?, ?)''',
                  (u['id'], u['name'], u.get('beds', 0), u.get('census', 0),
                   u.get('staffRatio', '')))
        count += 1

    # Staffing
    for cat, cnt in data.get('staffing', {}).items():
        c.execute('INSERT OR REPLACE INTO gracedale_staffing VALUES (?, ?)', (cat, cnt))

    # KPIs
    for kpi, val in data.get('kpis', {}).items():
        c.execute('INSERT OR REPLACE INTO gracedale_kpis VALUES (?, ?)', (kpi, val))

    conn.commit()
    return count

def load_transformation(conn, data):
    c = conn.cursor()
    count = 0
    for p in data.get('phases', []):
        c.execute('INSERT OR REPLACE INTO transformation_phases VALUES (?, ?, ?)',
                  (p['id'], p['name'], p.get('days', '')))
        for item in p.get('initiatives', []):
            c.execute('''INSERT OR REPLACE INTO transformation_items
                         (id, phase_id, title, description)
                         VALUES (?, ?, ?, ?)''',
                      (item['id'], p['id'], item.get('title', ''),
                       f"Owner: {item.get('owner', '')}, Savings: ${item.get('savings', 0):,}"))
            count += 1
    conn.commit()
    return count

def load_pa_code(conn, data):
    c = conn.cursor()
    count = 0

    # Controller sections
    for s in data.get('controllerSections', []):
        c.execute('''INSERT OR REPLACE INTO pa_code_sections
                     (id, title, chapter, section, summary, officer)
                     VALUES (?, ?, ?, ?, ?, ?)''',
                  (f"ctrl-{s['section']}", s['title'], '16',
                   s['section'], s.get('summary', ''), 'Controller'))
        count += 1

    # Board memberships
    for b in data.get('boardMemberships', []):
        c.execute('''INSERT OR REPLACE INTO pa_code_sections
                     (id, title, chapter, section, summary, officer)
                     VALUES (?, ?, ?, ?, ?, ?)''',
                  (f"board-{b['section']}", b['board'], '16',
                   b['section'], f"{b['role']}: {b.get('description', '')}", 'Controller'))
        count += 1

    conn.commit()
    return count

def load_isa95_enums(conn, data):
    c = conn.cursor()
    count = 0

    # Find all array fields (enum types)
    enum_types = ['auditTypes', 'claimStatus', 'departments', 'fundTypes',
                  'paymentMethods', 'procurementMethods']

    for enum_type in enum_types:
        for v in data.get(enum_type, []):
            eid = f"{enum_type}_{v['id']}"
            desc = v.get('description', v.get('name', ''))
            c.execute('INSERT OR REPLACE INTO isa95_enums VALUES (?, ?, ?, ?)',
                      (eid, enum_type, v['id'], desc))
            count += 1

    conn.commit()
    return count

def create_indexes(conn):
    """Create indexes for common queries."""
    c = conn.cursor()
    indexes = [
        'CREATE INDEX IF NOT EXISTS idx_dept_cat ON departments(category)',
        'CREATE INDEX IF NOT EXISTS idx_div_dept ON divisions(dept_id)',
        'CREATE INDEX IF NOT EXISTS idx_parcel_muni ON parcels(municipality)',
        'CREATE INDEX IF NOT EXISTS idx_parcel_use ON parcels(land_use)',
        'CREATE INDEX IF NOT EXISTS idx_notice_type ON notices(type)',
        'CREATE INDEX IF NOT EXISTS idx_lesson_course ON lessons(course_id)',
        'CREATE INDEX IF NOT EXISTS idx_finding_office ON audit_findings(office_id)',
        'CREATE INDEX IF NOT EXISTS idx_rec_office ON audit_recommendations(office_id)',
        'CREATE INDEX IF NOT EXISTS idx_ledger_type ON ledger_records(type)',
        'CREATE INDEX IF NOT EXISTS idx_risk_level ON risk_areas(level)',
        'CREATE INDEX IF NOT EXISTS idx_risk_officer ON risk_areas(officer)',
        'CREATE INDEX IF NOT EXISTS idx_screen_cat ON screens(category)',
        'CREATE INDEX IF NOT EXISTS idx_unit_lines ON county_unit_lines(unit_id)',
        'CREATE INDEX IF NOT EXISTS idx_code_officer ON pa_code_sections(officer)',
        'CREATE INDEX IF NOT EXISTS idx_trans_phase ON transformation_items(phase_id)',
        'CREATE INDEX IF NOT EXISTS idx_enum_type ON isa95_enums(type)',
    ]
    for idx in indexes:
        c.execute(idx)
    conn.commit()

def main():
    if DB_PATH.exists():
        DB_PATH.unlink()

    conn = sqlite3.connect(DB_PATH)
    print(f"Creating database: {DB_PATH}")

    create_tables(conn)
    print("Tables created")

    # Load CSVs
    load_csv_files(conn)
    print("CSV data loaded")

    # Load tag JSONs
    tag_loaders = [
        (TAGS_DIR / 'ledger-records.json', load_ledger),
        (TAGS_DIR / 'risk-areas.json', load_risk),
        (TAGS_DIR / 'county-units.json', load_county_units),
        (TAGS_DIR / 'gracedale.json', load_gracedale),
        (TAGS_DIR / 'transformation-plan.json', load_transformation),
        (TAGS_DIR / 'pa-county-code.json', load_pa_code),
        (TAGS_DIR / 'isa95-enums.json', load_isa95_enums),
        (DATA_DIR / 'screens.json', load_screens),
    ]

    for filepath, loader in tag_loaders:
        count = load_json_tag(conn, filepath, loader)
        print(f"  {filepath.name}: {count} records")

    create_indexes(conn)
    print("Indexes created")

    # Print summary
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence'")
    tables = [r[0] for r in c.fetchall()]

    total = 0
    for t in tables:
        c.execute(f'SELECT COUNT(*) FROM {t}')
        cnt = c.fetchone()[0]
        if cnt > 0:
            total += cnt

    conn.close()

    size = DB_PATH.stat().st_size
    print(f"\nDatabase ready: {len(tables)} tables, {total} records, {size:,} bytes")

if __name__ == '__main__':
    main()
