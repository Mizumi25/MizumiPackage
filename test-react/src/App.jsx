import React, { useEffect, useRef } from 'react'

export default function App() {
  return (
    <div className="paint:neutral-900 ink:neutral-50 canvas-min-h:screen type-face:sans">

      {/* ── NAV ── */}
      <nav className="
        pos:fixed pos-top:0 pos-left:0 canvas-w:full
        display:flex align-x:between align-yi:center
        pad-x:2xl pad-y:md
        layer:sticky
        paint:neutral-900
      ">
        <span className="type-face:mono type-size:clamp(0.75rem,1.5vw,0.875rem) tracking:widest text-case:upper ink:neutral-500">
          Kaito / Portfolio
        </span>
        <div className="display:flex gap:xl">
          {['Work', 'About', 'Contact'].map(item => (
            <a key={item} href="#" className="
              type-size:clamp(0.75rem,1.5vw,0.875rem) tracking:wide text-case:upper
              ink:neutral-500 hover-lift ease:default
              type-face:mono
            ">{item}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="
        canvas-w:full canvas-min-h:screen
        display:flex flex-dir:col align-x:center align-yi:center
        pad:clamp(6rem,12vw,10rem)
        pos:relative overflow:hidden
        animate-fade-in
      ">
        {/* decorative line */}
        <div className="
          pos:absolute pos-top:0 pos-left:50%
          canvas-w:1px canvas-h:full
          paint:neutral-800
        " />

        <div className="display:flex flex-dir:col align-yi:center gap:lg animate-slide-up">
          <span className="
            type-face:mono type-size:clamp(0.7rem,1.2vw,0.8rem)
            tracking:widest text-case:upper ink:neutral-500
            pad-x:md pad-y:xs
            stroke-style:solid stroke-width:1px stroke-color:neutral-800
            curve:full
          ">
            Designer & Developer
          </span>

          <h1 className="
            type-size:clamp(4rem,10vw,9rem) type-weight:bold
            tracking:-0.04em leading:0.9
            text-align:center
            ink:neutral-50
            type-face:serif
          ">
            Crafting<br/>
            <span className="ink:neutral-600">Digital</span><br/>
            Spaces
          </h1>

          <p className="
            type-size:clamp(0.9rem,1.8vw,1.1rem)
            ink:neutral-500 leading:relaxed
            text-align:center
            canvas-w:min(100%,480px)
            type-face:sans
          ">
            Minimal interfaces. Intentional motion. 
            Design rooted in Japanese aesthetics — 
            <em>ma</em>, the beauty of negative space.
          </p>

          <div className="display:flex gap:md pad-top:lg">
            <a href="#" className="
              btn-primary
              type-size:clamp(0.75rem,1.4vw,0.85rem)
              tracking:wide text-case:upper
              type-face:mono
              active-press
            ">
              View Work
            </a>
            <a href="#" className="
              btn-ghost
              type-size:clamp(0.75rem,1.4vw,0.85rem)
              tracking:wide text-case:upper
              type-face:mono
              hover-lift
            ">
              About Me
            </a>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="
          pos:absolute pos-btm:xl
          display:flex flex-dir:col align-yi:center gap:sm
          animate-fade-in
        ">
          <span className="type-face:mono type-size:clamp(0.6rem,1vw,0.7rem) tracking:widest ink:neutral-600 text-case:upper">Scroll</span>
          <div className="canvas-w:1px canvas-h:clamp(40px,6vh,60px) paint:neutral-700" />
        </div>
      </section>

      {/* ── WORK GRID ── */}
      <section className="
        pad:clamp(4rem,8vw,8rem)
        canvas-w:min(100%,1400px) mar-x:auto
      ">
        <div className="
          display:flex align-x:between align-yi:end
          pad-btm:2xl
          stroke-y-end:neutral-800 stroke-style:solid stroke-width:1px
          mar-btm:2xl
        ">
          <h2 className="
            type-size:clamp(2rem,5vw,4rem)
            type-face:serif tracking:-0.03em
            ink:neutral-50 leading:tight
            scroll-fade-in
          ">
            Selected<br/>Work
          </h2>
          <span className="type-face:mono type-size:clamp(0.7rem,1.2vw,0.8rem) ink:neutral-600 tracking:widest">
            2022 — 2024
          </span>
        </div>

        <div className="stagger-children-100">
          {[
            { num: '01', title: 'Void OS', tag: 'Interface Design', year: '2024' },
            { num: '02', title: 'Kuro Studio', tag: 'Brand Identity', year: '2024' },
            { num: '03', title: 'Asa Weather', tag: 'Mobile App', year: '2023' },
            { num: '04', title: 'Shizen AI', tag: 'Web Platform', year: '2023' },
          ].map(project => (
            <div key={project.num} className="
              display:flex align-x:between align-yi:center
              pad-y:xl
              stroke-y-end:neutral-800 stroke-style:solid stroke-width:1px
              cursor:pointer
              hover-lift
              ease:default
              group
            ">
              <div className="display:flex align-yi:center gap:2xl">
                <span className="type-face:mono type-size:clamp(0.7rem,1.2vw,0.8rem) ink:neutral-700 tracking:widest">
                  {project.num}
                </span>
                <h3 className="
                  type-size:clamp(1.5rem,3.5vw,3rem)
                  type-face:serif tracking:-0.02em
                  ink:neutral-50 leading:tight
                ">
                  {project.title}
                </h3>
              </div>
              <div className="display:flex align-yi:center gap:xl">
                <span className="
                  type-face:mono type-size:clamp(0.7rem,1.2vw,0.8rem)
                  ink:neutral-600 tracking:wide
                  display:none md:display:block
                ">
                  {project.tag}
                </span>
                <span className="type-face:mono type-size:clamp(0.7rem,1.2vw,0.8rem) ink:neutral-700">
                  {project.year}
                </span>
                <div className="
                  canvas-w:clamp(32px,4vw,48px) canvas-h:clamp(32px,4vw,48px)
                  curve:full
                  stroke-style:solid stroke-width:1px stroke-color:neutral-700
                  display:flex align-x:center align-yi:center
                ">
                  <span className="ink:neutral-500 type-size:clamp(0.8rem,1.5vw,1rem)">↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="
        pad:clamp(4rem,8vw,8rem)
        canvas-w:min(100%,1400px) mar-x:auto
        display:flex flex-dir:col gap:3xl
      ">
        <div className="
          display:flex flex-dir:col gap:xl
          canvas-w:min(100%,640px)
        ">
          <span className="
            type-face:mono type-size:clamp(0.7rem,1.2vw,0.8rem)
            tracking:widest text-case:upper ink:neutral-600
            scroll-fade-in
          ">
            Philosophy
          </span>
          <p className="
            type-size:clamp(1.5rem,3vw,2.5rem)
            type-face:serif leading:snug tracking:-0.02em
            ink:neutral-200
            scroll-fade-in
          ">
            "Less, but better. Every pixel earns its place or it doesn't exist."
          </p>
        </div>

        <div className="display:flex flex-dir:col gap:md stagger-children-100">
          {[
            { kanji: '間', romaji: 'Ma', meaning: 'Negative Space — the pause between elements' },
            { kanji: '侘', romaji: 'Wabi', meaning: 'Imperfect Beauty — embracing the raw and unfinished' },
            { kanji: '寂', romaji: 'Sabi', meaning: 'Transience — the beauty of things that fade' },
          ].map(concept => (
            <div key={concept.kanji} className="
              display:flex align-yi:center gap:2xl
              pad:xl
              stroke-style:solid stroke-width:1px stroke-color:neutral-800
              curve:lg
              hover-lift ease:default
              paint:neutral-900
            ">
              <span className="
                type-size:clamp(2.5rem,5vw,4rem)
                type-face:serif ink:neutral-700
                canvas-w:clamp(60px,8vw,80px) text-align:center
                flex-shrink:0
              ">
                {concept.kanji}
              </span>
              <div className="display:flex flex-dir:col gap:xs">
                <span className="type-face:mono type-size:clamp(0.7rem,1.2vw,0.8rem) tracking:widest text-case:upper ink:neutral-500">
                  {concept.romaji}
                </span>
                <span className="type-size:clamp(0.9rem,1.6vw,1rem) ink:neutral-400 leading:relaxed">
                  {concept.meaning}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="
        pad:clamp(4rem,8vw,8rem)
        canvas-w:min(100%,1400px) mar-x:auto
        display:flex flex-dir:col align-yi:center
        text-align:center gap:2xl
        pad-btm:clamp(6rem,12vw,10rem)
      ">
        <span className="
          type-face:mono type-size:clamp(0.7rem,1.2vw,0.8rem)
          tracking:widest text-case:upper ink:neutral-600
          scroll-fade-in
        ">
          Get in Touch
        </span>

        <h2 className="
          type-size:clamp(3rem,8vw,7rem)
          type-face:serif tracking:-0.04em leading:0.9
          ink:neutral-50
          canvas-w:min(100%,900px)
          scroll-fade-in
        ">
          Let's build something worth remembering.
        </h2>

        <a href="mailto:kaito@studio.jp" className="
          type-face:mono type-size:clamp(0.75rem,1.4vw,0.9rem)
          tracking:widest text-case:upper
          ink:neutral-400
          pad-x:2xl pad-y:lg
          stroke-style:solid stroke-width:1px stroke-color:neutral-700
          curve:full
          hover-lift ease:default
          active-press
          scroll-fade-in
        ">
          kaito@studio.jp
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer className="
        pad-x:2xl pad-y:xl
        display:flex align-x:between align-yi:center
        stroke-y-start:neutral-800 stroke-style:solid stroke-width:1px
      ">
        <span className="type-face:mono type-size:clamp(0.6rem,1vw,0.75rem) ink:neutral-700 tracking:widest">
          © 2024 Kaito
        </span>
        <span className="type-face:mono type-size:clamp(0.6rem,1vw,0.75rem) ink:neutral-700 tracking:widest">
          Built with Mizumi 🌊
        </span>
      </footer>

    </div>
  )
}