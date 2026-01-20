/**
 * NAC Perspective - Form Components
 * Input controls and form elements
 */

// ============================================
// TEXT INPUT - Standard text input
// ============================================
NAC.registerComponent('text-input', {
  props: {
    name: '',
    label: '',
    placeholder: '',
    value: '',
    type: 'text', // text, email, password, number, tel, url
    required: false,
    disabled: false,
    error: null,
    hint: null,
    icon: null,
    size: 'medium' // small, medium, large
  },
  template: `
    <div class="nac-input-group nac-input-{{size}} {{#if error}}has-error{{/if}}">
      {{#if label}}<label class="nac-input-label">{{label}}{{#if required}}<span class="required">*</span>{{/if}}</label>{{/if}}
      <div class="nac-input-wrapper">
        {{#if icon}}<span class="input-icon">{{icon}}</span>{{/if}}
        <input type="{{type}}" name="{{name}}" placeholder="{{placeholder}}" value="{{value}}"
               class="nac-text-input" {{#if required}}required{{/if}} {{#if disabled}}disabled{{/if}}>
      </div>
      {{#if error}}<div class="nac-input-error">{{error}}</div>{{/if}}
      {{#if hint}}<div class="nac-input-hint">{{hint}}</div>{{/if}}
    </div>
  `,
  style: `
    .nac-input-group { margin-bottom: 1rem; }
    .nac-input-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text, #e5e7eb);
    }
    .nac-input-label .required { color: var(--red, #ef4444); margin-left: 0.25rem; }
    .nac-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .nac-input-wrapper .input-icon {
      position: absolute;
      left: 0.75rem;
      color: var(--text-dim, #9ca3af);
    }
    .nac-text-input {
      width: 100%;
      padding: 0.6rem 0.75rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 6px;
      color: var(--text, #e5e7eb);
      font-size: 0.9rem;
      transition: all 0.15s;
    }
    .nac-input-wrapper .input-icon + .nac-text-input { padding-left: 2.5rem; }
    .nac-text-input:focus {
      outline: none;
      border-color: var(--accent, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .nac-text-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .nac-text-input::placeholder { color: var(--text-dim, #9ca3af); }
    .has-error .nac-text-input { border-color: var(--red, #ef4444); }
    .nac-input-error {
      font-size: 0.75rem;
      color: var(--red, #ef4444);
      margin-top: 0.25rem;
    }
    .nac-input-hint {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
      margin-top: 0.25rem;
    }
    .nac-input-small .nac-text-input { padding: 0.4rem 0.6rem; font-size: 0.8rem; }
    .nac-input-large .nac-text-input { padding: 0.8rem 1rem; font-size: 1rem; }
  `
});

// ============================================
// TEXTAREA - Multi-line text input
// ============================================
NAC.registerComponent('textarea', {
  props: {
    name: '',
    label: '',
    placeholder: '',
    value: '',
    rows: 4,
    required: false,
    disabled: false,
    error: null,
    maxLength: null
  },
  template: `
    <div class="nac-input-group {{#if error}}has-error{{/if}}">
      {{#if label}}<label class="nac-input-label">{{label}}{{#if required}}<span class="required">*</span>{{/if}}</label>{{/if}}
      <textarea name="{{name}}" placeholder="{{placeholder}}" rows="{{rows}}"
                class="nac-textarea" {{#if required}}required{{/if}} {{#if disabled}}disabled{{/if}}
                {{#if maxLength}}maxlength="{{maxLength}}"{{/if}}>{{value}}</textarea>
      {{#if error}}<div class="nac-input-error">{{error}}</div>{{/if}}
      {{#if maxLength}}<div class="nac-char-count"><span class="count">0</span>/{{maxLength}}</div>{{/if}}
    </div>
  `,
  style: `
    .nac-textarea {
      width: 100%;
      padding: 0.75rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 6px;
      color: var(--text, #e5e7eb);
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;
      min-height: 80px;
      transition: all 0.15s;
    }
    .nac-textarea:focus {
      outline: none;
      border-color: var(--accent, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .nac-char-count {
      font-size: 0.7rem;
      color: var(--text-dim, #9ca3af);
      text-align: right;
      margin-top: 0.25rem;
    }
  `,
  onMount(props) {
    if (props.maxLength) {
      const textarea = this.querySelector('textarea');
      const count = this.querySelector('.count');
      textarea.addEventListener('input', () => {
        count.textContent = textarea.value.length;
      });
    }
  }
});

