/**
 * AuditProvider - Audit findings and recommendations
 */
class AuditProvider {
  constructor(tagProvider) {
    this.tagProvider = tagProvider || window.tagProvider;
    this.tagName = 'audit-findings';
    this.data = null;
  }

  async init() {
    this.data = await this.tagProvider.load(this.tagName);
    return this;
  }

  getSummary() { return this.data?.summary || []; }
  getOffices() { return this.data?.offices || {}; }
  getTotals() { return this.data?.totals || {}; }

  getOffice(id) { return this.getOffices()[id]; }

  getFindings(officeId) {
    const office = this.getOffice(officeId);
    return office?.findings || [];
  }

  getRecommendations(officeId) {
    const office = this.getOffice(officeId);
    return office?.recommendations || [];
  }

  getPotentialSavings(officeId) {
    const office = this.getOffice(officeId);
    return office?.potential || '$0';
  }

  getAllFindings() {
    const offices = this.getOffices();
    return Object.keys(offices).flatMap(id =>
      (offices[id].findings || []).map(f => ({ ...f, office: id, officeTitle: offices[id].title }))
    );
  }

  getAllRecommendations() {
    const offices = this.getOffices();
    return Object.keys(offices).flatMap(id =>
      (offices[id].recommendations || []).map(r => ({ ...r, office: id, officeTitle: offices[id].title }))
    );
  }

  getTotalPotentialSavings() {
    const offices = this.getOffices();
    return Object.values(offices).reduce((sum, o) => {
      const amount = parseInt(o.potential?.replace(/[$,]/g, '') || 0);
      return sum + amount;
    }, 0);
  }

  getStatusColor(status) {
    return { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' }[status] || '#6b7280';
  }
}

async function createAuditProvider() {
  const provider = new AuditProvider(window.tagProvider);
  return provider.init();
}
