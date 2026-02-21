// packages/core/validator.js
// Enforces Mizumi-only vocabulary inside patterns and tokens
// Rejects raw CSS values and Tailwind classes with helpful messages

import { CAPABILITY_PROPERTY_MAP, STATIC_UTILITIES } from './class-resolver.js'

// All valid Mizumi capability prefixes
const VALID_CAPABILITIES = new Set(Object.keys(CAPABILITY_PROPERTY_MAP))

// All valid static class names
const VALID_STATIC = new Set(STATIC_UTILITIES.map(u => u.class))

// Known Tailwind patterns to detect and warn about
const TAILWIND_PATTERNS = [
  /^p-\d+$/,          // p-4
  /^px-\d+$/,         // px-4
  /^py-\d+$/,         // py-4
  /^m-\d+$/,          // m-4
  /^mx-\d+$/,         // mx-4
  /^my-\d+$/,         // my-4
  /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)$/,
  /^bg-(white|black|gray|red|blue|green|yellow|purple|pink|indigo|orange)-\d+$/,
  /^rounded(-(none|sm|md|lg|xl|full))?$/,
  /^shadow(-(sm|md|lg|xl|2xl|inner|none))?$/,
  /^font-(thin|light|normal|medium|semibold|bold|extrabold|black)$/,
  /^(flex|grid|block|inline|hidden)$/,          // these overlap — allow
  /^items-(start|end|center|baseline|stretch)$/, // tailwind align
  /^justify-(start|end|center|between|around|evenly)$/,
  /^w-(full|screen|auto|\d+)$/,
  /^h-(full|screen|auto|\d+)$/,
  /^gap-\d+$/,
  /^space-(x|y)-\d+$/,
]

