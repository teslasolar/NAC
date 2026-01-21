#!/usr/bin/env python3
"""
Create SQLite database from CSV tag data.
Provides queryable tag storage for NAC Digital Twin.
"""

import sqlite3
import csv
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'tags.db')
CSV_DIR = os.path.join(os.path.dirname(__file__), '..', 'csv')

def create_tables(conn):
    """Create all tables for tag data."""
    c = conn.cursor()

    # Departments table
    c.execute('''CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        officer TEXT,
        category TEXT,
        budget INTEGER,
        staff INTEGER,
        oee REAL
    )''')

    # Divisions table
    c.execute('''CREATE TABLE IF NOT EXISTS divisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dept_id TEXT NOT NULL,
        name TEXT NOT NULL,
        staff INTEGER,
        FOREIGN KEY (dept_id) REFERENCES departments(id)
    )''')

    # Parcels table
    c.execute('''CREATE TABLE IF NOT EXISTS parcels (
        id TEXT PRIMARY KEY,
        owner TEXT,
        address TEXT,
        land_use TEXT,
        assessed INTEGER,
        acres REAL,
        municipality TEXT,
        lat1 REAL, lon1 REAL, lat2 REAL, lon2 REAL
    )''')

    # Municipalities table
    c.execute('''CREATE TABLE IF NOT EXISTS municipalities (
        name TEXT PRIMARY KEY,
        color TEXT,
        lat_min REAL, lon_min REAL, lat_max REAL, lon_max REAL
    )''')

    # Notices table
    c.execute('''CREATE TABLE IF NOT EXISTS notices (
        id INTEGER PRIMARY KEY,
        type TEXT,
        title TEXT,
        dept TEXT,
        posted TEXT,
        deadline TEXT,
        urgent INTEGER,
        featured INTEGER,
        description TEXT
    )''')

    # Courses table
    c.execute('''CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT,
        icon TEXT,
        description TEXT
    )''')

    # Lessons table
    c.execute('''CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        course_id TEXT NOT NULL,
        title TEXT,
        duration TEXT,
        is_quiz INTEGER,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    )''')

    # Audit offices table
    c.execute('''CREATE TABLE IF NOT EXISTS audit_offices (
        id TEXT PRIMARY KEY,
        title TEXT,
        status TEXT,
        personnel_total INTEGER,
        ftes INTEGER,
        operating_total INTEGER,
        revenue_total INTEGER,
        net INTEGER,
        potential INTEGER
    )''')

    # Audit findings table
    c.execute('''CREATE TABLE IF NOT EXISTS audit_findings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        office_id TEXT NOT NULL,
        item TEXT,
        detail TEXT,
        FOREIGN KEY (office_id) REFERENCES audit_offices(id)
    )''')

    # Audit recommendations table
    c.execute('''CREATE TABLE IF NOT EXISTS audit_recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        office_id TEXT NOT NULL,
        action TEXT,
        impact TEXT,
        FOREIGN KEY (office_id) REFERENCES audit_offices(id)
    )''')

    conn.commit()

def load_csv(conn, table, csv_file, column_map=None):
    """Load CSV into table."""
    c = conn.cursor()
    filepath = os.path.join(CSV_DIR, csv_file)

    if not os.path.exists(filepath):
        print(f"  Skipping {csv_file} - not found")
        return 0

    with open(filepath, 'r') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

        if not rows:
            return 0

        # Get columns from CSV header
        columns = list(rows[0].keys())
        if column_map:
            db_columns = [column_map.get(c, c) for c in columns]
        else:
            db_columns = columns

        placeholders = ','.join(['?' for _ in columns])
        col_str = ','.join(db_columns)

        for row in rows:
            values = [row[c] if row[c] != '' else None for c in columns]
            c.execute(f'INSERT OR REPLACE INTO {table} ({col_str}) VALUES ({placeholders})', values)

    conn.commit()
    return len(rows)

def main():
    # Remove existing db
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    print(f"Creating database: {DB_PATH}")

    # Create tables
    create_tables(conn)
    print("Tables created")

    # Load data
    loads = [
        ('departments', 'departments.csv', None),
        ('divisions', 'divisions.csv', None),
        ('parcels', 'parcels.csv', {'landUse': 'land_use'}),
        ('municipalities', 'municipalities.csv', None),
        ('notices', 'notices.csv', None),
        ('courses', 'courses.csv', None),
        ('lessons', 'lessons.csv', {'isQuiz': 'is_quiz'}),
        ('audit_offices', 'audit_offices.csv', None),
        ('audit_findings', 'audit_findings.csv', None),
        ('audit_recommendations', 'audit_recommendations.csv', None),
    ]

    for table, csv_file, col_map in loads:
        count = load_csv(conn, table, csv_file, col_map)
        print(f"  {table}: {count} rows")

    # Load notice descriptions (join to notices)
    desc_file = os.path.join(CSV_DIR, 'notice_descriptions.csv')
    if os.path.exists(desc_file):
        c = conn.cursor()
        with open(desc_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                c.execute('UPDATE notices SET description = ? WHERE id = ?',
                         (row['description'], row['id']))
        conn.commit()
        print("  notice_descriptions: merged")

    # Create indexes for common queries
    c = conn.cursor()
    c.execute('CREATE INDEX IF NOT EXISTS idx_divisions_dept ON divisions(dept_id)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_parcels_muni ON parcels(municipality)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_parcels_use ON parcels(land_use)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_notices_type ON notices(type)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_findings_office ON audit_findings(office_id)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_recs_office ON audit_recommendations(office_id)')
    conn.commit()
    print("Indexes created")

    conn.close()
    print(f"Database ready: {os.path.getsize(DB_PATH)} bytes")

if __name__ == '__main__':
    main()
