/**
 * NAC Device Detection
 * Detects device type, OS, and adds appropriate classes to body
 */

const Device = {
  info: {},

  detect() {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform?.toLowerCase() || '';

    // OS Detection
    this.info.ios = /iphone|ipad|ipod/.test(ua) || (platform === 'macintel' && navigator.maxTouchPoints > 1);
    this.info.android = /android/.test(ua);
    this.info.windows = /win/.test(platform);
    this.info.mac = /mac/.test(platform) && !this.info.ios;
    this.info.linux = /linux/.test(platform) && !this.info.android;

    // Device type
    const width = window.innerWidth;
    this.info.mobile = width < 640;
    this.info.tablet = width >= 640 && width < 1024;
    this.info.desktop = width >= 1024;

    // Touch capability
    this.info.touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Specific browsers
    this.info.safari = /safari/.test(ua) && !/chrome/.test(ua);
    this.info.chrome = /chrome/.test(ua) && !/edge/.test(ua);
    this.info.firefox = /firefox/.test(ua);
    this.info.edge = /edge|edg/.test(ua);
    this.info.samsung = /samsungbrowser/.test(ua);

    // PWA standalone mode
    this.info.standalone = window.matchMedia('(display-mode: standalone)').matches ||
                           window.navigator.standalone === true;

    // Orientation
    this.info.portrait = window.innerHeight > window.innerWidth;
    this.info.landscape = !this.info.portrait;

    // Screen density
    this.info.retina = window.devicePixelRatio > 1;
    this.info.dpr = window.devicePixelRatio || 1;

    return this.info;
  },

  applyClasses() {
    const body = document.body;
    const classes = [];

    // OS
    if (this.info.ios) classes.push('ios');
    if (this.info.android) classes.push('android');
    if (this.info.windows) classes.push('windows');
    if (this.info.mac) classes.push('mac');

    // Device type
    if (this.info.mobile) classes.push('mobile');
    if (this.info.tablet) classes.push('tablet');
    if (this.info.desktop) classes.push('desktop');

    // Capabilities
    if (this.info.touch) classes.push('touch');
    if (this.info.standalone) classes.push('standalone');
    if (this.info.retina) classes.push('retina');

    // Orientation
    classes.push(this.info.portrait ? 'portrait' : 'landscape');

    // Browser
    if (this.info.safari) classes.push('safari');
    if (this.info.samsung) classes.push('samsung-browser');

    // Apply
    body.classList.add(...classes);

    // Set CSS custom properties
    document.documentElement.style.setProperty('--device-dpr', this.info.dpr);
    document.documentElement.style.setProperty('--viewport-width', window.innerWidth + 'px');
    document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
  },

  onResize() {
    // Update on resize
    const wasMobile = this.info.mobile;
    const wasTablet = this.info.tablet;
    const wasPortrait = this.info.portrait;

    this.detect();

    // Update classes if device type changed
    if (wasMobile !== this.info.mobile || wasTablet !== this.info.tablet) {
      document.body.classList.remove('mobile', 'tablet', 'desktop');
      if (this.info.mobile) document.body.classList.add('mobile');
      if (this.info.tablet) document.body.classList.add('tablet');
      if (this.info.desktop) document.body.classList.add('desktop');
    }

    // Update orientation
    if (wasPortrait !== this.info.portrait) {
      document.body.classList.remove('portrait', 'landscape');
      document.body.classList.add(this.info.portrait ? 'portrait' : 'landscape');
    }

    // Update CSS properties
    document.documentElement.style.setProperty('--viewport-width', window.innerWidth + 'px');
    document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
  },

  init() {
    this.detect();
    this.applyClasses();

    // Listen for resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.onResize(), 100);
    });

    // Listen for orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.onResize(), 100);
    });

    console.log('Device:', this.info);
    return this.info;
  }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => Device.init());

// Export
if (typeof module !== 'undefined') module.exports = Device;
