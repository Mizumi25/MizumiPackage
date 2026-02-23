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
  
  
  // ── WRITE-BACK: get React fiber source location ───────────
  function getSourceLocation(el) {
    if (el.dataset && el.dataset.source) {
      const parts = el.dataset.source.split(':')
      return { file: parts[0], line: parseInt(parts[1]) || 1 }
    }
    const fiberKey = Object.keys(el).find(k =>
      k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance')
    )
    if (fiberKey) {
      let fiber = el[fiberKey]
      while (fiber) {
        const src = fiber._debugSource || fiber.memoizedProps?.__source
        if (src && src.fileName) {
          return { file: src.fileName, line: src.lineNumber }
        }
        fiber = fiber.return
      }
    }
    return null
  }

  // ── RESOLVE SOURCE (with server fallback for non-React) ───
  async function resolveSource(el) {
    // 1. Try React fiber (fastest)
    const loc = getSourceLocation(el)
    if (loc) return loc

    // 2. Try data-source attribute
    if (el.dataset && el.dataset.source) {
      const parts = el.dataset.source.split(':')
      return { file: parts[0], line: parseInt(parts[1]) || 1 }
    }

    // 3. Ask server to scan source files (Vue / Svelte / HTML)
    try {
      const classList = Array.from(el.classList).filter(c =>
        c.includes(':') || c.includes('{')
      ).slice(0, 3)

      const r = await fetch('/__mizumi_source_resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tagName:   el.tagName.toLowerCase(),
          id:        el.id || null,
          classList: classList,
        })
      })
      const data = await r.json()
      if (data.ok) return { file: data.file, line: data.line }
    } catch { /* server not available */ }

    return null
  }

  function writeClassesToSource(el, newClasses) {
    resolveSource(el).then(loc => {
      if (!loc) {
        showToast('⚠ no source location — DOM only')
        return
      }
      fetch('/__mizumi_write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: loc.file, line: loc.line, newClasses })
      })
        .then(r => r.json())
        .then(result => {
          if (result.ok) showToast('✓ saved to source')
          else showToast('⚠ ' + (result.reason || 'write failed'))
        })
        .catch(() => showToast('⚠ write failed'))
    })
  }

  // ── WRITE SINGLE CONFIG KEY ───────────────────────────────
  function writeConfig(keyPath, value) {
    fetch('/__mizumi_write_config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyPath, value })
    })
      .then(r => r.json())
      .then(result => {
        if (result.ok) showToast(\`✓ config: \${keyPath.split('.').pop()} = \${value}\`)
        else showToast('⚠ config: ' + (result.reason || 'write failed'))
      })
      .catch(() => showToast('⚠ config write failed'))
  }

  // ── WRITE DEPTH/LIGHT BATCH ───────────────────────────────
  let _depthFlushTimer = null
  let _depthPending    = {}
  function writeDepth(changes) {
    Object.assign(_depthPending, changes)
    clearTimeout(_depthFlushTimer)
    _depthFlushTimer = setTimeout(() => {
      const payload = { ..._depthPending }
      _depthPending  = {}
      fetch('/__mizumi_write_depth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(r => r.json())
        .then(result => {
          if (result.ok) showToast(\`✓ depth config saved (\${result.patched} keys)\`)
        })
        .catch(() => { /* silent — light is non-critical */ })
    }, 600) // debounce 600ms so dragging knobs doesn't hammer disk
  }

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

    /* ── Perspective Tab ── */
    .mz-persp-row {
      margin-bottom: 10px;
    }
    .mz-persp-label {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #7a7568;
      margin-bottom: 4px;
    }
    .mz-persp-val {
      color: #c9a96e;
      font-variant-numeric: tabular-nums;
      min-width: 40px;
      text-align: right;
    }
    .mz-persp-slider {
      width: 100%;
      -webkit-appearance: none;
      height: 3px;
      border-radius: 2px;
      background: #2a2823;
      outline: none;
      cursor: pointer;
    }
    .mz-persp-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #c9a96e;
      cursor: pointer;
      transition: transform 0.1s;
    }
    .mz-persp-slider::-webkit-slider-thumb:hover {
      transform: scale(1.3);
    }
    .mz-persp-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      color: #7a7568;
    }
    .mz-toggle {
      position: relative;
      display: inline-block;
      width: 28px;
      height: 16px;
      cursor: pointer;
    }
    .mz-toggle input { display: none; }
    .mz-toggle-track {
      position: absolute;
      inset: 0;
      background: #2a2823;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .mz-toggle-track::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #5a5650;
      transition: transform 0.2s, background 0.2s;
    }
    .mz-toggle input:checked + .mz-toggle-track {
      background: rgba(201,169,110,0.2);
    }
    .mz-toggle input:checked + .mz-toggle-track::after {
      transform: translateX(12px);
      background: #c9a96e;
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
    
    #mz-sun {
      position: fixed;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid #000;
      background: rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-family: ui-monospace, monospace;
      color: #000;
      font-weight: 700;
      letter-spacing: 0.1em;
      cursor: grab;
      z-index: 999999;
      user-select: none;
      box-shadow: 0 0 20px rgba(255,255,220,0.8), 0 0 60px rgba(255,255,180,0.3);
      transition: box-shadow 0.2s;
      display: none;
    }
    #mz-sun:active { cursor: grabbing; }
    #mz-sun.visible { display: flex; }

    /* ── DIMENSION HUD — replaces old persp-panel ── */
    #mz-dim-hud {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99998;
      background: #0e0d0b;
      border: 1px solid #2a2823;
      border-radius: 14px;
      padding: 10px 16px 12px;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      color: #7a7568;
      display: none;
      flex-direction: column;
      gap: 8px;
      min-width: 340px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      user-select: none;
    }
    #mz-dim-hud.visible { display: flex; }

    #mz-dim-hud-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #c9a96e;
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    #mz-dim-hud-title span { color: #3d3a34; font-size: 9px; }
    #mz-dim-hud-close {
      background: none;
      border: 1px solid #2a2823;
      border-radius: 3px;
      color: #5a5650;
      font-size: 11px;
      line-height: 1;
      padding: 1px 5px;
      cursor: pointer;
      transition: all 0.1s;
      font-family: inherit;
      margin-left: 8px;
      flex-shrink: 0;
    }
    #mz-dim-hud-close:hover { border-color: #c9a96e; color: #c9a96e; }

    /* ── Light HUD ── */
    #mz-light-hud {
      position: fixed;
      z-index: 99998;
      background: #0e0d0b;
      border: 1px solid #2a2823;
      border-radius: 14px;
      padding: 10px 16px 12px;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      color: #7a7568;
      display: none;
      flex-direction: column;
      gap: 8px;
      min-width: 280px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      user-select: none;
      bottom: 70px;
      right: 64px;
    }
    #mz-light-hud.visible { display: flex; }
    #mz-light-hud-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #f0c060;
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    #mz-light-hud-title span { color: #3d3a34; font-size: 9px; }
    #mz-light-hud-close {
      background: none;
      border: 1px solid #2a2823;
      border-radius: 3px;
      color: #5a5650;
      font-size: 11px;
      line-height: 1;
      padding: 1px 5px;
      cursor: pointer;
      transition: all 0.1s;
      font-family: inherit;
      margin-left: 8px;
      flex-shrink: 0;
    }
    #mz-light-hud-close:hover { border-color: #f0c060; color: #f0c060; }

    #mz-dim-hud-knobs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .mz-knob-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .mz-knob-label {
      font-size: 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #3d3a34;
    }
    .mz-knob-val {
      font-size: 10px;
      color: #c9a96e;
      font-variant-numeric: tabular-nums;
      min-width: 34px;
      text-align: center;
    }

    /* SVG knob — rotary dial */
    .mz-knob {
      width: 44px;
      height: 44px;
      cursor: ns-resize;
      touch-action: none;
    }
    .mz-knob .track   { fill: none; stroke: #2a2823; stroke-width: 4; }
    .mz-knob .fill    { fill: none; stroke: #c9a96e; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 0.05s; }
    .mz-knob .dot     { fill: #c9a96e; }
    .mz-knob .bg      { fill: #151412; }

    #mz-dim-hud-row2 {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    #mz-dim-hud-row2 .mz-hud-slider-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .mz-hud-slider-label {
      font-size: 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #3d3a34;
      display: flex;
      justify-content: space-between;
    }
    .mz-hud-slider-label span { color: #c9a96e; }
    .mz-hud-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 2px;
      background: #2a2823;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }
    .mz-hud-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #c9a96e;
      cursor: pointer;
    }

    #mz-dim-hud-toggles {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
    }
    .mz-hud-pill {
      font-size: 8px;
      padding: 3px 8px;
      border-radius: 20px;
      border: 1px solid #2a2823;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.08em;
      color: #5a5650;
    }
    .mz-hud-pill.on {
      border-color: rgba(201,169,110,0.4);
      color: #c9a96e;
      background: rgba(201,169,110,0.06);
    }

    /* ── old persp CSS kept for .mz-persp-label on tab ── */
    .mz-persp-label {
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3d3a34;
      margin-bottom: 4px;
    }
    .mz-persp-value {
      color: #c9a96e;
      font-size: 10px;
      margin-left: 6px;
    }
    .mz-persp-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 3px;
      background: #2a2823;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }
    .mz-persp-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #c9a96e;
      cursor: pointer;
    }

    #mz-sun-btn {
      position: fixed;
      z-index: 99999;
      width: 36px;
      height: 36px;
      background: #0e0d0b;
      border: 1px solid #2a2823;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      transition: all 0.15s;
      user-select: none;
      bottom: 70px;
      right: 20px;
    }
    #mz-sun-btn:hover { border-color: #c9a96e; transform: scale(1.1); }
    #mz-sun-btn.active { border-color: #c9a96e; box-shadow: 0 0 0 2px rgba(201,169,110,0.3); }

    #mz-light-crosshair {
      position: fixed;
      pointer-events: none;
      z-index: 999998;
      display: none;
    }
    #mz-light-crosshair.visible { display: block; }
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
    } else if (tab === 'perspective') {
      body.innerHTML = renderPerspectiveTab()
      attachPerspectiveTabEvents()
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
        writeClassesToSource(target, Array.from(target.classList).join(' '))
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
        writeClassesToSource(target, Array.from(target.classList).join(' '))
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
        writeClassesToSource(target, Array.from(target.classList).join(' '))
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
        writeClassesToSource(target, Array.from(target.classList).join(' '))
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
        writeClassesToSource(target, Array.from(target.classList).join(' '))
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
          writeClassesToSource(target, Array.from(target.classList).join(' '))
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
  // ── PERSPECTIVE TAB ──────────────────────────────────────────
  // Quick-add panel + HUD launcher. Main controls are in the floating HUD (Alt+D)
  function renderPerspectiveTab() {
    const dim = window.MizumiDimension ? window.MizumiDimension.getConfig() : null
    const targetIsDim    = target && target.classList.contains('dimension')
    const targetIsScrub  = target && target.classList.contains('dimension-scrub')
    const targetIsScroll = target && target.classList.contains('dimension-scroll')

    if (!dim) {
      return \`<div class="mz-empty" style="padding:16px;line-height:1.6;">
        <strong style="color:#c9a96e;">MizumiDimension not loaded</strong><br>
        <span style="color:#5a5650;font-size:11px;">Add <code style="color:#c9a96e;">mizumi-depth-runtime.js</code> to your page.</span>
      </div>\`
    }

    const statusColor = targetIsDim ? '#4ade80' : targetIsScrub ? '#38bdf8' : targetIsScroll ? '#a78bfa' : '#3d3a34'
    const statusText  = targetIsDim ? '● .dimension' : targetIsScrub ? '● .dimension-scrub' : targetIsScroll ? '● .dimension-scroll' : '○ no dimension class'

    return \`
      <div style="padding: 12px;">
        <div style="background:#151412;border:1px solid #2a2823;border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#3d3a34;margin-bottom:6px;">
            Selected Element
            <span style="float:right;color:\${statusColor}">\${statusText}</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
            <button class="mz-action-btn" id="mz-p-add-dim"    style="flex:1;padding:5px 0;font-size:9px;">+ .dimension</button>
            <button class="mz-action-btn" id="mz-p-add-scrub"  style="flex:1;padding:5px 0;font-size:9px;">+ .dimension-scrub</button>
            <button class="mz-action-btn" id="mz-p-add-scroll" style="flex:1;padding:5px 0;font-size:9px;">+ .dimension-scroll</button>
          </div>
          <div style="margin-top:6px;">
            <button class="mz-action-btn" id="mz-p-remove-dim" style="width:100%;padding:5px 0;font-size:9px;color:#ef4444;border-color:rgba(239,68,68,0.2);">
              remove all dimension classes
            </button>
          </div>
        </div>

        <div style="background:#151412;border:1px solid #2a2823;border-radius:8px;padding:10px 12px;margin-bottom:10px;cursor:pointer;" id="mz-p-open-hud">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:10px;color:#c9a96e;">⬡ Open Dimension HUD</span>
            <span style="font-size:9px;color:#3d3a34;">Alt+D</span>
          </div>
          <div style="font-size:9px;color:#5a5650;margin-top:4px;line-height:1.5;">
            Rotary knobs for tilt, depth, speed, zoom.<br>Live-updates all .dimension elements.
          </div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div class="mz-section-label" style="margin:0;">Config snippet</div>
            <span id="mz-p-copy" style="cursor:pointer;color:#c9a96e;font-size:10px;">copy</span>
          </div>
          <pre id="mz-p-snippet" style="font-size:9px;color:#8a8070;background:#0e0d0b;border-radius:6px;padding:8px;overflow:auto;margin:0;line-height:1.5;white-space:pre-wrap;"></pre>
        </div>
      </div>
    \`
  }

  function attachPerspectiveTabEvents() {
    const dim = window.MizumiDimension
    if (!dim) return

    document.getElementById('mz-p-open-hud')?.addEventListener('click', () => {
      const hud = document.getElementById('mz-dim-hud')
      if (hud) hud.classList.add('visible')
    })
    document.getElementById('mz-p-add-dim')?.addEventListener('click', () => {
      if (target) { target.classList.add('dimension'); dim.refresh(); showToast('✓ .dimension added'); renderPanel() }
    })
    document.getElementById('mz-p-add-scrub')?.addEventListener('click', () => {
      if (target) { target.classList.add('dimension-scrub'); dim.refresh(); showToast('✓ .dimension-scrub added') }
    })
    document.getElementById('mz-p-add-scroll')?.addEventListener('click', () => {
      if (target) { target.classList.add('dimension-scroll'); dim.refresh(); showToast('✓ .dimension-scroll added') }
    })
    document.getElementById('mz-p-remove-dim')?.addEventListener('click', () => {
      if (target) {
        target.classList.remove('dimension','dimension-scrub','dimension-scroll')
        dim.reset(target)
        showToast('removed')
        renderPanel()
      }
    })
    document.getElementById('mz-p-copy')?.addEventListener('click', () => {
      const s = document.getElementById('mz-p-snippet')?.textContent || ''
      navigator.clipboard?.writeText(s).then(() => showToast('✓ copied'))
    })

    const cfg = dim.getConfig()
    const s   = document.getElementById('mz-p-snippet')
    if (s) s.textContent = \`depth: {
  dimension: {
    tiltStrength:   \${cfg.tiltStrength},
    perspective:    \${cfg.perspective},
    duration:       \${cfg.duration},
    scrollZoom:     \${cfg.scrollZoom},
    scrollScale:    \${cfg.scrollScale},
    shine:          \${cfg.shine},
    shineOpacity:   \${cfg.shineOpacity},
    parallaxLayers: \${cfg.parallaxLayers},
    parallaxDepth:  \${cfg.parallaxDepth},
    resetOnLeave:   \${cfg.resetOnLeave},
  }
}\`
  }

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
    toggle.innerHTML = '💮'
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
        <div class="mz-tab" data-tab="perspective">⬡ 3D</div>
      </div>
      <div id="mz-panel-body"></div>
      <div id="mz-panel-footer">
        <span id="mz-copy-all-btn">copy all classes</span>
        <span id="mz-mizumi-mark">MIZUMI 💮</span>
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

    // ── DevTools UI guard — prevent inspecting our own widgets ──
    function isDevToolsUI(el) {
      return el.closest('#mz-panel') ||
             el.closest('#mz-devtools-toggle') ||
             el.closest('#mz-sun-btn') ||
             el.closest('#mz-sun') ||
             el.closest('#mz-dim-hud') ||
             el.closest('#mz-light-hud') ||
             el.closest('#mz-copy-toast') ||
             el.closest('#mz-highlight')
    }

    // Hover detection
    document.addEventListener('mouseover', e => {
      if (!enabled || dragging) return
      const el = e.target
      if (isDevToolsUI(el)) return

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
      if (!e.relatedTarget || isDevToolsUI(e.relatedTarget)) return
      // Keep panel visible when moving to it
      if (e.relatedTarget && !e.relatedTarget.closest('#mz-panel')) {
        updateHighlight(null)
      }
    })

    // Click to pin on element
    document.addEventListener('click', e => {
      if (!enabled) return
      if (isDevToolsUI(e.target)) return
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
    
    
    // ── SUN BUTTON ──
    const sunBtn = document.createElement('div')
    sunBtn.id    = 'mz-sun-btn'
    sunBtn.title = 'Light Simulator'
    sunBtn.innerHTML = '☀'
    document.body.appendChild(sunBtn)

    // ── SUN CIRCLE ──
    const sun = document.createElement('div')
    sun.id    = 'mz-sun'
    sun.textContent = 'SUN'
    document.body.appendChild(sun)

    // ── DIMENSION HUD ──────────────────────────────────────────
    // Floating bottom-center pod for live Dimension control
    // Replaces the old ⟁ perspective button + panel
    const dimHud = document.createElement('div')
    dimHud.id = 'mz-dim-hud'

    // Helper: build one SVG rotary knob
    function makeKnob(id, label, value, min, max, unit) {
      // Arc params — 220° sweep starting from bottom-left
      const R = 16, cx = 22, cy = 22
      const startAngle = 130, sweepAngle = 280
      const startRad = (startAngle - 90) * Math.PI / 180
      const normalize = v => Math.max(0, Math.min(1, (v - min) / (max - min)))

      function arcPath(fraction) {
        const angle = startAngle + fraction * sweepAngle
        const rad   = (angle - 90) * Math.PI / 180
        const ex    = cx + R * Math.cos(rad)
        const ey    = cy + R * Math.sin(rad)
        const large = fraction * sweepAngle > 180 ? 1 : 0
        const sx    = cx + R * Math.cos(startRad)
        const sy    = cy + R * Math.sin(startRad)
        return \`M \${sx.toFixed(2)} \${sy.toFixed(2)} A \${R} \${R} 0 \${large} 1 \${ex.toFixed(2)} \${ey.toFixed(2)}\`
      }

      function dotPos(fraction) {
        const angle = startAngle + fraction * sweepAngle
        const rad   = (angle - 90) * Math.PI / 180
        return {
          x: (cx + (R - 0.5) * Math.cos(rad)).toFixed(2),
          y: (cy + (R - 0.5) * Math.sin(rad)).toFixed(2)
        }
      }

      const norm    = normalize(value)
      const path    = arcPath(norm)
      const dot     = dotPos(norm)
      const trackP  = arcPath(1)
      const display = Number.isInteger(value) ? value : value.toFixed(2)

      return \`<div class="mz-knob-col">
        <div class="mz-knob-label">\${label}</div>
        <svg class="mz-knob" id="\${id}" viewBox="0 0 44 44"
             data-min="\${min}" data-max="\${max}" data-val="\${value}" data-unit="\${unit}">
          <circle class="bg" cx="22" cy="22" r="20"/>
          <path class="track" d="\${trackP}"/>
          <path class="fill" id="\${id}-fill" d="\${path}"/>
          <circle class="dot" id="\${id}-dot" cx="\${dot.x}" cy="\${dot.y}" r="2.5"/>
        </svg>
        <div class="mz-knob-val" id="\${id}-val">\${display}\${unit}</div>
      </div>\`
    }

    // Get initial dim config values
    function getDim() {
      return window.MizumiDimension ? window.MizumiDimension.getConfig() : {
        tiltStrength: 15, perspective: 800, duration: 0.4,
        scrollZoom: 20, scrollScale: 1.06, shine: true,
        parallaxLayers: true, shineOpacity: 0.15, parallaxDepth: 20, resetOnLeave: true
      }
    }

    function buildHud() {
      const d = getDim()
      dimHud.innerHTML = \`
        <div id="mz-dim-hud-title">
          ⬡ DIMENSION
          <span>drag knobs up/down to adjust</span>
          <button id="mz-dim-hud-close">×</button>
        </div>
        <div id="mz-dim-hud-knobs">
          \${makeKnob('mz-dk-tilt',    'Tilt',      d.tiltStrength,  0,   45,   '°')}
          \${makeKnob('mz-dk-restx',   'Rest X',    d.restingX !== undefined ? d.restingX : -8, -45, 45, '°')}
          \${makeKnob('mz-dk-resty',   'Rest Y',    d.restingY !== undefined ? d.restingY :  6, -45, 45, '°')}
          \${makeKnob('mz-dk-dur',     'Speed',     d.duration,      0.05,1.5,  's')}
        </div>
        <div id="mz-dim-hud-row2">
          <div class="mz-hud-slider-group">
            <div class="mz-hud-slider-label">Scroll Scale <span id="mz-dhs-scale-val">\${d.scrollScale.toFixed(2)}x</span></div>
            <input class="mz-hud-slider" id="mz-dhs-scale" type="range" min="1" max="1.3" step="0.01" value="\${d.scrollScale}">
          </div>
          <div class="mz-hud-slider-group">
            <div class="mz-hud-slider-label">Layer Depth <span id="mz-dhs-pdepth-val">\${d.parallaxDepth}px</span></div>
            <input class="mz-hud-slider" id="mz-dhs-pdepth" type="range" min="0" max="80" step="1" value="\${d.parallaxDepth}">
          </div>
          <div class="mz-hud-slider-group">
            <div class="mz-hud-slider-label">Shine <span id="mz-dhs-shine-val">\${d.shineOpacity.toFixed(2)}</span></div>
            <input class="mz-hud-slider" id="mz-dhs-shine" type="range" min="0" max="0.5" step="0.01" value="\${d.shineOpacity}">
          </div>
        </div>
        <div id="mz-dim-hud-toggles">
          <div class="mz-hud-pill \${d.shine          ? 'on' : ''}" data-toggle="shine">✦ Shine</div>
          <div class="mz-hud-pill \${d.parallaxLayers ? 'on' : ''}" data-toggle="parallaxLayers">⊕ Layers</div>
          <div class="mz-hud-pill \${d.resetOnLeave   ? 'on' : ''}" data-toggle="resetOnLeave">↺ Reset</div>
        </div>
      \`
      // close button event — re-attach each buildHud call
      const closeBtn = dimHud.querySelector('#mz-dim-hud-close')
      if (closeBtn) closeBtn.addEventListener('click', () => dimHud.classList.remove('visible'))
    }

    buildHud()
    document.body.appendChild(dimHud)

    // ── LIGHT HUD ──────────────────────────────────────────────
    // Floating controls for MizumiDepth light + shadow engine
    const lightHud = document.createElement('div')
    lightHud.id = 'mz-light-hud'
    lightHud.innerHTML = \`
      <div id="mz-light-hud-title">
        ☀ LIGHT &amp; DEPTH
        <span>drag knobs up/down</span>
        <button id="mz-light-hud-close">×</button>
      </div>
      <div id="mz-dim-hud-knobs" style="grid-template-columns:repeat(3,1fr)">
        \${makeKnob('mz-lk-intensity', 'Intensity', 0.6,  0, 1,    '')}
        \${makeKnob('mz-lk-ambient',   'Ambient',   0.4,  0, 1,    '')}
        \${makeKnob('mz-lk-strength',  'Strength',  0.5,  0, 1.5,  '')}
      </div>
      <div id="mz-dim-hud-row2">
        <div class="mz-hud-slider-group">
          <div class="mz-hud-slider-label">Z Depth <span id="mz-lhs-z-val">80px</span></div>
          <input class="mz-hud-slider" id="mz-lhs-z" type="range" min="0" max="200" step="1" value="80">
        </div>
        <div class="mz-hud-slider-group">
          <div class="mz-hud-slider-label">Perspective <span id="mz-lhs-persp-val">1200px</span></div>
          <input class="mz-hud-slider" id="mz-lhs-persp" type="range" min="400" max="3000" step="50" value="1200">
        </div>
      </div>
      <div id="mz-dim-hud-toggles">
        <div class="mz-hud-pill on"  data-ltoggle="shadow">◼ Shadow</div>
        <div class="mz-hud-pill on"  data-ltoggle="brightness">☀ Bright</div>
        <div class="mz-hud-pill on"  data-ltoggle="rim">◎ Rim</div>
        <div class="mz-hud-pill on"  data-ltoggle="gradient">▣ Grad</div>
        <div class="mz-hud-pill on"  data-ltoggle="blur">◌ Blur</div>
      </div>
    \`
    document.body.appendChild(lightHud)

    // Close light hud
    lightHud.querySelector('#mz-light-hud-close').addEventListener('click', () => lightHud.classList.remove('visible'))

    // Show light hud when sun is activated
    // (sunBtn click handler updated below)

    // ── KNOB DRAG LOGIC ────────────────────────────────────────
    // Drag up = increase, drag down = decrease (like Figma/Spline)
    function attachKnobEvents() {
      const knobMap = {
        'mz-dk-tilt':  'tiltStrength',
        'mz-dk-restx': 'restingX',
        'mz-dk-resty': 'restingY',
        'mz-dk-dur':   'duration',
      }

      Object.entries(knobMap).forEach(([id, key]) => {
        const svg   = document.getElementById(id)
        if (!svg) return

        let dragging = false
        let startY   = 0
        let startVal = 0

        const min  = parseFloat(svg.dataset.min)
        const max  = parseFloat(svg.dataset.max)
        const unit = svg.dataset.unit
        const R    = 16, cx = 22, cy = 22
        const startAngle = 130, sweepAngle = 280

        function updateKnobVisual(val) {
          const norm = Math.max(0, Math.min(1, (val - min) / (max - min)))
          const startRad = (startAngle - 90) * Math.PI / 180

          function arcPath(fraction) {
            const angle = startAngle + fraction * sweepAngle
            const rad   = (angle - 90) * Math.PI / 180
            const ex    = cx + R * Math.cos(rad)
            const ey    = cy + R * Math.sin(rad)
            const large = fraction * sweepAngle > 180 ? 1 : 0
            const sx    = cx + R * Math.cos(startRad)
            const sy    = cy + R * Math.sin(startRad)
            return \`M \${sx.toFixed(2)} \${sy.toFixed(2)} A \${R} \${R} 0 \${large} 1 \${ex.toFixed(2)} \${ey.toFixed(2)}\`
          }

          const fill = document.getElementById(id + '-fill')
          const dot  = document.getElementById(id + '-dot')
          if (fill) fill.setAttribute('d', arcPath(norm))
          if (dot) {
            const angle = startAngle + norm * sweepAngle
            const rad   = (angle - 90) * Math.PI / 180
            dot.setAttribute('cx', (cx + (R - 0.5) * Math.cos(rad)).toFixed(2))
            dot.setAttribute('cy', (cy + (R - 0.5) * Math.sin(rad)).toFixed(2))
          }

          const valEl = document.getElementById(id + '-val')
          if (valEl) {
            const display = (unit === 'px' || unit === '°') ? Math.round(val) : val.toFixed(2)
            valEl.textContent = display + unit
          }

          svg.dataset.val = val
        }

        function onMove(clientY) {
          const dy     = startY - clientY       // up = positive
          const range  = max - min
          const speed  = range / 200             // 200px drag = full range
          let   newVal = startVal + dy * speed
          newVal = Math.round(newVal / parseFloat(svg.getAttribute('step') || 1)) * parseFloat(svg.getAttribute('step') || 1)
          newVal = Math.max(min, Math.min(max, newVal))
          updateKnobVisual(newVal)
          if (window.MizumiDimension) window.MizumiDimension.setConfig(key, newVal)
          // ── Write to config ──
          writeConfig('depth.dimension.' + key, parseFloat(newVal.toFixed(4)))
        }

        svg.addEventListener('mousedown', e => {
          dragging = true
          startY   = e.clientY
          startVal = parseFloat(svg.dataset.val)
          e.preventDefault()
        })
        svg.addEventListener('touchstart', e => {
          dragging = true
          startY   = e.touches[0].clientY
          startVal = parseFloat(svg.dataset.val)
          e.preventDefault()
        }, { passive: false })

        document.addEventListener('mousemove', e => { if (dragging) onMove(e.clientY) })
        document.addEventListener('touchmove', e => { if (dragging) onMove(e.touches[0].clientY) }, { passive: false })
        document.addEventListener('mouseup',  () => { dragging = false })
        document.addEventListener('touchend', () => { dragging = false })
      })
    }

    // ── HUD SLIDER EVENTS ──────────────────────────────────────
    function attachHudSliderEvents() {
      const sliders = {
        'mz-dhs-scale':  { key: 'scrollScale',   valId: 'mz-dhs-scale-val',  fmt: v => v.toFixed(2) + 'x' },
        'mz-dhs-pdepth': { key: 'parallaxDepth', valId: 'mz-dhs-pdepth-val', fmt: v => Math.round(v) + 'px' },
        'mz-dhs-shine':  { key: 'shineOpacity',  valId: 'mz-dhs-shine-val',  fmt: v => v.toFixed(2) },
      }
      Object.entries(sliders).forEach(([id, { key, valId, fmt }]) => {
        const el  = document.getElementById(id)
        const val = document.getElementById(valId)
        if (!el) return
        el.addEventListener('input', () => {
          const v = parseFloat(el.value)
          if (val) val.textContent = fmt(v)
          if (window.MizumiDimension) window.MizumiDimension.setConfig(key, v)
          writeConfig('depth.dimension.' + key, parseFloat(v.toFixed(4)))
        })
      })
    }

    // ── HUD TOGGLE PILLS ──────────────────────────────────────
    function attachHudToggleEvents() {
      dimHud.querySelectorAll('.mz-hud-pill[data-toggle]').forEach(pill => {
        pill.addEventListener('click', () => {
          const key = pill.dataset.toggle
          const dim = window.MizumiDimension
          if (!dim) return
          const cur = dim.getConfig()[key]
          const next = !cur
          dim.setConfig(key, next)
          pill.classList.toggle('on', next)
          writeConfig('depth.dimension.' + key, next)
        })
      })
    }

    // ── LIGHT HUD KNOB EVENTS ──────────────────────────────────
    function attachLightKnobEvents() {
      const lightKnobMap = {
        'mz-lk-intensity': (v) => { if (window.MizumiDepth) window.MizumiDepth.setLightConfig?.({ intensity: v }); writeDepth({ 'light.intensity': parseFloat(v.toFixed(4)) }) },
        'mz-lk-ambient':   (v) => { if (window.MizumiDepth) window.MizumiDepth.setLightConfig?.({ ambient:   v }); writeDepth({ 'light.ambient':   parseFloat(v.toFixed(4)) }) },
        'mz-lk-strength':  (v) => { if (window.MizumiDepth) window.MizumiDepth.setStrength?.(v);                   writeDepth({ strength:          parseFloat(v.toFixed(4)) }) },
      }
      Object.entries(lightKnobMap).forEach(([id, setter]) => {
        const svg = document.getElementById(id)
        if (!svg) return
        let lDragging = false, lStartY = 0, lStartVal = 0
        const min = parseFloat(svg.dataset.min)
        const max = parseFloat(svg.dataset.max)
        const unit = svg.dataset.unit
        const R = 16, cx = 22, cy = 22
        const startAngle = 130, sweepAngle = 280

        function updateLightKnob(val) {
          const norm = Math.max(0, Math.min(1, (val - min) / (max - min)))
          const startRad = (startAngle - 90) * Math.PI / 180
          function arcPath(fraction) {
            const angle = startAngle + fraction * sweepAngle
            const rad   = (angle - 90) * Math.PI / 180
            const ex    = cx + R * Math.cos(rad)
            const ey    = cy + R * Math.sin(rad)
            const large = fraction * sweepAngle > 180 ? 1 : 0
            const sx    = cx + R * Math.cos(startRad)
            const sy    = cy + R * Math.sin(startRad)
            return \`M \${sx.toFixed(2)} \${sy.toFixed(2)} A \${R} \${R} 0 \${large} 1 \${ex.toFixed(2)} \${ey.toFixed(2)}\`
          }
          const fill = document.getElementById(id + '-fill')
          const dot  = document.getElementById(id + '-dot')
          if (fill) fill.setAttribute('d', arcPath(norm))
          if (dot) {
            const angle = startAngle + norm * sweepAngle
            const rad   = (angle - 90) * Math.PI / 180
            dot.setAttribute('cx', (cx + (R - 0.5) * Math.cos(rad)).toFixed(2))
            dot.setAttribute('cy', (cy + (R - 0.5) * Math.sin(rad)).toFixed(2))
          }
          const valEl = document.getElementById(id + '-val')
          if (valEl) valEl.textContent = val.toFixed(2) + unit
          svg.dataset.val = val
        }

        function onLightMove(clientY) {
          const dy = lStartY - clientY
          const range = max - min
          let newVal = lStartVal + dy * (range / 200)
          newVal = Math.max(min, Math.min(max, newVal))
          updateLightKnob(newVal)
          setter(newVal)
        }

        svg.addEventListener('mousedown', e => { lDragging = true; lStartY = e.clientY; lStartVal = parseFloat(svg.dataset.val); e.preventDefault() })
        svg.addEventListener('touchstart', e => { lDragging = true; lStartY = e.touches[0].clientY; lStartVal = parseFloat(svg.dataset.val); e.preventDefault() }, { passive: false })
        document.addEventListener('mousemove', e => { if (lDragging) onLightMove(e.clientY) })
        document.addEventListener('touchmove', e => { if (lDragging) onLightMove(e.touches[0].clientY) }, { passive: false })
        document.addEventListener('mouseup',  () => { lDragging = false })
        document.addEventListener('touchend', () => { lDragging = false })
      })
    }

    // ── LIGHT HUD SLIDER + TOGGLE EVENTS ─────────────────────
    function attachLightSliderEvents() {
      const zEl = document.getElementById('mz-lhs-z')
      const zVal = document.getElementById('mz-lhs-z-val')
      if (zEl) zEl.addEventListener('input', () => {
        const v = parseFloat(zEl.value)
        if (zVal) zVal.textContent = Math.round(v) + 'px'
        if (window.MizumiDepth) window.MizumiDepth.setTranslateZ?.(v)
        writeDepth({ translateZ: Math.round(v) })
      })

      const pEl = document.getElementById('mz-lhs-persp')
      const pVal = document.getElementById('mz-lhs-persp-val')
      if (pEl) pEl.addEventListener('input', () => {
        const v = parseFloat(pEl.value)
        if (pVal) pVal.textContent = Math.round(v) + 'px'
        if (window.MizumiDepth) window.MizumiDepth.setPerspective?.(v)
        writeDepth({ perspective: Math.round(v) })
      })

      lightHud.querySelectorAll('.mz-hud-pill[data-ltoggle]').forEach(pill => {
        pill.addEventListener('click', () => {
          const key = pill.dataset.ltoggle
          if (!window.MizumiDepth) return
          const cur  = window.MizumiDepth.getEffects?.()[key] ?? true
          const next = !cur
          window.MizumiDepth.setEffect?.(key, next)
          pill.classList.toggle('on', next)
          writeDepth({ ['effects.' + key]: next })
        })
      })
    }

    // Init HUD events once DOM is in place
    setTimeout(() => {
      attachKnobEvents()
      attachHudSliderEvents()
      attachHudToggleEvents()
      attachLightKnobEvents()
      attachLightSliderEvents()
    }, 0)

    // ── TOGGLE HUD via Alt+D ───────────────────────────────────
    document.addEventListener('keydown', e => {
      if (e.altKey && e.key === 'd') {
        dimHud.classList.toggle('visible')
      }
    })

    // ── SUN DRAG LOGIC ──
    let sunActive    = false
    let sunDragging = false
    let sunOffX     = 0
    let sunOffY     = 0
    
    sunBtn.addEventListener('click', () => {
      sunActive = !sunActive
      sunBtn.classList.toggle('active', sunActive)
      if (sunActive) {
        // Place sun at center of viewport initially
        sun.style.left = (window.innerWidth / 2 - 30) + 'px'
        sun.style.top  = (window.innerHeight / 2 - 30) + 'px'
        sun.classList.add('visible')
        lightHud.classList.add('visible')
      } else {
        sun.classList.remove('visible')
        lightHud.classList.remove('visible')
      }
    })

    sun.addEventListener('mousedown', function(e) {
      sunDragging = true
      var rect    = sun.getBoundingClientRect()
      sunOffX     = e.clientX - rect.left
      sunOffY     = e.clientY - rect.top
      e.stopPropagation()
      e.preventDefault()
    })

    sun.addEventListener('touchstart', function(e) {
      sunDragging = true
      var rect    = sun.getBoundingClientRect()
      var t       = e.touches[0]
      sunOffX     = t.clientX - rect.left
      sunOffY     = t.clientY - rect.top
      e.stopPropagation()
      e.preventDefault()
    }, { passive: false })

    document.addEventListener('mousemove', function(e) {
      if (!sunDragging) return
      var x = e.clientX - sunOffX
      var y = e.clientY - sunOffY
      sun.style.left = x + 'px'
      sun.style.top  = y + 'px'
      var sunCX = x + 30
      var sunCY = y + 30
      var lx = (sunCX - window.innerWidth  / 2) / (window.innerWidth  / 2)
      var ly = (sunCY - window.innerHeight / 2) / (window.innerHeight / 2)
      if (window.MizumiDepth) window.MizumiDepth.setLight(lx, ly)
    })

    document.addEventListener('touchmove', function(e) {
      if (!sunDragging) return
      var t = e.touches[0]
      var x = t.clientX - sunOffX
      var y = t.clientY - sunOffY
      sun.style.left = x + 'px'
      sun.style.top  = y + 'px'
      var lx = (x + 30 - window.innerWidth  / 2) / (window.innerWidth  / 2)
      var ly = (y + 30 - window.innerHeight / 2) / (window.innerHeight / 2)
      if (window.MizumiDepth) window.MizumiDepth.setLight(lx, ly)
    }, { passive: false })

    document.addEventListener('mouseup',  function() { sunDragging = false })
    document.addEventListener('touchend', function() { sunDragging = false })

    // ── PERSPECTIVE PANEL LOGIC — removed, replaced by Dimension HUD ──
  }

  // ── INIT ─────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDOM)
  } else {
    buildDOM()
  }

  console.log('💮 Mizumi DevTools ready — hover any element | Alt+M to toggle | Click to pin')
})()
`
}