// ============================================
// SELECT - Dropdown select
// ============================================
NAC.registerComponent('select-input', {
  props: {
    name: '',
    label: '',
    placeholder: 'Select an option',
    value: '',
    options: [], // [{value, label, disabled}]
    required: false,
    disabled: false,
    error: null
  },
  template: `
    <div class="nac-input-group {{#if error}}has-error{{/if}}">
      {{#if label}}<label class="nac-input-label">{{label}}{{#if required}}<span class="required">*</span>{{/if}}</label>{{/if}}
      <select name="{{name}}" class="nac-select" {{#if required}}required{{/if}} {{#if disabled}}disabled{{/if}}>
        <option value="" disabled selected>{{placeholder}}</option>
        {{#each options}}
        <option value="{{this.value}}" {{#if this.disabled}}disabled{{/if}}>{{this.label}}</option>
        {{/each}}
      </select>
      {{#if error}}<div class="nac-input-error">{{error}}</div>{{/if}}
    </div>
  `,
  style: `
    .nac-select {
      width: 100%;
      padding: 0.6rem 2.5rem 0.6rem 0.75rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 6px;
      color: var(--text, #e5e7eb);
      font-size: 0.9rem;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
    }
    .nac-select:focus {
      outline: none;
      border-color: var(--accent, #3b82f6);
    }
  `
});

// ============================================
// CHECKBOX - Checkbox input
// ============================================
NAC.registerComponent('checkbox', {
  props: {
    name: '',
    label: '',
    checked: false,
    disabled: false,
    description: null
  },
  template: `
    <label class="nac-checkbox {{#if disabled}}disabled{{/if}}">
      <input type="checkbox" name="{{name}}" {{#if checked}}checked{{/if}} {{#if disabled}}disabled{{/if}}>
      <span class="checkbox-box"></span>
      <span class="checkbox-content">
        <span class="checkbox-label">{{label}}</span>
        {{#if description}}<span class="checkbox-desc">{{description}}</span>{{/if}}
      </span>
    </label>
  `,
  style: `
    .nac-checkbox {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.5rem 0;
    }
    .nac-checkbox.disabled { opacity: 0.6; cursor: not-allowed; }
    .nac-checkbox input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .checkbox-box {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border, #374151);
      border-radius: 4px;
      background: var(--bg-panel, #111827);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .nac-checkbox input:checked + .checkbox-box {
      background: var(--accent, #3b82f6);
      border-color: var(--accent, #3b82f6);
    }
    .nac-checkbox input:checked + .checkbox-box::after {
      content: '✓';
      color: #fff;
      font-size: 0.75rem;
    }
    .nac-checkbox input:focus + .checkbox-box {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
    .checkbox-content { display: flex; flex-direction: column; }
    .checkbox-label { font-size: 0.9rem; }
    .checkbox-desc {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
      margin-top: 0.25rem;
    }
  `
});

