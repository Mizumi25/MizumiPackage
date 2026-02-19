// packages/core/parser.js

/**
 * Parse design tokens config and generate CSS variables
 */
export class TokenParser { 
  constructor(config) {
    this.config = config;
  }

  /**
   * Convert tokens to CSS variables
   * Input: { colors: { primary: '#3B82F6' } }
   * Output: { '--color-primary': '#3B82F6' }
   */
  parse() {
    const cssVars = {};
    
    // Parse colors
    if (this.config.colors) {
      this.parseColors(this.config.colors, cssVars);
    }
    
    // Parse spacing
    if (this.config.spacing) {
      this.parseSpacing(this.config.spacing, cssVars);
    }
    
    // Parse typography
    if (this.config.typography) {
      this.parseTypography(this.config.typography, cssVars);
    }
    
    // Parse radius
    if (this.config.radius) {
      this.parseRadius(this.config.radius, cssVars);
    }
    
    // Parse shadows
    if (this.config.shadows) {
      this.parseShadows(this.config.shadows, cssVars);
    }
    
    return cssVars;
  }

  parseColors(colors, cssVars, prefix = 'color') {
    for (const [key, value] of Object.entries(colors)) {
      if (typeof value === 'object') {
        // Nested object (e.g., primary: { 50: '#EFF6FF', 600: '#2563EB' })
        for (const [shade, color] of Object.entries(value)) {
          const varName = shade === 'DEFAULT' 
            ? `--${prefix}-${key}` 
            : `--${prefix}-${key}-${shade}`;
          cssVars[varName] = color;
        }
      } else {
        // Simple value (e.g., primary: '#3B82F6')
        cssVars[`--${prefix}-${key}`] = value;
      }
    }
  }

  parseSpacing(spacing, cssVars) {
    for (const [key, value] of Object.entries(spacing)) {
      cssVars[`--spacing-${key}`] = value;
    }
  }

  parseTypography(typography, cssVars) {
    for (const [key, value] of Object.entries(typography)) {
      if (typeof value === 'object') {
        cssVars[`--text-${key}-size`] = value.size;
        cssVars[`--text-${key}-weight`] = value.weight;
        cssVars[`--text-${key}-line`] = value.line;
      } else {
        cssVars[`--text-${key}`] = value;
      }
    }
  }

  parseRadius(radius, cssVars) {
    for (const [key, value] of Object.entries(radius)) {
      cssVars[`--radius-${key}`] = value;
    }
  }

  parseShadows(shadows, cssVars) {
    for (const [key, value] of Object.entries(shadows)) {
      cssVars[`--shadow-${key}`] = value;
    }
  }

  /**
   * Generate CSS string from parsed variables
   */
  toCSS() {
    const vars = this.parse();
    const cssLines = [':root {'];
    
    for (const [name, value] of Object.entries(vars)) {
      cssLines.push(`  ${name}: ${value};`);
    }
    
    cssLines.push('}');
    
    return cssLines.join('\n');
  }
}
