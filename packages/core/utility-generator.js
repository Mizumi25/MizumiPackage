// packages/core/utility-generator.js
// Generates all Mizumi utility classes from token config
// Syntax: capability:token → CSS property: var(--token)

import { generateTokenUtilities, STATIC_UTILITIES } from './class-resolver.js'

export class UtilityGenerator {
  constructor(tokens) {
    this.tokens = tokens
  }

  generate() {
    return [
      ...generateTokenUtilities(this.tokens),
      ...STATIC_UTILITIES
    ]
  }

  toCSS() {
    const lines  = []
    const all    = this.generate()
    const seen   = new Set()

    for (const u of all) {
      if (seen.has(u.class)) continue
      seen.add(u.class)

      // Escape colon in CSS selector
      const selector = u.class.replace(/:/g, '\\:')
      lines.push(`.${selector} { ${u.css} }`)
    }

    return lines.join('\n')
  }
}