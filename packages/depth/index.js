// packages/depth/index.js
// Mizumi Depth Engine — 6th Layer

export class DepthEngine {
  constructor(config = {}) {
    this.config = {
      layers:            config.layers            ?? 6,
      perspective:       config.perspective       ?? 1200,
      perspectiveOrigin: config.perspectiveOrigin ?? '50% 30%',
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
        translateZ: config.effects?.translateZ ?? true,
        rim:        config.effects?.rim        ?? true,  // reflection rim light
        gradient:   config.effects?.gradient   ?? true,  // inner gradient
      },
      strength:   config.strength   ?? 0.5,
      translateZ: config.translateZ ?? 80,
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
    const loDepth = (zMap[lo] != null ? zMap[lo] : 0) / layers
    const hiDepth = (zMap[hi] != null ? zMap[hi] : layers) / layers
    return loDepth + t * (hiDepth - loDepth)
  }

  getDepthVars(depth) {
    const s    = this.config.strength
    const lx   = this.config.light.x
    const ly   = this.config.light.y
    const li   = this.config.light.intensity
    const amb  = this.config.light.ambient
    const maxZ = this.config.translateZ

    // Distance of light from center (0=overhead, ~1.4=far corner)
    const lightDist  = Math.sqrt(lx * lx + ly * ly)
    // Proximity: closer sun = higher value = bigger softer shadow
    const proximity  = Math.max(0, 1 - lightDist * 0.5)

    const shadowDist   = depth * (12 + proximity * 20) * s
    const shadowBlur   = depth * (16 + proximity * 40) * s   // fuzzier when close
    const shadowSpread = depth * (1  + proximity * 4)  * s   // spreads when close
    const shadowAlpha  = (amb + depth * li) * (0.15 + proximity * 0.12) * s
    const shadowX      = -lx * shadowDist * 0.5
    const shadowY      = -ly * shadowDist * 0.5

    const scale        = 1 + depth * 0.012 * s
    const brightness   = 1 - (1 - depth) * 0.08 * s
    const saturate     = 1 - (1 - depth) * 0.12 * s
    const backdropBlur = depth < 0.15 ? (0.15 - depth) * 3 * s : 0
    const tz           = depth * maxZ

    // Rim/reflection: inset on light-facing edge (opposite of shadow direction)
    const rimX         = lx * shadowDist * 0.4
    const rimY         = ly * shadowDist * 0.4
    const rimAlpha     = depth * li * 0.18 * s
    const rimBlur      = 4 + depth * 8

    // Inner gradient angle: light direction → shadow direction
    const gradAngleDeg = Math.round(Math.atan2(lx, -ly) * (180 / Math.PI))
    const gradStrength = depth * li * 0.06 * s   // very subtle

    return {
      shadowX, shadowY, shadowBlur, shadowSpread, shadowAlpha,
      rimX, rimY, rimAlpha, rimBlur,
      gradAngleDeg, gradStrength,
      scale, brightness, saturate, backdropBlur, depth, tz
    }
  }

