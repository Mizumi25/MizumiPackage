import React, { useState, useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// MIZUMI SHOWCASE — Full Feature Demo
// Aesthetic: Japanese Minimalism × Apple Precision × Spatial Depth
// For 60-second intro video — all sections scripted
// ─────────────────────────────────────────────────────────────────────────────

// Inline styles for things that need actual CSS (animations, keyframes)
// Everything else uses Mizumi classes
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;400;700&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Outfit:wght@200;400;600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:     #0a0a0a;
    --paper:   #f5f2ed;
    --washi:   #ede8e0;
    --vermil:  #c94030;
    --gold:    #c9a96e;
    --mist:    #8a8a8a;
    --void:    #070707;
    --sakura:  #e8b4b8;
    --bamboo:  #4a6741;
    --indigo:  #2b3a6b;
    font-family: 'Outfit', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--paper); color: var(--ink); overflow-x: hidden; }
  body::-webkit-scrollbar { width: 3px; }
  body::-webkit-scrollbar-thumb { background: var(--gold); }

  .serif { font-family: 'Noto Serif JP', serif; }
  .mono  { font-family: 'DM Mono', monospace; }

  /* ── Section base ── */
  .section { min-height: 100vh; padding: 80px 40px; position: relative; }
  .section-dark { background: var(--void); color: #f0ece6; }
  .section-washi { background: var(--washi); }
  .section-ink { background: var(--ink); color: var(--paper); }

  /* ── Animated elements ── */
  @keyframes float     { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-12px)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes ripple    { 0%{transform:scale(0);opacity:1} 100%{transform:scale(4);opacity:0} }
  @keyframes spin      { to{transform:rotate(360deg)} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes sway      { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
  @keyframes breathe   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes slideIn   { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes countUp   { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
  @keyframes pulse3d   { 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0.5)} 50%{box-shadow:0 0 0 20px rgba(201,169,110,0)} }

  .animate-float    { animation: float 3s ease-in-out infinite; }
  .animate-fadeUp   { animation: fadeUp 0.7s ease-out forwards; }
  .animate-shimmer  { background: linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); background-size:200% 100%; animation: shimmer 2s infinite; }
  .animate-sway     { animation: sway 4s ease-in-out infinite; }
  .animate-breathe  { animation: breathe 3s ease-in-out infinite; }
  .animate-pulse3d  { animation: pulse3d 2s ease-in-out infinite; }
  .animate-gradShift { background-size:300% 300%; animation: gradShift 6s ease infinite; }
  .animate-spin     { animation: spin 2s linear infinite; }
  .animate-blink    { animation: blink 1s step-end infinite; }
  .cursor-blink::after { content:'|'; animation: blink 1s step-end infinite; }

  /* ── Grid layouts ── */
  .grid-showcase  { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:24px; }
  .grid-2         { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  .grid-3         { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  .grid-asymm     { display:grid; grid-template-columns:2fr 1fr; gap:32px; }

  /* ── Mizumi card base ── */
  .mz-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); position: relative; overflow: hidden; }
  .mz-card-dark { background: #111; border: 1px solid #2a2823; border-radius: 16px; padding: 24px; }
  .mz-card-glass { background: rgba(255,255,255,0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.5); border-radius: 20px; padding: 24px; }

  /* ── Japanese decorative elements ── */
  .jp-circle { border-radius: 50%; }
  .jp-sun { width: 120px; height: 120px; background: var(--vermil); border-radius: 50%; }
  .jp-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); margin: 40px 0; }
  .jp-kanji { font-family: 'Noto Serif JP', serif; font-weight: 200; color: rgba(0,0,0,0.08); position: absolute; font-size: 200px; line-height: 1; user-select: none; pointer-events: none; }

  /* ── Code chip ── */
  .code-chip { background: #1a1a1a; color: var(--gold); font-family: 'DM Mono', monospace; font-size: 11px; padding: 3px 8px; border-radius: 4px; display: inline-block; }
  .code-block { background: #0d0d0d; border: 1px solid #2a2823; border-radius: 12px; padding: 20px 24px; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.8; overflow-x: auto; }

  /* ── Badges ── */
  .badge-new { background: var(--vermil); color: white; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; }
  .badge-gold { background: rgba(201,169,110,0.15); color: var(--gold); border: 1px solid rgba(201,169,110,0.3); font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 20px; }

  /* ── Depth visual elements ── */
  .depth-card { perspective: 800px; }
  .depth-inner { transform: rotateX(8deg) rotateY(-6deg); transform-style: preserve-3d; transition: transform 0.4s ease; box-shadow: 20px 20px 60px rgba(0,0,0,0.3), -5px -5px 20px rgba(255,255,255,0.05); }
  .depth-card:hover .depth-inner { transform: rotateX(0deg) rotateY(0deg); }

  /* ── Pattern backgrounds ── */
  .pattern-dots { background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px); background-size: 20px 20px; }
  .pattern-grid { background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 32px 32px; }
  .pattern-jp { background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(201,169,110,0.05) 10px, rgba(201,169,110,0.05) 20px); }

  /* ── Knob visual ── */
  .knob { width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(var(--gold) var(--pct, 60%), #2a2823 0); display: flex; align-items: center; justify-content: center; }
  .knob-inner { width: 44px; height: 44px; border-radius: 50%; background: #141310; }

  /* ── Video overlay ── */
  .video-section { position: relative; z-index: 1; }
  .noise { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; opacity: 0.02; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

  /* ── Marquee ── */
  .marquee-track { display: flex; gap: 60px; white-space: nowrap; animation: marquee 20s linear infinite; }

  /* ── Sun gradient hero ── */
  .hero-gradient { background: radial-gradient(ellipse 80% 60% at 50% 70%, rgba(201,100,60,0.15) 0%, transparent 70%), linear-gradient(180deg, #f5f2ed 0%, #ede8e0 100%); }

  /* ── Spatial layer visual ── */
  .layer-stack { position: relative; height: 200px; }
  .layer-item { position: absolute; border-radius: 12px; transition: all 0.3s; }

  /* ── Token grid ── */
  .token-swatch { width: 40px; height: 40px; border-radius: 8px; cursor: pointer; transition: transform 0.2s; }
  .token-swatch:hover { transform: scale(1.2); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .grid-2, .grid-3, .grid-asymm { grid-template-columns: 1fr; }
    .grid-showcase { grid-template-columns: 1fr; }
    .jp-kanji { font-size: 100px; }
    .section { padding: 60px 20px; }
  }

  /* ── Scroll fade in ── */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }
`

// ─── Reveal hook ─────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ─── Type writer ─────────────────────────────────────────────────────────────
function TypeWriter({ words, speed = 80 }) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1500)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx(i => (i + 1) % words.length)
          setCharIdx(0)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timer)
  }, [text, charIdx, deleting, wordIdx, words, speed])

  return <span className="cursor-blink">{text}</span>
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '14px 40px',
      background: scrolled ? 'rgba(245,242,237,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>🌸</span>
        <span style={{ fontWeight: 700, letterSpacing: '0.1em', fontSize: 14, textTransform: 'uppercase' }}>Mizumi</span>
        <span className="badge-gold" style={{ marginLeft: 4 }}>CSS</span>
      </div>
      <div style={{ display: 'flex', gap: 32, fontSize: 13, color: 'var(--mist)' }}>
        {['Tokens', 'Patterns', 'Animations', 'Spatial', 'Depth'].map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--ink)'}
            onMouseLeave={e => e.target.style.color = 'var(--mist)'}>{n}</a>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span className="code-chip">npm i mizumi</span>
        <button style={{
          background: 'var(--ink)', color: 'var(--paper)', border: 'none',
          borderRadius: 8, padding: '8px 18px', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', letterSpacing: '0.05em',
        }}>Docs →</button>
      </div>
    </nav>
  )
}

// ─── 01 HERO ─────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="section hero-gradient" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 140, position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background kanji */}
      <div className="jp-kanji" style={{ top: -20, right: -20, opacity: 0.04, fontSize: 320 }}>美</div>
      <div className="jp-kanji" style={{ bottom: 40, left: -40, opacity: 0.03, fontSize: 200 }}>水</div>

      {/* Floating orbs */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,64,48,0.12), transparent 70%)', top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      <div className="animate-float" style={{ position: 'absolute', width: 180, height: 180, background: 'var(--vermil)', borderRadius: '50%', opacity: 0.85, top: '12%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ height: 1, width: 40, background: 'var(--gold)' }} />
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>CSS Framework v2</span>
          <div style={{ height: 1, width: 40, background: 'var(--gold)' }} />
        </div>

        {/* Main heading */}
        <h1 className="serif" style={{ fontSize: 'clamp(48px,8vw,88px)', fontWeight: 200, lineHeight: 1.1, marginBottom: 8, color: 'var(--ink)' }}>
          美しい<br/>
          <span style={{ fontWeight: 700 }}>Mizumi</span>
        </h1>
        <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: 'var(--mist)', maxWidth: 500, margin: '20px auto 40px', lineHeight: 1.7 }}>
          A spatial CSS framework built for depth, beauty, and precision. <TypeWriter words={['Zero runtime.', 'Full expressiveness.', 'Japanese aesthetics.', 'Spatial layers.']} />
        </p>

        {/* Install command */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.06)', borderRadius: 12, padding: '12px 20px', marginBottom: 40, border: '1px solid rgba(0,0,0,0.08)' }}>
          <span className="mono" style={{ fontSize: 14, color: 'var(--ink)' }}>$ npm install mizumi</span>
          <button style={{ background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Mono' }}>copy</button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { n: '2000+', l: 'Tokens' },
            { n: '400+',  l: 'Patterns' },
            { n: '800+',  l: 'Animations' },
            { n: '6',     l: 'Depth Layers' },
          ].map(({ n, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)' }}>{n}</div>
              <div style={{ fontSize: 11, color: 'var(--mist)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase' }} className="mono">Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--mist), transparent)' }} />
      </div>
    </section>
  )
}

// ─── 02 INSTALL / SETUP ──────────────────────────────────────────────────────
function InstallSection() {
  const steps = [
    { step: '01', title: 'Install', code: 'npm install mizumi', desc: 'Add Mizumi to your project' },
    { step: '02', title: 'Configure', code: 'mizumi.config.js', desc: 'Set your tokens and rules' },
    { step: '03', title: 'Import', code: "@import '.mizumi/mizumi.css'", desc: 'Add the generated CSS' },
    { step: '04', title: 'Build', code: 'vite build', desc: 'Zero runtime, pure CSS output' },
  ]

  return (
    <section className="section section-dark" id="install" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="jp-kanji" style={{ bottom: -80, right: -40, color: 'rgba(255,255,255,0.02)', fontSize: 400 }}>道</div>

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 60 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Getting Started</span>
          <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 12, color: '#f0ece6' }}>
            Up and running<br/><em>in four steps</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 24 }}>
          {steps.map(({ step, title, code, desc }, i) => (
            <div key={step} className={`mz-card-dark reveal reveal-delay-${i + 1}`} style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(201,169,110,0.08)', fontFamily: 'DM Mono', lineHeight: 1, marginBottom: 16 }}>{step}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0ece6', marginBottom: 8 }}>{title}</h3>
              <div className="code-chip" style={{ marginBottom: 12, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>{code}</div>
              <p style={{ fontSize: 12, color: 'var(--mist)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Full config snippet */}
        <div className="reveal" style={{ marginTop: 48 }}>
          <div className="code-block" style={{ color: '#f0ece6' }}>
            <div style={{ color: 'var(--gold)', marginBottom: 8 }}>// mizumi.config.js — partial depth config to add</div>
            <div style={{ color: '#7a9e7a' }}>export default {'{'}</div>
            <div style={{ paddingLeft: 20, color: '#f0ece6' }}>depth: {'{'}</div>
            <div style={{ paddingLeft: 40, color: '#7a9e7a' }}>layers: <span style={{ color: '#c9a96e' }}>6</span>,</div>
            <div style={{ paddingLeft: 40, color: '#7a9e7a' }}>perspective: <span style={{ color: '#c9a96e' }}>1000</span>,</div>
            <div style={{ paddingLeft: 40, color: '#7a9e7a' }}>strength: <span style={{ color: '#c9a96e' }}>0.4</span>,</div>
            <div style={{ paddingLeft: 40, color: '#7a9e7a' }}>light: {'{'} x: <span style={{ color: '#c9a96e' }}>0</span>, y: <span style={{ color: '#c9a96e' }}>-1</span> {'}'},</div>
            <div style={{ paddingLeft: 40, color: '#7a9e7a' }}>dimension: {'{'}</div>
            <div style={{ paddingLeft: 60, color: '#7a9e7a' }}>tiltStrength: <span style={{ color: '#c9a96e' }}>15</span>,</div>
            <div style={{ paddingLeft: 60, color: '#7a9e7a' }}>perspective:  <span style={{ color: '#c9a96e' }}>800</span>,</div>
            <div style={{ paddingLeft: 60, color: '#7a9e7a' }}>shine:        <span style={{ color: '#c9a96e' }}>true</span>,</div>
            <div style={{ paddingLeft: 60, color: '#7a9e7a' }}>parallaxLayers: <span style={{ color: '#c9a96e' }}>true</span>,</div>
            <div style={{ paddingLeft: 40, color: '#7a9e7a' }}>{'}'}</div>
            <div style={{ paddingLeft: 20, color: '#f0ece6' }}>{'}'}</div>
            <div style={{ color: '#7a9e7a' }}>{'}'};</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 03 TOKENS ───────────────────────────────────────────────────────────────
function TokensSection() {
  const [activeFamily, setActiveFamily] = useState('colors')
  const [copied, setCopied] = useState(null)

  const copy = (text) => {
    navigator.clipboard?.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 1500)
  }

  const colorPalette = [
    { name: 'primary',   shades: ['#DBEAFE','#93C5FD','#3B82F6','#2563EB','#1E3A8A'] },
    { name: 'secondary', shades: ['#EDE9FE','#C4B5FD','#8B5CF6','#7C3AED','#4C1D95'] },
    { name: 'accent',    shades: ['#FAE8FF','#F0ABFC','#D946EF','#A21CAF','#701A75'] },
    { name: 'success',   shades: ['#D1FAE5','#6EE7B7','#10B981','#059669','#064E3B'] },
    { name: 'error',     shades: ['#FEE2E2','#FCA5A5','#EF4444','#DC2626','#7F1D1D'] },
    { name: 'warning',   shades: ['#FEF3C7','#FCD34D','#F59E0B','#D97706','#78350F'] },
    { name: 'neutral',   shades: ['#F9FAFB','#E5E7EB','#9CA3AF','#4B5563','#111827'] },
    { name: 'slate',     shades: ['#F8FAFC','#CBD5E1','#64748B','#334155','#0F172A'] },
  ]

  const spacingTokens = ['xs:4px', 'sm:8px', 'md:16px', 'lg:24px', 'xl:32px', '2xl:48px', '3xl:64px', '4xl:96px']
  const radiusTokens  = ['none:0', 'xs:2px', 'sm:4px', 'md:8px', 'lg:12px', 'xl:16px', 'full:9999px']
  const shadowTokens  = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'primary', 'glow-md']

  return (
    <section className="section section-washi" id="tokens">
      <div className="jp-kanji" style={{ top: '10%', right: -20, opacity: 0.04 }}>色</div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Design Tokens</span>
            <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 8 }}>
              2000+ tokens,<br/><em>infinite expression</em>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['colors','spacing','radius','shadows'].map(f => (
              <button key={f} onClick={() => setActiveFamily(f)} style={{
                background: activeFamily === f ? 'var(--ink)' : 'transparent',
                color: activeFamily === f ? 'var(--paper)' : 'var(--mist)',
                border: '1px solid', borderColor: activeFamily === f ? 'var(--ink)' : 'rgba(0,0,0,0.15)',
                borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Colors */}
        {activeFamily === 'colors' && (
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {colorPalette.map(({ name, shades }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono" style={{ fontSize: 11, width: 70, color: 'var(--mist)', textAlign: 'right' }}>{name}</span>
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                  {shades.map((color, i) => (
                    <div key={i} className="token-swatch" style={{ background: color, flex: 1, height: 44, borderRadius: 6, cursor: 'pointer' }}
                      title={color} onClick={() => copy(`paint:${name}-${[50,200,500,600,900][i]}`)} />
                  ))}
                </div>
              </div>
            ))}
            {copied && (
              <div style={{ position: 'fixed', bottom: 80, right: 40, background: 'var(--ink)', color: 'var(--paper)', padding: '8px 16px', borderRadius: 8, fontSize: 12 }}>
                Copied: {copied}
              </div>
            )}
            <p className="mono" style={{ fontSize: 11, color: 'var(--mist)', marginTop: 8 }}>Click any swatch to copy the Mizumi class</p>
          </div>
        )}

        {/* Spacing */}
        {activeFamily === 'spacing' && (
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {spacingTokens.map(t => {
              const [key, val] = t.split(':')
              const px = parseInt(val)
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span className="mono" style={{ fontSize: 12, width: 80, color: 'var(--mist)' }}>pad:{key}</span>
                  <div style={{ height: 20, background: 'var(--vermil)', borderRadius: 4, opacity: 0.7, width: Math.min(px * 3, 400) }} />
                  <span className="mono" style={{ fontSize: 11, color: 'var(--mist)' }}>{val}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Radius */}
        {activeFamily === 'radius' && (
          <div className="reveal" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {radiusTokens.map(t => {
              const [key, val] = t.split(':')
              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 80, height: 80, background: 'var(--ink)', borderRadius: val === '9999px' ? 9999 : parseInt(val), opacity: 0.8 }} />
                  <span className="mono" style={{ fontSize: 10, color: 'var(--mist)' }}>curve:{key}</span>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--gold)' }}>{val}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Shadows */}
        {activeFamily === 'shadows' && (
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 24 }}>
            {shadowTokens.map(s => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 100, height: 100, background: 'white', borderRadius: 12,
                  boxShadow: s === 'xs' ? '0 1px 2px rgba(0,0,0,0.04)' :
                             s === 'sm' ? '0 1px 3px rgba(0,0,0,0.06)' :
                             s === 'md' ? '0 4px 6px rgba(0,0,0,0.07)' :
                             s === 'lg' ? '0 10px 15px rgba(0,0,0,0.08)' :
                             s === 'xl' ? '0 20px 25px rgba(0,0,0,0.08)' :
                             s === '2xl' ? '0 25px 50px rgba(0,0,0,0.15)' :
                             s === 'primary' ? '0 4px 14px rgba(59,130,246,0.35)' :
                             '0 0 20px rgba(59,130,246,0.4)',
                }} />
                <span className="mono" style={{ fontSize: 10, color: 'var(--mist)' }}>cast:{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Arbitrary values callout */}
        <div className="reveal" style={{ marginTop: 48, background: 'rgba(0,0,0,0.04)', borderRadius: 12, padding: 24, border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="badge-new">Arbitrary</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Any CSS value, inline</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              'canvas-w:{320px}',
              'paint:{#c94030}',
              'pad:{12px_24px}',
              'cast:{0_4px_20px_rgba(0,0,0,0.2)}',
              'curve:{20px_0}',
              'text:{15px}',
            ].map(c => <span key={c} className="code-chip">{c}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 04 PATTERNS ─────────────────────────────────────────────────────────────
function PatternsSection() {
  const cards = [
    { cls: 'card', label: 'card', bg: 'white', preview: <div style={{ height: 100, background: '#f5f2ed', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mist)', fontSize: 12 }}>card content</div> },
    { cls: 'flex-center', label: 'flex-center', bg: '#f0f9ff', preview: <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dbeafe', borderRadius: 8 }}><span style={{ fontSize: 11, color: '#1d4ed8' }}>centered</span></div> },
    { cls: 'btn-primary', label: 'btn-primary', bg: 'white', preview: <button style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Button</button> },
    { cls: 'badge-success', label: 'badge', bg: 'white', preview: <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>Active</span> },
    { cls: 'nav-bar', label: 'nav-bar', bg: 'white', preview: <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 44, paddingInline: 12, background: '#f5f2ed', borderRadius: 8 }}><span style={{ fontWeight: 700, fontSize: 12 }}>Brand</span><div style={{ display: 'flex', gap: 12 }}>{['Link','Link','Link'].map((l,i) => <span key={i} style={{ fontSize: 11, color: 'var(--mist)' }}>{l}</span>)}</div></div> },
    { cls: 'glass', label: 'glass', bg: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', preview: <div style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>Glass Effect</span></div> },
    { cls: 'modal', label: 'modal', bg: 'white', preview: <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 16px' }}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Modal Title</div><div style={{ fontSize: 11, color: 'var(--mist)' }}>Modal content goes here.</div></div> },
    { cls: 'hero', label: 'hero', bg: 'var(--washi)', preview: <div style={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--washi)', borderRadius: 8, gap: 4 }}><span style={{ fontWeight: 700, fontSize: 13 }}>Hero Title</span><span style={{ fontSize: 11, color: 'var(--mist)' }}>Subtitle text here</span></div> },
  ]

  return (
    <section className="section" id="patterns" style={{ background: 'white' }}>
      <div className="jp-kanji" style={{ top: '20%', left: -60, opacity: 0.03 }}>形</div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Patterns</span>
          <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 8 }}>
            400+ ready patterns,<br/><em>zero boilerplate</em>
          </h2>
          <p style={{ color: 'var(--mist)', fontSize: 14, marginTop: 12, maxWidth: 480 }}>Complete UI compositions expressed as single class names. Layouts, cards, navigation, modals — all one class.</p>
        </div>

        <div className="grid-showcase">
          {cards.map(({ cls, label, bg, preview }, i) => (
            <div key={cls} className={`mz-card reveal reveal-delay-${(i % 4) + 1}`} style={{ background: 'white' }}>
              <div style={{ background: bg, borderRadius: 10, padding: 20, marginBottom: 16, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {preview}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                <span className="code-chip">.{cls}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee of pattern names */}
        <div className="reveal" style={{ marginTop: 48, overflow: 'hidden', padding: '16px 0', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="marquee-track">
            {['card', 'btn-primary', 'flex-center', 'nav-bar', 'hero', 'modal', 'glass', 'badge', 'tooltip', 'sidebar', 'drawer', 'overlay', 'breadcrumb', 'tab-list', 'table', 'divider', 'alert', 'toast', 'skeleton', 'avatar', 'card', 'btn-primary', 'flex-center', 'nav-bar', 'hero', 'modal', 'glass', 'badge', 'tooltip', 'sidebar'].map((p, i) => (
              <span key={i} className="mono" style={{ fontSize: 12, color: 'var(--mist)', whiteSpace: 'nowrap' }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 05 ANIMATIONS ───────────────────────────────────────────────────────────
function AnimationsSection() {
  const [active, setActive] = useState(null)
  const [playing, setPlaying] = useState({})

  const triggerAnim = (name) => {
    setPlaying(p => ({ ...p, [name]: true }))
    setTimeout(() => setPlaying(p => ({ ...p, [name]: false })), 1000)
  }

  const anims = [
    { name: 'animate-fade-in-up',  label: 'Fade Up',    keyframe: 'fadeUp',  color: '#3b82f6' },
    { name: 'animate-scale-in',    label: 'Scale In',   keyframe: 'countUp', color: '#8b5cf6' },
    { name: 'animate-slide-up',    label: 'Slide Up',   keyframe: 'slideIn', color: '#10b981' },
    { name: 'animate-float',       label: 'Float',      keyframe: 'float',   color: '#f59e0b', loop: true },
    { name: 'animate-breathe',     label: 'Breathe',    keyframe: 'breathe', color: '#ec4899', loop: true },
    { name: 'animate-shimmer',     label: 'Shimmer',    keyframe: 'shimmer', color: '#6366f1', loop: true },
    { name: 'hover-lift',          label: 'Hover Lift', keyframe: null,      color: '#14b8a6', hover: true },
    { name: 'hover-scale',         label: 'Hover Scale',keyframe: null,      color: '#f97316', hover: true },
    { name: 'scroll-fade-up',      label: 'Scroll Fade',keyframe: 'fadeUp',  color: '#0ea5e9' },
    { name: 'stagger-up',          label: 'Stagger',    keyframe: 'fadeUp',  color: '#a855f7' },
    { name: 'animate-pulse',       label: 'Pulse',      keyframe: 'pulse3d', color: '#ef4444', loop: true },
    { name: 'animate-spin',        label: 'Spin',       keyframe: 'spin',    color: '#64748b', loop: true },
  ]

  const categories = [
    { label: 'Entrance', count: '50+', icon: '↑', color: '#3b82f6' },
    { label: 'Hover',    count: '30+', icon: '◎', color: '#8b5cf6' },
    { label: 'Scroll',   count: '40+', icon: '↕', color: '#10b981' },
    { label: 'Loop',     count: '20+', icon: '∞', color: '#f59e0b' },
    { label: 'Stagger',  count: '15+', icon: '≡', color: '#ec4899' },
    { label: 'Gesture',  count: '60+', icon: '✦', color: '#ef4444' },
    { label: 'Exit',     count: '15+', icon: '↓', color: '#64748b' },
    { label: 'Scroll Scrub', count: '10+', icon: '⊙', color: '#14b8a6' },
  ]

  return (
    <section className="section section-ink" id="animations">
      <div className="jp-kanji" style={{ top: '5%', right: -20, color: 'rgba(255,255,255,0.02)', fontSize: 350 }}>動</div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Animation Engine</span>
          <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 8, color: 'var(--paper)' }}>
            800+ GSAP animations,<br/><em>one class name</em>
          </h2>
        </div>

        {/* Category pills */}
        <div className="reveal" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          {categories.map(({ label, count, icon, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}15` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}>
              <span style={{ color, fontSize: 16 }}>{icon}</span>
              <span style={{ color: '#f0ece6', fontSize: 13, fontWeight: 500 }}>{label}</span>
              <span className="mono" style={{ color: 'var(--mist)', fontSize: 10 }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Live preview grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
          {anims.map(({ name, label, keyframe, color, loop, hover }) => (
            <div key={name} className="reveal"
              onClick={() => !loop && !hover && triggerAnim(name)}
              onMouseEnter={e => { if (hover) e.currentTarget.firstChild.style.transform = name === 'hover-lift' ? 'translateY(-8px)' : 'scale(1.08)' }}
              onMouseLeave={e => { if (hover) e.currentTarget.firstChild.style.transform = '' }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, cursor: loop || hover ? 'default' : 'pointer', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10, background: color, margin: '0 auto 12px',
                transition: 'transform 0.3s ease',
                animation: loop && keyframe ? `${keyframe} ${name === 'animate-spin' ? '2s linear' : name === 'animate-shimmer' ? '2s ease' : '3s ease-in-out'} infinite` : (playing[name] && keyframe ? `${keyframe} 0.7s ease-out` : 'none'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontSize: 18 }}>✦</span>
              </div>
              <div style={{ fontSize: 12, color: '#f0ece6', fontWeight: 500 }}>{label}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
              {!loop && !hover && (
                <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 9, color: 'var(--gold)', opacity: 0.6 }}>click</div>
              )}
            </div>
          ))}
        </div>

        {/* Code example */}
        <div className="reveal" style={{ marginTop: 48 }}>
          <div className="code-block" style={{ color: '#f0ece6' }}>
            <div style={{ color: 'var(--gold)', marginBottom: 8 }}>// JSX — animations as class names via GSAP engine</div>
            <div>{'<div className="'}<span style={{ color: '#a5f3fc' }}>animate-scale-in scroll-fade-up hover-lift active-press</span>{'">'}</div>
            <div style={{ paddingLeft: 20, color: 'var(--mist)' }}>{'Your content'}</div>
            <div>{'</div>'}</div>
            <br/>
            <div style={{ color: 'var(--gold)', marginBottom: 8 }}>// Stagger children automatically</div>
            <div>{'<ul className="'}<span style={{ color: '#a5f3fc' }}>stagger-up scroll-stagger-fade</span>{'">'}</div>
            <div style={{ paddingLeft: 20, color: 'var(--mist)' }}>{'<li>Item 1</li> <li>Item 2</li> <li>Item 3</li>'}</div>
            <div>{'</ul>'}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 06 SPATIAL LAYERS ───────────────────────────────────────────────────────
function SpatialSection() {
  const [activeLayer, setActiveLayer] = useState(2)

  const layers = [
    { id: 0, label: 'Base',    cls: 'layer:base',    z: 0,   color: '#e2e8f0', text: '#475569' },
    { id: 1, label: 'Float',   cls: 'layer:float',   z: 10,  color: '#dbeafe', text: '#1d4ed8' },
    { id: 2, label: 'Overlay', cls: 'layer:overlay', z: 15,  color: '#ede9fe', text: '#6d28d9' },
    { id: 3, label: 'Sticky',  cls: 'layer:sticky',  z: 20,  color: '#fce7f3', text: '#be185d' },
    { id: 4, label: 'Fixed',   cls: 'layer:fixed',   z: 30,  color: '#fef3c7', text: '#b45309' },
    { id: 5, label: 'Modal',   cls: 'layer:modal',   z: 100, color: '#d1fae5', text: '#065f46' },
    { id: 6, label: 'Popover', cls: 'layer:popover', z: 200, color: '#fee2e2', text: '#991b1b' },
    { id: 7, label: 'Crown',   cls: 'layer:crown',   z: 9999,color: '#fef9c3', text: '#713f12' },
  ]

  return (
    <section className="section section-washi" id="spatial">
      <div className="jp-kanji" style={{ bottom: '5%', left: -40, opacity: 0.04 }}>層</div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Spatial Layers</span>
          <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 8 }}>
            Z-space as a<br/><em>first-class design token</em>
          </h2>
          <p style={{ color: 'var(--mist)', fontSize: 14, marginTop: 12, maxWidth: 520 }}>
            No more z-index wars. Named semantic layers give you a spatial vocabulary — each layer knows its place in the stack.
          </p>
        </div>

        <div className="grid-asymm" style={{ alignItems: 'start' }}>
          {/* Layer stack visual */}
          <div className="reveal">
            <div style={{ position: 'relative', height: 480, perspective: 800 }}>
              {layers.map((layer, i) => (
                <div key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  style={{
                    position: 'absolute', left: 0, right: 0,
                    height: 52,
                    top: i * 56,
                    background: layer.color,
                    borderRadius: 10,
                    border: `2px solid ${activeLayer === layer.id ? layer.text : 'transparent'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 20px',
                    cursor: 'pointer',
                    transform: activeLayer === layer.id
                      ? `translateX(8px) translateZ(${(7 - i) * 4}px)`
                      : `translateZ(${(7 - i) * 2}px)`,
                    transition: 'all 0.3s ease',
                    boxShadow: activeLayer === layer.id ? `0 4px 20px ${layer.text}30` : '0 2px 8px rgba(0,0,0,0.06)',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: layer.text }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: layer.text }}>{layer.label}</span>
                    <span className="code-chip" style={{ background: layer.text, color: 'white', fontSize: 9 }}>{layer.cls}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: layer.text, opacity: 0.7 }}>z:{layer.z}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="reveal reveal-delay-2">
            {(() => {
              const layer = layers[activeLayer]
              return (
                <div className="mz-card" style={{ position: 'sticky', top: 100 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: layer.color, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: layer.text, fontWeight: 700 }}>L{activeLayer}</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{layer.label}</h3>
                  <p style={{ fontSize: 12, color: 'var(--mist)', marginBottom: 16, lineHeight: 1.6 }}>
                    z-index: <strong>{layer.z}</strong> — Use this layer for {layer.label === 'Crown' ? 'the absolute top of stack' : `${layer.label.toLowerCase()} UI elements`}.
                  </p>
                  <div className="code-block" style={{ fontSize: 11, marginBottom: 16 }}>
                    <span style={{ color: '#a5f3fc' }}>{layer.cls}</span><br/>
                    <span style={{ color: 'var(--mist)' }}>→ z-index: {layer.z};</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'DM Mono' }}>Also available</div>
                    {['base', 'raised', 'float', 'overlay', 'sticky', 'fixed', 'drawer', 'modal', 'popover', 'toast', 'tooltip', 'top', 'crown'].slice(0, 5).map(l => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span className="code-chip">layer:{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Arbitrary z */}
        <div className="reveal" style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="mz-card" style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Named semantic layers</h4>
              <span className="code-chip">layer:modal</span>
              <p style={{ fontSize: 11, color: 'var(--mist)', marginTop: 8 }}>Self-documenting intent</p>
            </div>
            <div className="mz-card" style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Numeric tokens</h4>
              <span className="code-chip">layer:100</span>
              <p style={{ fontSize: 11, color: 'var(--mist)', marginTop: 8 }}>Direct z-index values</p>
            </div>
            <div className="mz-card" style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Arbitrary values</h4>
              <span className="code-chip">layer:{'{450}'}</span>
              <p style={{ fontSize: 11, color: 'var(--mist)', marginTop: 8 }}>Escape hatch when needed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 07 DEPTH ENGINE ─────────────────────────────────────────────────────────
function DepthSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)
  const [sunPos, setSunPos] = useState({ x: 0.3, y: -0.6 })

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    const rx = ((e.clientY - cy) / (rect.height / 2)) * 12
    const ry = ((e.clientX - cx) / (rect.width  / 2)) * -12
    setTilt({ x: rx, y: ry })
  }

  return (
    <section className="section section-dark" id="depth" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="jp-kanji" style={{ bottom: -80, left: '30%', color: 'rgba(255,255,255,0.015)', fontSize: 500 }}>深</div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 60 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Depth Engine</span>
          <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 8, color: '#f0ece6' }}>
            6-layer spatial rendering,<br/><em>light-reactive shadows</em>
          </h2>
        </div>

        <div className="grid-2">
          {/* 3D card demo */}
          <div className="reveal">
            <h3 style={{ fontSize: 14, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }} className="mono">Dimension — 2.5D Tilt</h3>
            <div className="depth-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
              style={{ cursor: 'default' }}>
              <div ref={cardRef} className="depth-inner" style={{
                borderRadius: 20, overflow: 'hidden',
                transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: tilt.x === 0 ? 'transform 0.5s ease' : 'transform 0.1s ease',
                boxShadow: `${-tilt.y}px ${tilt.x + 20}px 60px rgba(0,0,0,0.5)`,
              }}>
                {/* Card with layers */}
                <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: 32, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 2}%, rgba(201,169,110,0.15), transparent 60%)` }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 14, background: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🌸</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>Mizumi Depth</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Hover me to see the tilt + shine + parallax layers working in real time.</div>
                    <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
                        <div style={{ height: '100%', width: '70%', borderRadius: 3, background: 'var(--gold)' }} />
                      </div>
                    </div>
                    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                      <span>.dimension</span><span>.dimension-layer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mono" style={{ fontSize: 11, color: 'var(--mist)', marginTop: 12 }}>Move mouse over card ↑ live tilt + shine + shadow</p>
          </div>

          {/* Depth layer system */}
          <div className="reveal reveal-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontSize: 14, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }} className="mono">6-Layer Z-Map</h3>

            {[0, 10, 20, 100, 200, 999].map((zVal, i) => {
              const layerDepth = [0, 1, 2, 3, 4, 5][i]
              const colors = ['#2a2823','#3a3830','#4a4840','#5a5850','#6a6860','#7a7870']
              return (
                <div key={zVal} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--mist)', width: 40 }}>z:{zVal}</span>
                  <div style={{
                    flex: 1, height: 36, background: colors[i], borderRadius: 8,
                    display: 'flex', alignItems: 'center', paddingInline: 14,
                    boxShadow: `0 ${layerDepth * 4}px ${layerDepth * 12}px rgba(0,0,0,${layerDepth * 0.1})`,
                    transform: `scale(${1 + layerDepth * 0.01}) translateX(${layerDepth * 3}px)`,
                    transition: 'all 0.3s',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                      {Array.from({ length: layerDepth + 1 }).map((_, j) => (
                        <div key={j} style={{ width: 8, height: 8, borderRadius: 2, background: `rgba(201,169,110,${0.3 + j * 0.15})` }} />
                      ))}
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--gold)' }}>layer {layerDepth}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['shadow','scale','bright'].map((fx, j) => (
                      <div key={fx} style={{ width: 6, height: 6, borderRadius: 2, background: j <= layerDepth - 1 ? 'var(--gold)' : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Sun / Light */}
            <div className="mz-card-dark" style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>☀</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ece6' }}>Light Simulator</div>
                  <div style={{ fontSize: 11, color: 'var(--mist)' }}>Drag the sun to change shadow direction</div>
                </div>
              </div>

              {/* Sun position indicator */}
              <div style={{ position: 'relative', height: 100, background: 'rgba(255,255,255,0.03)', borderRadius: 10, overflow: 'hidden' }}
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setSunPos({ x: (e.clientX - rect.left) / rect.width * 2 - 1, y: (e.clientY - rect.top) / rect.height * 2 - 1 })
                }}>
                <div style={{
                  position: 'absolute',
                  left: `${(sunPos.x + 1) / 2 * 100}%`,
                  top:  `${(sunPos.y + 1) / 2 * 100}%`,
                  transform: 'translate(-50%,-50%)',
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'radial-gradient(circle, #fff9c4, #fbbf24)',
                  boxShadow: '0 0 20px rgba(251,191,36,0.6)',
                  transition: 'left 0.05s, top 0.05s',
                  fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>☀</div>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(circle at ${(sunPos.x + 1) / 2 * 100}% ${(sunPos.y + 1) / 2 * 100}%, rgba(251,191,36,0.08), transparent 60%)` }} />
                <span style={{ position: 'absolute', bottom: 8, left: 12, fontSize: 10, color: 'var(--mist)' }} className="mono">Move mouse · x:{sunPos.x.toFixed(2)} y:{sunPos.y.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Effects toggle grid */}
        <div className="reveal" style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 14, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }} className="mono">Depth Effects</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Shadow', 'Scale', 'Brightness', 'Blur', 'Saturate', 'Rim Light', 'Gradient', 'Translate Z'].map((fx, i) => (
              <div key={fx} style={{
                background: i < 5 ? 'rgba(201,169,110,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i < 5 ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 8, padding: '8px 14px', fontSize: 12,
                color: i < 5 ? 'var(--gold)' : 'var(--mist)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: i < 5 ? 'var(--gold)' : 'var(--mist)' }} />
                {fx}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 08 UTILITIES SHOWCASE ───────────────────────────────────────────────────
function UtilitiesSection() {
  const categories = [
    {
      name: 'Layout', icon: '⊞', color: '#3b82f6',
      utils: ['display:flex', 'flex-dir:col', 'align-yi:center', 'align-x:between', 'grid-cols:repeat(3,1fr)', 'gap:md', 'pad:xl', 'mar:auto', 'pos:absolute', 'pos-inset:0'],
    },
    {
      name: 'Typography', icon: 'T', color: '#8b5cf6',
      utils: ['text:h1', 'text:body', 'type-weight:bold', 'type-face:mono', 'tracking:wide', 'leading:relaxed', 'text-align:center', 'ink:primary', 'text-case:upper', 'type-smooth:anti'],
    },
    {
      name: 'Visual', icon: '◈', color: '#10b981',
      utils: ['paint:primary', 'stroke-color:neutral-200', 'curve:xl', 'cast:lg', 'canvas-fade:muted', 'glass-blur:md', 'overflow:hidden', 'canvas-ratio:16_9', 'canvas-fit:cover', 'canvas-box:border'],
    },
    {
      name: 'Interaction', icon: '⟡', color: '#f59e0b',
      utils: ['cursor:pointer', 'events:none', 'select:none', 'scroll-behave:smooth', 'resize:none', 'touch:pan-y', 'will-change:transform', 'user-select:none', 'pointer-events:all', 'draggable:true'],
    },
  ]

  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="jp-kanji" style={{ top: '10%', right: -20, opacity: 0.03 }}>利</div>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Utilities</span>
          <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 8 }}>
            Every CSS property,<br/><em>Mizumi syntax</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {categories.map(({ name, icon, color, utils }, ci) => (
            <div key={name} className={`mz-card reveal reveal-delay-${ci + 1}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 16, fontWeight: 700 }}>{icon}</div>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {utils.slice(0, 6).map(u => (
                  <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span className="mono" style={{ fontSize: 11, color: '#374151' }}>{u}</span>
                  </div>
                ))}
                <span style={{ fontSize: 10, color: 'var(--mist)', marginTop: 4 }} className="mono">+{utils.length - 6} more…</span>
              </div>
            </div>
          ))}
        </div>

        {/* Rules showcase */}
        <div className="reveal" style={{ marginTop: 40, padding: 24, background: 'var(--washi)', borderRadius: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Rules — Responsive, Dark Mode, Motion</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { cls: 'sm:pad:md',           desc: 'Responsive breakpoint' },
              { cls: 'dark:paint:neutral-900', desc: 'Dark mode' },
              { cls: 'hover:cast:xl',        desc: 'Hover state' },
              { cls: 'focus:stroke-color:primary', desc: 'Focus state' },
              { cls: 'motion-safe:animate-float', desc: 'Reduced motion' },
              { cls: 'print:hidden',         desc: 'Print media' },
              { cls: 'md:grid-cols:repeat(2,1fr)', desc: 'Grid responsive' },
              { cls: 'lg:text:h1',           desc: 'Type responsive' },
            ].map(({ cls, desc }) => (
              <div key={cls} style={{ background: 'white', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="code-chip" style={{ marginBottom: 4, display: 'block' }}>{cls}</div>
                <span style={{ fontSize: 10, color: 'var(--mist)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 09 COMPONENT SHOWCASE ───────────────────────────────────────────────────
function ComponentsSection() {
  const [darkMode, setDarkMode] = useState(false)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState(false)
  const [progress, setProgress] = useState(68)

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const bg   = darkMode ? '#0a0a0a' : 'white'
  const fg   = darkMode ? '#f0ece6' : 'var(--ink)'
  const card = darkMode ? '#1a1a1a' : '#f9fafb'
  const brd  = darkMode ? '#2a2823' : '#e5e7eb'

  return (
    <section className="section" style={{ background: darkMode ? '#070707' : 'var(--washi)', transition: 'background 0.4s' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Components</span>
            <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 8, color: darkMode ? '#f0ece6' : 'var(--ink)' }}>
              Real UI, real fast
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--mist)' }}>Dark Mode</span>
            <div onClick={() => setDarkMode(!darkMode)} style={{
              width: 44, height: 24, borderRadius: 12,
              background: darkMode ? 'var(--gold)' : '#e5e7eb',
              position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
            }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: darkMode ? 23 : 3, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 20 }}>

          {/* Product Card */}
          <div className="reveal" style={{ background: bg, borderRadius: 20, overflow: 'hidden', border: `1px solid ${brd}`, transition: 'all 0.4s' }}>
            <div style={{ height: 200, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div className="animate-float" style={{ fontSize: 80 }}>🌸</div>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--vermil)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>NEW</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: fg }}>Mizumi Pro Pack</h3>
                <span style={{ fontSize: 18, fontWeight: 800, color: fg }}>$29</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--mist)', lineHeight: 1.6, marginBottom: 16 }}>Complete CSS framework with 2000+ tokens, GSAP animations, and depth engine.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <button onClick={() => setQty(Math.max(1,qty-1))} style={{ width: 30, height: 30, borderRadius: '50%', border: `1px solid ${brd}`, background: 'transparent', cursor: 'pointer', fontSize: 16, color: fg }}>−</button>
                <span style={{ fontWeight: 700, color: fg, width: 20, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(qty+1)} style={{ width: 30, height: 30, borderRadius: '50%', border: `1px solid ${brd}`, background: 'transparent', cursor: 'pointer', fontSize: 16, color: fg }}>+</button>
                <div style={{ flex: 1, height: 4, background: brd, borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${Math.min(qty*10,100)}%`, background: 'var(--gold)', borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
              </div>
              <button onClick={showToast} style={{ width: '100%', background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'transform 0.1s' }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={e => e.currentTarget.style.transform = ''}>
                Add to Cart · ${(29 * qty).toFixed(0)}
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="reveal reveal-delay-1" style={{ background: bg, borderRadius: 20, padding: 24, border: `1px solid ${brd}`, transition: 'all 0.4s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--mist)', marginBottom: 2 }}>Monthly Revenue</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: fg }}>$48,290</div>
                <div style={{ fontSize: 12, color: '#10b981', marginTop: 2 }}>↑ 12.4% vs last month</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📈</div>
            </div>
            {/* Mini bar chart */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80, marginBottom: 16 }}>
              {[45,62,38,71,55,80,68,90,74,82,95,88].map((v,i) => (
                <div key={i} style={{ flex: 1, background: i === 11 ? 'var(--gold)' : `rgba(201,169,110,${0.3 + i*0.05})`, borderRadius: '3px 3px 0 0', height: `${v}%`, transition: 'height 0.3s' }} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Total Users', value: '12.4k', icon: '👥', delta: '+8%' },
                { label: 'Downloads',  value: '2,891', icon: '⬇',  delta: '+23%' },
                { label: 'Uptime',     value: '99.9%', icon: '✓',  delta: 'stable' },
                { label: 'Avg Rating', value: '4.9★',  icon: '⭐', delta: '+0.2' },
              ].map(({ label, value, icon, delta }) => (
                <div key={label} style={{ background: card, borderRadius: 10, padding: 12, transition: 'all 0.4s' }}>
                  <div style={{ fontSize: 10, color: 'var(--mist)', marginBottom: 4 }}>{icon} {label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: fg }}>{value}</div>
                  <div style={{ fontSize: 10, color: '#10b981' }}>{delta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile + Progress */}
          <div className="reveal reveal-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Profile */}
            <div style={{ background: bg, borderRadius: 20, padding: 20, border: `1px solid ${brd}`, transition: 'all 0.4s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--vermil), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🌸</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: fg }}>Yuki Tanaka</div>
                  <div style={{ fontSize: 12, color: 'var(--mist)' }}>Senior UI Engineer</div>
                </div>
                <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>Active</div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                {['Design','Mizumi','React','CSS'].map(tag => (
                  <span key={tag} style={{ background: card, border: `1px solid ${brd}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, color: fg, transition: 'all 0.4s' }}>{tag}</span>
                ))}
              </div>
              {/* Progress bars */}
              {[
                { label: 'Design',    pct: 92, color: 'var(--vermil)' },
                { label: 'Code',      pct: 88, color: 'var(--gold)' },
                { label: 'Mizumi',    pct: 99, color: '#10b981' },
              ].map(({ label, pct, color }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--mist)', marginBottom: 4 }}>
                    <span>{label}</span><span style={{ fontWeight: 700, color: fg }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: brd, borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Input group */}
            <div style={{ background: bg, borderRadius: 20, padding: 20, border: `1px solid ${brd}`, transition: 'all 0.4s' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: fg, marginBottom: 14 }}>Quick Search</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input defaultValue="pad:md curve:xl" style={{ flex: 1, border: `1px solid ${brd}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, background: card, color: fg, outline: 'none', fontFamily: 'DM Mono', transition: 'all 0.4s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlur={e => e.target.style.borderColor = brd} />
                <button style={{ background: 'var(--gold)', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', color: 'var(--ink)' }}>⌕</button>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                {['card', 'hover-lift', 'glass', 'btn-primary'].map(s => (
                  <span key={s} className="code-chip" style={{ cursor: 'pointer' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, right: 24, zIndex: 9000,
          background: 'var(--ink)', color: 'var(--paper)', borderRadius: 12,
          padding: '14px 20px', fontSize: 13, fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'fadeUp 0.3s ease-out',
          border: '1px solid rgba(201,169,110,0.3)',
        }}>
          <span>🌸</span>
          Added to cart! <span className="code-chip">toast</span> pattern
        </div>
      )}
    </section>
  )
}

// ─── 10 DEVTOOLS SECTION ─────────────────────────────────────────────────────
function DevToolsSection() {
  return (
    <section className="section section-dark">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Mizumi DevTools</span>
          <h2 className="serif" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 200, marginTop: 8, color: '#f0ece6' }}>
            Inspect, edit,<br/><em>see it live</em>
          </h2>
        </div>

        <div className="grid-2">
          {/* DevTools mock panel */}
          <div className="reveal" style={{ fontFamily: 'DM Mono' }}>
            <div style={{ background: '#0e0d0b', border: '1px solid #2a2823', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
              {/* Header */}
              <div style={{ background: '#141310', borderBottom: '1px solid #2a2823', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>Mizumi 🌸 Dev</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 10, color: '#3d3a34', border: '1px solid #2a2823', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }}>pin</span>
                  <span style={{ fontSize: 10, color: '#3d3a34', border: '1px solid #2a2823', borderRadius: 3, padding: '2px 6px', cursor: 'pointer' }}>×</span>
                </div>
              </div>
              {/* Target info */}
              <div style={{ background: '#0a0908', borderBottom: '1px solid #2a2823', padding: '8px 16px' }}>
                <div style={{ fontSize: 10, color: '#38bdf8' }}>{'<div id="hero-card">'}</div>
                <div style={{ fontSize: 10, color: '#3d3a34', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>card glass animate-scale-in hover-lift</div>
              </div>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #2a2823' }}>
                {['Classes','Computed','+ Add','⬡ 3D'].map((t, i) => (
                  <div key={t} style={{ flex: 1, padding: '8px', textAlign: 'center', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: i === 0 ? 'var(--gold)' : '#3d3a34', borderBottom: i === 0 ? '2px solid var(--gold)' : '2px solid transparent', cursor: 'pointer' }}>{t}</div>
                ))}
              </div>
              {/* Classes */}
              <div style={{ padding: '10px 16px', maxHeight: 200, overflow: 'auto' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3d3a34', marginBottom: 8 }}>Mizumi Classes</div>
                {['card', 'glass', 'animate-scale-in', 'hover-lift', 'pad:xl', 'curve:2xl'].map(cls => (
                  <div key={cls} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #141310' }}>
                    <span style={{ fontSize: 10, color: 'var(--gold)', cursor: 'pointer' }}>{cls}</span>
                    <span style={{ fontSize: 14, color: '#3d3a34', cursor: 'pointer', lineHeight: 1 }}>×</span>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div style={{ padding: '8px 16px', borderTop: '1px solid #2a2823', display: 'flex', justifyContent: 'space-between', background: '#0a0908' }}>
                <span style={{ fontSize: 10, color: '#7a7568', cursor: 'pointer' }}>copy all classes</span>
                <span style={{ fontSize: 10, color: '#2a2823' }}>MIZUMI 🌸</span>
              </div>
            </div>
          </div>

          {/* Features list */}
          <div className="reveal reveal-delay-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '🔍', title: 'Hover Inspect', desc: 'Hover any element to see its Mizumi classes, computed styles, and token values instantly.', status: 'live' },
                { icon: '✏️', title: 'Live Class Editing', desc: 'Add, remove, or swap classes directly from the panel. Ctrl+click any element.', status: 'live' },
                { icon: '⬡', title: 'Dimension HUD', desc: 'Rotary knobs for tilt, rest angle, duration, and depth — all updating live.', status: 'live' },
                { icon: '☀', title: 'Light Simulator', desc: 'Drag the sun to change shadow direction across all depth-aware elements.', status: 'live' },
                { icon: '→', title: 'DOM → Source', desc: 'Every edit writes back to your JSX/HTML/Vue source file via Vite HMR.', status: 'coming' },
              ].map(({ icon, title, desc, status }) => (
                <div key={title} style={{ display: 'flex', gap: 14, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#f0ece6' }}>{title}</span>
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: status === 'live' ? 'rgba(16,185,129,0.2)' : 'rgba(201,169,110,0.2)', color: status === 'live' ? '#10b981' : 'var(--gold)', fontFamily: 'DM Mono', letterSpacing: '0.05em' }}>{status}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--mist)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 11 CTA / OUTRO ──────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="section" style={{ background: 'var(--ink)', color: 'var(--paper)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Radial glow */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.08), transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <div className="jp-kanji" style={{ top: '10%', left: '5%', color: 'rgba(255,255,255,0.02)', fontSize: 300 }}>始</div>
      <div className="jp-kanji" style={{ bottom: '10%', right: '5%', color: 'rgba(255,255,255,0.02)', fontSize: 300 }}>美</div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
        <div className="animate-breathe" style={{ display: 'inline-block', marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, background: 'var(--gold)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 0 40px rgba(201,169,110,0.4)' }}>🌸</div>
        </div>

        <h2 className="serif reveal" style={{ fontSize: 'clamp(40px,7vw,80px)', fontWeight: 200, lineHeight: 1.1, marginBottom: 20 }}>
          Build beautiful.<br/><em>Ship fast.</em>
        </h2>

        <p className="reveal reveal-delay-1" style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 40, maxWidth: 460, margin: '0 auto 40px' }}>
          Mizumi brings Japanese aesthetic precision to modern web development. Every token, every layer, every animation — crafted with intention.
        </p>

        <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', borderRadius: 12, padding: '16px 32px', fontWeight: 800, fontSize: 15, cursor: 'pointer', letterSpacing: '0.05em', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 20px rgba(201,169,110,0.4)' }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(201,169,110,0.5)' }}
            onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '0 4px 20px rgba(201,169,110,0.4)' }}>
            Get Started →
          </button>
          <button style={{ background: 'transparent', color: 'var(--paper)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '16px 32px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}>
            View Docs
          </button>
        </div>

        {/* Final install code */}
        <div className="reveal reveal-delay-3" style={{ marginTop: 48, display: 'inline-block', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px' }}>
          <span className="mono" style={{ fontSize: 14, color: 'var(--gold)' }}>npm install mizumi</span>
        </div>
      </div>
    </section>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  useReveal()

  return (
    <>
      <style>{globalStyles}</style>
      <div className="noise" />
      <Nav />
      <HeroSection />
      <InstallSection />
      <TokensSection />
      <PatternsSection />
      <AnimationsSection />
      <SpatialSection />
      <DepthSection />
      <UtilitiesSection />
      <ComponentsSection />
      <DevToolsSection />
      <CTASection />
    </>
  )
}