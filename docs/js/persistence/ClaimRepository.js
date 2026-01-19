/**
 * @fileoverview Repository for claim operations
 * @module persistence/ClaimRepository
 * @authority 16 Pa.C.S. §1730, §1750
 */

import { db } from './Database.js';

const STORE = 'claims';

export const ClaimRepository = {
  /**
   * Generate unique claim ID
   * @returns {string} CLM-YYYY-NNNNNN format
   */
  generateId() {
    const year = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `CLM-${year}-${seq}`;
  },

  /**
   * Create new claim per §1731
   */
  async create(claimData) {
    const claim = {
      id: this.generateId(),
      ...claimData,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      auditTrail: [{
        action: 'created',
        timestamp: new Date().toISOString(),
        user: claimData.submittedBy
      }]
    };
    await db.put(STORE, claim);
    return claim;
  },

  async getById(id) {
    return db.get(STORE, id);
  },

  async getAll() {
    return db.getAll(STORE);
  },

  async getByStatus(status) {
    return db.query(STORE, 'status', status);
  },

  async getByDepartment(dept) {
    return db.query(STORE, 'department', dept);
  },

  /**
   * Pre-audit review per §1730
   */
  async review(id, reviewData) {
    const claim = await this.getById(id);
    if (!claim) throw new Error('Claim not found');

    claim.status = 'pending_review';
    claim.reviewedBy = reviewData.reviewer;
    claim.reviewedDate = new Date().toISOString();
    claim.reviewNotes = reviewData.notes;
    claim.auditTrail.push({
      action: 'reviewed',
      timestamp: new Date().toISOString(),
      user: reviewData.reviewer
    });

    await db.put(STORE, claim);
    return claim;
  },

  /**
   * Approve claim per §1750
   */
  async approve(id, approvalData) {
    const claim = await this.getById(id);
    if (!claim) throw new Error('Claim not found');

    claim.status = 'approved';
    claim.approvedBy = approvalData.approver;
    claim.approvedDate = new Date().toISOString();
    claim.warrantNumber = approvalData.warrantNumber;
    claim.auditTrail.push({
      action: 'approved',
      timestamp: new Date().toISOString(),
      user: approvalData.approver
    });

    await db.put(STORE, claim);
    return claim;
  },

  /**
   * Reject claim with reason
   */
  async reject(id, rejectionData) {
    const claim = await this.getById(id);
    if (!claim) throw new Error('Claim not found');

    claim.status = 'rejected';
    claim.rejectedBy = rejectionData.rejector;
    claim.rejectedDate = new Date().toISOString();
    claim.rejectionReason = rejectionData.reason;
    claim.auditTrail.push({
      action: 'rejected',
      timestamp: new Date().toISOString(),
      user: rejectionData.rejector,
      reason: rejectionData.reason
    });

    await db.put(STORE, claim);
    return claim;
  },

  async delete(id) {
    return db.delete(STORE, id);
  }
};

export default ClaimRepository;
