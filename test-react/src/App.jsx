import React, { useEffect, useRef } from 'react'

// ── Only Mizumi classes used throughout ──────────────────────────
// Tokens:     paint:ink, ink:surface, type-face:sans, etc.
// Utilities:  pad:lg, canvas-w:full, display:flex, etc.
// Patterns:   card, heading, text-muted, btn-primary, etc.
// Animations: animate-fade-in, hover-lift, active-press, etc.

const works = [
  {
    id: '01',
    title: '静寂',
    sub: 'Silence',
    year: '2024',
    tag: 'Identity',
    desc: 'A visual identity system built on the philosophy of ma — the Japanese concept of negative space as an active element.',
  },
  {
    id: '02',
    title: '波紋',
    sub: 'Ripple',
    year: '2024',
    tag: 'Digital',
    desc: 'An interactive data visualization exploring how small decisions propagate through complex systems.',
  },
  {
    id: '03',
    title: '余白',
    sub: 'Margin',
    year: '2023',
    tag: 'Print',
    desc: 'Editorial design for a quarterly publication on craft, slowness, and the art of deliberate making.',
  },
  {
    id: '04',
    title: '間',
    sub: 'Ma',
    year: '2023',
    tag: 'Space',
    desc: 'Spatial installation translating the concept of meaningful pause into architectural experience.',
  },
]

const skills = ['Typography', 'Identity', 'Motion', 'Editorial', 'Digital', 'Space']