  generateDepthCSS(tokens = {}) {
    const zIndex = tokens.zIndex || { base: 0, float: 10, sticky: 20, modal: 100, toast: 200, top: 999 }
    const lines  = []

    lines.push('/* ===== MIZUMI DEPTH — Static CSS Layer ===== */')
    lines.push('')
    lines.push(':root {')
    lines.push('  --mz-perspective:        ' + this.config.perspective + 'px;')
    lines.push('  --mz-perspective-origin: ' + this.config.perspectiveOrigin + ';')
    lines.push('  --mz-light-x:            ' + this.config.light.x + ';')
    lines.push('  --mz-light-y:            ' + this.config.light.y + ';')
    lines.push('  --mz-strength:           ' + this.config.strength + ';')
    lines.push('}')
    lines.push('')

    lines.push('html {')
    lines.push('  perspective:        var(--mz-perspective);')
    lines.push('  perspective-origin: var(--mz-perspective-origin);')
    lines.push('}')
    lines.push('')

    const tiers = Object.entries(zIndex).sort((a, b) => a[1] - b[1])

    tiers.forEach(([name, z], i) => {
      const depth = i / (tiers.length - 1 || 1)
      const vars  = this.getDepthVars(depth)

      const shadowStr = vars.shadowX.toFixed(1) + 'px ' + vars.shadowY.toFixed(1) + 'px ' +
                        vars.shadowBlur.toFixed(1) + 'px ' + vars.shadowSpread.toFixed(1) + 'px rgba(0,0,0,' + vars.shadowAlpha.toFixed(3) + ')'

      const rimStr    = 'inset ' + vars.rimX.toFixed(1) + 'px ' + vars.rimY.toFixed(1) + 'px ' +
                        vars.rimBlur.toFixed(1) + 'px 0px rgba(255,255,255,' + vars.rimAlpha.toFixed(3) + ')'

      const filterStr = 'brightness(' + vars.brightness.toFixed(3) + ') saturate(' + vars.saturate.toFixed(3) + ')'

      const gradStr   = 'linear-gradient(' + vars.gradAngleDeg + 'deg, rgba(255,255,255,' + vars.gradStrength.toFixed(3) + ') 0%, rgba(255,255,255,0) 60%)'

      lines.push('/* depth tier: ' + name + ' (z=' + z + ') */')
      lines.push('.layer\\:' + name + ' {')
      lines.push('  --mz-depth-shadow:   ' + shadowStr + ', ' + rimStr + ';')
      lines.push('  --mz-depth-filter:   ' + filterStr + ';')
      lines.push('  --mz-depth-scale:    ' + vars.scale.toFixed(4) + ';')
      lines.push('  --mz-depth-tz:       ' + vars.tz.toFixed(1) + 'px;')
      lines.push('  --mz-depth-gradient: ' + gradStr + ';')
      if (vars.backdropBlur > 0.01) {
        lines.push('  --mz-depth-backdrop: blur(' + vars.backdropBlur.toFixed(2) + 'px);')
      }
      lines.push('  box-shadow:       var(--mz-depth-shadow);')
      lines.push('  filter:           var(--mz-depth-filter);')
      lines.push('  transform:        translateZ(var(--mz-depth-tz, 0px)) scale(var(--mz-depth-scale, 1));')
      lines.push('  transform-style:  preserve-3d;')
      lines.push('  transition:       box-shadow 0.3s ease, filter 0.3s ease, transform 0.3s ease, background 0.3s ease;')
      lines.push('}')
      lines.push('')
    })

    lines.push('.depth-flat   { box-shadow: none !important; filter: none !important; transform: none !important; background-image: none !important; }')
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
    var z      = parseInt(zIndex) || 0
    var zMap   = CFG.zMap
    var keys   = Object.keys(zMap).map(Number).sort(function(a,b){ return a-b })
    var layers = CFG.layers - 1
    if (zMap[z] !== undefined) return zMap[z] / layers
    var lo = keys[0], hi = keys[keys.length - 1]
    for (var i = 0; i < keys.length - 1; i++) {
      if (z >= keys[i] && z <= keys[i + 1]) { lo = keys[i]; hi = keys[i + 1]; break }
    }
    var t       = (z - lo) / (hi - lo || 1)
    var loDepth = (zMap[lo] != null ? zMap[lo] : 0) / layers
    var hiDepth = (zMap[hi] != null ? zMap[hi] : layers) / layers
    return loDepth + t * (hiDepth - loDepth)
  }

