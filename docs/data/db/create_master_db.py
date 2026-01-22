#!/usr/bin/env python3
"""
Create master NAC SQLite database consolidating all data sources.
Merges: docs/data/db/nac.db + data/nac.db + src/isa95/*.json + src/digitaltwin/*.json
"""

import sqlite3
import json
import csv
import os
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent.parent  # /home/user/NAC
DB_PATH = ROOT / 'data' / 'nac-master.db'
DOCS_DB = ROOT / 'docs' / 'data' / 'db' / 'nac.db'
ROOT_DB = ROOT / 'data' / 'nac.db'
SRC_ISA95 = ROOT / 'src' / 'isa95'
SRC_DT = ROOT / 'src' / 'digitaltwin'

def copy_table(src_conn, dst_conn, table):
    """Copy entire table from source to destination."""
    src = src_conn.cursor()
    dst = dst_conn.cursor()

    # Get table schema
    src.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table}'")
    schema = src.fetchone()
    if not schema:
        return 0

    # Create table if not exists
    create_sql = schema[0].replace('CREATE TABLE', 'CREATE TABLE IF NOT EXISTS')
    dst.execute(create_sql)

    # Copy data
    src.execute(f'SELECT * FROM {table}')
    rows = src.fetchall()
    if rows:
        placeholders = ','.join(['?' for _ in rows[0]])
        dst.executemany(f'INSERT OR REPLACE INTO {table} VALUES ({placeholders})', rows)

    dst_conn.commit()
    return len(rows)

def create_isa95_tables(conn):
    """Create ISA-95 specific tables."""
    c = conn.cursor()
    c.executescript('''
        -- PackML States
        CREATE TABLE IF NOT EXISTS packml_states (
            id TEXT PRIMARY KEY,
            category TEXT,
            description TEXT,
            color TEXT,
            completes_to TEXT,
            transitions TEXT
        );

        -- PackML Modes
        CREATE TABLE IF NOT EXISTS packml_modes (
            id TEXT PRIMARY KEY,
            description TEXT,
            allowed_states TEXT
        );

        -- PackML Commands
        CREATE TABLE IF NOT EXISTS packml_commands (
            id TEXT PRIMARY KEY,
            description TEXT,
            from_states TEXT,
            to_state TEXT
        );

        -- Fee Schedules (ISA-95 detailed)
        CREATE TABLE IF NOT EXISTS isa95_fee_schedules (
            id TEXT PRIMARY KEY,
            office TEXT,
            description TEXT,
            amount REAL,
            per_unit TEXT,
            note TEXT,
            authority TEXT
        );

        -- Work Item Types
        CREATE TABLE IF NOT EXISTS work_item_types (
            id TEXT PRIMARY KEY,
            category TEXT,
            name TEXT,
            description TEXT,
            avg_time_minutes INTEGER,
            complexity TEXT
        );

        -- Business Rules
        CREATE TABLE IF NOT EXISTS business_rules (
            id TEXT PRIMARY KEY,
            category TEXT,
            name TEXT,
            description TEXT,
            condition TEXT,
            action TEXT,
            priority INTEGER
        );

        -- Production Units (ISA-95 L3)
        CREATE TABLE IF NOT EXISTS isa95_production_units (
            id TEXT PRIMARY KEY,
            name TEXT,
            description TEXT,
            type TEXT,
            parent_id TEXT
        );

        -- Assembly Lines (ISA-95 L3)
        CREATE TABLE IF NOT EXISTS isa95_assembly_lines (
            id TEXT PRIMARY KEY,
            unit_id TEXT,
            name TEXT,
            stations TEXT,
            capacity INTEGER
        );
    ''')
    conn.commit()

def load_packml_states(conn, filepath):
    """Load PackML state machine definitions."""
    if not filepath.exists():
        return 0

    with open(filepath) as f:
        data = json.load(f)

    c = conn.cursor()
    count = 0

    # States
    for category, states in data.get('states', {}).items():
        for sid, s in states.items():
            c.execute('''INSERT OR REPLACE INTO packml_states
                         VALUES (?, ?, ?, ?, ?, ?)''',
                      (sid, category, s.get('description', ''),
                       s.get('color', ''), s.get('completesTo', ''),
                       json.dumps(s.get('canTransitionTo', []))))
            count += 1

    # Modes
    for mid, m in data.get('modes', {}).items():
        states = m.get('allowedStates', [])
        c.execute('INSERT OR REPLACE INTO packml_modes VALUES (?, ?, ?)',
                  (mid, m.get('description', ''),
                   json.dumps(states) if isinstance(states, list) else states))

    # Commands
    for cid, cmd in data.get('commands', {}).items():
        from_states = cmd.get('fromStates', [])
        c.execute('INSERT OR REPLACE INTO packml_commands VALUES (?, ?, ?, ?)',
                  (cid, cmd.get('description', ''),
                   json.dumps(from_states) if isinstance(from_states, list) else from_states,
                   cmd.get('toState', '')))

    conn.commit()
    return count

