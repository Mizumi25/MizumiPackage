/**
 * Mizumi Runtime Helpers 🌊
 * Auto-generated - do not edit directly
 */

/**
 * Combine Mizumi class names
 * Filters falsy values automatically
 * @example
 * mz('card', isActive && 'bg-primary', 'hover-lift')
 */
function mz(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Animate function - returns a unique class + registers custom GSAP config
 * @example
 * <div class="${animate('fade-in', { duration: 500 })}">
 */
function animate(animationName, options = {}) {
  const uniqueId = 'mz-anim-' + Math.random().toString(36).slice(2, 7);

  // Register custom config to be picked up by runtime
  window.__mizumiCustomAnims = window.__mizumiCustomAnims || {};
  window.__mizumiCustomAnims[uniqueId] = {
    basedOn: animationName,
    ...options
  };

  return animationName + ' ' + uniqueId;
}

/**
 * Define Mizumi config with type hints (JS helper)
 */
function defineConfig(config) {
  return config;
}

// Export for different module systems

  exports { mz, animate, defineConfig };
if (typeof window !== 'undefined') {
  window.mz         = mz;
  window.animate    = animate;
  window.defineConfig = defineConfig;
}
