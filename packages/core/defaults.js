// packages/core/defaults.js
// ================================================================
// MIZUMI CREATOR DEFAULTS
// This is YOUR file as the package creator.
// Edit freely, then run: node packages/cli/index.js sync:defaults
// Users can override anything here in their own mizumi.config.js
// ================================================================

export const DEFAULT_TOKENS = {
  colors: {
    primary:   { DEFAULT: '#3B82F6', 50: '#EFF6FF', 600: '#2563EB', 900: '#1E3A8A' },
    secondary: '#8B5CF6',
    neutral:   { 50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 500: '#6B7280', 900: '#111827' },
    surface:   '#FFFFFF',
    ink:       '#111827',
    success:   '#10B981',
    error:     '#EF4444',
    warning:   '#F59E0B',
    white:     '#FFFFFF',
    black:     '#000000',
  },

  spacing: {
    xs:   '4px',
    sm:   '8px',
    md:   '16px',
    lg:   '24px',
    xl:   '32px',
    '2xl':'48px',
    '3xl':'64px',
    '4xl':'96px',
  },

  typography: {
    h1:    { size: '48px', weight: '700', line: '1.2' },
    h2:    { size: '36px', weight: '600', line: '1.3' },
    h3:    { size: '24px', weight: '600', line: '1.4' },
    h4:    { size: '20px', weight: '600', line: '1.5' },
    body:  { size: '16px', weight: '400', line: '1.6' },
    small: { size: '14px', weight: '400', line: '1.5' },
    xs:    { size: '12px', weight: '400', line: '1.4' },
  },

  fonts: {
    sans:  'system-ui, -apple-system, sans-serif',
    serif: 'Georgia, serif',
    mono:  'ui-monospace, monospace',
  },

  radius: {
    none: '0',
    sm:   '4px',
    md:   '8px',
    lg:   '16px',
    xl:   '24px',
    '2xl':'32px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm:   '0 1px 2px 0 rgba(0,0,0,0.05)',
    md:   '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg:   '0 10px 15px -3px rgba(0,0,0,0.1)',
    xl:   '0 20px 25px -5px rgba(0,0,0,0.1)',
    '2xl':'0 25px 50px -12px rgba(0,0,0,0.25)',
  },

  easing: {
    smooth: 'cubic-bezier(0.4,0,0.2,1)',
    bouncy: 'cubic-bezier(0.34,1.56,0.64,1)',
    sharp:  'cubic-bezier(0.4,0,1,1)',
    back:   'cubic-bezier(0.34,1.4,0.64,1)',
    linear: 'linear',
  },

  duration: {
    fast:   '150ms',
    normal: '300ms',
    slow:   '500ms',
    slower: '800ms',
  },

  blur: {
    sm:    '4px',
    md:    '8px',
    lg:    '16px',
    glass: '20px',
    heavy: '40px',
  },

  opacity: {
    ghost: '0.05',
    muted: '0.4',
    soft:  '0.7',
    full:  '1',
  },

  zIndex: {
    base:   0,
    float:  10,
    sticky: 20,
    modal:  100,
    toast:  200,
    top:    999,
  },

  leading: {
    tight:   '1.25',
    snug:    '1.375',
    normal:  '1.5',
    relaxed: '1.625',
    loose:   '2',
  },

  tracking: {
    tight:  '-0.05em',
    normal: '0em',
    wide:   '0.05em',
    wider:  '0.1em',
    widest: '0.2em',
  },

  strokes: {
    none:  '0',
    thin:  '1px',
    base:  '2px',
    thick: '4px',
    heavy: '8px',
  },
}

