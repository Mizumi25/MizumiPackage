// packages/core/types-generator.js
// Generates TypeScript types and JS helpers for Mizumi classes
// Fully aware of colon syntax: pad:md, paint:primary, curve:lg

import { STATIC_UTILITIES, CAPABILITY_PROPERTY_MAP } from './class-resolver.js'

export class TypesGenerator {
  constructor(config) {
    this.config     = config
    this.tokens     = config.tokens     || {}
    this.patterns   = config.patterns   || {}
    this.animations = config.animations || {}
    this.rules      = config.rules      || {}

    this.breakpoints = this.rules.breakpoints || {
      sm: '640px', md: '768px', lg: '1024px', xl: '1280px'
    }

    this.states = [
      'hover', 'focus', 'active', 'disabled',
      'focus-visible', 'focus-within', 'checked',
      'first', 'last', 'odd', 'even'
    ]
  }

  // ── Collect all class names ──
  getAllClassNames() {
    const classes = new Set()

    // Static utilities
    for (const u of STATIC_UTILITIES) {
      classes.add(u.class)
    }

    // Token-based utilities
    this.addColorClasses(classes)
    this.addSpacingClasses(classes)
    this.addRadiusClasses(classes)
    this.addShadowClasses(classes)
    this.addTypographyClasses(classes)
    this.addFontClasses(classes)
    this.addEasingClasses(classes)
    this.addDurationClasses(classes)
    this.addBlurClasses(classes)
    this.addOpacityClasses(classes)
    this.addZIndexClasses(classes)
    this.addLeadingClasses(classes)
    this.addTrackingClasses(classes)

    // Pattern classes
    for (const name of Object.keys(this.patterns)) {
      classes.add(name)
    }

    // Animation classes
    for (const name of Object.keys(this.animations)) {
      classes.add(`animate-${name}`)
      classes.add(`hover-${name}`)
      classes.add(`scroll-${name}`)
      classes.add(`scroll-${name}{start:top_80%}`)
    }

    // GSAP behavior classes
    const behaviors = [
      'hover-lift', 'hover-glow', 'hover-float', 'hover-sink',
      'active-press', 'active-bounce', 'active-flash',
      'focus-ring', 'focus-glow',
      'animate-fade-in', 'animate-slide-up', 'animate-slide-down',
      'animate-slide-left', 'animate-slide-right', 'animate-scale-in',
      'animate-blur-in', 'animate-flip-in',
      'scroll-fade-in', 'scroll-slide-up', 'scroll-scale-in',
      'scroll-scrub', 'scroll-pin',
      'stagger-children-100', 'stagger-children-200', 'stagger-children-300',
    ]
    for (const b of behaviors) classes.add(b)

    // Gesture classes (Mizumi only)
    const gestures = [
      'swipe', 'swipe-x', 'swipe-y',
      'pinch', 'press', 'drag', 'pull',
      'haptic', 'spring', 'rubber', 'momentum',
    ]
    for (const g of gestures) classes.add(g)

    return classes
  }

  addColorClasses(classes) {
    if (!this.tokens.colors) return
    for (const [key, value] of Object.entries(this.tokens.colors)) {
      if (typeof value === 'object' && value !== null) {
        for (const [shade] of Object.entries(value)) {
          const s = shade === 'DEFAULT' ? '' : `-${shade}`
          const name = `${key}${s}`
          classes.add(`ink:${name}`)
          classes.add(`paint:${name}`)
          classes.add(`stroke-color:${name}`)
          classes.add(`ring-color:${name}`)
          classes.add(`ink-fill:${name}`)
          classes.add(`svg-stroke:${name}`)
          classes.add(`ink-caret:${name}`)
          classes.add(`ink-accent:${name}`)
          classes.add(`cast-drop:${name}`)
        }
      } else {
        classes.add(`ink:${key}`)
        classes.add(`paint:${key}`)
        classes.add(`stroke-color:${key}`)
        classes.add(`ring-color:${key}`)
        classes.add(`ink-fill:${key}`)
        classes.add(`svg-stroke:${key}`)
        classes.add(`ink-caret:${key}`)
        classes.add(`ink-accent:${key}`)
      }
    }
  }

