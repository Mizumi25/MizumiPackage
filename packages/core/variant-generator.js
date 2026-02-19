// packages/core/variant-generator.js

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
   * Generate ALL utility class CSS (token-based + static)
   * We need this to generate responsive/state variants of them
   */
  getAllUtilityCSS(patternExpander) {
    const utilities = [];

    // Token-based utilities
    if (this.tokens.colors) {
      for (const [k, v] of Object.entries(this.tokens.colors)) {
        if (typeof v === 'object') {
          for (const [shade] of Object.entries(v)) {
            const s = shade === 'DEFAULT' ? '' : `-${shade}`;
            utilities.push({ class: `bg-${k}${s}`,     css: `background-color: var(--color-${k}${s});` });
            utilities.push({ class: `color-${k}${s}`,  css: `color: var(--color-${k}${s});` });
            utilities.push({ class: `border-${k}${s}`, css: `border-color: var(--color-${k}${s});` });
          }
        } else {
          utilities.push({ class: `bg-${k}`,     css: `background-color: var(--color-${k});` });
          utilities.push({ class: `color-${k}`,  css: `color: var(--color-${k});` });
          utilities.push({ class: `border-${k}`, css: `border-color: var(--color-${k});` });
        }
      }
    }

    if (this.tokens.spacing) {
      for (const [k] of Object.entries(this.tokens.spacing)) {
        utilities.push({ class: `pad-${k}`,   css: `padding: var(--spacing-${k});` });
        utilities.push({ class: `pad-x-${k}`, css: `padding-left: var(--spacing-${k}); padding-right: var(--spacing-${k});` });
        utilities.push({ class: `pad-y-${k}`, css: `padding-top: var(--spacing-${k}); padding-bottom: var(--spacing-${k});` });
        utilities.push({ class: `mar-${k}`,   css: `margin: var(--spacing-${k});` });
        utilities.push({ class: `mar-x-${k}`, css: `margin-left: var(--spacing-${k}); margin-right: var(--spacing-${k});` });
        utilities.push({ class: `mar-y-${k}`, css: `margin-top: var(--spacing-${k}); margin-bottom: var(--spacing-${k});` });
        utilities.push({ class: `gap-${k}`,   css: `gap: var(--spacing-${k});` });
      }
    }

    if (this.tokens.radius) {
      for (const [k] of Object.entries(this.tokens.radius)) {
        utilities.push({ class: `rounded-${k}`, css: `border-radius: var(--radius-${k});` });
      }
    }

    if (this.tokens.shadows) {
      for (const [k] of Object.entries(this.tokens.shadows)) {
        utilities.push({ class: `shadow-${k}`, css: `box-shadow: var(--shadow-${k});` });
      }
    }

    if (this.tokens.typography) {
      for (const [k] of Object.entries(this.tokens.typography)) {
        utilities.push({
          class: `text-${k}`,
          css: `font-size: var(--text-${k}-size); font-weight: var(--text-${k}-weight); line-height: var(--text-${k}-line);`
        });
      }
    }

    // Static utilities
    const statics = [
      { class: 'flex',            css: 'display: flex;' },
      { class: 'flex-col',        css: 'flex-direction: column;' },
      { class: 'flex-wrap',       css: 'flex-wrap: wrap;' },
      { class: 'items-center',    css: 'align-items: center;' },
      { class: 'items-start',     css: 'align-items: flex-start;' },
      { class: 'items-end',       css: 'align-items: flex-end;' },
      { class: 'justify-center',  css: 'justify-content: center;' },
      { class: 'justify-between', css: 'justify-content: space-between;' },
      { class: 'justify-start',   css: 'justify-content: flex-start;' },
      { class: 'justify-end',     css: 'justify-content: flex-end;' },
      { class: 'inline-flex',     css: 'display: inline-flex;' },
      { class: 'grid',            css: 'display: grid;' },
      { class: 'block',           css: 'display: block;' },
      { class: 'hidden',          css: 'display: none;' },
      { class: 'relative',        css: 'position: relative;' },
      { class: 'absolute',        css: 'position: absolute;' },
      { class: 'fixed',           css: 'position: fixed;' },
      { class: 'sticky',          css: 'position: sticky; top: 0;' },
      { class: 'w-full',          css: 'width: 100%;' },
      { class: 'h-full',          css: 'height: 100%;' },
      { class: 'min-h-screen',    css: 'min-height: 100vh;' },
      { class: 'mx-auto',         css: 'margin-left: auto; margin-right: auto;' },
      { class: 'cursor-pointer',  css: 'cursor: pointer;' },
      { class: 'overflow-hidden', css: 'overflow: hidden;' },
      { class: 'transition',      css: 'transition: all 0.3s ease;' },
      { class: 'text-center',     css: 'text-align: center;' },
      { class: 'font-bold',       css: 'font-weight: 700;' },
      { class: 'font-medium',     css: 'font-weight: 500;' },
      { class: 'border',          css: 'border-width: 1px; border-style: solid;' },
      { class: 'opacity-0',       css: 'opacity: 0;' },
      { class: 'opacity-50',      css: 'opacity: 0.5;' },
      { class: 'opacity-100',     css: 'opacity: 1;' },
    ];

    utilities.push(...statics);

    // Also include patterns as utilities
    for (const [name] of Object.entries(this.patterns)) {
      const expanded = patternExpander.expand(name);
      if (!expanded) continue;
      const cssProps = [];
      for (const cls of expanded.split(' ')) {
        const prop = patternExpander.utilityToCSS(cls);
        if (prop) cssProps.push(prop);
      }
      if (cssProps.length > 0) {
        utilities.push({ class: name, css: cssProps.join(' ') });
      }
    }

    return utilities;
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
