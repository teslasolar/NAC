/**
 * AcademyProvider - Citizen Academy course management
 */
class AcademyProvider {
  constructor(tagProvider) {
    this.tagProvider = tagProvider || window.tagProvider;
    this.tagName = 'academy-courses';
    this.data = null;
    this.progress = {};
  }

  async init() {
    this.data = await this.tagProvider.load(this.tagName);
    this._loadProgress();
    return this;
  }

  getCourses() { return this.data?.courses || []; }

  getCourseById(id) {
    return this.getCourses().find(c => c.id === id);
  }

  getLessons(courseId) {
    const course = this.getCourseById(courseId);
    return course?.lessons || [];
  }

  getTotalDuration(courseId) {
    const lessons = this.getLessons(courseId);
    return lessons.reduce((sum, l) => sum + parseInt(l.duration), 0);
  }

  getCourseProgress(courseId) {
    const lessons = this.getLessons(courseId);
    const completed = lessons.filter(l => this.progress[`${courseId}:${l.id}`]).length;
    return { completed, total: lessons.length, percentage: Math.round((completed / lessons.length) * 100) };
  }

  markLessonComplete(courseId, lessonId) {
    this.progress[`${courseId}:${lessonId}`] = true;
    this._saveProgress();
  }

  isLessonComplete(courseId, lessonId) {
    return !!this.progress[`${courseId}:${lessonId}`];
  }

  getOverallProgress() {
    const courses = this.getCourses();
    let totalLessons = 0, completedLessons = 0;
    courses.forEach(c => {
      const progress = this.getCourseProgress(c.id);
      totalLessons += progress.total;
      completedLessons += progress.completed;
    });
    return { completed: completedLessons, total: totalLessons, percentage: Math.round((completedLessons / totalLessons) * 100) };
  }

  _loadProgress() {
    try {
      const saved = localStorage.getItem('academy_progress');
      this.progress = saved ? JSON.parse(saved) : {};
    } catch (e) { this.progress = {}; }
  }

  _saveProgress() {
    try {
      localStorage.setItem('academy_progress', JSON.stringify(this.progress));
    } catch (e) {}
  }
}

async function createAcademyProvider() {
  const provider = new AcademyProvider(window.tagProvider);
  return provider.init();
}
