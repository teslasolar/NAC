/**
 * @fileoverview Unified API layer for NAC
 * @module persistence/api
 * @description Abstraction layer for data operations
 * Supports: IndexedDB (current), REST API (future)
 */

import { ClaimRepository } from './ClaimRepository.js';
import { AuditRepository } from './AuditRepository.js';
import { BudgetRepository } from './BudgetRepository.js';

/**
 * API Configuration
 * Set USE_REMOTE=true when backend is available
 */
const CONFIG = {
  USE_REMOTE: false,
  BASE_URL: '/api/v1',
  TIMEOUT: 30000
};

/**
 * Unified API interface
 */
export const API = {
  config: CONFIG,

  // Claims API - 16 Pa.C.S. §1730, §1750
  claims: {
    create: (data) => ClaimRepository.create(data),
    get: (id) => ClaimRepository.getById(id),
    list: () => ClaimRepository.getAll(),
    byStatus: (status) => ClaimRepository.getByStatus(status),
    byDepartment: (dept) => ClaimRepository.getByDepartment(dept),
    review: (id, data) => ClaimRepository.review(id, data),
    approve: (id, data) => ClaimRepository.approve(id, data),
    reject: (id, data) => ClaimRepository.reject(id, data),
    delete: (id) => ClaimRepository.delete(id)
  },

  // Audits API - 16 Pa.C.S. §1720, §1721
  audits: {
    create: (data) => AuditRepository.createAudit(data),
    get: (id) => AuditRepository.getAuditById(id),
    list: () => AuditRepository.getAllAudits(),
    byStatus: (status) => AuditRepository.getAuditsByStatus(status),
    byType: (type) => AuditRepository.getAuditsByType(type),
    updateStatus: (id, status, notes) => AuditRepository.updateStatus(id, status, notes),
    close: (id, summary) => AuditRepository.closeAudit(id, summary)
  },

  // Findings API - 16 Pa.C.S. §1727
  findings: {
    create: (auditId, data) => AuditRepository.addFinding(auditId, data),
    get: (id) => AuditRepository.getFindingById(id),
    byAudit: (auditId) => AuditRepository.getFindingsByAudit(auditId),
    bySeverity: (severity) => AuditRepository.getFindingsBySeverity(severity),
    updateStatus: (id, status, response) => AuditRepository.updateFindingStatus(id, status, response)
  },

  // Budget API - 16 Pa.C.S. §17A01-§17A10
  budget: {
    create: (data) => BudgetRepository.create(data),
    get: (id) => BudgetRepository.getById(id),
    list: () => BudgetRepository.getAll(),
    byYear: (year) => BudgetRepository.getByFiscalYear(year),
    byDepartment: (dept) => BudgetRepository.getByDepartment(dept),
    encumber: (id, amount, ref) => BudgetRepository.encumber(id, amount, ref),
    spend: (id, amount, ref) => BudgetRepository.spend(id, amount, ref),
    amend: (id, data) => BudgetRepository.amend(id, data),
    transfer: (from, to, amount, reason, approver) =>
      BudgetRepository.transfer(from, to, amount, reason, approver),
    summary: (year) => BudgetRepository.getSummary(year)
  },

  /**
   * Health check
   */
  async health() {
    return {
      status: 'ok',
      mode: CONFIG.USE_REMOTE ? 'remote' : 'local',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  },

  /**
   * Export all data for backup
   */
  async exportAll() {
    return {
      claims: await this.claims.list(),
      audits: await this.audits.list(),
      budget: await this.budget.list(),
      exportedAt: new Date().toISOString()
    };
  }
};

export default API;
