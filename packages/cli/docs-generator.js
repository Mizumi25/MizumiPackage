// packages/cli/docs-generator.js
import fs   from 'fs'
import path from 'path'

export class DocsGenerator {
  constructor(config) {
    this.config     = config
    this.tokens     = config.tokens     || {}
    this.patterns   = config.patterns   || {}
    this.animations = config.animations || {}
    this.rules      = config.rules      || {}
  }

  generate(outputDir = '.mizumi/docs') {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    const html    = this._buildHTML()
    const outPath = path.join(outputDir, 'index.html')
    fs.writeFileSync(outPath, html, 'utf8')
    console.log(`✅ Docs: ${outPath}`)
    return outPath
  }

  // ── Token counts ──
  countTokens() {
    let count = 0
    for (const [, v] of Object.entries(this.tokens)) {
      if (typeof v === 'object') {
        for (const [, val] of Object.entries(v)) {
          if (typeof val === 'object') count += Object.keys(val).length
          else count++
        }
      }
    }
    return count
  }

  // ── Utility class examples per capability ──
  getUtilityExamples() {
    const T = this.tokens
    const examples = []

    // Colors
    if (T.colors) {
      const colorKeys = Object.entries(T.colors).slice(0, 3)
      for (const [key, val] of colorKeys) {
        const name = typeof val === 'object' ? key : key
        examples.push({ cap: 'ink',        value: name, css: 'color',            preview: 'color' })
        examples.push({ cap: 'paint',      value: name, css: 'background-color', preview: 'bg' })
        examples.push({ cap: 'stroke-color', value: name, css: 'border-color',   preview: 'border' })
      }
    }

    // Spacing
    if (T.spacing) {
      const keys = Object.keys(T.spacing).slice(0, 4)
      for (const k of keys) {
        examples.push({ cap: 'pad',   value: k, css: 'padding',        preview: 'spacing' })
        examples.push({ cap: 'mar',   value: k, css: 'margin',         preview: 'spacing' })
        examples.push({ cap: 'gap',   value: k, css: 'gap',            preview: 'spacing' })
        examples.push({ cap: 'pad-x', value: k, css: 'padding-inline', preview: 'spacing' })
        examples.push({ cap: 'pad-y', value: k, css: 'padding-block',  preview: 'spacing' })
      }
    }

    // Typography
    if (T.typography) {
      for (const k of Object.keys(T.typography)) {
        examples.push({ cap: 'text',        value: k, css: 'font-size + weight + line-height', preview: 'text' })
        examples.push({ cap: 'type-size',   value: k, css: 'font-size',   preview: 'text' })
        examples.push({ cap: 'type-weight', value: k, css: 'font-weight', preview: 'text' })
      }
    }

    // Fonts
    if (T.fonts) {
      for (const k of Object.keys(T.fonts)) {
        examples.push({ cap: 'type-face', value: k, css: 'font-family', preview: 'font' })
      }
    }

    // Radius
    if (T.radius) {
      for (const k of Object.keys(T.radius)) {
        examples.push({ cap: 'curve', value: k, css: 'border-radius', preview: 'radius' })
      }
    }

    // Shadows
    if (T.shadows) {
      for (const k of Object.keys(T.shadows)) {
        examples.push({ cap: 'cast',       value: k, css: 'box-shadow',  preview: 'shadow' })
        examples.push({ cap: 'cast-inner', value: k, css: 'box-shadow (inset)', preview: 'shadow' })
        examples.push({ cap: 'cast-text',  value: k, css: 'text-shadow', preview: 'shadow' })
      }
    }

    // Opacity
    if (T.opacity) {
      for (const k of Object.keys(T.opacity)) {
        examples.push({ cap: 'canvas-fade', value: k, css: 'opacity', preview: 'opacity' })
      }
    }

    // Blur
    if (T.blur) {
      for (const k of Object.keys(T.blur)) {
        examples.push({ cap: 'glass-blur', value: k, css: 'backdrop-filter: blur()', preview: 'blur' })
        examples.push({ cap: 'glow-blur',  value: k, css: 'filter: blur()',          preview: 'blur' })
      }
    }

    // Leading
    if (T.leading) {
      for (const k of Object.keys(T.leading)) {
        examples.push({ cap: 'leading', value: k, css: 'line-height', preview: 'text' })
      }
    }

    // Tracking
    if (T.tracking) {
      for (const k of Object.keys(T.tracking)) {
        examples.push({ cap: 'tracking', value: k, css: 'letter-spacing', preview: 'text' })
      }
    }

    // Z-index
    if (T.zIndex) {
      for (const k of Object.keys(T.zIndex)) {
        examples.push({ cap: 'layer', value: k, css: 'z-index', preview: 'layer' })
      }
    }

    // Easing
    if (T.easing) {
      for (const k of Object.keys(T.easing)) {
        examples.push({ cap: 'ease-curve', value: k, css: 'transition-timing-function', preview: 'ease' })
      }
    }

    // Duration
    if (T.duration) {
      for (const k of Object.keys(T.duration)) {
        examples.push({ cap: 'ease-speed', value: k, css: 'transition-duration', preview: 'ease' })
        examples.push({ cap: 'ease-wait',  value: k, css: 'transition-delay',    preview: 'ease' })
      }
    }

    return examples
  }

