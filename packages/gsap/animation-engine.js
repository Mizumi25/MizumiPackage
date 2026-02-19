export class AnimationEngine {
  constructor(animationConfigs = {}, tokens = {}) {
    this.configs = animationConfigs;
    this.tokens = tokens;
  }

  resolveToken(value) {
    if (typeof value !== 'string' || !value.startsWith('tokens.')) return value;
    const path = value.replace('tokens.', '').split('.');
    let current = this.tokens;
    for (const key of path) {
      if (current?.[key] === undefined) return value;
      current = current[key];
    }
    return typeof current === 'number' ? current / 1000 : current;
  }

  resolveConfig(config) {
    if (typeof config !== 'object' || config === null) return config;
    const resolved = {};
    for (const [key, value] of Object.entries(config)) {
      resolved[key] = typeof value === 'object' && value !== null
        ? this.resolveConfig(value)
        : this.resolveToken(value);
    }
    return resolved;
  }

  generateRuntimeScript() {
    return `
(function() {
  const CONFIGS = ${JSON.stringify(this.configs, null, 2)};
  const TOKENS  = ${JSON.stringify(this.tokens, null, 2)};

  const EASE_MAP = {
    smooth: 'power2.out',
    bouncy: 'elastic.out(1, 0.5)',
    sharp:  'power4.inOut',
    back:   'back.out(1.7)',
    linear: 'none'
  };

  const DUR_MAP = { fast:0.15, normal:0.3, slow:0.5, slower:0.8 };

  function resolveToken(value) {
    if (typeof value !== 'string' || !value.startsWith('tokens.')) return value;
    const path = value.replace('tokens.', '').split('.');
    let cur = TOKENS;
    for (const k of path) {
      if (cur?.[k] === undefined) return value;
      cur = cur[k];
    }
    return typeof cur === 'number' ? cur / 1000 : cur;
  }

  function resolveConfig(config) {
    if (typeof config !== 'object' || config === null) return config;
    const out = {};
    for (const [k, v] of Object.entries(config)) {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        out[k] = resolveConfig(v);
      } else {
        let resolved = resolveToken(v);
        // Convert raw ms numbers to seconds for GSAP
        if ((k === 'duration' || k === 'delay') && typeof resolved === 'number' && resolved > 10) {
          resolved = resolved / 1000;
        }
        out[k] = resolved;
      }
    }
    return out;
  }

  function getMods(el) {
    const mods = {};
    for (const cls of el.classList) {
      const dn = cls.match(/^duration-(\\d+)$/);
      if (dn) { mods.duration = +dn[1] / 1000; continue; }
      const dname = cls.match(/^duration-(fast|normal|slow|slower)$/);
      if (dname) { mods.duration = DUR_MAP[dname[1]]; continue; }
      const dl = cls.match(/^delay-(\\d+)$/);
      if (dl) { mods.delay = +dl[1] / 1000; continue; }
      const ease = cls.match(/^ease-(.+)$/);
      if (ease) { mods.ease = EASE_MAP[ease[1]] || ease[1]; continue; }
    }
    return mods;
  }

  function getDataOverrides(el) {
    const d = el.dataset, o = {};
    if (d.gsapDuration) o.duration = +d.gsapDuration / 1000;
    if (d.gsapDelay)    o.delay    = +d.gsapDelay / 1000;
    if (d.gsapEase)     o.ease     = d.gsapEase;
    if (d.gsapY)        o.y        = +d.gsapY;
    if (d.gsapX)        o.x        = +d.gsapX;
    if (d.gsapScale)    o.scale    = +d.gsapScale;
    if (d.gsapOpacity)  o.opacity  = +d.gsapOpacity;
    return o;
  }

  function initEntrance(el, config) {
    const r    = resolveConfig(config);
    const mods = getMods(el);
    const data = getDataOverrides(el);
    const hasScroll = el.classList.contains('scroll-trigger');

    const toConfig = {
      ...r.to,
      duration : data.duration || mods.duration || r.duration || 0.3,
      delay    : data.delay    || mods.delay    || r.delay    || 0,
      ease     : data.ease     || mods.ease     || r.ease     || 'power2.out',
      ...data
    };

    if (hasScroll && typeof ScrollTrigger !== 'undefined') {
      toConfig.scrollTrigger = {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      };
    }

    const from = r.from || {};
    Object.keys(from).length
      ? gsap.fromTo(el, from, toConfig)
      : gsap.to(el, toConfig);
  }

  function initHover(el, config) {
    const r = resolveConfig(config);
    if (!r.hover) return;
    const hc = { ...r.hover, duration: r.hover.duration || 0.15 };
    const reset = {};
    for (const p of Object.keys(hc)) {
      if (['duration','ease','boxShadow'].includes(p)) continue;
      reset[p] = p === 'scale' ? 1 : 0;
    }
    el.addEventListener('mouseenter', () => gsap.to(el, hc));
    el.addEventListener('mouseleave', () => gsap.to(el, { ...reset, duration: hc.duration, ease: 'power2.inOut' }));
  }

  function initActive(el, config) {
    const r = resolveConfig(config);
    if (!r.active) return;
    const ac = { ...r.active, duration: r.active.duration || 0.1 };
    el.addEventListener('mousedown', () => gsap.to(el, ac));
    el.addEventListener('mouseup',   () => gsap.to(el, { scale:1, duration: ac.duration, ease: 'back.out(2)' }));
  }

  function initStagger(el, config) {
    const r = resolveConfig(config);
    const children = Array.from(el.children);
    if (!children.length) return;
    const hasScroll = el.classList.contains('scroll-trigger');
    const gc = {
      ...r.to,
      duration : r.duration || 0.3,
      ease     : r.ease     || 'power2.out',
      stagger  : r.stagger  || 0.1
    };
    if (hasScroll && typeof ScrollTrigger !== 'undefined') {
      gc.scrollTrigger = { trigger: el, start: 'top 80%' };
    }
    gsap.fromTo(children, r.from || {}, gc);
  }

  function initScrollOnly(el, config) {
    const r = resolveConfig(config);
    if (!r.scrollTrigger) return;
    const sc = { ...r.scrollTrigger };
    if (sc.trigger === 'self') sc.trigger = el;
    gsap.to(el, { ...r, scrollTrigger: sc });
  }

  function init() {
    console.log('🌊 Mizumi Animations Initializing...');
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    for (const [name, config] of Object.entries(CONFIGS)) {
      const els = document.querySelectorAll('.' + CSS.escape(name));
      els.forEach(el => {
        if      (config.hover)                      initHover(el, config);
        else if (config.active)                     initActive(el, config);
        else if (config.targets === 'children')     initStagger(el, config);
        else if (config.scrollTrigger && !config.from && !config.to) initScrollOnly(el, config);
        else if (config.from || config.to)          initEntrance(el, config);
      });
    }
    console.log('✅ Mizumi Ready!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      typeof gsap !== 'undefined' ? init() : setTimeout(init, 100);
    });
  } else {
    typeof gsap !== 'undefined' ? init() : setTimeout(init, 100);
  }

  window.Mizumi = { init, version: '0.1.0' };
})();
`;
  }
}

