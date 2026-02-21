#!/usr/bin/env node
// packages/cli/index.js

import { watch }        from './watcher.js'
import { DocsGenerator } from './docs-generator.js'
import { MizuParser, loadMizuFiles, mergeMizuConfigs } from '../core/mizu-parser.js'
import { Validator }    from '../core/validator.js'
import Mizumi           from '../core/index.js'

import path             from 'node:path'
import fs               from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const args    = process.argv.slice(2)
const command = args[0]

// ── Load config — supports mizumi.config.js AND .mizu files ──
async function loadConfig(configFile = 'mizumi.config.js') {
  const cwd        = process.cwd()
  const configPath = path.resolve(cwd, configFile)
  let   config     = {}

  // Load JS config if exists
  if (fs.existsSync(configPath)) {
    const mod = await import(pathToFileURL(configPath).href + `?t=${Date.now()}`)
    config    = mod.default || mod
  }

  // Find and merge all .mizu files in src/
  const srcDir    = path.resolve(cwd, 'src')
  const rootDir   = cwd
  const mizuDirs  = [rootDir, srcDir].filter(fs.existsSync)

  for (const dir of mizuDirs) {
    const mizuConfig = loadMizuFiles(dir)
    if (Object.keys(mizuConfig.tokens).length > 0 ||
        Object.keys(mizuConfig.patterns).length > 0) {
      config = mergeMizuConfigs(config, mizuConfig)
    }
  }

  return config
}

