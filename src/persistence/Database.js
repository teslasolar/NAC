/**
 * @fileoverview IndexedDB persistence layer for NAC
 * @module persistence/Database
 * @description Browser-based storage with upgrade path to backend API
 */

const DB_NAME = 'NAC_CountyController';
const DB_VERSION = 1;

const STORES = {
  claims: { keyPath: 'id', indexes: ['status', 'department', 'submittedDate'] },
  audits: { keyPath: 'id', indexes: ['status', 'type', 'startDate'] },
  findings: { keyPath: 'id', indexes: ['auditId', 'severity', 'status'] },
  warrants: { keyPath: 'id', indexes: ['status', 'payee', 'issueDate'] },
  budgetItems: { keyPath: 'id', indexes: ['department', 'fiscalYear', 'category'] }
};

class Database {
  constructor() {
    this.db = null;
    this.ready = this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        for (const [name, config] of Object.entries(STORES)) {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, { keyPath: config.keyPath });
            config.indexes.forEach(idx => {
              store.createIndex(idx, idx, { unique: false });
            });
          }
        }
      };
    });
  }

  async getStore(name, mode = 'readonly') {
    await this.ready;
    const tx = this.db.transaction(name, mode);
    return tx.objectStore(name);
  }

  async get(storeName, id) {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(storeName, item) {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async query(storeName, indexName, value) {
    const store = await this.getStore(storeName);
    const index = store.index(indexName);
    return new Promise((resolve, reject) => {
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new Database();
export default Database;
