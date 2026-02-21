// packages/core/variant-generator.js
// Generates responsive, state, dark mode, and container query variants
// Colon syntax aware — md\:pad\:lg, hover\:paint\:primary, @card\:pad\:md

import { getAllUtilities } from './class-resolver.js'

export class VariantGenerator {
  constructor(config) {
    this.rules    = config.rules    || {}
    this.tokens   = config.tokens   || {}
    this.patterns = config.patterns || {}

    this.breakpoints = this.rules.breakpoints || {
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px'
    }

    this.states = {
      'hover':         ':hover',
      'focus':         ':focus',
      'active':        ':active',
      'disabled':      ':disabled',
      'focus-visible': ':focus-visible',
      'focus-within':  ':focus-within',
      'checked':       ':checked',
      'empty':         ':empty',
      'first':         ':first-child',
      'last':          ':last-child',
      'odd':           ':nth-child(odd)',
      'even':          ':nth-child(even)',
      'visited':       ':visited',
      'placeholder':   '::placeholder',
      'before':        '::before',
      'after':         '::after',
      'selection':     '::selection',
    }
  }

  // ── Responsive — md\:pad\:lg ──
  generateResponsiveCSS(patternExpander) {
    if (!this.rules.responsive) return ''

    const lines     = []
    const utilities = getAllUtilities(this.tokens)

    for (const [bp, size] of Object.entries(this.breakpoints)) {
      lines.push(`\n@media (min-width: ${size}) {`)

      for (const u of utilities) {
        // Escape both the breakpoint colon and the utility colon
        const selector = `${bp}\\:${u.class.replace(/:/g, '\\:')}`
        lines.push(`  .${selector} { ${u.css} }`)
      }



      lines.push('}')
    }

    return lines.join('\n')
  }

  // ── State variants — hover\:paint\:primary ──
  generateStateCSS(patternExpander) {
    const lines     = []
    const utilities = getAllUtilities(this.tokens)

    for (const [state, pseudo] of Object.entries(this.states)) {
      for (const u of utilities) {
        const selector = `${state}\\:${u.class.replace(/:/g, '\\:')}`
        lines.push(`.${selector}${pseudo} { ${u.css} }`)
      }
    }

    return lines.join('\n')
  }

  // ── Dark mode — dark\:paint\:neutral-900 ──
  generateDarkModeCSS(patternExpander) {
    if (!this.rules.darkMode) return ''

    const lines     = []
    const utilities = getAllUtilities(this.tokens)
    const strategy  = this.rules.darkMode === 'media' ? 'media' : 'class'

    if (strategy === 'media') {
      lines.push('@media (prefers-color-scheme: dark) {')
      for (const u of utilities) {
        const selector = `dark\\:${u.class.replace(/:/g, '\\:')}`
        lines.push(`  .${selector} { ${u.css} }`)
      }
      lines.push('}')
    } else {
      for (const u of utilities) {
        const selector = `dark\\:${u.class.replace(/:/g, '\\:')}`
        lines.push(`.dark .${selector} { ${u.css} }`)
      }
    }

    return lines.join('\n')
  }

  // ── Container Queries — @card\:pad\:md ──
  // Usage in HTML: class="@card:pad:md"
  // Requires parent: frame-name:card frame-type:inline
  generateContainerCSS(patternExpander) {
    if (!this.rules.containers) return ''

    const lines     = []
    const utilities = getAllUtilities(this.tokens)
    const containers = this.rules.containers || {}

    // Named containers with size queries
    // containers: { card: { sm: '300px', md: '500px' } }
    for (const [containerName, sizes] of Object.entries(containers)) {
      for (const [sizeName, sizeValue] of Object.entries(sizes)) {
        lines.push(`\n@container ${containerName} (min-width: ${sizeValue}) {`)

        for (const u of utilities) {
          // Selector: @card-sm:pad:md → escaped for CSS
          const selector = `\\@${containerName}-${sizeName}\\:${u.class.replace(/:/g, '\\:')}`
          lines.push(`  .${selector} { ${u.css} }`)
        }

        lines.push('}')
      }
    }

    return lines.join('\n')
  }

  // ── Print variants — print\:canvas-show\:hidden ──
  generatePrintCSS() {
    if (!this.rules.print) return ''

    const lines     = []
    const utilities = getAllUtilities(this.tokens)

    lines.push('@media print {')
    for (const u of utilities) {
      const selector = `print\\:${u.class.replace(/:/g, '\\:')}`
      lines.push(`  .${selector} { ${u.css} }`)
    }
    lines.push('}')

    return lines.join('\n')
  }

  // ── Motion preferences — motion-safe, motion-reduce ──
  generateMotionCSS() {
    if (!this.rules.motion) return ''

    const lines     = []
    const utilities = getAllUtilities(this.tokens)

    lines.push('@media (prefers-reduced-motion: no-preference) {')
    for (const u of utilities) {
      const selector = `motion-safe\\:${u.class.replace(/:/g, '\\:')}`
      lines.push(`  .${selector} { ${u.css} }`)
    }
    lines.push('}')

    lines.push('@media (prefers-reduced-motion: reduce) {')
    for (const u of utilities) {
      const selector = `motion-reduce\\:${u.class.replace(/:/g, '\\:')}`
      lines.push(`  .${selector} { ${u.css} }`)
    }
    lines.push('}')

    return lines.join('\n')
  }

  // ── Landscape / Portrait ──
  generateOrientationCSS() {
    if (!this.rules.orientation) return ''

    const lines     = []
    const utilities = getAllUtilities(this.tokens)

    for (const orientation of ['landscape', 'portrait']) {
      lines.push(`@media (orientation: ${orientation}) {`)
      for (const u of utilities) {
        const selector = `${orientation}\\:${u.class.replace(/:/g, '\\:')}`
        lines.push(`  .${selector} { ${u.css} }`)
      }
      lines.push('}')
    }

    return lines.join('\n')
  }
}