  // ── Static utility categories ──
  getStaticCategories() {
    return [
      {
        name: 'Display', utilities: [
          { cls: 'display:flex',        css: 'display: flex' },
          { cls: 'display:grid',        css: 'display: grid' },
          { cls: 'display:block',       css: 'display: block' },
          { cls: 'display:inline',      css: 'display: inline' },
          { cls: 'display:none',        css: 'display: none' },
          { cls: 'display:flex-inline', css: 'display: inline-flex' },
          { cls: 'display:grid-inline', css: 'display: inline-grid' },
          { cls: 'display:contents',    css: 'display: contents' },
        ]
      },
      {
        name: 'Flex', utilities: [
          { cls: 'flex-dir:row',     css: 'flex-direction: row' },
          { cls: 'flex-dir:col',     css: 'flex-direction: column' },
          { cls: 'flex-dir:row-rev', css: 'flex-direction: row-reverse' },
          { cls: 'flex-dir:col-rev', css: 'flex-direction: column-reverse' },
          { cls: 'flex-wrap:yes',    css: 'flex-wrap: wrap' },
          { cls: 'flex-wrap:no',     css: 'flex-wrap: nowrap' },
        ]
      },
      {
        name: 'Alignment', utilities: [
          { cls: 'align-x:center',  css: 'justify-content: center' },
          { cls: 'align-x:between', css: 'justify-content: space-between' },
          { cls: 'align-x:start',   css: 'justify-content: flex-start' },
          { cls: 'align-x:end',     css: 'justify-content: flex-end' },
          { cls: 'align-yi:center', css: 'align-items: center' },
          { cls: 'align-yi:start',  css: 'align-items: flex-start' },
          { cls: 'align-yi:end',    css: 'align-items: flex-end' },
          { cls: 'align-ys:center', css: 'align-self: center' },
          { cls: 'place:center',    css: 'place-content: center' },
        ]
      },
      {
        name: 'Position', utilities: [
          { cls: 'pos:relative', css: 'position: relative' },
          { cls: 'pos:absolute', css: 'position: absolute' },
          { cls: 'pos:fixed',    css: 'position: fixed' },
          { cls: 'pos:sticky',   css: 'position: sticky' },
          { cls: 'pos:static',   css: 'position: static' },
        ]
      },
      {
        name: 'Overflow', utilities: [
          { cls: 'overflow:hidden',  css: 'overflow: hidden' },
          { cls: 'overflow:auto',    css: 'overflow: auto' },
          { cls: 'overflow:scroll',  css: 'overflow: scroll' },
          { cls: 'overflow:visible', css: 'overflow: visible' },
          { cls: 'overflow:clip',    css: 'overflow: clip' },
        ]
      },
      {
        name: 'Sizing', utilities: [
          { cls: 'canvas-w:full',   css: 'width: 100%' },
          { cls: 'canvas-w:screen', css: 'width: 100vw' },
          { cls: 'canvas-w:auto',   css: 'width: auto' },
          { cls: 'canvas-h:full',   css: 'height: 100%' },
          { cls: 'canvas-h:screen', css: 'height: 100vh' },
          { cls: 'canvas-h:auto',   css: 'height: auto' },
          { cls: 'mar-x:auto',      css: 'margin-inline: auto' },
        ]
      },
      {
        name: 'Typography', utilities: [
          { cls: 'text-align:center', css: 'text-align: center' },
          { cls: 'text-align:left',   css: 'text-align: left' },
          { cls: 'text-align:right',  css: 'text-align: right' },
          { cls: 'text-case:upper',   css: 'text-transform: uppercase' },
          { cls: 'text-case:lower',   css: 'text-transform: lowercase' },
          { cls: 'text-case:capital', css: 'text-transform: capitalize' },
          { cls: 'type-weight:bold',  css: 'font-weight: bold' },
          { cls: 'type-weight:semi',  css: 'font-weight: 600' },
          { cls: 'type-weight:medium',css: 'font-weight: 500' },
          { cls: 'type-style:italic', css: 'font-style: italic' },
        ]
      },
      {
        name: 'Cursor & Interaction', utilities: [
          { cls: 'cursor:pointer', css: 'cursor: pointer' },
          { cls: 'cursor:default', css: 'cursor: default' },
          { cls: 'cursor:none',    css: 'cursor: none' },
          { cls: 'cursor:grab',    css: 'cursor: grab' },
          { cls: 'select:none',    css: 'user-select: none' },
          { cls: 'events:none',    css: 'pointer-events: none' },
          { cls: 'events:all',     css: 'pointer-events: all' },
        ]
      },
      {
        name: 'Border Style', utilities: [
          { cls: 'stroke-style:solid',  css: 'border-style: solid' },
          { cls: 'stroke-style:dashed', css: 'border-style: dashed' },
          { cls: 'stroke-style:dotted', css: 'border-style: dotted' },
          { cls: 'stroke-style:none',   css: 'border-style: none' },
        ]
      },
    ]
  }

  // ── Animation type badge ──
  getAnimType(config) {
    if (config.hover)                  return { label: 'hover',    color: '#a78bfa' }
    if (config.active)                 return { label: 'click',    color: '#f87171' }
    if (config.targets === 'children') return { label: 'stagger',  color: '#fbbf24' }
    if (config.scrollTrigger)          return { label: 'scroll',   color: '#38bdf8' }
    if (config.repeat === -1)          return { label: 'loop',     color: '#e879f9' }
    return                                    { label: 'entrance', color: '#34d399' }
  }

