// packages/vite-plugin/index.js
import path              from 'node:path'
import fs                from 'node:fs'
import { pathToFileURL } from 'node:url'
import Mizumi            from '../core/index.js'
import { resolveClass }  from '../core/class-resolver.js'

// ── Escape CSS identifier characters ───────────────────────
function escapeCSSIdent(str) {
  return str.replace(/([^a-zA-Z0-9_\-])/g, '\\$1')
}

// ── Extract Mizumi class tokens from source text ────────────
const CLASS_RE     = /(?:className|class)\s*=\s*(?:"([^"]*?)"|'([^']*?)'|`([^`]*?)`|\{[^}]*?["'`]([^"'`]*?)["'`][^}]*?\})/g
const MIZU_HELP_RE = /\bmizu\s*\(([^)]+)\)/g

function extractTokens(source) {
  const tokens = new Set()

  for (const m of source.matchAll(CLASS_RE)) {
    const raw = m[1] || m[2] || m[3] || m[4] || ''
    raw.split(/\s+/).filter(Boolean).forEach(t => tokens.add(t))
  }

  for (const m of source.matchAll(MIZU_HELP_RE)) {
    const strings = m[1].match(/["'`]([^"'`]+)["'`]/g) || []
    for (const s of strings) {
      s.slice(1, -1).split(/\s+/).filter(Boolean).forEach(t => tokens.add(t))
    }
  }

  return tokens
}

// ── Walk directory collecting source files ──────────────────
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

// ── Classes that don't produce CSS rules ────────────────────
function isNonCSSClass(token) {
  const skip = [
    'animate-', 'hover-', 'active-', 'scroll-', 'stagger-',
    'focus-', 'duration-', 'delay-', 'ease-',
  ]
  const variants = [
    'sm:', 'md:', 'lg:', 'xl:', '2xl:', 'dark:', 'hover:',
    'focus:', 'active:', 'disabled:', 'motion-safe:', 'motion-reduce:', 'print:',
  ]
  if (skip.some(p => token.startsWith(p))) return true
  if (variants.some(p => token.startsWith(p))) return true
  if (!token.includes(':') && !token.includes('{')) return true
  return false
}

// ── Scan source files and generate CSS for scanned classes ──
async function scanAndGenerate(root) {
  const exts    = ['jsx', 'tsx', 'js', 'ts', 'html', 'vue', 'svelte']
  const srcDir  = path.join(root, 'src')
  const dirs    = [srcDir, root].filter(d => fs.existsSync(d))
  const allToks = new Set()

  for (const dir of dirs) {
    for (const file of walkDir(dir, exts)) {
      if (file.includes('node_modules') || file.includes('.mizumi')) continue
      try {
        extractTokens(fs.readFileSync(file, 'utf8')).forEach(t => allToks.add(t))
      } catch { /* skip */ }
    }
  }

  const lines = []
  const seen  = new Set()

  for (const token of allToks) {
    if (seen.has(token) || isNonCSSClass(token)) continue
    seen.add(token)
    const css = resolveClass(token)
    if (css) lines.push(`.${escapeCSSIdent(token)} { ${css} }`)
  }

  return lines.join('\n')
}

// ── Build everything ─────────────────────────────────────────
async function buildMizumi(configPath, outputDir, root) {
  try {
    const mod    = await import(pathToFileURL(configPath).href + `?t=${Date.now()}`)
    const config = mod.default || mod
    const mz     = new Mizumi(config)

    // Base CSS from tokens/patterns
    let css = mz.generateCSS()

    // Append scanned arbitrary classes
    const scanned = await scanAndGenerate(root)
    if (scanned) css += '\n\n/* ===== SCANNED ARBITRARY CLASSES ===== */\n' + scanned

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    fs.writeFileSync(path.join(outputDir, 'mizumi.css'),          css)
    fs.writeFileSync(path.join(outputDir, 'mizumi-runtime.js'),   mz.generateRuntimeScript())
    fs.writeFileSync(path.join(outputDir, 'mizumi.d.ts'),         mz.typesGenerator.generateDTS())
    fs.writeFileSync(path.join(outputDir, 'mizumi-helpers.js'),   mz.typesGenerator.generateHelpers())
    fs.writeFileSync(path.join(outputDir, 'mizumi.meta.json'),    JSON.stringify({
      tokens: config.tokens, patterns: config.patterns,
      animations: config.animations, rules: config.rules,
      generated: new Date().toISOString()
    }, null, 2))

    console.log(`✅ Mizumi: built (${(Buffer.byteLength(css)/1024).toFixed(1)} KB CSS)`)
  } catch (err) {
    console.error('❌ Mizumi build failed:', err.message)
  }
}

// ── Plugin ───────────────────────────────────────────────────
function mizumiPlugin(options = {}) {
  const configFile = options.config || 'mizumi.config.js'
  const outputDir  = options.output || '.mizumi'

  let root       = process.cwd()
  let configPath

  return {
    name: 'vite-plugin-mizumi',

    async configResolved(config) {
      root       = config.root
      configPath = path.resolve(root, configFile)
      if (!fs.existsSync(configPath)) {
        console.warn(`⚠️  Mizumi: ${configFile} not found, skipping...`)
        return
      }
      console.log('🌊 Mizumi: Initial build...')
      await buildMizumi(configPath, path.resolve(root, outputDir), root)
    },

    configureServer(server) {
      if (!configPath || !fs.existsSync(configPath)) return

      server.watcher.add(configPath)

      const rebuild = async (file) => {
        console.log('🌊 Mizumi: rebuilding...')
        await buildMizumi(configPath, path.resolve(root, outputDir), root)
        server.ws.send({ type: 'full-reload', path: '*' })
      }

      server.watcher.on('change', async (file) => {
        if (file === configPath || /\.(jsx?|tsx?|html|vue|svelte)$/.test(file)) {
          await rebuild(file)
        }
      })

      server.watcher.on('add', async (file) => {
        if (/\.(jsx?|tsx?|html|vue|svelte)$/.test(file)) await rebuild(file)
      })
    },

    async buildStart() {
      if (!configPath || !fs.existsSync(configPath)) return
      console.log('🌊 Mizumi: Building for production...')
      await buildMizumi(configPath, path.resolve(root, outputDir), root)
    }
  }
}

export default mizumiPlugin