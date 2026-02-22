// packages/vite-plugin/devtools.js
// Mizumi DevTools — injected in dev mode only by the vite plugin
// Zero production footprint

export function generateDevToolsScript(meta) {
  const { tokens = {}, patterns = {}, animations = {} } = meta

  return `
;(function MizumiDevTools() {
  if (window.__MIZUMI_DEVTOOLS__) return
  window.__MIZUMI_DEVTOOLS__ = true

  // ── CONFIG from build ─────────────────────────────────────
  const TOKENS     = ${JSON.stringify(tokens)}
  const PATTERNS   = ${JSON.stringify(patterns)}
  const ANIMATIONS = ${JSON.stringify(animations)}

  // ── STATE ─────────────────────────────────────────────────
  let target     = null
  let panel      = null
  let highlight  = null
  let pinned     = false
  let dragging   = false
  let dragOffX   = 0
  let dragOffY   = 0
  let panelX     = null
  let panelY     = null
  let enabled    = true
  let tab        = 'classes'

  // ── STYLES ────────────────────────────────────────────────
  const style = document.createElement('style')
  style.textContent = \`
    #mz-devtools-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      width: 40px;
      height: 40px;
      background: #0e0d0b;
      border: 1px solid #2a2823;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      transition: all 0.15s;
      user-select: none;
    }
    #mz-devtools-toggle:hover {
      border-color: #c9a96e;
      transform: scale(1.1);
    }
    #mz-devtools-toggle.active {
      border-color: #c9a96e;
      box-shadow: 0 0 0 2px rgba(201,169,110,0.3);
    }

    #mz-highlight {
      position: fixed;
      pointer-events: none;
      z-index: 99997;
      border: 1px solid #c9a96e;
      background: rgba(201,169,110,0.06);
      border-radius: 2px;
      transition: all 0.08s;
    }

    #mz-panel {
      position: fixed;
      z-index: 99998;
      width: 300px;
      background: #0e0d0b;
      border: 1px solid #2a2823;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      font-family: 'DM Mono', 'Fira Code', ui-monospace, monospace;
      font-size: 11px;
      color: #7a7568;
      overflow: hidden;
      display: none;
    }

    #mz-panel.visible { display: block; }

    #mz-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #141310;
      border-bottom: 1px solid #2a2823;
      cursor: grab;
      user-select: none;
    }

    #mz-panel-header:active { cursor: grabbing; }

    #mz-panel-title {
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #c9a96e;
    }

    #mz-panel-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mz-action-btn {
      background: none;
      border: 1px solid #2a2823;
      border-radius: 3px;
      padding: 2px 8px;
      color: #7a7568;
      font-family: inherit;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.1s;
      letter-spacing: 0.05em;
    }

    .mz-action-btn:hover {
      border-color: #c9a96e;
      color: #c9a96e;
    }

    .mz-action-btn.active {
      border-color: #c9a96e;
      color: #c9a96e;
      background: rgba(201,169,110,0.08);
    }

    #mz-target-info {
      padding: 10px 14px;
      border-bottom: 1px solid #2a2823;
      background: #0a0908;
    }

    #mz-target-tag {
      font-size: 10px;
      color: #38bdf8;
      margin-bottom: 2px;
    }

    #mz-target-classes {
      font-size: 10px;
      color: #3d3a34;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #mz-tabs {
      display: flex;
      border-bottom: 1px solid #2a2823;
    }

    .mz-tab {
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
      color: #3d3a34;
    }

    .mz-tab:hover { color: #7a7568; }
    .mz-tab.active { color: #c9a96e; border-bottom-color: #c9a96e; }

    #mz-panel-body {
      max-height: 380px;
      overflow-y: auto;
    }

    #mz-panel-body::-webkit-scrollbar { width: 3px; }
    #mz-panel-body::-webkit-scrollbar-track { background: transparent; }
    #mz-panel-body::-webkit-scrollbar-thumb { background: #2a2823; border-radius: 2px; }

    .mz-section {
      padding: 10px 14px;
      border-bottom: 1px solid #1a1916;
    }

    .mz-section-label {
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3d3a34;
      margin-bottom: 8px;
    }

    .mz-class-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid #141310;
    }

    .mz-class-row:last-child { border-bottom: none; }

    .mz-class-name {
      color: #c9a96e;
      cursor: pointer;
      flex: 1;
    }

    .mz-class-name:hover { color: #e8e4dc; }

    .mz-class-remove {
      color: #3d3a34;
      cursor: pointer;
      padding: 0 4px;
      font-size: 14px;
      line-height: 1;
      transition: color 0.1s;
    }

    .mz-class-remove:hover { color: #f87171; }

    .mz-prop-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 0;
      border-bottom: 1px solid #141310;
    }

    .mz-prop-row:last-child { border-bottom: none; }

    .mz-prop-label {
      color: #3d3a34;
      min-width: 70px;
      flex-shrink: 0;
      font-size: 10px;
    }

    .mz-prop-value {
      color: #7a7568;
      flex: 1;
      font-size: 10px;
    }

    .mz-color-chip {
      width: 14px;
      height: 14px;
      border-radius: 2px;
      border: 1px solid rgba(255,255,255,0.1);
      flex-shrink: 0;
      cursor: pointer;
    }

    .mz-token-select {
      background: #141310;
      border: 1px solid #2a2823;
      border-radius: 3px;
      color: #c9a96e;
      font-family: inherit;
      font-size: 10px;
      padding: 2px 6px;
      outline: none;
      cursor: pointer;
      max-width: 130px;
      transition: border-color 0.15s;
    }

    .mz-token-select:focus { border-color: #c9a96e; }

    .mz-text-input {
      background: #141310;
      border: 1px solid #2a2823;
      border-radius: 3px;
      color: #c9a96e;
      font-family: inherit;
      font-size: 10px;
      padding: 2px 6px;
      outline: none;
      width: 100%;
      transition: border-color 0.15s;
    }

    .mz-text-input:focus { border-color: #c9a96e; }

    .mz-add-class {
      padding: 10px 14px;
      border-top: 1px solid #2a2823;
      display: flex;
      gap: 6px;
    }

    .mz-add-input {
      background: #141310;
      border: 1px solid #2a2823;
      border-radius: 3px;
      color: #e8e4dc;
      font-family: inherit;
      font-size: 11px;
      padding: 5px 8px;
      outline: none;
      flex: 1;
      transition: border-color 0.15s;
    }

    .mz-add-input:focus { border-color: #c9a96e; }
    .mz-add-input::placeholder { color: #3d3a34; }

    .mz-add-btn {
      background: rgba(201,169,110,0.1);
      border: 1px solid #c9a96e44;
      border-radius: 3px;
      color: #c9a96e;
      font-family: inherit;
      font-size: 10px;
      padding: 5px 10px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .mz-add-btn:hover { background: rgba(201,169,110,0.2); }

    #mz-copy-toast {
      position: fixed;
      bottom: 72px;
      right: 20px;
      background: #141310;
      border: 1px solid #c9a96e44;
      border-radius: 4px;
      padding: 8px 14px;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      color: #c9a96e;
      z-index: 99999;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.2s;
      pointer-events: none;
    }

    #mz-copy-toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    .mz-empty {
      padding: 20px 14px;
      text-align: center;
      color: #3d3a34;
      font-size: 11px;
    }

    .mz-pattern-badge {
      font-size: 9px;
      padding: 1px 6px;
      border-radius: 3px;
      background: rgba(56,189,248,0.1);
      color: #38bdf8;
      border: 1px solid rgba(56,189,248,0.2);
      margin-left: 6px;
    }

    .mz-anim-badge {
      font-size: 9px;
      padding: 1px 6px;
      border-radius: 3px;
      background: rgba(167,139,250,0.1);
      color: #a78bfa;
      border: 1px solid rgba(167,139,250,0.2);
      margin-left: 6px;
    }

    #mz-panel-footer {
      padding: 8px 14px;
      border-top: 1px solid #2a2823;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0a0908;
    }

    #mz-copy-all-btn {
      font-size: 10px;
      color: #7a7568;
      cursor: pointer;
      letter-spacing: 0.05em;
      transition: color 0.15s;
    }

    #mz-copy-all-btn:hover { color: #c9a96e; }

    #mz-mizumi-mark {
      font-size: 10px;
      color: #2a2823;
      letter-spacing: 0.1em;
    }
  \`
  document.head.appendChild(style)

  // ── PARSE MIZUMI CLASSES FROM ELEMENT ────────────────────
  function parseMizumiClasses(el) {
    const all       = Array.from(el.classList)
    const mizumi    = []
    const other     = []
    const patNames  = Object.keys(PATTERNS)
    const animNames = Object.keys(ANIMATIONS)

    for (const cls of all) {
      const isMizumi = cls.includes(':') || cls.includes('{') ||
                       patNames.includes(cls) || animNames.includes(cls)
      if (isMizumi) mizumi.push(cls)
      else other.push(cls)
    }

    return { mizumi, other }
  }

  // ── CLASSIFY A CLASS ──────────────────────────────────────
  function classifyClass(cls) {
    if (Object.keys(PATTERNS).includes(cls))   return 'pattern'
    if (Object.keys(ANIMATIONS).includes(cls)) return 'animation'
    if (cls.includes('{'))                      return 'arbitrary-prop'
    if (cls.includes(':'))                      return 'utility'
    return 'other'
  }

  // ── GET COMPUTED MIZUMI PROPS ─────────────────────────────
  function getComputedProps(el) {
    const style = window.getComputedStyle(el)
    return [
      { label: 'color',      value: style.color,           type: 'color' },
      { label: 'background', value: style.backgroundColor, type: 'color' },
      { label: 'padding',    value: style.padding,         type: 'text' },
      { label: 'margin',     value: style.margin,          type: 'text' },
      { label: 'font-size',  value: style.fontSize,        type: 'text' },
      { label: 'border-r',   value: style.borderRadius,    type: 'text' },
      { label: 'shadow',     value: style.boxShadow === 'none' ? '—' : style.boxShadow.slice(0,30) + '…', type: 'text' },
      { label: 'display',    value: style.display,         type: 'text' },
      { label: 'opacity',    value: style.opacity,         type: 'text' },
    ]
  }

  // ── BUILD PANEL HTML ──────────────────────────────────────
  function renderPanel() {
    if (!target) return

    const { mizumi, other } = parseMizumiClasses(target)
    const tagName = target.tagName.toLowerCase()
    const id      = target.id ? \`#\${target.id}\` : ''
    const allCls  = Array.from(target.classList).join(' ')

    // Target info
    document.getElementById('mz-target-tag').textContent = \`<\${tagName}\${id}>\`
    document.getElementById('mz-target-classes').textContent = allCls || '(no classes)'

    // Render tab content
    const body = document.getElementById('mz-panel-body')

    if (tab === 'classes') {
      body.innerHTML = renderClassesTab(mizumi, other)
      attachClassTabEvents()
    } else if (tab === 'computed') {
      body.innerHTML = renderComputedTab()
    } else if (tab === 'add') {
      body.innerHTML = renderAddTab()
      attachAddTabEvents()
    }
  }

  function renderClassesTab(mizumi, other) {
    if (mizumi.length === 0 && other.length === 0) {
      return '<div class="mz-empty">No classes on this element</div>'
    }

    // ── Conflict detection ──
    const GSAP_TRANSFORM_ANIMS = ['hover-lift','hover-scale','hover-float','hover-sink','active-press','active-bounce']
    const CSS_TRANSITION_CLASSES = mizumi.filter(c => c.startsWith('ease:') || c.startsWith('ease-speed:') || c.startsWith('ease-prop:'))
    const GSAP_TRANSFORM_USED = mizumi.filter(c => GSAP_TRANSFORM_ANIMS.includes(c))
    const hasConflict = CSS_TRANSITION_CLASSES.length > 0 && GSAP_TRANSFORM_USED.length > 0

    let html = ''

    if (hasConflict) {
      html += \`<div style="background:#2a1a0a;border:1px solid #c9a96e;border-radius:6px;padding:8px 10px;margin-bottom:10px;font-size:11px;color:#c9a96e;line-height:1.5;">
        ⚠️ <strong>Conflict detected</strong><br>
        <span style="color:#8a8070;">\${GSAP_TRANSFORM_USED.join(', ')} uses GSAP tweens on transform.<br>
        \${CSS_TRANSITION_CLASSES.join(', ')} adds a CSS transition on the same property.<br>
        GSAP will win (inline styles), but remove the CSS transition for cleaner behaviour.</span>
      </div>\`
    }

    if (mizumi.length > 0) {
      html += '<div class="mz-section">'
      html += '<div class="mz-section-label">Mizumi Classes</div>'
      for (const cls of mizumi) {
        const type = classifyClass(cls)
        const badge = type === 'pattern'   ? '<span class="mz-pattern-badge">pattern</span>' :
                      type === 'animation' ? '<span class="mz-anim-badge">anim</span>' : ''
        html += \`<div class="mz-class-row">
          <span class="mz-class-name" data-cls="\${cls}">\${cls}\${badge}</span>
          <span class="mz-class-remove" data-remove="\${cls}">×</span>
        </div>\`
      }
      html += '</div>'
    }

    if (other.length > 0) {
      html += '<div class="mz-section">'
      html += '<div class="mz-section-label">Other Classes</div>'
      for (const cls of other) {
        html += \`<div class="mz-class-row">
          <span class="mz-class-name" style="color:#3d3a34">\${cls}</span>
          <span class="mz-class-remove" data-remove="\${cls}">×</span>
        </div>\`
      }
      html += '</div>'
    }

    return html
  }

  function renderComputedTab() {
    const props = getComputedProps(target)
    let html = '<div class="mz-section"><div class="mz-section-label">Computed Styles</div>'

    for (const prop of props) {
      const colorChip = prop.type === 'color' && prop.value !== 'rgba(0, 0, 0, 0)'
        ? \`<div class="mz-color-chip" style="background:\${prop.value}"></div>\`
        : ''
      html += \`<div class="mz-prop-row">
        <span class="mz-prop-label">\${prop.label}</span>
        \${colorChip}
        <span class="mz-prop-value">\${prop.value}</span>
      </div>\`
    }

    html += '</div>'

    // Token color swatches
    if (TOKENS.colors) {
      html += '<div class="mz-section"><div class="mz-section-label">Apply Color Token</div>'
      html += '<div style="display:flex;flex-wrap:wrap;gap:5px;padding:4px 0">'
      for (const [key, val] of Object.entries(TOKENS.colors)) {
        if (typeof val === 'string') {
          html += \`<div class="mz-color-chip" title="\${key}" style="background:\${val};width:20px;height:20px;border-radius:3px;cursor:pointer;" data-apply-color="\${key}"></div>\`
        } else if (typeof val === 'object') {
          for (const [shade, color] of Object.entries(val)) {
            const name = shade === 'DEFAULT' ? key : \`\${key}-\${shade}\`
            html += \`<div class="mz-color-chip" title="\${name}" style="background:\${color};width:20px;height:20px;border-radius:3px;cursor:pointer;" data-apply-color="\${name}"></div>\`
          }
        }
      }
      html += '</div></div>'
    }

    return html
  }

  function renderAddTab() {
    let html = ''

    // Quick patterns
    if (Object.keys(PATTERNS).length > 0) {
      html += '<div class="mz-section"><div class="mz-section-label">Patterns</div>'
      html += '<select class="mz-token-select" id="mz-pattern-select" style="width:100%;max-width:100%">'
      html += '<option value="">— Add Pattern —</option>'
      for (const name of Object.keys(PATTERNS)) {
        html += \`<option value="\${name}">\${name}</option>\`
      }
      html += '</select></div>'
    }

    // Quick animations
    if (Object.keys(ANIMATIONS).length > 0) {
      html += '<div class="mz-section"><div class="mz-section-label">Animations</div>'
      html += '<select class="mz-token-select" id="mz-anim-select" style="width:100%;max-width:100%">'
      html += '<option value="">— Add Animation —</option>'
      for (const name of Object.keys(ANIMATIONS)) {
        html += \`<option value="\${name}">\${name}</option>\`
      }
      html += '</select></div>'
    }

    // Quick token pickers
    html += '<div class="mz-section"><div class="mz-section-label">Quick Apply</div>'

    if (TOKENS.spacing) {
      html += '<div class="mz-prop-row"><span class="mz-prop-label">pad</span>'
      html += '<select class="mz-token-select" data-apply-class-prefix="pad:">'
      html += '<option value="">—</option>'
      for (const k of Object.keys(TOKENS.spacing)) {
        html += \`<option value="\${k}">\${k}</option>\`
      }
      html += '</select></div>'

      html += '<div class="mz-prop-row"><span class="mz-prop-label">mar</span>'
      html += '<select class="mz-token-select" data-apply-class-prefix="mar:">'
      html += '<option value="">—</option>'
      for (const k of Object.keys(TOKENS.spacing)) {
        html += \`<option value="\${k}">\${k}</option>\`
      }
      html += '</select></div>'

      html += '<div class="mz-prop-row"><span class="mz-prop-label">gap</span>'
      html += '<select class="mz-token-select" data-apply-class-prefix="gap:">'
      html += '<option value="">—</option>'
      for (const k of Object.keys(TOKENS.spacing)) {
        html += \`<option value="\${k}">\${k}</option>\`
      }
      html += '</select></div>'
    }

    if (TOKENS.radius) {
      html += '<div class="mz-prop-row"><span class="mz-prop-label">curve</span>'
      html += '<select class="mz-token-select" data-apply-class-prefix="curve:">'
      html += '<option value="">—</option>'
      for (const k of Object.keys(TOKENS.radius)) {
        html += \`<option value="\${k}">\${k}</option>\`
      }
      html += '</select></div>'
    }

    if (TOKENS.shadows) {
      html += '<div class="mz-prop-row"><span class="mz-prop-label">cast</span>'
      html += '<select class="mz-token-select" data-apply-class-prefix="cast:">'
      html += '<option value="">—</option>'
      for (const k of Object.keys(TOKENS.shadows)) {
        html += \`<option value="\${k}">\${k}</option>\`
      }
      html += '</select></div>'
    }

    if (TOKENS.typography) {
      html += '<div class="mz-prop-row"><span class="mz-prop-label">text</span>'
      html += '<select class="mz-token-select" data-apply-class-prefix="text:">'
      html += '<option value="">—</option>'
      for (const k of Object.keys(TOKENS.typography)) {
        html += \`<option value="\${k}">\${k}</option>\`
      }
      html += '</select></div>'
    }

    html += '</div>'

    // Manual input
    html += \`<div class="mz-add-class">
      <input class="mz-add-input" id="mz-manual-input" placeholder="paint:primary pad:md..." />
      <button class="mz-add-btn" id="mz-manual-add">+</button>
    </div>\`

    return html
  }

  // ── EVENT HANDLERS ────────────────────────────────────────
  function attachClassTabEvents() {
    // Remove class
    document.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation()
        const cls = btn.dataset.remove
        target.classList.remove(cls)
        renderPanel()
        showToast(\`Removed: \${cls}\`)
      })
    })

    // Copy class name
    document.querySelectorAll('.mz-class-name[data-cls]').forEach(el => {
      el.addEventListener('click', () => {
        navigator.clipboard?.writeText(el.dataset.cls)
        showToast(\`Copied: \${el.dataset.cls}\`)
      })
    })
  }

  function attachAddTabEvents() {
    // Pattern select
    const patSel = document.getElementById('mz-pattern-select')
    if (patSel) {
      patSel.addEventListener('change', () => {
        if (!patSel.value) return
        target.classList.add(patSel.value)
        showToast(\`Added: \${patSel.value}\`)
        tab = 'classes'
        renderPanel()
        setActiveTab('classes')
      })
    }

    // Animation select
    const animSel = document.getElementById('mz-anim-select')
    if (animSel) {
      animSel.addEventListener('change', () => {
        if (!animSel.value) return
        target.classList.add(animSel.value)
        showToast(\`Added: \${animSel.value}\`)
        tab = 'classes'
        renderPanel()
        setActiveTab('classes')
      })
    }

    // Token selects
    document.querySelectorAll('[data-apply-class-prefix]').forEach(sel => {
      sel.addEventListener('change', () => {
        if (!sel.value) return
        const cls = sel.dataset.applyClassPrefix + sel.value
        // Remove existing class with same prefix
        const prefix = sel.dataset.applyClassPrefix
        Array.from(target.classList).forEach(c => {
          if (c.startsWith(prefix)) target.classList.remove(c)
        })
        target.classList.add(cls)
        showToast(\`Applied: \${cls}\`)
      })
    })

    // Color chips
    document.querySelectorAll('[data-apply-color]').forEach(chip => {
      chip.addEventListener('click', () => {
        const name = chip.dataset.applyColor
        // Remove existing paint class
        Array.from(target.classList).forEach(c => {
          if (c.startsWith('paint:')) target.classList.remove(c)
        })
        target.classList.add(\`paint:\${name}\`)
        showToast(\`paint:\${name}\`)
      })
    })

    // Manual add
    const input = document.getElementById('mz-manual-input')
    const addBtn = document.getElementById('mz-manual-add')

    if (addBtn && input) {
      const doAdd = () => {
        const val = input.value.trim()
        if (!val) return
        val.split(/\\s+/).forEach(cls => {
          if (cls) target.classList.add(cls)
        })
        showToast(\`Added: \${val}\`)
        input.value = ''
        tab = 'classes'
        renderPanel()
        setActiveTab('classes')
      }
      addBtn.addEventListener('click', doAdd)
      input.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd() })
    }
  }

  // ── TOAST ─────────────────────────────────────────────────
  function showToast(msg) {
    const toast = document.getElementById('mz-copy-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(window.__mzToastTimer)
    window.__mzToastTimer = setTimeout(() => toast.classList.remove('show'), 1800)
  }

  // ── TAB SWITCHING ─────────────────────────────────────────
  function setActiveTab(name) {
    tab = name
    document.querySelectorAll('.mz-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === name)
    })
    renderPanel()
  }

  // ── POSITION PANEL ────────────────────────────────────────
  function positionPanel() {
    if (!target || panelX !== null) return
    const rect = target.getBoundingClientRect()
    const pw   = 300
    const ph   = 460
    let x = rect.right + 12
    let y = rect.top

    if (x + pw > window.innerWidth - 10) x = rect.left - pw - 12
    if (x < 10) x = 10
    if (y + ph > window.innerHeight - 10) y = window.innerHeight - ph - 10
    if (y < 10) y = 10

    panel.style.left = x + 'px'
    panel.style.top  = y + 'px'
  }

  // ── HIGHLIGHT ─────────────────────────────────────────────
  function updateHighlight(el) {
    if (!el) { highlight.style.display = 'none'; return }
    const rect = el.getBoundingClientRect()
    highlight.style.display = 'block'
    highlight.style.left    = rect.left + 'px'
    highlight.style.top     = rect.top + 'px'
    highlight.style.width   = rect.width + 'px'
    highlight.style.height  = rect.height + 'px'
  }

  // ── COPY ALL ─────────────────────────────────────────────
  function copyAllClasses() {
    if (!target) return
    const cls = Array.from(target.classList).join(' ')
    navigator.clipboard?.writeText(cls)
    showToast('All classes copied!')
  }

  // ── BUILD DOM ─────────────────────────────────────────────
  function buildDOM() {
    // Toggle button
    const toggle = document.createElement('div')
    toggle.id = 'mz-devtools-toggle'
    toggle.innerHTML = '🌊'
    toggle.title = 'Mizumi DevTools'
    document.body.appendChild(toggle)

    // Highlight box
    highlight = document.createElement('div')
    highlight.id = 'mz-highlight'
    highlight.style.display = 'none'
    document.body.appendChild(highlight)

    // Panel
    panel = document.createElement('div')
    panel.id = 'mz-panel'
    panel.innerHTML = \`
      <div id="mz-panel-header">
        <span id="mz-panel-title">Mizumi ✦ Dev</span>
        <div id="mz-panel-actions">
          <button class="mz-action-btn" id="mz-pin-btn">pin</button>
          <button class="mz-action-btn" id="mz-close-btn">×</button>
        </div>
      </div>
      <div id="mz-target-info">
        <div id="mz-target-tag"></div>
        <div id="mz-target-classes"></div>
      </div>
      <div id="mz-tabs">
        <div class="mz-tab active" data-tab="classes">Classes</div>
        <div class="mz-tab" data-tab="computed">Computed</div>
        <div class="mz-tab" data-tab="add">+ Add</div>
      </div>
      <div id="mz-panel-body"></div>
      <div id="mz-panel-footer">
        <span id="mz-copy-all-btn">copy all classes</span>
        <span id="mz-mizumi-mark">MIZUMI 🌊</span>
      </div>
    \`
    document.body.appendChild(panel)

    // Toast
    const toast = document.createElement('div')
    toast.id = 'mz-copy-toast'
    document.body.appendChild(toast)

    // ── EVENTS ──

    // Toggle
    toggle.addEventListener('click', () => {
      enabled = !enabled
      toggle.classList.toggle('active', enabled)
      if (!enabled) {
        panel.classList.remove('visible')
        highlight.style.display = 'none'
        target = null
        panelX = null
        panelY = null
      }
    })

    // Close
    document.getElementById('mz-close-btn').addEventListener('click', () => {
      panel.classList.remove('visible')
      highlight.style.display = 'none'
      pinned = false
      target = null
      panelX = null
      panelY = null
      document.getElementById('mz-pin-btn').classList.remove('active')
    })

    // Pin
    document.getElementById('mz-pin-btn').addEventListener('click', () => {
      pinned = !pinned
      document.getElementById('mz-pin-btn').classList.toggle('active', pinned)
    })

    // Tabs
    document.querySelectorAll('.mz-tab').forEach(t => {
      t.addEventListener('click', () => setActiveTab(t.dataset.tab))
    })

    // Copy all
    document.getElementById('mz-copy-all-btn').addEventListener('click', copyAllClasses)

    // Drag panel
    const header = document.getElementById('mz-panel-header')
    header.addEventListener('mousedown', e => {
      if (e.target.closest('button')) return
      dragging = true
      const rect = panel.getBoundingClientRect()
      dragOffX = e.clientX - rect.left
      dragOffY = e.clientY - rect.top
    })

    document.addEventListener('mousemove', e => {
      if (dragging) {
        panelX = e.clientX - dragOffX
        panelY = e.clientY - dragOffY
        panel.style.left = panelX + 'px'
        panel.style.top  = panelY + 'px'
      }
    })

    document.addEventListener('mouseup', () => { dragging = false })

    // Hover detection
    document.addEventListener('mouseover', e => {
      if (!enabled || dragging) return
      const el = e.target
      if (el.closest('#mz-panel') || el.closest('#mz-devtools-toggle')) return

      updateHighlight(el)

      if (!pinned) {
        target = el
        panelX = null
        panelY = null
        panel.classList.add('visible')
        positionPanel()
        renderPanel()
      }
    })

    document.addEventListener('mouseout', e => {
      if (!enabled || pinned) return
      if (!e.relatedTarget || e.relatedTarget.closest('#mz-panel') || e.relatedTarget.closest('#mz-devtools-toggle')) return
      // Keep panel visible when moving to it
      if (e.relatedTarget && !e.relatedTarget.closest('#mz-panel')) {
        updateHighlight(null)
      }
    })

    // Click to pin on element
    document.addEventListener('click', e => {
      if (!enabled) return
      if (e.target.closest('#mz-panel') || e.target.closest('#mz-devtools-toggle')) return
      e.preventDefault()
      e.stopPropagation()
      target = e.target
      pinned = true
      panelX = null
      panelY = null
      panel.classList.add('visible')
      positionPanel()
      renderPanel()
      updateHighlight(target)
      document.getElementById('mz-pin-btn').classList.add('active')
    }, true)

    // Keyboard shortcut — Alt+M to toggle
    document.addEventListener('keydown', e => {
      if (e.altKey && e.key === 'm') {
        enabled = !enabled
        toggle.classList.toggle('active', enabled)
        if (!enabled) {
          panel.classList.remove('visible')
          highlight.style.display = 'none'
        }
      }
      if (e.key === 'Escape' && panel.classList.contains('visible')) {
        panel.classList.remove('visible')
        highlight.style.display = 'none'
        pinned = false
        panelX = null
        panelY = null
        document.getElementById('mz-pin-btn').classList.remove('active')
      }
    })
  }

  // ── INIT ─────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDOM)
  } else {
    buildDOM()
  }

  console.log('🌊 Mizumi DevTools ready — hover any element | Alt+M to toggle | Click to pin')
})()
`
}