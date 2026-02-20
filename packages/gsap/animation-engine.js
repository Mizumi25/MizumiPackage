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

  // ============================================================
  // PARSER — reads "base-name{key:val,key:val}" or "base{target}"
  // ============================================================
  function parseMizumiClass(className) {
    const match = className.match(/^([^{]+)(?:\\{([^}]*)\\})?$/);
    if (!match) return null;

    const base  = match[1];
    const inner = match[2] || null;

    if (!inner) return { base, props: {}, target: null, value: null };

    // Targeting — starts with >, +, ~, or .
    if (/^[>+~.]/.test(inner)) {
      return { base, props: {}, target: inner, value: null };
    }

    // Single token value — pad{lg}, pad{20px}
    if (!inner.includes(':')) {
      return { base, props: {}, target: null, value: inner };
    }

    // Key:value props — animate-fade-in{duration:2,ease:bouncy,start:top_80%}
    const props = {};
    for (const pair of inner.split(',')) {
      const [k, v] = pair.split(':');
      if (!k) continue;
      const key = k.trim();
      // Underscores → spaces for scroll positions
      let val = v ? v.trim().replace(/_/g, ' ') : true;
      // Cast booleans and numbers
      if (val === 'true')  val = true;
      if (val === 'false') val = false;
      if (!isNaN(val) && val !== '') val = Number(val);
      props[key] = val;
    }

    return { base, props, target: null, value: null };
  }

  // ============================================================
  // TARGET RESOLVER — finds the element to animate
  // ============================================================
  function resolveTarget(el, targetExpr) {
    if (!targetExpr) return el;
    if (targetExpr === '.self') return el;

    // Child selector: >.className or >tagname
    if (targetExpr.startsWith('>')) {
      const sel = targetExpr.slice(1).trim();
      return el.querySelector(sel);
    }

    // Next sibling: +.className
    if (targetExpr.startsWith('+')) {
      const sel = targetExpr.slice(1).trim();
      let sib = el.nextElementSibling;
      while (sib) {
        if (sib.matches(sel)) return sib;
        sib = sib.nextElementSibling;
      }
      return null;
    }

    // General sibling: ~.className
    if (targetExpr.startsWith('~')) {
      const sel = targetExpr.slice(1).trim();
      const parent = el.parentElement;
      if (!parent) return null;
      return parent.querySelector(sel);
    }

    // Same element extra class: .className (scoped to self)
    if (targetExpr.startsWith('.')) {
      return el.matches(targetExpr) ? el : el.querySelector(targetExpr);
    }

    return el;
  }

  // ============================================================
  // PROP VALUE — pad{lg} pad-x{xl} pad{20px}
  // ============================================================
  function applyPropClass(el, base, value) {
    // Check if value is a token key or arbitrary
    const isArbitrary = /^[0-9]/.test(value) || value.includes('px') || value.includes('%') || value.includes('rem');
    const resolved = isArbitrary ? value : 'var(--spacing-' + value + ')';

    const propMap = {
      'pad':     (v) => el.style.padding = v,
      'pad-x':   (v) => { el.style.paddingLeft = v; el.style.paddingRight = v; },
      'pad-y':   (v) => { el.style.paddingTop = v; el.style.paddingBottom = v; },
      'mar':     (v) => el.style.margin = v,
      'mar-x':   (v) => { el.style.marginLeft = v; el.style.marginRight = v; },
      'mar-y':   (v) => { el.style.marginTop = v; el.style.marginBottom = v; },
      'gap':     (v) => el.style.gap = v,
      'rounded': (v) => el.style.borderRadius = isArbitrary ? v : 'var(--radius-' + value + ')',
      'shadow':  (v) => el.style.boxShadow = isArbitrary ? v : 'var(--shadow-' + value + ')',
      'text':    (v) => {
        el.style.fontSize   = isArbitrary ? v : 'var(--text-' + value + '-size)';
        el.style.fontWeight = isArbitrary ? '' : 'var(--text-' + value + '-weight)';
        el.style.lineHeight = isArbitrary ? '' : 'var(--text-' + value + '-line)';
      },
      'bg':      (v) => el.style.backgroundColor = isArbitrary ? v : 'var(--color-' + value + ')',
      'color':   (v) => el.style.color = isArbitrary ? v : 'var(--color-' + value + ')',
    };

    const apply = propMap[base];
    if (apply) apply(resolved);
  }

  // ============================================================
  // TOKEN / CONFIG RESOLVERS (unchanged)
  // ============================================================
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

  // ============================================================
  // ANIMATION INITS
  // ============================================================
  function initEntrance(gsap, ScrollTrigger, el, config, props, targetEl) {
    const r    = resolveConfig(config);
    const mods = getMods(el);
    const data = getDataOverrides(el);
    const target = targetEl || el;
    const hasScroll = el.classList.contains('scroll-trigger') || props.start;

    const toConfig = {
      ...r.to,
      duration : props.duration || data.duration || mods.duration || r.duration || 0.3,
      delay    : props.delay    || data.delay    || mods.delay    || r.delay    || 0,
      ease     : EASE_MAP[props.ease] || props.ease || data.ease || mods.ease || r.ease || 'power2.out',
    };

    if (hasScroll && ScrollTrigger) {
      toConfig.scrollTrigger = {
        trigger      : el,
        start        : props.start  || 'top 80%',
        end          : props.end    || null,
        scrub        : props.scrub  || false,
        toggleActions: props.scrub  ? undefined : 'play none none reverse',
        markers      : props.markers || false,
      };
      if (!props.end) delete toConfig.scrollTrigger.end;
    }

    const from = { ...r.from };
    if (props.from) {
      // from:opacity_0_y_100 → { opacity: 0, y: 100 }
      const parts = props.from.split(' ');
      for (let i = 0; i < parts.length; i += 2) {
        const key = parts[i];
        const val = isNaN(parts[i+1]) ? parts[i+1] : Number(parts[i+1]);
        from[key] = val;
      }
    }

    Object.keys(from).length
      ? gsap.fromTo(target, from, toConfig)
      : gsap.to(target, toConfig);
  }

  function initHover(gsap, el, config, props, targetEl) {
    const r = resolveConfig(config);
    if (!r.hover) return;
    const target = targetEl || el;
    const hc = {
      ...r.hover,
      duration: props.duration || r.hover.duration || 0.15,
      ease    : EASE_MAP[props.ease] || r.hover.ease || 'power2.out'
    };
    const reset = {};
    for (const p of Object.keys(hc)) {
      if (['duration','ease','boxShadow'].includes(p)) continue;
      reset[p] = p === 'scale' ? 1 : 0;
    }
    el.addEventListener('mouseenter', () => gsap.to(target, hc));
    el.addEventListener('mouseleave', () => gsap.to(target, { ...reset, duration: hc.duration, ease: 'power2.inOut' }));
  }

  function initActive(gsap, el, config, props, targetEl) {
    const r = resolveConfig(config);
    if (!r.active) return;
    const target = targetEl || el;
    const ac = {
      ...r.active,
      duration: props.duration || r.active.duration || 0.1
    };
    el.addEventListener('mousedown', () => gsap.to(target, ac));
    el.addEventListener('mouseup',   () => gsap.to(target, { scale:1, duration: ac.duration, ease: 'back.out(2)' }));
  }

  function initStagger(gsap, ScrollTrigger, el, config, props) {
    const r = resolveConfig(config);
    const children = Array.from(el.children);
    if (!children.length) return;

    const gc = {
      ...r.to,
      duration : props.duration || r.duration || 0.3,
      ease     : EASE_MAP[props.ease] || r.ease || 'power2.out',
      stagger  : props.stagger  || r.stagger  || 0.1
    };

    if (ScrollTrigger && (el.classList.contains('scroll-trigger') || props.start)) {
      gc.scrollTrigger = {
        trigger: el,
        start  : props.start || 'top 80%',
        markers: props.markers || false,
      };
    }

    gsap.fromTo(children, r.from || { opacity:0, y:20 }, gc);
  }

  // ============================================================
  // SCROLL STORYTELLING
  // scroll-fade-in{start:top_80%,end:center_center,scrub:1}
  // scroll-pin{start:top_top,end:+=500px}
  // scroll-scrub{from:opacity_0_y_100,to:opacity_1_y_0,start:top_bottom,end:center_center}
  // ============================================================
  function initScrollStory(gsap, ScrollTrigger, el, base, props) {
    if (!ScrollTrigger) {
      console.warn('🌊 Mizumi: ScrollTrigger not available for', base);
      return;
    }

    // scroll-pin — pins element while scroll continues
    if (base === 'scroll-pin') {
      ScrollTrigger.create({
        trigger : el,
        start   : props.start   || 'top top',
        end     : props.end     || '+=500px',
        pin     : true,
        markers : props.markers || false,
        scrub   : props.scrub   || false,
      });
      return;
    }

    // scroll-scrub — fully scrub-driven fromTo
    if (base === 'scroll-scrub') {
      const from = {};
      const to   = {};

      // from:opacity_0_y_100 → { opacity:0, y:100 }
      if (props.from) {
        const parts = props.from.split(' ');
        for (let i = 0; i < parts.length; i += 2) {
          from[parts[i]] = isNaN(parts[i+1]) ? parts[i+1] : Number(parts[i+1]);
        }
      }
      if (props.to) {
        const parts = props.to.split(' ');
        for (let i = 0; i < parts.length; i += 2) {
          to[parts[i]] = isNaN(parts[i+1]) ? parts[i+1] : Number(parts[i+1]);
        }
      }

      to.scrollTrigger = {
        trigger: el,
        start  : props.start   || 'top bottom',
        end    : props.end     || 'center center',
        scrub  : props.scrub !== undefined ? props.scrub : 1,
        markers: props.markers || false,
      };

      gsap.fromTo(el, from, to);
      return;
    }

    // scroll-fade-in, scroll-slide-up, scroll-scale-in etc
    // Maps to existing CONFIGS animations but with scroll props
    const animName = base.replace('scroll-', 'animate-');
    const config   = CONFIGS[animName] || CONFIGS[base];

    if (config) {
      initEntrance(gsap, ScrollTrigger, el, config, props, el);
      return;
    }

    // Fallback — generic scroll fade
    gsap.fromTo(el,
      { opacity: 0, y: props.y || 30 },
      {
        opacity : 1,
        y       : 0,
        duration: props.duration || 0.6,
        ease    : EASE_MAP[props.ease] || 'power2.out',
        scrollTrigger: {
          trigger: el,
          start  : props.start   || 'top 80%',
          end    : props.end     || null,
          scrub  : props.scrub   || false,
          markers: props.markers || false,
        }
      }
    );
  }

  // ============================================================
  // MAIN INIT
  // ============================================================
  function run(gsap, ScrollTrigger) {
    console.log('🌊 Mizumi Animations Initializing...');
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // --- Pass 1: Named config animations (existing behavior) ---
    for (const [name, config] of Object.entries(CONFIGS)) {
      const els = document.querySelectorAll('.' + CSS.escape(name));
      els.forEach(el => {
        if      (config.hover)                                        initHover(gsap, el, config, {}, null);
        else if (config.active)                                       initActive(gsap, el, config, {}, null);
        else if (config.targets === 'children')                       initStagger(gsap, ScrollTrigger, el, config, {});
        else if (config.from || config.to)                            initEntrance(gsap, ScrollTrigger, el, config, {}, null);
      });
    }

    // --- Pass 2: Dynamic {prop} classes on every element ---
    const allEls = document.querySelectorAll('[class]');

    allEls.forEach(el => {
      for (const rawClass of el.classList) {
        // Skip if no {} — already handled in pass 1 or is plain utility
        if (!rawClass.includes('{')) continue;

        const parsed = parseMizumiClass(rawClass);
        if (!parsed) continue;

        const { base, props, target, value } = parsed;

        // Prop value classes — pad{lg}, mar-x{xl}, bg{primary}
        if (value !== null) {
          applyPropClass(el, base, value);
          continue;
        }

        // Scroll storytelling — scroll-* prefix
        if (base.startsWith('scroll-')) {
          initScrollStory(gsap, ScrollTrigger, el, base, props);
          continue;
        }

        // Targeting — hover-lift{>.child}
        if (target !== null) {
          const targetEl = resolveTarget(el, target);
          const config   = CONFIGS[base];
          if (!config || !targetEl) continue;

          if      (config.hover)           initHover(gsap, el, config, props, targetEl);
          else if (config.active)          initActive(gsap, el, config, props, targetEl);
          else if (config.from || config.to) initEntrance(gsap, ScrollTrigger, el, config, props, targetEl);
          continue;
        }

        // Named animation with prop overrides — animate-fade-in{duration:2,ease:bouncy}
        const config = CONFIGS[base];
        if (!config) continue;

        if      (config.hover)              initHover(gsap, el, config, props, null);
        else if (config.active)             initActive(gsap, el, config, props, null);
        else if (config.targets==='children') initStagger(gsap, ScrollTrigger, el, config, props);
        else if (config.from || config.to)  initEntrance(gsap, ScrollTrigger, el, config, props, null);
      }
    });

    console.log('✅ Mizumi Ready!');
  }

  function init() {
    if (typeof window.gsap === 'undefined') {
      console.warn('🌊 Mizumi: GSAP not found. Animations will not run.');
      console.warn('  HTML users: add GSAP via CDN script tag');
      console.warn('  React/Vite users: npm install gsap, then set window.gsap = gsap in main.jsx');
      return;
    }

    const gsap          = window.gsap;
    const ScrollTrigger = window.ScrollTrigger || null;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    run(gsap, ScrollTrigger);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Mizumi = { init, version: '0.1.0' };
})();
`;
}
}