export const DEFAULT_PATTERNS = {

  // ── LAYOUT ──────────────────────────────────────────────────
  'flex-center':      'display:flex align-x:center align-yi:center',
  'flex-between':     'display:flex align-x:between align-yi:center',
  'flex-around':      'display:flex align-x:around align-yi:center',
  'flex-col-center':  'display:flex flex-dir:col align-x:center align-yi:center',
  'flex-col':         'display:flex flex-dir:col',
  'flex-row':         'display:flex flex-dir:row align-yi:center',
  'grid-auto':        'display:grid gap:md',
  'stack':            'display:flex flex-dir:col',
  'row':              'display:flex flex-dir:row align-yi:center',
  'cluster':          'display:flex flex-wrap:yes gap:sm',

  // ── CONTAINERS ──────────────────────────────────────────────
  'container':        'canvas-w:full mar-x:auto pad-x:md',
  'section':          'pad-y:2xl canvas-w:full',
  'wrapper':          'canvas-w:full mar-x:auto pad-x:lg',

  // ── CARDS ───────────────────────────────────────────────────
  'card':             'paint:surface pad:md curve:lg cast:md',
  'card-elevated':    'card cast:xl',
  'card-flat':        'card cast:none',
  'card-hover':       'card ease:normal ease-curve:smooth cursor:pointer',
  'card-glass':       'glass-blur:glass paint:surface curve:lg cast:md canvas-fade:soft',
  'card-outline':     'pad:md curve:lg stroke-style:solid stroke-width:thin stroke-color:neutral-200',

  // ── BUTTONS ─────────────────────────────────────────────────
  'button': [
    'pad-y:sm pad-x:lg',
    'curve:md',
    'cursor:pointer',
    'ease:normal ease-curve:smooth',
    'display:flex-inline',
    'align-yi:center',
    'align-x:center',
    'type-weight:semi',
  ].join(' '),
  'btn-primary':   'button paint:primary ink:white',
  'btn-secondary': 'button paint:secondary ink:white',
  'btn-ghost':     'button stroke-style:solid stroke-width:thin stroke-color:primary ink:primary',
  'btn-danger':    'button paint:error ink:white',
  'btn-success':   'button paint:success ink:white',
  'btn-text':      'button ink:primary',
  'btn-neutral':   'button paint:neutral-100 ink:neutral-900',
  'btn-dark':      'button paint:neutral-900 ink:white',

  // ── INPUTS ──────────────────────────────────────────────────
  'input': [
    'pad:sm',
    'curve:md',
    'stroke-color:neutral-200',
    'stroke-width:thin',
    'stroke-style:solid',
    'ease:normal ease-curve:smooth',
    'canvas-w:full',
    'type-face:sans',
    'text:body',
  ].join(' '),
  'input-error':  'input stroke-color:error ring-color:error',
  'input-ghost':  'pad:sm canvas-w:full type-face:sans text:body',
  'textarea':     'input canvas-h:auto',

  // ── TYPOGRAPHY ──────────────────────────────────────────────
  'heading':      'text:h1 ink:ink type-face:sans',
  'subheading':   'text:h3 ink:neutral-500 type-face:sans',
  'text-muted':   'ink:neutral-500 text:small',
  'text-label':   'text:small type-weight:semi tracking:wide text-case:upper ink:neutral-500',
  'text-link':    'ink:primary ease:normal ease-curve:smooth',
  'text-mono':    'type-face:mono text:small',
  'prose':        'text:body ink:ink leading:relaxed type-face:sans',
  'caption':      'text:xs ink:neutral-500 type-face:sans',
  'overline':     'text:xs type-weight:semi tracking:widest text-case:upper ink:neutral-500',

  // ── SURFACE ─────────────────────────────────────────────────
  'surface':         'paint:surface cast:sm curve:md',
  'surface-raised':  'paint:surface cast:lg curve:lg',
  'surface-sunken':  'paint:neutral-50 curve:md',
  'surface-overlay': 'paint:neutral-900 canvas-fade:soft',

  // ── BADGE ───────────────────────────────────────────────────
  'badge':          'pad-y:xs pad-x:sm curve:full text:small type-weight:semi',
  'badge-primary':  'badge paint:primary-50 ink:primary-600',
  'badge-success':  'badge paint:success ink:white',
  'badge-error':    'badge paint:error ink:white',
  'badge-neutral':  'badge paint:neutral-100 ink:neutral-900',
  'badge-warning':  'badge paint:warning ink:white',

  // ── DIVIDER ─────────────────────────────────────────────────
  'divider':        'stroke-y-start:neutral-200 stroke-style:solid stroke-width:thin',
  'divider-strong': 'stroke-y-start:neutral-400 stroke-style:solid stroke-width:thin',

  // ── AVATAR ──────────────────────────────────────────────────
  'avatar':         'canvas-w:lg canvas-h:lg curve:full overflow:hidden canvas-fit:cover',
  'avatar-sm':      'canvas-w:md canvas-h:md curve:full overflow:hidden',
  'avatar-lg':      'canvas-w:xl canvas-h:xl curve:full overflow:hidden',

  // ── OVERLAY ─────────────────────────────────────────────────
  'overlay':        'pos:absolute pos-inset:0 paint:black canvas-fade:muted',
  'overlay-blur':   'pos:absolute pos-inset:0 glass-blur:md',

  // ── SKELETON ────────────────────────────────────────────────
  'skeleton':       'paint:neutral-200 curve:md animate-pulse',

  // ── MISC ────────────────────────────────────────────────────
  'truncate':       'overflow:hidden text-overflow:dots wrap:no',
  'sr-only':        'pos:absolute canvas-w:1px canvas-h:1px overflow:hidden',
  'test-watch':     'paint:primary pad:lg curve:full',
  'glass-card': 'glass-blur:glass paint:surface canvas-fade:soft curve:lg cast:md',
}

