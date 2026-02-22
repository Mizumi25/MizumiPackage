// packages/gsap/animation-engine.js

export class AnimationEngine {
  constructor(animationConfigs = {}, tokens = {}) {
    this.configs = animationConfigs
    this.tokens  = tokens
  }

  resolveToken(value) {
    if (typeof value !== 'string' || !value.startsWith('tokens.')) return value
    const path = value.replace('tokens.', '').split('.')
    let current = this.tokens
    for (const key of path) {
      if (current?.[key] === undefined) return value
      current = current[key]
    }
    return typeof current === 'number' ? current / 1000 : current
  }

  resolveConfig(config) {
    if (typeof config !== 'object' || config === null) return config
    const resolved = {}
    for (const [key, value] of Object.entries(config)) {
      resolved[key] = typeof value === 'object' && value !== null
        ? this.resolveConfig(value)
        : this.resolveToken(value)
    }
    return resolved
  }

  generateRuntimeScript() {
    return `
(function() {
  const CONFIGS = ${JSON.stringify(this.configs, null, 2)};
  const TOKENS  = ${JSON.stringify(this.tokens,  null, 2)};

  const EASE_MAP = {
    smooth: 'power2.out',
    bouncy: 'elastic.out(1, 0.5)',
    sharp:  'power4.inOut',
    back:   'back.out(1.7)',
    linear: 'none'
  };

  const DUR_MAP = { fast: 0.15, normal: 0.3, slow: 0.5, slower: 0.8 };

  // ============================================================
  // ARBITRARY VALUE DETECTION
  // Decides if a value is a raw CSS value or a token name
  // ============================================================
  function isRawValue(val) {
    if (typeof val !== 'string') return false
    return (
      /^-?[0-9]/.test(val)        ||  // starts with digit or minus: 20px, -8px, 1.5
      val.includes('px')          ||  // pixel values
      val.includes('rem')         ||  // rem values
      val.includes('em')          ||  // em values
      val.includes('%')           ||  // percentages
      val.includes('vw')          ||  // viewport
      val.includes('vh')          ||
      val.includes('vmin')        ||
      val.includes('vmax')        ||
      val.includes('calc(')       ||  // css functions
      val.includes('clamp(')      ||
      val.includes('min(')        ||
      val.includes('max(')        ||
      val.includes('var(')        ||  // already a css var
      val.includes('#')           ||  // hex color
      val.includes('rgb')         ||  // rgb color
      val.includes('hsl')         ||  // hsl color
      val === 'auto'              ||
      val === 'none'              ||
      val === 'inherit'           ||
      val === 'initial'
    )
  }

  // Resolve a token name to a CSS var, or pass raw values through directly
  function tok(value, category) {
    if (isRawValue(value)) return value.replace(/_/g, ' ')  // ← add this
    return 'var(--' + category + '-' + value + ')'
  }

  // ============================================================
  // PARSER — reads "base-name{key:val,key:val}" or "base{target}"
  // capability:token{prop:val,prop:val}
  // ============================================================
  function parseMizumiClass(className) {
    const match = className.match(/^([^{]+)(?:\\{([^}]*)\\})?$/)
    if (!match) return null

    const base  = match[1]
    const inner = match[2] || null

    if (!inner) return { base, props: {}, target: null, value: null }

    // Targeting — starts with >, +, ~, or .
    if (/^[>+~.]/.test(inner)) {
      return { base, props: {}, target: inner, value: null }
    }

    // Single token/raw value — pad:md{lg} or canvas-w{640px}
    if (!inner.includes(':')) {
      return { base, props: {}, target: null, value: inner }
    }

    // Key:value props — animate-fade-in{duration:2,ease:bouncy,start:top_80%}
    const props = {}
    for (const pair of inner.split(',')) {
      const colonIdx = pair.indexOf(':')
      if (colonIdx === -1) continue
      const key = pair.slice(0, colonIdx).trim()
      let   val = pair.slice(colonIdx + 1).trim().replace(/_/g, ' ')
      if (val === 'true')  val = true
      if (val === 'false') val = false
      if (val !== '' && val !== true && val !== false && !isNaN(val)) val = Number(val)
      props[key] = val
    }

    return { base, props, target: null, value: null }
  }

  // ============================================================
  // TARGET RESOLVER
  // hover-lift{>.card-img}   → child
  // hover-lift{+span}        → next sibling
  // hover-lift{~.tooltip}    → general sibling
  // hover-lift{.self}        → self
  // hover-lift{children}     → all direct children (array)
  // ============================================================
  function resolveTarget(el, targetExpr) {
    if (!targetExpr) return el
    if (targetExpr === '.self' || targetExpr === 'self') return el

    // All direct children
    if (targetExpr === 'children') return Array.from(el.children)

    // Child selector: >.className or >tagname
    if (targetExpr.startsWith('>')) {
      const sel = targetExpr.slice(1).trim()
      return el.querySelector(sel)
    }

    // Next sibling: +.className or +tagname
    if (targetExpr.startsWith('+')) {
      const sel = targetExpr.slice(1).trim()
      let sib = el.nextElementSibling
      while (sib) {
        if (!sel || sib.matches(sel)) return sib
        sib = sib.nextElementSibling
      }
      return null
    }

    // General sibling: ~.className
    if (targetExpr.startsWith('~')) {
      const sel    = targetExpr.slice(1).trim()
      const parent = el.parentElement
      if (!parent) return null
      return parent.querySelector(sel)
    }

    // Scoped to self: .className
    if (targetExpr.startsWith('.')) {
      return el.matches(targetExpr) ? el : el.querySelector(targetExpr)
    }

    return el
  }

  // ============================================================
  // PROP CLASS APPLY
  // Full Mizumi colon vocabulary — both token names and raw values
  //
  // Usage in className:
  //   pad{md}           → padding: var(--spacing-md)
  //   pad{20px}         → padding: 20px
  //   canvas-w{640px}   → width: 640px
  //   canvas-w{full}    → width: 100%
  //   paint{primary}    → background-color: var(--color-primary)
  //   paint{#ff0000}    → background-color: #ff0000
  //   ink{neutral-500}  → color: var(--color-neutral-500)
  //   curve{lg}         → border-radius: var(--radius-lg)
  //   curve{50%}        → border-radius: 50%
  //   cast{md}          → box-shadow: var(--shadow-md)
  //   type-size{3rem}   → font-size: 3rem
  //   layer{10}         → z-index: 10
  //   canvas-fade{0.5}  → opacity: 0.5
  // ============================================================
  function applyPropClass(el, base, value) {

    // Special static values
    const STATIC_VALUES = {
      'full':        '100%',
      'screen':      '100vw',
      'screen-h':    '100vh',
      'auto':        'auto',
      'none':        'none',
      'fit':         'fit-content',
      'max-content': 'max-content',
      'min-content': 'min-content',
    }

    const staticVal = STATIC_VALUES[value]

    // Helper: resolve spacing token or raw
    const sp  = (v) => staticVal || tok(v, 'spacing')
    // Helper: resolve color token or raw
    const col = (v) => tok(v, 'color')
    // Helper: resolve radius token or raw
    const rad = (v) => staticVal || tok(v, 'radius')
    // Helper: resolve shadow token or raw
    const sh  = (v) => tok(v, 'shadow')
    // Helper: resolve duration token or raw
    const dur = (v) => tok(v, 'duration')
    // Helper: resolve easing token or raw
    const eas = (v) => isRawValue(v) ? v : ('var(--ease-' + v + ')')

    const propMap = {

      // ── INK (color) ──
      'ink':              (v) => { el.style.color = col(v) },
      'ink-caret':        (v) => { el.style.caretColor = col(v) },
      'ink-accent':       (v) => { el.style.accentColor = col(v) },
      'ink-fill':         (v) => { el.style.fill = col(v) },

      // ── PAINT (background) ──
      'paint':            (v) => { el.style.backgroundColor = col(v) },
      'paint-img':        (v) => { el.style.backgroundImage = isRawValue(v) ? v : ('url(' + v + ')') },
      'paint-size':       (v) => { el.style.backgroundSize = v },
      'paint-pos':        (v) => { el.style.backgroundPosition = v.replace(/_/g,' ') },

      // ── CANVAS (sizing) ──
      'canvas-w':         (v) => { el.style.width = sp(v) },
      'canvas-h':         (v) => { el.style.height = sp(v) },
      'canvas-w-min':     (v) => { el.style.minWidth = sp(v) },
      'canvas-h-min':     (v) => { el.style.minHeight = sp(v) },
      'canvas-w-max':     (v) => { el.style.maxWidth = sp(v) },
      'canvas-h-max':     (v) => { el.style.maxHeight = sp(v) },
      'canvas-ratio':     (v) => { el.style.aspectRatio = v.replace(/_/g, '/') },
      'canvas-fade':      (v) => { el.style.opacity = v },

      // ── PAD (padding) ──
      'pad':              (v) => { el.style.padding = sp(v) },
      'pad-x':            (v) => { el.style.paddingLeft = sp(v); el.style.paddingRight = sp(v) },
      'pad-y':            (v) => { el.style.paddingTop = sp(v); el.style.paddingBottom = sp(v) },
      'pad-top':          (v) => { el.style.paddingTop = sp(v) },
      'pad-right':        (v) => { el.style.paddingRight = sp(v) },
      'pad-btm':          (v) => { el.style.paddingBottom = sp(v) },
      'pad-left':         (v) => { el.style.paddingLeft = sp(v) },

      // ── MAR (margin) ──
      'mar':              (v) => { el.style.margin = sp(v) },
      'mar-x':            (v) => { el.style.marginLeft = sp(v); el.style.marginRight = sp(v) },
      'mar-y':            (v) => { el.style.marginTop = sp(v); el.style.marginBottom = sp(v) },
      'mar-top':          (v) => { el.style.marginTop = sp(v) },
      'mar-right':        (v) => { el.style.marginRight = sp(v) },
      'mar-btm':          (v) => { el.style.marginBottom = sp(v) },
      'mar-left':         (v) => { el.style.marginLeft = sp(v) },

      // ── GAP ──
      'gap':              (v) => { el.style.gap = sp(v) },
      'gap-x':            (v) => { el.style.columnGap = sp(v) },
      'gap-y':            (v) => { el.style.rowGap = sp(v) },

      // ── STROKE (border) ──
      'stroke-color':     (v) => { el.style.borderColor = col(v) },
      'stroke-width':     (v) => { el.style.borderWidth = isRawValue(v) ? v : tok(v, 'stroke') },
      'stroke-style':     (v) => { el.style.borderStyle = v },

      // ── CURVE (border-radius) ──
      'curve':            (v) => { el.style.borderRadius = rad(v) },
      'curve-tl':         (v) => { el.style.borderTopLeftRadius = rad(v) },
      'curve-tr':         (v) => { el.style.borderTopRightRadius = rad(v) },
      'curve-bl':         (v) => { el.style.borderBottomLeftRadius = rad(v) },
      'curve-br':         (v) => { el.style.borderBottomRightRadius = rad(v) },

      // ── RING (outline) ──
      'ring':             (v) => { el.style.outline = tok(v, 'stroke') + ' solid' },
      'ring-color':       (v) => { el.style.outlineColor = col(v) },
      'ring-width':       (v) => { el.style.outlineWidth = v },
      'ring-offset':      (v) => { el.style.outlineOffset = v },

      // ── CAST (shadow) ──
      'cast':             (v) => { el.style.boxShadow = sh(v) },
      'cast-text':        (v) => { el.style.textShadow = sh(v) },
      'cast-inner':       (v) => { el.style.boxShadow = 'inset ' + sh(v) },

      // ── GLOW (filter) ──
      'glow-blur':        (v) => { el.style.filter = 'blur(' + v + ')' },
      'glow-bright':      (v) => { el.style.filter = 'brightness(' + v + ')' },
      'glow-sat':         (v) => { el.style.filter = 'saturate(' + v + ')' },
      'glow-contrast':    (v) => { el.style.filter = 'contrast(' + v + ')' },

      // ── GLASS (backdrop) ──
      'glass':            (v) => { el.style.backdropFilter = 'blur(' + (isRawValue(v) ? v : tok(v, 'blur')) + ')' },
      'glass-blur':       (v) => { el.style.backdropFilter = 'blur(' + (isRawValue(v) ? v : tok(v, 'blur')) + ')' },

      // ── LAYER (z-index) ──
      'layer':            (v) => { el.style.zIndex = isRawValue(v) ? v : tok(v, 'z') },

      // ── POSITION ──
      'pos-top':          (v) => { el.style.top = sp(v) },
      'pos-right':        (v) => { el.style.right = sp(v) },
      'pos-btm':          (v) => { el.style.bottom = sp(v) },
      'pos-left':         (v) => { el.style.left = sp(v) },
      'pos-inset':        (v) => { el.style.inset = sp(v) },

      // ── FLEX ──
      'flex':             (v) => { el.style.flex = v },
      'flex-grow':        (v) => { el.style.flexGrow = v },
      'flex-shrink':      (v) => { el.style.flexShrink = v },
      'flex-base':        (v) => { el.style.flexBasis = sp(v) },
      'flex-order':       (v) => { el.style.order = v },

      // ── GRID ──
      'grid-cols':        (v) => { el.style.gridTemplateColumns = v.replace(/_/g,' ') },
      'grid-rows':        (v) => { el.style.gridTemplateRows = v.replace(/_/g,' ') },
      'grid-col':         (v) => { el.style.gridColumn = v.replace(/_/g,' ') },
      'grid-row':         (v) => { el.style.gridRow = v.replace(/_/g,' ') },
      'grid-area':        (v) => { el.style.gridArea = v },

      // ── TYPE ──
      'type-face':        (v) => { el.style.fontFamily = isRawValue(v) ? v : tok(v, 'font') },
      'type-size':        (v) => { el.style.fontSize = isRawValue(v) ? v : tok(v, 'text') + '-size)'.replace('--text-','-size') },
      'type-weight':      (v) => { el.style.fontWeight = v },
      'type-style':       (v) => { el.style.fontStyle = v },

      // ── TEXT COMPOSITE (size + weight + line) ──
      'text':             (v) => {
        el.style.fontSize   = isRawValue(v) ? v : tok(v, 'text').replace(')', '-size)')
        el.style.fontWeight = isRawValue(v) ? '' : tok(v, 'text').replace(')', '-weight)')
        el.style.lineHeight = isRawValue(v) ? '' : tok(v, 'text').replace(')', '-line)')
      },

      // ── LEADING / TRACKING ──
      'leading':          (v) => { el.style.lineHeight = isRawValue(v) ? v : tok(v, 'leading') },
      'tracking':         (v) => { el.style.letterSpacing = isRawValue(v) ? v : tok(v, 'tracking') },

      // ── MOVE (transforms) ──
      'move':             (v) => { el.style.transform = 'translate(' + v.replace(/_/g,',') + ')' },
      'move-x':           (v) => { el.style.transform = 'translateX(' + v + ')' },
      'move-y':           (v) => { el.style.transform = 'translateY(' + v + ')' },
      'spin':             (v) => { el.style.transform = 'rotate(' + v + ')' },
      'scale':            (v) => { el.style.transform = 'scale(' + v + ')' },
      'skew':             (v) => { el.style.transform = 'skew(' + v.replace(/_/g,',') + ')' },
      'origin':           (v) => { el.style.transformOrigin = v.replace(/_/g,' ') },
      'depth-view':       (v) => { el.style.perspective = v },

      // ── EASE (transition) ──
      'ease':             (v) => { el.style.transition = 'all ' + (dur(v) || '0.3s') + ' ease' },
      'ease-speed':       (v) => { el.style.transitionDuration = dur(v) },
      'ease-curve':       (v) => { el.style.transitionTimingFunction = eas(v) },
      'ease-wait':        (v) => { el.style.transitionDelay = dur(v) },

      // ── CLIP ──
      'clip':             (v) => { el.style.clipPath = v.replace(/_/g,' ') },
      'mask':             (v) => { el.style.mask = isRawValue(v) ? v : tok(v, 'mask') },

      // ── SCENE (view transition) ──
      'scene-name':       (v) => { el.style.viewTransitionName = v },

      // ── PATH (motion path) ──
      'path':             (v) => { el.style.offsetPath = v.replace(/_/g,' ') },
      'path-dist':        (v) => { el.style.offsetDistance = v },
      'path-spin':        (v) => { el.style.offsetRotate = v },

      // ── MISC ──
      'canvas-show':      (v) => { el.style.visibility = v },
      'will':             (v) => { el.style.willChange = v },
      'content':          (v) => { el.style.content = '"' + v + '"' },
      'frame-name':       (v) => { el.style.containerName = v },
    }

    const apply = propMap[base]
    if (apply) apply(value)
    else console.warn('🌊 Mizumi: unknown prop class "' + base + '{' + value + '}"')
  }

  // ============================================================
  // TOKEN / CONFIG RESOLVERS
  // ============================================================
  function resolveToken(value) {
    if (typeof value !== 'string' || !value.startsWith('tokens.')) return value
    const path = value.replace('tokens.', '').split('.')
    let cur = TOKENS
    for (const k of path) {
      if (cur?.[k] === undefined) return value
      cur = cur[k]
    }
    return typeof cur === 'number' ? cur / 1000 : cur
  }

  function resolveConfig(config) {
    if (typeof config !== 'object' || config === null) return config
    const out = {}
    for (const [k, v] of Object.entries(config)) {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        out[k] = resolveConfig(v)
      } else {
        let resolved = resolveToken(v)
        if ((k === 'duration' || k === 'delay') && typeof resolved === 'number' && resolved > 10) {
          resolved = resolved / 1000
        }
        out[k] = resolved
      }
    }
    return out
  }

  function getMods(el) {
    const mods = {}
    for (const cls of el.classList) {
      const dn    = cls.match(/^duration-(\\d+)$/)
      if (dn)    { mods.duration = +dn[1] / 1000; continue }
      const dname = cls.match(/^duration-(fast|normal|slow|slower)$/)
      if (dname) { mods.duration = DUR_MAP[dname[1]]; continue }
      const dl    = cls.match(/^delay-(\\d+)$/)
      if (dl)    { mods.delay = +dl[1] / 1000; continue }
      const ease  = cls.match(/^ease-(.+)$/)
      if (ease)  { mods.ease = EASE_MAP[ease[1]] || ease[1]; continue }
    }
    return mods
  }

  function getDataOverrides(el) {
    const d = el.dataset, o = {}
    if (d.gsapDuration) o.duration = +d.gsapDuration / 1000
    if (d.gsapDelay)    o.delay    = +d.gsapDelay / 1000
    if (d.gsapEase)     o.ease     = d.gsapEase
    if (d.gsapY)        o.y        = +d.gsapY
    if (d.gsapX)        o.x        = +d.gsapX
    if (d.gsapScale)    o.scale    = +d.gsapScale
    if (d.gsapOpacity)  o.opacity  = +d.gsapOpacity
    return o
  }

  // ============================================================
  // ANIMATION INITS
  // ============================================================
  function initEntrance(gsap, ScrollTrigger, el, config, props, targetEl) {
    const r      = resolveConfig(config)
    const mods   = getMods(el)
    const data   = getDataOverrides(el)
    const target = targetEl || el
    const hasScroll = el.classList.contains('scroll-trigger') || props.start

    const toConfig = {
      ...r.to,
      duration: props.duration || data.duration || mods.duration || r.duration || 0.3,
      delay:    props.delay    || data.delay    || mods.delay    || r.delay    || 0,
      ease:     EASE_MAP[props.ease] || props.ease || data.ease || mods.ease || r.ease || 'power2.out',
    }

    if (hasScroll && ScrollTrigger) {
      toConfig.scrollTrigger = {
        trigger:       el,
        start:         props.start   || 'top 80%',
        end:           props.end     || null,
        scrub:         props.scrub   || false,
        toggleActions: props.scrub   ? undefined : 'play none none reverse',
        markers:       props.markers || false,
      }
      if (!props.end) delete toConfig.scrollTrigger.end
    }

    const from = { ...r.from }
    if (props.from) {
      const parts = props.from.split(' ')
      for (let i = 0; i < parts.length; i += 2) {
        const key = parts[i]
        const val = isNaN(parts[i+1]) ? parts[i+1] : Number(parts[i+1])
        from[key] = val
      }
    }

    Object.keys(from).length
      ? gsap.fromTo(target, from, toConfig)
      : gsap.to(target, toConfig)
  }

  function initHover(gsap, el, config, props, targetEl) {
    const r      = resolveConfig(config)
    if (!r.hover) return
    const target = targetEl || el
    const hc = {
      ...r.hover,
      duration: props.duration || r.hover.duration || 0.15,
      ease:     EASE_MAP[props.ease] || r.hover.ease || 'power2.out',
    }
    const reset = {}
    for (const p of Object.keys(hc)) {
      if (['duration','ease','boxShadow','filter'].includes(p)) continue
      reset[p] = p === 'scale' ? 1 : 0
    }
    el.addEventListener('mouseenter', () => gsap.to(target, hc))
    el.addEventListener('mouseleave', () => gsap.to(target, { ...reset, duration: hc.duration, ease: 'power2.inOut' }))
  }

  function initActive(gsap, el, config, props, targetEl) {
    const r      = resolveConfig(config)
    if (!r.active) return
    const target = targetEl || el
    const ac = {
      ...r.active,
      duration: props.duration || r.active.duration || 0.1,
    }
    el.addEventListener('mousedown', () => gsap.to(target, ac))
    el.addEventListener('mouseup',   () => gsap.to(target, { scale: 1, duration: ac.duration, ease: 'back.out(2)' }))
  }

  function initStagger(gsap, ScrollTrigger, el, config, props) {
    const r        = resolveConfig(config)
    const children = Array.from(el.children)
    if (!children.length) return

    const gc = {
      ...r.to,
      duration: props.duration || r.duration || 0.3,
      ease:     EASE_MAP[props.ease] || r.ease || 'power2.out',
      stagger:  props.stagger  || r.stagger  || 0.1,
    }

    if (ScrollTrigger && (el.classList.contains('scroll-trigger') || props.start)) {
      gc.scrollTrigger = {
        trigger: el,
        start:   props.start   || 'top 80%',
        markers: props.markers || false,
      }
    }

    gsap.fromTo(children, r.from || { opacity: 0, y: 20 }, gc)
  }

  // ============================================================
  // SCROLL STORYTELLING
  // scroll-fade-in{start:top_80%,end:center_center,scrub:1}
  // scroll-pin{start:top_top,end:+=500px}
  // scroll-scrub{from:opacity_0_y_100,to:opacity_1_y_0}
  // ============================================================
  function initScrollStory(gsap, ScrollTrigger, el, base, props) {
    if (!ScrollTrigger) {
      console.warn('🌊 Mizumi: ScrollTrigger not available for', base)
      return
    }

    if (base === 'scroll-pin') {
      ScrollTrigger.create({
        trigger: el,
        start:   props.start   || 'top top',
        end:     props.end     || '+=500px',
        pin:     true,
        markers: props.markers || false,
        scrub:   props.scrub   || false,
      })
      return
    }

    if (base === 'scroll-scrub') {
      const from = {}, to = {}
      if (props.from) {
        const parts = props.from.split(' ')
        for (let i = 0; i < parts.length; i += 2) {
          from[parts[i]] = isNaN(parts[i+1]) ? parts[i+1] : Number(parts[i+1])
        }
      }
      if (props.to) {
        const parts = props.to.split(' ')
        for (let i = 0; i < parts.length; i += 2) {
          to[parts[i]] = isNaN(parts[i+1]) ? parts[i+1] : Number(parts[i+1])
        }
      }
      to.scrollTrigger = {
        trigger: el,
        start:   props.start  || 'top bottom',
        end:     props.end    || 'center center',
        scrub:   props.scrub !== undefined ? props.scrub : 1,
        markers: props.markers || false,
      }
      gsap.fromTo(el, from, to)
      return
    }

    const animName = base.replace('scroll-', 'animate-')
    const config   = CONFIGS[animName] || CONFIGS[base]

    if (config) {
      initEntrance(gsap, ScrollTrigger, el, config, props, el)
      return
    }

    gsap.fromTo(el,
      { opacity: 0, y: props.y || 30 },
      {
        opacity:  1,
        y:        0,
        duration: props.duration || 0.6,
        ease:     EASE_MAP[props.ease] || 'power2.out',
        scrollTrigger: {
          trigger: el,
          start:   props.start  || 'top 80%',
          end:     props.end    || null,
          scrub:   props.scrub  || false,
          markers: props.markers || false,
        }
      }
    )
  }

  // ============================================================
  // MAIN INIT
  // ============================================================
  function run(gsap, ScrollTrigger) {
    console.log('🌊 Mizumi Animations Initializing...')
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger)

    // Pass 1 — named config animations (plain class names, no {})
    for (const [name, config] of Object.entries(CONFIGS)) {
      const els = document.querySelectorAll('.' + CSS.escape(name))
      els.forEach(el => {
        if      (config.hover)                  initHover(gsap, el, config, {}, null)
        else if (config.active)                 initActive(gsap, el, config, {}, null)
        else if (config.targets === 'children') initStagger(gsap, ScrollTrigger, el, config, {})
        else if (config.from || config.to)      initEntrance(gsap, ScrollTrigger, el, config, {}, null)
      })
    }

    // Pass 2 — dynamic {prop} classes on every element
    const allEls = document.querySelectorAll('[class]')

    allEls.forEach(el => {
      for (const rawClass of el.classList) {
        if (!rawClass.includes('{')) continue

        const parsed = parseMizumiClass(rawClass)
        if (!parsed) continue

        const { base, props, target, value } = parsed

        // Prop value — pad{md}, canvas-w{640px}, paint{#fff}
        if (value !== null) {
          // Check if this is a CSS utility prop (not animation)
          const isAnimBase = CONFIGS[base] || base.startsWith('animate-') || base.startsWith('hover-') || base.startsWith('active-') || base.startsWith('scroll-') || base.startsWith('stagger-')
          if (!isAnimBase) {
            applyPropClass(el, base, value)
          }
          continue
        }

        // Scroll storytelling
        if (base.startsWith('scroll-')) {
          initScrollStory(gsap, ScrollTrigger, el, base, props)
          continue
        }

        // Targeting — hover-lift{>.child}
        if (target !== null) {
          const targetEl = resolveTarget(el, target)
          const config   = CONFIGS[base]
          if (!config) continue

          // children targeting → stagger
          if (target === 'children' || targetEl instanceof Array) {
            initStagger(gsap, ScrollTrigger, el, config, props)
          } else if (targetEl) {
            if      (config.hover)            initHover(gsap, el, config, props, targetEl)
            else if (config.active)           initActive(gsap, el, config, props, targetEl)
            else if (config.from || config.to) initEntrance(gsap, ScrollTrigger, el, config, props, targetEl)
          }
          continue
        }

        // Named animation with prop overrides
        const config = CONFIGS[base]
        if (!config) continue

        if      (config.hover)                   initHover(gsap, el, config, props, null)
        else if (config.active)                  initActive(gsap, el, config, props, null)
        else if (config.targets === 'children')  initStagger(gsap, ScrollTrigger, el, config, props)
        else if (config.from || config.to)       initEntrance(gsap, ScrollTrigger, el, config, props, null)
      }
    })

    console.log('✅ Mizumi Ready!')
  }

  function init() {
    if (typeof window.gsap === 'undefined') {
      console.warn('\\n Mizumi: GSAP NOT FOUND - animations disabled.\\n animate-fade-in, hover-lift, scroll-trigger etc. will NOT run.\\n\\n CDN fix (add before </body>):\\n <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>\\n <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js"></script>\\n\\n npm/Vite fix: npm install gsap then in main.jsx: window.gsap = gsap\\n')
      return
    }
    var gsap          = window.gsap
    var ScrollTrigger = window.ScrollTrigger || null
    if (!ScrollTrigger) {
      console.warn('Mizumi: ScrollTrigger not found - scroll-trigger animations disabled.')
    }
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger)
    run(gsap, ScrollTrigger)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  window.Mizumi = { init, version: '0.1.0' }
})()
`
  }
}