  // Returns [r,g,b] of computed background, or null if transparent/no paint
  function getBgRGB(el) {
    var bg = window.getComputedStyle(el).backgroundColor
    var m  = bg.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/)
    if (!m) return null
    if (bg.indexOf('rgba') !== -1 && bg.match(/,\\s*0\\s*\\)/)) return null
    return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
  }

  function applyDepth(el, depth) {
    var s    = CFG.strength
    var lx   = CFG.light.x
    var ly   = CFG.light.y
    var li   = CFG.light.intensity
    var amb  = CFG.light.ambient
    var fx   = CFG.effects
    var maxZ = CFG.translateZ

    // Light proximity — drives shadow size and fuzziness
    var lightDist    = Math.sqrt(lx * lx + ly * ly)
    var proximity    = Math.max(0, 1 - lightDist * 0.5)

    var shadowDist   = depth * (12 + proximity * 20) * s
    var shadowBlur   = depth * (16 + proximity * 40) * s
    var shadowSpread = depth * (1  + proximity * 4)  * s
    var shadowAlpha  = (amb + depth * li) * (0.15 + proximity * 0.12) * s
    var shadowX      = -lx * shadowDist * 0.5
    var shadowY      = -ly * shadowDist * 0.5

    var scale        = 1 + depth * 0.012 * s
    var brightness   = 1 - (1 - depth) * 0.08 * s
    var saturate     = 1 - (1 - depth) * 0.12 * s
    var backdropBlur = depth < 0.15 ? (0.15 - depth) * 3 * s : 0
    var tz           = depth * maxZ

    // Rim light — inset on light-facing side
    var rimX         = lx * shadowDist * 0.4
    var rimY         = ly * shadowDist * 0.4
    var rimBlur      = 4 + depth * 8
    var rimAlpha     = depth * li * 0.18 * s

    // Inner gradient
    var gradAngleDeg = Math.round(Math.atan2(lx, -ly) * (180 / Math.PI))
    var gradStrength = depth * li * 0.06 * s

    // Detect transparent / no paint
    var rgb           = getBgRGB(el)
    var isTransparent = !rgb

    // ── SHADOW + RIM ─────────────────────────────────────────
    if (fx.shadow && shadowAlpha > 0.005) {
      var dropShadow, rimShadow

      if (isTransparent) {
        // No paint: white directional glow + centered bloom
        dropShadow = shadowX.toFixed(1) + 'px ' + shadowY.toFixed(1) + 'px ' +
                     shadowBlur.toFixed(1) + 'px ' + shadowSpread.toFixed(1) +
                     'px rgba(255,255,255,' + (shadowAlpha * 0.6).toFixed(3) + ')'
        var bloomAlpha = (depth * li * 0.12 * s).toFixed(3)
        rimShadow = '0px 0px ' + (depth * 20 * s).toFixed(1) + 'px ' +
                    (depth * 6 * s).toFixed(1) + 'px rgba(255,255,255,' + bloomAlpha + ')'
      } else {
        // Painted: dark drop shadow + inset rim highlight
        dropShadow = shadowX.toFixed(1) + 'px ' + shadowY.toFixed(1) + 'px ' +
                     shadowBlur.toFixed(1) + 'px ' + shadowSpread.toFixed(1) +
                     'px rgba(0,0,0,' + shadowAlpha.toFixed(3) + ')'
        rimShadow = 'inset ' + rimX.toFixed(1) + 'px ' + rimY.toFixed(1) + 'px ' +
                    rimBlur.toFixed(1) + 'px 0px rgba(255,255,255,' + rimAlpha.toFixed(3) + ')'
      }

      el.style.setProperty('--mz-depth-shadow', dropShadow + ', ' + rimShadow)
    }

    // -- INNER GRADIENT (white lit-side inset only, safe on any background) --
    // Only a soft white inset on the light-facing side. No dark inset —
    // darkening destroys light/white backgrounds turning them grey.
    if (fx.gradient && !isTransparent && gradStrength > 0.003) {
      var insetSize = (80 + depth * 60).toFixed(0)
      var litAlpha  = (gradStrength * 1.5).toFixed(3)
      var litInset  = 'inset ' + (lx * 30).toFixed(1) + 'px ' + (ly * 30).toFixed(1) + 'px ' +
                      insetSize + 'px -' + (insetSize * 0.5).toFixed(0) + 'px rgba(255,255,255,' + litAlpha + ')'
      var cur = el.style.getPropertyValue('--mz-depth-shadow')
      if (cur) el.style.setProperty('--mz-depth-shadow', cur + ', ' + litInset)
    }

    // ── FILTER ───────────────────────────────────────────────
    var lightFacing = Math.max(0, (-lx * 0.5 + -ly * 0.5))
    var lightBoost  = lightFacing * depth * li * 0.06 * s
    var finalBright = brightness + lightBoost
    var finalSat    = saturate + lightFacing * depth * 0.08 * s

    var filters = []
    if (fx.brightness && Math.abs(finalBright - 1) > 0.001) filters.push('brightness(' + finalBright.toFixed(3) + ')')
    if (fx.saturate   && Math.abs(finalSat - 1)    > 0.001) filters.push('saturate(' + finalSat.toFixed(3) + ')')
    if (filters.length) el.style.setProperty('--mz-depth-filter', filters.join(' '))

    if (fx.scale      && Math.abs(scale - 1) > 0.0001) el.style.setProperty('--mz-depth-scale', scale.toFixed(4))
    if (fx.blur       && backdropBlur > 0.01)           el.style.setProperty('--mz-depth-backdrop', 'blur(' + backdropBlur.toFixed(2) + 'px)')
    if (fx.translateZ)                                  el.style.setProperty('--mz-depth-tz', tz.toFixed(1) + 'px')

    el.setAttribute('data-mz-depth', depth.toFixed(2))
  }

  function injectCSS() {
    var style = document.createElement('style')
    style.id  = 'mizumi-depth-styles'
    style.textContent = \`
      html {
        perspective:        var(--mz-perspective, 1200px);
        perspective-origin: var(--mz-perspective-origin, 50% 30%);
      }
      [data-mz-depth] {
        box-shadow:      var(--mz-depth-shadow, none);
        filter:          var(--mz-depth-filter, none);
        transform:       translateZ(var(--mz-depth-tz, 0px)) scale(var(--mz-depth-scale, 1));
        transform-style: preserve-3d;
        backdrop-filter: var(--mz-depth-backdrop, none);
        will-change:     transform, filter, box-shadow;
        transition:
          box-shadow  0.3s cubic-bezier(0.4,0,0.2,1),
          filter      0.3s cubic-bezier(0.4,0,0.2,1),
          transform   0.3s cubic-bezier(0.4,0,0.2,1),
          background  0.3s cubic-bezier(0.4,0,0.2,1);
      }
      .depth-flat  { box-shadow: none !important; filter: none !important; transform: none !important; background-image: none !important; }
      .depth-boost { filter: brightness(1.05) saturate(1.1) !important; }
    \`
    document.head.appendChild(style)
  }

  function scanDOM() {
    var tokenToZ  = { base: 0, float: 10, sticky: 20, modal: 100, toast: 200, top: 999 }
    var processed = new WeakSet()

    document.querySelectorAll('[class]').forEach(function(el) {
      if (el === document.body)                   return
      if (el === document.documentElement)        return
      if (el.classList.contains('depth-ignore'))  return
      if (el.closest('#mz-panel'))                return
      if (processed.has(el))                      return
      processed.add(el)

      var layerClass = null
      var classes    = el.classList
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].startsWith('layer:')) { layerClass = classes[i]; break }
      }

      if (layerClass) {
        var token = layerClass.split(':')[1]
        var z     = tokenToZ[token] !== undefined ? tokenToZ[token] : (parseInt(token) || 0)
        applyDepth(el, getDepth(z))
      }
    })
  }

  function observeDOM() {
    var tokenToZ = { base: 0, float: 10, sticky: 20, modal: 100, toast: 200, top: 999 }
    new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes
        for (var j = 0; j < added.length; j++) {
          var node = added[j]
          if (node.nodeType !== 1) continue
          if (!node.classList || node.classList.contains('depth-ignore')) continue
          var classes = node.classList
          for (var k = 0; k < classes.length; k++) {
            if (classes[k].startsWith('layer:')) {
              var token = classes[k].split(':')[1]
              var z     = tokenToZ[token] !== undefined ? tokenToZ[token] : (parseInt(token) || 0)
              applyDepth(node, getDepth(z))
              break
            }
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true })
  }

  window.MizumiDepth = {
    version: '0.1.0',
    set: function(el, depth)  { applyDepth(el, Math.max(0, Math.min(1, depth))) },
    refresh: function()       { scanDOM() },
    setLight: function(x, y)  { CFG.light.x = x; CFG.light.y = y; scanDOM() },
    setStrength: function(s)  { CFG.strength = Math.max(0, Math.min(1, s)); scanDOM() },
    setPerspectiveOrigin: function(origin) {
      CFG.perspectiveOrigin = origin
      document.documentElement.style.setProperty('--mz-perspective-origin', origin)
    },
    getDepth: function(el) { return parseFloat(el.getAttribute('data-mz-depth') || '0') },
    disable: function() {
      document.querySelectorAll('[data-mz-depth]').forEach(function(el) {
        el.style.removeProperty('--mz-depth-shadow')
        el.style.removeProperty('--mz-depth-filter')
        el.style.removeProperty('--mz-depth-scale')
        el.style.removeProperty('--mz-depth-backdrop')
        el.style.removeProperty('--mz-depth-tz')
        el.removeAttribute('data-mz-depth')
      })
      var s = document.getElementById('mizumi-depth-styles')
      if (s) s.remove()
      window.__MIZUMI_DEPTH__ = false
    }
  }

  function init() {
    injectCSS()
    document.documentElement.style.setProperty('--mz-perspective',        CFG.perspective + 'px')
    document.documentElement.style.setProperty('--mz-perspective-origin', CFG.perspectiveOrigin)
    var scan = function() { scanDOM(); observeDOM() }
    if (window.requestIdleCallback) {
      requestIdleCallback(scan, { timeout: 500 })
    } else {
      setTimeout(scan, 100)
    }
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