// ============================================
// RADIO GROUP - Radio button group
// ============================================
NAC.registerComponent('radio-group', {
  props: {
    name: '',
    label: '',
    options: [], // [{value, label, description}]
    value: '',
    direction: 'vertical' // vertical, horizontal
  },
  template: `
    <div class="nac-radio-group">
      {{#if label}}<div class="nac-input-label">{{label}}</div>{{/if}}
      <div class="radio-options radio-{{direction}}">
        {{#each options}}
        <label class="nac-radio">
          <input type="radio" name="{{name}}" value="{{this.value}}">
          <span class="radio-dot"></span>
          <span class="radio-content">
            <span class="radio-label">{{this.label}}</span>
            {{#if this.description}}<span class="radio-desc">{{this.description}}</span>{{/if}}
          </span>
        </label>
        {{/each}}
      </div>
    </div>
  `,
  style: `
    .nac-radio-group { margin-bottom: 1rem; }
    .radio-options { display: flex; }
    .radio-vertical { flex-direction: column; gap: 0.5rem; }
    .radio-horizontal { gap: 1.5rem; flex-wrap: wrap; }
    .nac-radio {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.5rem 0;
    }
    .nac-radio input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .radio-dot {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border, #374151);
      border-radius: 50%;
      background: var(--bg-panel, #111827);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .nac-radio input:checked + .radio-dot {
      border-color: var(--accent, #3b82f6);
    }
    .nac-radio input:checked + .radio-dot::after {
      content: '';
      width: 10px;
      height: 10px;
      background: var(--accent, #3b82f6);
      border-radius: 50%;
    }
    .radio-content { display: flex; flex-direction: column; }
    .radio-label { font-size: 0.9rem; }
    .radio-desc {
      font-size: 0.75rem;
      color: var(--text-dim, #9ca3af);
      margin-top: 0.25rem;
    }
  `
});

// ============================================
// TOGGLE SWITCH - On/off toggle
// ============================================
NAC.registerComponent('toggle', {
  props: {
    name: '',
    label: '',
    checked: false,
    disabled: false,
    onLabel: 'On',
    offLabel: 'Off'
  },
  template: `
    <label class="nac-toggle {{#if disabled}}disabled{{/if}}">
      <span class="toggle-label">{{label}}</span>
      <div class="toggle-switch">
        <input type="checkbox" name="{{name}}" {{#if checked}}checked{{/if}} {{#if disabled}}disabled{{/if}}>
        <span class="toggle-slider"></span>
      </div>
      <span class="toggle-state">{{offLabel}}</span>
    </label>
  `,
  style: `
    .nac-toggle {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    .nac-toggle.disabled { opacity: 0.6; cursor: not-allowed; }
    .toggle-label { font-size: 0.9rem; }
    .toggle-switch {
      position: relative;
      width: 44px;
      height: 24px;
    }
    .toggle-switch input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 1;
    }
    .toggle-slider {
      position: absolute;
      inset: 0;
      background: var(--border, #374151);
      border-radius: 12px;
      transition: all 0.2s;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      left: 3px;
      top: 3px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.2s;
    }
    .toggle-switch input:checked + .toggle-slider {
      background: var(--green, #22c55e);
    }
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(20px);
    }
    .toggle-state {
      font-size: 0.8rem;
      color: var(--text-dim, #9ca3af);
      min-width: 25px;
    }
  `,
  onMount(props) {
    const input = this.querySelector('input');
    const state = this.querySelector('.toggle-state');
    const updateState = () => {
      state.textContent = input.checked ? props.onLabel : props.offLabel;
    };
    input.addEventListener('change', updateState);
    updateState();
  }
});