  // ── Arbitrary value examples ──
  getArbitraryExamples() {
    return [
      { cls: 'pad:clamp(1rem,4vw,3rem)',          desc: 'Fluid padding using CSS clamp()' },
      { cls: 'type-size:clamp(2rem,5vw,5rem)',    desc: 'Fluid font size' },
      { cls: 'canvas-w:min(100%,1200px)',         desc: 'Responsive max-width container' },
      { cls: 'curve:24px',                        desc: 'Arbitrary border radius' },
      { cls: 'cast:0_8px_32px_rgba(0,0,0,0.4)',  desc: 'Custom box shadow (use _ for spaces)' },
      { cls: 'ink:#ff6b6b',                       desc: 'Arbitrary hex color' },
      { cls: 'paint:rgba(0,0,0,0.5)',             desc: 'Arbitrary rgba background' },
      { cls: 'tracking:-0.04em',                  desc: 'Arbitrary letter spacing' },
      { cls: 'leading:0.9',                       desc: 'Arbitrary line height' },
      { cls: 'canvas-w:calc(100%-2rem)',          desc: 'CSS calc() value' },
    ]
  }

  _buildHTML() {
    const tokenCount   = this.countTokens()
    const patternCount = Object.keys(this.patterns).length
    const animCount    = Object.keys(this.animations).length
    const utilExamples = this.getUtilityExamples()
    const staticCats   = this.getStaticCategories()
    const arbitrary    = this.getArbitraryExamples()
    const bpCount      = Object.keys(this.rules.breakpoints || {}).length

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mizumi Docs 🌊</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --ink:       #e8e4dc;
      --ink-muted: #7a7568;
      --ink-dim:   #3d3a34;
      --surface:   #0e0d0b;
      --surface-2: #141310;
      --surface-3: #1a1916;
      --border:    #2a2823;
      --accent:    #c9a96e;
      --accent-2:  #8b6f47;
      --serif:     'IM Fell English', Georgia, serif;
      --mono:      'DM Mono', monospace;
      --sans:      system-ui, sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--surface);
      color: var(--ink);
      font-family: var(--sans);
      font-size: 15px;
      line-height: 1.6;
      min-height: 100vh;
    }

    /* ── LAYOUT ── */
    .sidebar {
      position: fixed;
      top: 0; left: 0;
      width: 220px;
      height: 100vh;
      background: var(--surface-2);
      border-right: 1px solid var(--border);
      overflow-y: auto;
      padding: 0;
      z-index: 100;
    }

    .main {
      margin-left: 220px;
      max-width: 1100px;
      padding: 0 48px 120px;
    }

    /* ── SIDEBAR ── */
    .sidebar-header {
      padding: 32px 24px 24px;
      border-bottom: 1px solid var(--border);
    }

    .sidebar-logo {
      font-family: var(--serif);
      font-size: 22px;
      color: var(--ink);
      letter-spacing: -0.02em;
      margin-bottom: 4px;
    }

    .sidebar-version {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--ink-muted);
      letter-spacing: 0.1em;
    }

    .nav-group { padding: 20px 0 4px; }

    .nav-label {
      padding: 0 24px 8px;
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink-dim);
    }

    .nav-link {
      display: block;
      padding: 7px 24px;
      font-family: var(--mono);
      font-size: 12px;
      color: var(--ink-muted);
      text-decoration: none;
      border-left: 2px solid transparent;
      transition: all 0.15s;
    }

    .nav-link:hover {
      color: var(--ink);
      border-left-color: var(--accent);
      background: rgba(201,169,110,0.04);
    }

    /* ── SECTIONS ── */
    .hero {
      padding: 80px 0 64px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 80px;
    }

    .hero-eyebrow {
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 20px;
    }

    .hero-title {
      font-family: var(--serif);
      font-size: clamp(3rem, 6vw, 5.5rem);
      line-height: 0.95;
      letter-spacing: -0.03em;
      color: var(--ink);
      margin-bottom: 24px;
    }

    .hero-title em {
      color: var(--ink-muted);
      font-style: italic;
    }

    .hero-sub {
      font-family: var(--mono);
      font-size: 13px;
      color: var(--ink-muted);
      max-width: 480px;
      line-height: 1.7;
      margin-bottom: 40px;
    }

    .stats {
      display: flex;
      gap: 40px;
      flex-wrap: wrap;
    }

    .stat-item { display: flex; flex-direction: column; gap: 4px; }

    .stat-num {
      font-family: var(--serif);
      font-size: 2.5rem;
      line-height: 1;
      color: var(--accent);
      letter-spacing: -0.03em;
    }

    .stat-label {
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }

    /* ── SECTION HEADERS ── */
    .section { margin-bottom: 80px; }

    .section-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 40px;
    }

    .section-title {
      font-family: var(--serif);
      font-size: clamp(1.8rem, 3vw, 2.8rem);
      line-height: 1;
      letter-spacing: -0.03em;
      color: var(--ink);
    }

    .section-count {
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--ink-muted);
      padding-bottom: 4px;
    }

    .subsection-title {
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink-muted);
      margin: 40px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    /* ── SEARCH ── */
    .search-wrap {
      position: relative;
      margin-bottom: 48px;
    }

    .search {
      width: 100%;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 14px 20px;
      color: var(--ink);
      font-family: var(--mono);
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }

    .search:focus { border-color: var(--accent); }
    .search::placeholder { color: var(--ink-dim); }

    /* ── TOKEN TABLES ── */
    .token-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }

    .token-table th {
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink-muted);
      text-align: left;
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
    }

    .token-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      font-family: var(--mono);
      font-size: 12px;
      vertical-align: middle;
    }

    .token-table tr:hover td { background: var(--surface-2); }

    .token-name { color: var(--accent); }
    .token-var  { color: var(--ink-muted); font-size: 11px; }
    .token-val  { color: var(--ink-dim); }

    .color-chip {
      width: 28px; height: 28px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
      display: inline-block;
      vertical-align: middle;
    }

    .radius-chip {
      width: 28px; height: 28px;
      background: var(--accent-2);
      display: inline-block;
      vertical-align: middle;
      opacity: 0.7;
    }

    /* ── UTILITY ROWS ── */
    .utility-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
      transition: background 0.1s;
    }

    .utility-row:hover { background: var(--surface-2); }

    .utility-cls {
      font-family: var(--mono);
      font-size: 12px;
      color: var(--accent);
      min-width: 260px;
      flex-shrink: 0;
    }

    .utility-arrow {
      color: var(--ink-dim);
      font-size: 11px;
      flex-shrink: 0;
    }

    .utility-css {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--ink-muted);
      flex: 1;
    }

    /* ── PATTERN ROWS ── */
    .pattern-row {
      border: 1px solid var(--border);
      border-radius: 4px;
      margin-bottom: 8px;
      overflow: hidden;
      transition: border-color 0.15s;
    }

    .pattern-row:hover { border-color: var(--accent-2); }

    .pattern-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: var(--surface-2);
      cursor: pointer;
    }

    .pattern-name {
      font-family: var(--mono);
      font-size: 13px;
      color: var(--accent);
    }

    .pattern-toggle {
      font-family: var(--mono);
      font-size: 10px;
      color: var(--ink-dim);
      letter-spacing: 0.1em;
    }

    .pattern-body {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
      display: none;
    }

    .pattern-body.open { display: block; }

    .pattern-value {
      font-family: var(--mono);
      font-size: 12px;
      color: var(--ink-muted);
      line-height: 1.8;
      margin-bottom: 16px;
      word-break: break-all;
    }

    .pattern-usage {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 3px;
      padding: 10px 14px;
      font-family: var(--mono);
      font-size: 12px;
      color: #86efac;
    }

    /* ── ANIMATION ROWS ── */
    .anim-row {
      border: 1px solid var(--border);
      border-radius: 4px;
      margin-bottom: 8px;
      overflow: hidden;
    }

    .anim-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: var(--surface-2);
    }

    .anim-name {
      font-family: var(--mono);
      font-size: 13px;
      color: var(--accent);
      flex: 1;
    }

    .anim-badge {
      font-family: var(--mono);
      font-size: 10px;
      font-weight: 500;
      padding: 3px 10px;
      border-radius: 999px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .anim-body {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
    }

    .anim-config {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--ink-muted);
      line-height: 1.7;
      white-space: pre-wrap;
      margin-bottom: 12px;
    }

    .anim-usage {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 3px;
      padding: 10px 14px;
      font-family: var(--mono);
      font-size: 12px;
      color: #86efac;
    }

    /* ── ARBITRARY SECTION ── */
    .arbitrary-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      transition: background 0.1s;
    }

    .arbitrary-row:hover { background: var(--surface-2); }

    .arbitrary-cls {
      font-family: var(--mono);
      font-size: 12px;
      color: var(--accent);
    }

    .arbitrary-desc {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--ink-muted);
    }

    /* ── MIZU SYNTAX ── */
    .code-block {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 24px;
      font-family: var(--mono);
      font-size: 12px;
      line-height: 1.8;
      color: var(--ink-muted);
      white-space: pre;
      overflow-x: auto;
      margin-bottom: 24px;
    }

    .code-keyword  { color: #38bdf8; }
    .code-name     { color: var(--accent); }
    .code-value    { color: #86efac; }
    .code-comment  { color: var(--ink-dim); }

    /* ── MODIFIER GRID ── */
    .modifier-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 8px;
      margin-bottom: 24px;
    }

    .modifier-card {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 12px 14px;
    }

    .modifier-cls {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--accent);
      margin-bottom: 4px;
    }

    .modifier-val {
      font-family: var(--mono);
      font-size: 10px;
      color: var(--ink-muted);
    }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

    /* ── COPY BUTTON ── */
    .copy-btn {
      background: none;
      border: 1px solid var(--border);
      border-radius: 3px;
      padding: 3px 10px;
      font-family: var(--mono);
      font-size: 10px;
      color: var(--ink-muted);
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.05em;
    }

    .copy-btn:hover { border-color: var(--accent); color: var(--accent); }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; padding: 0 20px 80px; }
    }

    /* ── HIDDEN ── */
    .hidden { display: none !important; }
  </style>
