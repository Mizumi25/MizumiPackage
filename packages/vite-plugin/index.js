// packages/vite-plugin/index.js
import path              from 'node:path'
import fs                from 'node:fs'
import { pathToFileURL } from 'node:url'
import Mizumi            from '../core/index.js'
import { resolveClass }  from '../core/class-resolver.js'
import { loadMizuFiles, mergeMizuConfigs } from '../core/mizu-parser.js'
import { generateDevToolsScript }          from './devtools.js'

function escapeCSSIdent(str) {
  return str.replace(/([^a-zA-Z0-9_\-])/g, '\\$1')
}

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
  const skip     = ['animate-','hover-','active-','scroll-','stagger-','focus-','duration-','delay-','ease-']
  const variants = ['sm:','md:','lg:','xl:','2xl:','dark:','hover:','focus:','active:','disabled:','motion-safe:','motion-reduce:','print:']
  if (skip.some(p => token.startsWith(p))) return true
  if (variants.some(p => token.startsWith(p))) return true
  if (!token.includes(':') && !token.includes('{')) return true
  return false
}

async function scanAndGenerate(root) {
  const exts    = ['jsx','tsx','js','ts','html','vue','svelte']
  const srcDir  = path.join(root, 'src')
  const dirs    = [srcDir, root].filter(d => fs.existsSync(d))
  const allToks = new Set()
  for (const dir of dirs) {
    for (const file of walkDir(dir, exts)) {
      if (file.includes('node_modules') || file.includes('.mizumi')) continue
      try { extractTokens(fs.readFileSync(file, 'utf8')).forEach(t => allToks.add(t)) }
      catch { /* skip */ }
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

async function buildMizumi(configPath, outputDir, root) {
  try {
    const mod    = await import(pathToFileURL(configPath).href + `?t=${Date.now()}`)
    let   config = mod.default || mod

    const mizuConfig = loadMizuFiles(root)
    if (
      Object.keys(mizuConfig.tokens).length > 0 ||
      Object.keys(mizuConfig.patterns).length > 0 ||
      Object.keys(mizuConfig.animations).length > 0
    ) {
      config = mergeMizuConfigs(config, mizuConfig)
      console.log('🌊 Mizumi: .mizu files merged')
    }

    const mz  = new Mizumi(config)
    let   css = mz.generateCSS()
    const scanned = await scanAndGenerate(root)
    if (scanned) css += '\n\n/* ===== SCANNED ARBITRARY CLASSES ===== */\n' + scanned

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    fs.writeFileSync(path.join(outputDir, 'mizumi.css'),        css)
    fs.writeFileSync(path.join(outputDir, 'mizumi-runtime.js'), mz.generateRuntimeScript())
    fs.writeFileSync(path.join(outputDir, 'mizumi-depth-runtime.js'), mz.depthEngine.generateRuntimeScript())
    fs.writeFileSync(path.join(outputDir, 'mizumi.d.ts'),       mz.typesGenerator.generateDTS())
    fs.writeFileSync(path.join(outputDir, 'mizumi-helpers.js'), mz.typesGenerator.generateHelpers())

    const meta = {
      tokens:    config.tokens     || {},
      patterns:  config.patterns   || {},
      animations:config.animations || {},
      rules:     config.rules      || {},
      generated: new Date().toISOString()
    }
    fs.writeFileSync(path.join(outputDir, 'mizumi.meta.json'),    JSON.stringify(meta, null, 2))
    fs.writeFileSync(path.join(outputDir, 'mizumi-devtools.js'),  generateDevToolsScript(meta))

    console.log(`✅ Mizumi: built (${(Buffer.byteLength(css)/1024).toFixed(1)} KB CSS)`)
  } catch (err) {
    console.error('❌ Mizumi build failed:', err.message)
  }
}

function mizumiPlugin(options = {}) {
  const configFile = options.config || 'mizumi.config.js'
  const outputDir  = options.output || '.mizumi'

  let root         = process.cwd()
  let configPath
  let isDev        = false
  let isBuilding   = false
  let rebuildTimer = null

  return {
    name: 'vite-plugin-mizumi',

    async configResolved(config) {
      root       = config.root
      isDev      = config.command === 'serve'
      configPath = path.resolve(root, configFile)
      if (!fs.existsSync(configPath)) {
        console.warn(`⚠️  Mizumi: ${configFile} not found, skipping...`)
        return
      }
      console.log('🌊 Mizumi: Initial build...')
      await buildMizumi(configPath, path.resolve(root, outputDir), root)
    },

    transformIndexHtml(html) {
      if (!isDev) return html
      const tag = `<script src="/${outputDir}/mizumi-devtools.js"></script>`
      if (html.includes('</body>')) return html.replace('</body>', `  ${tag}\n</body>`)
      return html + tag
    },

    configureServer(server) {
      if (!configPath || !fs.existsSync(configPath)) return

      const absOutputDir = path.resolve(root, outputDir)

      // ── /__mizumi_write endpoint ──────────────────────────────────
      server.middlewares.use('/__mizumi_write', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          try {
            const { file, line, newClasses } = JSON.parse(body)
            if (!file || !newClasses) {
              res.end(JSON.stringify({ ok: false, reason: 'missing file or newClasses' }))
              return
            }
            const absFile = path.resolve(root, file.replace(/^\//, ''))
            if (!absFile.startsWith(root + path.sep) && absFile !== root) {
              res.end(JSON.stringify({ ok: false, reason: 'outside project root' }))
              return
            }
            if (!fs.existsSync(absFile)) {
              res.end(JSON.stringify({ ok: false, reason: 'file not found' }))
              return
            }
            const src   = fs.readFileSync(absFile, 'utf8')
            const lines = src.split('\n')
            const targetLine = lines[line - 1]
            if (targetLine === undefined) {
              res.end(JSON.stringify({ ok: false, reason: `line ${line} not found` }))
              return
            }
            const updated = targetLine
              .replace(/(className|class)\s*=\s*"([^"]*)"/, (_, attr) => `${attr}="${newClasses}"`)
              .replace(/(className|class)\s*=\s*'([^']*)'/, (_, attr) => `${attr}='${newClasses}'`)
              .replace(/(className|class)\s*=\s*\{`([^`]*)`\}/, (_, attr) => `${attr}={\`${newClasses}\`}`)
            if (updated === targetLine) {
              res.end(JSON.stringify({ ok: false, reason: 'no className/class found on that line' }))
              return
            }
            lines[line - 1] = updated
            fs.writeFileSync(absFile, lines.join('\n'))
            console.log(`🌊 Mizumi DevTools: wrote → ${path.relative(root, absFile)}:${line}`)
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.end(JSON.stringify({ ok: false, reason: err.message }))
          }
        })
      })

      server.watcher.add(configPath)
      server.watcher.add(path.join(root, '**/*.mizu'))

      const rebuild = async () => {
        if (isBuilding) return
        isBuilding = true
        try {
          console.log('🌊 Mizumi: rebuilding...')
          await buildMizumi(configPath, absOutputDir, root)
          server.ws.send({ type: 'full-reload', path: '*' })
        } finally {
          isBuilding = false
        }
      }

      const debouncedRebuild = () => {
        clearTimeout(rebuildTimer)
        rebuildTimer = setTimeout(rebuild, 120)
      }

      server.watcher.on('change', (file) => {
        // KEY FIX: ignore .mizumi output dir entirely
        if (file.startsWith(absOutputDir + path.sep) || file.startsWith(absOutputDir + '/')) return
        if (file === configPath || /\.(mizu)$/.test(file)) {
          debouncedRebuild()
        } else if (/\.(jsx?|tsx?|html|vue|svelte)$/.test(file)) {
          debouncedRebuild()
        }
      })

      server.watcher.on('add', (file) => {
        if (file.startsWith(absOutputDir + path.sep) || file.startsWith(absOutputDir + '/')) return
        if (/\.(jsx?|tsx?|html|vue|svelte)$/.test(file)) debouncedRebuild()
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