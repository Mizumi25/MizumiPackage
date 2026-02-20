// packages/core/pattern-expander.js


import { resolveClass } from './class-resolver.js'
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
  const cssLines = []

  for (const [patternName] of Object.entries(this.patterns)) {
    const expanded = this.expand(patternName)
    if (!expanded) continue

    const cssProps = []
    for (const cls of expanded.split(' ')) {
      const prop = resolveClass(cls)
      if (prop) cssProps.push(`  ${prop}`)
    }

    if (cssProps.length > 0) {
      cssLines.push(`.${patternName} {`)
      cssLines.push(...cssProps)
      cssLines.push('}')
      cssLines.push('')
    }
  }

  return cssLines.join('\n')
}


}