</head>
<body>

<!-- SIDEBAR -->
<nav class="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-logo">Mizumi 🌊</div>
    <div class="sidebar-version">v0.1.0 — Auto-generated</div>
  </div>

  <div class="nav-group">
    <div class="nav-label">Overview</div>
    <a href="#overview" class="nav-link">Overview</a>
    <a href="#arbitrary" class="nav-link">Arbitrary Values</a>
    <a href="#mizu-syntax" class="nav-link">.mizu Syntax</a>
  </div>

  <div class="nav-group">
    <div class="nav-label">Design Tokens</div>
    ${this.tokens.colors     ? '<a href="#colors" class="nav-link">Colors</a>' : ''}
    ${this.tokens.spacing    ? '<a href="#spacing" class="nav-link">Spacing</a>' : ''}
    ${this.tokens.typography ? '<a href="#typography" class="nav-link">Typography</a>' : ''}
    ${this.tokens.fonts      ? '<a href="#fonts" class="nav-link">Fonts</a>' : ''}
    ${this.tokens.radius     ? '<a href="#radius" class="nav-link">Radius</a>' : ''}
    ${this.tokens.shadows    ? '<a href="#shadows" class="nav-link">Shadows</a>' : ''}
    ${this.tokens.easing     ? '<a href="#easing" class="nav-link">Easing</a>' : ''}
    ${this.tokens.duration   ? '<a href="#duration" class="nav-link">Duration</a>' : ''}
    ${this.tokens.blur       ? '<a href="#blur" class="nav-link">Blur</a>' : ''}
    ${this.tokens.opacity    ? '<a href="#opacity" class="nav-link">Opacity</a>' : ''}
    ${this.tokens.zIndex     ? '<a href="#zindex" class="nav-link">Z-Index</a>' : ''}
    ${this.tokens.leading    ? '<a href="#leading" class="nav-link">Leading</a>' : ''}
    ${this.tokens.tracking   ? '<a href="#tracking" class="nav-link">Tracking</a>' : ''}
  </div>

  <div class="nav-group">
    <div class="nav-label">Utilities</div>
    <a href="#token-utilities" class="nav-link">Token Utilities</a>
    <a href="#static-utilities" class="nav-link">Static Utilities</a>
  </div>

  ${patternCount > 0 ? `
  <div class="nav-group">
    <div class="nav-label">Patterns</div>
    <a href="#patterns" class="nav-link">All Patterns</a>
  </div>` : ''}

  ${animCount > 0 ? `
  <div class="nav-group">
    <div class="nav-label">Animations</div>
    <a href="#animations" class="nav-link">All Animations</a>
    <a href="#modifiers" class="nav-link">Modifiers</a>
  </div>` : ''}