// Raw CSS value patterns (not allowed as class names)
const RAW_CSS_PATTERNS = [
  /^[a-z-]+:\s+.+;?$/,   // padding: 16px  (space after colon = CSS property)
  /^\d+px$/,              // 16px bare value
  /^#[0-9a-fA-F]{3,8}$/, // #3B82F6
  /^rgba?\(/,             // rgba(...)
  /^var\(--/,             // var(--token)
]

export class Validator {
  constructor(config) {
    this.config   = config
    this.errors   = []
    this.warnings = []
  }

  validate() {
    this.errors   = []
    this.warnings = []

    this.validatePatterns()
    this.validateTokens()
    this.validateAnimations()

    return {
      valid    : this.errors.length === 0,
      errors   : this.errors,
      warnings : this.warnings
    }
  }

  validatePatterns() {
    const patterns = this.config.patterns || {}

    for (const [name, value] of Object.entries(patterns)) {
      if (typeof value !== 'string') {
        this.errors.push(`Pattern "${name}" must be a string of Mizumi utilities`)
        continue
      }

      const classes = value.split(/\s+/).filter(Boolean)

      for (const cls of classes) {
        this.validateClass(cls, `pattern "${name}"`)
      }
    }
  }

  validateClass(cls, context) {
    // Skip animation/GSAP classes — they have their own system
    if (this.isAnimationClass(cls)) return

    // Skip if it's a valid static utility
    if (VALID_STATIC.has(cls)) return

    // Check for raw CSS values
    for (const pattern of RAW_CSS_PATTERNS) {
      if (pattern.test(cls)) {
        this.errors.push(
          `❌ Raw CSS value "${cls}" in ${context} — use Mizumi utilities instead\n` +
          `   Example: padding: 16px → pad:md`
        )
        return
      }
    }

    // Check for Tailwind classes
    for (const pattern of TAILWIND_PATTERNS) {
      if (pattern.test(cls)) {
        this.warnings.push(
          `⚠️  Possible Tailwind class "${cls}" in ${context}\n` +
          `   Mizumi equivalent: ${this.suggestMizumi(cls)}`
        )
        return
      }
    }

    // Validate colon syntax classes
    if (cls.includes(':')) {
      const colonIdx  = cls.indexOf(':')
      const capability = cls.slice(0, colonIdx)
      const token      = cls.slice(colonIdx + 1)

      // Strip prop syntax from token: md{lg} → md
      const cleanToken = token.replace(/\{[^}]*\}/, '')

      if (!VALID_CAPABILITIES.has(capability) && !VALID_STATIC.has(cls)) {
        this.errors.push(
          `❌ Unknown capability "${capability}" in ${context}\n` +
          `   Class: "${cls}"\n` +
          `   Valid capabilities: ${this.getSimilar(capability).join(', ')}`
        )
      }
    }
  }

  validateTokens() {
    const tokens = this.config.tokens || {}

    // Token values should be valid CSS values, not class names
    const checkValue = (key, value, path) => {
      if (typeof value === 'object' && value !== null) {
        for (const [k, v] of Object.entries(value)) {
          checkValue(`${key}-${k}`, v, `${path}.${k}`)
        }
      } else if (typeof value === 'string') {
        // Warn if value looks like a class name instead of a CSS value
        if (VALID_CAPABILITIES.has(value.split(':')[0])) {
          this.warnings.push(
            `⚠️  Token "${path}" has value "${value}" which looks like a class name\n` +
            `   Token values should be CSS values like "16px", "#3B82F6", "1.5"`
          )
        }
      }
    }

    for (const [category, values] of Object.entries(tokens)) {
      if (typeof values === 'object' && values !== null) {
        checkValue(category, values, `tokens.${category}`)
      }
    }
  }

  validateAnimations() {
    const animations = this.config.animations || {}

    for (const [name, config] of Object.entries(animations)) {
      if (typeof config !== 'object') {
        this.errors.push(`Animation "${name}" must be an object config`)
      }
    }
  }

  isAnimationClass(cls) {
    const animPrefixes = [
      'animate-', 'hover-', 'active-', 'scroll-',
      'stagger-', 'focus-', 'click-', 'swipe',
      'pinch', 'press', 'drag', 'pull', 'haptic',
      'spring', 'rubber', 'momentum', 'magnetic'
    ]
    return animPrefixes.some(p => cls.startsWith(p))
  }

  // Suggest Mizumi equivalent for Tailwind classes
  suggestMizumi(tailwindClass) {
    const suggestions = {
      'flex':         'display:flex',
      'grid':         'display:grid',
      'hidden':       'display:none',
      'block':        'display:block',
      'font-bold':    'type-weight:bold',
      'font-medium':  'type-weight:medium',
      'text-center':  'text-align:center',
      'text-left':    'text-align:left',
      'text-right':   'text-align:right',
      'items-center': 'align-yi:center',
      'items-start':  'align-yi:start',
      'justify-center':  'align-x:center',
      'justify-between': 'align-x:between',
      'overflow-hidden': 'overflow:hidden',
      'cursor-pointer':  'cursor:pointer',
      'w-full':       'canvas-w:full',
      'h-full':       'canvas-h:full',
      'relative':     'pos:relative',
      'absolute':     'pos:absolute',
      'fixed':        'pos:fixed',
      'sticky':       'pos:sticky',
    }

    if (suggestions[tailwindClass]) return suggestions[tailwindClass]

    // Pattern-based suggestions
    if (/^p-(\d+)$/.exec(tailwindClass))     return `pad:your-token`
    if (/^px-(\d+)$/.exec(tailwindClass))    return `pad-x:your-token`
    if (/^py-(\d+)$/.exec(tailwindClass))    return `pad-y:your-token`
    if (/^m-(\d+)$/.exec(tailwindClass))     return `mar:your-token`
    if (/^gap-(\d+)$/.exec(tailwindClass))   return `gap:your-token`
    if (/^rounded/.exec(tailwindClass))      return `curve:your-token`
    if (/^shadow/.exec(tailwindClass))       return `cast:your-token`
    if (/^bg-/.exec(tailwindClass))          return `paint:your-color-token`
    if (/^text-/.exec(tailwindClass))        return `text:your-type-token`

    return 'see mizumi vocabulary docs'
  }

  // Find similar capability names for error messages
  getSimilar(input) {
    const all = Array.from(VALID_CAPABILITIES)
    return all
      .filter(cap => cap.startsWith(input[0]) || cap.includes(input.slice(0, 3)))
      .slice(0, 5)
  }
}