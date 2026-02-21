// packages/core/parser.js
// Parses all Mizumi token categories into CSS variables
// Supports: colors, spacing, typography, radius, shadows,
//           fonts, easing, duration, blur, opacity, zIndex,
//           strokes, leading, tracking, screens, frames

export class TokenParser {
  constructor(config) {
    this.config = config
  }

  parse() {
    const vars = {}
    const c    = this.config

    if (c.colors)      this.parseColors(c.colors, vars)
    if (c.spacing)     this.parseSpacing(c.spacing, vars)
    if (c.typography)  this.parseTypography(c.typography, vars)
    if (c.fonts)       this.parseFonts(c.fonts, vars)
    if (c.radius)      this.parseRadius(c.radius, vars)
    if (c.shadows)     this.parseShadows(c.shadows, vars)
    if (c.easing)      this.parseEasing(c.easing, vars)
    if (c.duration)    this.parseDuration(c.duration, vars)
    if (c.blur)        this.parseBlur(c.blur, vars)
    if (c.opacity)     this.parseOpacity(c.opacity, vars)
    if (c.zIndex)      this.parseZIndex(c.zIndex, vars)
    if (c.strokes)     this.parseStrokes(c.strokes, vars)
    if (c.leading)     this.parseLeading(c.leading, vars)
    if (c.tracking)    this.parseTracking(c.tracking, vars)
    if (c.screens)     this.parseScreens(c.screens, vars)

    return vars
  }

  // ── Colors ──
  // Supports flat, nested, and DEFAULT shade
  parseColors(colors, vars, prefix = 'color') {
    for (const [key, value] of Object.entries(colors)) {
      if (typeof value === 'object' && value !== null) {
        for (const [shade, color] of Object.entries(value)) {
          const name = shade === 'DEFAULT'
            ? `--${prefix}-${key}`
            : `--${prefix}-${key}-${shade}`
          vars[name] = color
        }
      } else {
        vars[`--${prefix}-${key}`] = value
      }
    }
  }

  // ── Spacing ──
  parseSpacing(spacing, vars) {
    for (const [key, value] of Object.entries(spacing)) {
      vars[`--spacing-${key}`] = value
    }
  }

  // ── Typography ──
  // Supports: { h1: { size, weight, line } } or { h1: '2rem' }
  parseTypography(typography, vars) {
    for (const [key, value] of Object.entries(typography)) {
      if (typeof value === 'object' && value !== null) {
        if (value.size)    vars[`--text-${key}-size`]   = value.size
        if (value.weight)  vars[`--text-${key}-weight`] = value.weight
        if (value.line)    vars[`--text-${key}-line`]   = value.line
        if (value.spacing) vars[`--text-${key}-spacing`]= value.spacing
        if (value.font)    vars[`--text-${key}-font`]   = value.font
      } else {
        vars[`--text-${key}-size`] = value
      }
    }
  }

  // ── Fonts ──
  // { sans: 'Inter, sans-serif', mono: 'Fira Code, monospace' }
  parseFonts(fonts, vars) {
    for (const [key, value] of Object.entries(fonts)) {
      vars[`--font-${key}`] = value
    }
  }

  // ── Radius ──
  parseRadius(radius, vars) {
    for (const [key, value] of Object.entries(radius)) {
      vars[`--radius-${key}`] = value
    }
  }

  // ── Shadows ──
  // Supports flat value or { box, text, drop } per key
  parseShadows(shadows, vars) {
    for (const [key, value] of Object.entries(shadows)) {
      if (typeof value === 'object' && value !== null) {
        if (value.box)  vars[`--shadow-${key}`]      = value.box
        if (value.text) vars[`--shadow-text-${key}`] = value.text
        if (value.drop) vars[`--shadow-drop-${key}`] = value.drop
      } else {
        vars[`--shadow-${key}`] = value
      }
    }
  }

  // ── Easing ──
  // { smooth: 'cubic-bezier(0.4,0,0.2,1)', bouncy: 'cubic-bezier(0.34,1.56,0.64,1)' }
  parseEasing(easing, vars) {
    for (const [key, value] of Object.entries(easing)) {
      vars[`--ease-${key}`] = value
    }
  }

  // ── Duration ──
  // { fast: '150ms', normal: '300ms', slow: '500ms' }
  parseDuration(duration, vars) {
    for (const [key, value] of Object.entries(duration)) {
      vars[`--duration-${key}`] = value
    }
  }

  // ── Blur ──
  // { sm: '4px', md: '8px', lg: '16px', glass: '20px' }
  parseBlur(blur, vars) {
    for (const [key, value] of Object.entries(blur)) {
      vars[`--blur-${key}`] = value
    }
  }

  // ── Opacity ──
  // { ghost: '0.1', muted: '0.5', full: '1' }
  parseOpacity(opacity, vars) {
    for (const [key, value] of Object.entries(opacity)) {
      vars[`--opacity-${key}`] = value
    }
  }

  // ── Z-Index ──
  // { base: 0, float: 10, modal: 100, toast: 200, top: 999 }
  parseZIndex(zIndex, vars) {
    for (const [key, value] of Object.entries(zIndex)) {
      vars[`--z-${key}`] = value
    }
  }

  // ── Strokes (border widths) ──
  // { thin: '1px', md: '2px', thick: '4px' }
  parseStrokes(strokes, vars) {
    for (const [key, value] of Object.entries(strokes)) {
      vars[`--stroke-${key}`] = value
    }
  }

  // ── Leading (line-height) ──
  // { tight: '1.25', normal: '1.5', loose: '2' }
  parseLeading(leading, vars) {
    for (const [key, value] of Object.entries(leading)) {
      vars[`--leading-${key}`] = value
    }
  }

  // ── Tracking (letter-spacing) ──
  // { tight: '-0.05em', normal: '0', wide: '0.1em' }
  parseTracking(tracking, vars) {
    for (const [key, value] of Object.entries(tracking)) {
      vars[`--tracking-${key}`] = value
    }
  }

  // ── Screens (stored as vars for runtime reference) ──
  // { sm: '640px', md: '768px', lg: '1024px' }
  parseScreens(screens, vars) {
    for (const [key, value] of Object.entries(screens)) {
      vars[`--screen-${key}`] = value
    }
  }

  // ── Output ──
  toCSS() {
    const vars  = this.parse()
    const lines = [':root {']

    // Group by category for readability
    const groups = {}
    for (const [name, value] of Object.entries(vars)) {
      const category = name.split('-')[1] || 'misc'
      if (!groups[category]) groups[category] = []
      groups[category].push(`  ${name}: ${value};`)
    }

    for (const [category, entries] of Object.entries(groups)) {
      lines.push(`\n  /* ${category} */`)
      lines.push(...entries)
    }

    lines.push('}')
    return lines.join('\n')
  }
}