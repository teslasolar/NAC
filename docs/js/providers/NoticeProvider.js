/**
 * NoticeProvider - Specialized provider for public notice operations
 */
class NoticeProvider {
  constructor(tagProvider) {
    this.tagProvider = tagProvider || window.tagProvider;
    this.tagName = 'notices';
    this.data = null;
  }

  async init() {
    this.data = await this.tagProvider.load(this.tagName);
    return this;
  }

  getNotices() { return this.data?.notices || []; }
  getTypeLabels() { return this.data?.typeLabels || {}; }

  filterNotices({ type = 'all', dept = 'all', search = '' } = {}) {
    let notices = this.getNotices();
    if (type !== 'all') notices = notices.filter(n => n.type === type);
    if (dept !== 'all') notices = notices.filter(n => n.dept.toLowerCase().includes(dept.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      notices = notices.filter(n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
    }
    return this.sortByDeadline(notices);
  }

  sortByDeadline(notices) {
    return [...notices].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }

  getDaysLeft(deadline) {
    const now = new Date();
    const end = new Date(deadline);
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  }

  getDeadlineStatus(deadline) {
    const days = this.getDaysLeft(deadline);
    if (days <= 0) return { class: 'expired', text: 'Deadline passed' };
    if (days <= 3) return { class: 'urgent', text: `${days} days remaining` };
    if (days <= 7) return { class: 'soon', text: `${days} days remaining` };
    return { class: '', text: `${days} days remaining` };
  }

  getStats() {
    const notices = this.getNotices();
    return {
      active: notices.filter(n => this.getDaysLeft(n.deadline) > 0).length,
      byType: notices.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc; }, {}),
      urgent: notices.filter(n => n.urgent).length,
      featured: notices.filter(n => n.featured).length
    };
  }

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

async function createNoticeProvider() {
  const provider = new NoticeProvider(window.tagProvider);
  return provider.init();
}
