#!/usr/bin/env node
// packages/cli/index.js

import { watch } from './watcher.js';
import { DocsGenerator } from './docs-generator.js';
import path from 'path';
import fs from 'fs';
import Mizumi from '../core/index.js';
import { fileURLToPath, pathToFileURL } from 'url';

// Get command from args
const args = process.argv.slice(2);
const command = args[0];

// CLI commands
const commands = {

  /**
   * Initialize Mizumi in current project
   * npx mizumi init
   */
  init() {
    console.log('🌊 Initializing Mizumi...\n');

    // Default config template
    const configTemplate = `// mizumi.config.js
export {
  tokens: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        50: '#EFF6FF',
        600: '#2563EB',
        900: '#1E3A8A'
      },
      secondary: '#8B5CF6',
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        500: '#6B7280',
        900: '#111827'
      },
      surface: '#FFFFFF',
      text: '#111827',
      success: '#10B981',
      error: '#EF4444'
    },

    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px'
    },

    typography: {
      h1: { size: '48px', weight: 700, line: 1.2 },
      h2: { size: '36px', weight: 600, line: 1.3 },
      h3: { size: '24px', weight: 600, line: 1.4 },
      body: { size: '16px', weight: 400, line: 1.6 },
      small: { size: '14px', weight: 400, line: 1.5 }
    },

    radius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      full: '9999px'
    },

    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },

    animations: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500
      },
      easing: {
        smooth: 'power2.out',
        bouncy: 'elastic.out(1, 0.5)',
        sharp: 'power4.inOut'
      }
    }
  },

  patterns: {
    // Layout
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',

    // Containers
    container: 'max-w-6xl mx-auto pad-x-md',
    section: 'pad-y-2xl',

    // Cards
    card: 'bg-surface pad-md rounded-lg shadow-md',
    'card-elevated': 'card shadow-xl',
    'card-flat': 'card shadow-sm',
    'card-hover': 'card transition cursor-pointer',

    // Buttons
    button: 'pad-sm pad-x-lg rounded-md cursor-pointer transition inline-flex items-center justify-center',
    'btn-primary': 'button bg-primary color-white',
    'btn-secondary': 'button bg-secondary color-white',
    'btn-ghost': 'button bg-transparent color-primary',
    'btn-outline': 'button border border-primary color-primary',

    // Inputs
    input: 'pad-sm rounded-md border border-neutral-200 transition',

    // Text
    heading: 'text-h1 color-text',
    subheading: 'text-h3 color-neutral-500',
    'text-muted': 'color-neutral-500'
  },

  animations: {
    // Entrance
    'animate-fade-in': {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 300,
      ease: 'power2.out'
    },
    'animate-slide-up': {
      from: { y: 100, opacity: 0 },
      to: { y: 0, opacity: 1 },
      duration: 300,
      ease: 'power2.out'
    },
    'animate-scale-in': {
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      duration: 300,
      ease: 'back.out'
    },

    // Scroll
    'scroll-trigger': {
      scrollTrigger: {
        trigger: 'self',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    },

    // Hover
    'hover-lift': {
      hover: { y: -8, duration: 150 }
    },
    'hover-scale': {
      hover: { scale: 1.05, duration: 150 }
    },
    'hover-glow': {
      hover: {
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
        duration: 150
      }
    },

    // Click
    'active-press': {
      active: { scale: 0.95, duration: 100 }
    },

    // Stagger
    'stagger-children-100': {
      targets: 'children',
      stagger: 0.1,
      from: { opacity: 0, y: 20 },
      to: { opacity: 1, y: 0 }
    }
  },

  rules: {
    darkMode: false,
    responsive: true,
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  }
};
`;

    // Check if config already exists
    const configPath = path.join(process.cwd(), 'mizumi.config.js');

    if (fs.existsSync(configPath)) {
      console.log('⚠️  mizumi.config.js already exists, skipping...');
    } else {
      fs.writeFileSync(configPath, configTemplate);
      console.log('✅ Created: mizumi.config.js');
    }

    // Create .mizumi directory
    const mizumiDir = path.join(process.cwd(), '.mizumi');
    if (!fs.existsSync(mizumiDir)) {
      fs.mkdirSync(mizumiDir);
    }

    // Create .gitignore entry
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignore.includes('.mizumi')) {
        fs.appendFileSync(gitignorePath, '\n# Mizumi generated files\n.mizumi/\n');
        console.log('✅ Updated: .gitignore');
      }
    } else {
      fs.writeFileSync(gitignorePath, '# Mizumi generated files\n.mizumi/\n');
      console.log('✅ Created: .gitignore');
    }

    console.log('\n🎉 Mizumi initialized successfully!');
    console.log('\nNext steps:');
    console.log('  1. Edit mizumi.config.js to customize your tokens');
    console.log('  2. Run: node mizumi build');
    console.log('  3. Import .mizumi/mizumi.css in your project');
  },

  /**
   * Build CSS from config
   * npx mizumi build
   */
  build: async function() {
  console.log('🌊 Building Mizumi CSS...\n');

  // Find config file
  const configPath = path.join(process.cwd(), 'mizumi.config.js');
  if (!fs.existsSync(configPath)) {
    console.error('❌ mizumi.config.js not found!');
    console.error('   Run: node mizumi init');
    process.exit(1);
  }

  // Load config
  
const config = await import(pathToFileURL(configPath).href);


  // Generate CSS + Runtime JS
  const mizumi  = new Mizumi(config);
  const outDir  = path.join(process.cwd(), '.mizumi');
  mizumi.build(outDir); // ← now passes directory, not file path

  console.log('\n🎉 Build complete!');
  console.log('   Add to your HTML:');
  console.log('   <link rel="stylesheet" href=".mizumi/mizumi.css">');
  console.log('   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>');
  console.log('   <script src=".mizumi/mizumi-runtime.js"></script>');
},




  /**
   * List all patterns
   * npx mizumi list
   */
  list: async function() {
    const configPath = path.join(process.cwd(), 'mizumi.config.js');

    if (!fs.existsSync(configPath)) {
      console.error('❌ mizumi.config.js not found! Run: node mizumi init');
      process.exit(1);
    }

    
const config = await import(pathToFileURL(configPath).href);

    const mizumi = new Mizumi(config);

    console.log('\n🌊 Mizumi Patterns:\n');

    for (const [name, value] of Object.entries(config.patterns || {})) {
      const expanded = mizumi.expandClassName(name);
      console.log(`  .${name}`);
      console.log(`    → ${expanded}`);
      console.log('');
    }

    console.log('\n🌊 Mizumi Animations:\n');

    for (const [name, value] of Object.entries(config.animations || {})) {
      console.log(`  .${name}`);
      console.log(`    → GSAP: ${JSON.stringify(value).slice(0, 60)}...`);
      console.log('');
    }
  },

  /**
   * Explain what a class does
   * npx mizumi explain "card"
   */
  explain: async function() {
    const className = args[1];

    if (!className) {
      console.error('❌ Please provide a class name');
      console.error('   Usage: node mizumi explain "card"');
      process.exit(1);
    }

    const configPath = path.join(process.cwd(), 'mizumi.config.js');
    
const config = await import(pathToFileURL(configPath).href);

    const mizumi = new Mizumi(config);

    console.log(`\n🌊 Explaining: "${className}"\n`);

    const classes = className.split(' ');

    for (const cls of classes) {
      // Check if it's a pattern
      if (config.patterns?.[cls]) {
        const expanded = mizumi.expandClassName(cls);
        console.log(`  Pattern: .${cls}`);
        console.log(`  Expands to: ${expanded}`);
      }
      // Check if it's an animation
      else if (config.animations?.[cls]) {
        console.log(`  Animation: .${cls}`);
        console.log(`  Config: ${JSON.stringify(config.animations[cls], null, 4)}`);
      }
      // Check if it's a utility
      else {
        console.log(`  Utility: .${cls}`);
        console.log(`  (Built-in utility class)`);
      }
      console.log('');
    }
  },
  
  watch() {
    watch();
  },

  /**
   * Show help
   */
  help() {
  console.log(`
🌊 Mizumi CSS Framework v0.1.0

Commands:
  init              Initialize Mizumi in project
  build             Generate CSS + runtime JS
  watch             Watch config and auto-rebuild
  docs              Generate documentation page
  list              List all patterns & animations
  explain <class>   Explain what a class does
  help              Show help

Examples:
  node mizumi init
  node mizumi build
  node mizumi watch
  node mizumi list
  node mizumi explain "card animate-fade-in"
  `);
},



  docs: async function() {
    console.log('🌊 Generating Mizumi Docs...\n');
    const cfgPath = path.join(process.cwd(), 'mizumi.config.js');
    if (!fs.existsSync(cfgPath)) {
      console.error('❌ mizumi.config.js not found!');
      process.exit(1);
    }
    
const config = await import(pathToFileURL(cfgPath).href);

    const generator = new DocsGenerator(config);
    const html      = generator.generate();
    const outDir    = path.join(process.cwd(), '.mizumi');
    const outPath   = path.join(outDir, 'docs.html');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    fs.writeFileSync(outPath, html);
    console.log(`✅ Docs generated: ${outPath}`);
    console.log('\n🎉 Open in browser:');
    console.log(`   .mizumi/docs.html`);
  },

};

// Run command
if (commands[command]) {
  await commands[command](); // top-level await is allowed in ESM
} else {
  console.error(`❌ Unknown command: ${command}`);
  commands.help();
}
