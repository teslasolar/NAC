/**
 * @fileoverview Repository for budget management
 * @module persistence/BudgetRepository
 * @authority 16 Pa.C.S. §17A01-§17A10
 */

import { db } from './Database.js';

const STORE = 'budgetItems';

export const BudgetRepository = {
  /**
   * Generate unique budget line ID
   */
  generateId(fiscalYear, dept) {
    const seq = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `BUD-${fiscalYear}-${dept.substring(0, 3).toUpperCase()}-${seq}`;
  },

  /**
   * Create budget line item per §17A02
   */
  async create(itemData) {
    const item = {
      id: this.generateId(itemData.fiscalYear, itemData.department),
      ...itemData,
      encumbered: 0,
      spent: 0,
      available: itemData.appropriation,
      status: 'active',
      createdDate: new Date().toISOString(),
      amendments: []
    };
    await db.put(STORE, item);
    return item;
  },

  async getById(id) {
    return db.get(STORE, id);
  },

  async getAll() {
    return db.getAll(STORE);
  },

  async getByFiscalYear(year) {
    return db.query(STORE, 'fiscalYear', year);
  },

  async getByDepartment(dept) {
    return db.query(STORE, 'department', dept);
  },

  /**
   * Encumber funds per §17A10
   */
  async encumber(id, amount, reference) {
    const item = await this.getById(id);
    if (!item) throw new Error('Budget item not found');

    if (amount > item.available) {
      throw new Error('Insufficient funds available');
    }

    item.encumbered += amount;
    item.available = item.appropriation - item.encumbered - item.spent;

    await db.put(STORE, item);
    return item;
  },

  /**
   * Record expenditure
   */
  async spend(id, amount, reference) {
    const item = await this.getById(id);
    if (!item) throw new Error('Budget item not found');

    item.spent += amount;
    item.encumbered = Math.max(0, item.encumbered - amount);
    item.available = item.appropriation - item.encumbered - item.spent;

    await db.put(STORE, item);
    return item;
  },

  /**
   * Budget amendment per §17A06
   */
  async amend(id, amendmentData) {
    const item = await this.getById(id);
    if (!item) throw new Error('Budget item not found');

    const amendment = {
      id: `AMD-${Date.now()}`,
      previousAmount: item.appropriation,
      newAmount: amendmentData.newAmount,
      reason: amendmentData.reason,
      approvedBy: amendmentData.approvedBy,
      date: new Date().toISOString()
    };

    item.amendments.push(amendment);
    item.appropriation = amendmentData.newAmount;
    item.available = item.appropriation - item.encumbered - item.spent;

    await db.put(STORE, item);
    return item;
  },

  /**
   * Line item transfer per §17A07
   */
  async transfer(fromId, toId, amount, reason, approvedBy) {
    const fromItem = await this.getById(fromId);
    const toItem = await this.getById(toId);

    if (!fromItem || !toItem) throw new Error('Budget item not found');
    if (amount > fromItem.available) throw new Error('Insufficient funds');

    // Reduce from source
    fromItem.appropriation -= amount;
    fromItem.available -= amount;
    fromItem.amendments.push({
      id: `TRF-${Date.now()}`,
      type: 'transfer_out',
      amount: -amount,
      toAccount: toId,
      reason,
      approvedBy,
      date: new Date().toISOString()
    });

    // Add to destination
    toItem.appropriation += amount;
    toItem.available += amount;
    toItem.amendments.push({
      id: `TRF-${Date.now()}`,
      type: 'transfer_in',
      amount,
      fromAccount: fromId,
      reason,
      approvedBy,
      date: new Date().toISOString()
    });

    await db.put(STORE, fromItem);
    await db.put(STORE, toItem);

    return { from: fromItem, to: toItem };
  },

  /**
   * Get budget summary by department
   */
  async getSummary(fiscalYear) {
    const items = await this.getByFiscalYear(fiscalYear);
    const summary = {};

    for (const item of items) {
      if (!summary[item.department]) {
        summary[item.department] = {
          appropriation: 0,
          encumbered: 0,
          spent: 0,
          available: 0
        };
      }
      summary[item.department].appropriation += item.appropriation;
      summary[item.department].encumbered += item.encumbered;
      summary[item.department].spent += item.spent;
      summary[item.department].available += item.available;
    }

    return summary;
  }
};

export default BudgetRepository;
