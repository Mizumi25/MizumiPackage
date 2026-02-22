// packages/depth/index.js
// Mizumi Depth Engine — 6th Layer

export class DepthEngine {
  constructor(config = {}) {
    this.config = {
      layers:      config.layers      ?? 6,
      perspective: config.perspective ?? 1200,
      light: {
        x:         config.light?.x         ?? -1,
        y:         config.light?.y         ?? -1,
        intensity: config.light?.intensity ?? 0.6,
        ambient:   config.light?.ambient   ?? 0.4,
      },
      effects: {
        shadow:     config.effects?.shadow     ?? true,
        scale:      config.effects?.scale      ?? true,
        brightness: config.effects?.brightness ?? true,
        blur:       config.effects?.blur       ?? true,
        saturate:   config.effects?.saturate   ?? true,
      },
      strength: config.strength ?? 0.5,
      zMap: config.zMap ?? {
        0:   0,
        10:  1,
        20:  2,
        100: 3,
        200: 4,
        999: 5,
      },
    }
  }

  getDepth(zIndex) {
    const z      = parseInt(zIndex) || 0
    const zMap   = this.config.zMap
    const keys   = Object.keys(zMap).map(Number).sort((a, b) => a - b)
    const layers = this.config.layers - 1

    if (zMap[z] !== undefined) return zMap[z] / layers

    let lo = keys[0], hi = keys[keys.length - 1]
    for (let i = 0; i < keys.length - 1; i++) {
      if (z >= keys[i] && z <= keys[i + 1]) { lo = keys[i]; hi = keys[i + 1]; break }
    }
    const t       = (z - lo) / (hi - lo || 1)
    const loDepth = (zMap[lo] ?? 0) / layers
    const hiDepth = (zMap[hi] ?? layers) / layers
    return loDepth + t * (hiDepth - loDepth)
  }

  getDepthVars(depth) {
    const s   = this.config.strength
    const lx  = this.config.light.x
    const ly  = this.config.light.y
    const li  = this.config.light.intensity
    const amb = this.config.light.ambient

    const shadowDist   = depth * 24 * s
    const shadowBlur   = (1 - depth * 0.6) * 32 * s
    const shadowSpread = depth * 2 * s
    const shadowAlpha  = (amb + depth * li) * 0.22 * s
    const shadowX      = lx * shadowDist * 0.5
    const shadowY      = ly * shadowDist * 0.5
    const scale        = 1 + depth * 0.012 * s
    const brightness   = 1 - (1 - depth) * 0.08 * s
    const saturate     = 1 - (1 - depth) * 0.12 * s
    const backdropBlur = depth < 0.15 ? (0.15 - depth) * 3 * s : 0

    return { shadowX, shadowY, shadowBlur, shadowSpread, shadowAlpha, scale, brightness, saturate, backdropBlur, depth }
  }

