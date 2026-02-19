// packages/core/types-generator.js

export class TypesGenerator {
  constructor(config) {
    this.config     = config;
    this.tokens     = config.tokens     || {};
    this.patterns   = config.patterns   || {};
    this.animations = config.animations || {};
    this.rules      = config.rules      || {};

    this.breakpoints = this.rules.breakpoints || {
      sm: '640px', md: '768px', lg: '1024px', xl: '1280px'
    };

    this.states = [
      'hover', 'focus', 'active', 'disabled',
      'focus-visible', 'focus-within', 'checked'
    ];
  }

  /**
   * Collect ALL possible class names
   */
  getAllClassNames() {
    const classes = new Set();

    // --- Utility classes from tokens ---
    if (this.tokens.colors) {
      for (const [k, v] of Object.entries(this.tokens.colors)) {
        if (typeof v === 'object') {
          for (const [shade] of Object.entries(v)) {
            const s = shade === 'DEFAULT' ? '' : `-${shade}`;
            classes.add(`bg-${k}${s}`);
            classes.add(`color-${k}${s}`);
            classes.add(`border-${k}${s}`);
          }
        } else {
          classes.add(`bg-${k}`);
          classes.add(`color-${k}`);
          classes.add(`border-${k}`);
        }
      }
    }

    if (this.tokens.spacing) {
      for (const [k] of Object.entries(this.tokens.spacing)) {
        classes.add(`pad-${k}`);
        classes.add(`pad-x-${k}`);
        classes.add(`pad-y-${k}`);
        classes.add(`mar-${k}`);
        classes.add(`mar-x-${k}`);
        classes.add(`mar-y-${k}`);
        classes.add(`gap-${k}`);
      }
    }

    if (this.tokens.radius) {
      for (const [k] of Object.entries(this.tokens.radius)) {
        classes.add(`rounded-${k}`);
      }
    }

    if (this.tokens.shadows) {
      for (const [k] of Object.entries(this.tokens.shadows)) {
        classes.add(`shadow-${k}`);
      }
    }

    if (this.tokens.typography) {
      for (const [k] of Object.entries(this.tokens.typography)) {
        classes.add(`text-${k}`);
      }
    }

    // --- Static utilities ---
    const statics = [
      'flex','flex-col','flex-wrap','items-center','items-start','items-end',
      'justify-center','justify-between','justify-start','justify-end',
      'inline-flex','grid','block','inline','inline-block','hidden',
      'relative','absolute','fixed','sticky','w-full','h-full',
      'min-h-screen','mx-auto','cursor-pointer','overflow-hidden',
      'transition','text-center','font-bold','font-medium',
      'list-none','border','max-w-sm','max-w-md','max-w-lg','max-w-xl',
      'opacity-0','opacity-50','opacity-100',
    ];
    statics.forEach(c => classes.add(c));

    // --- Animation modifier classes ---
    [100,150,200,300,500,800,1000].forEach(d => classes.add(`duration-${d}`));
    [0,100,150,200,300,500,1000].forEach(d  => classes.add(`delay-${d}`));
    ['fast','normal','slow','slower'].forEach(n => classes.add(`duration-${n}`));
    ['smooth','bouncy','sharp','back','linear'].forEach(e => classes.add(`ease-${e}`));

    // --- Pattern classes ---
    for (const name of Object.keys(this.patterns)) {
      classes.add(name);
    }

    // --- Animation classes ---
    for (const name of Object.keys(this.animations)) {
      classes.add(name);
    }

    // --- Responsive variants ---
    const baseClasses = [...classes];
    for (const bp of Object.keys(this.breakpoints)) {
      for (const cls of baseClasses) {
        classes.add(`${bp}:${cls}`);
      }
    }

    // --- State variants ---
    for (const state of this.states) {
      for (const cls of baseClasses) {
        classes.add(`${state}:${cls}`);
      }
    }

    // --- Dark mode variants ---
    if (this.rules.darkMode) {
      for (const cls of baseClasses) {
        classes.add(`dark:${cls}`);
      }
    }

    return [...classes].sort();
  }

