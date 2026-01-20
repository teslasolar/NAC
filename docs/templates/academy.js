/**
 * NAC Perspective - Academy Components
 * Learning management system components
 */

// ============================================
// COURSE CARD - Course selection tile
// ============================================
NAC.registerComponent('course-card', {
  props: {
    id: '',
    title: '',
    icon: '📚',
    description: '',
    lessonCount: 0,
    duration: '',
    progress: 0,
    locked: false
  },
  template: `
    <div class="nac-course-card {{#if locked}}locked{{/if}}" data-course-id="{{id}}">
      <div class="course-icon">{{icon}}</div>
      <div class="course-info">
        <h3 class="course-title">{{title}}</h3>
        <p class="course-desc">{{description}}</p>
        <div class="course-meta">
          <span>📖 {{lessonCount}} lessons</span>
          <span>⏱️ {{duration}}</span>
        </div>
        {{#if progress}}
        <div class="course-progress">
          <div class="progress-track">
            <div class="progress-fill" style="width: {{progress}}%"></div>
          </div>
          <span class="progress-text">{{progress}}% complete</span>
        </div>
        {{/if}}
      </div>
      {{#if locked}}
      <div class="course-lock">🔒</div>
      {{/if}}
    </div>
  `,
  style: `
    .nac-course-card {
      display: flex;
      gap: 1rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 12px;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    .nac-course-card:hover {
      border-color: var(--accent, #3b82f6);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .nac-course-card.locked {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .nac-course-card.locked:hover {
      transform: none;
      border-color: var(--border);
    }
    .course-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-surface, #1f2937);
      border-radius: 12px;
      flex-shrink: 0;
    }
    .course-info { flex: 1; }
    .course-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text, #e5e7eb);
    }
    .course-desc {
      font-size: 0.85rem;
      color: var(--text-dim, #9ca3af);
      margin-bottom: 0.75rem;
    }
    .course-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .course-progress {
      margin-top: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .course-progress .progress-track {
      flex: 1;
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    .course-progress .progress-fill {
      height: 100%;
      background: var(--green, #22c55e);
      border-radius: 3px;
    }
    .course-progress .progress-text {
      font-size: 0.7rem;
      color: var(--green, #22c55e);
    }
    .course-lock {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.25rem;
    }
  `
});

