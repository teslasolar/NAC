/**
 * SQLiteLoader - Load and query SQLite database in browser
 * Uses sql.js (WebAssembly SQLite) for client-side queries
 *
 * Usage:
 *   <script src="https://sql.js.org/dist/sql-wasm.js"></script>
 *   <script src="js/providers/SQLiteLoader.js"></script>
 *   <script>
 *     const db = await createSQLiteLoader('data/db/tags.db');
 *     const depts = db.query('SELECT * FROM departments WHERE category = ?', ['row-officer']);
 *   </script>
 */

class SQLiteLoader {
  constructor() {
    this.db = null;
    this.ready = false;
  }

  /**
   * Initialize SQL.js and load database
   */
  async init(dbPath) {
    // Load sql.js WASM
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    // Fetch database file
    const response = await fetch(dbPath);
    const buffer = await response.arrayBuffer();

    // Open database
    this.db = new SQL.Database(new Uint8Array(buffer));
    this.ready = true;
    return this;
  }

  /**
   * Execute query and return results as array of objects
   */
  query(sql, params = []) {
    if (!this.ready) throw new Error('Database not initialized');

    const stmt = this.db.prepare(sql);
    stmt.bind(params);

    const results = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push(row);
    }
    stmt.free();
    return results;
  }

  /**
   * Execute query and return first result
   */
  queryOne(sql, params = []) {
    const results = this.query(sql, params);
    return results[0] || null;
  }

  /**
   * Get all records from a table
   */
  getAll(table) {
    return this.query(`SELECT * FROM ${table}`);
  }

  /**
   * Get record by ID
   */
  getById(table, id) {
    return this.queryOne(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  }

  /**
   * Get records with filter
   */
  getWhere(table, column, value) {
    return this.query(`SELECT * FROM ${table} WHERE ${column} = ?`, [value]);
  }

  // Convenience methods for NAC data

  getDepartments(category = null) {
    if (category) {
      return this.query('SELECT * FROM departments WHERE category = ?', [category]);
    }
    return this.getAll('departments');
  }

  getDepartmentWithDivisions(deptId) {
    const dept = this.getById('departments', deptId);
    if (dept) {
      dept.divisions = this.getWhere('divisions', 'dept_id', deptId);
    }
    return dept;
  }

  getParcels(filters = {}) {
    let sql = 'SELECT * FROM parcels WHERE 1=1';
    const params = [];

    if (filters.municipality) {
      sql += ' AND municipality = ?';
      params.push(filters.municipality);
    }
    if (filters.landUse) {
      sql += ' AND land_use = ?';
      params.push(filters.landUse);
    }
    if (filters.minValue) {
      sql += ' AND assessed >= ?';
      params.push(filters.minValue);
    }

    return this.query(sql, params);
  }

  getNotices(type = null) {
    if (type) {
      return this.query('SELECT * FROM notices WHERE type = ?', [type]);
    }
    return this.getAll('notices');
  }

  getCourseWithLessons(courseId) {
    const course = this.getById('courses', courseId);
    if (course) {
      course.lessons = this.getWhere('lessons', 'course_id', courseId);
    }
    return course;
  }

  getAuditOffice(officeId) {
    const office = this.getById('audit_offices', officeId);
    if (office) {
      office.findings = this.getWhere('audit_findings', 'office_id', officeId);
      office.recommendations = this.getWhere('audit_recommendations', 'office_id', officeId);
    }
    return office;
  }

  /**
   * Get aggregate stats
   */
  getStats() {
    return {
      totalEmployees: this.queryOne('SELECT SUM(staff) as total FROM departments')?.total || 0,
      totalBudget: this.queryOne('SELECT SUM(budget) as total FROM departments')?.total || 0,
      totalParcels: this.queryOne('SELECT COUNT(*) as count FROM parcels')?.count || 0,
      totalAssessed: this.queryOne('SELECT SUM(assessed) as total FROM parcels')?.total || 0,
      activeNotices: this.queryOne('SELECT COUNT(*) as count FROM notices')?.count || 0
    };
  }

  // New convenience methods for expanded database

  getLedgerRecords(type = null) {
    if (type) {
      return this.query('SELECT * FROM ledger_records WHERE type = ? ORDER BY date DESC', [type]);
    }
    return this.query('SELECT * FROM ledger_records ORDER BY date DESC');
  }

  getRiskAreas(level = null) {
    if (level) {
      return this.query('SELECT * FROM risk_areas WHERE level = ? ORDER BY score DESC', [level]);
    }
    return this.query('SELECT * FROM risk_areas ORDER BY score DESC');
  }

  getScreens(category = null) {
    if (category) {
      return this.query('SELECT * FROM screens WHERE category = ?', [category]);
    }
    return this.getAll('screens');
  }

  getKPIs() {
    return this.getAll('kpis');
  }

  getAlarms() {
    return this.getAll('alarms');
  }

  getCountyUnits() {
    const units = this.getAll('county_units');
    units.forEach(u => {
      u.lines = this.getWhere('county_unit_lines', 'unit_id', u.id);
    });
    return units;
  }

  getGracedale() {
    const facility = this.queryOne('SELECT * FROM gracedale_facility');
    if (facility) {
      facility.units = this.getAll('gracedale_units');
      facility.staffing = this.getAll('gracedale_staffing');
      facility.kpis = this.getAll('gracedale_kpis');
    }
    return facility;
  }

  getTransformationPlan() {
    const phases = this.getAll('transformation_phases');
    phases.forEach(p => {
      p.initiatives = this.getWhere('transformation_items', 'phase_id', p.id);
    });
    return phases;
  }

  getPACodeSections(officer = null) {
    if (officer) {
      return this.query('SELECT * FROM pa_code_sections WHERE officer = ?', [officer]);
    }
    return this.getAll('pa_code_sections');
  }

  getISA95Enums(type = null) {
    if (type) {
      return this.query('SELECT * FROM isa95_enums WHERE type = ?', [type]);
    }
    return this.getAll('isa95_enums');
  }

  getTagMetadata() {
    return this.getAll('tag_metadata');
  }

  /**
   * Close database
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.ready = false;
    }
  }
}

/**
 * Factory function - creates and initializes loader
 */
async function createSQLiteLoader(dbPath = 'data/db/nac.db') {
  const loader = new SQLiteLoader();
  await loader.init(dbPath);
  return loader;
}

// Export
if (typeof module !== 'undefined') {
  module.exports = { SQLiteLoader, createSQLiteLoader };
}
