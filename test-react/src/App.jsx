import React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// MIZUMI — Cinematic Dark Japanese Showcase
// Void black canvas. Noto Serif JP. Extreme negative space. Ma (間).
// Pure className. Zero style={{}}.  @mizumi25/gsap handles ALL motion.
// ─────────────────────────────────────────────────────────────────────────────

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="pos:fixed pos-top:0 pos-left:0 canvas-w:full layer:sticky
                    display:flex align-yi:center align-x:between
                    pad-x:2xl pad-y:lg
                    animate-fade-in{duration:2,ease:smooth}">
      <div className="display:flex align-yi:center gap:md">
        <span className="type-face:serif ink:white text:sm type-weight:thin tracking:widest">水</span>
        <span className="ink:neutral-700 text:xs type-face:mono tracking:widest">mizumi</span>
      </div>
      <div className="display:flex gap:2xl align-yi:center">
        {['Tokens','Patterns','Motion','Depth','Install'].map(l => (
          <span key={l}
                className="text:xs ink:neutral-600 tracking:widest text-case:upper
                           type-face:mono cursor:pointer hover-float hover-bright">
            {l}
          </span>
        ))}
      </div>
      <div className="display:flex align-yi:center gap:xs">
        <div className="canvas-w:2 canvas-h:2 curve:full paint:error animate-pulse" />
        <span className="text:xs type-face:mono ink:neutral-700">v1.0</span>
      </div>
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="canvas-w:full canvas-h:screen pos:relative overflow:hidden
                        display:flex flex-dir:col align-x:center align-yi:end
                        pad-x:2xl pad-y:4xl">

      {/* Giant kanji scrubs on scroll */}
      <div className="pos:absolute pos-top:0 pos-right:0 events:none select:none
                      scroll-scrub{from:y_0_opacity_0.5,to:y_200_opacity_0,scrub:1.5}">
        <span className="type-face:serif ink:neutral-900 type-weight:thin mz-hero-kanji">水</span>
      </div>

      <div className="pos:absolute pos-top:2xl pos-left:2xl animate-fade-in{duration:3}">
        <span className="type-face:mono text:xs ink:neutral-700 tracking:widest">00 — MIZUMI</span>
      </div>

      <div className="pos:relative layer:base canvas-w:full display:flex flex-dir:col gap:lg">
        <div className="animate-slide-up{duration:1.4,ease:smooth}">
          <h1 className="type-face:serif ink:white type-weight:thin leading:none tracking:tight mz-hero-h1">
            <span className="display:block">Design</span>
            <span className="display:block ink:neutral-700 type-style:italic">with</span>
            <span className="display:block">intention.</span>
          </h1>
        </div>

        <div className="animate-fade-in{duration:2,ease:smooth}
                        display:flex align-yi:center align-x:between canvas-w:full pad-top:xl">
          <p className="type-face:mono text:sm ink:neutral-500 leading:relaxed canvas-w-max:42ch">
            Token-first CSS framework. 2000+ utilities. 800+ animations.
            6-layer depth. All from a single className.
          </p>
          <button className="btn-ghost-white btn-lg curve:full hover-lift active-press">
            Explore →
          </button>
        </div>
      </div>

      <div className="pos:absolute pos-bottom:2xl pos-right:2xl
                      animate-bounce display:flex align-yi:center gap:sm">
        <span className="type-face:mono text:2xs ink:neutral-700 tracking:widest text-case:upper">scroll</span>
        <div className="canvas-w:16 canvas-h:px paint:neutral-700 animate-float-sm" />
      </div>
    </section>
  )
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee({ items, dim }) {
  const cls = dim ? 'ink:neutral-800' : 'ink:neutral-600'
  const doubled = [...items, ...items, ...items]
  return (
    <div className="overflow:hidden pad-y:lg
                    stroke-y-start:neutral-900 stroke-y-end:neutral-900
                    stroke-style:solid stroke-width:thin">
      <div className="display:flex gap:4xl wrap:no mz-marquee">
        {doubled.map((item, i) => (
          <span key={i} className={`${cls} type-face:serif type-weight:thin tracking:widest wrap:no mz-marquee-item`}>
            {item}
            <span className="ink:error mar-x:2xl">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── SECTION 01 — TOKENS ─────────────────────────────────────────────────────
function SectionTokens() {
  const colorSwatches = [
    { name: 'primary', c: 'paint:primary' },
    { name: 'primary·600', c: 'paint:primary-600' },
    { name: 'primary·900', c: 'paint:primary-900' },
    { name: 'secondary', c: 'paint:secondary' },
    { name: 'accent', c: 'paint:accent' },
    { name: 'success', c: 'paint:success' },
    { name: 'error', c: 'paint:error' },
    { name: 'warning', c: 'paint:warning' },
    { name: 'amber', c: 'paint:amber' },
    { name: 'emerald', c: 'paint:emerald' },
    { name: 'neutral·200', c: 'paint:neutral-200' },
    { name: 'neutral·950', c: 'paint:neutral-950' },
  ]

  return (
    <section className="pad-y:4xl pad-x:2xl pos:relative overflow:hidden">
      <div className="pos:absolute pos-top:0 pos-right:0 events:none select:none
                      scroll-scrub{from:y_0_opacity_0.07,to:y_-100_opacity_0,scrub:1}">
        <span className="type-face:mono ink:neutral-900 mz-section-num">01</span>
      </div>

      <div className="canvas-w-max:1400px mar-x:auto pos:relative layer:base">
        <div className="display:flex align-yi:start align-x:between mar-bottom:4xl
                        stagger-children-200 scroll-trigger">
          <div className="display:flex flex-dir:col gap:lg">
            <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper">
              01 / Design Tokens
            </span>
            <h2 className="type-face:serif ink:white type-weight:thin leading:tight mz-section-h2">
              Every decision,<br />
              <em className="ink:neutral-700 type-style:italic">a token.</em>
            </h2>
          </div>
          <p className="type-face:mono text:sm ink:neutral-500 leading:relaxed canvas-w-max:36ch">
            2000+ named variables — colors, spacing, typography, shadows, easing, blur, opacity, z-index.
          </p>
        </div>

        {/* Color blocks */}
        <div className="display:flex flex-wrap:yes mar-bottom:4xl scroll-stagger-up mz-color-row">
          {colorSwatches.map(({ name, c }) => (
            <div key={name}
                 className={`${c} mz-color-block cursor:pointer hover-bright active-press hover-scale`}>
              <span className="type-face:mono ink:white mz-color-label">{name}</span>
            </div>
          ))}
        </div>

        {/* Spacing scale */}
        <div className="scroll-slide-up mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            Spacing Scale
          </span>
          <div className="display:flex align-yi:end gap:md">
            {[['xs',4],['sm',8],['md',16],['lg',24],['xl',32],['2xl',48],['3xl',64],['4xl',96]].map(([t, w], i) => (
              <div key={t} className="display:flex flex-dir:col align-yi:center gap:sm hover-float cursor:default">
                <div className="paint:white" style={{ width: w, height: w, opacity: 0.05 + i * 0.1 }} />
                <span className="type-face:mono ink:neutral-700" style={{ fontSize: 9 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type scale */}
        <div className="scroll-fade-in">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            Type Scale
          </span>
          <div className="stagger-children-100">
            {[
              ['h1', 'Mizumi Framework'],
              ['h2', 'Design with intention.'],
              ['h3', 'Token-first CSS system'],
              ['body', 'Every token is a named design decision — a constraint that enables freedom.'],
              ['sm', 'Built for developers who care about craft.'],
              ['xs', 'MIT License · Open Source · v1.0'],
            ].map(([label, sample]) => (
              <div key={label}
                   className="display:flex align-yi:baseline gap:xl pad-y:md
                               stroke-y-end:neutral-900 stroke-style:solid stroke-width:thin
                               hover-float cursor:default">
                <span className="type-face:mono ink:neutral-700 text:xs" style={{ width: 64, flexShrink: 0 }}>{label}</span>
                <span className={`type-face:serif ink:white type-weight:thin text:${label}`}>{sample}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 02 — PATTERNS ───────────────────────────────────────────────────
function SectionPatterns() {
  return (
    <section className="pad-y:4xl pad-x:2xl pos:relative overflow:hidden">
      <div className="pos:absolute pos-top:0 pos-left:0 events:none select:none
                      scroll-scrub{from:y_0_opacity_0.06,to:y_-80_opacity_0,scrub:1.2}">
        <span className="type-face:mono ink:neutral-900 mz-section-num">02</span>
      </div>

      <div className="canvas-w-max:1400px mar-x:auto pos:relative layer:base">
        <div className="scroll-slide-up mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            02 / Patterns
          </span>
          <h2 className="type-face:serif ink:white type-weight:thin leading:tight mz-section-h2">
            400+ composable<br />
            <em className="ink:neutral-700 type-style:italic">patterns.</em>
          </h2>
        </div>

        {/* Cards — asymmetric */}
        <div className="mz-grid-asymm mar-bottom:px scroll-stagger-scale">
          <div className="card paint:neutral-950 pad:2xl
                          stroke-style:solid stroke-width:thin stroke-color:neutral-900
                          hover-lift active-press dimension-scroll
                          display:flex flex-dir:col gap:xl">
            <div className="display:flex align-yi:center align-x:between">
              <span className="badge badge-primary">card</span>
              <span className="type-face:mono text:2xs ink:neutral-700 animate-pulse-sm">● live</span>
            </div>
            <div className="mar-top:auto">
              <h3 className="type-face:serif ink:white type-weight:thin leading:tight mz-card-title">
                Surface Card
              </h3>
              <p className="type-face:mono text:xs ink:neutral-600 leading:relaxed mar-top:md">
                paint:surface + pad:md + curve:lg + cast:md
              </p>
            </div>
            <button className="btn-ghost-white btn-sm curve:full hover-lift active-press align-xs:start display:flex-inline mar-top:auto">
              Explore →
            </button>
          </div>

          <div className="card-glass pad:xl hover-lift active-press dimension-scroll
                          display:flex flex-dir:col gap:md">
            <span className="badge badge-secondary">glass-card</span>
            <div className="mar-top:auto">
              <h3 className="type-face:serif ink:white type-weight:thin leading:tight mz-card-title-sm">Glass</h3>
              <p className="type-face:mono text:xs ink:neutral-500 mar-top:sm leading:relaxed">glass-blur:glass + canvas-fade:soft</p>
            </div>
          </div>

          <div className="card-elevated pad:xl hover-lift active-press dimension-scroll
                          display:flex flex-dir:col gap:md">
            <span className="badge badge-neutral">card-elevated</span>
            <div className="mar-top:auto">
              <h3 className="type-face:serif ink:white type-weight:thin leading:tight mz-card-title-sm">Elevated</h3>
              <p className="type-face:mono text:xs ink:neutral-500 mar-top:sm leading:relaxed">cast:xl — deeper shadow tier</p>
            </div>
          </div>
        </div>

        {/* Buttons row */}
        <div className="scroll-fade-in mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            Buttons
          </span>
          <div className="display:flex flex-wrap:yes gap:sm align-yi:center stagger-children-50">
            <button className="btn-primary hover-lift active-press">Primary</button>
            <button className="btn-secondary hover-lift active-press">Secondary</button>
            <button className="btn-accent hover-lift active-press">Accent</button>
            <button className="btn-ghost-white hover-lift active-press">Ghost</button>
            <button className="btn-dark hover-lift active-press">Dark</button>
            <button className="btn-success hover-lift active-press">Success</button>
            <button className="btn-error hover-lift active-press">Error</button>
            <button className="btn-pill-primary hover-lift active-press animate-pulse-sm">Pill</button>
            <button className="btn-ghost-secondary hover-lift active-press">Ghost·2</button>
          </div>
        </div>

        {/* Badge / tag / chip */}
        <div className="scroll-slide-right mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            Badges · Tags · Chips
          </span>
          <div className="display:flex flex-wrap:yes gap:sm align-yi:center stagger-children-50">
            {['badge-primary','badge-secondary','badge-accent','badge-success','badge-error','badge-warning','badge-dark','badge-neutral','badge-outline'].map(b => (
              <span key={b} className={`badge ${b} hover-scale`}>{b.replace('badge-','')}</span>
            ))}
            <span className="tag hover-scale">react</span>
            <span className="tag hover-scale">mizumi</span>
            <span className="chip hover-scale">Chip</span>
            <span className="chip-active hover-scale">Active</span>
          </div>
        </div>

        {/* Pattern vocabulary */}
        <div className="scroll-fade-in">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:lg">
            Pattern Vocabulary — 400+
          </span>
          <div className="display:flex flex-wrap:yes gap:sm stagger-children-50">
            {['card','card-elevated','card-glass','panel','button','btn-primary','btn-ghost','btn-pill','input','field','form',
              'nav-bar','tab-list','badge','tag','chip','avatar','media','modal','drawer','toast','alert','skeleton',
              'prose','heading','eyebrow','caption','overline','divider','surface','overlay','glass-card'].map(p => (
              <div key={p}
                   className="pad-x:sm pad-y:xs cursor:pointer hover-bright active-press hover-float
                               stroke-style:solid stroke-width:thin stroke-color:neutral-900">
                <code className="type-face:mono text:xs ink:neutral-500">{p}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 03 — ANIMATIONS ─────────────────────────────────────────────────
function SectionAnimations() {
  const loops = [
    ['animate-float','float'],['animate-breathe','breathe'],['animate-morph','morph'],
    ['animate-heartbeat','heartbeat'],['animate-drift','drift'],['animate-orbit','orbit'],
    ['animate-ripple','ripple'],['animate-sway','sway'],['animate-spin-slow','spin·slow'],
    ['animate-pulse-scale','pulse·scale'],['animate-wiggle','wiggle'],['animate-blink','blink'],
  ]
  const hovers = [
    ['hover-lift','lift'],['hover-scale','scale'],['hover-glow','glow'],['hover-float','float'],
    ['hover-rotate','rotate'],['hover-sink','sink'],['hover-bright','bright'],['hover-shake','shake'],
    ['hover-bob','bob'],['hover-jello','jello'],['hover-skew','skew'],['hover-blur','blur'],
  ]

  return (
    <section className="pad-y:4xl pad-x:2xl pos:relative overflow:hidden">
      <div className="pos:absolute pos-top:0 pos-right:0 events:none select:none
                      scroll-scrub{from:x_100_opacity_0,to:x_0_opacity_0.06,scrub:1}">
        <span className="type-face:mono ink:neutral-900 mz-section-num">03</span>
      </div>

      <div className="canvas-w-max:1400px mar-x:auto pos:relative layer:base">
        <div className="scroll-slide-up mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            03 / Animations
          </span>
          <h2 className="type-face:serif ink:white type-weight:thin leading:tight mz-section-h2">
            800+ animations.<br />
            <em className="ink:neutral-700 type-style:italic">Zero JavaScript.</em>
          </h2>
        </div>

        {/* Looping */}
        <div className="mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">— Looping</span>
          <div className="mz-grid-6 scroll-stagger-up">
            {loops.map(([cls, label]) => (
              <div key={label}
                   className="pad:xl stroke-style:solid stroke-width:thin stroke-color:neutral-900
                               display:flex flex-dir:col align-yi:center align-x:center gap:lg cursor:default">
                <div className={`${cls} canvas-w:12 canvas-h:12 paint:neutral-800
                                  display:flex align-yi:center align-x:center`}>
                  <div className="canvas-w:4 canvas-h:4 curve:full paint:white canvas-fade:soft" />
                </div>
                <span className="type-face:mono ink:neutral-700" style={{ fontSize: 9 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hover — interactive */}
        <div className="mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">— Hover (try them)</span>
          <div className="mz-grid-4 scroll-stagger-scale">
            {hovers.map(([cls, label]) => (
              <div key={label}
                   className={`${cls} active-press pad:xl cursor:pointer
                                stroke-style:solid stroke-width:thin stroke-color:neutral-900
                                display:flex flex-dir:col gap:sm`}>
                <span className="type-face:mono ink:neutral-600" style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.2em' }}>hover</span>
                <span className="type-face:serif ink:white type-weight:thin mz-card-title-sm">{label}</span>
                <code className="type-face:mono ink:neutral-700" style={{ fontSize: 9 }}>{cls}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll triggers */}
        <div className="mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">— Scroll-Triggered</span>
          <div className="display:flex flex-dir:col gap:px">
            {[
              ['scroll-fade-in','Fade in + rise as element enters viewport'],
              ['scroll-slide-up','Slide upward — translateY + opacity'],
              ['scroll-scale-in','Scale from 90% — subtle zoom reveal'],
              ['scroll-blur-in','Blur clears as you scroll in'],
              ['scroll-flip-in','3D flip on axis — rotationX from −90°'],
              ['scroll-spring','Spring physics — elastic overshoot entrance'],
              ['scroll-stagger-up','Children cascade upward in sequence'],
              ['scroll-scrub{from:y_-100,to:y_0,scrub:2}','Tied to scroll position via GSAP scrub'],
              ['scroll-pin{start:top_top,end:+=800px}','Pin element during defined scroll range'],
            ].map(([code, desc], i) => (
              <div key={code}
                   className="scroll-fade-in display:flex align-yi:center align-x:between gap:xl
                               pad-y:lg pad-x:xl
                               stroke-y-end:neutral-900 stroke-style:solid stroke-width:thin
                               hover-lift active-press cursor:pointer">
                <span className="type-face:mono ink:neutral-800" style={{ fontSize: 9, width: 32, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <code className="type-face:mono ink:primary text:xs mz-code-w">{code}</code>
                <span className="type-face:mono text:xs ink:neutral-600 leading:relaxed">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inline modifier block */}
        <div className="scroll-scale-in{duration:0.8,ease:back} pad:2xl
                         stroke-style:solid stroke-width:thin stroke-color:neutral-800">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:lg">
            — Inline Modifiers · No JS Needed
          </span>
          <div className="display:flex flex-dir:col gap:md">
            {[
              'className="scroll-fade-in{duration:1.2,ease:bouncy,start:top_90%}"',
              'className="scroll-scrub{from:y_-100_opacity_0,to:y_0_opacity_1,scrub:2}"',
              'className="animate-float{duration:3}"',
              'className="hover-lift{y:-12,duration:0.2}"',
              'className="stagger-children-200 scroll-trigger"',
            ].map((line, i) => (
              <div key={i} className="display:flex align-yi:center gap:md">
                <span className="type-face:mono ink:neutral-800" style={{ fontSize: 9 }}>{String(i + 1).padStart(2, '0')}</span>
                <code className="type-face:mono text:xs ink:primary">{line}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 04 — DEPTH ──────────────────────────────────────────────────────
function SectionDepth() {
  return (
    <section className="pad-y:4xl pad-x:2xl pos:relative overflow:hidden">
      <div className="pos:absolute pos-bottom:0 pos-left:0 events:none select:none
                      scroll-scrub{from:y_0_opacity_0.06,to:y_-100_opacity_0,scrub:1}">
        <span className="type-face:serif ink:neutral-900 type-weight:thin mz-section-num">奥</span>
      </div>

      <div className="canvas-w-max:1400px mar-x:auto pos:relative layer:base">
        <div className="scroll-slide-up mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            04 / Spatial Depth
          </span>
          <h2 className="type-face:serif ink:white type-weight:thin leading:tight mz-section-h2">
            z-index becomes<br />
            <em className="ink:neutral-700 type-style:italic">real depth.</em>
          </h2>
        </div>

        {/* 6-layer visual */}
        <div className="display:flex gap:px mar-bottom:4xl scroll-stagger-up">
          {[
            { z: 'base', v: '0', d: 1 },
            { z: 'float', v: '10', d: 2 },
            { z: 'sticky', v: '20', d: 2.5 },
            { z: 'modal', v: '100', d: 3.5 },
            { z: 'toast', v: '200', d: 4.5 },
            { z: 'top', v: '999', d: 6 },
          ].map(({ z, v, d }, i) => (
            <div key={z}
                 className="display:flex flex-dir:col align-yi:center gap:md hover-float cursor:default"
                 style={{ flex: 1 }}>
              <div className="paint:white canvas-w:full animate-float-sm"
                   style={{ height: d * 40, opacity: 0.02 + i * 0.035,
                            boxShadow: `0 ${i * 8}px ${i * 24}px rgba(255,255,255,${i * 0.015})` }} />
              <span className="type-face:mono ink:neutral-600" style={{ fontSize: 9 }}>{z}</span>
              <span className="type-face:mono ink:neutral-800" style={{ fontSize: 8 }}>z:{v}</span>
            </div>
          ))}
        </div>

        {/* Dimension cards */}
        <div className="mz-grid-3 mar-bottom:4xl scroll-stagger-scale">
          <div className="dimension-scene">
            <div className="dimension pad:2xl paint:neutral-950
                             stroke-style:solid stroke-width:thin stroke-color:neutral-800
                             display:flex flex-dir:col gap:lg">
              <div className="dimension-layer" data-depth="1">
                <span className="type-face:mono text:2xs ink:neutral-700 tracking:widest text-case:upper">dimension</span>
              </div>
              <div className="dimension-layer" data-depth="2">
                <h3 className="type-face:serif ink:white type-weight:thin leading:tight mz-card-title-sm">Tilt Card</h3>
                <p className="type-face:mono text:xs ink:neutral-600 leading:relaxed mar-top:md">
                  Mouse-tracked 3D tilt with parallax child layers and light simulation.
                </p>
              </div>
              <div className="dimension-layer" data-depth="3">
                <button className="btn-ghost-white btn-sm curve:full hover-lift active-press">Hover me →</button>
              </div>
              <div className="dimension-shine" />
            </div>
          </div>

          <div className="dimension-scroll pad:2xl paint:neutral-950
                           stroke-style:solid stroke-width:thin stroke-color:neutral-800
                           display:flex flex-dir:col gap:lg">
            <span className="badge badge-success">dimension-scroll</span>
            <h3 className="type-face:serif ink:white type-weight:thin leading:tight mz-card-title-sm">Scroll Reveal</h3>
            <p className="type-face:mono text:xs ink:neutral-600 leading:relaxed">
              Starts tilted. Flattens as you scroll. 3D zoom.
            </p>
          </div>

          <div className="dimension-scrub pad:2xl paint:neutral-950
                           stroke-style:solid stroke-width:thin stroke-color:neutral-800
                           display:flex flex-dir:col gap:lg">
            <span className="badge badge-accent">dimension-scrub</span>
            <h3 className="type-face:serif ink:white type-weight:thin leading:tight mz-card-title-sm">Scrub Tilt</h3>
            <p className="type-face:mono text:xs ink:neutral-600 leading:relaxed">
              Tilt angle driven by exact scroll position.
            </p>
          </div>
        </div>

        {/* Light effects */}
        <div className="scroll-fade-in pad:2xl stroke-style:solid stroke-width:thin stroke-color:neutral-900">
          <div className="display:flex align-x:between gap:2xl">
            <div className="display:flex flex-dir:col gap:md">
              <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper">Light Engine</span>
              <p className="type-face:mono text:xs ink:neutral-600 leading:relaxed canvas-w-max:36ch">
                Directional light simulates real shadow across all depth tiers. Adjustable x/y, intensity, ambient.
              </p>
            </div>
            <div className="display:flex gap:xl align-yi:center">
              {['shadow','scale','brightness','rim','gradient'].map((fx, i) => (
                <div key={fx} className="display:flex flex-dir:col align-yi:center gap:sm animate-float-sm"
                     style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="canvas-w:3 canvas-h:3 curve:full paint:primary animate-pulse-sm" />
                  <span className="type-face:mono ink:neutral-700"
                        style={{ fontSize: 8, writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>{fx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 05 — UTILITIES ───────────────────────────────────────────────────
function SectionUtilities() {
  const groups = [
    { name: 'Layout', items: ['display:flex','display:grid','flex-dir:col','align-x:center','align-yi:center','align-x:between','gap:md','pos:absolute','pos:fixed','pos:sticky','overflow:hidden','overflow:auto'] },
    { name: 'Paint', items: ['paint:primary','paint:neutral-900','ink:white','ink:primary','ink:neutral-500','canvas-fade:soft','canvas-fade:muted','glass-blur:glass','glass-blur:md','canvas-fade:ghost'] },
    { name: 'Canvas', items: ['canvas-w:full','canvas-h:screen','canvas-w-max:xl','canvas-fit:cover','curve:sm','curve:lg','curve:full','cast:md','cast:xl','cast:2xl','canvas-h:auto'] },
    { name: 'Type', items: ['text:h1','text:body','text:xs','type-weight:thin','type-weight:bold','type-face:serif','type-face:mono','tracking:wide','tracking:widest','leading:relaxed','leading:tight'] },
    { name: 'Interact', items: ['cursor:pointer','cursor:grab','events:none','select:none','touch:none','touch:pan-x','hover-lift','hover-scale','active-press','gesture-spring-press'] },
    { name: 'Position', items: ['layer:modal','layer:sticky','layer:top','layer:float','pos-inset:0','pos-top:0','pos-left:0','pos-right:0','pos-bottom:0','mar-x:auto','pad-x:xl'] },
  ]

  return (
    <section className="pad-y:4xl pad-x:2xl pos:relative overflow:hidden">
      <div className="pos:absolute pos-top:0 pos-right:0 events:none select:none
                      scroll-scrub{from:opacity_0.06_x_100,to:opacity_0_x_0,scrub:1.5}">
        <span className="type-face:mono ink:neutral-900 mz-section-num">05</span>
      </div>

      <div className="canvas-w-max:1400px mar-x:auto pos:relative layer:base">
        <div className="scroll-slide-up mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            05 / Utilities
          </span>
          <h2 className="type-face:serif ink:white type-weight:thin leading:tight mz-section-h2">
            2000+ utility<br />
            <em className="ink:neutral-700 type-style:italic">vocabulary.</em>
          </h2>
        </div>

        <div className="mz-grid-3 scroll-stagger-scale">
          {groups.map(({ name, items }) => (
            <div key={name}
                 className="pad:xl stroke-style:solid stroke-width:thin stroke-color:neutral-900
                             hover-lift dimension-scroll display:flex flex-dir:col gap:lg">
              <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper">{name}</span>
              <div className="display:flex flex-dir:col gap:xs stagger-children-50">
                {items.map(u => (
                  <div key={u} className="pad-x:sm pad-y:xs cursor:pointer hover-bright active-press">
                    <code className="type-face:mono text:xs ink:neutral-400">{u}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Syntax callout */}
        <div className="mar-top:4xl mz-grid-2 scroll-fade-in">
          {[
            { label: 'Named Token → CSS Var', lines: [
              ['pad:md','→ var(--spacing-md)'],
              ['paint:primary','→ var(--color-primary)'],
              ['curve:xl','→ var(--radius-xl)'],
              ['cast:lg','→ var(--shadow-lg)'],
            ]},
            { label: 'Raw Value → Direct', lines: [
              ['canvas-w{640px}','→ width: 640px'],
              ['pad{20px}','→ padding: 20px'],
              ['ink{#ff0000}','→ color: #ff0000'],
              ['curve{50%}','→ border-radius: 50%'],
            ]},
          ].map(({ label, lines }) => (
            <div key={label} className="pad:xl stroke-style:solid stroke-width:thin stroke-color:neutral-900">
              <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:lg">{label}</span>
              <div className="display:flex flex-dir:col gap:sm">
                {lines.map(([prop, val]) => (
                  <div key={prop} className="display:flex gap:md align-yi:center">
                    <code className="type-face:mono text:xs ink:primary">{prop}</code>
                    <span className="type-face:mono text:xs ink:neutral-700">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 06 — DEVTOOLS ────────────────────────────────────────────────────
function SectionDevTools() {
  return (
    <section className="pad-y:4xl pad-x:2xl pos:relative overflow:hidden">
      <div className="pos:absolute pos-bottom:0 pos-right:0 events:none select:none
                      scroll-scrub{from:opacity_0_y_100,to:opacity_0.05_y_0,scrub:1.2}">
        <span className="type-face:serif ink:neutral-900 type-weight:thin mz-section-num">具</span>
      </div>

      <div className="canvas-w-max:1400px mar-x:auto pos:relative layer:base">
        <div className="scroll-slide-up mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            06 / DevTools
          </span>
          <h2 className="type-face:serif ink:white type-weight:thin leading:tight mz-section-h2">
            Inspect. Edit.<br />
            <em className="ink:neutral-700 type-style:italic">Write back.</em>
          </h2>
        </div>

        <div className="mz-grid-devtools scroll-stagger-scale">
          {/* Panel */}
          <div className="paint:neutral-950 stroke-style:solid stroke-width:thin stroke-color:neutral-800
                           overflow:hidden dimension animate-float-sm">
            <div className="display:flex align-yi:center align-x:between pad-x:lg pad-y:md
                             stroke-y-end:neutral-900 stroke-style:solid stroke-width:thin">
              <div className="display:flex align-yi:center gap:sm">
                <div className="canvas-w:3 canvas-h:3 curve:full paint:error animate-pulse" />
                <div className="canvas-w:3 canvas-h:3 curve:full paint:warning animate-pulse-sm" />
                <div className="canvas-w:3 canvas-h:3 curve:full paint:success animate-pulse" />
                <span className="type-face:mono text:2xs ink:neutral-700 mar-left:md tracking:widest">mizumi devtools</span>
              </div>
              <div className="canvas-w:2 canvas-h:2 curve:full paint:primary animate-pulse-sm" />
            </div>
            <div className="pad:lg">
              <div className="type-face:mono text:2xs ink:neutral-700 tracking:widest text-case:upper mar-bottom:md">Inspected Element</div>
              <div className="pad:md paint:neutral-900 mar-bottom:lg">
                <code className="type-face:mono text:xs ink:primary">
                  {'<div className="card hover-lift animate-float">'}
                </code>
              </div>
              <div className="type-face:mono text:2xs ink:neutral-700 tracking:widest text-case:upper mar-bottom:md">Mizumi Classes</div>
              <div className="display:flex flex-dir:col gap:xs mar-bottom:lg stagger-children-100">
                {['card','hover-lift','animate-float','pad:md','curve:xl','layer:float'].map(cls => (
                  <div key={cls}
                       className="display:flex align-yi:center align-x:between pad-x:md pad-y:xs
                                   paint:neutral-900 stroke-y-end:neutral-800 stroke-style:solid stroke-width:thin
                                   hover-bright cursor:pointer">
                    <code className="type-face:mono text:xs ink:primary">{cls}</code>
                    <span className="ink:neutral-700 text:xs">×</span>
                  </div>
                ))}
              </div>
              <div className="type-face:mono text:2xs ink:neutral-700 tracking:widest text-case:upper mar-bottom:md">Dimension Controls</div>
              <div className="display:flex gap:lg">
                {[['Tilt','60%'],['Depth','40%'],['Light','75%'],['Shine','30%']].map(([label, pct]) => (
                  <div key={label} className="display:flex flex-dir:col align-yi:center gap:sm">
                    <div className="knob animate-breathe" style={{ '--pct': pct }}>
                      <div className="knob-inner" />
                    </div>
                    <span className="type-face:mono ink:neutral-700" style={{ fontSize: 8 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="display:flex flex-dir:col gap:px scroll-stagger-up">
            {[
              { num: '01', title: 'Hover Inspect', desc: 'Hover any element — see all Mizumi classes, tokens, raw CSS.', s: 'live' },
              { num: '02', title: 'Live Edit', desc: 'Add, remove, swap classes directly. Reflects instantly.', s: 'live' },
              { num: '03', title: 'Dimension HUD', desc: 'Rotary knobs — tilt, rest angle, perspective, shine.', s: 'live' },
              { num: '04', title: 'Light Simulator', desc: 'Drag the sun to change shadow direction across all depth elements.', s: 'live' },
              { num: '05', title: 'DOM → Source', desc: 'Edits write back to your JSX via Vite HMR.', s: 'soon' },
            ].map(({ num, title, desc, s }) => (
              <div key={title}
                   className="pad:xl stroke-style:solid stroke-width:thin stroke-color:neutral-900
                               hover-lift active-press display:flex flex-dir:col gap:md">
                <div className="display:flex align-yi:center align-x:between">
                  <span className="type-face:mono text:xs ink:neutral-700">{num}</span>
                  <span className={`badge badge-${s === 'live' ? 'success' : 'neutral'} text:2xs`}>{s}</span>
                </div>
                <span className="type-face:serif ink:white type-weight:thin mz-card-title-sm">{title}</span>
                <p className="type-face:mono text:xs ink:neutral-600 leading:relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 07 — INSTALL ────────────────────────────────────────────────────
function SectionInstall() {
  const pkgs = [
    { num: '01', name: '@mizumi25/core', role: 'Required', cmd: 'npm install @mizumi25/core', desc: 'Token engine · class resolver · pattern expander · CSS generator', badge: 'badge-primary' },
    { num: '02', name: '@mizumi25/gsap', role: 'Required', cmd: 'npm install @mizumi25/gsap', desc: '800+ animations · ScrollTrigger · gesture engine · loop system', badge: 'badge-secondary' },
    { num: '03', name: '@mizumi25/depth', role: 'Recommended', cmd: 'npm install @mizumi25/depth', desc: '6-layer depth engine · dimension tilt · light simulation · z-map', badge: 'badge-success' },
    { num: '04', name: '@mizumi25/vite-plugin', role: 'Recommended', cmd: 'npm install @mizumi25/vite-plugin', desc: 'Vite integration · hot reload · DevTools HUD · class scanner', badge: 'badge-success' },
    { num: '05', name: '@mizumi25/cli', role: 'Optional', cmd: 'npm install @mizumi25/cli', desc: 'CLI — sync tokens · watch files · generate documentation', badge: 'badge-neutral' },
    { num: '06', name: '@mizumi25/postcss-plugin', role: 'Optional', cmd: 'npm install @mizumi25/postcss-plugin', desc: 'PostCSS integration · .mizu files · non-Vite projects', badge: 'badge-neutral' },
  ]

  return (
    <section className="pad-y:4xl pad-x:2xl pos:relative overflow:hidden">
      <div className="pos:absolute pos-top:0 pos-right:0 events:none select:none
                      scroll-scrub{from:opacity_0.05_x_200,to:opacity_0_x_0,scrub:1}">
        <span className="type-face:mono ink:neutral-900 mz-section-num">07</span>
      </div>

      <div className="canvas-w-max:960px mar-x:auto pos:relative layer:base">
        <div className="scroll-slide-up mar-bottom:4xl">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper display:block mar-bottom:xl">
            07 / Installation
          </span>
          <h2 className="type-face:serif ink:white type-weight:thin leading:tight mz-section-h2">
            Install what<br />
            <em className="ink:neutral-700 type-style:italic">you need.</em>
          </h2>
          <p className="type-face:mono text:xs ink:neutral-600 leading:relaxed canvas-w-max:44ch mar-top:xl">
            Each package is fully independent. Start with core + gsap. Add as needed.
          </p>
        </div>

        <div className="display:flex flex-dir:col gap:px scroll-stagger-up">
          {pkgs.map(({ num, name, role, cmd, desc, badge }) => (
            <div key={name}
                 className="display:flex align-yi:center gap:xl pad:xl
                             stroke-style:solid stroke-width:thin stroke-color:neutral-900
                             hover-lift active-press">
              <span className="type-face:mono ink:neutral-800 text:xs" style={{ width: 32, flexShrink: 0 }}>{num}</span>
              <div className="display:flex flex-dir:col gap:sm" style={{ width: 200, flexShrink: 0 }}>
                <code className="type-face:mono text:sm ink:white">{name}</code>
                <span className={`badge ${badge} display:flex-inline`} style={{ alignSelf: 'flex-start' }}>{role}</span>
              </div>
              <span className="type-face:mono text:xs ink:neutral-500 leading:relaxed" style={{ flex: 1 }}>{desc}</span>
              <div className="pad-x:md pad-y:sm paint:neutral-950
                               stroke-style:solid stroke-width:thin stroke-color:neutral-800"
                   style={{ flexShrink: 0 }}>
                <code className="type-face:mono text:xs ink:primary wrap:no">{cmd}</code>
              </div>
            </div>
          ))}
        </div>

        {/* Quick start */}
        <div className="mar-top:4xl scroll-scale-in display:flex flex-dir:col gap:md">
          <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper">Quick Start</span>
          <div className="pad:xl paint:neutral-950 stroke-style:solid stroke-width:thin stroke-color:neutral-800">
            <div className="display:flex gap:sm mar-bottom:md">
              <div className="canvas-w:3 canvas-h:3 curve:full paint:error" />
              <div className="canvas-w:3 canvas-h:3 curve:full paint:warning" />
              <div className="canvas-w:3 canvas-h:3 curve:full paint:success" />
            </div>
            <div className="display:flex flex-dir:col gap:sm">
              <div className="type-face:mono text:xs">
                <span className="ink:neutral-500">import </span>
                <span className="ink:primary">mizumi</span>
                <span className="ink:neutral-500"> from </span>
                <span className="ink:success">'@mizumi25/vite-plugin'</span>
              </div>
              <div className="type-face:mono text:xs">
                <span className="ink:neutral-500">import </span>
                <span className="ink:neutral-400">{'{ '}</span>
                <span className="ink:primary">gsap</span>
                <span className="ink:neutral-400">{' }'}</span>
                <span className="ink:neutral-500"> from </span>
                <span className="ink:success">'gsap'</span>
              </div>
              <div className="type-face:mono text:xs">
                <span className="ink:neutral-500">import </span>
                <span className="ink:success">'../.mizumi/mizumi.css'</span>
              </div>
              <div className="type-face:mono text:xs mar-top:sm">
                <span className="ink:primary">window</span>
                <span className="ink:neutral-500">.gsap = gsap</span>
              </div>
              <div className="type-face:mono text:xs">
                <span className="ink:neutral-500">import</span>
                <span className="ink:neutral-400">{'('}</span>
                <span className="ink:success">'../.mizumi/mizumi-runtime.js'</span>
                <span className="ink:neutral-400">{')'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── OUTRO ────────────────────────────────────────────────────────────────────
function Outro() {
  return (
    <section className="canvas-w:full canvas-h:screen pos:relative overflow:hidden
                        display:flex flex-dir:col align-x:center align-yi:center">
      <div className="pos:absolute pos-top:0 pos-left:0 canvas-w:full canvas-h:full
                      display:flex align-yi:center align-x:center events:none select:none
                      scroll-scrub{from:y_200_opacity_0,to:y_0_opacity_0.04,scrub:1.5}">
        <span className="type-face:serif ink:white type-weight:thin mz-outro-kanji">始</span>
      </div>

      <div className="pos:absolute pos-top:25% pos-left:50% events:none
                      canvas-w:64 canvas-h:64 curve:full paint:error animate-breathe"
           style={{ transform: 'translateX(-50%)', opacity: 0.05 }} />

      <div className="pos:relative layer:base text-align:center
                      display:flex flex-dir:col align-yi:center gap:2xl pad-x:2xl
                      scroll-stagger-up">
        <span className="type-face:mono text:xs ink:neutral-700 tracking:widest text-case:upper">Begin.</span>
        <h2 className="type-face:serif ink:white type-weight:thin leading:none mz-outro-h2">mizumi.</h2>
        <p className="type-face:mono text:sm ink:neutral-600 leading:relaxed canvas-w-max:42ch">
          Japanese aesthetic precision for modern web development.
          Token-first. Motion-native. Spatially aware.
        </p>
        <div className="display:flex gap:md align-yi:center">
          <button className="btn-ghost-white btn-xl curve:full hover-lift hover-glow active-press">
            Get Started →
          </button>
          <button className="btn-text ink:neutral-600 text:sm hover-float active-press">Read Docs</button>
        </div>
        <div className="pad:lg stroke-style:solid stroke-width:thin stroke-color:neutral-900
                         display:flex align-yi:center gap:md animate-pulse-sm">
          <code className="type-face:mono text:sm ink:primary">npm install @mizumi25/core @mizumi25/gsap</code>
        </div>
        <div className="display:flex align-yi:center gap:sm">
          <div className="canvas-w:8 canvas-h:px paint:neutral-900" />
          <span className="type-face:mono ink:neutral-800" style={{ fontSize: 8 }}>MIT · Made with 間</span>
          <div className="canvas-w:8 canvas-h:px paint:neutral-900" />
        </div>
      </div>
    </section>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@100;200;300;400&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #060606; color: #fff; overflow-x: hidden; }
        html { scroll-behavior: smooth; }
        body::-webkit-scrollbar { width: 2px; }
        body::-webkit-scrollbar-thumb { background: #ef4444; }

        .type-face\\:serif { font-family: 'Noto Serif JP', serif !important; }
        .type-face\\:mono  { font-family: 'DM Mono', monospace !important; }

        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-33.333%) } }
        .mz-marquee { animation: marquee 40s linear infinite; }
        .mz-marquee-item { font-size: 0.85rem; }

        /* Hero scale */
        .mz-hero-kanji { font-size: 85vw; line-height: 0.9; display: block; }
        .mz-hero-h1 { font-size: clamp(4rem, 14vw, 14rem); }

        /* Section scale */
        .mz-section-num { font-size: clamp(20rem, 40vw, 40vw); line-height: 1; display: block; }
        .mz-section-h2 { font-size: clamp(3rem, 8vw, 8rem); }
        .mz-card-title { font-size: clamp(1.5rem, 3vw, 3rem); }
        .mz-card-title-sm { font-size: clamp(1.25rem, 2vw, 2rem); }
        .mz-outro-kanji { font-size: 90vw; line-height: 1; display: block; }
        .mz-outro-h2 { font-size: clamp(5rem, 15vw, 15rem); }

        /* Layout helpers */
        .mz-grid-asymm { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1px; }
        .mz-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }
        .mz-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        .mz-grid-6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1px; }
        .mz-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; }
        .mz-grid-devtools { display: grid; grid-template-columns: 3fr 2fr; gap: 24px; }
        .mz-code-w { width: 280px; flex-shrink: 0; }

        /* Color swatch grid */
        .mz-color-row { gap: 1px; }
        .mz-color-block { width: calc(8.333% - 1px); min-width: 60px; aspect-ratio: 1; padding: 12px; display: flex; align-items: flex-end; }
        .mz-color-label { font-size: 8px; writing-mode: vertical-lr; transform: rotate(180deg); opacity: 0.6; white-space: nowrap; }

        /* Knob */
        .knob { width: 52px; height: 52px; border-radius: 50%; background: conic-gradient(#ef4444 var(--pct, 60%), #1a1a1a 0); display: flex; align-items: center; justify-content: center; }
        .knob-inner { width: 38px; height: 38px; border-radius: 50%; background: #0a0a0a; }

        /* Separator lines between sections */
        section { border-bottom: 1px solid #111; }
      `}</style>

      <Nav />

      <Hero />

      <Marquee items={[
        'Tokens','Patterns','Animations','Depth','Utilities','DevTools',
        'ScrollTrigger','Dimension','Stagger','Gesture','Loop','Scrub',
      ]} />

      <SectionTokens />

      <Marquee items={[
        'card','hover-lift','scroll-fade-in','animate-float','dimension',
        'stagger-children-100','glass-blur:glass','btn-primary','badge-success','scroll-scrub',
      ]} dim />

      <SectionPatterns />
      <SectionAnimations />

      <Marquee items={[
        '800+ Animations','400+ Patterns','2000+ Utilities','6-Layer Depth',
        'GSAP Runtime','Zero JavaScript','Pure className','MIT License',
      ]} />

      <SectionDepth />
      <SectionUtilities />
      <SectionDevTools />

      <Marquee items={[
        '@mizumi25/core','@mizumi25/gsap','@mizumi25/depth',
        '@mizumi25/vite-plugin','@mizumi25/cli','@mizumi25/postcss-plugin',
      ]} dim />

      <SectionInstall />
      <Outro />
    </>
  )
}