/**
 * GISProvider - Specialized provider for parcel/GIS data operations
 */
class GISProvider {
  constructor(tagProvider) {
    this.tagProvider = tagProvider || window.tagProvider;
    this.tagName = 'parcels';
    this.data = null;
  }

  async init() {
    this.data = await this.tagProvider.load(this.tagName);
    return this;
  }

  getParcels() { return this.data?.parcels || []; }
  getMunicipalities() { return this.data?.municipalities || []; }
  getLandUseColors() { return this.data?.landUseColors || {}; }

  filterParcels({ landUse = 'all', municipality = 'all', assessmentRange = 'all' } = {}) {
    let parcels = this.getParcels();

    if (landUse !== 'all') {
      parcels = parcels.filter(p => p.landUse === landUse);
    }

    if (municipality !== 'all') {
      const muniName = municipality.replace(/-/g, ' ').toLowerCase();
      parcels = parcels.filter(p => p.municipality.toLowerCase().includes(muniName));
    }

    if (assessmentRange !== 'all') {
      const [min, max] = this._parseRange(assessmentRange);
      parcels = parcels.filter(p => p.assessed >= min && p.assessed <= max);
    }

    return parcels;
  }

  searchParcels(query) {
    const q = query.toLowerCase();
    return this.getParcels().filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.owner.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  }

  getParcelById(id) {
    return this.getParcels().find(p => p.id === id);
  }

  getStats(parcels = null) {
    const list = parcels || this.getParcels();
    const totalValue = list.reduce((sum, p) => sum + p.assessed, 0);
    const totalAcres = list.reduce((sum, p) => sum + p.acres, 0);
    return {
      count: list.length,
      totalValue,
      totalAcres,
      avgValue: list.length ? Math.round(totalValue / list.length) : 0,
      byLandUse: list.reduce((acc, p) => { acc[p.landUse] = (acc[p.landUse] || 0) + 1; return acc; }, {}),
      byMunicipality: list.reduce((acc, p) => { acc[p.municipality] = (acc[p.municipality] || 0) + 1; return acc; }, {})
    };
  }

  formatCurrency(value) {
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
    return '$' + value.toLocaleString();
  }

  getParcelColor(parcel) {
    return this.getLandUseColors()[parcel.landUse] || '#607d8b';
  }

  _parseRange(range) {
    if (range.includes('+')) return [parseInt(range), Infinity];
    const parts = range.split('-').map(Number);
    return [parts[0] || 0, parts[1] || Infinity];
  }
}

async function createGISProvider() {
  const provider = new GISProvider(window.tagProvider);
  return provider.init();
}