  generateDepthCSS(tokens = {}) {
    const zIndex = tokens.zIndex || { base: 0, float: 10, sticky: 20, modal: 100, toast: 200, top: 999 }
    const lines  = []

    lines.push('/* ===== MIZUMI DEPTH — Static CSS Layer ===== */')
    lines.push('')
    lines.push(':root {')
    lines.push(`  --mz-perspective: ${this.config.perspective}px;`)
    lines.push(`  --mz-light-x: ${this.config.light.x};`)
    lines.push(`  --mz-light-y: ${this.config.light.y};`)
    lines.push(`  --mz-strength: ${this.config.strength};`)
    lines.push('}')
    lines.push('')

    const tiers = Object.entries(zIndex).sort((a, b) => a[1] - b[1])

    tiers.forEach(([name, z], i) => {
      const depth     = i / (tiers.length - 1 || 1)
      const vars      = this.getDepthVars(depth)
      const shadowStr = `${vars.shadowX.toFixed(1)}px ${vars.shadowY.toFixed(1)}px ${vars.shadowBlur.toFixed(1)}px ${vars.shadowSpread.toFixed(1)}px rgba(0,0,0,${vars.shadowAlpha.toFixed(3)})`
      const filterStr = `brightness(${vars.brightness.toFixed(3)}) saturate(${vars.saturate.toFixed(3)})`

      lines.push(`/* depth tier: ${name} (z=${z}) */`)
      lines.push(`.layer\\:${name} {`)
      lines.push(`  --mz-depth-shadow:   ${shadowStr};`)
      lines.push(`  --mz-depth-filter:   ${filterStr};`)
      lines.push(`  --mz-depth-scale:    ${vars.scale.toFixed(4)};`)
      if (vars.backdropBlur > 0.01) {
        lines.push(`  --mz-depth-backdrop: blur(${vars.backdropBlur.toFixed(2)}px);`)
      }
      lines.push(`  box-shadow:     var(--mz-depth-shadow);`)
      lines.push(`  filter:         var(--mz-depth-filter);`)
      lines.push(`  transform:      scale(var(--mz-depth-scale, 1));`)
      lines.push(`  transition:     box-shadow 0.3s ease, filter 0.3s ease, transform 0.3s ease;`)
      lines.push('}')
      lines.push('')
    })

    lines.push('.depth-flat   { box-shadow: none !important; filter: none !important; transform: none !important; }')
    lines.push('.depth-boost  { filter: brightness(1.05) saturate(1.1) !important; }')
    lines.push('.depth-ignore { }')
    lines.push('')

    return lines.join('\n')
  }

