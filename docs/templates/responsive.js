/**
 * NAC Responsive Helper
 * Drop this into any page to add responsive behavior
 *
 * Usage: <script src="templates/responsive.js"></script>
 */

(function() {
  'use strict';

  // Inject viewport meta if missing
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    document.head.prepend(meta);
  }

  // Inject theme-color meta
  if (!document.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#0a0f1a';
    document.head.appendChild(meta);
  }

  // Inject base CSS if not already loaded
  if (!document.querySelector('link[href*="base.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = getBasePath() + 'templates/base.css';
    document.head.prepend(link);
  }

  // Get base path relative to current page
  function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/views/')) return '../';
    if (path.includes('/templates/')) return '../';
    return '';
  }

  // Add responsive utilities when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Add mobile menu to headers that don't have one
    addMobileMenu();

    // Add bottom navigation if not present
    addBottomNav();

    // Make tables responsive
    wrapTables();

    // Add touch-friendly behaviors
    addTouchBehaviors();

    // Handle orientation changes
    handleOrientation();

    console.log('NAC Responsive loaded');
  });

  /**
   * Add mobile hamburger menu if page has sidebar nav
   */
  function addMobileMenu() {
    const sidebar = document.querySelector('.dock-west, .sidebar, [class*="sidebar"]');
    const header = document.querySelector('.dock-north, .page-header, .header, header');

    if (sidebar && header && !document.querySelector('.menu-toggle')) {
      // Create mobile menu button
      const menuBtn = document.createElement('button');
      menuBtn.className = 'menu-toggle';
      menuBtn.innerHTML = '☰';
      menuBtn.setAttribute('aria-label', 'Toggle menu');
      menuBtn.onclick = function() {
        sidebar.classList.toggle('mobile-open');
        document.body.classList.toggle('sidebar-open');
      };

      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      overlay.onclick = function() {
        sidebar.classList.remove('mobile-open');
        document.body.classList.remove('sidebar-open');
      };
      document.body.appendChild(overlay);

      // Insert menu button at start of header
      const headerContent = header.firstElementChild || header;
      headerContent.insertBefore(menuBtn, headerContent.firstChild);

      // Add mobile styles for sidebar
      injectMobileStyles();
    }
  }

  /**
   * Add bottom navigation for mobile
   */
  function addBottomNav() {
    // Don't add if already exists or on SCADA main page
    if (document.querySelector('.bottom-nav') ||
        window.location.pathname.includes('scada.html')) {
      return;
    }

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.innerHTML = `
      <a href="${getBasePath()}scada.html" class="bottom-nav-item">
        <span class="icon">🏠</span>
        <span>Home</span>
      </a>
      <a href="${getBasePath()}checkbook.html" class="bottom-nav-item">
        <span class="icon">💰</span>
        <span>Spending</span>
      </a>
      <a href="${getBasePath()}academy.html" class="bottom-nav-item">
        <span class="icon">🎓</span>
        <span>Learn</span>
      </a>
      <a href="${getBasePath()}tickets.html" class="bottom-nav-item">
        <span class="icon">🎫</span>
        <span>Report</span>
      </a>
    `;

    document.body.appendChild(nav);

    // Highlight current page
    const currentPage = window.location.pathname.split('/').pop();
    nav.querySelectorAll('a').forEach(link => {
      if (link.href.includes(currentPage)) {
        link.classList.add('active');
      }
    });

    // Add padding to body for bottom nav
    document.body.style.paddingBottom = '70px';
  }

  /**
   * Wrap tables for horizontal scroll on mobile
   */
  function wrapTables() {
    document.querySelectorAll('table:not(.no-responsive)').forEach(table => {
      if (!table.parentElement.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }

  /**
   * Add touch-friendly behaviors
   */
  function addTouchBehaviors() {
    // Add active states for touch
    document.querySelectorAll('button, .btn, a, .nav-item').forEach(el => {
      el.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });

      el.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });

    // Prevent double-tap zoom on buttons
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        if (e.target.matches('button, .btn, a')) {
          e.preventDefault();
        }
      }
      lastTouchEnd = now;
    }, false);
  }

  /**
   * Handle orientation changes
   */
  function handleOrientation() {
    function onOrientationChange() {
      // Close sidebar on orientation change
      const sidebar = document.querySelector('.mobile-open');
      if (sidebar) {
        sidebar.classList.remove('mobile-open');
        document.body.classList.remove('sidebar-open');
      }

      // Update viewport height for iOS
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }

    window.addEventListener('orientationchange', onOrientationChange);
    window.addEventListener('resize', debounce(onOrientationChange, 100));
    onOrientationChange();
  }

  /**
   * Inject mobile-specific styles
   */
  function injectMobileStyles() {
    if (document.getElementById('nac-mobile-styles')) return;

    const style = document.createElement('style');
    style.id = 'nac-mobile-styles';
    style.textContent = `
      /* Mobile menu toggle */
      .menu-toggle {
        display: none;
        width: 44px;
        height: 44px;
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-right: 0.5rem;
      }

      @media (max-width: 1023px) {
        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Sidebar as mobile drawer */
        .dock-west, .sidebar, [class*="sidebar"] {
          position: fixed !important;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          max-width: 85vw;
          z-index: 200;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .dock-west.mobile-open,
        .sidebar.mobile-open,
        [class*="sidebar"].mobile-open {
          transform: translateX(0);
        }

        /* Overlay */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 150;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }

        body.sidebar-open .mobile-overlay {
          opacity: 1;
          visibility: visible;
        }

        body.sidebar-open {
          overflow: hidden;
        }

        /* Adjust main content */
        .dock-center, .main-content {
          margin-left: 0 !important;
          width: 100% !important;
        }

        /* Hide east dock on mobile */
        .dock-east {
          display: none !important;
        }
      }

      /* Touch active state */
      .touch-active {
        opacity: 0.7 !important;
      }

      /* Better tap targets */
      @media (max-width: 768px) {
        .nav-item, .btn, button, a {
          min-height: 44px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Debounce helper
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Expose API
  window.NACResponsive = {
    addMobileMenu,
    addBottomNav,
    wrapTables,
    getBasePath
  };

})();
