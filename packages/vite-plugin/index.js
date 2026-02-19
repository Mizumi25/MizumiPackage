// packages/vite-plugin/index.js
import path from 'node:path'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import Mizumi from '../core/index.js'

function mizumiPlugin(options = {}) {
  const configFile = options.config || 'mizumi.config.js'
  const outputDir = options.output || '.mizumi'
  
  let root = process.cwd()
  let configPath

  return {
    name: 'vite-plugin-mizumi',

    async configResolved(config) {
      root = config.root
      configPath = path.resolve(root, configFile)

      if (!fs.existsSync(configPath)) {
        console.warn(`⚠️  Mizumi: ${configFile} not found, skipping...`)
        return
      }

      console.log('🌊 Mizumi: Initial build...')
      await buildMizumi(configPath, path.resolve(root, outputDir))
    },

    configureServer(server) {
      if (!fs.existsSync(configPath)) return

      server.watcher.add(configPath)

      server.watcher.on('change', async (file) => {
        if (file === configPath) {
          console.log('🌊 Mizumi: Config changed, rebuilding...')
          
          await buildMizumi(configPath, path.resolve(root, outputDir))

          server.ws.send({
            type: 'full-reload',
            path: '*'
          })
        }
      })
    },

    async buildStart() {
      if (!fs.existsSync(configPath)) return
      
      console.log('🌊 Mizumi: Building for production...')
      await buildMizumi(configPath, path.resolve(root, outputDir))
    }
  }
}

async function buildMizumi(configPath, outputDir) {
  try {
    // Dynamic ESM import (NO require)
    const configModule = await import(
      pathToFileURL(configPath).href + `?t=${Date.now()}`
    )

    const config = configModule.default || configModule

    const mizumi = new Mizumi(config)
    mizumi.build(outputDir)

  } catch (err) {
    console.error('❌ Mizumi build failed:', err.message)
  }
}

export default mizumiPlugin