def load_fee_schedules(conn, filepath):
    """Load fee schedule data."""
    if not filepath.exists():
        return 0

    with open(filepath) as f:
        data = json.load(f)

    c = conn.cursor()
    count = 0

    for office, office_data in data.items():
        if office.startswith('$') or office in ('version', 'effectiveDate', 'title', 'description'):
            continue

        authority = office_data.get('authority', '')
        fees = office_data.get('fees', {})

        for fee_id, fee in fees.items():
            fid = f"{office}_{fee_id}"
            c.execute('''INSERT OR REPLACE INTO isa95_fee_schedules
                         VALUES (?, ?, ?, ?, ?, ?, ?)''',
                      (fid, office, fee.get('description', ''),
                       fee.get('amount', 0), fee.get('per', ''),
                       fee.get('note', ''), authority))
            count += 1

    conn.commit()
    return count

def load_work_item_types(conn, filepath):
    """Load work item type definitions."""
    if not filepath.exists():
        return 0

    with open(filepath) as f:
        data = json.load(f)

    c = conn.cursor()
    count = 0

    for category, items in data.items():
        if category.startswith('$') or category in ('version', 'title', 'description'):
            continue
        if not isinstance(items, dict):
            continue

        for wid, w in items.items():
            if not isinstance(w, dict):
                continue
            c.execute('''INSERT OR REPLACE INTO work_item_types
                         VALUES (?, ?, ?, ?, ?, ?)''',
                      (wid, category, w.get('name', wid),
                       w.get('description', ''),
                       w.get('avgTimeMinutes', 0),
                       w.get('complexity', 'medium')))
            count += 1

    conn.commit()
    return count

def load_business_rules(conn, filepath):
    """Load business rule definitions."""
    if not filepath.exists():
        return 0

    with open(filepath) as f:
        data = json.load(f)

    c = conn.cursor()
    count = 0

    for category, rules in data.items():
        if category.startswith('$') or category in ('version', 'title', 'description'):
            continue
        if not isinstance(rules, (dict, list)):
            continue

        rule_list = rules if isinstance(rules, list) else rules.values() if isinstance(rules, dict) else []
        for r in rule_list:
            if not isinstance(r, dict):
                continue
            rid = r.get('id', f"{category}_{count}")
            c.execute('''INSERT OR REPLACE INTO business_rules
                         VALUES (?, ?, ?, ?, ?, ?, ?)''',
                      (rid, category, r.get('name', ''),
                       r.get('description', ''), r.get('condition', ''),
                       r.get('action', ''), r.get('priority', 0)))
            count += 1

    conn.commit()
    return count

def main():
    if DB_PATH.exists():
        DB_PATH.unlink()

    conn = sqlite3.connect(DB_PATH)
    print(f"Creating master database: {DB_PATH}")

    # Copy from docs/data/db/nac.db
    if DOCS_DB.exists():
        print(f"\nCopying from {DOCS_DB}...")
        src = sqlite3.connect(DOCS_DB)
        src_cur = src.cursor()
        src_cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [r[0] for r in src_cur.fetchall() if r[0] != 'sqlite_sequence']

        for table in tables:
            count = copy_table(src, conn, table)
            if count > 0:
                print(f"  {table}: {count} rows")
        src.close()

    # Copy from data/nac.db (root)
    if ROOT_DB.exists():
        print(f"\nCopying from {ROOT_DB}...")
        src = sqlite3.connect(ROOT_DB)
        src_cur = src.cursor()
        src_cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [r[0] for r in src_cur.fetchall() if r[0] != 'sqlite_sequence']

        for table in tables:
            count = copy_table(src, conn, table)
            if count > 0:
                print(f"  {table}: {count} rows")
        src.close()

    # Create ISA-95 tables
    create_isa95_tables(conn)
    print("\nISA-95 tables created")

    # Load ISA-95 configs
    print("\nLoading ISA-95 configs...")

    packml = SRC_ISA95 / 'L0_Data' / 'config' / 'packml-states.json'
    count = load_packml_states(conn, packml)
    print(f"  packml-states: {count} states")

    fees = SRC_ISA95 / 'L1_Transactions' / 'config' / 'fee-schedules.json'
    count = load_fee_schedules(conn, fees)
    print(f"  fee-schedules: {count} fees")

    work_items = SRC_ISA95 / 'L0_Data' / 'config' / 'work-item-types.json'
    count = load_work_item_types(conn, work_items)
    print(f"  work-item-types: {count} types")

    rules = SRC_ISA95 / 'L2_Control' / 'config' / 'business-rules.json'
    count = load_business_rules(conn, rules)
    print(f"  business-rules: {count} rules")

    # Summary
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence'")
    tables = [r[0] for r in c.fetchall()]

    total = 0
    for t in tables:
        c.execute(f'SELECT COUNT(*) FROM {t}')
        total += c.fetchone()[0]

    conn.close()

    size = DB_PATH.stat().st_size
    print(f"\n=== Master Database Ready ===")
    print(f"Tables: {len(tables)}")
    print(f"Total records: {total}")
    print(f"Size: {size:,} bytes ({size/1024:.1f} KB)")

if __name__ == '__main__':
    main()
