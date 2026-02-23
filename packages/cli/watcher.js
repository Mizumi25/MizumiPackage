// packages/cli/watcher.js
import path     from 'node:path'
import fs       from 'node:fs'
import { createRequire } from 'node:module'

// chokidar is CJS — load via createRequire in ESM
const require = createRequire(import.meta.url)
let chokidar
try {
  chokidar = require('chokidar')
} catch {
  chokidar = null
}

// ── DevTools injection helpers ────────────────────────────
const DEVTOOLS_SCRIPT_TAG  = '<script src=".mizumi/mizumi-devtools.js"></script>'
const DEVTOOLS_COMMENT_TAG = '<!-- mizumi-devtools -->'

/**
 * Find all .html files in cwd (excluding node_modules / .mizumi)
 */
function findHTMLFiles(cwd) {
  const results = []
  function walk(dir) {
    let entries
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) }
    catch { return }
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        if (!e.name.startsWith('.') && e.name !== 'node_modules') walk(full)
      } else if (e.isFile() && e.name.endsWith('.html')) {
        results.push(full)
      }
    }
  }
  walk(cwd)
  return results
}

/**
 * Inject the devtools <script> tag into an HTML file if not already present.
 * Inserts just before </body>, or at end of file if </body> not found.
 * Marks injected lines with a comment so we can remove them on exit.
 */
function injectDevToolsTag(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8')
  if (html.includes(DEVTOOLS_SCRIPT_TAG)) return  // already injected

  const injection = `  ${DEVTOOLS_COMMENT_TAG}\n  ${DEVTOOLS_SCRIPT_TAG}\n`

  if (html.includes('</body>')) {
    html = html.replace('</body>', injection + '</body>')
  } else {
    html = html + '\n' + injection
  }

  fs.writeFileSync(htmlPath, html)
  console.log(`   💉 DevTools injected → ${path.relative(process.cwd(), htmlPath)}`)
}

/**
 * Remove the injected devtools tag from an HTML file on watch exit.
 */
function removeDevToolsTag(htmlPath) {
  if (!fs.existsSync(htmlPath)) return
  let html = fs.readFileSync(htmlPath, 'utf8')
  if (!html.includes(DEVTOOLS_SCRIPT_TAG)) return

  // Remove the comment line + script line
  html = html
    .replace(/[ \t]*<!-- mizumi-devtools -->\n/g, '')
    .replace(/[ \t]*<script src="\.mizumi\/mizumi-devtools\.js"><\/script>\n?/g, '')

  fs.writeFileSync(htmlPath, html)
}

/**
 * watch(loadConfig, Mizumi, generateDevToolsScript)
 * Called from cli/index.js after an initial build.
 */
export async function watch(loadConfig, Mizumi, generateDevToolsScript) {
  const cwd        = process.cwd()
  const configPath = path.join(cwd, 'mizumi.config.js')
  const outDir     = path.join(cwd, '.mizumi')

  if (!chokidar) {
    console.error('❌ chokidar not installed — run: npm install chokidar')
    process.exit(1)
  }

  // ── Write devtools JS and inject into all HTML files ──
  const writeDevTools = async () => {
    try {
      const config = await loadConfig()
      const meta = {
        tokens:    config.tokens    || {},
        patterns:  config.patterns  || {},
        animations:config.animations|| {},
      }
      const devtoolsJS = generateDevToolsScript(meta)
      const outPath    = path.join(outDir, 'mizumi-devtools.js')
      fs.writeFileSync(outPath, devtoolsJS)
      console.log(`✅ DevTools: ${path.relative(cwd, outPath)}`)

      // Inject into all HTML files
      const htmlFiles = findHTMLFiles(cwd)
      htmlFiles.forEach(injectDevToolsTag)
      if (htmlFiles.length > 0) {
        console.log(`   💮 DevTools active on ${htmlFiles.length} HTML file(s) — open in browser\n`)
      }
    } catch (err) {
      console.error('❌ DevTools build failed:', err.message)
    }
  }

  // ── Cleanup on exit — strip injected tags from HTML ──
  const cleanup = () => {
    console.log('\n💮 Mizumi: Stopping watch — cleaning up DevTools tags...')
    findHTMLFiles(cwd).forEach(removeDevToolsTag)
    console.log('✅ Done.\n')
    process.exit(0)
  }
  process.on('SIGINT',  cleanup)
  process.on('SIGTERM', cleanup)

  const patterns = [
    configPath,
    path.join(cwd, '**/*.mizu'),
  ]

  console.log('💮 Mizumi watching for changes...')
  console.log('   Watching: mizumi.config.js + **/*.mizu')
  console.log('   DevTools: active in watch mode (auto-removed on Ctrl+C)')
  console.log('   Press Ctrl+C to stop\n')

  // Write devtools on start
  await writeDevTools()

  const watcher = chokidar.watch(patterns, {
    persistent:    true,
    ignoreInitial: true,
    ignored:       /node_modules/,
  })

  const rebuild = async (filePath) => {
    console.log('\n📝 Changed: ' + path.relative(cwd, filePath) + ' — rebuilding...')
    try {
      const config = await loadConfig()
      const mizumi = new Mizumi(config)
      const outDir_ = path.join(cwd, '.mizumi')

      // Rebuild CSS + runtime
      mizumi.build(outDir_)

      // Rebuild devtools with fresh config
      await writeDevTools()

      console.log('⏰ ' + new Date().toLocaleTimeString() + ' — Ready!\n')
    } catch (err) {
      console.error('❌ Build failed:', err.message)
      console.log('   Fix the error and save again...\n')
    }
  }

  watcher.on('change', rebuild)
  watcher.on('add',    rebuild)
  watcher.on('error',  err => console.error('❌ Watcher error:', err))
}