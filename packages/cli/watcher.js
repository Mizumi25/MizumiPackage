// packages/cli/watcher.js
import fs from 'fs';
import path from 'path';
import { DocsGenerator } from './docs-generator.js';
import Mizumi from '../core/index.js';


function watch() {
  const configPath = path.join(process.cwd(), 'mizumi.config.js');
  const outDir     = path.join(process.cwd(), '.mizumi');

  if (!fs.existsSync(configPath)) {
    console.error('❌ mizumi.config.js not found! Run: node mizumi init');
    process.exit(1);
  }

  console.log('🌊 Mizumi watching for changes...');
  console.log(`   Watching: mizumi.config.js`);
  console.log('   Press Ctrl+C to stop\n');

  // Run initial build
  runBuild(configPath, outDir);

  // Watch the config file
  const watcher = chokidar.watch(configPath, {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', () => {
    console.log('\n📝 Config changed! Rebuilding...');
    runBuild(configPath, outDir);
  });

  watcher.on('error', err => {
    console.error('❌ Watcher error:', err);
  });
}

function runBuild(configPath, outDir) {
  try {
    // Clear require cache so config changes are picked up
    delete require.cache[require.resolve(configPath)];

    const config = require(configPath);
    const mizumi = new Mizumi(config);
    mizumi.build(outDir);

    console.log(`⏰ ${new Date().toLocaleTimeString()} — Ready!\n`);
  } catch (err) {
    console.error('❌ Build failed:', err.message);
    console.log('   Fix the error and save again...\n');
  }
}

export { watch };