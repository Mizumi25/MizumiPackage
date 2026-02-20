// packages/core/utility-generator.js
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
    return this.generate()
      .map(u => `${u.class} { ${u.css} }`)
      .join('\n')
  }
}