  addSpacingClasses(classes) {
    if (!this.tokens.spacing) return
    const spacingCaps = [
      'pad', 'pad-x', 'pad-y', 'pad-top', 'pad-right', 'pad-btm', 'pad-left',
      'mar', 'mar-x', 'mar-y', 'mar-top', 'mar-right', 'mar-btm', 'mar-left',
      'gap', 'gap-x', 'gap-y',
      'canvas-w', 'canvas-h',
      'pos-top', 'pos-right', 'pos-btm', 'pos-left', 'pos-inset',
      'scroll-pad', 'scroll-mar', 'indent', 'stroke-gap', 'shape-mar'
    ]
    for (const [key] of Object.entries(this.tokens.spacing)) {
      for (const cap of spacingCaps) {
        classes.add(`${cap}:${key}`)
      }
    }
  }

  addRadiusClasses(classes) {
    if (!this.tokens.radius) return
    const caps = ['curve', 'curve-tl', 'curve-tr', 'curve-bl', 'curve-br']
    for (const [key] of Object.entries(this.tokens.radius)) {
      for (const cap of caps) classes.add(`${cap}:${key}`)
    }
  }

  addShadowClasses(classes) {
    if (!this.tokens.shadows) return
    for (const [key] of Object.entries(this.tokens.shadows)) {
      classes.add(`cast:${key}`)
      classes.add(`cast-text:${key}`)
      classes.add(`cast-inner:${key}`)
      classes.add(`cast-drop:${key}`)
    }
  }

  addTypographyClasses(classes) {
    if (!this.tokens.typography) return
    for (const [key] of Object.entries(this.tokens.typography)) {
      classes.add(`text:${key}`)
      classes.add(`type-size:${key}`)
      classes.add(`type-weight:${key}`)
      classes.add(`leading:${key}`)
    }
  }

  addFontClasses(classes) {
    if (!this.tokens.fonts) return
    for (const [key] of Object.entries(this.tokens.fonts)) {
      classes.add(`type-face:${key}`)
    }
  }

  addEasingClasses(classes) {
    if (!this.tokens.easing) return
    for (const [key] of Object.entries(this.tokens.easing)) {
      classes.add(`ease-curve:${key}`)
      classes.add(`play-curve:${key}`)
    }
  }

  addDurationClasses(classes) {
    if (!this.tokens.duration) return
    for (const [key] of Object.entries(this.tokens.duration)) {
      classes.add(`ease-speed:${key}`)
      classes.add(`ease-wait:${key}`)
      classes.add(`play-speed:${key}`)
      classes.add(`play-wait:${key}`)
    }
  }

  addBlurClasses(classes) {
    if (!this.tokens.blur) return
    for (const [key] of Object.entries(this.tokens.blur)) {
      classes.add(`glass-blur:${key}`)
      classes.add(`glow-blur:${key}`)
    }
  }

  addOpacityClasses(classes) {
    if (!this.tokens.opacity) return
    for (const [key] of Object.entries(this.tokens.opacity)) {
      classes.add(`canvas-fade:${key}`)
    }
  }

  addZIndexClasses(classes) {
    if (!this.tokens.zIndex) return
    for (const [key] of Object.entries(this.tokens.zIndex)) {
      classes.add(`layer:${key}`)
    }
  }

  addLeadingClasses(classes) {
    if (!this.tokens.leading) return
    for (const [key] of Object.entries(this.tokens.leading)) {
      classes.add(`leading:${key}`)
    }
  }

  addTrackingClasses(classes) {
    if (!this.tokens.tracking) return
    for (const [key] of Object.entries(this.tokens.tracking)) {
      classes.add(`tracking:${key}`)
    }
  }

