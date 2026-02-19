// packages/core/pattern-expander.js

/**
 * Expand patterns into utility classes
 */
export class PatternExpander {
  constructor(patterns) {
    this.patterns = patterns || {};
  }

  /**
   * Expand a pattern to its utility classes
   * Example: 'card' -> 'bg-surface pad-md rounded-lg shadow-md'
   */
  expand(patternName) {
    if (!this.patterns[patternName]) {
      return null; // Pattern not found
    }
    
    const patternValue = this.patterns[patternName];
    
    // Check if pattern references other patterns
    const classes = patternValue.split(' ');
    const expanded = [];
    
    for (const className of classes) {
      // If this class is also a pattern, expand it recursively
      if (this.patterns[className]) {
        const nested = this.expand(className);
        if (nested) {
          expanded.push(...nested.split(' '));
        } else {
          expanded.push(className);
        }
      } else {
        expanded.push(className);
      }
    }
    
    return expanded.join(' ');
  }

  /**
   * Expand multiple class names (including patterns)
   * Example: 'card hover-lift' -> 'bg-surface pad-md rounded-lg shadow-md hover-lift'
   */
  expandClasses(classNames) {
    const classes = classNames.split(' ').filter(Boolean);
    const expanded = [];
    
    for (const className of classes) {
      const expandedPattern = this.expand(className);
      if (expandedPattern) {
        expanded.push(...expandedPattern.split(' '));
      } else {
        // Not a pattern, keep as-is
        expanded.push(className);
      }
    }
    
    // Remove duplicates (keep last occurrence for override behavior)
    return this.deduplicateClasses(expanded);
  }

  /**
   * Remove duplicate classes (last one wins)
   */
  deduplicateClasses(classes) {
    const seen = new Map();
    
    for (let i = 0; i < classes.length; i++) {
      const className = classes[i];
      const property = this.getPropertyFromClass(className);
      
      if (property) {
        // If we've seen this property before, update the index
        seen.set(property, { className, index: i });
      } else {
        // Unknown property or non-conflicting class, keep it
        seen.set(className, { className, index: i });
      }
    }
    
    // Sort by original index and extract class names
    return Array.from(seen.values())
      .sort((a, b) => a.index - b.index)
      .map(item => item.className);
  }

  /**
   * Get CSS property from class name (for conflict detection)
   * Example: 'pad-md' -> 'padding', 'bg-primary' -> 'background'
   */
  getPropertyFromClass(className) {
    if (className.startsWith('pad-')) return 'padding';
    if (className.startsWith('mar-')) return 'margin';
    if (className.startsWith('bg-')) return 'background';
    if (className.startsWith('color-')) return 'color';
    if (className.startsWith('shadow-')) return 'box-shadow';
    if (className.startsWith('rounded-')) return 'border-radius';
    if (className.startsWith('border-')) return 'border';
    
    return null; // No conflict detection for this class
  }

  /**
   * Generate CSS from patterns
   */
  toCSS() {
  const cssLines = [];

  for (const [patternName] of Object.entries(this.patterns)) {
    const expanded = this.expand(patternName);
    if (!expanded) continue;

    // Convert each expanded utility to actual CSS properties
    const cssProps = [];
    for (const cls of expanded.split(' ')) {
      const prop = this.utilityToCSS(cls);
      if (prop) cssProps.push(`  ${prop}`);
    }

    if (cssProps.length > 0) {
      cssLines.push(`.${patternName} {`);
      cssLines.push(...cssProps);
      cssLines.push('}');
      cssLines.push('');
    }
  }

  return cssLines.join('\n');
}

utilityToCSS(className) {
  const bg      = className.match(/^bg-(.+)$/);
  if (bg) return `background-color: var(--color-${bg[1]});`;

  const color   = className.match(/^color-(.+)$/);
  if (color) return `color: var(--color-${color[1]});`;

  const padx    = className.match(/^pad-x-(.+)$/);
  if (padx) return `padding-left: var(--spacing-${padx[1]}); padding-right: var(--spacing-${padx[1]});`;

  const pady    = className.match(/^pad-y-(.+)$/);
  if (pady) return `padding-top: var(--spacing-${pady[1]}); padding-bottom: var(--spacing-${pady[1]});`;

  const pad     = className.match(/^pad-(.+)$/);
  if (pad) return `padding: var(--spacing-${pad[1]});`;

  const marx    = className.match(/^mar-x-(.+)$/);
  if (marx) return `margin-left: var(--spacing-${marx[1]}); margin-right: var(--spacing-${marx[1]});`;

  const mary    = className.match(/^mar-y-(.+)$/);
  if (mary) return `margin-top: var(--spacing-${mary[1]}); margin-bottom: var(--spacing-${mary[1]});`;

  const mar     = className.match(/^mar-(.+)$/);
  if (mar) return `margin: var(--spacing-${mar[1]});`;

  const gap     = className.match(/^gap-(.+)$/);
  if (gap) return `gap: var(--spacing-${gap[1]});`;

  const rounded = className.match(/^rounded-(.+)$/);
  if (rounded) return `border-radius: var(--radius-${rounded[1]});`;

  const shadow  = className.match(/^shadow-(.+)$/);
  if (shadow) return `box-shadow: var(--shadow-${shadow[1]});`;

  const text    = className.match(/^text-(.+)$/);
  if (text) return `font-size: var(--text-${text[1]}-size); font-weight: var(--text-${text[1]}-weight); line-height: var(--text-${text[1]}-line);`;

  const border  = className.match(/^border-(.+)$/);
  if (border) return `border-color: var(--color-${border[1]});`;

  const staticMap = {
    'flex':            'display: flex;',
    'flex-col':        'flex-direction: column;',
    'flex-wrap':       'flex-wrap: wrap;',
    'items-center':    'align-items: center;',
    'items-start':     'align-items: flex-start;',
    'items-end':       'align-items: flex-end;',
    'justify-center':  'justify-content: center;',
    'justify-between': 'justify-content: space-between;',
    'justify-start':   'justify-content: flex-start;',
    'justify-end':     'justify-content: flex-end;',
    'inline-flex':     'display: inline-flex;',
    'grid':            'display: grid;',
    'block':           'display: block;',
    'inline':          'display: inline;',
    'inline-block':    'display: inline-block;',
    'hidden':          'display: none;',
    'relative':        'position: relative;',
    'absolute':        'position: absolute;',
    'fixed':           'position: fixed;',
    'sticky':          'position: sticky; top: 0;',
    'w-full':          'width: 100%;',
    'h-full':          'height: 100%;',
    'min-h-screen':    'min-height: 100vh;',
    'mx-auto':         'margin-left: auto; margin-right: auto;',
    'cursor-pointer':  'cursor: pointer;',
    'overflow-hidden': 'overflow: hidden;',
    'transition':      'transition: all 0.3s ease;',
    'text-center':     'text-align: center;',
    'font-bold':       'font-weight: 700;',
    'font-medium':     'font-weight: 500;',
    'list-none':       'list-style: none;',
    'border':          'border-width: 1px; border-style: solid;',
    'max-w-sm':        'max-width: 640px;',
    'max-w-md':        'max-width: 768px;',
    'max-w-lg':        'max-width: 1024px;',
    'max-w-xl':        'max-width: 1280px;',
  };

  return staticMap[className] || null;
}
}
