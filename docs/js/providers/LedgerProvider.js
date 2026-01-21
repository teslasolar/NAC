/**
 * LedgerProvider - Specialized provider for ledger record operations
 * Extends base TagProvider functionality for blockchain ledger
 */
class LedgerProvider {
  constructor(tagProvider) {
    this.tagProvider = tagProvider || window.tagProvider;
    this.tagName = 'ledger-records';
    this.data = null;
  }

  async init() {
    this.data = await this.tagProvider.load(this.tagName);
    return this;
  }

  getRecords() { return this.data?.records || []; }
  getTypeLabels() { return this.data?.typeLabels || {}; }

  filterRecords({ type = 'all', year = 'all', search = '' } = {}) {
    let records = this.getRecords();
    if (type !== 'all') records = records.filter(r => r.type === type);
    if (year !== 'all') records = records.filter(r => r.date.startsWith(year));
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r => r.title.toLowerCase().includes(q) || r.dept.toLowerCase().includes(q));
    }
    return records;
  }

  findByHash(hash) {
    const h = hash.toLowerCase();
    return this.getRecords().find(r => r.hash.toLowerCase() === h || r.hash.toLowerCase().includes(h));
  }

  getRecordById(id) {
    return this.getRecords().find(r => r.id === id);
  }

  getStats() {
    const records = this.getRecords();
    return {
      total: records.length,
      verified: records.filter(r => r.verified).length,
      byType: records.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {}),
      latestBlock: Math.max(...records.map(r => r.block))
    };
  }

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

// Factory function
async function createLedgerProvider() {
  const provider = new LedgerProvider(window.tagProvider);
  return provider.init();
}
