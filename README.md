# 🌊 Mizumi

**A designer-first CSS framework with GSAP animations, deep token system, and a Depth Engine — all driven by one config.**

Mizumi is not a component library. It is a vocabulary. Define your design system once in `mizumi.config.js`, and it generates thousands of type-safe utility classes, semantic pattern shortcuts, CSS variables, GSAP-powered animation classes, and TypeScript types. The engine knows about your tokens, your patterns extend each other, and every animation is real GSAP — not CSS keyframes pretending.

---

## Table of Contents

- [What Mizumi Generates](#what-mizumi-generates)
- [Packages](#packages)
- [Quick Start](#quick-start)
- [The Vocabulary — Colon Syntax](#the-vocabulary--colon-syntax)
- [Tokens](#tokens)
- [Patterns](#patterns)
- [Animations & GSAP](#animations--gsap)
  - [Entrance](#entrance)
  - [Hover](#hover)
  - [Active / Click](#active--click)
  - [Scroll Trigger](#scroll-trigger)
  - [Scroll Scrub / Parallax](#scroll-scrub--parallax)
  - [Stagger](#stagger)
  - [Gestures](#gestures)
  - [Looping](#looping)
  - [Exit / Out](#exit--out)
  - [Animation Modifiers](#animation-modifiers)
  - [Inline Props Syntax](#inline-props-syntax)
  - [Target Syntax](#target-syntax)
- [Static Utilities](#static-utilities)
- [Responsive Variants](#responsive-variants)
- [State Variants](#state-variants)
- [Dark Mode](#dark-mode)
- [Container Queries](#container-queries)
- [Print / Motion / Orientation](#print--motion--orientation)
- [The Depth Engine](#the-depth-engine)
- [DevTools](#devtools)
- [.mizu Files](#mizu-files)
- [TypeScript & JS Helpers](#typescript--js-helpers)
- [Rules Reference](#rules-reference)
- [CLI](#cli)
- [Full Token Reference](#full-token-reference)
- [Full Pattern Library](#full-pattern-library)
- [Philosophy](#philosophy)

---

## What Mizumi Generates

Running `npm run dev` or `npx mizumi build` produces the `.mizumi/` directory:

| File | What it is |
|---|---|
| `mizumi.css` | All CSS — variables, utilities, patterns, variants |
| `mizumi-runtime.js` | GSAP animation engine — reads your classes at runtime |
| `mizumi-depth-runtime.js` | Depth Engine runtime |
| `mizumi.d.ts` | TypeScript types for every class in your config |
| `mizumi-helpers.js` | `mizu()` and `cx()` JS helpers + `MIZUMI_CLASSES` set |
| `mizumi.meta.json` | Serialized config metadata for tooling |
| `mizumi-devtools.js` | Dev-only inspector (auto-injected, zero production cost) |

---

## Packages

```
packages/
├── core/              CSS generation engine, class resolver, token parser
│   ├── class-resolver.js    Single source of truth — all 364+ capability mappings
│   ├── index.js             Mizumi class — orchestrates full build
│   ├── parser.js            Token → CSS variable converter
│   ├── pattern-expander.js  Pattern composition + conflict deduplication
│   ├── variant-generator.js Responsive, state, dark, container, print, motion variants
│   ├── utility-generator.js Token-based utility class emitter
│   ├── types-generator.js   TypeScript .d.ts + mizu()/cx() helpers
│   ├── mizu-parser.js       .mizu file syntax parser
│   ├── validator.js         Config validation — catches raw CSS and Tailwind
│   └── defaults.js          Creator-maintained default token/pattern/animation sets
├── gsap/
│   └── animation-engine.js  GSAP runtime — reads classes, drives all animations
├── depth/
│   └── index.js             Depth Engine — z-index aware 3D lighting system
├── vite-plugin/
│   ├── index.js             Vite plugin — builds on start, HMR rebuilds
│   └── devtools.js          Browser DevTools panel (dev only)
├── postcss-plugin/          PostCSS integration
└── cli/
    └── index.js             CLI commands
```

---

## Quick Start

### With Vite (React, Vue, Svelte)

```bash
npm install gsap
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import react   from '@vitejs/plugin-react'
import mizumi  from './packages/vite-plugin/index.js'

export default defineConfig({
  plugins: [react(), mizumi()],
  optimizeDeps: { exclude: ['.mizumi'] }
})
```

```html
<!-- index.html -->
<link rel="stylesheet" href="/.mizumi/mizumi.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js"></script>
<script src="/.mizumi/mizumi-runtime.js" defer></script>
<script src="/.mizumi/mizumi-depth-runtime.js" defer></script>
```

```jsx
// App.jsx
<div className="card animate-fade-in hover-lift scroll-fade-in">
  <h1 className="text:h1 ink:primary">Hello Mizumi</h1>
  <button className="btn-primary active-press">Click me</button>
</div>
```

### With npm GSAP (no CDN)

```js
// main.jsx
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
window.gsap          = gsap
window.ScrollTrigger = ScrollTrigger
```

### Plain HTML

```bash
npx mizumi build
```

```html
<link rel="stylesheet" href=".mizumi/mizumi.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js"></script>
<script src=".mizumi/mizumi-runtime.js" defer></script>
```

### With PostCSS (Next.js, Nuxt)

```js
// postcss.config.js
import mizumi from './packages/postcss-plugin/index.js'
export default { plugins: [mizumi()] }
```

---

## The Vocabulary — Colon Syntax

Mizumi uses `capability:token` — not Tailwind's `property-value`. This is intentional. The left side is a *designer word*, the right side is a *token name* or raw value. Everything is type-safe.

```jsx
// Tailwind           Mizumi
bg-blue-500    →   paint:primary
text-white     →   ink:white
p-4            →   pad:md
rounded-lg     →   curve:lg
shadow-md      →   cast:md
font-semibold  →   type-weight:semi
text-xl        →   text:xl
w-full         →   canvas-w:full
h-screen       →   canvas-h:screen
opacity-50     →   canvas-fade:soft
z-50           →   layer:50
gap-4          →   gap:md
```

Raw CSS values also work anywhere a token is expected:

```jsx
<div className="pad:24px canvas-w:min(100%,800px) ink:#3B82F6">
```

---

## Tokens

Tokens are the foundation. Every token becomes a CSS variable and generates utility classes automatically.

```js
// mizumi.config.js
export default {
  tokens: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        50:  '#EFF6FF',
        100: '#DBEAFE',
        500: '#3B82F6',
        600: '#2563EB',
        900: '#1E3A8A',
      },
      neutral: { 50: '#F9FAFB', 500: '#6B7280', 900: '#111827' },
      success: '#10B981',
      error:   '#EF4444',
    },
    spacing: {
      xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px',
      '2xl': '48px', '3xl': '64px',
    },
    typography: {
      h1:   { size: '48px', weight: '700', line: '1.2' },
      body: { size: '16px', weight: '400', line: '1.6' },
      xs:   { size: '12px', weight: '400', line: '1.4' },
    },
    fonts:    { sans: 'Inter, system-ui, sans-serif', mono: '"Fira Code", monospace' },
    radius:   { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
    shadows:  { sm: '0 1px 3px rgba(0,0,0,0.06)', lg: '0 10px 15px rgba(0,0,0,0.08)' },
    easing:   { smooth: 'cubic-bezier(0.4,0,0.2,1)', bouncy: 'cubic-bezier(0.34,1.56,0.64,1)' },
    duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
    blur:     { sm: '4px', md: '8px', glass: '20px' },
    opacity:  { ghost: '0.05', muted: '0.4', soft: '0.7', full: '1' },
    zIndex:   { modal: 100, toast: 300, top: 999 },
    leading:  { tight: '1.25', normal: '1.5', relaxed: '1.625' },
    tracking: { tight: '-0.05em', normal: '0em', wide: '0.05em' },
    strokes:  { thin: '1px', base: '2px', thick: '4px' },
  }
}
```

### Generated CSS Variables

```css
:root {
  --color-primary:     #3B82F6;
  --color-primary-50:  #EFF6FF;
  --color-primary-600: #2563EB;
  --spacing-md:        16px;
  --text-h1-size:      48px;
  --text-h1-weight:    700;
  --text-h1-line:      1.2;
  --radius-lg:         12px;
  --shadow-lg:         0 10px 15px rgba(0,0,0,0.08);
  --ease-smooth:       cubic-bezier(0.4,0,0.2,1);
  --duration-normal:   300ms;
  /* ... */
}
```

### Generated Utility Classes

Every token generates classes for every capability that accepts it:

```css
/* colors → ink, paint, stroke-color, ring-color, ink-caret, ink-accent, etc. */
.ink\:primary        { color: var(--color-primary); }
.paint\:primary-600  { background-color: var(--color-primary-600); }
.stroke-color\:primary { border-color: var(--color-primary); }

/* spacing → pad, mar, gap, canvas-w/h, pos-top/left/etc. */
.pad\:md    { padding: var(--spacing-md); }
.mar-x\:lg  { margin-left: var(--spacing-lg); margin-right: var(--spacing-lg); }
.gap\:sm    { gap: var(--spacing-sm); }

/* typography → text */
.text\:h1   { font-size: var(--text-h1-size); font-weight: var(--text-h1-weight); line-height: var(--text-h1-line); }

/* radius → curve */
.curve\:lg  { border-radius: var(--radius-lg); }

/* shadows → cast */
.cast\:lg   { box-shadow: var(--shadow-lg); }

/* easing → ease (shorthand), ease-curve, ease-speed */
.ease\:normal { transition: all var(--duration-normal) var(--ease-smooth); }

/* blur → glass-blur */
.glass-blur\:glass { backdrop-filter: blur(var(--blur-glass)); }

/* opacity → canvas-fade */
.canvas-fade\:soft { opacity: var(--opacity-soft); }
```

---

## Patterns

Patterns are named compositions of utilities. They expand at build time and write-back at dev time. Patterns can reference other patterns — they resolve recursively with conflict deduplication (last capability wins).

```js
patterns: {
  // Primitives
  'flex-center': 'display:flex align-yi:center align-x:center',
  'stack':       'display:flex flex-dir:col',

  // Component
  'button': [
    'display:flex-inline align-yi:center align-x:center',
    'pad-y:sm pad-x:lg curve:md cursor:pointer',
    'type-weight:semi select:none',
  ].join(' '),

  // Pattern extending pattern
  'btn-primary':   'button paint:primary ink:white',
  'btn-ghost':     'button stroke-style:solid stroke-width:thin stroke-color:primary ink:primary',
  'btn-primary-lg':'btn-primary pad-y:md pad-x:xl text:lg',   // extends btn-primary

  // Card system
  'card':           'paint:surface pad:md curve:lg cast:md',
  'card-elevated':  'card cast:xl',     // extends card
  'card-glass':     'glass-blur:glass canvas-fade:soft curve:lg cast:md',
}
```

Usage:

```jsx
<div className="card animate-fade-in">
  <button className="btn-primary hover-lift active-press">Go</button>
</div>
```

### Pattern Conflict Resolution

When a pattern extends another and both set the same CSS property, the last one wins:

```js
'btn-primary-lg': 'btn-primary pad-y:md pad-x:xl text:lg'
// btn-primary sets pad-y:sm pad-x:lg → overridden by pad-y:md pad-x:xl
```

The engine uses `CAPABILITY_PROPERTY_MAP` to detect which capabilities map to the same CSS property and deduplicates before emitting CSS.

---

## Animations & GSAP

All animation classes require GSAP on `window.gsap`. ScrollTrigger classes additionally require `window.ScrollTrigger`. The runtime reads your element's `classList` at `DOMContentLoaded` and wires real GSAP timelines.

### Entrance

Fire once on page load or when the element is observed. Combine with `scroll-trigger` to defer until in-view.

```jsx
<div className="animate-fade-in">           {/* opacity 0→1 */}
<div className="animate-slide-up">          {/* y 60→0, opacity 0→1 */}
<div className="animate-slide-down">        {/* y -60→0 */}
<div className="animate-slide-left">        {/* x 80→0 */}
<div className="animate-slide-right">       {/* x -80→0 */}
<div className="animate-scale-in">          {/* scale 0→1, back.out */}
<div className="animate-scale-in-sm">       {/* scale 0.8→1 */}
<div className="animate-zoom-in">           {/* scale 1.2→1 */}
<div className="animate-pop">               {/* scale 0.5→1, elastic */}
<div className="animate-balloon">           {/* scale 0→1, elastic long */}
<div className="animate-blur-in">           {/* blur 12px→0 */}
<div className="animate-flip-in">           {/* rotationY -90→0 */}
<div className="animate-flip-in-x">        {/* rotationX -90→0 */}
<div className="animate-spin-in">           {/* rotation -180, scale 0→1 */}
<div className="animate-bounce-in">         {/* bounce easing */}
<div className="animate-spring-in">         {/* elastic scale */}
<div className="animate-clip-up">           {/* clipPath reveal bottom→top */}
<div className="animate-clip-left">         {/* clipPath reveal right→left */}
<div className="animate-wipe-in">           {/* scaleX 0→1, origin left */}
<div className="animate-curtain">           {/* scaleY 0→1, origin top */}
<div className="animate-materialize">       {/* opacity + scale + blur */}
<div className="animate-perspective-in">    {/* 3D rotationX + z */}
<div className="animate-swoop-in">          {/* y + rotation sweep */}
<div className="animate-slam">              {/* y drop, scale 1.1→1 */}
<div className="animate-rise">             {/* y + scale + opacity */}
<div className="animate-levitate">          {/* slow soft rise */}
```

Size and speed variants:
```jsx
<div className="animate-fade-in-fast">
<div className="animate-fade-in-slow">
<div className="animate-slide-up-sm">
<div className="animate-slide-up-lg">
<div className="animate-blur-in-sm">
<div className="animate-blur-in-lg">
<div className="animate-scale-in-lg">
<div className="animate-scale-out-sm">
```

Directional slide-in (full 100% travel):
```jsx
<div className="animate-slide-in-top">     {/* from y -100% */}
<div className="animate-slide-in-bottom">  {/* from y 100% */}
<div className="animate-slide-in-left">    {/* from x -100% */}
<div className="animate-slide-in-right">   {/* from x 100% */}
```

### Hover

Applied with `mouseenter` / `mouseleave`. All hover animations automatically reverse on mouse leave.

```jsx
<div className="hover-lift">          {/* y -8 */}
<div className="hover-lift-sm">       {/* y -4 */}
<div className="hover-lift-lg">       {/* y -12 */}
<div className="hover-sink">          {/* y +4 */}
<div className="hover-float">         {/* y -6, slower */}
<div className="hover-scale">         {/* scale 1.05 */}
<div className="hover-scale-sm">      {/* scale 1.02 */}
<div className="hover-scale-lg">      {/* scale 1.1, back */}
<div className="hover-scale-xl">      {/* scale 1.15, back */}
<div className="hover-shrink">        {/* scale 0.97 */}
<div className="hover-grow">          {/* scale 1.08, back */}
<div className="hover-glow">          {/* blue box-shadow */}
<div className="hover-glow-primary">  {/* primary color glow */}
<div className="hover-glow-secondary">{/* secondary color glow */}
<div className="hover-glow-success">  {/* green glow */}
<div className="hover-glow-error">    {/* red glow */}
<div className="hover-shadow-lg">     {/* elevated shadow + lift */}
<div className="hover-bright">        {/* brightness 1.08 */}
<div className="hover-dim">           {/* brightness 0.9 */}
<div className="hover-saturate">      {/* saturate 1.3 */}
<div className="hover-rotate">        {/* rotation 5° */}
<div className="hover-rotate-lg">     {/* rotation 15° */}
<div className="hover-tilt">          {/* rotationY 10° */}
<div className="hover-spin">          {/* rotation 360° */}
<div className="hover-bob">           {/* y -4 yoyo ×1 */}
<div className="hover-pulse">         {/* scale 1.05 yoyo ×1 */}
<div className="hover-shake">         {/* x ±3 fast repeat */}
<div className="hover-wobble">        {/* rotation ±5 repeat */}
<div className="hover-jello">         {/* scaleX/Y squish */}
<div className="hover-heartbeat">     {/* scale 1.15 yoyo repeat */}
<div className="hover-fade">          {/* opacity 0.7 */}
<div className="hover-x">             {/* x +4 */}
<div className="hover-x-neg">         {/* x -4 */}
```

### Active / Click

Applied with `mousedown` / `mouseup`.

```jsx
<button className="active-press">        {/* scale 0.95 */}
<button className="active-press-sm">     {/* scale 0.97 */}
<button className="active-press-lg">     {/* scale 0.9 */}
<button className="active-press-xl">     {/* scale 0.85 */}
<button className="active-bounce">       {/* scale 0.9, back.out */}
<button className="active-push">         {/* y +2 */}
<button className="active-push-lg">      {/* y +4 */}
<button className="active-inset">        {/* scale + inner shadow */}
<button className="active-dim">          {/* opacity 0.8 */}
<button className="active-dim-strong">   {/* opacity 0.6 */}
<button className="active-highlight">    {/* brightness 1.1 */}
<button className="active-darken">       {/* brightness 0.85 */}
<button className="active-rotate">       {/* rotation 90° */}
<button className="active-spin">         {/* rotation 180° */}
<button className="active-shake">        {/* x ±3 repeat */}
<button className="active-click">        {/* scale yoyo snap */}
```

### Scroll Trigger

Add `scroll-trigger` alongside any entrance animation to defer it until the element enters the viewport.

```jsx
{/* Entrance deferred to scroll */}
<div className="animate-fade-in scroll-trigger">
<div className="animate-slide-up scroll-trigger">
<div className="animate-scale-in scroll-trigger">

{/* Scroll-specific presets — entrance + trigger combined */}
<div className="scroll-fade-in">       {/* opacity + y 30→0, start top 85% */}
<div className="scroll-fade-up">       {/* opacity + y 50→0, start top 85% */}
<div className="scroll-fade-down">     {/* opacity + y -50→0 */}
<div className="scroll-fade-left">     {/* opacity + x 60→0 */}
<div className="scroll-fade-right">    {/* opacity + x -60→0 */}
<div className="scroll-fade-in-sm">    {/* subtle, y 15 */}
<div className="scroll-fade-in-lg">    {/* dramatic, y 80 */}
<div className="scroll-slide-up">      {/* y 80→0 */}
<div className="scroll-slide-up-lg">   {/* y 150→0 */}
<div className="scroll-slide-left">
<div className="scroll-slide-right">
<div className="scroll-scale-in">      {/* scale 0.85→1 */}
<div className="scroll-scale-in-sm">   {/* scale 0.95→1 */}
<div className="scroll-scale-out">     {/* scale 1.1→1 */}
<div className="scroll-pop">           {/* elastic scale */}
<div className="scroll-spring">        {/* elastic.out */}
<div className="scroll-blur-in">       {/* blur 12→0 */}
<div className="scroll-rise">          {/* y + scale + opacity */}
<div className="scroll-flip-in">       {/* 3D rotationX */}
<div className="scroll-clip-up">       {/* clipPath reveal */}
<div className="scroll-materialize">   {/* opacity + scale + blur */}
```

Trigger position variants:
```jsx
<div className="animate-fade-in scroll-trigger">          {/* default: top 80% */}
<div className="animate-fade-in scroll-trigger-top">      {/* top 90% — earlier */}
<div className="animate-fade-in scroll-trigger-mid">      {/* top 60% — later */}
<div className="animate-fade-in scroll-trigger-late">     {/* top 40% — very late */}
```

### Scroll Scrub / Parallax

Scrub animations tie directly to scroll position with no snap.

```jsx
<div className="scroll-scrub">          {/* raw scroll-linked */}
<div className="scroll-scrub-fast">     {/* scrub: 0.3 */}
<div className="scroll-scrub-slow">     {/* scrub: 2 */}
<div className="scroll-parallax-y">     {/* y -20% → 20% */}
<div className="scroll-parallax-up">    {/* y 0% → -30% */}
<div className="scroll-parallax-dn">    {/* y 0% → 30% */}
<div className="scroll-parallax-x">     {/* x -10% → 10% */}
<div className="scroll-parallax-scale"> {/* scale 1 → 1.2 */}
<div className="scroll-parallax-rotate">{/* rotation 0 → 30° */}
<div className="scroll-parallax-fade">  {/* opacity 1 → 0 on exit */}
<div className="scroll-zoom">           {/* scale 1 → 1.3 scrub */}
<div className="scroll-zoom-out">       {/* scale 1.3 → 1 scrub */}
<div className="scroll-rotate-scrub">   {/* rotation ±10° scrub */}
<div className="scroll-unblur">         {/* blur 10→0 scrub */}
<div className="scroll-brightness">     {/* brightness 0.5→1 scrub */}
<div className="scroll-pin">            {/* pin for 300% scroll */}
<div className="scroll-pin-sm">         {/* pin for 100% scroll */}
```

### Stagger

Apply to a parent. All direct children animate in sequence.

```jsx
<ul className="stagger-up">             {/* children y 20→0 */}
<ul className="stagger-up-sm">          {/* y 10, fast */}
<ul className="stagger-up-lg">          {/* y 40, slower */}
<ul className="stagger-fade">           {/* opacity only */}
<ul className="stagger-fade-fast">
<ul className="stagger-left">           {/* x 20→0 */}
<ul className="stagger-right">          {/* x -20→0 */}
<ul className="stagger-scale">          {/* scale 0.8→1 */}
<ul className="stagger-pop">            {/* elastic scale */}
<ul className="stagger-blur">           {/* blur 8→0 */}
<ul className="stagger-flip">           {/* rotationY -60→0 */}
<ul className="stagger-rise">           {/* y + scale + opacity */}

{/* Named delay variants */}
<ul className="stagger-children-50">    {/* 50ms between each */}
<ul className="stagger-children-100">   {/* 100ms */}
<ul className="stagger-children-150">   {/* 150ms */}
<ul className="stagger-children-200">   {/* 200ms */}
```

#### Stagger + Scroll

Stagger the children when the parent scrolls into view:

```jsx
<ul className="scroll-stagger-up">
<ul className="scroll-stagger-fade">
<ul className="scroll-stagger-left">
<ul className="scroll-stagger-right">
<ul className="scroll-stagger-scale">
<ul className="scroll-stagger-pop">
<ul className="scroll-stagger-flip">
<ul className="scroll-stagger-blur">
```

### Gestures

Gesture animations are interaction-specific and designed for touch + pointer UX.

**Press / Click:**
```jsx
<div className="gesture-press">           {/* scale 0.94 on active */}
<div className="gesture-press-hard">      {/* scale 0.88 */}
<div className="gesture-press-light">     {/* scale 0.97 */}
<div className="gesture-push">            {/* y +2, scale 0.98 */}
<div className="gesture-click">           {/* scale + inner shadow */}
<div className="gesture-click-bounce">    {/* back.out scale */}
<div className="gesture-tap">             {/* opacity + scale flash */}
<div className="gesture-hold">            {/* ring on hold */}
<div className="gesture-hold-grow">       {/* slow scale up on hold */}
```

**Drag:**
```jsx
<div className="gesture-drag">            {/* scale up + shadow + slight rotation */}
<div className="gesture-drag-flat">       {/* subtle lift */}
<div className="gesture-drag-ghost">      {/* opacity drop */}
<div className="gesture-drag-snap">       {/* more dramatic */}
<div className="gesture-drag-rotate">     {/* rotation 5° */}
```

**Swipe:**
```jsx
<div className="gesture-swipe-left">
<div className="gesture-swipe-right">
<div className="gesture-swipe-up">
<div className="gesture-swipe-down">
<div className="gesture-swipe-dismiss">   {/* x 100%, opacity 0 */}
<div className="gesture-swipe-dismiss-left">
<div className="gesture-swipe-reveal">    {/* x 80 */}
```

**Pinch:**
```jsx
<div className="gesture-pinch-in">
<div className="gesture-pinch-out">
<div className="gesture-pinch-zoom">
<div className="gesture-pinch-close">
```

**Pull:**
```jsx
<div className="gesture-pull-down">
<div className="gesture-pull-up">
<div className="gesture-pull-left">
<div className="gesture-pull-right">
<div className="gesture-pull-to-refresh">
<div className="gesture-pull-stretch">
<div className="gesture-pull-rubber">
```

**Long Press:**
```jsx
<div className="gesture-longpress">
<div className="gesture-longpress-shake">
<div className="gesture-longpress-glow">
<div className="gesture-longpress-pulse">
```

**Focus:**
```jsx
<input className="gesture-focus">           {/* ring on hover/focus */}
<input className="gesture-focus-glow">      {/* ring + outer glow */}
<input className="gesture-focus-lift">      {/* ring + y -2 */}
```

**Hover (pointer-aware):**
```jsx
<div className="gesture-hover-lift">
<div className="gesture-hover-scale">
<div className="gesture-hover-tilt">        {/* 3D rotationX + Y */}
<div className="gesture-hover-glow">
<div className="gesture-hover-x">
<div className="gesture-hover-bob">         {/* infinite bounce */}
<div className="gesture-hover-spin">
<div className="gesture-hover-flip">        {/* rotationY 180° */}
<div className="gesture-hover-wiggle">
<div className="gesture-hover-pulse">       {/* infinite pulse */}
<div className="gesture-hover-breathe">     {/* infinite gentle scale */}
<div className="gesture-hover-shake">
```

**Haptic:**
```jsx
<div className="gesture-haptic">         {/* x ±2 rapid repeat */}
<div className="gesture-haptic-hard">    {/* x ±4 longer repeat */}
<div className="gesture-haptic-soft">    {/* x ±1 short */}
<div className="gesture-haptic-y">       {/* y ±2 rapid repeat */}
```

**Selection / Drop / Double tap:**
```jsx
<div className="gesture-select">
<div className="gesture-check">
<div className="gesture-drop-accept">      {/* green ring */}
<div className="gesture-drop-reject">      {/* shake + red ring */}
<div className="gesture-drop-zone">        {/* hover ring glow */}
<div className="gesture-doubletap">        {/* scale up + fade */}
<div className="gesture-doubletap-like">   {/* heart-pop */}
<div className="gesture-ripple">
<div className="gesture-spring-press">     {/* elastic collapse */}
```

**Scroll-linked gesture:**
```jsx
<div className="gesture-scroll-highlight">  {/* opacity 0.3→1 scrub */}
<div className="gesture-scroll-dim">        {/* opacity 1→0.3 on exit */}
<div className="gesture-scroll-rise">       {/* y + opacity scrub */}
```

### Looping

Continuous animations that run forever:

```jsx
<div className="animate-pulse">         {/* opacity 1→0.4 yoyo */}
<div className="animate-pulse-scale">   {/* scale 1→1.06 yoyo */}
<div className="animate-ping">          {/* scale + opacity out */}
<div className="animate-bounce">        {/* y -12 yoyo */}
<div className="animate-float">         {/* y -10 slow sine */}
<div className="animate-spin">          {/* rotation 360 */}
<div className="animate-spin-slow">     {/* 3s */}
<div className="animate-spin-fast">     {/* 0.4s */}
<div className="animate-spin-rev">      {/* counter-clockwise */}
<div className="animate-wiggle">        {/* rotation ±5 repeat */}
<div className="animate-shake">         {/* x ±6 rapid */}
<div className="animate-breathe">       {/* scale 1→1.04 sine */}
<div className="animate-heartbeat">     {/* scale 1.15 with pause */}
<div className="animate-flicker">       {/* opacity on/off */}
<div className="animate-blink">         {/* smooth opacity blink */}
<div className="animate-sway">          {/* rotation ±3 slow */}
<div className="animate-rock">          {/* rotation ±8 fast */}
<div className="animate-jello">         {/* squish elastic */}
<div className="animate-orbit">         {/* rotation around origin */}
<div className="animate-drift">         {/* slow xy wander */}
<div className="animate-shimmer">       {/* background-position sweep */}
<div className="animate-morph">         {/* border-radius organic */}
<div className="animate-ripple">        {/* scale + fade ring */}
```

### Exit / Out

Animate elements out — combine with JS to remove after completion:

```jsx
<div className="exit-fade">
<div className="exit-fade-up">
<div className="exit-fade-down">
<div className="exit-fade-left">
<div className="exit-fade-right">
<div className="exit-scale">           {/* scale 1→0.8 */}
<div className="exit-scale-up">        {/* scale 1→1.2 */}
<div className="exit-slide-up">        {/* y 0→-100% */}
<div className="exit-slide-down">
<div className="exit-slide-left">
<div className="exit-slide-right">
<div className="exit-blur">
<div className="exit-flip">
<div className="exit-collapse">        {/* scaleY 0 */}
<div className="exit-squeeze">         {/* scaleX 0 */}
<div className="exit-dissolve">        {/* blur + desaturate */}
<div className="exit-implode">         {/* scale 0 back.in */}
```

### Animation Modifiers

Stack modifier classes to adjust any animation's timing:

```jsx
{/* Duration — class name */}
<div className="animate-fade-in duration-fast">     {/* 150ms */}
<div className="animate-fade-in duration-normal">   {/* 300ms */}
<div className="animate-fade-in duration-slow">     {/* 500ms */}
<div className="animate-fade-in duration-slower">   {/* 800ms */}

{/* Duration — numeric ms */}
<div className="animate-fade-in duration-100">
<div className="animate-fade-in duration-300">
<div className="animate-fade-in duration-1000">

{/* Delay */}
<div className="animate-slide-up delay-0">
<div className="animate-slide-up delay-100">
<div className="animate-slide-up delay-200">
<div className="animate-slide-up delay-500">

{/* Easing */}
<div className="animate-scale-in ease-bouncy">
<div className="animate-pop ease-smooth">
<div className="animate-slide-up ease-back">
<div className="animate-fade-in ease-linear">
```

### Inline Props Syntax

Override any property inline without a custom animation definition using `{...}` notation:

```jsx
{/* Override timing */}
<div className="animate-fade-in{duration:1.5,ease:elastic.out(1,0.3)}">

{/* Override scroll trigger position */}
<div className="scroll-fade-in{start:top_60%,end:center_center}">

{/* Scrub with custom from/to */}
<div className="scroll-scrub{from:opacity_0_y_100,to:opacity_1_y_0}">

{/* Pin for custom scroll distance */}
<div className="scroll-pin{start:top_top,end:+=800px}">

{/* Stagger timing */}
<div className="stagger-up{stagger:0.05,duration:0.4}">
```

### Target Syntax

Hover/active animations can target a different element:

```jsx
{/* Target a child */}
<div className="hover-lift{>.card-image}">
  <img className="card-image" />
</div>

{/* Target next sibling */}
<button className="hover-glow{+.tooltip}">
  <span className="tooltip">Tooltip</span>
</button>

{/* Target all direct children (stagger) */}
<div className="hover-scale{children}">
  <div></div>
  <div></div>
</div>

{/* Target self explicitly */}
<div className="hover-lift{.self}">
```

### data-gsap-* Overrides

Override animation properties via HTML data attributes — useful in templates where you can't use `{}` syntax:

```html
<div class="animate-fade-in"
     data-gsap-duration="2000"
     data-gsap-delay="500"
     data-gsap-ease="elastic.out(1, 0.3)"
     data-gsap-y="-40"
     data-gsap-opacity="0.5">
```

---

## Static Utilities

Boolean classes with no token needed. All included at all times.

### Display
```jsx
display:flex  display:flex-inline  display:grid  display:grid-inline
display:block  display:block-inline  display:inline  display:none
display:contents  display:flow-root  display:ruby  display:subgrid
```

### Flex
```jsx
flex-dir:row  flex-dir:col  flex-dir:row-rev  flex-dir:col-rev
flex-wrap:yes  flex-wrap:no  flex-wrap:rev
```

### Alignment
```jsx
align-x:start  align-x:end  align-x:center  align-x:between  align-x:around  align-x:evenly
align-xi:start  align-xi:center  align-xi:stretch
align-y:start  align-y:center  align-y:between  align-y:stretch
align-yi:start  align-yi:end  align-yi:center  align-yi:stretch  align-yi:baseline
align-ys:start  align-ys:end  align-ys:center  align-ys:stretch
place:center  place:between  place-i:center  place-s:center
```

### Position
```jsx
pos:relative  pos:absolute  pos:fixed  pos:sticky  pos:static
```

### Overflow
```jsx
overflow:hidden  overflow:auto  overflow:scroll  overflow:visible  overflow:clip
overflow-x:hidden  overflow-x:auto  overflow-x:scroll
overflow-y:hidden  overflow-y:auto  overflow-y:scroll
```

### Cursor
```jsx
cursor:pointer  cursor:default  cursor:text  cursor:move
cursor:grab  cursor:grabbing  cursor:not-allowed  cursor:wait
cursor:crosshair  cursor:zoom-in  cursor:zoom-out  cursor:none
```

### Text
```jsx
text-align:left  text-align:center  text-align:right  text-align:justify
text-align:start  text-align:end
text-case:upper  text-case:lower  text-case:capital  text-case:none
text-overflow:clip  text-overflow:dots
text-wrap:balance  text-wrap:pretty  text-wrap:stable  text-wrap:nowrap
wrap:normal  wrap:no  wrap:pre  wrap:pre-wrap
text-decor:none  text-decor:under  text-decor:over  text-decor:strike
```

### Font
```jsx
type-style:normal  type-style:italic  type-style:oblique
type-weight:thin  type-weight:light  type-weight:normal
type-weight:medium  type-weight:semi  type-weight:bold  type-weight:black
type-smooth:anti  type-smooth:sub  type-smooth:auto
```

### Transforms (CSS)
```jsx
move:x_y         {/* translate: x y */}
move-x:40px      {/* translate: 40px 0 */}
move-y:-20%      {/* translate: 0 -20% */}
spin:45deg       {/* rotate: 45deg */}
spin-x:15deg
spin-y:30deg
scale:1.2
scale-x:1.5
scale-y:0.8
skew-x:5deg
skew-y:3deg
origin:top_left  {/* transform-origin: top left */}
depth-view:1000px
```

### Transitions (CSS)
```jsx
ease:fast         {/* transition: all 150ms smooth */}
ease:normal       {/* transition: all 300ms smooth */}
ease:slow         {/* transition: all 500ms smooth */}
ease-speed:fast
ease-curve:bouncy
ease-wait:200
ease-prop:opacity_transform
ease:default      {/* transition: all var(--duration-normal) var(--ease-smooth) */}
```

### CSS Animation
```jsx
play-name:myAnim
play-speed:normal
play-curve:bouncy
play-loop:infinite  play-loop:3
play-wait:200
play-state:running  play-state:paused
play-fill:forwards  play-fill:both
play-dir:reverse  play-dir:alternate
```

### Borders / Strokes
```jsx
stroke-style:solid  stroke-style:dashed  stroke-style:dotted  stroke-style:none
stroke-color:primary  stroke-color:neutral-200
stroke-width:thin  stroke-width:base  stroke-width:thick
stroke-top:neutral-200  stroke-y-end:neutral-100  {/* individual sides */}
stroke-x-start:primary
ring-color:primary  ring-width:base  ring-style:solid  ring-offset:2px
```

### Misc
```jsx
select:none  select:text  select:all
events:none  events:all  events:auto
touch:none  touch:pan-x  touch:pan-y  touch:pinch-zoom  touch:manipulation
scroll:smooth  scroll:auto
overscroll:none  overscroll:contain
float:left  float:right  clear:both
canvas-show:visible  canvas-show:hidden
canvas-fit:cover  canvas-fit:contain  canvas-fit:fill
canvas-box:border  canvas-box:content
```

---

## Responsive Variants

All utilities and patterns get responsive prefixes when `rules.responsive: true`.

```jsx
<div className="display:none md:display:flex">         {/* hidden mobile, flex tablet+ */}
<div className="flex-dir:col lg:flex-dir:row">         {/* stack → row */}
<div className="canvas-w:full xl:canvas-w:1280px">
<div className="text:body lg:text:xl">
<div className="pad:sm md:pad:lg xl:pad:2xl">
<h1 className="text:h3 md:text:h2 lg:text:h1">
```

Default breakpoints (overridable in `rules.breakpoints`):
```
xs: 480px  |  sm: 640px  |  md: 768px  |  lg: 1024px  |  xl: 1280px  |  2xl: 1536px  |  3xl: 1920px
```

---

## State Variants

When `rules.states: true` (default):

```jsx
<div className="hover:paint:primary-600">
<input className="focus:stroke-color:primary">
<div className="disabled:canvas-fade:muted">
<li className="active:paint:primary-100">
<div className="checked:paint:primary">
<li className="first:pad-top:0">
<li className="last:pad-btm:0">
<li className="odd:paint:neutral-50">
<li className="even:paint:white">
<a className="visited:ink:secondary">
<div className="before:content:'' before:canvas-w:full">
<div className="placeholder:ink:neutral-400">
```

---

## Dark Mode

```js
rules: { darkMode: 'class' }  // or 'media'
```

```jsx
{/* Class strategy — toggle .dark on <html> */}
<div className="paint:white dark:paint:neutral-900">
<p  className="ink:neutral-900 dark:ink:white">

<button onClick={() => document.documentElement.classList.toggle('dark')}>
  Toggle
</button>

{/* Media strategy — follows OS preference */}
```

---

## Container Queries

Containers respond to their own width, not the viewport.

```js
rules: {
  containers: {
    card:    { sm: '300px', md: '500px', lg: '700px' },
    sidebar: { collapsed: '200px', expanded: '320px' },
    hero:    { sm: '480px', md: '768px', lg: '1100px' },
  }
}
```

```jsx
{/* Mark the container */}
<div className="frame-type:inline frame-name:card">
  {/* Query it — @card-sm:pad:md means "when container 'card' ≥ 300px" */}
  <div className="@card-sm:pad:md @card-md:pad:xl @card-lg:display:grid">
```

---

## Print / Motion / Orientation

```jsx
{/* Print — rules.print: true */}
<div className="print:display:none">           {/* hidden when printing */}
<div className="print:paint:white">

{/* Motion — rules.motion: true */}
<div className="motion-safe:animate-fade-in">  {/* only if user allows motion */}
<div className="motion-reduce:animate-none">

{/* Orientation — rules.orientation: true */}
<div className="landscape:flex-dir:row">
<div className="portrait:flex-dir:col">
```

---

## The Depth Engine

Mizumi's Depth Engine transforms flat z-index values into physically-plausible 3D lighting. Elements with higher `z-index` appear closer to a simulated light source — receiving more shadow, scale, brightness, and subtle blur automatically.

```js
depth: {
  strength:          0.4,
  perspective:       1000,
  perspectiveOrigin: '20% 50%',
  light: { x: 0, y: -1 },
  layers: 6,
  effects: {
    shadow:     true,
    scale:      true,
    brightness: true,
    blur:       false,
    saturate:   false,
  },
  zMap: {
    0:   0,     // base
    10:  1,     // float
    20:  2,     // sticky
    100: 3,     // modal
    200: 4,     // popover
    999: 5,     // top
  }
}
```

Use z-index tokens as normal — depth is applied automatically:

```jsx
<div className="layer:base">    {/* flat */}
<div className="layer:float">   {/* elevated */}
<div className="layer:modal">   {/* high — brighter, bigger shadow */}
<div className="layer:top">     {/* highest depth layer */}
```

Add `mizumi-depth-runtime.js` to enable the live 3D parallax mouse-tracking effect.

---

## DevTools

The Vite plugin auto-injects `mizumi-devtools.js` in development only. Zero production footprint.

**Activate:** Hover any element on the page → the panel appears. Or press `Alt+M` to toggle.

**Features:**
- **Classes tab** — shows all Mizumi classes on the hovered element, which ones are patterns, which have state variants
- **Computed tab** — shows the resolved CSS properties the element's classes produce
- **Add tab** — live-add classes to the hovered element; writes back to source via `/__mizumi_write` endpoint
- **Pin mode** — click to lock the panel to a specific element while you work
- **Drag** — move the panel anywhere on screen
- **Source write-back** — the panel can write your updated `className` back to the React source file automatically, using the React Fiber debug information (`__reactFiber`)
- `Esc` to close

---

## .mizu Files

For designers who think in CSS syntax rather than JS objects. `.mizu` files are parsed and merged into your config automatically by both the Vite plugin and CLI.

```css
/* styles.mizu — place anywhere in your project */

@token {
  colors {
    primary: #3B82F6;
    surface: #FFFFFF;
    neutral {
      50:  #F9FAFB;
      500: #6B7280;
      900: #111827;
    }
  }
  spacing {
    sm: 8px;
    md: 16px;
    lg: 24px;
  }
  radius {
    md: 8px;
    lg: 12px;
    full: 9999px;
  }
}

@pattern card {
  pad: md;
  paint: surface;
  curve: lg;
  cast: md;
}

@pattern btn-primary extends card {
  paint: primary;
  ink: white;
}

@animate hover-lift {
  hover {
    move-y: -8px;
    ease-speed: fast;
    ease-curve: smooth;
  }
}

@rule {
  responsive: true;
  darkMode: class;
  containers {
    card { sm: 300px; md: 500px; }
  }
}
```

Multiple `.mizu` files anywhere in your project are auto-discovered, parsed, and merged. Use `mizumi.config.js` for tokens + JS conditions, `.mizu` for visual design values.

---

## TypeScript & JS Helpers

The build generates `mizumi.d.ts` and `mizumi-helpers.js` automatically.

### TypeScript

```tsx
import type { MizumiClasses } from './.mizumi/mizumi'

function Card({ className }: { className?: MizumiClasses }) {
  return <div className={`card ${className}`} />
}

// Type error if you pass a non-existent class:
<Card className="card-elevated" />          // ✅
<Card className="bg-blue-500" />            // ❌ type error
```

### mizu() Helper

```js
import { mizu } from './.mizumi/mizumi-helpers.js'

// Filters falsy, joins with space — like clsx but Mizumi-aware
const classes = mizu(
  'card',
  isHovered && 'cast:xl',
  isSelected ? 'stroke-color:primary stroke-width:base' : null,
  'animate-fade-in'
)
// → "card cast:xl animate-fade-in"
```

### cx() Helper — Object Syntax

```js
import { cx } from './.mizumi/mizumi-helpers.js'

const classes = cx(
  'btn-primary',
  {
    'cast:xl':       isHovered,
    'canvas-fade:muted': isDisabled,
    'cursor:not-allowed': isDisabled,
  }
)
```

### isMizumiClass()

```js
import { isMizumiClass } from './.mizumi/mizumi-helpers.js'

isMizumiClass('pad:md')           // true
isMizumiClass('hover:paint:primary-600')  // true
isMizumiClass('p-4')              // false (Tailwind)
isMizumiClass('padding: 16px')    // false (raw CSS)
```

---

## Rules Reference

```js
rules: {
  // Variant generation
  responsive:  true,          // sm: md: lg: xl: 2xl: prefixes
  darkMode:    'class',       // 'class' | 'media' | false
  states:      true,          // hover: focus: active: etc.
  print:       true,          // print: prefix
  motion:      true,          // motion-safe: motion-reduce:
  orientation: true,          // landscape: portrait:

  // Breakpoints
  breakpoints: {
    xs:    '480px',
    sm:    '640px',
    md:    '768px',
    lg:    '1024px',
    xl:    '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },

  // Named container queries
  containers: {
    card:    { sm: '300px', md: '500px', lg: '700px' },
    sidebar: { collapsed: '200px', expanded: '320px' },
    // ... any name you want
  },
}
```

---

## CLI

```bash
# Initialize project — creates mizumi.config.js + styles.mizu
npx mizumi init

# Build CSS, runtime, types, meta
npx mizumi build

# Build + watch for changes
npx mizumi watch

# Validate your config — catches raw CSS, Tailwind classes, unknown capabilities
npx mizumi validate

# Design system health report — token coverage, pattern usage, size analysis
npx mizumi analyze

# Convert a Tailwind string to Mizumi vocabulary
npx mizumi convert "p-4 bg-blue-500 flex items-center rounded-lg"

# Generate HTML documentation from your config
npx mizumi docs

# Sync packages/core/defaults.js into the engine (package development)
node packages/cli/index.js sync:defaults

# Add a pattern to defaults.js
node packages/cli/index.js add:pattern card-feature

# Add a token to defaults.js
node packages/cli/index.js add:token colors.brand

# Add an animation to defaults.js
node packages/cli/index.js add:animation scroll-reveal
```

---

## Full Token Reference

### Colors

22 full-scale palettes: `primary`, `secondary`, `accent`, `neutral`, `slate`, `zinc`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `pink`, `rose`

Each palette has shades: `50 100 200 300 400 500 600 700 800 900 950` plus `DEFAULT`

Semantic: `success`, `error`, `warning`, `info` (each with `DEFAULT`, `light`, `dark`)

Special: `surface`, `ink`, `white`, `black`, `transparent`, `current`, `inherit`

### Spacing

Numeric: `0 px 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 52 56 60 64 72 80 96`

Named: `xs sm md lg xl 2xl 3xl 4xl 5xl 6xl 7xl`

Semantic: `none auto half third quarter fifth sixth full`

### Typography Scales

Display: `display2xl displayXl displayLg displayMd displaySm`

Headings: `h1 h2 h3 h4 h5 h6`

Body: `xl lg body md sm small xs 2xs`

Functional: `label caption overline code mono`

### Duration

Numeric ms: `0 50 75 100 150 200 250 300 350 400 500 600 700 750 800 900 1000 1200 1500 2000`

Named: `instant snap fast quick normal moderate slow slower sluggish lazy`

### Easing

Standard: `linear smooth ease ease-in ease-out ease-in-out`

Expressive: `bouncy elastic spring sharp back`

Material: `standard emphasized decelerate accelerate`

Full families: `sine quad cubic quart expo circ back` — each with `-in -out -in-out` variants

### Opacity

Numeric: `0 5 10 15 20 25 30 40 50 60 70 75 80 90 95 100`

Named: `invisible ghost faint muted soft strong full`

### Z-Index

Numeric: `0 10 20 30 40 50 75 100 200 300 400 500 999 9999`

Named: `auto base raised float overlay sticky fixed drawer modal popover toast tooltip top crown`

---

## Full Pattern Library

**Layout:** `flex flex-col flex-row flex-center flex-between flex-around flex-evenly flex-wrap stack row cluster cover repel frame grid grid-1 through grid-12 grid-auto-sm/md/lg/xl`

**Containers:** `container container-sm/md/lg/xl/2xl container-narrow container-wide container-prose section section-sm/lg/xl page hero hero-half wrapper bleed inset inset-sm/lg/xl inset-x inset-y`

**Positioning:** `absolute-center absolute-fill absolute-top absolute-bottom fixed-top fixed-bottom fixed-center sticky-top sticky-bottom overlay-fill`

**Cards:** `card card-sm/lg/xl card-elevated card-flat card-hover card-outline card-ghost card-glass card-dark card-feature card-compact card-media card-interactive card-pricing card-stat card-testimonial card-profile card-blog card-product card-job card-notification card-empty card-success card-error card-warning card-info panel panel-sm/lg`

**Buttons:** `button btn-sm/md/lg/xl btn-icon btn-icon-sm/lg/round btn-full btn-primary btn-secondary btn-accent btn-success btn-error btn-danger btn-warning btn-info btn-ghost btn-ghost-secondary btn-ghost-neutral btn-ghost-white btn-text btn-neutral btn-dark btn-white btn-glass btn-gradient btn-link btn-pill btn-pill-primary btn-square btn-loading btn-disabled`

**Inputs:** `input input-sm/lg input-ghost input-flush input-error input-success input-disabled textarea textarea-sm/lg select checkbox radio toggle label label-sm label-error label-success field field-row field-group input-group input-addon form form-sm form-row form-actions`

**Navigation:** `nav nav-bar nav-bar-dark nav-bar-glass nav-item nav-item-active nav-link nav-link-active nav-brand sidebar-nav sidebar-item sidebar-item-active sidebar-section breadcrumb tab-list tab tab-active tab-panel tabs-pill tab-pill tab-pill-active menu menu-item menu-item-danger menu-divider`

**Typography:** `heading heading-display heading-lg/md/sm/xs subheading eyebrow overline caption text-muted text-subtle text-faint text-label text-link text-link-muted text-mono text-code prose prose-sm/lg lead quote code-block kbd strike underline no-underline italic bold truncate clamp-1/2/3`

**Badges & Tags:** `badge badge-sm/lg badge-primary/secondary/accent/success/error/warning/info/neutral/dark/outline badge-dot tag tag-removable pill chip chip-active`

**Avatars & Media:** `avatar avatar-xs/sm/md/lg/xl avatar-square avatar-group avatar-initials media media-16-9 media-4-3 media-1-1 media-3-2 media-21-9 cover contain thumbnail thumbnail-lg icon icon-sm/lg/xl`

**Modals & Overlays:** `modal-backdrop modal modal-sm/md/lg/xl/full modal-header modal-body modal-footer drawer drawer-sm/md/lg drawer-header drawer-body drawer-footer popup tooltip tooltip-light popover sheet overlay overlay-light overlay-blur overlay-gradient scrim`

**Alerts & Feedback:** `alert alert-info/success/error/warning/neutral/dark toast toast-success/error/warning/info banner banner-primary/warning/error callout callout-info/warning/tip notice notice-info/warning empty-state error-state loading-state`

**Progress & Loading:** `progress-bar progress-fill progress-sm/lg spinner spinner-sm/lg skeleton skeleton-text/title/avatar/card loader dot-loader dot pulse`

**Surfaces:** `surface surface-sm/lg surface-raised surface-sunken surface-tinted surface-dark surface-glass glass glass-sm/lg glass-card glass-dark frosted matte mirror`

**Data & Lists:** `list list-sm/md/lg list-divided list-item list-item-divided list-item-action list-item-sm data-list data-item data-label data-value dl-term dl-def`

**Tables:** `table table-header table-th table-row table-row-hover table-td table-td-action table-foot`

**Components:** `kpi kpi-value kpi-label kpi-up kpi-down stat stat-value stat-label feature feature-icon feature-title feature-desc testimonial testimonial-body testimonial-author pricing-tier pricing-header pricing-amount pricing-price pricing-period pricing-features pricing-feature timeline timeline-item timeline-dot faq faq-item faq-question faq-answer step step-number step-content`

**Effects:** `glow glow-sm/lg glow-primary/secondary/success/error ring ring-sm/thick ring-focus ring-error ring-success shadow-none shadow-sm/md/lg/xl/2xl`

**Utilities:** `sr-only not-sr-only clearfix isolate reset box-border box-content select-none select-all pointer not-allowed no-events no-wrap break-word antialiased disabled interactive hoverable pressable draggable`

---

## Philosophy

**1. Token-first, always.** One value defined in one place. The CSS variable, the utility class, the TypeScript type, and the GSAP token resolution all come from the same source.

**2. Mizumi vocabulary, not CSS shorthand.** `pad:md` is not `p-4`. The capability name is a designer concept. The colon separates intent from value. Raw values pass through anywhere — `pad:24px`, `canvas-w:min(100%,800px)`, `ink:#FF0000` — no arbitrary variant syntax needed.

**3. Patterns compose without repetition.** `btn-primary` extends `button`. `card-elevated` extends `card`. The engine resolves conflicts so the last capability wins at the CSS property level, not the class level.

**4. Animation is first-class.** GSAP is not bolted on. The runtime reads the exact same class names as the CSS engine. `hover-lift`, `scroll-fade-in`, `gesture-press`, `stagger-children-100` — all real GSAP timelines with full easing, scrub, ScrollTrigger, and targeting support.

**5. Zero enforced components.** No `<Button>`, no `<Card>`, no pre-built UI. Patterns are vocabulary, not components. You compose the HTML.

**6. Framework agnostic.** React, Vue, Svelte, Astro, plain HTML — if it can accept a class string, Mizumi works. The CSS output is a static file. The runtime is a self-contained IIFE.

---

*Mizumi (水海) — water sea. Flow, fluidity, and the seamless integration of design, structure, and motion.*