export default function App() {
  const lineRef = useRef(null)

  useEffect(() => {
    // Animate the vertical line on load using GSAP runtime
    const el = lineRef.current
    if (!el) return
    el.style.height = '0'
    el.style.transition = 'height 1.4s cubic-bezier(0.4,0,0.2,1) 0.3s'
    requestAnimationFrame(() => {
      el.style.height = '100%'
    })
  }, [])

  return (
    <div className="canvas-w:full canvas-h-min:screen paint:surface ink:ink type-face:sans">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="animate-fade-in" style={{ padding: 'var(--spacing-lg) var(--spacing-2xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: 'var(--color-ink)',
            display: 'inline-block'
          }} />
          <span className="text:small type-weight:semi tracking:wider text-case:upper">
            Kaito Mizumi
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xl)', alignItems: 'center' }}>
          {['Work', 'About', 'Contact'].map(item => (
            <a
              key={item}
              href="#"
              className="text:small ink:neutral-500 ease:default"
              style={{ textDecoration: 'none', transition: 'color var(--duration-fast)' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-ink)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-neutral-500)'}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--spacing-3xl) var(--spacing-2xl)', position: 'relative', overflow: 'hidden' }}>

        {/* Vertical accent line */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            left: 'calc(var(--spacing-2xl) - 1px)',
            top: 0,
            width: '1px',
            height: '100%',
            background: 'var(--color-neutral-200)',
          }}
        />

        {/* Large Japanese numeral */}
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            right: 'var(--spacing-2xl)',
            top: 'var(--spacing-xl)',
            fontSize: '22vw',
            fontWeight: '700',
            lineHeight: '1',
            color: 'var(--color-neutral-100)',
            userSelect: 'none',
            letterSpacing: '-0.05em',
          }}
        >
          一
        </div>

        <div style={{ paddingLeft: 'var(--spacing-xl)', position: 'relative', zIndex: 1 }}>
          <p
            className="text:small ink:neutral-500 tracking:widest text-case:upper animate-fade-in"
            style={{ marginBottom: 'var(--spacing-lg)', letterSpacing: '0.3em' }}
          >
            Designer &amp; Creative Director
          </p>

          <h1
            className="animate-slide-up"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: '700',
              lineHeight: '1.05',
              letterSpacing: '-0.03em',
              marginBottom: 'var(--spacing-xl)',
              maxWidth: '14ch',
            }}
          >
            Crafting{' '}
            <em style={{ fontStyle: 'normal', color: 'var(--color-neutral-500)' }}>
              meaningful
            </em>{' '}
            silence.
          </h1>

          <p
            className="text:body ink:neutral-500 animate-fade-in"
            style={{ maxWidth: '42ch', lineHeight: '1.75', marginBottom: 'var(--spacing-2xl)' }}
          >
            Tokyo-based designer working at the intersection of
            cultural memory and contemporary form. Every project
            begins with listening.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
            <button className="btn-primary active-press hover-lift" style={{ borderRadius: '2px' }}>
              View Work
            </button>
            <a
              href="#"
              className="text:small ink:neutral-500 ease:default"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
              }}
            >
              <span style={{ width: '24px', height: '1px', background: 'currentColor', display: 'inline-block' }} />
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* ── SKILLS TICKER ────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid var(--color-neutral-200)',
          borderBottom: '1px solid var(--color-neutral-200)',
          padding: 'var(--spacing-md) 0',
          overflow: 'hidden',
          display: 'flex',
          gap: 'var(--spacing-3xl)',
        }}
      >
        {[...skills, ...skills].map((s, i) => (
          <span
            key={i}
            className="text:small ink:neutral-500 tracking:widest text-case:upper"
            style={{ whiteSpace: 'nowrap', letterSpacing: '0.2em', flexShrink: 0 }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* ── WORK ─────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--spacing-3xl) var(--spacing-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-2xl)' }}>
          <h2
            className="text:h3 type-weight:semi"
            style={{ letterSpacing: '-0.02em' }}
          >
            Selected Work
          </h2>
          <span className="text:small ink:neutral-500">
            {works.length} projects
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {works.map((work, i) => (
            <WorkRow key={work.id} work={work} index={i} />
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-2xl)',
          borderTop: '1px solid var(--color-neutral-200)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-3xl)',
          alignItems: 'start',
        }}
      >
        <div>
          <p
            className="text:small ink:neutral-500 tracking:widest text-case:upper animate-fade-in"
            style={{ marginBottom: 'var(--spacing-lg)', letterSpacing: '0.3em' }}
          >
            About
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: '600',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            Design as a{' '}
            <span style={{ color: 'var(--color-neutral-500)' }}>
              contemplative practice.
            </span>
          </h2>
          <p className="text:body ink:neutral-500" style={{ lineHeight: '1.75', maxWidth: '45ch' }}>
            Fourteen years studying the relationship between restraint
            and expression. Trained in Tokyo, worked across Kyoto,
            Berlin, and New York. Now returning to simplicity.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {[
            { label: 'Studio', value: 'Tokyo, Japan' },
            { label: 'Available', value: 'Q2 2025' },
            { label: 'Approach', value: 'Slow, deliberate, precise' },
            { label: 'Languages', value: 'Japanese, English, German' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: 'var(--spacing-md) 0',
                borderBottom: '1px solid var(--color-neutral-200)',
              }}
            >
              <span className="text:small ink:neutral-500 text-case:upper tracking:wider" style={{ letterSpacing: '0.15em' }}>
                {label}
              </span>
              <span className="text:small type-weight:medium">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-2xl)',
          borderTop: '1px solid var(--color-neutral-200)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--spacing-xl)',
        }}
      >
        <p className="text:small ink:neutral-500 tracking:widest text-case:upper" style={{ letterSpacing: '0.3em' }}>
          Contact
        </p>
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
          }}
        >
          Let's make something
          <br />
          <span style={{ color: 'var(--color-neutral-400)' }}>worth keeping.</span>
        </h2>
        <a
          href="mailto:kaito@mizumi.jp"
          className="text:body ink:ink ease:default"
          style={{
            textDecoration: 'none',
            borderBottom: '1px solid var(--color-neutral-300)',
            paddingBottom: '2px',
            transition: 'border-color var(--duration-normal)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-ink)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-neutral-300)'}
        >
          kaito@mizumi.jp
        </a>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        style={{
          padding: 'var(--spacing-lg) var(--spacing-2xl)',
          borderTop: '1px solid var(--color-neutral-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="text:small ink:neutral-500">
          © 2025 Kaito Mizumi. All rights reserved.
        </span>
        <span className="text:small ink:neutral-500">
          Built with{' '}
          <span className="ink:ink type-weight:medium">Mizumi 🌊</span>
        </span>
      </footer>

    </div>
  )
}

// ── Work Row Component ────────────────────────────────────────────
function WorkRow({ work, index }) {
  const ref = useRef(null)

  return (
    <div
      ref={ref}
      className="scroll-fade-in ease:default"
      style={{
        display: 'grid',
        gridTemplateColumns: '4rem 1fr auto',
        gap: 'var(--spacing-xl)',
        alignItems: 'center',
        padding: 'var(--spacing-lg) 0',
        borderBottom: '1px solid var(--color-neutral-200)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--color-neutral-50)'
        e.currentTarget.style.margin = '0 calc(-1 * var(--spacing-2xl))'
        e.currentTarget.style.padding = `var(--spacing-lg) var(--spacing-2xl)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.margin = '0'
        e.currentTarget.style.padding = `var(--spacing-lg) 0`
      }}
    >
      {/* Index + kanji */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span className="text:small ink:neutral-400" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {work.id}
        </span>
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{work.title.charAt(0)}</span>
      </div>

      {/* Title block */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-sm)', marginBottom: '4px' }}>
          <span
            className="type-weight:semi"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', letterSpacing: '-0.01em' }}
          >
            {work.sub}
          </span>
          <span className="badge-primary">{work.tag}</span>
        </div>
        <p className="text:small ink:neutral-500" style={{ maxWidth: '55ch', lineHeight: '1.5' }}>
          {work.desc}
        </p>
      </div>

      {/* Year */}
      <span className="text:small ink:neutral-400">
        {work.year}
      </span>
    </div>
  )
}