import path from 'path';
import fs from 'fs';
import postcss from 'postcss';
import Mizumi from '../core/index.js';
import { pathToFileURL } from 'url';

/**
 * Mizumi PostCSS Plugin
 * Auto-injects Mizumi CSS at build time
 */
function mizumiPostCSSPlugin(options = {}) {
  const configFile = options.config || 'mizumi.config.js';
  const outputDir = options.output || '.mizumi';
  
  let mizumiCSS = '';
  let isBuilt = false;

  return {
    postcssPlugin: 'postcss-mizumi',

    async Once(root, { result }) {
      if (isBuilt) return;

      const configPath = path.resolve(process.cwd(), configFile);

      if (!fs.existsSync(configPath)) {
        console.warn(`⚠️  Mizumi: ${configFile} not found, skipping...`);
        return;
      }

      try {
        const configModule = await import(pathToFileURL(configPath).href);
        const config = configModule.default || configModule;

        const mizumi = new Mizumi(config);
        const outDir = path.resolve(process.cwd(), outputDir);
        
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }

        mizumiCSS = mizumi.generateCSS();
        
        const cssPath = path.join(outDir, 'mizumi.css');
        fs.writeFileSync(cssPath, mizumiCSS);

        const jsPath = path.join(outDir, 'mizumi-runtime.js');
        const js = mizumi.generateRuntimeScript();
        fs.writeFileSync(jsPath, js);

        console.log('🌊 Mizumi CSS generated');
        
        isBuilt = true;

      } catch (err) {
        console.error('❌ Mizumi build failed:', err.message);
      }
    },

    OnceExit(root, { result }) {
      if (!mizumiCSS) return;

      // Parse and prepend Mizumi CSS
      const mizumiRoot = postcss.parse(mizumiCSS);
      
      mizumiRoot.nodes.forEach(node => {
        root.prepend(node.clone());
      });
    }
  };
}

mizumiPostCSSPlugin.postcss = true;

export default mizumiPostCSSPlugin;