// ============================================
// BUTTON - Styled button
// ============================================
NAC.registerComponent('button', {
  props: {
    label: 'Button',
    type: 'button', // button, submit, reset
    variant: 'primary', // primary, secondary, danger, ghost
    size: 'medium', // small, medium, large
    icon: null,
    iconPosition: 'left', // left, right
    disabled: false,
    loading: false,
    fullWidth: false
  },
  template: `
    <button type="{{type}}" class="nac-button nac-btn-{{variant}} nac-btn-{{size}} {{#if fullWidth}}full-width{{/if}} {{#if loading}}loading{{/if}}"
            {{#if disabled}}disabled{{/if}}>
      {{#if loading}}<span class="btn-spinner"></span>{{/if}}
      {{#if icon}}<span class="btn-icon icon-{{iconPosition}}">{{icon}}</span>{{/if}}
      <span class="btn-label">{{label}}</span>
    </button>
  `,
  style: `
    .nac-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.6rem 1.25rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      border: none;
    }
    .nac-button:disabled { opacity: 0.6; cursor: not-allowed; }
    .nac-button.loading { pointer-events: none; }
    .nac-button.full-width { width: 100%; }

    .nac-btn-primary {
      background: var(--accent, #3b82f6);
      color: #fff;
    }
    .nac-btn-primary:hover { opacity: 0.9; }

    .nac-btn-secondary {
      background: var(--bg-surface, #1f2937);
      border: 1px solid var(--border, #374151);
      color: var(--text, #e5e7eb);
    }
    .nac-btn-secondary:hover { background: var(--bg-panel, #111827); }

    .nac-btn-danger {
      background: var(--red, #ef4444);
      color: #fff;
    }
    .nac-btn-danger:hover { opacity: 0.9; }

    .nac-btn-ghost {
      background: transparent;
      color: var(--accent, #3b82f6);
    }
    .nac-btn-ghost:hover { background: rgba(59, 130, 246, 0.1); }

    .nac-btn-small { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
    .nac-btn-large { padding: 0.8rem 1.5rem; font-size: 1rem; }

    .btn-icon.icon-right { order: 1; }
    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `
});

// ============================================
// DATE PICKER - Date input
// ============================================
NAC.registerComponent('date-input', {
  props: {
    name: '',
    label: '',
    value: '',
    min: null,
    max: null,
    required: false
  },
  template: `
    <div class="nac-input-group">
      {{#if label}}<label class="nac-input-label">{{label}}{{#if required}}<span class="required">*</span>{{/if}}</label>{{/if}}
      <input type="date" name="{{name}}" value="{{value}}" class="nac-text-input"
             {{#if min}}min="{{min}}"{{/if}} {{#if max}}max="{{max}}"{{/if}} {{#if required}}required{{/if}}>
    </div>
  `,
  style: `
    input[type="date"].nac-text-input {
      cursor: pointer;
    }
    input[type="date"].nac-text-input::-webkit-calendar-picker-indicator {
      filter: invert(0.8);
      cursor: pointer;
    }
  `
});

// ============================================
// SEARCH INPUT - Search with icon
// ============================================
NAC.registerComponent('search-input', {
  props: {
    name: 'search',
    placeholder: 'Search...',
    value: '',
    onSearch: null
  },
  template: `
    <div class="nac-search-wrapper">
      <span class="search-icon">🔍</span>
      <input type="search" name="{{name}}" placeholder="{{placeholder}}" value="{{value}}" class="nac-search-input">
      <button type="button" class="search-clear" style="display:none">✕</button>
    </div>
  `,
  style: `
    .nac-search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .nac-search-wrapper .search-icon {
      position: absolute;
      left: 0.75rem;
      font-size: 0.9rem;
      opacity: 0.5;
    }
    .nac-search-input {
      width: 100%;
      padding: 0.6rem 2.5rem 0.6rem 2.5rem;
      background: var(--bg-panel, #111827);
      border: 1px solid var(--border, #374151);
      border-radius: 6px;
      color: var(--text, #e5e7eb);
      font-size: 0.9rem;
    }
    .nac-search-input:focus {
      outline: none;
      border-color: var(--accent, #3b82f6);
    }
    .search-clear {
      position: absolute;
      right: 0.5rem;
      background: transparent;
      border: none;
      color: var(--text-dim, #9ca3af);
      cursor: pointer;
      padding: 0.25rem;
      font-size: 0.8rem;
    }
    .search-clear:hover { color: var(--text, #e5e7eb); }
  `,
  onMount(props) {
    const input = this.querySelector('input');
    const clear = this.querySelector('.search-clear');

    input.addEventListener('input', () => {
      clear.style.display = input.value ? 'block' : 'none';
    });

    clear.addEventListener('click', () => {
      input.value = '';
      clear.style.display = 'none';
      input.focus();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && props.onSearch) {
        props.onSearch(input.value);
      }
    });
  }
});

console.log('NAC Form Components loaded');
