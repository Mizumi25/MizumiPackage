# 🌊 Mizumi

**Design-token-first CSS framework with GSAP animations built-in.**

Mizumi combines the best parts of Tailwind (utility classes), design tokens (centralized values), and GSAP (smooth animations) into a single coherent system with zero enforced components.

## ✨ Features

- 🎨 **Token-based design system** - Define colors, spacing, typography once
- ⚡ **Auto-generated utilities** - `bg-primary`, `pad-md`, `text-h1`
- 🧩 **Pattern shortcuts** - Combine utilities into reusable patterns
- 🎬 **GSAP animations via classes** - `animate-fade-in`, `hover-lift`, `scroll-trigger`
- 📱 **Responsive variants** - `md:card`, `lg:flex-center`
- 🌙 **Dark mode** - `dark:bg-neutral-900`
- 🔧 **TypeScript support** - Auto-generated types
- ⚡ **Vite + PostCSS plugins** - Works with React, Vue, Next.js, etc.

## 🚀 Quick Start

### Install
```bash
npm install -D @mizumi/cli @mizumi/vite-plugin
# or
npm install -D @mizumi/cli @mizumi/postcss-plugin
```

### Initialize
```bash
npx mizumi init
```

This creates `mizumi.config.js`:
```javascript
export default {
  tokens: {
    colors: {
      primary: '#3B82F6',
      surface: '#FFFFFF'
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px'
    }
  },
  
  patterns: {
    card: 'bg-surface pad-md rounded-lg shadow-md'
  },
  
  animations: {
    'animate-fade-in': {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 0.3
    }
  }
}
```

### Use with Vite (React/Vue)
```javascript
// vite.config.js
import mizumi from '@mizumi/vite-plugin'

export default {
  plugins: [mizumi()]
}
```
```html
<!-- index.html -->
<link rel="stylesheet" href="/.mizumi/mizumi.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
<script src="/.mizumi/mizumi-runtime.js"></script>
```
```jsx
// Your component
<div className="card animate-fade-in hover-lift">
  <h1 className="text-h1">Hello Mizumi!</h1>
</div>
```

### Use with PostCSS (Next.js/Nuxt)
```javascript
// postcss.config.js
import mizumi from '@mizumi/postcss-plugin'

export default {
  plugins: [mizumi()]
}
```

### Use with plain HTML
```bash
npx mizumi build
```
```html
<link rel="stylesheet" href=".mizumi/mizumi.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
<script src=".mizumi/mizumi-runtime.js"></script>

<div class="card animate-fade-in">
  <h1 class="text-h1">Hello Mizumi!</h1>
</div>
```

## 📚 Documentation

### Tokens

Define your design values once:
```javascript
tokens: {
  colors: {
    primary: { DEFAULT: '#3B82F6', 600: '#2563EB' },
    neutral: { 50: '#F9FAFB', 900: '#111827' }
  },
  spacing: { xs: '4px', sm: '8px', md: '16px' },
  typography: {
    h1: { size: '48px', weight: 700, line: 1.2 }
  },
  radius: { md: '8px', lg: '16px', full: '9999px' },
  shadows: {
    md: '0 4px 6px -1px rgba(0,0,0,0.1)'
  }
}
```

### Auto-Generated Utilities

Tokens automatically generate utility classes:

- **Colors**: `bg-primary`, `color-neutral-500`, `border-primary-600`
- **Spacing**: `pad-md`, `pad-x-lg`, `mar-y-sm`, `gap-xl`
- **Typography**: `text-h1`, `text-body`
- **Radius**: `rounded-md`, `rounded-full`
- **Shadows**: `shadow-md`, `shadow-xl`

Plus static utilities: `flex`, `grid`, `items-center`, `justify-between`, etc.

### Patterns

Combine utilities into semantic shortcuts:
```javascript
patterns: {
  card: 'bg-surface pad-md rounded-lg shadow-md',
  'btn-primary': 'button bg-primary color-white hover-lift',
  container: 'max-w-6xl mx-auto pad-x-md'
}
```

Use:
```html
<div class="card">
  <button class="btn-primary">Click me</button>
</div>
```

Patterns can reference other patterns:
```javascript
patterns: {
  button: 'pad-sm rounded-md cursor-pointer',
  'btn-primary': 'button bg-primary color-white'
}
```

### Animations (GSAP)

**Entrance animations:**
```html
<div class="animate-fade-in">Fades in</div>
<div class="animate-slide-up">Slides up</div>
<div class="animate-scale-in">Scales in</div>
```

**Scroll-triggered:**
```html
<div class="animate-fade-in scroll-trigger">
  Animates when scrolled into view
</div>
```

**Hover effects:**
```html
<button class="hover-lift">Lifts on hover</button>
<button class="hover-scale">Scales on hover</button>
<button class="hover-glow">Glows on hover</button>
```

**Click effects:**
```html
<button class="active-press">Presses on click</button>
```

**Stagger children:**
```html
<div class="stagger-children-100">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

**Animation modifiers:**
```html
<div class="animate-fade-in duration-1000 delay-200 ease-bouncy">
  Custom timing
</div>
```

**Data attribute overrides:**
```html
<div 
  class="animate-fade-in"
  data-gsap-duration="2000"
  data-gsap-ease="elastic.out(1, 0.3)"
>
  Precise control
</div>
```

### Responsive Variants
```html
<div class="flex-col md:flex-between lg:grid">
  Responsive layout
</div>
```

### State Variants
```html
<button class="bg-primary hover:bg-primary-600 active:bg-primary-900">
  State-based colors
</button>
```

### Dark Mode
```javascript
rules: {
  darkMode: 'class' // or 'media'
}
```
```html
<div class="bg-white dark:bg-neutral-900">
  Adapts to dark mode
</div>

<button onclick="document.documentElement.classList.toggle('dark')">
  Toggle Dark Mode
</button>
```

## 🛠 CLI Commands
```bash
npx mizumi init              # Initialize config
npx mizumi build             # Generate CSS + runtime
npx mizumi watch             # Auto-rebuild on changes
npx mizumi docs              # Generate documentation
npx mizumi list              # List all patterns/animations
npx mizumi explain "card"    # Explain what a class does
```

## 📦 Packages

- `@mizumi/core` - Core CSS generation engine
- `@mizumi/cli` - Command-line interface
- `@mizumi/vite-plugin` - Vite integration
- `@mizumi/postcss-plugin` - PostCSS integration

## 🎯 Philosophy

Mizumi is built on these principles:

1. **Token-first design** - Single source of truth for values
2. **Zero enforced components** - Total UI freedom
3. **Pattern composition** - No repetition, semantic naming
4. **Animation as first-class** - GSAP power via class names
5. **Framework agnostic** - Works everywhere

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss changes.

## 📄 License

MIT

## 🌊 Why "Mizumi"?

Mizumi (水海) means "water sea" in Japanese - representing flow, fluidity, and the seamless integration of design tokens, utilities, and animations.

---

Built with ❤️ for developers who want total freedom without sacrificing developer experience.