// ============================================
// LESSON LIST - Sidebar lesson navigation
// ============================================
NAC.registerComponent('lesson-list', {
  props: {
    lessons: [],
    currentLesson: 0,
    onSelect: null
  },
  template: `
    <div class="nac-lesson-list">
      {{#each lessons}}
      <div class="lesson-item {{#if this.completed}}completed{{/if}} {{#if this.isQuiz}}quiz{{/if}}"
           data-lesson-index="{{@index}}">
        <div class="lesson-number">{{@index}}</div>
        <div class="lesson-info">
          <div class="lesson-title">{{this.title}}</div>
          <div class="lesson-duration">{{this.duration}}</div>
        </div>
        <div class="lesson-status">
          {{#if this.completed}}✓{{/if}}
          {{#if this.isQuiz}}📝{{/if}}
        </div>
      </div>
      {{/each}}
    </div>
  `,
  style: `
    .nac-lesson-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .lesson-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--bg-surface, #1f2937);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .lesson-item:hover {
      background: rgba(59, 130, 246, 0.1);
    }
    .lesson-item.active {
      background: rgba(59, 130, 246, 0.2);
      border-left: 3px solid var(--accent, #3b82f6);
    }
    .lesson-item.completed .lesson-number {
      background: var(--green, #22c55e);
      color: #fff;
    }
    .lesson-item.quiz .lesson-number {
      background: var(--yellow, #f59e0b);
      color: #000;
    }
    .lesson-number {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-panel, #111827);
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    .lesson-info { flex: 1; }
    .lesson-title {
      font-size: 0.85rem;
      font-weight: 500;
    }
    .lesson-duration {
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
    }
    .lesson-status {
      font-size: 0.9rem;
      color: var(--green, #22c55e);
    }
  `,
  onMount(props) {
    this.querySelectorAll('.lesson-item').forEach((item, index) => {
      if (index === props.currentLesson) {
        item.classList.add('active');
      }
      item.addEventListener('click', () => {
        this.querySelectorAll('.lesson-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (props.onSelect) props.onSelect(index);
      });
    });
  }
});

// ============================================
// LESSON VIEWER - Content display area
// ============================================
NAC.registerComponent('lesson-viewer', {
  props: {
    title: '',
    content: '',
    lessonNumber: 1,
    totalLessons: 1,
    onPrev: null,
    onNext: null,
    onComplete: null
  },
  template: `
    <div class="nac-lesson-viewer">
      <div class="lesson-header">
        <span class="lesson-badge">Lesson {{lessonNumber}} of {{totalLessons}}</span>
        <h2 class="lesson-title">{{title}}</h2>
      </div>
      <div class="lesson-content">{{{content}}}</div>
      <div class="lesson-nav">
        <button class="nav-btn prev" data-nac-click="prevLesson">← Previous</button>
        <button class="nav-btn complete" data-nac-click="markComplete">✓ Mark Complete</button>
        <button class="nav-btn next" data-nac-click="nextLesson">Next →</button>
      </div>
    </div>
  `,
  style: `
    .nac-lesson-viewer {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 12px;
      overflow: hidden;
    }
    .lesson-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border, #374151);
    }
    .lesson-badge {
      display: inline-block;
      background: var(--accent, #3b82f6);
      color: #fff;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .lesson-header .lesson-title {
      font-size: 1.5rem;
      font-weight: 600;
    }
    .lesson-content {
      padding: 2rem;
      line-height: 1.7;
      max-height: 500px;
      overflow-y: auto;
    }
    .lesson-content h3 {
      font-size: 1.25rem;
      margin: 1.5rem 0 1rem;
      color: var(--cyan, #06b6d4);
    }
    .lesson-content h3:first-child { margin-top: 0; }
    .lesson-content p { margin-bottom: 1rem; }
    .lesson-content ul, .lesson-content ol {
      margin: 1rem 0 1rem 1.5rem;
    }
    .lesson-content li { margin-bottom: 0.5rem; }
    .lesson-nav {
      display: flex;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border, #374151);
      background: var(--bg-surface, #1f2937);
    }
    .nav-btn {
      padding: 0.6rem 1.25rem;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .nav-btn.prev, .nav-btn.next {
      background: transparent;
      border: 1px solid var(--border, #374151);
      color: var(--text-dim, #9ca3af);
    }
    .nav-btn.prev:hover, .nav-btn.next:hover {
      background: var(--bg-panel, #111827);
      color: var(--text, #e5e7eb);
    }
    .nav-btn.complete {
      background: var(--green, #22c55e);
      border: none;
      color: #000;
      font-weight: 500;
    }
    .nav-btn.complete:hover { opacity: 0.9; }
    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  methods: {
    prevLesson(props) {
      if (props.onPrev) props.onPrev();
    },
    nextLesson(props) {
      if (props.onNext) props.onNext();
    },
    markComplete(props) {
      if (props.onComplete) props.onComplete();
    }
  }
});

// ============================================
// QUIZ QUESTION - Interactive quiz question
// ============================================
NAC.registerComponent('quiz-question', {
  props: {
    questionNumber: 1,
    question: '',
    options: [], // [{text, correct}]
    explanation: ''
  },
  template: `
    <div class="nac-quiz-question">
      <div class="question-header">
        <span class="question-number">Q{{questionNumber}}</span>
        <span class="question-text">{{question}}</span>
      </div>
      <div class="question-options">
        {{#each options}}
        <label class="quiz-option" data-correct="{{this.correct}}">
          <input type="radio" name="q{{questionNumber}}" value="{{@index}}">
          <span class="option-text">{{this.text}}</span>
          <span class="option-feedback"></span>
        </label>
        {{/each}}
      </div>
      {{#if explanation}}
      <div class="question-explanation" style="display:none">
        <strong>💡 Explanation:</strong> {{explanation}}
      </div>
      {{/if}}
    </div>
  `,
  style: `
    .nac-quiz-question {
      background: var(--bg-surface, #1f2937);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .question-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .question-number {
      background: var(--yellow, #f59e0b);
      color: #000;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: 600;
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    .question-text {
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.5;
    }
    .question-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-left: 3rem;
    }
    .quiz-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .quiz-option:hover {
      border-color: var(--accent, #3b82f6);
    }
    .quiz-option input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    .quiz-option.correct {
      border-color: var(--green, #22c55e);
      background: rgba(34, 197, 94, 0.1);
    }
    .quiz-option.incorrect {
      border-color: var(--red, #ef4444);
      background: rgba(239, 68, 68, 0.1);
    }
    .quiz-option.correct .option-feedback::after { content: '✓ Correct!'; color: var(--green); margin-left: auto; }
    .quiz-option.incorrect .option-feedback::after { content: '✗ Incorrect'; color: var(--red); margin-left: auto; }
    .question-explanation {
      margin-top: 1rem;
      margin-left: 3rem;
      padding: 1rem;
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid var(--accent, #3b82f6);
      border-radius: 0 8px 8px 0;
      font-size: 0.9rem;
    }
  `,
  onMount(props) {
    const options = this.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      opt.querySelector('input').addEventListener('change', () => {
        // Clear previous states
        options.forEach(o => o.classList.remove('correct', 'incorrect'));

        // Mark selection
        const isCorrect = opt.dataset.correct === 'true';
        opt.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Show correct answer if wrong
        if (!isCorrect) {
          options.forEach(o => {
            if (o.dataset.correct === 'true') {
              o.classList.add('correct');
            }
          });
        }

        // Show explanation
        const explanation = this.querySelector('.question-explanation');
        if (explanation) explanation.style.display = 'block';
      });
    });
  }
});

// ============================================
// INFO BOX - Highlighted information box
// ============================================
NAC.registerComponent('info-box', {
  props: {
    type: 'info', // info, tip, warning
    title: '',
    content: ''
  },
  template: `
    <div class="nac-info-box nac-info-{{type}}">
      {{#if title}}<strong class="info-title">{{title}}</strong>{{/if}}
      <div class="info-content">{{{content}}}</div>
    </div>
  `,
  style: `
    .nac-info-box {
      padding: 1rem 1.5rem;
      border-radius: 0 8px 8px 0;
      margin: 1.5rem 0;
      border-left: 4px solid;
    }
    .nac-info-info {
      background: rgba(59, 130, 246, 0.1);
      border-color: var(--accent, #3b82f6);
    }
    .nac-info-tip {
      background: rgba(34, 197, 94, 0.1);
      border-color: var(--green, #22c55e);
    }
    .nac-info-warning {
      background: rgba(245, 158, 11, 0.1);
      border-color: var(--yellow, #f59e0b);
    }
    .info-title {
      display: block;
      margin-bottom: 0.5rem;
    }
    .info-content { font-size: 0.9rem; line-height: 1.6; }
  `
});

// ============================================
// PROGRESS TRACKER - Course completion tracker
// ============================================
NAC.registerComponent('progress-tracker', {
  props: {
    coursesCompleted: 0,
    totalCourses: 6,
    lessonsCompleted: 0,
    totalLessons: 33,
    quizzesPassed: 0,
    totalQuizzes: 5,
    certificates: []
  },
  template: `
    <div class="nac-progress-tracker">
      <div class="tracker-header">
        <h3>📊 Your Progress</h3>
      </div>
      <div class="tracker-stats">
        <div class="stat-item">
          <div class="stat-value">{{coursesCompleted}}/{{totalCourses}}</div>
          <div class="stat-label">Courses</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{lessonsCompleted}}/{{totalLessons}}</div>
          <div class="stat-label">Lessons</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{quizzesPassed}}/{{totalQuizzes}}</div>
          <div class="stat-label">Quizzes</div>
        </div>
      </div>
      <div class="tracker-overall">
        <div class="overall-label">Overall Completion</div>
        <div class="overall-bar">
          <div class="overall-fill" style="width: calc({{lessonsCompleted}} / {{totalLessons}} * 100%)"></div>
        </div>
        <div class="overall-percent"></div>
      </div>
    </div>
  `,
  style: `
    .nac-progress-tracker {
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .tracker-header h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
      color: var(--text, #e5e7eb);
    }
    .tracker-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .stat-item {
      text-align: center;
      padding: 0.75rem;
      background: var(--bg-surface, #1f2937);
      border-radius: 8px;
    }
    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent, #3b82f6);
    }
    .stat-label {
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
      margin-top: 0.25rem;
    }
    .tracker-overall {}
    .overall-label {
      font-size: 0.8rem;
      color: var(--text-dim, #9ca3af);
      margin-bottom: 0.5rem;
    }
    .overall-bar {
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    .overall-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent, #3b82f6), var(--green, #22c55e));
      border-radius: 4px;
      transition: width 0.5s ease;
    }
  `,
  onMount(props) {
    const percent = Math.round((props.lessonsCompleted / props.totalLessons) * 100);
    this.querySelector('.overall-percent').textContent = `${percent}%`;
  }
});

// ============================================
// ORG CHART BOX - Organization chart node
// ============================================
NAC.registerComponent('org-box', {
  props: {
    title: '',
    subtitle: '',
    highlight: false
  },
  template: `
    <div class="nac-org-box {{#if highlight}}highlight{{/if}}">
      <div class="org-title">{{title}}</div>
      {{#if subtitle}}<div class="org-subtitle">{{subtitle}}</div>{{/if}}
    </div>
  `,
  style: `
    .nac-org-box {
      background: var(--bg-panel, #111827);
      border: 2px solid var(--border, #374151);
      border-radius: 8px;
      padding: 0.75rem 1.25rem;
      text-align: center;
      min-width: 140px;
    }
    .nac-org-box.highlight {
      border-color: var(--accent, #3b82f6);
      background: rgba(59, 130, 246, 0.1);
    }
    .org-title {
      font-weight: 600;
      font-size: 0.9rem;
    }
    .org-subtitle {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
  `
});

console.log('NAC Academy Components loaded');
