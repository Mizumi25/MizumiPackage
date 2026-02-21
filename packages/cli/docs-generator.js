// packages/cli/docs-generator.js
import fs from 'fs';
import path from 'path';


export class DocsGenerator {
  constructor(config) {
    this.config     = config;
    this.tokens     = config.tokens     || {};
    this.patterns   = config.patterns   || {};
    this.animations = config.animations || {};
  }

  generate(outputDir = '.mizumi/docs') {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    const html = this._buildHTML()
    const outPath = path.join(outputDir, 'index.html')
    fs.writeFileSync(outPath, html, 'utf8')
    console.log(`✅ Docs: ${outPath}`)
    return outPath
  }

  _buildHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mizumi Docs 🌊</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }

    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
    }

    /* Layout */
    .sidebar {
      position: fixed;
      top: 0; left: 0;
      width: 240px;
      height: 100vh;
      background: #1e293b;
      border-right: 1px solid #334155;
      overflow-y: auto;
      padding: 24px 0;
    }

    .main {
      margin-left: 240px;
      padding: 40px;
      max-width: 1000px;
    }

    /* Sidebar */
    .sidebar-logo {
      padding: 0 20px 24px;
      border-bottom: 1px solid #334155;
      margin-bottom: 16px;
    }

    .sidebar-logo h1 {
      font-size: 20px;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: -0.5px;
    }

    .sidebar-logo span {
      font-size: 12px;
      color: #64748b;
    }

    .nav-section {
      padding: 8px 20px 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #475569;
    }

    .nav-link {
      display: block;
      padding: 8px 20px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.15s;
      border-left: 3px solid transparent;
    }

    .nav-link:hover {
      color: #e2e8f0;
      background: #334155;
      border-left-color: #38bdf8;
    }

    /* Sections */
    .section {
      margin-bottom: 64px;
    }

    .section-title {
      font-size: 28px;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 8px;
      padding-bottom: 16px;
      border-bottom: 1px solid #334155;
      letter-spacing: -0.5px;
    }

    .section-sub {
      font-size: 18px;
      font-weight: 600;
      color: #cbd5e1;
      margin: 32px 0 16px;
    }

    /* Cards */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .doc-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 16px;
      transition: border-color 0.15s;
    }

    .doc-card:hover { border-color: #38bdf8; }

    .doc-card-name {
      font-family: monospace;
      font-size: 13px;
      color: #38bdf8;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .doc-card-value {
      font-size: 12px;
      color: #64748b;
      word-break: break-all;
    }

    /* Color swatches */
    .color-swatch {
      width: 100%;
      height: 40px;
      border-radius: 6px;
      margin-bottom: 8px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* Pattern rows */
    .pattern-row {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 8px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
    }

    .pattern-name {
      font-family: monospace;
      font-size: 14px;
      color: #38bdf8;
      font-weight: 600;
      min-width: 160px;
    }

    .pattern-arrow {
      color: #475569;
      font-size: 14px;
    }

    .pattern-value {
      font-family: monospace;
      font-size: 13px;
      color: #94a3b8;
      flex: 1;
    }

    /* Animation rows */
    .anim-row {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 8px;
    }

    .anim-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .anim-name {
      font-family: monospace;
      font-size: 14px;
      color: #38bdf8;
      font-weight: 600;
    }

    .anim-type {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .type-entrance { background: #0d3b26; color: #34d399; }
    .type-hover    { background: #1e1a3b; color: #a78bfa; }
    .type-click    { background: #3b1a1a; color: #f87171; }
    .type-scroll   { background: #1a2e3b; color: #38bdf8; }
    .type-stagger  { background: #2e2a0d; color: #fbbf24; }
    .type-loop     { background: #2e1a3b; color: #e879f9; }

    .anim-config {
      font-family: monospace;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }

    /* Usage box */
    .usage-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 10px 14px;
      margin-top: 8px;
      font-family: monospace;
      font-size: 12px;
      color: #86efac;
    }

    /* Spacing preview */
    .spacing-preview {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .spacing-bar {
      background: #38bdf8;
      height: 16px;
      border-radius: 3px;
      opacity: 0.7;
    }

    /* Search */
    .search-bar {
      width: 100%;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px 16px;
      color: #e2e8f0;
      font-size: 14px;
      margin-bottom: 32px;
      outline: none;
      transition: border-color 0.15s;
    }

    .search-bar:focus { border-color: #38bdf8; }
    .search-bar::placeholder { color: #475569; }

    /* Stats bar */
    .stats-bar {
      display: flex;
      gap: 24px;
      margin-bottom: 48px;
      flex-wrap: wrap;
    }

    .stat {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 16px 24px;
      text-align: center;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 800;
      color: #38bdf8;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }

    /* Header */
    .docs-header {
      margin-bottom: 48px;
    }

    .docs-header h1 {
      font-size: 40px;
      font-weight: 800;
      color: #f1f5f9;
      letter-spacing: -1px;
      margin-bottom: 8px;
    }

    .docs-header p {
      color: #64748b;
      font-size: 16px;
    }

    .badge {
      display: inline-block;
      background: #0c2a1a;
      color: #34d399;
      border: 1px solid #34d399;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 8px;
      vertical-align: middle;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  </style>
</head>
<body>

  <!-- SIDEBAR -->
  <nav class="sidebar">
    <div class="sidebar-logo">
      <h1>🌊 Mizumi</h1>
      <span>v0.1.0 Docs</span>
    </div>

    <div class="nav-section">Getting Started</div>
    <a href="#overview" class="nav-link">Overview</a>

    <div class="nav-section">Design Tokens</div>
    <a href="#colors" class="nav-link">Colors</a>
    <a href="#spacing" class="nav-link">Spacing</a>
    <a href="#typography" class="nav-link">Typography</a>
    <a href="#radius" class="nav-link">Border Radius</a>
    <a href="#shadows" class="nav-link">Shadows</a>

    <div class="nav-section">Patterns</div>
    <a href="#patterns" class="nav-link">All Patterns</a>

    <div class="nav-section">Animations</div>
    <a href="#animations" class="nav-link">All Animations</a>
    <a href="#modifiers" class="nav-link">Modifiers</a>
  </nav>

  <!-- MAIN -->
  <main class="main">

    <!-- Header -->
    <div class="docs-header">
      <h1>Mizumi Docs <span class="badge">v0.1.0</span></h1>
      <p>Auto-generated from your mizumi.config.js</p>
    </div>

    <!-- Search -->
    <input
      class="search-bar"
      type="text"
      placeholder="Search tokens, patterns, animations..."
      oninput="handleSearch(this.value)"
    >

    <!-- Stats -->
    <div class="stats-bar">
      <div class="stat">
        <div class="stat-number">${this.countTokens()}</div>
        <div class="stat-label">Tokens</div>
      </div>
      <div class="stat">
        <div class="stat-number">${Object.keys(this.patterns).length}</div>
        <div class="stat-label">Patterns</div>
      </div>
      <div class="stat">
        <div class="stat-number">${Object.keys(this.animations).length}</div>
        <div class="stat-label">Animations</div>
      </div>
      <div class="stat">
        <div class="stat-number">${Object.keys(this.config.rules?.breakpoints || {}).length}</div>
        <div class="stat-label">Breakpoints</div>
      </div>
    </div>

    <!-- COLORS -->
    <section class="section" id="colors">
      <h2 class="section-title">Colors</h2>
      <div class="card-grid">
        ${this.generateColorCards()}
      </div>
    </section>

    <!-- SPACING -->
    <section class="section" id="spacing">
      <h2 class="section-title">Spacing</h2>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${this.generateSpacingRows()}
      </div>
    </section>

    <!-- TYPOGRAPHY -->
    <section class="section" id="typography">
      <h2 class="section-title">Typography</h2>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${this.generateTypographyRows()}
      </div>
    </section>

    <!-- RADIUS -->
    <section class="section" id="radius">
      <h2 class="section-title">Border Radius</h2>
      <div class="card-grid">
        ${this.generateRadiusCards()}
      </div>
    </section>

    <!-- SHADOWS -->
    <section class="section" id="shadows">
      <h2 class="section-title">Shadows</h2>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${this.generateShadowCards()}
      </div>
    </section>

    <!-- PATTERNS -->
    <section class="section" id="patterns">
      <h2 class="section-title">Patterns</h2>
      <div id="patterns-list">
        ${this.generatePatternRows()}
      </div>
    </section>

    <!-- ANIMATIONS -->
    <section class="section" id="animations">
      <h2 class="section-title">Animations</h2>
      <div id="animations-list">
        ${this.generateAnimationRows()}
      </div>
    </section>

    <!-- MODIFIERS -->
    <section class="section" id="modifiers">
      <h2 class="section-title">Animation Modifiers</h2>
      <p style="color:#64748b; margin-bottom:24px; font-size:14px;">
        Stack these onto any animation class to customize behavior.
      </p>

      <h3 class="section-sub">Duration</h3>
      <div class="card-grid">
        ${[100,150,200,300,500,800,1000].map(d => `
          <div class="doc-card">
            <div class="doc-card-name">duration-${d}</div>
            <div class="doc-card-value">${d}ms → ${d/1000}s</div>
          </div>
        `).join('')}
        ${['fast','normal','slow','slower'].map(n => `
          <div class="doc-card">
            <div class="doc-card-name">duration-${n}</div>
            <div class="doc-card-value">Token-based</div>
          </div>
        `).join('')}
      </div>

      <h3 class="section-sub">Delay</h3>
      <div class="card-grid">
        ${[0,100,150,200,300,500,1000].map(d => `
          <div class="doc-card">
            <div class="doc-card-name">delay-${d}</div>
            <div class="doc-card-value">${d}ms → ${d/1000}s</div>
          </div>
        `).join('')}
      </div>

      <h3 class="section-sub">Easing</h3>
      <div class="card-grid">
        ${['smooth','bouncy','sharp','back','linear'].map(e => `
          <div class="doc-card">
            <div class="doc-card-name">ease-${e}</div>
            <div class="doc-card-value">${this.easeToGSAP(e)}</div>
          </div>
        `).join('')}
      </div>

      <h3 class="section-sub">Data Attribute Overrides</h3>
      <div class="card-grid">
        ${['data-gsap-duration','data-gsap-delay','data-gsap-ease','data-gsap-y','data-gsap-x','data-gsap-scale','data-gsap-opacity'].map(a => `
          <div class="doc-card">
            <div class="doc-card-name">${a}</div>
            <div class="doc-card-value">Highest priority override</div>
          </div>
        `).join('')}
      </div>
    </section>

  </main>

  <script>
    // Search functionality
    function handleSearch(query) {
      const q = query.toLowerCase().trim();
      const allRows = document.querySelectorAll(
        '.doc-card, .pattern-row, .anim-row'
      );

      allRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = !q || text.includes(q) ? '' : 'none';
      });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  </script>

</body>
</html>`;
  }

  generateColorCards() {
    const cards = [];
    if (!this.tokens.colors) return '';

    for (const [k, v] of Object.entries(this.tokens.colors)) {
      if (typeof v === 'object') {
        for (const [shade, color] of Object.entries(v)) {
          const name = shade === 'DEFAULT' ? k : `${k}-${shade}`;
          cards.push(`
            <div class="doc-card">
              <div class="color-swatch" style="background:${color};"></div>
              <div class="doc-card-name">${name}</div>
              <div class="doc-card-value">${color}</div>
              <div class="doc-card-value" style="margin-top:4px;">
                bg-${name} · color-${name}
              </div>
            </div>
          `);
        }
      } else {
        cards.push(`
          <div class="doc-card">
            <div class="color-swatch" style="background:${v};"></div>
            <div class="doc-card-name">${k}</div>
            <div class="doc-card-value">${v}</div>
            <div class="doc-card-value" style="margin-top:4px;">
              bg-${k} · color-${k}
            </div>
          </div>
        `);
      }
    }
    return cards.join('');
  }

  generateSpacingRows() {
    if (!this.tokens.spacing) return '';
    return Object.entries(this.tokens.spacing).map(([k, v]) => {
      const px = parseInt(v);
      return `
        <div class="pattern-row">
          <div class="pattern-name">pad-${k} · mar-${k} · gap-${k}</div>
          <div class="spacing-preview">
            <div class="spacing-bar" style="width:${Math.min(px * 2, 200)}px;"></div>
            <span style="color:#64748b; font-size:13px;">${v}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  generateTypographyRows() {
    if (!this.tokens.typography) return '';
    return Object.entries(this.tokens.typography).map(([k, v]) => `
      <div class="pattern-row">
        <div class="pattern-name">text-${k}</div>
        <div style="flex:1;">
          <div style="font-size:${v.size}; font-weight:${v.weight}; line-height:${v.line}; color:#e2e8f0; margin-bottom:4px;">
            The quick brown fox
          </div>
          <div style="font-size:12px; color:#64748b;">
            ${v.size} · weight ${v.weight} · line ${v.line}
          </div>
        </div>
      </div>
    `).join('');
  }

  generateRadiusCards() {
    if (!this.tokens.radius) return '';
    return Object.entries(this.tokens.radius).map(([k, v]) => `
      <div class="doc-card" style="text-align:center;">
        <div style="
          width:48px; height:48px;
          background:#38bdf8;
          border-radius:${v};
          margin:0 auto 12px;
          opacity:0.7;
        "></div>
        <div class="doc-card-name">rounded-${k}</div>
        <div class="doc-card-value">${v}</div>
      </div>
    `).join('');
  }

  generateShadowCards() {
    if (!this.tokens.shadows) return '';
    return Object.entries(this.tokens.shadows).map(([k, v]) => `
      <div class="pattern-row">
        <div class="pattern-name">shadow-${k}</div>
        <div style="
          width:60px; height:32px;
          background:#1e293b;
          border-radius:6px;
          box-shadow:${v};
          flex-shrink:0;
        "></div>
        <div class="doc-card-value" style="font-family:monospace; font-size:12px;">${v}</div>
      </div>
    `).join('');
  }

  generatePatternRows() {
    return Object.entries(this.patterns).map(([name, value]) => `
      <div class="pattern-row">
        <div class="pattern-name">.${name}</div>
        <div class="pattern-arrow">→</div>
        <div class="pattern-value">${value}</div>
        <div class="usage-box" style="width:100%;">
          &lt;div class="${name}"&gt;...&lt;/div&gt;
        </div>
      </div>
    `).join('');
  }

  generateAnimationRows() {
    return Object.entries(this.animations).map(([name, config]) => {
      const type = this.getAnimType(config);
      return `
        <div class="anim-row">
          <div class="anim-header">
            <div class="anim-name">.${name}</div>
            <span class="anim-type type-${type}">${type}</span>
          </div>
          <div class="anim-config">${JSON.stringify(config, null, 2)}</div>
          <div class="usage-box">
            &lt;div class="${name}"&gt;...&lt;/div&gt;
          </div>
        </div>
      `;
    }).join('');
  }

  getAnimType(config) {
    if (config.hover)                  return 'hover';
    if (config.active)                 return 'click';
    if (config.targets === 'children') return 'stagger';
    if (config.scrollTrigger)          return 'scroll';
    if (config.repeat === -1)          return 'loop';
    return 'entrance';
  }

  easeToGSAP(name) {
    const map = {
      smooth: 'power2.out',
      bouncy: 'elastic.out(1, 0.5)',
      sharp:  'power4.inOut',
      back:   'back.out(1.7)',
      linear: 'none'
    };
    return map[name] || name;
  }

  countTokens() {
    let count = 0;
    for (const [, v] of Object.entries(this.tokens)) {
      if (typeof v === 'object') {
        for (const [, val] of Object.entries(v)) {
          if (typeof val === 'object') count += Object.keys(val).length;
          else count++;
        }
      }
    }
    return count;
  }
}

