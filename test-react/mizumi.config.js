// mizumi.config.js
export default {
  tokens: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        50:  '#EFF6FF',
        600: '#2563EB',
        900: '#1E3A8A'
      },
      secondary: '#8B5CF6',
      neutral: {
        50:  '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        500: '#6B7280',
        900: '#111827'
      },
      surface:  '#FFFFFF',
      ink:      '#111827',
      success:  '#10B981',
      error:    '#EF4444',
      white:    '#FFFFFF',
      black:    '#000000',
    },

    spacing: {
      xs:   '4px',
      sm:   '8px',
      md:   '16px',
      lg:   '24px',
      xl:   '32px',
      '2xl':'48px',
      '3xl':'64px',
    },

    typography: {
      h1:    { size: '48px', weight: '700', line: '1.2' },
      h2:    { size: '36px', weight: '600', line: '1.3' },
      h3:    { size: '24px', weight: '600', line: '1.4' },
      body:  { size: '16px', weight: '400', line: '1.6' },
      small: { size: '14px', weight: '400', line: '1.5' },
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
      full: '9999px',
    },

    shadows: {
      none: 'none',
      sm:   '0 1px 2px 0 rgba(0,0,0,0.05)',
      md:   '0 4px 6px -1px rgba(0,0,0,0.1)',
      lg:   '0 10px 15px -3px rgba(0,0,0,0.1)',
      xl:   '0 20px 25px -5px rgba(0,0,0,0.1)',
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
      ghost:  '0.05',
      muted:  '0.4',
      soft:   '0.7',
      full:   '1',
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
  },

  patterns: {

    // ── LAYOUT ──────────────────────────────────────
    'flex-center': 'display:flex align-yi:center align-x:center',

    'flex-between': 'display:flex align-yi:center align-x:between',

    'flex-col-center': 'display:flex flex-dir:col align-yi:center align-x:center',

    'flex-col': 'display:flex flex-dir:col',

    'flex-row': 'display:flex flex-dir:row align-yi:center',

    'grid-auto': 'display:grid gap:md',

    // ── CONTAINERS ───────────────────────────────────
    container: 'canvas-w:full mar-x:auto pad-x:md canvas-w-max:xl',

    section: 'pad-y:2xl canvas-w:full',

    // ── CARDS ────────────────────────────────────────
    card: 'paint:surface pad:md curve:lg cast:md',

    'card-elevated': 'card cast:xl',

    'card-flat': 'card cast:none',

    'card-hover': 'card ease:default cursor:pointer',

    'card-glass': 'glass-blur:glass paint:surface curve:lg cast:md canvas-fade:soft',

    // ── BUTTONS ──────────────────────────────────────
    button: [
      'pad-y:sm pad-x:lg',
      'curve:md',
      'cursor:pointer',
      'ease:default',
      'display:flex-inline',
      'align-yi:center',
      'align-x:center',
      'type-weight:semi',
    ].join(' '),

    'btn-primary': 'button paint:primary ink:white',

    'btn-secondary': 'button paint:secondary ink:white',

    'btn-ghost': 'button paint:surface ink:primary stroke-color:primary stroke-width:1px stroke-style:solid',

    'btn-danger': 'button paint:error ink:white',

    'btn-text': 'button ink:primary',

    // ── INPUTS ───────────────────────────────────────
    input: [
      'pad:sm',
      'curve:md',
      'stroke-color:neutral-200',
      'stroke-width:1px',
      'stroke-style:solid',
      'ease:default',
      'canvas-w:full',
      'type-face:sans',
      'text:body',
    ].join(' '),

    'input-error': 'input stroke-color:error ring-color:error',

    // ── TYPOGRAPHY ───────────────────────────────────
    heading: 'text:h1 ink:ink type-face:sans',

    subheading: 'text:h3 ink:neutral-500 type-face:sans',

    'text-muted': 'ink:neutral-500 text:small',

    'text-label': 'text:small type-weight:semi tracking:wide text-case:upper ink:neutral-500',

    'text-link': 'ink:primary ease:default',

    // ── SURFACE ──────────────────────────────────────
    surface: 'paint:surface cast:sm curve:md',

    'surface-raised': 'paint:surface cast:lg curve:lg',

    badge: 'pad-y:xs pad-x:sm curve:full text:small type-weight:semi',

    'badge-primary': 'badge paint:primary-50 ink:primary-600',

    divider: 'stroke-y-start:neutral-200 stroke-style:solid stroke-width:1px',

    // ── TEST ─────────────────────────────────────────
    'test-watch': 'paint:primary pad:lg curve:full',
  },

  animations: {

    // ── ENTRANCE ─────────────────────────────────────
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

    'animate-blur-in': {
      from: { opacity: 0, filter: 'blur(12px)' },
      to:   { opacity: 1, filter: 'blur(0px)' },
      duration: 0.5,
      ease: 'power2.out',
    },

    // ── SCROLL ───────────────────────────────────────
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

    // ── HOVER ────────────────────────────────────────
    'hover-lift': {
      hover: { y: -8, duration: 0.15, ease: 'power2.out' },
    },

    'hover-scale': {
      hover: { scale: 1.05, duration: 0.15, ease: 'power2.out' },
    },

    'hover-glow': {
      hover: {
        boxShadow: '0 0 20px rgba(59,130,246,0.5)',
        duration: 0.15,
      },
    },

    'hover-float': {
      hover: { y: -4, duration: 0.2, ease: 'power1.out' },
    },

    // ── ACTIVE ───────────────────────────────────────
    'active-press': {
      active: { scale: 0.95, duration: 0.1 },
    },

    'active-bounce': {
      active: { scale: 0.9, duration: 0.1, ease: 'back.out' },
    },

    // ── STAGGER ──────────────────────────────────────
    'stagger-children-100': {
      targets:  'children',
      stagger:  0.1,
      from: { opacity: 0, y: 20 },
      to:   { opacity: 1, y: 0  },
    },

    'stagger-children-50': {
      targets: 'children',
      stagger: 0.05,
      from: { opacity: 0, y: 10 },
      to:   { opacity: 1, y: 0  },
    },
  },

  rules: {
    responsive:  true,
    darkMode:    'class',
    print:       true,
    motion:      true,
    orientation: false,
    states: true,

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
  },
  
  depth: {
    strength: 0.4,
    perspective: 1000,
    perspectiveOrigin: '20% 50%',  
    light: { x: 0, y: -1 }
  },
}