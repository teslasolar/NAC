/**
 * RiskProvider - Specialized provider for AI risk scoring data
 */
class RiskProvider {
  constructor(tagProvider) {
    this.tagProvider = tagProvider || window.tagProvider;
    this.tagName = 'risk-areas';
    this.data = null;
  }

  async init() {
    this.data = await this.tagProvider.load(this.tagName);
    return this;
  }

  getRiskAreas() { return this.data?.riskAreas || []; }
  getModelInfo() { return this.data?.modelInfo || {}; }
  getThresholds() { return this.data?.thresholds || {}; }

  filterByLevel(level) {
    if (level === 'all') return this.getRiskAreas();
    return this.getRiskAreas().filter(r => r.level === level);
  }

  filterByCategory(category) {
    if (category === 'all') return this.getRiskAreas();
    return this.getRiskAreas().filter(r => r.category === category);
  }

  filterByOfficer(officer) {
    if (officer === 'all') return this.getRiskAreas();
    return this.getRiskAreas().filter(r => r.officer === officer);
  }

  getScoreLevel(score) {
    const t = this.getThresholds();
    if (score >= t.critical) return 'critical';
    if (score >= t.high) return 'high';
    if (score >= t.medium) return 'medium';
    return 'low';
  }

  getStats() {
    const areas = this.getRiskAreas();
    return {
      critical: areas.filter(r => r.level === 'critical').length,
      high: areas.filter(r => r.level === 'high').length,
      medium: areas.filter(r => r.level === 'medium').length,
      low: areas.filter(r => r.level === 'low').length,
      avgScore: Math.round(areas.reduce((sum, r) => sum + r.score, 0) / areas.length),
      byCategory: areas.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {}),
      byOfficer: areas.reduce((acc, r) => { acc[r.officer] = (acc[r.officer] || 0) + 1; return acc; }, {})
    };
  }

  getTrendIcon(trend) {
    return { up: '↑', down: '↓', stable: '—' }[trend] || '—';
  }

  getTrendClass(trend) {
    return { up: 'trend-up', down: 'trend-down', stable: '' }[trend] || '';
  }

  getChartData() {
    const areas = this.getRiskAreas();
    return {
      categoryDistribution: this._getCategoryDistribution(areas),
      officerScores: this._getOfficerScores(areas),
      trendData: this._getTrendData()
    };
  }

  _getCategoryDistribution(areas) {
    const counts = areas.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {});
    return { labels: Object.keys(counts), data: Object.values(counts) };
  }

  _getOfficerScores(areas) {
    const scores = {};
    areas.forEach(r => { if (!scores[r.officer] || r.score > scores[r.officer]) scores[r.officer] = r.score; });
    return { labels: Object.keys(scores), data: Object.values(scores) };
  }

  _getTrendData() {
    // Simulated weekly trend data
    return { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], critical: [2, 1, 3, 3], high: [15, 14, 13, 12], medium: [25, 27, 28, 28] };
  }
}

async function createRiskProvider() {
  const provider = new RiskProvider(window.tagProvider);
  return provider.init();
}
