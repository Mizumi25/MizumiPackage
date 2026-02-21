// packages/core/pattern-expander.js
// Expands patterns into resolved CSS
// Colon-aware: pad:md, paint:primary, curve:lg
// Conflict detection via CAPABILITY_PROPERTY_MAP

import { resolveClass, CAPABILITY_PROPERTY_MAP } from './class-resolver.js'

export class PatternExpander {
  constructor(patterns) {
    this.patterns = patterns || {}
  }

  // Expand one pattern by name — recursive for nested patterns
  expand(name) {
    if (!this.patterns[name]) return null

    const classes  = this.patterns[name].split(/\s+/).filter(Boolean)
    const expanded = []

    for (const cls of classes) {
      if (this.patterns[cls]) {
        const nested = this.expand(cls)
        if (nested) expanded.push(...nested.split(/\s+/))
      } else {
        expanded.push(cls)
      }
    }

    return this.deduplicate(expanded).join(' ')
  }

  // Expand a full className string (mixed patterns + utilities)
  expandClasses(classNames) {
    const classes  = classNames.split(/\s+/).filter(Boolean)
    const expanded = []

    for (const cls of classes) {
      const pattern = this.expand(cls)
      if (pattern) {
        expanded.push(...pattern.split(/\s+/))
      } else {
        expanded.push(cls)
      }
    }

    return this.deduplicate(expanded).join(' ')
  }

  // Extract capability from colon syntax — pad:md → pad
  getCapability(cls) {
    // Strip variant prefix first: hover\:pad:md → pad:md
    const clean = cls.replace(/^[^\\]+\\:/, '')

    // Handle prop syntax: pad:md{lg} → pad
    const withoutProps = clean.replace(/\{[^}]*\}/, '')

    // Split on colon — capability is everything before last colon
    const colonIdx = withoutProps.indexOf(':')
    if (colonIdx === -1) return null

    return withoutProps.slice(0, colonIdx)
  }

  // Map capability to CSS property for conflict detection
  getCSSProperty(cls) {
    const capability = this.getCapability(cls)
    if (!capability) return null
    return CAPABILITY_PROPERTY_MAP[capability] || null
  }

  // Remove duplicate CSS properties — last one wins
  deduplicate(classes) {
    const propertyMap = new Map() // cssProperty → { cls, index }
    const noConflict  = []        // classes with no conflict detection

    for (let i = 0; i < classes.length; i++) {
      const cls      = classes[i]
      const property = this.getCSSProperty(cls)

      if (property) {
        propertyMap.set(property, { cls, index: i })
      } else {
        noConflict.push({ cls, index: i })
      }
    }

    // Merge and sort by original index
    return [
      ...Array.from(propertyMap.values()),
      ...noConflict
    ]
      .sort((a, b) => a.index - b.index)
      .map(item => item.cls)
  }

  // Generate CSS for all patterns
  toCSS() {
    const lines = []

    for (const [name] of Object.entries(this.patterns)) {
      const expanded = this.expand(name)
      if (!expanded) continue

      const props = []
      for (const cls of expanded.split(/\s+/)) {
        // Strip any variant prefix before resolving
        const base = cls.replace(/^[^\\]+\\:/, '')
        const css  = resolveClass(base)
        if (css) props.push(`  ${css}`)
      }

      if (props.length > 0) {
        lines.push(`.${name} {`)
        lines.push(...props)
        lines.push('}')
        lines.push('')
      }
    }

    return lines.join('\n')
  }
}