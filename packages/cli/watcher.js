// packages/cli/watcher.js
import path     from 'node:path'
import { createRequire } from 'node:module'

// chokidar is CJS — load via createRequire in ESM
const require = createRequire(import.meta.url)
let chokidar
try {
  chokidar = require('chokidar')
} catch {
  chokidar = null
}

/**
 * watch(loadConfig, Mizumi)
 * Called from cli/index.js after an initial build.
 */
export async function watch(loadConfig, Mizumi) {
  const cwd        = process.cwd()
  const configPath = path.join(cwd, 'mizumi.config.js')
  const outDir     = path.join(cwd, '.mizumi')

  if (!chokidar) {
    console.error('❌ chokidar not installed — run: npm install chokidar')
    process.exit(1)
  }

  const patterns = [
    configPath,
    path.join(cwd, '**/*.mizu'),
  ]

  console.log('🌊 Mizumi watching for changes...')
  console.log('   Watching: mizumi.config.js + **/*.mizu')
  console.log('   Press Ctrl+C to stop\n')

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
      mizumi.build(outDir)
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