</nav>

<!-- MAIN -->
<main class="main">

  <!-- SEARCH -->
  <div class="search-wrap" style="padding-top: 40px;">
    <input class="search" type="text" placeholder="Search tokens, utilities, patterns..." oninput="handleSearch(this.value)">
  </div>

  <!-- HERO -->
  <section class="hero" id="overview">
    <div class="hero-eyebrow">Documentation</div>
    <h1 class="hero-title">Mizumi<br><em>Design System</em></h1>
    <p class="hero-sub">
      A designer-first CSS framework. Token-based. Colon-syntax. 
      Arbitrary values. GSAP animations — all from a single config.
      Auto-generated from your <code style="color:var(--accent);font-family:var(--mono)">mizumi.config.js</code>.
    </p>
    <div class="stats">
      <div class="stat-item">
        <span class="stat-num">${tokenCount}</span>
        <span class="stat-label">Tokens</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">${patternCount}</span>
        <span class="stat-label">Patterns</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">${animCount}</span>
        <span class="stat-label">Animations</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">${bpCount}</span>
        <span class="stat-label">Breakpoints</span>
      </div>
    </div>
  </section>

  <!-- COLORS -->
  ${this.tokens.colors ? `
  <section class="section" id="colors">
    <div class="section-header">
      <h2 class="section-title">Colors</h2>
      <span class="section-count">${Object.keys(this.tokens.colors).length} defined</span>
    </div>
    <table class="token-table">
      <thead>
        <tr>
          <th></th>
          <th>Token</th>
          <th>CSS Variable</th>
          <th>Value</th>
          <th>Utilities</th>
        </tr>
      </thead>
      <tbody>
        ${this._colorRows()}
      </tbody>
    </table>
  </section>` : ''}

  <!-- SPACING -->
  ${this.tokens.spacing ? `
  <section class="section" id="spacing">
    <div class="section-header">
      <h2 class="section-title">Spacing</h2>
      <span class="section-count">${Object.keys(this.tokens.spacing).length} defined</span>
    </div>
    <table class="token-table">
      <thead>
        <tr><th>Token</th><th>Variable</th><th>Value</th><th>Preview</th></tr>
      </thead>
      <tbody>
        ${Object.entries(this.tokens.spacing).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">pad:${k} · mar:${k} · gap:${k}</td>
            <td class="token-var">--spacing-${k}</td>
            <td class="token-val">${v}</td>
            <td><div style="width:${Math.min(parseInt(v)*1.5, 200)}px;height:12px;background:var(--accent-2);border-radius:2px;opacity:0.6;"></div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- TYPOGRAPHY -->
  ${this.tokens.typography ? `
  <section class="section" id="typography">
    <div class="section-header">
      <h2 class="section-title">Typography</h2>
      <span class="section-count">${Object.keys(this.tokens.typography).length} scales</span>
    </div>
    <table class="token-table">
      <thead>
        <tr><th>Token</th><th>Size</th><th>Weight</th><th>Line Height</th><th>Preview</th></tr>
      </thead>
      <tbody>
        ${Object.entries(this.tokens.typography).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">text:${k}</td>
            <td class="token-val">${v.size || '—'}</td>
            <td class="token-val">${v.weight || '—'}</td>
            <td class="token-val">${v.line || '—'}</td>
            <td style="font-size:${v.size};font-weight:${v.weight};line-height:${v.line};color:var(--ink);max-width:200px;overflow:hidden;white-space:nowrap;">Aa</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- FONTS -->
  ${this.tokens.fonts ? `
  <section class="section" id="fonts">
    <div class="section-header">
      <h2 class="section-title">Fonts</h2>
      <span class="section-count">${Object.keys(this.tokens.fonts).length} faces</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Token</th><th>Variable</th><th>Stack</th><th>Preview</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.fonts).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">type-face:${k}</td>
            <td class="token-var">--font-${k}</td>
            <td class="token-val" style="font-size:11px;">${v}</td>
            <td style="font-family:${v};font-size:18px;color:var(--ink);">The quick brown fox</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- RADIUS -->
  ${this.tokens.radius ? `
  <section class="section" id="radius">
    <div class="section-header">
      <h2 class="section-title">Border Radius</h2>
      <span class="section-count">${Object.keys(this.tokens.radius).length} values</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Preview</th><th>Token</th><th>Variable</th><th>Value</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.radius).map(([k, v]) => `
          <tr class="searchable">
            <td><div style="width:36px;height:36px;background:var(--accent-2);border-radius:${v};opacity:0.7;"></div></td>
            <td class="token-name">curve:${k}</td>
            <td class="token-var">--radius-${k}</td>
            <td class="token-val">${v}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- SHADOWS -->
  ${this.tokens.shadows ? `
  <section class="section" id="shadows">
    <div class="section-header">
      <h2 class="section-title">Shadows</h2>
      <span class="section-count">${Object.keys(this.tokens.shadows).length} levels</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Preview</th><th>Token</th><th>Variable</th><th>Value</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.shadows).map(([k, v]) => `
          <tr class="searchable">
            <td><div style="width:40px;height:28px;background:var(--surface-3);border-radius:4px;box-shadow:${v};"></div></td>
            <td class="token-name">cast:${k}</td>
            <td class="token-var">--shadow-${k}</td>
            <td class="token-val" style="font-size:10px;">${v}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- EASING -->
  ${this.tokens.easing ? `
  <section class="section" id="easing">
    <div class="section-header">
      <h2 class="section-title">Easing</h2>
      <span class="section-count">${Object.keys(this.tokens.easing).length} curves</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Token</th><th>Variable</th><th>Value</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.easing).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">ease-curve:${k}</td>
            <td class="token-var">--ease-${k}</td>
            <td class="token-val">${v}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- DURATION -->
  ${this.tokens.duration ? `
  <section class="section" id="duration">
    <div class="section-header">
      <h2 class="section-title">Duration</h2>
      <span class="section-count">${Object.keys(this.tokens.duration).length} speeds</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Token</th><th>Variable</th><th>Value</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.duration).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">ease-speed:${k} · ease-wait:${k}</td>
            <td class="token-var">--duration-${k}</td>
            <td class="token-val">${v}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- BLUR -->
  ${this.tokens.blur ? `
  <section class="section" id="blur">
    <div class="section-header">
      <h2 class="section-title">Blur</h2>
      <span class="section-count">${Object.keys(this.tokens.blur).length} levels</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Token</th><th>Variable</th><th>Value</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.blur).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">glass-blur:${k} · glow-blur:${k}</td>
            <td class="token-var">--blur-${k}</td>
            <td class="token-val">${v}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- OPACITY -->
  ${this.tokens.opacity ? `
  <section class="section" id="opacity">
    <div class="section-header">
      <h2 class="section-title">Opacity</h2>
      <span class="section-count">${Object.keys(this.tokens.opacity).length} levels</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Preview</th><th>Token</th><th>Variable</th><th>Value</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.opacity).map(([k, v]) => `
          <tr class="searchable">
            <td><div style="width:40px;height:20px;background:var(--accent);border-radius:3px;opacity:${v};"></div></td>
            <td class="token-name">canvas-fade:${k}</td>
            <td class="token-var">--opacity-${k}</td>
            <td class="token-val">${v}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- Z-INDEX -->
  ${this.tokens.zIndex ? `
  <section class="section" id="zindex">
    <div class="section-header">
      <h2 class="section-title">Z-Index</h2>
      <span class="section-count">${Object.keys(this.tokens.zIndex).length} layers</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Token</th><th>Variable</th><th>Value</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.zIndex).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">layer:${k}</td>
            <td class="token-var">--z-${k}</td>
            <td class="token-val">${v}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- LEADING -->
  ${this.tokens.leading ? `
  <section class="section" id="leading">
    <div class="section-header">
      <h2 class="section-title">Leading</h2>
      <span class="section-count">${Object.keys(this.tokens.leading).length} values</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Token</th><th>Variable</th><th>Value</th><th>Preview</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.leading).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">leading:${k}</td>
            <td class="token-var">--leading-${k}</td>
            <td class="token-val">${v}</td>
            <td style="font-size:13px;line-height:${v};color:var(--ink-muted);max-width:160px;">Line one<br>Line two<br>Line three</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- TRACKING -->
  ${this.tokens.tracking ? `
  <section class="section" id="tracking">
    <div class="section-header">
      <h2 class="section-title">Tracking</h2>
      <span class="section-count">${Object.keys(this.tokens.tracking).length} values</span>
    </div>
    <table class="token-table">
      <thead><tr><th>Token</th><th>Variable</th><th>Value</th><th>Preview</th></tr></thead>
      <tbody>
        ${Object.entries(this.tokens.tracking).map(([k, v]) => `
          <tr class="searchable">
            <td class="token-name">tracking:${k}</td>
            <td class="token-var">--tracking-${k}</td>
            <td class="token-val">${v}</td>
            <td style="font-size:12px;letter-spacing:${v};color:var(--ink-muted);font-family:var(--mono);">MIZUMI</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>` : ''}

  <!-- TOKEN UTILITIES -->
  <section class="section" id="token-utilities">
    <div class="section-header">
      <h2 class="section-title">Token Utilities</h2>
      <span class="section-count">Generated from your tokens</span>
    </div>
    <p style="font-family:var(--mono);font-size:12px;color:var(--ink-muted);margin-bottom:24px;line-height:1.7;">
      Every token automatically generates utility classes. Syntax: <span style="color:var(--accent)">capability:token-name</span>
    </p>
    ${utilExamples.slice(0, 40).map(u => `
      <div class="utility-row searchable">
        <span class="utility-cls">.${u.cap}:${u.value}</span>
        <span class="utility-arrow">→</span>
        <span class="utility-css">${u.css}: var(--...)</span>
      </div>
    `).join('')}
  </section>

  <!-- STATIC UTILITIES -->
  <section class="section" id="static-utilities">
    <div class="section-header">
      <h2 class="section-title">Static Utilities</h2>
      <span class="section-count">Always available</span>
    </div>
    ${staticCats.map(cat => `
      <div class="subsection-title">${cat.name}</div>
      ${cat.utilities.map(u => `
        <div class="utility-row searchable">
          <span class="utility-cls">.${u.cls}</span>
          <span class="utility-arrow">→</span>
          <span class="utility-css">${u.css}</span>
        </div>
      `).join('')}
    `).join('')}
  </section>

  <!-- ARBITRARY VALUES -->
  <section class="section" id="arbitrary">
    <div class="section-header">
      <h2 class="section-title">Arbitrary Values</h2>
      <span class="section-count">Any valid CSS value</span>
    </div>
    <p style="font-family:var(--mono);font-size:12px;color:var(--ink-muted);margin-bottom:24px;line-height:1.8;">
      Any capability accepts raw CSS values. Use <span style="color:var(--accent)">_</span> for spaces in values.
      The scanner picks these up at build time and generates the exact CSS rule needed.
    </p>
    ${arbitrary.map(a => `
      <div class="arbitrary-row searchable">
        <span class="arbitrary-cls">.${a.cls}</span>
        <span class="arbitrary-desc">${a.desc}</span>
      </div>
    `).join('')}
  </section>

  <!-- PATTERNS -->
  ${patternCount > 0 ? `
  <section class="section" id="patterns">
    <div class="section-header">
      <h2 class="section-title">Patterns</h2>
      <span class="section-count">${patternCount} defined</span>
    </div>
    <p style="font-family:var(--mono);font-size:12px;color:var(--ink-muted);margin-bottom:24px;line-height:1.7;">
      Reusable utility compositions. Use them like any other class.
    </p>
    ${Object.entries(this.patterns).map(([name, value]) => `
      <div class="pattern-row searchable" onclick="togglePattern(this)">
        <div class="pattern-header">
          <span class="pattern-name">.${name}</span>
          <span class="pattern-toggle">expand ↓</span>
        </div>
        <div class="pattern-body">
          <div class="pattern-value">${value}</div>
          <div class="pattern-usage">&lt;div class="${name}"&gt;...&lt;/div&gt;</div>
        </div>
      </div>
    `).join('')}
  </section>` : ''}

  <!-- ANIMATIONS -->
  ${animCount > 0 ? `
  <section class="section" id="animations">
    <div class="section-header">
      <h2 class="section-title">Animations</h2>
      <span class="section-count">${animCount} defined</span>
    </div>
    <p style="font-family:var(--mono);font-size:12px;color:var(--ink-muted);margin-bottom:24px;line-height:1.7;">
      GSAP-powered animations. Add the class name to any element.
      Stack modifiers like <span style="color:var(--accent)">duration-300 ease-bouncy delay-200</span> to customize.
    </p>
    ${Object.entries(this.animations).map(([name, config]) => {
      const type = this.getAnimType(config)
      return `
      <div class="anim-row searchable">
        <div class="anim-header">
          <span class="anim-name">.${name}</span>
          <span class="anim-badge" style="background:${type.color}18;color:${type.color};border:1px solid ${type.color}44;">${type.label}</span>
        </div>
        <div class="anim-body">
          <div class="anim-config">${JSON.stringify(config, null, 2)}</div>
          <div class="anim-usage">&lt;div class="${name}"&gt;...&lt;/div&gt;</div>
        </div>
      </div>`
    }).join('')}
  </section>

  <!-- MODIFIERS -->
  <section class="section" id="modifiers">
    <div class="section-header">
      <h2 class="section-title">Animation Modifiers</h2>
      <span class="section-count">Stack onto any animation</span>
    </div>

    <div class="subsection-title">Duration</div>
    <div class="modifier-grid">
      ${[100,150,200,300,500,800,1000].map(d => `
        <div class="modifier-card">
          <div class="modifier-cls">duration-${d}</div>
          <div class="modifier-val">${d}ms</div>
        </div>
      `).join('')}
      ${['fast','normal','slow','slower'].map(n => `
        <div class="modifier-card">
          <div class="modifier-cls">duration-${n}</div>
          <div class="modifier-val">token-based</div>
        </div>
      `).join('')}
    </div>

    <div class="subsection-title">Delay</div>
    <div class="modifier-grid">
      ${[0,100,150,200,300,500,1000].map(d => `
        <div class="modifier-card">
          <div class="modifier-cls">delay-${d}</div>
          <div class="modifier-val">${d}ms</div>
        </div>
      `).join('')}
    </div>

    <div class="subsection-title">Easing</div>
    <div class="modifier-grid">
      ${['smooth','bouncy','sharp','back','linear'].map(e => `
        <div class="modifier-card">
          <div class="modifier-cls">ease-${e}</div>
          <div class="modifier-val">GSAP curve</div>
        </div>
      `).join('')}
    </div>

    <div class="subsection-title">Prop Overrides (inline)</div>
    <div class="modifier-grid">
      ${['data-gsap-duration','data-gsap-delay','data-gsap-ease','data-gsap-y','data-gsap-x','data-gsap-scale','data-gsap-opacity'].map(a => `
        <div class="modifier-card">
          <div class="modifier-cls" style="font-size:9px;">${a}</div>
          <div class="modifier-val">highest priority</div>
        </div>
      `).join('')}
    </div>
  </section>` : ''}

  <!-- .MIZU SYNTAX -->
  <section class="section" id="mizu-syntax">
    <div class="section-header">
      <h2 class="section-title">.mizu Syntax</h2>
      <span class="section-count">CSS-style config</span>
    </div>
    <p style="font-family:var(--mono);font-size:12px;color:var(--ink-muted);margin-bottom:24px;line-height:1.7;">
      An alternative to <span style="color:var(--accent)">mizumi.config.js</span>. 
      Create any <span style="color:var(--accent)">*.mizu</span> file in your project — 
      it's auto-discovered and merged. No imports needed.
    </p>
    <div class="code-block"><span class="code-comment">/* styles.mizu — auto-discovered, no imports needed */</span>

<span class="code-keyword">@token</span> {
  colors {
    <span class="code-name">brand</span>: <span class="code-value">#ff6b6b</span>;
    <span class="code-name">ocean</span>: <span class="code-value">#006994</span>;
  }
  spacing {
    <span class="code-name">hero</span>: <span class="code-value">120px</span>;
    <span class="code-name">section</span>: <span class="code-value">80px</span>;
  }
}

<span class="code-keyword">@pattern</span> hero-box {
  <span class="code-name">pad</span>: <span class="code-value">hero</span>;
  <span class="code-name">paint</span>: <span class="code-value">brand</span>;
  <span class="code-name">ink</span>: <span class="code-value">white</span>;
  <span class="code-name">curve</span>: <span class="code-value">xl</span>;
}

<span class="code-keyword">@pattern</span> btn-brand <span class="code-keyword">extends</span> button {
  <span class="code-name">paint</span>: <span class="code-value">brand</span>;
  <span class="code-name">ink</span>: <span class="code-value">white</span>;
}

<span class="code-keyword">@animate</span> hover-brand {
  hover {
    <span class="code-name">move-y</span>: <span class="code-value">-6px</span>;
    <span class="code-name">ease-speed</span>: <span class="code-value">fast</span>;
  }
}

<span class="code-keyword">@rule</span> {
  <span class="code-name">responsive</span>: <span class="code-value">true</span>;
  <span class="code-name">darkMode</span>: <span class="code-value">class</span>;
}</div>
  </section>

</main>

<script>
  // ── Search ──
  function handleSearch(query) {
    const q = query.toLowerCase().trim()
    document.querySelectorAll('.searchable').forEach(el => {
      const text = el.textContent.toLowerCase()
      el.classList.toggle('hidden', q !== '' && !text.includes(q))
    })
  }

  // ── Pattern toggle ──
  function togglePattern(el) {
    const body   = el.querySelector('.pattern-body')
    const toggle = el.querySelector('.pattern-toggle')
    const open   = body.classList.toggle('open')
    toggle.textContent = open ? 'collapse ↑' : 'expand ↓'
  }

  // ── Smooth scroll ──
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute('href'))
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  // ── Copy on click ──
  document.querySelectorAll('.utility-cls, .arbitrary-cls, .pattern-name, .anim-name').forEach(el => {
    el.style.cursor = 'pointer'
    el.title = 'Click to copy'
    el.addEventListener('click', () => {
      const text = el.textContent.replace(/^\./, '')
      navigator.clipboard?.writeText(text)
      const orig = el.textContent
      el.textContent = '✓ copied'
      setTimeout(() => el.textContent = orig, 1000)
    })
  })
</script>

</body>
</html>`
  }

  // ── Color rows helper ──
  _colorRows() {
    const rows = []
    for (const [key, val] of Object.entries(this.tokens.colors)) {
      if (typeof val === 'object') {
        for (const [shade, color] of Object.entries(val)) {
          const name = shade === 'DEFAULT' ? key : `${key}-${shade}`
          rows.push(`
            <tr class="searchable">
              <td><div class="color-chip" style="background:${color};"></div></td>
              <td class="token-name">ink:${name} · paint:${name}</td>
              <td class="token-var">--color-${name}</td>
              <td class="token-val">${color}</td>
              <td class="token-val" style="font-size:10px;">ink · paint · stroke-color · ring-color</td>
            </tr>`)
        }
      } else {
        rows.push(`
          <tr class="searchable">
            <td><div class="color-chip" style="background:${val};"></div></td>
            <td class="token-name">ink:${key} · paint:${key}</td>
            <td class="token-var">--color-${key}</td>
            <td class="token-val">${val}</td>
            <td class="token-val" style="font-size:10px;">ink · paint · stroke-color · ring-color</td>
          </tr>`)
      }
    }
    return rows.join('')
  }
}