  // ── Generate .d.ts ──
  generateDTS() {
    const classes  = this.getAllClassNames()
    const allNames = Array.from(classes).sort()

    // Add variant versions
    const withVariants = new Set(allNames)
    for (const name of allNames) {
      // Responsive
      for (const bp of Object.keys(this.breakpoints)) {
        withVariants.add(`${bp}:${name}`)
      }
      // State
      for (const state of this.states) {
        withVariants.add(`${state}:${name}`)
      }
      // Dark
      withVariants.add(`dark:${name}`)
      // Print
      withVariants.add(`print:${name}`)
      // Motion
      withVariants.add(`motion-safe:${name}`)
      withVariants.add(`motion-reduce:${name}`)
    }

    const typeUnion = Array.from(withVariants)
      .map(c => `  | ${JSON.stringify(c)}`)
      .join('\n')

    return `// Generated by Mizumi 🌊 — DO NOT EDIT
// All available Mizumi class names with full variant support

export type MizumiClass =
${typeUnion}

export type MizumiClasses = MizumiClass | string

// Pattern names
export type MizumiPattern = ${
  Object.keys(this.patterns).length > 0
    ? Object.keys(this.patterns).map(p => JSON.stringify(p)).join(' | ')
    : 'string'
}

// Animation names  
export type MizumiAnimation = ${
  Object.keys(this.animations).length > 0
    ? Object.keys(this.animations).map(a => JSON.stringify(a)).join(' | ')
    : 'string'
}

// Token categories
export interface MizumiTokens {
  colors?:     Record<string, string | Record<string, string>>
  spacing?:    Record<string, string>
  typography?: Record<string, { size?: string; weight?: string; line?: string }>
  fonts?:      Record<string, string>
  radius?:     Record<string, string>
  shadows?:    Record<string, string>
  easing?:     Record<string, string>
  duration?:   Record<string, string>
  blur?:       Record<string, string>
  opacity?:    Record<string, string>
  zIndex?:     Record<string, number>
  leading?:    Record<string, string>
  tracking?:   Record<string, string>
}

// Full config type
export interface MizumiConfig {
  tokens?:     MizumiTokens
  patterns?:   Record<string, string>
  animations?: Record<string, Record<string, unknown>>
  rules?: {
    responsive?:  boolean
    darkMode?:    'class' | 'media' | false
    print?:       boolean
    motion?:      boolean
    orientation?: boolean
    breakpoints?: Record<string, string>
    containers?:  Record<string, Record<string, string>>
  }
}

declare function mizu(...classes: MizumiClasses[]): string
export { mizu }
export default MizumiConfig
`
  }

  // ── Generate JS helpers ──
  generateHelpers() {
    const classes  = this.getAllClassNames()
    const allNames = Array.from(classes).sort()
    const patterns = Object.keys(this.patterns)

    return `// Generated by Mizumi 🌊 — DO NOT EDIT
// JS helpers for class name safety and composition

/**
 * mizu() — type-safe class name composer
 * Filters out falsy values, joins with space
 *
 * Usage:
 *   mizu('pad:md', 'paint:primary', isActive && 'paint:primary-600')
 *   mizu('card', condition ? 'cast:lg' : 'cast:sm')
 */
export function mizu(...classes) {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
}

/**
 * All valid Mizumi class names from your current config
 */
export const MIZUMI_CLASSES = ${JSON.stringify(allNames, null, 2)}

/**
 * Your pattern names
 */
export const MIZUMI_PATTERNS = ${JSON.stringify(patterns, null, 2)}

/**
 * Check if a string is a valid Mizumi class
 */
const CLASS_SET = new Set(MIZUMI_CLASSES)
export function isMizumiClass(cls) {
  // Check exact match
  if (CLASS_SET.has(cls)) return true

  // Check variant prefixes: hover:, md:, dark:
  const colonIdx = cls.indexOf(':')
  if (colonIdx > 0) {
    const prefix = cls.slice(0, colonIdx)
    const rest   = cls.slice(colonIdx + 1)
    const validPrefixes = [
      'hover','focus','active','disabled','checked',
      'focus-visible','focus-within','first','last','odd','even',
      'dark','print','motion-safe','motion-reduce',
      'sm','md','lg','xl','2xl',
    ]
    if (validPrefixes.includes(prefix)) return CLASS_SET.has(rest)
  }

  // Check animation prop syntax: animate-fade-in{duration:2}
  if (cls.includes('{') && cls.includes('}')) {
    const base = cls.replace(/\{[^}]*\}/, '')
    return CLASS_SET.has(base)
  }

  return false
}

/**
 * cx() — alias for mizu() with conditional support
 * Supports object syntax: cx({ 'paint:primary': isActive })
 */
export function cx(...args) {
  return args
    .flat()
    .map(arg => {
      if (!arg) return ''
      if (typeof arg === 'string') return arg
      if (typeof arg === 'object') {
        return Object.entries(arg)
          .filter(([, condition]) => Boolean(condition))
          .map(([cls]) => cls)
          .join(' ')
      }
      return ''
    })
    .filter(Boolean)
    .join(' ')
}
`
  }
}