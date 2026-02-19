// packages/core/utility-generator.js

/**
 * Generate utility classes from tokens
 */
export class UtilityGenerator {
  constructor(tokens) {
    this.tokens = tokens;
  }

  /**
   * Generate all utility classes
   */
  generate() {
    const utilities = [];
    
    // Color utilities
    utilities.push(...this.generateColorUtilities());
    
    // Spacing utilities
    utilities.push(...this.generateSpacingUtilities());
    
    // Typography utilities
    utilities.push(...this.generateTypographyUtilities());
    
    // Border radius utilities
    utilities.push(...this.generateRadiusUtilities());
    
    // Shadow utilities
    utilities.push(...this.generateShadowUtilities());
    
    // Layout utilities (static)
    utilities.push(...this.generateLayoutUtilities());
    
    return utilities;
  }

  generateColorUtilities() {
    const utilities = [];
    
    if (!this.tokens.colors) return utilities;
    
    for (const [key, value] of Object.entries(this.tokens.colors)) {
      if (typeof value === 'object') {
        // Nested colors
        for (const [shade, color] of Object.entries(value)) {
          const suffix = shade === 'DEFAULT' ? '' : `-${shade}`;
          
          // Text color
          utilities.push({
            class: `.color-${key}${suffix}`,
            css: `color: var(--color-${key}${suffix});`
          });
          
          // Background color
          utilities.push({
            class: `.bg-${key}${suffix}`,
            css: `background-color: var(--color-${key}${suffix});`
          });
          
          // Border color
          utilities.push({
            class: `.border-${key}${suffix}`,
            css: `border-color: var(--color-${key}${suffix});`
          });
        }
      } else {
        // Simple color
        utilities.push({
          class: `.color-${key}`,
          css: `color: var(--color-${key});`
        });
        
        utilities.push({
          class: `.bg-${key}`,
          css: `background-color: var(--color-${key});`
        });
        
        utilities.push({
          class: `.border-${key}`,
          css: `border-color: var(--color-${key});`
        });
      }
    }
    
    return utilities;
  }

  generateSpacingUtilities() {
    const utilities = [];
    
    if (!this.tokens.spacing) return utilities;
    
    for (const [key, value] of Object.entries(this.tokens.spacing)) {
      // Padding
      utilities.push({
        class: `.pad-${key}`,
        css: `padding: var(--spacing-${key});`
      });
      
      utilities.push({
        class: `.pad-x-${key}`,
        css: `padding-left: var(--spacing-${key}); padding-right: var(--spacing-${key});`
      });
      
      utilities.push({
        class: `.pad-y-${key}`,
        css: `padding-top: var(--spacing-${key}); padding-bottom: var(--spacing-${key});`
      });
      
      // Margin
      utilities.push({
        class: `.mar-${key}`,
        css: `margin: var(--spacing-${key});`
      });
      
      utilities.push({
        class: `.mar-x-${key}`,
        css: `margin-left: var(--spacing-${key}); margin-right: var(--spacing-${key});`
      });
      
      utilities.push({
        class: `.mar-y-${key}`,
        css: `margin-top: var(--spacing-${key}); margin-bottom: var(--spacing-${key});`
      });
      
      // Gap
      utilities.push({
        class: `.gap-${key}`,
        css: `gap: var(--spacing-${key});`
      });
    }
    
    return utilities;
  }

  generateTypographyUtilities() {
    const utilities = [];
    
    if (!this.tokens.typography) return utilities;
    
    for (const [key, value] of Object.entries(this.tokens.typography)) {
      if (typeof value === 'object') {
        utilities.push({
          class: `.text-${key}`,
          css: `font-size: ${value.size}; font-weight: ${value.weight}; line-height: ${value.line};`
        });
      }
    }
    
    return utilities;
  }

  generateRadiusUtilities() {
    const utilities = [];
    
    if (!this.tokens.radius) return utilities;
    
    for (const [key, value] of Object.entries(this.tokens.radius)) {
      utilities.push({
        class: `.rounded-${key}`,
        css: `border-radius: var(--radius-${key});`
      });
    }
    
    return utilities;
  }

  generateShadowUtilities() {
    const utilities = [];
    
    if (!this.tokens.shadows) return utilities;
    
    for (const [key, value] of Object.entries(this.tokens.shadows)) {
      utilities.push({
        class: `.shadow-${key}`,
        css: `box-shadow: var(--shadow-${key});`
      });
    }
    
    return utilities;
  }

  generateLayoutUtilities() {
    return [
      { class: '.flex', css: 'display: flex;' },
      { class: '.flex-col', css: 'flex-direction: column;' },
      { class: '.items-center', css: 'align-items: center;' },
      { class: '.items-start', css: 'align-items: flex-start;' },
      { class: '.items-end', css: 'align-items: flex-end;' },
      { class: '.justify-center', css: 'justify-content: center;' },
      { class: '.justify-between', css: 'justify-content: space-between;' },
      { class: '.justify-start', css: 'justify-content: flex-start;' },
      { class: '.justify-end', css: 'justify-content: flex-end;' },
      { class: '.grid', css: 'display: grid;' },
      { class: '.block', css: 'display: block;' },
      { class: '.inline', css: 'display: inline;' },
      { class: '.inline-block', css: 'display: inline-block;' },
      { class: '.hidden', css: 'display: none;' },
      { class: '.relative', css: 'position: relative;' },
      { class: '.absolute', css: 'position: absolute;' },
      { class: '.fixed', css: 'position: fixed;' },
      { class: '.sticky', css: 'position: sticky;' },
      { class: '.w-full', css: 'width: 100%;' },
      { class: '.h-full', css: 'height: 100%;' },
      { class: '.mx-auto', css: 'margin-left: auto; margin-right: auto;' },
      { class: '.cursor-pointer', css: 'cursor: pointer;' },
      { class: '.transition', css: 'transition: all 0.3s ease;' }
    ];
  }

  /**
   * Convert utilities array to CSS string
   */
  toCSS() {
    const utilities = this.generate();
    return utilities.map(u => `${u.class} { ${u.css} }`).join('\n');
  }
}
