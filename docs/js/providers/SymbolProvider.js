/**
 * SymbolProvider - SVG Symbol Database for NAC Digital Twin
 * Provides icons for UI, PackML states, row officers, and CV markers
 *
 * Usage:
 *   <script src="js/providers/SymbolProvider.js"></script>
 *   <script>
 *     const symbols = await createSymbolProvider();
 *     document.body.innerHTML += symbols.icon('budget', 24);
 *     document.body.innerHTML += symbols.packml('execute', 48);
 *   </script>
 */

class SymbolProvider {
  constructor() {
    this.loaded = false;
    this.symbolsUrl = 'assets/symbols/symbols.svg';

    // Icon metadata with colors
    this.iconMeta = {
      // UI Screen Icons
      overview: { color: '#3b82f6', emoji: '🏛️' },
      budget: { color: '#f59e0b', emoji: '💰' },
      audit: { color: '#8b5cf6', emoji: '🔍' },
      oee: { color: '#22c55e', emoji: '⚡' },
      vendors: { color: '#06b6d4', emoji: '📋' },
      grants: { color: '#10b981', emoji: '💵' },
      comparison: { color: '#6366f1', emoji: '📊' },
      tax: { color: '#ec4899', emoji: '🧮' },
      capital: { color: '#f97316', emoji: '🏗️' },
      pension: { color: '#14b8a6', emoji: '🏦' },
      emergency: { color: '#ef4444', emoji: '🚨' },
      issues: { color: '#64748b', emoji: '📝' },
      economic: { color: '#84cc16', emoji: '📈' },
      org: { color: '#a855f7', emoji: '👥' },
      transform: { color: '#22c55e', emoji: '🌱' },
      about: { color: '#6b7280', emoji: '👤' }
    };

    // PackML state colors (from packml-states.json)
    this.packmlColors = {
      stopped: '#6c757d',
      idle: '#17a2b8',
      starting: '#ffc107',
      execute: '#28a745',
      completing: '#20c997',
      complete: '#007bff',
      held: '#e83e8c',
      suspended: '#6f42c1',
      stopping: '#dc3545',
      aborting: '#dc3545',
      aborted: '#343a40',
      resetting: '#ffc107',
      clearing: '#6c757d',
      holding: '#fd7e14',
      unholding: '#fd7e14',
      suspending: '#6f42c1',
      unsuspending: '#6f42c1'
    };

    // Row officer colors
    this.officerColors = {
      sheriff: '#3498db',
      treasurer: '#27ae60',
      controller: '#9b59b6',
      coroner: '#e74c3c',
      da: '#f39c12',
      recorder: '#1abc9c',
      register: '#3498db',
      clerk: '#e67e22',
      prothonotary: '#2ecc71'
    };
  }

  /**
   * Load symbols SVG into document
   */
  async init() {
    if (this.loaded) return this;

    try {
      const response = await fetch(this.symbolsUrl);
      const svgText = await response.text();

      // Inject into document
      const container = document.createElement('div');
      container.innerHTML = svgText;
      container.style.display = 'none';
      document.body.insertBefore(container, document.body.firstChild);

      this.loaded = true;
    } catch (e) {
      console.warn('SymbolProvider: Could not load symbols.svg, using fallback emojis');
    }

    return this;
  }

  /**
   * Get UI icon SVG
   */
  icon(name, size = 24, color = null) {
    const meta = this.iconMeta[name];
    const fillColor = color || meta?.color || 'currentColor';

    if (!this.loaded) {
      return `<span class="symbol-fallback" style="font-size:${size}px">${meta?.emoji || '●'}</span>`;
    }

    return `<svg width="${size}" height="${size}" class="symbol symbol-${name}" style="color:${fillColor}">
      <use href="#icon-${name}"/>
    </svg>`;
  }

  /**
   * Get PackML state icon
   */
  packml(state, size = 48) {
    const stateLower = state.toLowerCase();
    const color = this.packmlColors[stateLower] || '#6c757d';

    if (!this.loaded) {
      return `<span class="packml-fallback" style="display:inline-block;width:${size}px;height:${size}px;background:${color};border-radius:4px"></span>`;
    }

    return `<svg width="${size}" height="${size}" class="packml-state packml-${stateLower}">
      <use href="#packml-${stateLower}"/>
    </svg>`;
  }

  /**
   * Get row officer icon
   */
  officer(name, size = 32, color = null) {
    const officerName = name.toLowerCase().replace(/[^a-z]/g, '');
    const fillColor = color || this.officerColors[officerName] || 'currentColor';

    if (!this.loaded) {
      return `<span class="officer-fallback" style="font-size:${size}px">👤</span>`;
    }

    return `<svg width="${size}" height="${size}" class="symbol officer-${officerName}" style="color:${fillColor}">
      <use href="#officer-${officerName}"/>
    </svg>`;
  }

