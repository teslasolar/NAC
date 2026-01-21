/**
 * OrgChartProvider - Organization structure data operations
 */
class OrgChartProvider {
  constructor(tagProvider) {
    this.tagProvider = tagProvider || window.tagProvider;
    this.tagName = 'org-chart';
    this.data = null;
  }

  async init() {
    this.data = await this.tagProvider.load(this.tagName);
    return this;
  }

  getRowOfficers() { return this.data?.rowOfficers || []; }
  getExecutive() { return this.data?.executive || []; }
  getJudiciary() { return this.data?.judiciary || []; }
  getHumanServices() { return this.data?.humanServices || []; }
  getPublicSafety() { return this.data?.publicSafety || []; }

  getAllDepartments() {
    return [...this.getRowOfficers(), ...this.getExecutive(), ...this.getJudiciary(), ...this.getHumanServices(), ...this.getPublicSafety()];
  }

  getDepartmentById(id) {
    return this.getAllDepartments().find(d => d.id === id);
  }

  getByCategory(category) {
    return this.getAllDepartments().filter(d => d.category === category);
  }

  getTotalStaff() {
    return this.getAllDepartments().reduce((sum, d) => sum + (d.staff || 0), 0);
  }

  getTotalBudget() {
    return this.getAllDepartments().reduce((sum, d) => sum + (d.budget || 0), 0);
  }

  getStats() {
    const depts = this.getAllDepartments();
    return {
      totalDepartments: depts.length,
      totalStaff: this.getTotalStaff(),
      totalBudget: this.getTotalBudget(),
      avgOEE: depts.filter(d => d.oee).reduce((sum, d) => sum + d.oee, 0) / depts.filter(d => d.oee).length,
      byCategory: depts.reduce((acc, d) => { acc[d.category] = (acc[d.category] || 0) + 1; return acc; }, {})
    };
  }

  formatBudget(amount) {
    if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(1) + 'M';
    return '$' + (amount / 1000).toFixed(0) + 'K';
  }
}

async function createOrgChartProvider() {
  const provider = new OrgChartProvider(window.tagProvider);
  return provider.init();
}
