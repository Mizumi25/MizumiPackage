#!/usr/bin/env node
// packages/cli/index.js

import { watch }        from './watcher.js'
import { DocsGenerator } from './docs-generator.js'
import { MizuParser, loadMizuFiles, mergeMizuConfigs } from '../core/mizu-parser.js'
import { Validator }    from '../core/validator.js'
import Mizumi           from '../core/index.js'
import { generateDevToolsScript } from '../vite-plugin/devtools.js'

import path             from 'node:path'
import fs               from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolveClass } from '../core/class-resolver.js'


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


function escapeCSSIdent(str) {
  return str.replace(/([^a-zA-Z0-9_\-])/g, '\\$1')
}

const CLASS_RE = /(?:className|class)\s*=\s*(?:"([^"]*?)"|'([^']*?)'|`([^`]*?)`)/g

function extractTokens(source) {
  const tokens = new Set()
  for (const m of source.matchAll(CLASS_RE)) {
    const raw = m[1] || m[2] || m[3] || ''
    raw.split(/\s+/).filter(Boolean).forEach(t => tokens.add(t))
  }
  return tokens
}

function walkDir(dir, exts) {
  const results = []
  const extSet  = new Set(exts)
  if (!fs.existsSync(dir)) return results

  function walk(current) {
    let entries
    try { entries = fs.readdirSync(current, { withFileTypes: true }) }
    catch { return }
    for (const entry of entries) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') walk(full)
      } else if (entry.isFile()) {
        const ext = entry.name.split('.').pop()
        if (extSet.has(ext)) results.push(full)
      }
    }
  }
  walk(dir)
  return results
}

function isNonCSSClass(token) {
  const skip = ['animate-','hover-','active-','scroll-','stagger-','focus-','duration-','delay-','ease-']
  const variants = ['sm:','md:','lg:','xl:','2xl:','dark:','hover:','focus:','active:','disabled:','motion-safe:','motion-reduce:','print:']
  if (skip.some(p => token.startsWith(p))) return true
  if (variants.some(p => token.startsWith(p))) return true
  if (!token.includes(':') && !token.includes('{')) return true
  return false
}