  /**
   * Get status icon
   */
  status(type, size = 24) {
    const validTypes = ['ok', 'warning', 'error', 'info'];
    const statusType = validTypes.includes(type) ? type : 'info';

    if (!this.loaded) {
      const emojis = { ok: '✓', warning: '⚠', error: '✗', info: 'ℹ' };
      return `<span class="status-fallback">${emojis[statusType]}</span>`;
    }

    return `<svg width="${size}" height="${size}" class="status status-${statusType}">
      <use href="#status-${statusType}"/>
    </svg>`;
  }

  /**
   * Get all PackML states for a state machine display
   */
  getPackmlStates() {
    return Object.entries(this.packmlColors).map(([state, color]) => ({
      id: state,
      color,
      icon: this.packml(state, 32)
    }));
  }

  /**
   * Replace emoji icons in element with SVG
   */
  replaceEmojis(element) {
    if (!this.loaded) return;

    for (const [name, meta] of Object.entries(this.iconMeta)) {
      if (!meta.emoji) continue;

      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const nodesToReplace = [];
      while (walker.nextNode()) {
        if (walker.currentNode.textContent.includes(meta.emoji)) {
          nodesToReplace.push(walker.currentNode);
        }
      }

      nodesToReplace.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(
          meta.emoji,
          this.icon(name, 20)
        );
        node.parentNode.replaceChild(span, node);
      });
    }
  }

  /**
   * Generate Data Matrix barcode SVG for CV tracking
   */
  dataMatrix(data, size = 64) {
    // Simple data matrix generator (8x8 for short codes)
    const bits = this.stringToBits(data);
    const grid = 8;
    const cellSize = size / grid;

    let svg = `<svg width="${size}" height="${size}" class="datamatrix" viewBox="0 0 ${size} ${size}">`;

    // Finder pattern (L-shape)
    svg += `<rect x="0" y="0" width="${size}" height="${cellSize}" fill="black"/>`;
    svg += `<rect x="0" y="0" width="${cellSize}" height="${size}" fill="black"/>`;

    // Timing pattern (alternating on right and top)
    for (let i = 0; i < grid; i++) {
      if (i % 2 === 0) {
        svg += `<rect x="${size - cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        svg += `<rect x="${i * cellSize}" y="${size - cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }

    // Data cells (6x6 inner grid)
    for (let y = 1; y < grid - 1; y++) {
      for (let x = 1; x < grid - 1; x++) {
        const bitIndex = (y - 1) * (grid - 2) + (x - 1);
        if (bits[bitIndex % bits.length]) {
          svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Convert string to bit array for barcode
   */
  stringToBits(str) {
    const bits = [];
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      for (let j = 7; j >= 0; j--) {
        bits.push((charCode >> j) & 1);
      }
    }
    return bits;
  }

  /**
   * Generate QR-like code for work item tracking
   */
  workItemCode(workItemId, state, size = 80) {
    const stateColor = this.packmlColors[state.toLowerCase()] || '#000';

    return `<svg width="${size}" height="${size}" class="work-item-code" viewBox="0 0 100 100">
      <!-- Border with state color -->
      <rect x="2" y="2" width="96" height="96" fill="white" stroke="${stateColor}" stroke-width="4"/>

      <!-- Corner markers -->
      <rect x="8" y="8" width="20" height="20" fill="black"/>
      <rect x="12" y="12" width="12" height="12" fill="white"/>
      <rect x="14" y="14" width="8" height="8" fill="black"/>

      <rect x="72" y="8" width="20" height="20" fill="black"/>
      <rect x="76" y="12" width="12" height="12" fill="white"/>
      <rect x="78" y="14" width="8" height="8" fill="black"/>

      <rect x="8" y="72" width="20" height="20" fill="black"/>
      <rect x="12" y="76" width="12" height="12" fill="white"/>
      <rect x="14" y="78" width="8" height="8" fill="black"/>

      <!-- State indicator -->
      <rect x="72" y="72" width="20" height="20" fill="${stateColor}"/>

      <!-- ID text -->
      <text x="50" y="55" text-anchor="middle" font-family="monospace" font-size="12" fill="black">${workItemId}</text>

      <!-- Data pattern (simplified) -->
      ${this.generateDataPattern(workItemId, 36, 36, 28)}
    </svg>`;
  }

  generateDataPattern(id, x, y, size) {
    const bits = this.stringToBits(id);
    const grid = 4;
    const cellSize = size / grid;
    let pattern = '';

    for (let row = 0; row < grid; row++) {
      for (let col = 0; col < grid; col++) {
        const bitIndex = row * grid + col;
        if (bits[bitIndex % bits.length]) {
          pattern += `<rect x="${x + col * cellSize}" y="${y + row * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }
    return pattern;
  }
}

/**
 * Factory function
 */
async function createSymbolProvider() {
  const provider = new SymbolProvider();
  await provider.init();
  return provider;
}

// Auto-init on DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    window.symbolProvider = await createSymbolProvider();
  });
}

// Export
if (typeof module !== 'undefined') {
  module.exports = { SymbolProvider, createSymbolProvider };
}