export const DEFAULT_ANIMATIONS = {

  // ── ENTRANCE ────────────────────────────────────────────────
  'animate-fade-in': {
    from: { opacity: 0 },
    to:   { opacity: 1 },
    duration: 1.0,
    ease: 'power2.out',
  },
  'animate-slide-up': {
    from: { y: 100, opacity: 0 },
    to:   { y: 0,   opacity: 1 },
    duration: 0.3,
    ease: 'power2.out',
  },
  'animate-scale-in': {
    from: { scale: 0, opacity: 0 },
    to:   { scale: 1, opacity: 1 },
    duration: 0.3,
    ease: 'back.out',
  },
  'animate-slide-down': {
    from: { y: -40, opacity: 0 },
    to:   { y: 0,   opacity: 1 },
    duration: 0.3,
    ease: 'power2.out',
  },
  'animate-slide-left': {
    from: { x: 60, opacity: 0 },
    to:   { x: 0,  opacity: 1 },
    duration: 0.3,
    ease: 'power2.out',
  },
  'animate-slide-right': {
    from: { x: -60, opacity: 0 },
    to:   { x: 0,   opacity: 1 },
    duration: 0.3,
    ease: 'power2.out',
  },
  'animate-blur-in': {
    from: { opacity: 0, filter: 'blur(12px)' },
    to:   { opacity: 1, filter: 'blur(0px)' },
    duration: 0.5,
    ease: 'power2.out',
  },
  'animate-flip-in': {
    from: { rotationX: -90, opacity: 0 },
    to:   { rotationX: 0,   opacity: 1 },
    duration: 0.4,
    ease: 'back.out',
  },

  // ── SCROLL ──────────────────────────────────────────────────
  'scroll-trigger': {
    scrollTrigger: {
      trigger: 'self',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  },
  'scroll-fade-in': {
    from: { opacity: 0, y: 30 },
    to:   { opacity: 1, y: 0  },
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: 'self',
      start: 'top 85%',
    },
  },
  'scroll-scrub': {
    scrollTrigger: {
      trigger: 'self',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  },
  'scroll-slide-up': {
    from: { opacity: 0, y: 60 },
    to:   { opacity: 1, y: 0  },
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: 'self', start: 'top 85%' },
  },
  'scroll-scale-in': {
    from: { opacity: 0, scale: 0.9 },
    to:   { opacity: 1, scale: 1   },
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: { trigger: 'self', start: 'top 85%' },
  },

  // ── HOVER ───────────────────────────────────────────────────
  'hover-lift': {
    hover: { y: -8, duration: 0.15, ease: 'power2.out' },
  },
  'hover-scale': {
    hover: { scale: 1.05, duration: 0.15, ease: 'power2.out' },
  },
  'hover-glow': {
    hover: { boxShadow: '0 0 20px rgba(59,130,246,0.5)', duration: 0.15 },
  },
  'hover-float': {
    hover: { y: -4, duration: 0.2, ease: 'power1.out' },
  },
  'hover-sink': {
    hover: { y: 4, duration: 0.15, ease: 'power2.out' },
  },
  'hover-bright': {
    hover: { filter: 'brightness(1.1)', duration: 0.15 },
  },

  // ── ACTIVE ──────────────────────────────────────────────────
  'active-press': {
    active: { scale: 0.95, duration: 0.1 },
  },
  'active-bounce': {
    active: { scale: 0.9, duration: 0.1, ease: 'back.out' },
  },

  // ── STAGGER ─────────────────────────────────────────────────
  'stagger-children-100': {
    targets: 'children',
    stagger: 0.1,
    from: { opacity: 0, y: 20 },
    to:   { opacity: 1, y: 0  },
  },
  'stagger-children-50': {
    targets: 'children',
    stagger: 0.05,
    from: { opacity: 0, y: 10 },
    to:   { opacity: 1, y: 0  },
  },
  'stagger-children-200': {
    targets: 'children',
    stagger: 0.2,
    from: { opacity: 0, y: 30 },
    to:   { opacity: 1, y: 0  },
  },
}

export const DEFAULT_RULES = {
  responsive:  true,
  darkMode:    'class',
  print:       false,
  motion:      true,
  orientation: false,
  breakpoints: {
    sm:    '640px',
    md:    '768px',
    lg:    '1024px',
    xl:    '1280px',
    '2xl': '1536px',
  },
  containers: {
    card:    { sm: '300px', md: '500px' },
    sidebar: { collapsed: '200px', expanded: '320px' },
  },
}

export const DEFAULT_DEPTH = {
  layers:      6,
  perspective: 1200,
  light: {
    x:         -1,
    y:         -1,
    intensity: 0.6,
    ambient:   0.4,
  },
  effects: {
    shadow:     true,
    scale:      true,
    brightness: true,
    blur:       true,
    saturate:   true,
  },
  strength: 0.5,
  zMap: {
    0:   0,
    10:  1,
    20:  2,
    100: 3,
    200: 4,
    999: 5,
  },
}