function scanAndGenerateCSS(root) {
  const exts    = ['html', 'htm', 'jsx', 'tsx', 'js', 'ts', 'vue', 'svelte']
  const files   = walkDir(root, exts)
  const allToks = new Set()

  for (const file of files) {
    if (file.includes('node_modules') || file.includes('.mizumi')) continue
    try {
      extractTokens(fs.readFileSync(file, 'utf8')).forEach(t => allToks.add(t))
    } catch { /* skip */ }
  }

  const lines = []
  const seen  = new Set()

  for (const token of allToks) {
    if (seen.has(token) || isNonCSSClass(token)) continue
    seen.add(token)
    const css = resolveClass(token)
    if (css) lines.push(`.${escapeCSSIdent(token)} { ${css} }`)
  }

  console.log(`   Scanned ${files.length} files, ${lines.length} arbitrary classes found`)
  return lines.join('\n')
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
      const cwd     = process.cwd()
      const config  = await loadConfig()
      const mizumi  = new Mizumi(config)
      const outDir  = '.mizumi'

      // Generate base CSS from tokens/patterns
      let css = mizumi.generateCSS()

      // Scan source files and append arbitrary classes
      const scanned = scanAndGenerateCSS(cwd)
      if (scanned) {
        css += '\n\n/* ===== SCANNED ARBITRARY CLASSES ===== */\n' + scanned
      }

      // Write all outputs
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

      fs.writeFileSync(path.join(outDir, 'mizumi.css'), css)
      console.log(`✅ CSS:     ${path.join(outDir, 'mizumi.css')} (${(Buffer.byteLength(css)/1024).toFixed(2)} KB)`)

      const js = mizumi.generateRuntimeScript()
      fs.writeFileSync(path.join(outDir, 'mizumi-runtime.js'), js)
      console.log(`✅ Runtime: ${path.join(outDir, 'mizumi-runtime.js')} (${(Buffer.byteLength(js)/1024).toFixed(2)} KB)`)

      const dts = mizumi.typesGenerator.generateDTS()
      fs.writeFileSync(path.join(outDir, 'mizumi.d.ts'), dts)
      console.log(`✅ Types:   ${path.join(outDir, 'mizumi.d.ts')} (${(Buffer.byteLength(dts)/1024).toFixed(2)} KB)`)

      const helpers = mizumi.typesGenerator.generateHelpers()
      fs.writeFileSync(path.join(outDir, 'mizumi-helpers.js'), helpers)
      console.log(`✅ Helpers: ${path.join(outDir, 'mizumi-helpers.js')} (${(Buffer.byteLength(helpers)/1024).toFixed(2)} KB)`)

      const metaObj = {
        tokens:    config.tokens,
        patterns:  config.patterns,
        animations:config.animations,
        rules:     config.rules,
        generated: new Date().toISOString()
      }
      const meta = JSON.stringify(metaObj, null, 2)
      fs.writeFileSync(path.join(outDir, 'mizumi.meta.json'), meta)
      console.log(`✅ Meta:    ${path.join(outDir, 'mizumi.meta.json')} (${(Buffer.byteLength(meta)/1024).toFixed(2)} KB)`)

      // Always write devtools — inactive until mizumi-devtools.js is loaded
      const devtools = generateDevToolsScript({ tokens: metaObj.tokens, patterns: metaObj.patterns, animations: metaObj.animations })
      fs.writeFileSync(path.join(outDir, 'mizumi-devtools.js'), devtools)
      console.log(`✅ DevTools:${path.join(outDir, 'mizumi-devtools.js')} (${(Buffer.byteLength(devtools)/1024).toFixed(2)} KB)`)

      console.log('\n✅ Build complete')
      console.log('   💡 Add to HTML for DevTools: <script src=".mizumi/mizumi-devtools.js"></script>')
    } catch (err) {
      console.error('❌ Build failed:', err.message)
      process.exit(1)
    }
  },

  // ── mizumi watch ──
  async watch() {
    console.log('🌊 Mizumi: Watching...\n')
    await commands.build()
    watch(loadConfig, Mizumi, generateDevToolsScript)
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

      // Unused token check — only warn for tokens expected in patterns
      // easing/duration/blur/zIndex/leading/tracking are utility tokens
      // used inline in HTML, not required in patterns
      const PATTERN_TOKEN_CATEGORIES = ['colors', 'spacing', 'typography', 'radius', 'shadows', 'fonts']
      console.log('\n🔍 TOKEN USAGE IN PATTERNS')
      const allPatternText = Object.values(patterns).join(' ')
      let unusedCount = 0
      for (const [category, values] of Object.entries(tokens)) {
        if (!PATTERN_TOKEN_CATEGORIES.includes(category)) continue
        if (typeof values !== 'object') continue
        for (const key of Object.keys(values)) {
          const used = allPatternText.includes(`:${key}`)
          if (!used) {
            console.log(`   ⚠️  ${category}.${key} — defined but not used in any pattern`)
            unusedCount++
          }
        }
      }
      if (unusedCount === 0) {
        console.log('   ✅ All pattern tokens are in use')
      }
      console.log('\n   ℹ️  easing/duration/blur/opacity/zIndex/leading/tracking')
      console.log('      are utility tokens — use inline in HTML/JSX as needed')

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
  },
  
  
  
  
  // ── ADD THESE TO THE commands OBJECT IN packages/cli/index.js ──


  // ── mizumi sync:defaults ──
  // Reads packages/core/defaults.js and syncs into pattern-expander.js,
  // parser.js, animation-engine parent (index.js), variant-generator.js
  async ['sync:defaults']() {
    console.log('🌊 Mizumi: Syncing defaults...\n')

    const __dirname  = path.dirname(fileURLToPath(import.meta.url))
    const coreDir    = path.resolve(__dirname, '../core')
    const defaultsPath = path.resolve(coreDir, 'defaults.js')

    if (!fs.existsSync(defaultsPath)) {
      console.error('❌ packages/core/defaults.js not found')
      process.exit(1)
    }

    const { DEFAULT_TOKENS, DEFAULT_PATTERNS, DEFAULT_ANIMATIONS, DEFAULT_RULES } =
      await import(pathToFileURL(defaultsPath).href + `?t=${Date.now()}`)

    // ── 1. Sync patterns into pattern-expander.js ──
    const peFile = path.resolve(coreDir, 'pattern-expander.js')
    let   peSrc  = fs.readFileSync(peFile, 'utf8')

    const patternsJSON = JSON.stringify(DEFAULT_PATTERNS, null, 4)
      .replace(/"([^"]+)":/g, "'$1':")      // use single quotes for keys
      .replace(/"/g, "'")                    // use single quotes for values

    const peMarkerStart = '// <<<DEFAULTS:PATTERNS:START>>>'
    const peMarkerEnd   = '// <<<DEFAULTS:PATTERNS:END>>>'

    if (peSrc.includes(peMarkerStart)) {
      // Replace existing block
      const re  = new RegExp(`${peMarkerStart}[\\s\\S]*?${peMarkerEnd}`)
      peSrc = peSrc.replace(re,
        `${peMarkerStart}\n    ...${patternsJSON},\n    ${peMarkerEnd}`)
    } else {
      // Inject into constructor — find: this.patterns = {
      peSrc = peSrc.replace(
        'this.patterns = {',
        `this.patterns = {\n      ${peMarkerStart}\n      ...${patternsJSON},\n      ${peMarkerEnd}`
      )
    }
    fs.writeFileSync(peFile, peSrc)
    console.log(`✅ Patterns synced  → pattern-expander.js (${Object.keys(DEFAULT_PATTERNS).length} patterns)`)

    // ── 2. Sync tokens into parser.js ──
    const parserFile = path.resolve(coreDir, 'parser.js')
    let   parserSrc  = fs.readFileSync(parserFile, 'utf8')

    const tokensJSON = JSON.stringify(DEFAULT_TOKENS, null, 4)

    const tokMarkerStart = '// <<<DEFAULTS:TOKENS:START>>>'
    const tokMarkerEnd   = '// <<<DEFAULTS:TOKENS:END>>>'

    if (parserSrc.includes(tokMarkerStart)) {
      const re = new RegExp(`${tokMarkerStart}[\\s\\S]*?${tokMarkerEnd}`)
      parserSrc = parserSrc.replace(re,
        `${tokMarkerStart}\n    const DEFAULT_TOKENS = ${tokensJSON}\n    c = this._mergeDeep(DEFAULT_TOKENS, c)\n    ${tokMarkerEnd}`)
    } else {
      // Inject at start of parse() method, after: const c = this.config
      parserSrc = parserSrc.replace(
        'parse() {\n    const vars = {}\n    const c    = this.config',
        `parse() {\n    const vars = {}\n    let   c    = this.config\n    ${tokMarkerStart}\n    const DEFAULT_TOKENS = ${tokensJSON}\n    c = this._mergeDeep(DEFAULT_TOKENS, c)\n    ${tokMarkerEnd}`
      )

      // Add _mergeDeep helper if not present
      if (!parserSrc.includes('_mergeDeep')) {
        parserSrc = parserSrc.replace(
          'export class TokenParser {',
          `export class TokenParser {
  _mergeDeep(target, source) {
    const out = { ...target }
    for (const key of Object.keys(source || {})) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        out[key] = this._mergeDeep(target[key] || {}, source[key])
      } else {
        out[key] = source[key]
      }
    }
    return out
  }
`
        )
      }
    }
    fs.writeFileSync(parserFile, parserSrc)
    console.log(`✅ Tokens synced    → parser.js`)

    // ── 3. Sync animations into core/index.js ──
    const indexFile = path.resolve(coreDir, 'index.js')
    let   indexSrc  = fs.readFileSync(indexFile, 'utf8')

    const animJSON       = JSON.stringify(DEFAULT_ANIMATIONS, null, 4)
    const animMarkerStart = '// <<<DEFAULTS:ANIMATIONS:START>>>'
    const animMarkerEnd   = '// <<<DEFAULTS:ANIMATIONS:END>>>'

    if (indexSrc.includes(animMarkerStart)) {
      const re = new RegExp(`${animMarkerStart}[\\s\\S]*?${animMarkerEnd}`)
      indexSrc = indexSrc.replace(re,
        `${animMarkerStart}\n    const DEFAULT_ANIMATIONS = ${animJSON}\n    ${animMarkerEnd}`)
    } else {
      // Find AnimationEngine constructor call and inject defaults merge
      indexSrc = indexSrc.replace(
        'this.animationEngine = new AnimationEngine(',
        `${animMarkerStart}\n    const DEFAULT_ANIMATIONS = ${animJSON}\n    ${animMarkerEnd}\n    this.animationEngine = new AnimationEngine(`
      )
      // Now fix the actual merge — find the animations arg
      indexSrc = indexSrc.replace(
        'new AnimationEngine(\n      config.animations',
        'new AnimationEngine(\n      { ...DEFAULT_ANIMATIONS, ...config.animations }'
      )
      // Handle single-line version too
      indexSrc = indexSrc.replace(
        /new AnimationEngine\(\s*config\.animations\s*,/g,
        'new AnimationEngine({ ...DEFAULT_ANIMATIONS, ...config.animations },'
      )
    }
    fs.writeFileSync(indexFile, indexSrc)
    console.log(`✅ Animations synced → index.js (${Object.keys(DEFAULT_ANIMATIONS).length} animations)`)

    console.log('\n✅ Sync complete — rebuild to apply: npx mizumi build')
  },


  // ── mizumi add:pattern <name> "<utilities>" ──
  async ['add:pattern']() {
    const name  = args[1]
    const value = args[2]

    if (!name || !value) {
      console.log('Usage: node cli/index.js add:pattern <name> "<utilities>"')
      console.log('Example: node cli/index.js add:pattern flex-center "display:flex align-x:center align-yi:center"')
      return
    }

    const __dirname    = path.dirname(fileURLToPath(import.meta.url))
    const defaultsPath = path.resolve(__dirname, '../core/defaults.js')

    if (!fs.existsSync(defaultsPath)) {
      console.error('❌ packages/core/defaults.js not found')
      process.exit(1)
    }

    let src = fs.readFileSync(defaultsPath, 'utf8')

    // Find the closing of DEFAULT_PATTERNS and inject before it
    const insertBefore = '\n}\n\nexport const DEFAULT_ANIMATIONS'
    if (!src.includes(insertBefore)) {
      console.error('❌ Could not find insertion point in defaults.js')
      process.exit(1)
    }

    const line = `  '${name}': '${value}',`

    // Check if already exists
    if (src.includes(`'${name}':`)) {
      // Update existing
      src = src.replace(
        new RegExp(`'${name}':\\s*'[^']*'`),
        `'${name}': '${value}'`
      )
      console.log(`✏️  Updated pattern: ${name}`)
    } else {
      // Insert before closing brace of DEFAULT_PATTERNS
      src = src.replace(insertBefore, `\n${line}${insertBefore}`)
      console.log(`✅ Added pattern: ${name}`)
    }

    fs.writeFileSync(defaultsPath, src)
    console.log(`   Run sync:defaults to apply → node packages/cli/index.js sync:defaults`)
  },


  // ── mizumi add:token <category> <name> <value> ──
  async ['add:token']() {
    const category = args[1]
    const name     = args[2]
    const value    = args[3]

    if (!category || !name || !value) {
      console.log('Usage: node cli/index.js add:token <category> <name> <value>')
      console.log('Example: node cli/index.js add:token colors brand "#ff6b6b"')
      console.log('Example: node cli/index.js add:token spacing hero "120px"')
      return
    }

    const __dirname    = path.dirname(fileURLToPath(import.meta.url))
    const defaultsPath = path.resolve(__dirname, '../core/defaults.js')

    if (!fs.existsSync(defaultsPath)) {
      console.error('❌ packages/core/defaults.js not found')
      process.exit(1)
    }

    let src = fs.readFileSync(defaultsPath, 'utf8')

    // Check if already exists
    if (src.includes(`${name}:`) ) {
      src = src.replace(
        new RegExp(`(${name}:\\s*)(['"\`][^'"\`]*['"\`]|\\d+)`),
        `$1'${value}'`
      )
      console.log(`✏️  Updated token: ${category}.${name} = ${value}`)
    } else {
      // Find the category block and inject
      const catMarker = `  ${category}: {`
      if (!src.includes(catMarker)) {
        console.error(`❌ Token category "${category}" not found in defaults.js`)
        console.log(`   Valid categories: colors, spacing, typography, fonts, radius, shadows, easing, duration, blur, opacity, zIndex, leading, tracking`)
        process.exit(1)
      }
      src = src.replace(catMarker, `${catMarker}\n    ${name}: '${value}',`)
      console.log(`✅ Added token: ${category}.${name} = ${value}`)
    }

    fs.writeFileSync(defaultsPath, src)
    console.log(`   Run sync:defaults to apply → node packages/cli/index.js sync:defaults`)
  },


  // ── mizumi add:animation <name> ──
  // Opens a prompt-style flow (just prints the template for now)
  async ['add:animation']() {
    const name = args[1]

    if (!name) {
      console.log('Usage: node cli/index.js add:animation <name>')
      console.log('Example: node cli/index.js add:animation hover-glow')
      return
    }

    const __dirname    = path.dirname(fileURLToPath(import.meta.url))
    const defaultsPath = path.resolve(__dirname, '../core/defaults.js')

    if (!fs.existsSync(defaultsPath)) {
      console.error('❌ packages/core/defaults.js not found')
      process.exit(1)
    }

    let src = fs.readFileSync(defaultsPath, 'utf8')

    if (src.includes(`'${name}':`)) {
      console.log(`⚠️  Animation "${name}" already exists in defaults.js`)
      console.log('   Edit it directly in packages/core/defaults.js')
      return
    }

    // Detect type from name
    let template
    if (name.startsWith('hover-')) {
      template = `  '${name}': {\n    hover: { y: -6, duration: 0.15, ease: 'power2.out' },\n  },`
    } else if (name.startsWith('active-')) {
      template = `  '${name}': {\n    active: { scale: 0.95, duration: 0.1 },\n  },`
    } else if (name.startsWith('scroll-')) {
      template = `  '${name}': {\n    from: { opacity: 0, y: 30 },\n    to:   { opacity: 1, y: 0  },\n    duration: 0.6,\n    ease: 'power2.out',\n    scrollTrigger: { trigger: 'self', start: 'top 85%' },\n  },`
    } else if (name.startsWith('stagger-')) {
      template = `  '${name}': {\n    targets: 'children',\n    stagger: 0.1,\n    from: { opacity: 0, y: 20 },\n    to:   { opacity: 1, y: 0  },\n  },`
    } else {
      template = `  '${name}': {\n    from: { opacity: 0, y: 40 },\n    to:   { opacity: 1, y: 0  },\n    duration: 0.3,\n    ease: 'power2.out',\n  },`
    }

    // Inject before closing of DEFAULT_ANIMATIONS
    const insertBefore = '\n}\n\nexport const DEFAULT_RULES'
    src = src.replace(insertBefore, `\n${template}${insertBefore}`)

    fs.writeFileSync(defaultsPath, src)
    console.log(`✅ Added animation: ${name}`)
    console.log(`   Edit the config in packages/core/defaults.js if needed`)
    console.log(`   Run sync:defaults to apply → node packages/cli/index.js sync:defaults`)
  },
  
  
  
}

// Run command
if (!command || command === 'help') {
  commands.help()
} else if (commands[command]) {
  Promise.resolve(commands[command]()).catch(err => {
    console.error('❌', err.message)
    process.exit(1)
  })
} else if (command === 'sync:defaults') {
  Promise.resolve(commands['sync:defaults']()).catch(err => { console.error('❌', err.message); process.exit(1) })
} else if (command === 'add:pattern') {
  Promise.resolve(commands['add:pattern']()).catch(err => { console.error('❌', err.message); process.exit(1) })
} else if (command === 'add:token') {
  Promise.resolve(commands['add:token']()).catch(err => { console.error('❌', err.message); process.exit(1) })
} else if (command === 'add:animation') {
  Promise.resolve(commands['add:animation']()).catch(err => { console.error('❌', err.message); process.exit(1) })
}
else {
  console.error(`❌ Unknown command: ${command}`)
  console.log('Run: npx mizumi help')
  process.exit(1)
}