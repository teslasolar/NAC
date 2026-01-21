/**
 * ScreenProvider - SCADA screen navigation and configuration
 */
class ScreenProvider {
  constructor(tagProvider) {
    this.tagProvider = tagProvider || window.tagProvider;
    this.tagName = 'screens';
    this.data = null;
  }

  async init() {
    this.data = await this.tagProvider.load(this.tagName);
    return this;
  }

  getSystem() { return this.data?.system || {}; }
  getScreens() { return this.data?.screens || []; }
  getCategories() { return this.data?.categories || {}; }
  getAlarms() { return this.data?.alarms || []; }
  getKPIs() { return this.data?.kpis || {}; }

  getScreenById(id) {
    return this.getScreens().find(s => s.id === id);
  }

  getScreensByCategory(category) {
    return this.getScreens().filter(s => s.category === category);
  }

  getActiveAlarms() {
    return this.getAlarms().filter(a => a.priority !== 'info');
  }

  getCriticalKPIs() {
    const kpis = this.getKPIs();
    return Object.keys(kpis).filter(k => kpis[k].status === 'warning' || kpis[k].status === 'critical');
  }

  getNavigation() {
    const categories = this.getCategories();
    const screens = this.getScreens();
    return Object.keys(categories).map(catId => ({
      ...categories[catId],
      id: catId,
      screens: screens.filter(s => s.category === catId)
    }));
  }

  getKPIStatus(kpi) {
    const data = this.getKPIs()[kpi];
    if (!data) return null;
    const percentage = (data.value / data.target) * 100;
    return { ...data, percentage, onTarget: data.value >= data.target };
  }
}

async function createScreenProvider() {
  const provider = new ScreenProvider(window.tagProvider);
  return provider.init();
}