  generateRuntimeScript() {
    const cfg = JSON.stringify(this.config, null, 2)

    return `
;(function MizumiDepth() {
  if (window.__MIZUMI_DEPTH__) return
  window.__MIZUMI_DEPTH__ = true

  const CFG = ${cfg}

  function getDepth(zIndex) {
    const z      = parseInt(zIndex) || 0
    const zMap   = CFG.zMap
    const keys   = Object.keys(zMap).map(Number).sort((a, b) => a - b)
    const layers = CFG.layers - 1
    if (zMap[z] !== undefined) return zMap[z] / layers
    let lo = keys[0], hi = keys[keys.length - 1]
    for (let i = 0; i < keys.length - 1; i++) {
      if (z >= keys[i] && z <= keys[i + 1]) { lo = keys[i]; hi = keys[i + 1]; break }
    }
    const t       = (z - lo) / (hi - lo || 1)
    const loDepth = (zMap[lo] ?? 0) / layers
    const hiDepth = (zMap[hi] ?? layers) / layers
    return loDepth + t * (hiDepth - loDepth)
  }

  function applyDepth(el, depth) {
    const s   = CFG.strength
    const lx  = CFG.light.x
    const ly  = CFG.light.y
    const li  = CFG.light.intensity
    const amb = CFG.light.ambient
    const fx  = CFG.effects

    const shadowDist   = depth * 24 * s
    const shadowBlur   = (1 - depth * 0.6) * 32 * s
    const shadowSpread = depth * 2 * s
    const shadowAlpha  = (amb + depth * li) * 0.22 * s
    const shadowX      = lx * shadowDist * 0.5
    const shadowY      = ly * shadowDist * 0.5
    const scale        = 1 + depth * 0.012 * s
    const brightness   = 1 - (1 - depth) * 0.08 * s
    const saturate     = 1 - (1 - depth) * 0.12 * s
    const backdropBlur = depth < 0.15 ? (0.15 - depth) * 3 * s : 0

    const hasExplicitShadow = Array.from(el.classList).some(c => c.startsWith('cast:'))
    if (fx.shadow && !hasExplicitShadow && shadowAlpha > 0.01) {
      const shadow = \`\${shadowX.toFixed(1)}px \${shadowY.toFixed(1)}px \${shadowBlur.toFixed(1)}px \${shadowSpread.toFixed(1)}px rgba(0,0,0,\${shadowAlpha.toFixed(3)})\`
      el.style.setProperty('--mz-depth-shadow', shadow)
    }

    const filters = []
    if (fx.brightness && Math.abs(brightness - 1) > 0.001) filters.push(\`brightness(\${brightness.toFixed(3)})\`)
    if (fx.saturate   && Math.abs(saturate - 1)   > 0.001) filters.push(\`saturate(\${saturate.toFixed(3)})\`)
    if (filters.length) el.style.setProperty('--mz-depth-filter', filters.join(' '))

    if (fx.scale && Math.abs(scale - 1) > 0.0001) el.style.setProperty('--mz-depth-scale', scale.toFixed(4))
    if (fx.blur  && backdropBlur > 0.01)           el.style.setProperty('--mz-depth-backdrop', \`blur(\${backdropBlur.toFixed(2)}px)\`)

    el.setAttribute('data-mz-depth', depth.toFixed(2))
  }

  function injectCSS() {
    const style = document.createElement('style')
    style.id    = 'mizumi-depth-styles'
    style.textContent = \`
      [data-mz-depth] {
        box-shadow:      var(--mz-depth-shadow, none);
        filter:          var(--mz-depth-filter, none);
        transform:       scale(var(--mz-depth-scale, 1));
        backdrop-filter: var(--mz-depth-backdrop, none);
        will-change:     transform, filter, box-shadow;
        transition:
          box-shadow  0.3s cubic-bezier(0.4,0,0.2,1),
          filter      0.3s cubic-bezier(0.4,0,0.2,1),
          transform   0.3s cubic-bezier(0.4,0,0.2,1);
      }
      .depth-flat   { box-shadow: none !important; filter: none !important; transform: none !important; }
      .depth-boost  { filter: brightness(1.05) saturate(1.1) !important; }
    \`
    document.head.appendChild(style)
  }

  function scanDOM() {
    const tokenToZ = { base: 0, float: 10, sticky: 20, modal: 100, toast: 200, top: 999 }
    const processed = new WeakSet()

    document.querySelectorAll('[class]').forEach(el => {
      if (el.classList.contains('depth-ignore')) return
      if (processed.has(el)) return

      const layerClass = Array.from(el.classList).find(c => c.startsWith('layer:'))
      if (layerClass) {
        const token = layerClass.split(':')[1]
        const z     = tokenToZ[token] ?? parseInt(token) ?? 0
        processed.add(el)
        applyDepth(el, getDepth(z))
        return
      }

      const z = window.getComputedStyle(el).zIndex
      if (z && z !== 'auto' && z !== '0') {
        processed.add(el)
        applyDepth(el, getDepth(z))
      }
    })
  }

  function observeDOM() {
    const tokenToZ = { base: 0, float: 10, sticky: 20, modal: 100, toast: 200, top: 999 }
    new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue
          if (node.classList?.contains('depth-ignore')) continue
          const layerClass = Array.from(node.classList || []).find(c => c.startsWith('layer:'))
          if (layerClass) {
            const token = layerClass.split(':')[1]
            const z     = tokenToZ[token] ?? parseInt(token) ?? 0
            applyDepth(node, getDepth(z))
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true })
  }

  window.MizumiDepth = {
    version: '0.1.0',
    set(el, depth)   { applyDepth(el, Math.max(0, Math.min(1, depth))) },
    refresh()        { scanDOM() },
    setLight(x, y)   { CFG.light.x = x; CFG.light.y = y; scanDOM() },
    setStrength(s)   { CFG.strength = Math.max(0, Math.min(1, s)); scanDOM() },
    getDepth(el)     { return parseFloat(el.getAttribute('data-mz-depth') ?? '0') },
    disable() {
      document.querySelectorAll('[data-mz-depth]').forEach(el => {
        el.style.removeProperty('--mz-depth-shadow')
        el.style.removeProperty('--mz-depth-filter')
        el.style.removeProperty('--mz-depth-scale')
        el.style.removeProperty('--mz-depth-backdrop')
        el.removeAttribute('data-mz-depth')
      })
      document.getElementById('mizumi-depth-styles')?.remove()
      window.__MIZUMI_DEPTH__ = false
    }
  }

  function init() {
    injectCSS()
    document.documentElement.style.setProperty('--mz-perspective', CFG.perspective + 'px')
    document.body.style.perspective       = 'var(--mz-perspective)'
    document.body.style.perspectiveOrigin = '50% 30%'
    scanDOM()
    observeDOM()
    console.log('🌊 Mizumi Depth ready')
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
`
  }
}

export default DepthEngine