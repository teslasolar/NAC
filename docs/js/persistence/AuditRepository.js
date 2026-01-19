/**
 * @fileoverview Repository for audit engagements
 * @module persistence/AuditRepository
 * @authority 16 Pa.C.S. §1720, §1721
 */

import { db } from './Database.js';

const AUDIT_STORE = 'audits';
const FINDING_STORE = 'findings';

export const AuditRepository = {
  /**
   * Generate unique audit ID
   */
  generateId() {
    const year = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `AUD-${year}-${seq}`;
  },

  generateFindingId(auditId) {
    const seq = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `${auditId}-F${seq}`;
  },

  /**
   * Create audit engagement per §1720
   */
  async createAudit(auditData) {
    const audit = {
      id: this.generateId(),
      ...auditData,
      status: 'planning',
      createdDate: new Date().toISOString(),
      findings: [],
      workpapers: [],
      timeline: [{
        phase: 'initiated',
        timestamp: new Date().toISOString()
      }]
    };
    await db.put(AUDIT_STORE, audit);
    return audit;
  },

  async getAuditById(id) {
    return db.get(AUDIT_STORE, id);
  },

  async getAllAudits() {
    return db.getAll(AUDIT_STORE);
  },

  async getAuditsByStatus(status) {
    return db.query(AUDIT_STORE, 'status', status);
  },

  async getAuditsByType(type) {
    return db.query(AUDIT_STORE, 'type', type);
  },

  /**
   * Update audit status
   */
  async updateStatus(id, newStatus, notes) {
    const audit = await this.getAuditById(id);
    if (!audit) throw new Error('Audit not found');

    audit.status = newStatus;
    audit.timeline.push({
      phase: newStatus,
      timestamp: new Date().toISOString(),
      notes
    });

    await db.put(AUDIT_STORE, audit);
    return audit;
  },

  /**
   * Add finding to audit per §1727
   */
  async addFinding(auditId, findingData) {
    const audit = await this.getAuditById(auditId);
    if (!audit) throw new Error('Audit not found');

    const finding = {
      id: this.generateFindingId(auditId),
      auditId,
      ...findingData,
      status: 'draft',
      createdDate: new Date().toISOString()
    };

    await db.put(FINDING_STORE, finding);

    audit.findings.push(finding.id);
    await db.put(AUDIT_STORE, audit);

    return finding;
  },

  async getFindingById(id) {
    return db.get(FINDING_STORE, id);
  },

  async getFindingsByAudit(auditId) {
    return db.query(FINDING_STORE, 'auditId', auditId);
  },

  async getFindingsBySeverity(severity) {
    return db.query(FINDING_STORE, 'severity', severity);
  },

  /**
   * Update finding status
   */
  async updateFindingStatus(id, newStatus, response) {
    const finding = await this.getFindingById(id);
    if (!finding) throw new Error('Finding not found');

    finding.status = newStatus;
    finding.managementResponse = response;
    finding.responseDate = new Date().toISOString();

    await db.put(FINDING_STORE, finding);
    return finding;
  },

  /**
   * Close audit and finalize report
   */
  async closeAudit(id, summary) {
    const audit = await this.getAuditById(id);
    if (!audit) throw new Error('Audit not found');

    audit.status = 'closed';
    audit.closedDate = new Date().toISOString();
    audit.summary = summary;
    audit.timeline.push({
      phase: 'closed',
      timestamp: new Date().toISOString()
    });

    await db.put(AUDIT_STORE, audit);
    return audit;
  }
};

export default AuditRepository;
