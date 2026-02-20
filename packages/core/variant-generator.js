// packages/core/variant-generator.js

import { getAllUtilities } from './class-resolver.js'

export class VariantGenerator {
  constructor(config) {
    this.rules = config.rules || {};
    this.tokens = config.tokens || {};
    this.patterns = config.patterns || {};

    this.breakpoints = this.rules.breakpoints || {
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px'
    };

    this.states = ['hover', 'focus', 'active', 'disabled', 'focus-visible'];
  }

  /**
   * Generate ALL utility class CSS (token-based)
   * We need this to generate responsive/state variants of them
   */
  getAllUtilityCSS(patternExpander) {
    return getAllUtilities(this.tokens)
  }

  /**
   * Generate responsive variant CSS
   * sm:card, md:flex-center, lg:hidden etc
   */
  generateResponsiveCSS(patternExpander) {
    if (!this.rules.responsive) return '';

    const lines = ['/* ===== RESPONSIVE VARIANTS ===== */'];
    const utilities = this.getAllUtilityCSS(patternExpander);

    for (const [bp, size] of Object.entries(this.breakpoints)) {
      lines.push(`\n@media (min-width: ${size}) {`);

      for (const utility of utilities) {
        // Escape the colon in class name for CSS
        const escapedClass = `${bp}\\:${utility.class}`;
        lines.push(`  .${escapedClass} { ${utility.css} }`);
      }

      lines.push('}');
    }

    return lines.join('\n');
  }

  /**
   * Generate state variant CSS
   * hover:bg-primary, focus:border-primary, active:scale-95 etc
   */
  generateStateCSS(patternExpander) {
    const lines = ['/* ===== STATE VARIANTS ===== */'];
    const utilities = this.getAllUtilityCSS(patternExpander);

    const statePseudoMap = {
      'hover':        ':hover',
      'focus':        ':focus',
      'active':       ':active',
      'disabled':     ':disabled',
      'focus-visible':':focus-visible',
      'focus-within': ':focus-within',
      'checked':      ':checked',
      'placeholder':  '::placeholder',
    };

    for (const [state, pseudo] of Object.entries(statePseudoMap)) {
      for (const utility of utilities) {
        const escapedClass = `${state}\\:${utility.class}`;
        lines.push(`.${escapedClass}${pseudo} { ${utility.css} }`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate dark mode CSS
   * dark:bg-neutral-900, dark:color-white etc
   */
generateDarkModeCSS(patternExpander) {
  if (!this.rules.darkMode) return '';

  const lines = ['/* ===== DARK MODE VARIANTS ===== */'];
  const utilities = this.getAllUtilityCSS(patternExpander);
  const strategy  = this.rules.darkMode === 'media' ? 'media' : 'class';

  if (strategy === 'media') {
    lines.push('@media (prefers-color-scheme: dark) {');
    for (const utility of utilities) {
      lines.push(`  .dark\\:${utility.class} { ${utility.css} }`);
    }
    lines.push('}');
  } else {
    // Class strategy - .dark on <html> triggers dark variants
    for (const utility of utilities) {
      lines.push(`.dark .dark\\:${utility.class} { ${utility.css} }`);
    }
  }

  return lines.join('\n');
}
}