const commands = {

  // ── mizumi init ──
  init() {
    console.log('🌊 Initializing Mizumi...\n')

    const jsConfig = `// mizumi.config.js
export default {
  tokens: {
    colors: {
      primary:   { DEFAULT: '#3B82F6', 50: '#EFF6FF', 600: '#2563EB', 900: '#1E3A8A' },
      secondary: '#8B5CF6',
      neutral:   { 50: '#F9FAFB', 100: '#F3F4F6', 500: '#6B7280', 900: '#111827' },
      surface:   '#FFFFFF',
      ink:       '#111827',
      success:   '#10B981',
      error:     '#EF4444',
    },
    spacing: {
      xs: '4px', sm: '8px', md: '16px',
      lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px',
    },
    typography: {
      h1: { size: '3rem',    weight: '700', line: '1.1' },
      h2: { size: '2.25rem', weight: '700', line: '1.2' },
      h3: { size: '1.875rem',weight: '600', line: '1.3' },
      h4: { size: '1.5rem',  weight: '600', line: '1.4' },
      body: { size: '1rem',  weight: '400', line: '1.6' },
      sm:   { size: '0.875rem', weight: '400', line: '1.5' },
      xs:   { size: '0.75rem',  weight: '400', line: '1.4' },
    },
    fonts: {
      sans:  'system-ui, sans-serif',
      serif: 'Georgia, serif',
      mono:  'monospace',
    },
    radius: {
      sm: '4px', md: '8px', lg: '12px',
      xl: '16px', full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 12px rgba(0,0,0,0.1)',
      lg: '0 8px 24px rgba(0,0,0,0.15)',
      xl: '0 16px 48px rgba(0,0,0,0.2)',
    },
    easing: {
      smooth:  'cubic-bezier(0.4,0,0.2,1)',
      bouncy:  'cubic-bezier(0.34,1.56,0.64,1)',
      sharp:   'cubic-bezier(0.4,0,1,1)',
      back:    'cubic-bezier(0.34,1.4,0.64,1)',
    },
    duration: {
      fast:   '150ms',
      normal: '300ms',
      slow:   '500ms',
      slower: '800ms',
    },
    blur: {
      sm:    '4px',
      md:    '8px',
      lg:    '16px',
      glass: '20px',
    },
    opacity: {
      ghost:  '0.1',
      muted:  '0.5',
      soft:   '0.75',
      full:   '1',
    },
    zIndex: {
      base:   0,
      float:  10,
      sticky: 20,
      modal:  100,
      toast:  200,
      top:    999,
    },
    leading: {
      tight:  '1.25',
      snug:   '1.375',
      normal: '1.5',
      relaxed:'1.625',
      loose:  '2',
    },
    tracking: {
      tight:  '-0.05em',
      normal: '0em',
      wide:   '0.05em',
      wider:  '0.1em',
      widest: '0.2em',
    },
  },

  patterns: {
    // Surfaces
    card:       'pad:md paint:surface curve:lg cast:md',
    card-flat:  'pad:md paint:surface curve:lg',
    panel:      'pad:lg paint:surface curve:xl cast:lg',

    // Buttons
    btn:        'pad-y:sm pad-x:lg curve:md ease:default cursor:pointer',
    btn-primary:'btn paint:primary ink:surface type-weight:semi',
    btn-ghost:  'btn stroke-color:primary ink:primary',
    btn-danger: 'btn paint:error ink:surface',

    // Typography
    heading:    'type-face:sans type-weight:bold leading:tight',
    body-text:  'type-face:sans leading:relaxed',
    caption:    'text:xs ink:neutral-500',
    label:      'text:sm type-weight:medium tracking:wide text-case:upper',

    // Layout
    container:  'canvas-w:full mar-x:auto pad-x:md',
    center:     'display:flex align-x:center align-yi:center',
    stack:      'display:flex flex-dir:col',
    row:        'display:flex flex-dir:row align-yi:center',
    grid-auto:  'display:grid grid-cols:repeat(auto-fit,minmax(250px,1fr)) gap:md',
  },

  animations: {
    'fade-in': {
      from: { opacity: 0 },
      to:   { opacity: 1 },
      duration: 'normal',
      ease: 'smooth',
    },
    'slide-up': {
      from: { opacity: 0, y: 40 },
      to:   { opacity: 1, y: 0 },
      duration: 'normal',
      ease: 'smooth',
    },
    'hover-lift': {
      hover: { y: -6, duration: 0.2, ease: 'smooth' },
    },
    'hover-glow': {
      hover: { boxShadow: '0 0 24px rgba(59,130,246,0.4)', duration: 0.3 },
    },
    'active-press': {
      active: { scale: 0.97, duration: 0.1 },
    },
  },

  rules: {
    responsive:  true,
    darkMode:    'class',
    print:       false,
    motion:      true,
    orientation: false,

    breakpoints: {
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
    },

    containers: {
      card:    { sm: '300px', md: '500px' },
      sidebar: { collapsed: '200px', expanded: '320px' },
    },
  },
}
`

    const mimuExample = `/* styles.mizu — CSS-style alternative to mizumi.config.js */
/* Both files are supported — they get merged automatically */

@token {
  colors {
    brand: #6366f1;
  }
  spacing {
    section: 80px;
    hero: 120px;
  }
}

@pattern hero {
  pad-y: hero;
  display: flex;
  flex-dir: col;
  align-yi: center;
  align-x: center;
  text-align: center;
}

@pattern section {
  pad-y: section;
  canvas-w: full;
}
`

    if (!fs.existsSync('mizumi.config.js')) {
      fs.writeFileSync('mizumi.config.js', jsConfig)
      console.log('✅ Created mizumi.config.js')
    } else {
      console.log('⏭️  mizumi.config.js already exists — skipping')
    }

    if (!fs.existsSync('styles.mizu')) {
      fs.writeFileSync('styles.mizu', mimuExample)
      console.log('✅ Created styles.mizu')
    }

    console.log('\n🌊 Run: npx mizumi build\n')
  },

  // ── mizumi build ──
  async build() {
    console.log('🌊 Mizumi: Building...\n')
    try {
      const config  = await loadConfig()
      const mizumi  = new Mizumi(config)
      const outputs = mizumi.build('.mizumi')
      console.log('\n✅ Build complete')
    } catch (err) {
      console.error('❌ Build failed:', err.message)
      process.exit(1)
    }
  },

  // ── mizumi watch ──
  async watch() {
    console.log('🌊 Mizumi: Watching...\n')
    await commands.build()
    watch(loadConfig, Mizumi)
  },

  // ── mizumi validate ──
  async validate() {
    console.log('🌊 Mizumi: Validating config...\n')
    try {
      const config    = await loadConfig()
      const validator = new Validator(config)
      const result    = validator.validate()

      if (result.valid && result.warnings.length === 0) {
        console.log('✅ Config is valid — no issues found\n')
        return
      }

      if (result.errors.length > 0) {
        console.log(`❌ ${result.errors.length} error(s):\n`)
        result.errors.forEach(e => console.log(e + '\n'))
      }

      if (result.warnings.length > 0) {
        console.log(`⚠️  ${result.warnings.length} warning(s):\n`)
        result.warnings.forEach(w => console.log(w + '\n'))
      }

      if (!result.valid) process.exit(1)

    } catch (err) {
      console.error('❌ Validation failed:', err.message)
      process.exit(1)
    }
  },

  // ── mizumi analyze ──
  async analyze() {
    console.log('🌊 Mizumi: Analyzing design system...\n')
    try {
      const config  = await loadConfig()
      const mizumi  = new Mizumi(config)

      // Token stats
      const tokens   = config.tokens || {}
      const patterns = config.patterns || {}
      const anims    = config.animations || {}

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('  MIZUMI DESIGN SYSTEM ANALYSIS')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      // Token summary
      console.log('📦 TOKENS')
      for (const [category, values] of Object.entries(tokens)) {
        const count = typeof values === 'object'
          ? Object.keys(values).length
          : 1
        console.log(`   ${category.padEnd(16)} ${count} values`)
      }

      // Pattern summary
      console.log(`\n🎨 PATTERNS (${Object.keys(patterns).length} total)`)
      for (const [name, value] of Object.entries(patterns)) {
        const classes = value.split(/\s+/).filter(Boolean)
        console.log(`   .${name.padEnd(20)} ${classes.length} utilities`)
      }

      // Animation summary
      console.log(`\n✨ ANIMATIONS (${Object.keys(anims).length} total)`)
      for (const [name] of Object.entries(anims)) {
        console.log(`   ${name}`)
      }

      // CSS output size estimate
      const css = mizumi.generateCSS()
      const kb  = (Buffer.byteLength(css) / 1024).toFixed(2)
      console.log(`\n📄 ESTIMATED OUTPUT`)
      console.log(`   CSS size: ${kb} KB`)
      console.log(`   Utilities generated: ${css.match(/\./g)?.length || 0}`)

      // Unused token check
      console.log('\n🔍 TOKEN USAGE IN PATTERNS')
      const allPatternText = Object.values(patterns).join(' ')
      for (const [category, values] of Object.entries(tokens)) {
        if (typeof values !== 'object') continue
        for (const key of Object.keys(values)) {
          const used = allPatternText.includes(`:${key}`)
          if (!used) {
            console.log(`   ⚠️  ${category}.${key} — defined but not used in any pattern`)
          }
        }
      }

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    } catch (err) {
      console.error('❌ Analysis failed:', err.message)
    }
  },

  // ── mizumi convert ──
  // Converts Tailwind class strings to Mizumi equivalents
  convert() {
    const input = args[1]
    if (!input) {
      console.log('Usage: mizumi convert "p-4 bg-blue-500 rounded-lg text-white"')
      return
    }

    const TAILWIND_MAP = {
      'flex':            'display:flex',
      'grid':            'display:grid',
      'block':           'display:block',
      'inline':          'display:inline',
      'hidden':          'display:none',
      'relative':        'pos:relative',
      'absolute':        'pos:absolute',
      'fixed':           'pos:fixed',
      'sticky':          'pos:sticky',
      'w-full':          'canvas-w:full',
      'h-full':          'canvas-h:full',
      'w-screen':        'canvas-w:screen',
      'h-screen':        'canvas-h:screen',
      'mx-auto':         'mar-x:auto',
      'items-center':    'align-yi:center',
      'items-start':     'align-yi:start',
      'items-end':       'align-yi:end',
      'justify-center':  'align-x:center',
      'justify-between': 'align-x:between',
      'justify-start':   'align-x:start',
      'justify-end':     'align-x:end',
      'flex-col':        'flex-dir:col',
      'flex-row':        'flex-dir:row',
      'flex-wrap':       'flex-wrap:yes',
      'flex-1':          'flex:1',
      'font-bold':       'type-weight:bold',
      'font-semibold':   'type-weight:semi',
      'font-medium':     'type-weight:medium',
      'font-normal':     'type-weight:normal',
      'font-light':      'type-weight:light',
      'italic':          'type-style:italic',
      'uppercase':       'text-case:upper',
      'lowercase':       'text-case:lower',
      'capitalize':      'text-case:capital',
      'text-center':     'text-align:center',
      'text-left':       'text-align:left',
      'text-right':      'text-align:right',
      'overflow-hidden': 'overflow:hidden',
      'overflow-auto':   'overflow:auto',
      'overflow-scroll': 'overflow:scroll',
      'cursor-pointer':  'cursor:pointer',
      'cursor-default':  'cursor:default',
      'select-none':     'select:none',
      'pointer-events-none': 'events:none',
      'truncate':        'overflow:hidden text-overflow:dots wrap:no',
      'border':          'stroke-width:1px stroke-style:solid',
      'border-none':     'stroke-style:none',
      'list-none':       'list:none',
    }

    const classes  = input.split(/\s+/).filter(Boolean)
    const converted = []
    const unknown   = []

    for (const cls of classes) {
      if (TAILWIND_MAP[cls]) {
        converted.push(TAILWIND_MAP[cls])
      } else if (/^p-(\d+)$/.exec(cls))   { converted.push(`pad:your-spacing-token    /* was ${cls} */`) }
      else if (/^px-(\d+)$/.exec(cls))    { converted.push(`pad-x:your-spacing-token  /* was ${cls} */`) }
      else if (/^py-(\d+)$/.exec(cls))    { converted.push(`pad-y:your-spacing-token  /* was ${cls} */`) }
      else if (/^m-(\d+)$/.exec(cls))     { converted.push(`mar:your-spacing-token     /* was ${cls} */`) }
      else if (/^mx-(\d+)$/.exec(cls))    { converted.push(`mar-x:your-spacing-token  /* was ${cls} */`) }
      else if (/^my-(\d+)$/.exec(cls))    { converted.push(`mar-y:your-spacing-token  /* was ${cls} */`) }
      else if (/^gap-(\d+)$/.exec(cls))   { converted.push(`gap:your-spacing-token    /* was ${cls} */`) }
      else if (/^rounded/.exec(cls))      { converted.push(`curve:your-radius-token   /* was ${cls} */`) }
      else if (/^shadow/.exec(cls))       { converted.push(`cast:your-shadow-token    /* was ${cls} */`) }
      else if (/^bg-/.exec(cls))          { converted.push(`paint:your-color-token    /* was ${cls} */`) }
      else if (/^text-/.exec(cls))        { converted.push(`text:your-type-token      /* was ${cls} */`) }
      else if (/^text-\[/.exec(cls))      { converted.push(`type-size:your-size-token /* was ${cls} */`) }
      else if (/^border-/.exec(cls))      { converted.push(`stroke-color:your-color   /* was ${cls} */`) }
      else if (/^text-(white|black)/.exec(cls)) { converted.push(`ink:your-color-token /* was ${cls} */`) }
      else { unknown.push(cls) }
    }

    console.log('\n🌊 Mizumi equivalent:\n')
    console.log(converted.join('\n'))

    if (unknown.length > 0) {
      console.log(`\n⚠️  Could not convert (no direct equivalent):\n   ${unknown.join(', ')}`)
      console.log('   Check: https://github.com/Mizumi25/MizumiPackage')
    }

    console.log('')
  },

  // ── mizumi docs ──
  async docs() {
    console.log('🌊 Mizumi: Generating docs...\n')
    try {
      const config = await loadConfig()
      const docs   = new DocsGenerator(config)
      docs.generate('.mizumi/docs')
      console.log('✅ Docs generated in .mizumi/docs/')
    } catch (err) {
      console.error('❌ Docs failed:', err.message)
    }
  },

  // ── mizumi help ──
  help() {
    console.log(`
🌊 Mizumi CLI

COMMANDS:
  init        Create mizumi.config.js and styles.mizu starter files
  build       Build CSS, runtime, types and meta from your config
  watch       Build then watch for config changes
  validate    Check your config for errors and Tailwind/raw CSS usage
  analyze     Design system health report — tokens, patterns, usage
  convert     Convert Tailwind class string to Mizumi vocabulary
  docs        Generate HTML documentation from your config
  help        Show this help

EXAMPLES:
  npx mizumi init
  npx mizumi build
  npx mizumi validate
  npx mizumi analyze
  npx mizumi convert "p-4 bg-blue-500 flex items-center rounded-lg"

FILES:
  mizumi.config.js   JS config (for JS developers)
  *.mizu             CSS-style config (for CSS developers)
  Both are auto-detected and merged.

OUTPUT (.mizumi/):
  mizumi.css          All generated CSS
  mizumi-runtime.js   GSAP animation runtime
  mizumi.d.ts         TypeScript types
  mizumi-helpers.js   JS class name helpers
  mizumi.meta.json    Config metadata
`)
  }
}

// Run command
if (!command || command === 'help') {
  commands.help()
} else if (commands[command]) {
  Promise.resolve(commands[command]()).catch(err => {
    console.error('❌', err.message)
    process.exit(1)
  })
} else {
  console.error(`❌ Unknown command: ${command}`)
  console.log('Run: npx mizumi help')
  process.exit(1)
}