  /**
   * Generate TypeScript definition file
   */
  generateDTS() {
    const allClasses  = this.getAllClassNames();
    const classUnion  = allClasses.map(c => `'${c}'`).join('\n  | ');

    const tokenColors = this.getTokenList('colors');
    const tokenSpacing = this.getTokenList('spacing');
    const patternList = Object.keys(this.patterns).map(p => `'${p}'`).join(' | ');
    const animList    = Object.keys(this.animations).map(a => `'${a}'`).join(' | ');

    return `/**
 * Mizumi Type Definitions 🌊
 * Auto-generated - do not edit directly
 * Edit mizumi.config.js and rebuild
 */

// ===== TOKEN TYPES =====

export type ColorToken = ${tokenColors || 'string'};

export type SpacingToken = ${tokenSpacing || 'string'};

export type BreakpointPrefix = ${Object.keys(this.breakpoints).map(b => `'${b}'`).join(' | ')};

export type StatePrefix = 'hover' | 'focus' | 'active' | 'disabled' | 'focus-visible';

export type DarkPrefix = 'dark';

// ===== PATTERN TYPES =====

export type MizumiPattern = ${patternList || 'string'};

// ===== ANIMATION TYPES =====

export type MizumiAnimation = ${animList || 'string'};

// ===== ALL CLASS NAMES =====

export type MizumiClass =
  | ${classUnion};

// ===== UTILITY TYPES =====

/**
 * Helper to combine Mizumi classes
 * @example
 * const cls = mz('card', 'animate-fade-in', 'hover:shadow-xl')
 */
export declare function mz(...classes: (MizumiClass | string | undefined | null | false)[]): string;

/**
 * Animate function for programmatic GSAP animations
 * @example
 * <div className={animate('fade-in', { duration: 500 })}>
 */
export declare function animate(
  animation: MizumiAnimation | string,
  options?: {
    duration?: number;
    delay?: number;
    ease?: string;
    scrollTrigger?: {
      trigger?: string | Element;
      start?: string;
      end?: string;
      scrub?: boolean | number;
      pin?: boolean;
      markers?: boolean;
    };
    onComplete?: () => void;
    onStart?: () => void;
    [key: string]: any;
  }
): string;

// ===== CONFIG TYPES =====

export interface MizumiTokens {
  colors?: Record<string, string | Record<string, string>>;
  spacing?: Record<string, string>;
  typography?: Record<string, {
    size: string;
    weight: number;
    line: number;
  }>;
  radius?: Record<string, string>;
  shadows?: Record<string, string>;
  animations?: {
    duration?: Record<string, number>;
    easing?: Record<string, string>;
  };
}

export interface MizumiAnimationConfig {
  from?: Record<string, any>;
  to?: Record<string, any>;
  duration?: number | string;
  delay?: number;
  ease?: string;
  repeat?: number;
  yoyo?: boolean;
  stagger?: number;
  targets?: 'children' | string;
  scrollTrigger?: {
    trigger?: 'self' | string;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    toggleActions?: string;
    markers?: boolean;
  };
  hover?: Record<string, any>;
  active?: Record<string, any>;
  timeline?: Array<{
    targets?: string;
    from?: Record<string, any>;
    to?: Record<string, any>;
    duration?: number;
    delay?: number;
  }>;
}

export interface MizumiRules {
  darkMode?: false | 'class' | 'media';
  responsive?: boolean;
  breakpoints?: Record<string, string>;
}

export interface MizumiConfig {
  tokens?: MizumiTokens;
  patterns?: Record<string, string>;
  animations?: Record<string, MizumiAnimationConfig>;
  rules?: MizumiRules;
}

/**
 * Define your Mizumi configuration with full type safety
 * @example
 * const config = defineConfig({
 *   tokens: { colors: { primary: '#3B82F6' } },
 *   patterns: { card: 'bg-surface pad-md rounded-lg' }
 * })
 */
export declare function defineConfig(config: MizumiConfig): MizumiConfig;

declare global {
  interface Window {
    Mizumi: {
      init: () => void;
      version: string;
    };
  }
}
`;
  }

  /**
   * Generate JS runtime helpers (mz, animate, defineConfig)
   */
  generateHelpers() {
    return `/**
 * Mizumi Runtime Helpers 🌊
 * Auto-generated - do not edit directly
 */

/**
 * Combine Mizumi class names
 * Filters falsy values automatically
 * @example
 * mz('card', isActive && 'bg-primary', 'hover-lift')
 */
function mz(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Animate function - returns a unique class + registers custom GSAP config
 * @example
 * <div class="${'${'}animate('fade-in', { duration: 500 })}">
 */
function animate(animationName, options = {}) {
  const uniqueId = 'mz-anim-' + Math.random().toString(36).slice(2, 7);

  // Register custom config to be picked up by runtime
  window.__mizumiCustomAnims = window.__mizumiCustomAnims || {};
  window.__mizumiCustomAnims[uniqueId] = {
    basedOn: animationName,
    ...options
  };

  return animationName + ' ' + uniqueId;
}

/**
 * Define Mizumi config with type hints (JS helper)
 */
function defineConfig(config) {
  return config;
}

// Export for different module systems

  exports { mz, animate, defineConfig };
if (typeof window !== 'undefined') {
  window.mz         = mz;
  window.animate    = animate;
  window.defineConfig = defineConfig;
}
`;
  }

  getTokenList(tokenKey) {
    if (!this.tokens[tokenKey]) return null;
    const names = [];
    for (const [k, v] of Object.entries(this.tokens[tokenKey])) {
      if (typeof v === 'object') {
        for (const [shade] of Object.entries(v)) {
          names.push(shade === 'DEFAULT' ? `'${k}'` : `'${k}-${shade}'`);
        }
      } else {
        names.push(`'${k}'`);
      }
    }
    return names.join(' | ');
  }
}
