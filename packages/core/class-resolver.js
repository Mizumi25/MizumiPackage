// packages/core/class-resolver.js
// Single source of truth for ALL Mizumi vocabulary
// Mizumi naming: artistic, designer-first, conflict-free
// Syntax: capability:token or capability:value

// ============================================================
// STATIC UTILITIES
// Boolean classes — no token needed, just a value
// ============================================================
export const STATIC_UTILITIES = [

  // ── DISPLAY ──
  { class: 'display:flex',         css: 'display: flex;' },
  { class: 'display:flex-inline',  css: 'display: inline-flex;' },
  { class: 'display:grid',         css: 'display: grid;' },
  { class: 'display:grid-inline',  css: 'display: inline-grid;' },
  { class: 'display:block',        css: 'display: block;' },
  { class: 'display:inline',       css: 'display: inline;' },
  { class: 'display:block-inline', css: 'display: inline-block;' },
  { class: 'display:none',         css: 'display: none;' },
  { class: 'display:contents',     css: 'display: contents;' },
  { class: 'display:flow-root',    css: 'display: flow-root;' },
  { class: 'display:ruby',         css: 'display: ruby;' },
  { class: 'display:table',        css: 'display: table;' },
  { class: 'display:subgrid',      css: 'grid-template-columns: subgrid; grid-template-rows: subgrid;' },

  // ── FLEX DIRECTION ──
  { class: 'flex-dir:row',         css: 'flex-direction: row;' },
  { class: 'flex-dir:col',         css: 'flex-direction: column;' },
  { class: 'flex-dir:row-rev',     css: 'flex-direction: row-reverse;' },
  { class: 'flex-dir:col-rev',     css: 'flex-direction: column-reverse;' },

  // ── FLEX WRAP ──
  { class: 'flex-wrap:yes',        css: 'flex-wrap: wrap;' },
  { class: 'flex-wrap:no',         css: 'flex-wrap: nowrap;' },
  { class: 'flex-wrap:rev',        css: 'flex-wrap: wrap-reverse;' },

  // ── ALIGNMENT ──
  { class: 'align-x:start',        css: 'justify-content: flex-start;' },
  { class: 'align-x:end',          css: 'justify-content: flex-end;' },
  { class: 'align-x:center',       css: 'justify-content: center;' },
  { class: 'align-x:between',      css: 'justify-content: space-between;' },
  { class: 'align-x:around',       css: 'justify-content: space-around;' },
  { class: 'align-x:evenly',       css: 'justify-content: space-evenly;' },
  { class: 'align-xi:start',       css: 'justify-items: start;' },
  { class: 'align-xi:end',         css: 'justify-items: end;' },
  { class: 'align-xi:center',      css: 'justify-items: center;' },
  { class: 'align-xi:stretch',     css: 'justify-items: stretch;' },
  { class: 'align-xs:start',       css: 'justify-self: start;' },
  { class: 'align-xs:end',         css: 'justify-self: end;' },
  { class: 'align-xs:center',      css: 'justify-self: center;' },
  { class: 'align-xs:stretch',     css: 'justify-self: stretch;' },
  { class: 'align-y:start',        css: 'align-content: flex-start;' },
  { class: 'align-y:end',          css: 'align-content: flex-end;' },
  { class: 'align-y:center',       css: 'align-content: center;' },
  { class: 'align-y:between',      css: 'align-content: space-between;' },
  { class: 'align-y:stretch',      css: 'align-content: stretch;' },
  { class: 'align-yi:start',       css: 'align-items: flex-start;' },
  { class: 'align-yi:end',         css: 'align-items: flex-end;' },
  { class: 'align-yi:center',      css: 'align-items: center;' },
  { class: 'align-yi:stretch',     css: 'align-items: stretch;' },
  { class: 'align-yi:baseline',    css: 'align-items: baseline;' },
  { class: 'align-ys:start',       css: 'align-self: flex-start;' },
  { class: 'align-ys:end',         css: 'align-self: flex-end;' },
  { class: 'align-ys:center',      css: 'align-self: center;' },
  { class: 'align-ys:stretch',     css: 'align-self: stretch;' },
  { class: 'place:start',          css: 'place-content: start;' },
  { class: 'place:center',         css: 'place-content: center;' },
  { class: 'place:between',        css: 'place-content: space-between;' },
  { class: 'place-i:center',       css: 'place-items: center;' },
  { class: 'place-i:start',        css: 'place-items: start;' },
  { class: 'place-s:center',       css: 'place-self: center;' },
  { class: 'place-s:start',        css: 'place-self: start;' },

  // ── POSITION ──
  { class: 'pos:relative',         css: 'position: relative;' },
  { class: 'pos:absolute',         css: 'position: absolute;' },
  { class: 'pos:fixed',            css: 'position: fixed;' },
  { class: 'pos:sticky',           css: 'position: sticky;' },
  { class: 'pos:static',           css: 'position: static;' },

  // ── OVERFLOW ──
  { class: 'overflow:hidden',      css: 'overflow: hidden;' },
  { class: 'overflow:auto',        css: 'overflow: auto;' },
  { class: 'overflow:scroll',      css: 'overflow: scroll;' },
  { class: 'overflow:visible',     css: 'overflow: visible;' },
  { class: 'overflow:clip',        css: 'overflow: clip;' },
  { class: 'overflow-x:hidden',    css: 'overflow-x: hidden;' },
  { class: 'overflow-x:auto',      css: 'overflow-x: auto;' },
  { class: 'overflow-x:scroll',    css: 'overflow-x: scroll;' },
  { class: 'overflow-y:hidden',    css: 'overflow-y: hidden;' },
  { class: 'overflow-y:auto',      css: 'overflow-y: auto;' },
  { class: 'overflow-y:scroll',    css: 'overflow-y: scroll;' },
  { class: 'overflow-anchor:auto', css: 'overflow-anchor: auto;' },
  { class: 'overflow-anchor:none', css: 'overflow-anchor: none;' },

  // ── CANVAS SHOW ──
  { class: 'canvas-show:visible',  css: 'visibility: visible;' },
  { class: 'canvas-show:hidden',   css: 'visibility: hidden;' },
  { class: 'canvas-show:collapse', css: 'visibility: collapse;' },

  // ── CANVAS FIT ──
  { class: 'canvas-fit:cover',     css: 'object-fit: cover;' },
  { class: 'canvas-fit:contain',   css: 'object-fit: contain;' },
  { class: 'canvas-fit:fill',      css: 'object-fit: fill;' },
  { class: 'canvas-fit:none',      css: 'object-fit: none;' },
  { class: 'canvas-fit:scale',     css: 'object-fit: scale-down;' },

  // ── CANVAS BOX ──
  { class: 'canvas-box:border',    css: 'box-sizing: border-box;' },
  { class: 'canvas-box:content',   css: 'box-sizing: content-box;' },

  // ── CANVAS RESIZE ──
  { class: 'canvas-resize:none',   css: 'resize: none;' },
  { class: 'canvas-resize:both',   css: 'resize: both;' },
  { class: 'canvas-resize:x',      css: 'resize: horizontal;' },
  { class: 'canvas-resize:y',      css: 'resize: vertical;' },

  // ── FLOAT & CLEAR ──
  { class: 'float:left',           css: 'float: left;' },
  { class: 'float:right',          css: 'float: right;' },
  { class: 'float:none',           css: 'float: none;' },
  { class: 'clear:left',           css: 'clear: left;' },
  { class: 'clear:right',          css: 'clear: right;' },
  { class: 'clear:both',           css: 'clear: both;' },

  // ── CURSOR ──
  { class: 'cursor:pointer',       css: 'cursor: pointer;' },
  { class: 'cursor:default',       css: 'cursor: default;' },
  { class: 'cursor:text',          css: 'cursor: text;' },
  { class: 'cursor:move',          css: 'cursor: move;' },
  { class: 'cursor:grab',          css: 'cursor: grab;' },
  { class: 'cursor:grabbing',      css: 'cursor: grabbing;' },
  { class: 'cursor:not-allowed',   css: 'cursor: not-allowed;' },
  { class: 'cursor:wait',          css: 'cursor: wait;' },
  { class: 'cursor:crosshair',     css: 'cursor: crosshair;' },
  { class: 'cursor:zoom-in',       css: 'cursor: zoom-in;' },
  { class: 'cursor:zoom-out',      css: 'cursor: zoom-out;' },
  { class: 'cursor:none',          css: 'cursor: none;' },

  // ── POINTER EVENTS ──
  { class: 'events:none',          css: 'pointer-events: none;' },
  { class: 'events:all',           css: 'pointer-events: all;' },
  { class: 'events:auto',          css: 'pointer-events: auto;' },

  // ── USER SELECT ──
  { class: 'select:none',          css: 'user-select: none;' },
  { class: 'select:text',          css: 'user-select: text;' },
  { class: 'select:all',           css: 'user-select: all;' },
  { class: 'select:auto',          css: 'user-select: auto;' },

  // ── TOUCH ACTION ──
  { class: 'touch:none',           css: 'touch-action: none;' },
  { class: 'touch:auto',           css: 'touch-action: auto;' },
  { class: 'touch:pan-x',          css: 'touch-action: pan-x;' },
  { class: 'touch:pan-y',          css: 'touch-action: pan-y;' },
  { class: 'touch:pinch-zoom',     css: 'touch-action: pinch-zoom;' },
  { class: 'touch:manipulation',   css: 'touch-action: manipulation;' },

  // ── RESIZE ──
  { class: 'resize:none',          css: 'resize: none;' },
  { class: 'resize:both',          css: 'resize: both;' },
  { class: 'resize:x',             css: 'resize: horizontal;' },
  { class: 'resize:y',             css: 'resize: vertical;' },

  // ── SCROLL ──
  { class: 'scroll:smooth',        css: 'scroll-behavior: smooth;' },
  { class: 'scroll:auto',          css: 'scroll-behavior: auto;' },
  { class: 'overscroll:auto',      css: 'overscroll-behavior: auto;' },
  { class: 'overscroll:none',      css: 'overscroll-behavior: none;' },
  { class: 'overscroll:contain',   css: 'overscroll-behavior: contain;' },
  { class: 'overscroll-x:auto',    css: 'overscroll-behavior-x: auto;' },
  { class: 'overscroll-x:none',    css: 'overscroll-behavior-x: none;' },
  { class: 'overscroll-x:contain', css: 'overscroll-behavior-x: contain;' },
  { class: 'overscroll-y:auto',    css: 'overscroll-behavior-y: auto;' },
  { class: 'overscroll-y:none',    css: 'overscroll-behavior-y: none;' },
  { class: 'overscroll-y:contain', css: 'overscroll-behavior-y: contain;' },

  // ── TEXT ALIGN ──
  { class: 'text-align:left',      css: 'text-align: left;' },
  { class: 'text-align:center',    css: 'text-align: center;' },
  { class: 'text-align:right',     css: 'text-align: right;' },
  { class: 'text-align:justify',   css: 'text-align: justify;' },
  { class: 'text-align:start',     css: 'text-align: start;' },
  { class: 'text-align:end',       css: 'text-align: end;' },
  { class: 'text-align-last:left',    css: 'text-align-last: left;' },
  { class: 'text-align-last:center',  css: 'text-align-last: center;' },
  { class: 'text-align-last:right',   css: 'text-align-last: right;' },
  { class: 'text-align-last:justify', css: 'text-align-last: justify;' },
  { class: 'text-align-last:auto',    css: 'text-align-last: auto;' },

  // ── TEXT CASE ──
  { class: 'text-case:upper',      css: 'text-transform: uppercase;' },
  { class: 'text-case:lower',      css: 'text-transform: lowercase;' },
  { class: 'text-case:capital',    css: 'text-transform: capitalize;' },
  { class: 'text-case:none',       css: 'text-transform: none;' },

  // ── TEXT OVERFLOW ──
  { class: 'text-overflow:clip',   css: 'text-overflow: clip;' },
  { class: 'text-overflow:dots',   css: 'text-overflow: ellipsis;' },

  // ── TEXT WRAP ──
  { class: 'wrap:normal',          css: 'white-space: normal;' },
  { class: 'wrap:no',              css: 'white-space: nowrap;' },
  { class: 'wrap:pre',             css: 'white-space: pre;' },
  { class: 'wrap:pre-wrap',        css: 'white-space: pre-wrap;' },
  { class: 'wrap:break',           css: 'white-space: pre-line;' },
  { class: 'text-wrap:balance',    css: 'text-wrap: balance;' },
  { class: 'text-wrap:pretty',     css: 'text-wrap: pretty;' },
  { class: 'text-wrap:stable',     css: 'text-wrap: stable;' },
  { class: 'text-wrap:nowrap',     css: 'text-wrap: nowrap;' },

  // ── TEXT DECORATION ──
  { class: 'text-decor:none',      css: 'text-decoration: none;' },
  { class: 'text-decor:under',     css: 'text-decoration: underline;' },
  { class: 'text-decor:over',      css: 'text-decoration: overline;' },
  { class: 'text-decor:strike',    css: 'text-decoration: line-through;' },
  { class: 'text-decor-line:under',    css: 'text-decoration-line: underline;' },
  { class: 'text-decor-line:over',     css: 'text-decoration-line: overline;' },
  { class: 'text-decor-line:strike',   css: 'text-decoration-line: line-through;' },
  { class: 'text-decor-line:none',     css: 'text-decoration-line: none;' },
  { class: 'text-decor-style:solid',   css: 'text-decoration-style: solid;' },
  { class: 'text-decor-style:double',  css: 'text-decoration-style: double;' },
  { class: 'text-decor-style:dotted',  css: 'text-decoration-style: dotted;' },
  { class: 'text-decor-style:dashed',  css: 'text-decoration-style: dashed;' },
  { class: 'text-decor-style:wavy',    css: 'text-decoration-style: wavy;' },
  { class: 'text-under-pos:left',      css: 'text-underline-position: left;' },
  { class: 'text-under-pos:right',     css: 'text-underline-position: right;' },
  { class: 'text-under-pos:auto',      css: 'text-underline-position: auto;' },
  { class: 'text-under-pos:under',     css: 'text-underline-position: under;' },
  { class: 'text-skip-ink:auto',       css: 'text-decoration-skip-ink: auto;' },
  { class: 'text-skip-ink:none',       css: 'text-decoration-skip-ink: none;' },
  { class: 'text-skip-ink:all',        css: 'text-decoration-skip-ink: all;' },

  // ── TEXT EMPHASIS ──
  { class: 'text-emphasis-style:dot',      css: 'text-emphasis-style: dot;' },
  { class: 'text-emphasis-style:circle',   css: 'text-emphasis-style: circle;' },
  { class: 'text-emphasis-style:disc',     css: 'text-emphasis-style: disc;' },
  { class: 'text-emphasis-style:triangle', css: 'text-emphasis-style: triangle;' },
  { class: 'text-emphasis-style:sesame',   css: 'text-emphasis-style: sesame;' },
  { class: 'text-emphasis-style:none',     css: 'text-emphasis-style: none;' },
  { class: 'text-emphasis-pos:over',       css: 'text-emphasis-position: over;' },
  { class: 'text-emphasis-pos:under',      css: 'text-emphasis-position: under;' },
  { class: 'text-emphasis-pos:right',      css: 'text-emphasis-position: over right;' },
  { class: 'text-emphasis-pos:left',       css: 'text-emphasis-position: over left;' },

  // ── TEXT RENDER ──
  { class: 'text-render:auto',             css: 'text-rendering: auto;' },
  { class: 'text-render:speed',            css: 'text-rendering: optimizeSpeed;' },
  { class: 'text-render:quality',          css: 'text-rendering: optimizeLegibility;' },
  { class: 'text-render:precise',          css: 'text-rendering: geometricPrecision;' },

  // ── TEXT ORIENT ──
  { class: 'text-orient:mixed',            css: 'text-orientation: mixed;' },
  { class: 'text-orient:upright',          css: 'text-orientation: upright;' },
  { class: 'text-orient:sideways',         css: 'text-orientation: sideways;' },

  // ── TEXT JUSTIFY ──
  { class: 'text-justify:auto',            css: 'text-justify: auto;' },
  { class: 'text-justify:inter-word',      css: 'text-justify: inter-word;' },
  { class: 'text-justify:inter-char',      css: 'text-justify: inter-character;' },
  { class: 'text-justify:none',            css: 'text-justify: none;' },

  // ── TEXT LINE BREAK ──
  { class: 'text-line-break:auto',         css: 'line-break: auto;' },
  { class: 'text-line-break:loose',        css: 'line-break: loose;' },
  { class: 'text-line-break:normal',       css: 'line-break: normal;' },
  { class: 'text-line-break:strict',       css: 'line-break: strict;' },
  { class: 'text-line-break:anywhere',     css: 'line-break: anywhere;' },

  // ── TEXT COMBINE ──
  { class: 'text-combine:none',            css: 'text-combine-upright: none;' },
  { class: 'text-combine:all',             css: 'text-combine-upright: all;' },

  // ── FONT STYLE ──
  { class: 'type-style:normal',    css: 'font-style: normal;' },
  { class: 'type-style:italic',    css: 'font-style: italic;' },
  { class: 'type-style:oblique',   css: 'font-style: oblique;' },

  // ── FONT WEIGHT VALUES ──
  { class: 'type-weight:thin',     css: 'font-weight: 100;' },
  { class: 'type-weight:light',    css: 'font-weight: 300;' },
  { class: 'type-weight:normal',   css: 'font-weight: 400;' },
  { class: 'type-weight:medium',   css: 'font-weight: 500;' },
  { class: 'type-weight:semi',     css: 'font-weight: 600;' },
  { class: 'type-weight:bold',     css: 'font-weight: 700;' },
  { class: 'type-weight:black',    css: 'font-weight: 900;' },

  // ── FONT SMOOTH ──
  { class: 'type-smooth:auto',     css: '-webkit-font-smoothing: auto; font-smooth: auto;' },
  { class: 'type-smooth:none',     css: '-webkit-font-smoothing: none;' },
  { class: 'type-smooth:anti',     css: '-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;' },
  { class: 'type-smooth:sub',      css: '-webkit-font-smoothing: subpixel-antialiased;' },

  // ── FONT OPTICAL ──
  { class: 'type-optical:auto',    css: 'font-optical-sizing: auto;' },
  { class: 'type-optical:none',    css: 'font-optical-sizing: none;' },

  // ── FONT VARIANT ──
  { class: 'type-variant:normal',       css: 'font-variant: normal;' },
  { class: 'type-variant:small-caps',   css: 'font-variant: small-caps;' },

  // ── VERTICAL ALIGN ──
  { class: 'text-valign:top',      css: 'vertical-align: top;' },
  { class: 'text-valign:middle',   css: 'vertical-align: middle;' },
  { class: 'text-valign:bottom',   css: 'vertical-align: bottom;' },
  { class: 'text-valign:baseline', css: 'vertical-align: baseline;' },
  { class: 'text-valign:sub',      css: 'vertical-align: sub;' },
  { class: 'text-valign:super',    css: 'vertical-align: super;' },

  // ── STROKE STYLE ──
  { class: 'stroke-style:solid',   css: 'border-style: solid;' },
  { class: 'stroke-style:dashed',  css: 'border-style: dashed;' },
  { class: 'stroke-style:dotted',  css: 'border-style: dotted;' },
  { class: 'stroke-style:double',  css: 'border-style: double;' },
  { class: 'stroke-style:none',    css: 'border-style: none;' },
  { class: 'stroke-top-style:solid',  css: 'border-top-style: solid;' },
  { class: 'stroke-top-style:dashed', css: 'border-top-style: dashed;' },
  { class: 'stroke-top-style:dotted', css: 'border-top-style: dotted;' },
  { class: 'stroke-top-style:none',   css: 'border-top-style: none;' },
  { class: 'stroke-right-style:solid',  css: 'border-right-style: solid;' },
  { class: 'stroke-right-style:dashed', css: 'border-right-style: dashed;' },
  { class: 'stroke-right-style:dotted', css: 'border-right-style: dotted;' },
  { class: 'stroke-right-style:none',   css: 'border-right-style: none;' },
  { class: 'stroke-btm-style:solid',    css: 'border-bottom-style: solid;' },
  { class: 'stroke-btm-style:dashed',   css: 'border-bottom-style: dashed;' },
  { class: 'stroke-btm-style:dotted',   css: 'border-bottom-style: dotted;' },
  { class: 'stroke-btm-style:none',     css: 'border-bottom-style: none;' },
  { class: 'stroke-left-style:solid',   css: 'border-left-style: solid;' },
  { class: 'stroke-left-style:dashed',  css: 'border-left-style: dashed;' },
  { class: 'stroke-left-style:dotted',  css: 'border-left-style: dotted;' },
  { class: 'stroke-left-style:none',    css: 'border-left-style: none;' },

  // ── RING STYLE ──
  { class: 'ring-style:solid',     css: 'outline-style: solid;' },
  { class: 'ring-style:dashed',    css: 'outline-style: dashed;' },
  { class: 'ring-style:dotted',    css: 'outline-style: dotted;' },
  { class: 'ring-style:none',      css: 'outline-style: none;' },

  // ── BLEND MODES ──
  { class: 'blend:normal',         css: 'mix-blend-mode: normal;' },
  { class: 'blend:multiply',       css: 'mix-blend-mode: multiply;' },
  { class: 'blend:screen',         css: 'mix-blend-mode: screen;' },
  { class: 'blend:overlay',        css: 'mix-blend-mode: overlay;' },
  { class: 'blend:darken',         css: 'mix-blend-mode: darken;' },
  { class: 'blend:lighten',        css: 'mix-blend-mode: lighten;' },
  { class: 'blend:dodge',          css: 'mix-blend-mode: color-dodge;' },
  { class: 'blend:burn',           css: 'mix-blend-mode: color-burn;' },
  { class: 'blend:difference',     css: 'mix-blend-mode: difference;' },
  { class: 'blend:exclusion',      css: 'mix-blend-mode: exclusion;' },
  { class: 'blend:hue',            css: 'mix-blend-mode: hue;' },
  { class: 'blend:saturation',     css: 'mix-blend-mode: saturation;' },
  { class: 'blend:color',          css: 'mix-blend-mode: color;' },
  { class: 'blend:luminosity',     css: 'mix-blend-mode: luminosity;' },
  { class: 'isolate:yes',          css: 'isolation: isolate;' },
  { class: 'isolate:no',           css: 'isolation: auto;' },

  // ── TRANSFORM STYLE ──
  { class: 'transform-style:flat', css: 'transform-style: flat;' },
  { class: 'transform-style:3d',   css: 'transform-style: preserve-3d;' },
  { class: 'transform-box:fill',   css: 'transform-box: fill-box;' },
  { class: 'transform-box:view',   css: 'transform-box: view-box;' },
  { class: 'transform-box:border', css: 'transform-box: border-box;' },
  { class: 'flip:visible',         css: 'backface-visibility: visible;' },
  { class: 'flip:hidden',          css: 'backface-visibility: hidden;' },

  // ── GRID FLOW ──
  { class: 'grid-flow:row',        css: 'grid-auto-flow: row;' },
  { class: 'grid-flow:col',        css: 'grid-auto-flow: column;' },
  { class: 'grid-flow:dense',      css: 'grid-auto-flow: dense;' },
  { class: 'grid-flow:row-dense',  css: 'grid-auto-flow: row dense;' },
  { class: 'grid-flow:col-dense',  css: 'grid-auto-flow: column dense;' },

  // ── PAINT TILE ──
  { class: 'paint-tile:repeat',    css: 'background-repeat: repeat;' },
  { class: 'paint-tile:no',        css: 'background-repeat: no-repeat;' },
  { class: 'paint-tile:x',         css: 'background-repeat: repeat-x;' },
  { class: 'paint-tile:y',         css: 'background-repeat: repeat-y;' },
  { class: 'paint-tile:round',     css: 'background-repeat: round;' },
  { class: 'paint-tile:space',     css: 'background-repeat: space;' },

  // ── PAINT FIX ──
  { class: 'paint-fix:scroll',     css: 'background-attachment: scroll;' },
  { class: 'paint-fix:fixed',      css: 'background-attachment: fixed;' },
  { class: 'paint-fix:local',      css: 'background-attachment: local;' },

  // ── PAINT CLIP ──
  { class: 'paint-clip:border',    css: 'background-clip: border-box;' },
  { class: 'paint-clip:padding',   css: 'background-clip: padding-box;' },
  { class: 'paint-clip:content',   css: 'background-clip: content-box;' },
  { class: 'paint-clip:text',      css: 'background-clip: text;' },

  // ── MASK ──
  { class: 'mask-tile:repeat',     css: 'mask-repeat: repeat;' },
  { class: 'mask-tile:no',         css: 'mask-repeat: no-repeat;' },
  { class: 'mask-tile:x',          css: 'mask-repeat: repeat-x;' },
  { class: 'mask-tile:y',          css: 'mask-repeat: repeat-y;' },
  { class: 'mask-origin:border',   css: 'mask-origin: border-box;' },
  { class: 'mask-origin:padding',  css: 'mask-origin: padding-box;' },
  { class: 'mask-origin:content',  css: 'mask-origin: content-box;' },
  { class: 'mask-clip:border',     css: 'mask-clip: border-box;' },
  { class: 'mask-clip:padding',    css: 'mask-clip: padding-box;' },
  { class: 'mask-clip:content',    css: 'mask-clip: content-box;' },
  { class: 'mask-clip:no',         css: 'mask-clip: no-clip;' },
  { class: 'mask-mode:alpha',      css: 'mask-mode: alpha;' },
  { class: 'mask-mode:luminance',  css: 'mask-mode: luminance;' },
  { class: 'mask-mode:auto',       css: 'mask-mode: match-source;' },
  { class: 'mask-blend:add',       css: 'mask-composite: add;' },
  { class: 'mask-blend:sub',       css: 'mask-composite: subtract;' },
  { class: 'mask-blend:intersect', css: 'mask-composite: intersect;' },
  { class: 'mask-blend:exclude',   css: 'mask-composite: exclude;' },

  // ── LIST ──
  { class: 'list:none',            css: 'list-style: none;' },
  { class: 'list:disc',            css: 'list-style-type: disc;' },
  { class: 'list:decimal',         css: 'list-style-type: decimal;' },
  { class: 'list:circle',          css: 'list-style-type: circle;' },
  { class: 'list:square',          css: 'list-style-type: square;' },
  { class: 'list-pos:inside',      css: 'list-style-position: inside;' },
  { class: 'list-pos:outside',     css: 'list-style-position: outside;' },

  // ── TABLE ──
  { class: 'table:fixed',          css: 'table-layout: fixed;' },
  { class: 'table:auto',           css: 'table-layout: auto;' },
  { class: 'table-empty:show',     css: 'empty-cells: show;' },
  { class: 'table-empty:hide',     css: 'empty-cells: hide;' },
  { class: 'table-caption:top',    css: 'caption-side: top;' },
  { class: 'table-caption:bottom', css: 'caption-side: bottom;' },
  { class: 'stroke-collapse:yes',  css: 'border-collapse: collapse;' },
  { class: 'stroke-collapse:no',   css: 'border-collapse: separate;' },

  // ── WRITING MODE ──
  { class: 'text-writing:h',       css: 'writing-mode: horizontal-tb;' },
  { class: 'text-writing:v-right', css: 'writing-mode: vertical-rl;' },
  { class: 'text-writing:v-left',  css: 'writing-mode: vertical-lr;' },

  // ── DIRECTION ──
  { class: 'text-dir:ltr',         css: 'direction: ltr;' },
  { class: 'text-dir:rtl',         css: 'direction: rtl;' },

  // ── UNICODE BIDI ──
  { class: 'unicode-bidi:normal',   css: 'unicode-bidi: normal;' },
  { class: 'unicode-bidi:embed',    css: 'unicode-bidi: embed;' },
  { class: 'unicode-bidi:isolate',  css: 'unicode-bidi: isolate;' },
  { class: 'unicode-bidi:override', css: 'unicode-bidi: bidi-override;' },

  // ── APPEARANCE ──
  { class: 'canvas-appear:none',   css: 'appearance: none;' },
  { class: 'canvas-appear:auto',   css: 'appearance: auto;' },

  // ── CONTENT VISIBILITY ──
  { class: 'canvas-render:auto',    css: 'content-visibility: auto;' },
  { class: 'canvas-render:hidden',  css: 'content-visibility: hidden;' },
  { class: 'canvas-render:visible', css: 'content-visibility: visible;' },

  // ── COLOR SCHEME ──
  { class: 'canvas-scheme:light',  css: 'color-scheme: light;' },
  { class: 'canvas-scheme:dark',   css: 'color-scheme: dark;' },
  { class: 'canvas-scheme:auto',   css: 'color-scheme: light dark;' },

  // ── SCROLLBAR ──
  { class: 'bar-width:thin',       css: 'scrollbar-width: thin;' },
  { class: 'bar-width:none',       css: 'scrollbar-width: none;' },
  { class: 'bar-width:auto',       css: 'scrollbar-width: auto;' },
  { class: 'bar-gutter:stable',    css: 'scrollbar-gutter: stable;' },
  { class: 'bar-gutter:auto',      css: 'scrollbar-gutter: auto;' },

  // ── RUBY ──
  { class: 'ruby-align:start',     css: 'ruby-align: start;' },
  { class: 'ruby-align:center',    css: 'ruby-align: center;' },
  { class: 'ruby-align:between',   css: 'ruby-align: space-between;' },
  { class: 'ruby-pos:over',        css: 'ruby-position: over;' },
  { class: 'ruby-pos:under',       css: 'ruby-position: under;' },
  { class: 'ruby-merge:none',      css: 'ruby-merge: none;' },
  { class: 'ruby-merge:auto',      css: 'ruby-merge: auto;' },
  { class: 'ruby-merge:collapse',  css: 'ruby-merge: collapse;' },

  // ── FIELD SIZE ──
  { class: 'field-size:fixed',     css: 'field-sizing: fixed;' },
  { class: 'field-size:content',   css: 'field-sizing: content;' },

  // ── IMG RENDER ──
  { class: 'img-render:auto',      css: 'image-rendering: auto;' },
  { class: 'img-render:crisp',     css: 'image-rendering: crisp-edges;' },
  { class: 'img-render:pixel',     css: 'image-rendering: pixelated;' },
  { class: 'img-render:smooth',    css: 'image-rendering: smooth;' },

  // ── IMG ORIENT ──
  { class: 'img-orient:none',      css: 'image-orientation: none;' },
  { class: 'img-orient:auto',      css: 'image-orientation: from-image;' },

  // ── WILL CHANGE ──
  { class: 'will:transform',       css: 'will-change: transform;' },
  { class: 'will:opacity',         css: 'will-change: opacity;' },
  { class: 'will:auto',            css: 'will-change: auto;' },
  { class: 'will:contents',        css: 'will-change: contents;' },

  // ── CONTAIN ──
  { class: 'canvas-contain:none',    css: 'contain: none;' },
  { class: 'canvas-contain:strict',  css: 'contain: strict;' },
  { class: 'canvas-contain:content', css: 'contain: content;' },
  { class: 'canvas-contain:layout',  css: 'contain: layout;' },
  { class: 'canvas-contain:size',    css: 'contain: size;' },
  { class: 'canvas-contain:paint',   css: 'contain: paint;' },

  // ── CONTAINER TYPE ──
  { class: 'frame-type:inline',    css: 'container-type: inline-size;' },
  { class: 'frame-type:size',      css: 'container-type: size;' },
  { class: 'frame-type:normal',    css: 'container-type: normal;' },

  // ── HYPHENS ──
  { class: 'hyphens:none',         css: 'hyphens: none;' },
  { class: 'hyphens:auto',         css: 'hyphens: auto;' },
  { class: 'hyphens:manual',       css: 'hyphens: manual;' },

  // ── WORD BREAK ──
  { class: 'word-break:normal',    css: 'word-break: normal;' },
  { class: 'word-break:all',       css: 'word-break: break-all;' },
  { class: 'word-break:keep',      css: 'word-break: keep-all;' },
  { class: 'word-wrap:normal',     css: 'overflow-wrap: normal;' },
  { class: 'word-wrap:break',      css: 'overflow-wrap: break-word;' },
  { class: 'word-wrap:anywhere',   css: 'overflow-wrap: anywhere;' },

  // ── SNAP ──
  { class: 'scroll-snap:x',        css: 'scroll-snap-type: x mandatory;' },
  { class: 'scroll-snap:y',        css: 'scroll-snap-type: y mandatory;' },
  { class: 'scroll-snap:both',     css: 'scroll-snap-type: both mandatory;' },
  { class: 'scroll-snap:none',     css: 'scroll-snap-type: none;' },
  { class: 'snap-align:start',     css: 'scroll-snap-align: start;' },
  { class: 'snap-align:center',    css: 'scroll-snap-align: center;' },
  { class: 'snap-align:end',       css: 'scroll-snap-align: end;' },
  { class: 'snap-align:none',      css: 'scroll-snap-align: none;' },
  { class: 'scroll-snap-stop:normal', css: 'scroll-snap-stop: normal;' },
  { class: 'scroll-snap-stop:always', css: 'scroll-snap-stop: always;' },

  // ── SVG STROKE CAP ──
  { class: 'svg-stroke-cap:butt',  css: 'stroke-linecap: butt;' },
  { class: 'svg-stroke-cap:round', css: 'stroke-linecap: round;' },
  { class: 'svg-stroke-cap:square',css: 'stroke-linecap: square;' },

  // ── SVG STROKE JOIN ──
  { class: 'svg-stroke-join:miter',css: 'stroke-linejoin: miter;' },
  { class: 'svg-stroke-join:round',css: 'stroke-linejoin: round;' },
  { class: 'svg-stroke-join:bevel',css: 'stroke-linejoin: bevel;' },

  // ── SVG MISC ──
  { class: 'svg-anchor:start',     css: 'text-anchor: start;' },
  { class: 'svg-anchor:middle',    css: 'text-anchor: middle;' },
  { class: 'svg-anchor:end',       css: 'text-anchor: end;' },
  { class: 'svg-baseline:auto',        css: 'dominant-baseline: auto;' },
  { class: 'svg-baseline:middle',      css: 'dominant-baseline: middle;' },
  { class: 'svg-baseline:central',     css: 'dominant-baseline: central;' },
  { class: 'svg-baseline:hanging',     css: 'dominant-baseline: hanging;' },
  { class: 'svg-paint-order:normal',   css: 'paint-order: normal;' },
  { class: 'svg-paint-order:fill',     css: 'paint-order: fill stroke;' },
  { class: 'svg-paint-order:stroke',   css: 'paint-order: stroke fill;' },
  { class: 'svg-vector:none',          css: 'vector-effect: none;' },
  { class: 'svg-vector:non-scaling',   css: 'vector-effect: non-scaling-stroke;' },
  { class: 'svg-shape:auto',           css: 'shape-rendering: auto;' },
  { class: 'svg-shape:crisp',          css: 'shape-rendering: crispEdges;' },
  { class: 'svg-shape:geo',            css: 'shape-rendering: geometricPrecision;' },
  { class: 'svg-color-interp:srgb',    css: 'color-interpolation: sRGB;' },
  { class: 'svg-color-interp:linear',  css: 'color-interpolation: linearRGB;' },
  { class: 'svg-color-interp-filter:srgb',   css: 'color-interpolation-filters: sRGB;' },
  { class: 'svg-color-interp-filter:linear', css: 'color-interpolation-filters: linearRGB;' },

  // ── PRINT ──
  { class: 'print-color:exact',    css: 'print-color-adjust: exact;' },
  { class: 'print-color:economy',  css: 'print-color-adjust: economy;' },
  { class: 'forced-color:none',    css: 'forced-color-adjust: none;' },
  { class: 'forced-color:auto',    css: 'forced-color-adjust: auto;' },

  // ── BREAK ──
  { class: 'break-before:auto',    css: 'break-before: auto;' },
  { class: 'break-before:page',    css: 'break-before: page;' },
  { class: 'break-before:avoid',   css: 'break-before: avoid;' },
  { class: 'break-before:column',  css: 'break-before: column;' },
  { class: 'break-before:left',    css: 'break-before: left;' },
  { class: 'break-before:right',   css: 'break-before: right;' },
  { class: 'break-after:auto',     css: 'break-after: auto;' },
  { class: 'break-after:page',     css: 'break-after: page;' },
  { class: 'break-after:avoid',    css: 'break-after: avoid;' },
  { class: 'break-after:column',   css: 'break-after: column;' },
  { class: 'break-inside:auto',    css: 'break-inside: auto;' },
  { class: 'break-inside:avoid',   css: 'break-inside: avoid;' },
  { class: 'break-inside:avoid-page',   css: 'break-inside: avoid-page;' },
  { class: 'break-inside:avoid-column', css: 'break-inside: avoid-column;' },

  // ── SHAPE ──
  { class: 'shape:circle',         css: 'shape-outside: circle();' },
  { class: 'shape:ellipse',        css: 'shape-outside: ellipse();' },
  { class: 'shape:none',           css: 'shape-outside: none;' },

  // ── EASE MODE ──
  { class: 'ease-mode:normal',     css: 'transition-behavior: normal;' },
  { class: 'ease-mode:discrete',   css: 'transition-behavior: allow-discrete;' },

  // ── PLAY (CSS animation) additional values ──
  { class: 'play-dir:normal',      css: 'animation-direction: normal;' },
  { class: 'play-dir:reverse',     css: 'animation-direction: reverse;' },
  { class: 'play-dir:alternate',   css: 'animation-direction: alternate;' },
  { class: 'play-dir:alt-rev',     css: 'animation-direction: alternate-reverse;' },
  { class: 'play-fill:none',       css: 'animation-fill-mode: none;' },
  { class: 'play-fill:forwards',   css: 'animation-fill-mode: forwards;' },
  { class: 'play-fill:backwards',  css: 'animation-fill-mode: backwards;' },
  { class: 'play-fill:both',       css: 'animation-fill-mode: both;' },
  { class: 'play-state:running',   css: 'animation-play-state: running;' },
  { class: 'play-state:paused',    css: 'animation-play-state: paused;' },
  { class: 'play-mix:replace',     css: 'animation-composition: replace;' },
  { class: 'play-mix:add',         css: 'animation-composition: add;' },
  { class: 'play-mix:accumulate',  css: 'animation-composition: accumulate;' },

  // ── COLOR RENDER ──
  { class: 'color-render:auto',    css: 'color-rendering: auto;' },
  { class: 'color-render:speed',   css: 'color-rendering: optimizeSpeed;' },
  { class: 'color-render:quality', css: 'color-rendering: optimizeQuality;' },
  { class: 'color-interp:srgb',    css: 'color-interpolation: sRGB;' },
  { class: 'color-interp:linear',  css: 'color-interpolation: linearRGB;' },

  // ── POSITION VISIBILITY (anchor) ──
  { class: 'pos-visibility:always',   css: 'position-visibility: always;' },
  { class: 'pos-visibility:anchors',  css: 'position-visibility: anchors-visible;' },
  { class: 'pos-visibility:overflow', css: 'position-visibility: no-overflow;' },

  // ── SCENE ──
  { class: 'scene-ease:discrete',  css: 'transition-behavior: allow-discrete;' },

  // ── SPECIAL HELPERS ──
  { class: 'mar-x:auto',           css: 'margin-left: auto; margin-right: auto;' },
  { class: 'canvas-w:full',        css: 'width: 100%;' },
  { class: 'canvas-h:full',        css: 'height: 100%;' },
  { class: 'canvas-w:screen',      css: 'width: 100vw;' },
  { class: 'canvas-h:screen',      css: 'height: 100vh;' },
  { class: 'canvas-w:auto',        css: 'width: auto;' },
  { class: 'canvas-h:auto',        css: 'height: auto;' },
  { class: 'canvas-w:fit',         css: 'width: fit-content;' },
  { class: 'canvas-h:fit',         css: 'height: fit-content;' },
  { class: 'canvas-w:max',         css: 'width: max-content;' },
  { class: 'canvas-w:min',         css: 'width: min-content;' },
  { class: 'pos-inset:0',          css: 'inset: 0;' },
  { class: 'pos-top:0',            css: 'top: 0;' },
  { class: 'pos-right:0',          css: 'right: 0;' },
  { class: 'pos-btm:0',            css: 'bottom: 0;' },
  { class: 'pos-left:0',           css: 'left: 0;' },
  { class: 'ease:default',         css: 'transition: all var(--duration-normal, 300ms) var(--ease-smooth, cubic-bezier(0.4,0,0.2,1));' },
]

// Fast lookup map
const STATIC_MAP = Object.fromEntries(
  STATIC_UTILITIES.map(u => [u.class, u.css])
)

// All known capability prefixes — used for early-exit dispatch in resolveClass
const KNOWN_PREFIXES = new Set([
  'ink','ink-caret','ink-accent','ink-fill','ink-fill-fade','ink-palette',
  'paint','paint-img','paint-size','paint-pos','paint-pos-x','paint-pos-y','paint-blend','paint-origin','paint-clip',
  'canvas-w','canvas-h','canvas-w-min','canvas-h-min','canvas-w-max','canvas-h-max',
  'canvas-w-fit','canvas-h-fit','canvas-w-fit-min','canvas-h-fit-min','canvas-w-fit-max','canvas-h-fit-max',
  'canvas-ratio','canvas-fit-pos','canvas-fade','canvas-view','canvas-resize',
  'pad','pad-x','pad-x-start','pad-x-end','pad-y','pad-y-start','pad-y-end',
  'pad-top','pad-right','pad-btm','pad-left',
  'mar','mar-x','mar-x-start','mar-x-end','mar-y','mar-y-start','mar-y-end',
  'mar-top','mar-right','mar-btm','mar-left',
  'gap','gap-x','gap-y',
  'stroke','stroke-color','stroke-width','stroke-style',
  'stroke-top','stroke-top-color','stroke-top-width','stroke-top-style',
  'stroke-right','stroke-right-color','stroke-right-width','stroke-right-style',
  'stroke-btm','stroke-btm-color','stroke-btm-width','stroke-btm-style',
  'stroke-left','stroke-left-color','stroke-left-width','stroke-left-style',
  'stroke-x','stroke-x-start','stroke-x-end',
  'stroke-y','stroke-y-start','stroke-y-end',
  'stroke-img','stroke-img-src','stroke-img-slice','stroke-img-width','stroke-img-outset','stroke-img-tile',
  'stroke-collapse','stroke-gap',
  'curve','curve-tl','curve-tr','curve-bl','curve-br','curve-start','curve-end',
  'ring','ring-color','ring-width','ring-style','ring-offset',
  'cast','cast-text','cast-inner','cast-drop',
  'glow','glow-blur','glow-bright','glow-contrast','glow-gray','glow-hue','glow-invert','glow-fade','glow-sat','glow-sepia',
  'glass','glass-blur','glass-bright','glass-gray','glass-sat','glass-contrast',
  'blend','blend-bg','isolate',
  'clip','clip-mar','clip-shape',
  'mask','mask-img','mask-pos','mask-size','mask-tile','mask-origin','mask-clip','mask-blend','mask-mode',
  'pos','pos-top','pos-right','pos-btm','pos-left',
  'pos-inset','pos-inset-x','pos-inset-x-start','pos-inset-x-end',
  'pos-inset-y','pos-inset-y-start','pos-inset-y-end',
  'pos-anchor','pos-try','pos-try-order','pos-visibility',
  'layer',
  'flex','flex-dir','flex-wrap','flex-grow','flex-shrink','flex-base','flex-order',
  'align-x','align-xi','align-xs','align-y','align-yi','align-ys','place','place-i','place-s',
  'grid','grid-cols','grid-rows','grid-areas','grid-area','grid-col','grid-col-start','grid-col-end',
  'grid-row','grid-row-start','grid-row-end','grid-col-auto','grid-row-auto','grid-flow','grid-template',
  'cols','cols-n','cols-w','cols-gap','cols-rule','cols-rule-color','cols-rule-width','cols-rule-style','cols-fill','cols-span',
  'type-face','type-size','type-weight','type-style','type-variant','type-stretch','type-kern',
  'type-optical','type-feature','type-variation','type-smooth','type-size-adjust','type-palette',
  'text','text-decor','text-decor-color','text-decor-line','text-decor-style','text-decor-width',
  'text-under-offset','text-under-pos','text-skip-ink',
  'text-emphasis','text-emphasis-color','text-emphasis-pos','text-emphasis-style',
  'text-stroke','text-stroke-color','text-render','text-orient','text-balance',
  'text-spacing','text-autospace','text-justify','text-line-break','text-combine',
  'leading','tracking','word-gap','indent','tab',
  'move','move-x','move-y','move-z','move-3d',
  'spin','spin-x','spin-y','spin-z',
  'scale','scale-x','scale-y',
  'skew','skew-x','skew-y',
  'transform','origin','depth-view','depth-origin',
  'ease','ease-prop','ease-speed','ease-curve','ease-wait','ease-mode',
  'play','play-name','play-speed','play-curve','play-loop','play-wait','play-state','play-fill','play-dir',
  'play-timeline','play-range','play-range-start','play-range-end','play-mix',
  'scroll','scroll-snap','scroll-snap-stop','snap-align',
  'scroll-pad','scroll-pad-top','scroll-pad-right','scroll-pad-btm','scroll-pad-left',
  'scroll-pad-x','scroll-pad-y',
  'scroll-mar','scroll-mar-top','scroll-mar-right','scroll-mar-btm','scroll-mar-left',
  'scroll-timeline','scroll-timeline-axis','scroll-timeline-name',
  'frame-name','frame-type','frame-size','frame-size-w','frame-size-h','frame-size-x','frame-size-y',
  'scene-name','scene-class','scene-ease',
  'bar-width','bar-color','bar-gutter',
  'path','path-dist','path-spin','path-anchor','path-pos',
  'shape','shape-mar','shape-img',
  'anchor-name','anchor-scope',
  'ruby-align','ruby-pos','ruby-merge',
  'svg-stroke','svg-stroke-width','svg-stroke-fade','svg-stroke-cap','svg-stroke-join',
  'svg-stroke-dash','svg-stroke-offset','svg-stroke-limit',
  'svg-anchor','svg-baseline','svg-marker','svg-marker-start','svg-marker-mid','svg-marker-end',
  'svg-paint-order','svg-vector','svg-shape','svg-flood-color','svg-flood-fade',
  'svg-stop-color','svg-stop-fade','svg-light-color','svg-color-interp','svg-color-interp-filter',
  'img-render','img-orient','img-view','img-res',
  'color-render','color-interp','ink-palette',
  'page-size','page-bleed','page-marks',
  'field-size',
  'will','content','cursor-shape','highlight','orphans','widows','quotes',
  'counter-reset','counter-inc','counter-set',
  'overflow-anchor','overscroll-x','overscroll-y',
  'unicode-bidi','unicode-bidi',
  'table-caption','table-empty',
  'print-color','forced-color',
  'safe-top','safe-right','safe-btm','safe-left',
  'hyphens','word-break','word-wrap',
])

// ============================================================
// TOKEN-BASED CLASS RESOLVER
// ============================================================
export function resolveClass(className, tokens = {}) {

  const colonIdx = className.indexOf(':')
  if (colonIdx !== -1) {
    const prefix = className.slice(0, colonIdx)
    if (!KNOWN_PREFIXES.has(prefix)) {
      return STATIC_MAP[className] || null
    }
  }

  // ── INK ──
  const ink = className.match(/^ink:(.+)$/)
  if (ink) return `color: ${resolveValue(ink[1],'color')};`

  const inkCaret = className.match(/^ink-caret:(.+)$/)
  if (inkCaret) return `caret-color: ${resolveValue(inkCaret[1],'color')};`

  const inkAccent = className.match(/^ink-accent:(.+)$/)
  if (inkAccent) return `accent-color: ${resolveValue(inkAccent[1],'color')};`

  const inkFill = className.match(/^ink-fill:(.+)$/)
  if (inkFill) return `fill: ${resolveValue(inkFill[1],'color')};`

  const inkFillFade = className.match(/^ink-fill-fade:(.+)$/)
  if (inkFillFade) return `fill-opacity: ${inkFillFade[1]};`

  const inkPalette = className.match(/^ink-palette:(.+)$/)
  if (inkPalette) return `font-palette: ${inkPalette[1]};`

  // ── PAINT ──
  const paint = className.match(/^paint:(.+)$/)
  if (paint) return `background-color: ${resolveValue(paint[1],'color')};`

  const paintImg = className.match(/^paint-img:(.+)$/)
  if (paintImg) return `background-image: ${isRawCSSValue(paintImg[1]) ? paintImg[1] : `url(${paintImg[1]})`};`

  const paintSize = className.match(/^paint-size:(.+)$/)
  if (paintSize) return `background-size: ${paintSize[1].replace(/_/g,' ')};`

  const paintPos = className.match(/^paint-pos:(.+)$/)
  if (paintPos) return `background-position: ${paintPos[1].replace(/_/g,' ')};`

  const paintPosX = className.match(/^paint-pos-x:(.+)$/)
  if (paintPosX) return `background-position-x: ${paintPosX[1]};`

  const paintPosY = className.match(/^paint-pos-y:(.+)$/)
  if (paintPosY) return `background-position-y: ${paintPosY[1]};`

  const paintBlend = className.match(/^paint-blend:(.+)$/)
  if (paintBlend) return `background-blend-mode: ${paintBlend[1]};`

  const paintOrigin = className.match(/^paint-origin:(.+)$/)
  if (paintOrigin) return `background-origin: ${paintOrigin[1]};`

  // ── CANVAS ──
  const canvasW = className.match(/^canvas-w:(.+)$/)
  if (canvasW) {
    const S = { full:'100%', screen:'100vw', auto:'auto', fit:'fit-content', max:'max-content', min:'min-content' }
    return `width: ${S[canvasW[1]] || resolveValue(canvasW[1],'spacing')};`
  }

  const canvasH = className.match(/^canvas-h:(.+)$/)
  if (canvasH) {
    const S = { full:'100%', screen:'100vh', auto:'auto', fit:'fit-content', max:'max-content', min:'min-content' }
    return `height: ${S[canvasH[1]] || resolveValue(canvasH[1],'spacing')};`
  }

  const canvasWMin = className.match(/^canvas-w-min:(.+)$/)
  if (canvasWMin) return `min-width: ${resolveValue(canvasWMin[1],'spacing')};`

  const canvasHMin = className.match(/^canvas-h-min:(.+)$/)
  if (canvasHMin) return `min-height: ${resolveValue(canvasHMin[1],'spacing')};`

  const canvasWMax = className.match(/^canvas-w-max:(.+)$/)
  if (canvasWMax) return `max-width: ${resolveValue(canvasWMax[1],'spacing')};`

  const canvasHMax = className.match(/^canvas-h-max:(.+)$/)
  if (canvasHMax) return `max-height: ${resolveValue(canvasHMax[1],'spacing')};`

  // Logical / intrinsic sizing
  const canvasWFit = className.match(/^canvas-w-fit:(.+)$/)
  if (canvasWFit) return `inline-size: ${resolveValue(canvasWFit[1],'spacing')};`

  const canvasHFit = className.match(/^canvas-h-fit:(.+)$/)
  if (canvasHFit) return `block-size: ${resolveValue(canvasHFit[1],'spacing')};`

  const canvasWFitMin = className.match(/^canvas-w-fit-min:(.+)$/)
  if (canvasWFitMin) return `min-inline-size: ${resolveValue(canvasWFitMin[1],'spacing')};`

  const canvasHFitMin = className.match(/^canvas-h-fit-min:(.+)$/)
  if (canvasHFitMin) return `min-block-size: ${resolveValue(canvasHFitMin[1],'spacing')};`

  const canvasWFitMax = className.match(/^canvas-w-fit-max:(.+)$/)
  if (canvasWFitMax) return `max-inline-size: ${resolveValue(canvasWFitMax[1],'spacing')};`

  const canvasHFitMax = className.match(/^canvas-h-fit-max:(.+)$/)
  if (canvasHFitMax) return `max-block-size: ${resolveValue(canvasHFitMax[1],'spacing')};`

  const canvasRatio = className.match(/^canvas-ratio:(.+)$/)
  if (canvasRatio) return `aspect-ratio: ${canvasRatio[1].replace(/_/g,'/')};`

  const canvasFitPos = className.match(/^canvas-fit-pos:(.+)$/)
  if (canvasFitPos) return `object-position: ${canvasFitPos[1].replace(/_/g,' ')};`

  const canvasFade = className.match(/^canvas-fade:(.+)$/)
  if (canvasFade) return `opacity: ${resolveValue(canvasFade[1],'opacity')};`

  const canvasViewBox = className.match(/^canvas-view:(.+)$/)
  if (canvasViewBox) return `object-view-box: ${canvasViewBox[1].replace(/_/g,' ')};`

  const canvasResize = className.match(/^canvas-resize:(.+)$/)
  if (canvasResize) return `resize: ${canvasResize[1]};`

  // ── PAD ──
  const padX = className.match(/^pad-x:(.+)$/)
  if (padX) { const v=resolveValue(padX[1],'spacing'); return `padding-left: ${v}; padding-right: ${v};` }

  const padXStart = className.match(/^pad-x-start:(.+)$/)
  if (padXStart) return `padding-inline-start: ${resolveValue(padXStart[1],'spacing')};`

  const padXEnd = className.match(/^pad-x-end:(.+)$/)
  if (padXEnd) return `padding-inline-end: ${resolveValue(padXEnd[1],'spacing')};`

  const padY = className.match(/^pad-y:(.+)$/)
  if (padY) { const v=resolveValue(padY[1],'spacing'); return `padding-top: ${v}; padding-bottom: ${v};` }

  const padYStart = className.match(/^pad-y-start:(.+)$/)
  if (padYStart) return `padding-block-start: ${resolveValue(padYStart[1],'spacing')};`

  const padYEnd = className.match(/^pad-y-end:(.+)$/)
  if (padYEnd) return `padding-block-end: ${resolveValue(padYEnd[1],'spacing')};`

  const padTop = className.match(/^pad-top:(.+)$/)
  if (padTop) return `padding-top: ${resolveValue(padTop[1],'spacing')};`

  const padRight = className.match(/^pad-right:(.+)$/)
  if (padRight) return `padding-right: ${resolveValue(padRight[1],'spacing')};`

  const padBtm = className.match(/^pad-btm:(.+)$/)
  if (padBtm) return `padding-bottom: ${resolveValue(padBtm[1],'spacing')};`

  const padLeft = className.match(/^pad-left:(.+)$/)
  if (padLeft) return `padding-left: ${resolveValue(padLeft[1],'spacing')};`

  const pad = className.match(/^pad:(.+)$/)
  if (pad) return `padding: ${resolveValue(pad[1],'spacing')};`

  // ── MAR ──
  const marX = className.match(/^mar-x:(.+)$/)
  if (marX) { const v=resolveValue(marX[1],'spacing'); return `margin-left: ${v}; margin-right: ${v};` }

  const marXStart = className.match(/^mar-x-start:(.+)$/)
  if (marXStart) return `margin-inline-start: ${resolveValue(marXStart[1],'spacing')};`

  const marXEnd = className.match(/^mar-x-end:(.+)$/)
  if (marXEnd) return `margin-inline-end: ${resolveValue(marXEnd[1],'spacing')};`

  const marY = className.match(/^mar-y:(.+)$/)
  if (marY) { const v=resolveValue(marY[1],'spacing'); return `margin-top: ${v}; margin-bottom: ${v};` }

  const marYStart = className.match(/^mar-y-start:(.+)$/)
  if (marYStart) return `margin-block-start: ${resolveValue(marYStart[1],'spacing')};`

  const marYEnd = className.match(/^mar-y-end:(.+)$/)
  if (marYEnd) return `margin-block-end: ${resolveValue(marYEnd[1],'spacing')};`

  const marTop = className.match(/^mar-top:(.+)$/)
  if (marTop) return `margin-top: ${resolveValue(marTop[1],'spacing')};`

  const marRight = className.match(/^mar-right:(.+)$/)
  if (marRight) return `margin-right: ${resolveValue(marRight[1],'spacing')};`

  const marBtm = className.match(/^mar-btm:(.+)$/)
  if (marBtm) return `margin-bottom: ${resolveValue(marBtm[1],'spacing')};`

  const marLeft = className.match(/^mar-left:(.+)$/)
  if (marLeft) return `margin-left: ${resolveValue(marLeft[1],'spacing')};`

  const mar = className.match(/^mar:(.+)$/)
  if (mar) return `margin: ${resolveValue(mar[1],'spacing')};`

  // ── GAP ──
  const gapX = className.match(/^gap-x:(.+)$/)
  if (gapX) return `column-gap: ${resolveValue(gapX[1],'spacing')};`

  const gapY = className.match(/^gap-y:(.+)$/)
  if (gapY) return `row-gap: ${resolveValue(gapY[1],'spacing')};`

  const gap = className.match(/^gap:(.+)$/)
  if (gap) return `gap: ${resolveValue(gap[1],'spacing')};`

  // ── STROKE ──
  const strokeColor = className.match(/^stroke-color:(.+)$/)
  if (strokeColor) return `border-color: ${resolveValue(strokeColor[1],'color')};`

  const strokeWidth = className.match(/^stroke-width:(.+)$/)
  if (strokeWidth) return `border-width: ${resolveValue(strokeWidth[1],'stroke')};`

  const strokeTopColor = className.match(/^stroke-top-color:(.+)$/)
  if (strokeTopColor) return `border-top-color: ${resolveValue(strokeTopColor[1],'color')};`

  const strokeTopWidth = className.match(/^stroke-top-width:(.+)$/)
  if (strokeTopWidth) return `border-top-width: ${strokeTopWidth[1]};`

  const strokeRightColor = className.match(/^stroke-right-color:(.+)$/)
  if (strokeRightColor) return `border-right-color: ${resolveValue(strokeRightColor[1],'color')};`

  const strokeRightWidth = className.match(/^stroke-right-width:(.+)$/)
  if (strokeRightWidth) return `border-right-width: ${strokeRightWidth[1]};`

  const strokeBtmColor = className.match(/^stroke-btm-color:(.+)$/)
  if (strokeBtmColor) return `border-bottom-color: ${resolveValue(strokeBtmColor[1],'color')};`

  const strokeBtmWidth = className.match(/^stroke-btm-width:(.+)$/)
  if (strokeBtmWidth) return `border-bottom-width: ${strokeBtmWidth[1]};`

  const strokeLeftColor = className.match(/^stroke-left-color:(.+)$/)
  if (strokeLeftColor) return `border-left-color: ${resolveValue(strokeLeftColor[1],'color')};`

  const strokeLeftWidth = className.match(/^stroke-left-width:(.+)$/)
  if (strokeLeftWidth) return `border-left-width: ${strokeLeftWidth[1]};`

  const strokeGap = className.match(/^stroke-gap:(.+)$/)
  if (strokeGap) return `border-spacing: ${resolveValue(strokeGap[1],'spacing')};`

  // Shorthand side (border-top: width style color via raw value)
  const strokeTop = className.match(/^stroke-top:(.+)$/)
  if (strokeTop) return `border-top: ${strokeTop[1].replace(/_/g,' ')};`

  const strokeBtm = className.match(/^stroke-btm:(.+)$/)
  if (strokeBtm) return `border-bottom: ${strokeBtm[1].replace(/_/g,' ')};`

  const strokeLeft = className.match(/^stroke-left:(.+)$/)
  if (strokeLeft) return `border-left: ${strokeLeft[1].replace(/_/g,' ')};`

  const strokeRight = className.match(/^stroke-right:(.+)$/)
  if (strokeRight) return `border-right: ${strokeRight[1].replace(/_/g,' ')};`

  const strokeX = className.match(/^stroke-x:(.+)$/)
  if (strokeX) return `border-inline: ${resolveValue(strokeX[1],'stroke')} solid;`

  const strokeXStart = className.match(/^stroke-x-start:(.+)$/)
  if (strokeXStart) return `border-inline-start: ${strokeXStart[1].replace(/_/g,' ')};`

  const strokeXEnd = className.match(/^stroke-x-end:(.+)$/)
  if (strokeXEnd) return `border-inline-end: ${strokeXEnd[1].replace(/_/g,' ')};`

  const strokeY = className.match(/^stroke-y:(.+)$/)
  if (strokeY) return `border-block: ${resolveValue(strokeY[1],'stroke')} solid;`

  const strokeYStart = className.match(/^stroke-y-start:(.+)$/)
  if (strokeYStart) return `border-block-start: ${strokeYStart[1].replace(/_/g,' ')};`

  const strokeYEnd = className.match(/^stroke-y-end:(.+)$/)
  if (strokeYEnd) return `border-block-end: ${strokeYEnd[1].replace(/_/g,' ')};`

  const strokeImg = className.match(/^stroke-img:(.+)$/)
  if (strokeImg) return `border-image: ${strokeImg[1].replace(/_/g,' ')};`

  const strokeImgSrc = className.match(/^stroke-img-src:(.+)$/)
  if (strokeImgSrc) return `border-image-source: url(${strokeImgSrc[1]});`

  const strokeImgSlice = className.match(/^stroke-img-slice:(.+)$/)
  if (strokeImgSlice) return `border-image-slice: ${strokeImgSlice[1].replace(/_/g,' ')};`

  const strokeImgWidth = className.match(/^stroke-img-width:(.+)$/)
  if (strokeImgWidth) return `border-image-width: ${strokeImgWidth[1].replace(/_/g,' ')};`

  const strokeImgOutset = className.match(/^stroke-img-outset:(.+)$/)
  if (strokeImgOutset) return `border-image-outset: ${strokeImgOutset[1].replace(/_/g,' ')};`

  const strokeImgTile = className.match(/^stroke-img-tile:(.+)$/)
  if (strokeImgTile) return `border-image-repeat: ${strokeImgTile[1]};`

  const stroke = className.match(/^stroke:(.+)$/)
  if (stroke) return `border: ${stroke[1].replace(/_/g,' ')};`

  // ── CURVE ──
  const curveTl = className.match(/^curve-tl:(.+)$/)
  if (curveTl) return `border-top-left-radius: ${resolveValue(curveTl[1],'radius')};`

  const curveTr = className.match(/^curve-tr:(.+)$/)
  if (curveTr) return `border-top-right-radius: ${resolveValue(curveTr[1],'radius')};`

  const curveBl = className.match(/^curve-bl:(.+)$/)
  if (curveBl) return `border-bottom-left-radius: ${resolveValue(curveBl[1],'radius')};`

  const curveBr = className.match(/^curve-br:(.+)$/)
  if (curveBr) return `border-bottom-right-radius: ${resolveValue(curveBr[1],'radius')};`

  const curveStart = className.match(/^curve-start:(.+)$/)
  if (curveStart) return `border-start-start-radius: ${resolveValue(curveStart[1],'radius')};`

  const curveEnd = className.match(/^curve-end:(.+)$/)
  if (curveEnd) return `border-end-end-radius: ${resolveValue(curveEnd[1],'radius')};`

  const curve = className.match(/^curve:(.+)$/)
  if (curve) return `border-radius: ${resolveValue(curve[1],'radius')};`

  // ── RING ──
  const ringColor = className.match(/^ring-color:(.+)$/)
  if (ringColor) return `outline-color: ${resolveValue(ringColor[1],'color')};`

  const ringWidth = className.match(/^ring-width:(.+)$/)
  if (ringWidth) return `outline-width: ${resolveValue(ringWidth[1],'stroke')};`

  const ringOffset = className.match(/^ring-offset:(.+)$/)
  if (ringOffset) return `outline-offset: ${ringOffset[1]};`

  const ring = className.match(/^ring:(.+)$/)
  if (ring) return `outline: ${resolveValue(ring[1],'stroke')} solid;`

  // ── CAST ──
  const castText = className.match(/^cast-text:(.+)$/)
  if (castText) return `text-shadow: ${resolveValue(castText[1],'shadow')};`

  const castInner = className.match(/^cast-inner:(.+)$/)
  if (castInner) return `box-shadow: inset ${resolveValue(castInner[1],'shadow')};`

  const castDrop = className.match(/^cast-drop:(.+)$/)
  if (castDrop) return `filter: drop-shadow(${resolveValue(castDrop[1],'shadow')});`

  const cast = className.match(/^cast:(.+)$/)
  if (cast) return `box-shadow: ${resolveValue(cast[1],'shadow')};`

  // ── GLOW ──
  const glowBlur = className.match(/^glow-blur:(.+)$/)
  if (glowBlur) return `filter: blur(${resolveValue(glowBlur[1],'blur')});`

  const glowBright = className.match(/^glow-bright:(.+)$/)
  if (glowBright) return `filter: brightness(${glowBright[1]});`

  const glowContrast = className.match(/^glow-contrast:(.+)$/)
  if (glowContrast) return `filter: contrast(${glowContrast[1]});`

  const glowGray = className.match(/^glow-gray:(.+)$/)
  if (glowGray) return `filter: grayscale(${glowGray[1]});`

  const glowHue = className.match(/^glow-hue:(.+)$/)
  if (glowHue) return `filter: hue-rotate(${glowHue[1]});`

  const glowInvert = className.match(/^glow-invert:(.+)$/)
  if (glowInvert) return `filter: invert(${glowInvert[1]});`

  const glowFade = className.match(/^glow-fade:(.+)$/)
  if (glowFade) return `filter: opacity(${glowFade[1]});`

  const glowSat = className.match(/^glow-sat:(.+)$/)
  if (glowSat) return `filter: saturate(${glowSat[1]});`

  const glowSepia = className.match(/^glow-sepia:(.+)$/)
  if (glowSepia) return `filter: sepia(${glowSepia[1]});`

  const glow = className.match(/^glow:(.+)$/)
  if (glow) return `filter: ${glow[1].replace(/_/g,' ')};`

  // ── GLASS ──
  const glassBlur = className.match(/^glass-blur:(.+)$/)
  if (glassBlur) return `backdrop-filter: blur(${resolveValue(glassBlur[1],'blur')});`

  const glassBright = className.match(/^glass-bright:(.+)$/)
  if (glassBright) return `backdrop-filter: brightness(${glassBright[1]});`

  const glassGray = className.match(/^glass-gray:(.+)$/)
  if (glassGray) return `backdrop-filter: grayscale(${glassGray[1]});`

  const glassSat = className.match(/^glass-sat:(.+)$/)
  if (glassSat) return `backdrop-filter: saturate(${glassSat[1]});`

  const glassContrast = className.match(/^glass-contrast:(.+)$/)
  if (glassContrast) return `backdrop-filter: contrast(${glassContrast[1]});`

  const glass = className.match(/^glass:(.+)$/)
  if (glass) return `backdrop-filter: blur(${resolveValue(glass[1],'blur')});`

  // ── CLIP ──
  const clip = className.match(/^clip:(.+)$/)
  if (clip) return `clip-path: ${clip[1].replace(/_/g,' ')};`

  const clipMar = className.match(/^clip-mar:(.+)$/)
  if (clipMar) return `overflow-clip-margin: ${clipMar[1]};`

  // ── MASK ──
  const maskImg = className.match(/^mask-img:(.+)$/)
  if (maskImg) return `mask-image: ${isRawCSSValue(maskImg[1]) ? maskImg[1] : `url(${maskImg[1]})`};`

  const maskPos = className.match(/^mask-pos:(.+)$/)
  if (maskPos) return `mask-position: ${maskPos[1].replace(/_/g,' ')};`

  const maskSize = className.match(/^mask-size:(.+)$/)
  if (maskSize) return `mask-size: ${maskSize[1].replace(/_/g,' ')};`

  const mask = className.match(/^mask:(.+)$/)
  if (mask) return `mask: ${mask[1].replace(/_/g,' ')};`

  // ── POSITION ──
  const posTop = className.match(/^pos-top:(.+)$/)
  if (posTop) return `top: ${resolveValue(posTop[1],'spacing')};`

  const posRight = className.match(/^pos-right:(.+)$/)
  if (posRight) return `right: ${resolveValue(posRight[1],'spacing')};`

  const posBtm = className.match(/^pos-btm:(.+)$/)
  if (posBtm) return `bottom: ${resolveValue(posBtm[1],'spacing')};`

  const posLeft = className.match(/^pos-left:(.+)$/)
  if (posLeft) return `left: ${resolveValue(posLeft[1],'spacing')};`

  const posInset = className.match(/^pos-inset:(.+)$/)
  if (posInset) return `inset: ${resolveValue(posInset[1],'spacing')};`

  const posInsetX = className.match(/^pos-inset-x:(.+)$/)
  if (posInsetX) { const v=resolveValue(posInsetX[1],'spacing'); return `left: ${v}; right: ${v};` }

  const posInsetXStart = className.match(/^pos-inset-x-start:(.+)$/)
  if (posInsetXStart) return `inset-inline-start: ${resolveValue(posInsetXStart[1],'spacing')};`

  const posInsetXEnd = className.match(/^pos-inset-x-end:(.+)$/)
  if (posInsetXEnd) return `inset-inline-end: ${resolveValue(posInsetXEnd[1],'spacing')};`

  const posInsetY = className.match(/^pos-inset-y:(.+)$/)
  if (posInsetY) { const v=resolveValue(posInsetY[1],'spacing'); return `top: ${v}; bottom: ${v};` }

  const posInsetYStart = className.match(/^pos-inset-y-start:(.+)$/)
  if (posInsetYStart) return `inset-block-start: ${resolveValue(posInsetYStart[1],'spacing')};`

  const posInsetYEnd = className.match(/^pos-inset-y-end:(.+)$/)
  if (posInsetYEnd) return `inset-block-end: ${resolveValue(posInsetYEnd[1],'spacing')};`

  // Anchor positioning
  const posAnchor = className.match(/^pos-anchor:(.+)$/)
  if (posAnchor) return `position-anchor: --${posAnchor[1]};`

  const posTry = className.match(/^pos-try:(.+)$/)
  if (posTry) return `position-try: ${posTry[1].replace(/_/g,' ')};`

  // ── LAYER (z-index) ──
  const layer = className.match(/^layer:(.+)$/)
  if (layer) return `z-index: ${resolveValue(layer[1],'z')};`

  // ── FLEX ──
  const flexGrow = className.match(/^flex-grow:(.+)$/)
  if (flexGrow) return `flex-grow: ${flexGrow[1]};`

  const flexShrink = className.match(/^flex-shrink:(.+)$/)
  if (flexShrink) return `flex-shrink: ${flexShrink[1]};`

  const flexBase = className.match(/^flex-base:(.+)$/)
  if (flexBase) return `flex-basis: ${resolveValue(flexBase[1],'spacing')};`

  const flexOrder = className.match(/^flex-order:(.+)$/)
  if (flexOrder) return `order: ${flexOrder[1]};`

  const flex = className.match(/^flex:(.+)$/)
  if (flex) return `flex: ${flex[1]};`

  // ── GRID ──
  const gridCols = className.match(/^grid-cols:(.+)$/)
  if (gridCols) return `grid-template-columns: ${gridCols[1].replace(/_/g,' ')};`

  const gridRows = className.match(/^grid-rows:(.+)$/)
  if (gridRows) return `grid-template-rows: ${gridRows[1].replace(/_/g,' ')};`

  const gridAreas = className.match(/^grid-areas:(.+)$/)
  if (gridAreas) return `grid-template-areas: ${gridAreas[1].replace(/\|/g,'" "').replace(/^/,'"').replace(/$/,'"')};`

  const gridArea = className.match(/^grid-area:(.+)$/)
  if (gridArea) return `grid-area: ${gridArea[1]};`

  const gridColStart = className.match(/^grid-col-start:(.+)$/)
  if (gridColStart) return `grid-column-start: ${gridColStart[1]};`

  const gridColEnd = className.match(/^grid-col-end:(.+)$/)
  if (gridColEnd) return `grid-column-end: ${gridColEnd[1]};`

  const gridRowStart = className.match(/^grid-row-start:(.+)$/)
  if (gridRowStart) return `grid-row-start: ${gridRowStart[1]};`

  const gridRowEnd = className.match(/^grid-row-end:(.+)$/)
  if (gridRowEnd) return `grid-row-end: ${gridRowEnd[1]};`

  const gridCol = className.match(/^grid-col:(.+)$/)
  if (gridCol) return `grid-column: ${gridCol[1].replace(/_/g,' ')};`

  const gridRow = className.match(/^grid-row:(.+)$/)
  if (gridRow) return `grid-row: ${gridRow[1].replace(/_/g,' ')};`

  const gridColAuto = className.match(/^grid-col-auto:(.+)$/)
  if (gridColAuto) return `grid-auto-columns: ${gridColAuto[1].replace(/_/g,' ')};`

  const gridRowAuto = className.match(/^grid-row-auto:(.+)$/)
  if (gridRowAuto) return `grid-auto-rows: ${gridRowAuto[1].replace(/_/g,' ')};`

  const gridTemplate = className.match(/^grid-template:(.+)$/)
  if (gridTemplate) return `grid-template: ${gridTemplate[1].replace(/_/g,' ')};`

  const grid = className.match(/^grid:(.+)$/)
  if (grid) return `grid: ${grid[1].replace(/_/g,' ')};`

  // ── COLS (multi-column) ──
  const colsN = className.match(/^cols-n:(.+)$/)
  if (colsN) return `column-count: ${colsN[1]};`

  const colsW = className.match(/^cols-w:(.+)$/)
  if (colsW) return `column-width: ${resolveValue(colsW[1],'spacing')};`

  const colsGap = className.match(/^cols-gap:(.+)$/)
  if (colsGap) return `column-gap: ${resolveValue(colsGap[1],'spacing')};`

  const colsRuleColor = className.match(/^cols-rule-color:(.+)$/)
  if (colsRuleColor) return `column-rule-color: ${resolveValue(colsRuleColor[1],'color')};`

  const colsRuleWidth = className.match(/^cols-rule-width:(.+)$/)
  if (colsRuleWidth) return `column-rule-width: ${colsRuleWidth[1]};`

  const colsRuleStyle = className.match(/^cols-rule-style:(.+)$/)
  if (colsRuleStyle) return `column-rule-style: ${colsRuleStyle[1]};`

  const colsRule = className.match(/^cols-rule:(.+)$/)
  if (colsRule) return `column-rule: ${colsRule[1].replace(/_/g,' ')};`

  const colsFill = className.match(/^cols-fill:(.+)$/)
  if (colsFill) return `column-fill: ${colsFill[1]};`

  const colsSpan = className.match(/^cols-span:(.+)$/)
  if (colsSpan) return `column-span: ${colsSpan[1]};`

  const cols = className.match(/^cols:(.+)$/)
  if (cols) return `columns: ${cols[1]};`

  // legacy col-* aliases
  const colCount = className.match(/^col-count:(.+)$/)
  if (colCount) return `column-count: ${colCount[1]};`

  const colWidth = className.match(/^col-width:(.+)$/)
  if (colWidth) return `column-width: ${resolveValue(colWidth[1],'spacing')};`

  const colGap = className.match(/^col-gap:(.+)$/)
  if (colGap) return `column-gap: ${resolveValue(colGap[1],'spacing')};`

  const colRule = className.match(/^col-rule:(.+)$/)
  if (colRule) return `column-rule: ${colRule[1].replace(/_/g,' ')};`

  const colSpan = className.match(/^col-span:(.+)$/)
  if (colSpan) return `column-span: ${colSpan[1]};`

  // ── TYPE ──
  const typeFace = className.match(/^type-face:(.+)$/)
  if (typeFace) return `font-family: ${resolveValue(typeFace[1],'font')};`

  const typeSize = className.match(/^type-size:(.+)$/)
  if (typeSize) return `font-size: ${resolveValue(typeSize[1],'text')};`

  const typeWeight = className.match(/^type-weight:(.+)$/)
  if (typeWeight) return `font-weight: ${typeWeight[1]};`

  const typeStyle = className.match(/^type-style:(.+)$/)
  if (typeStyle) return `font-style: ${typeStyle[1]};`

  const typeStretch = className.match(/^type-stretch:(.+)$/)
  if (typeStretch) return `font-stretch: ${typeStretch[1]};`

  const typeKern = className.match(/^type-kern:(.+)$/)
  if (typeKern) return `font-kerning: ${typeKern[1]};`

  const typeOptical = className.match(/^type-optical:(.+)$/)
  if (typeOptical) return `font-optical-sizing: ${typeOptical[1]};`

  const typeFeature = className.match(/^type-feature:(.+)$/)
  if (typeFeature) return `font-feature-settings: "${typeFeature[1].replace(/_/g,' ')}";`

  const typeVariation = className.match(/^type-variation:(.+)$/)
  if (typeVariation) return `font-variation-settings: "${typeVariation[1]}";`

  const typeSizeAdjust = className.match(/^type-size-adjust:(.+)$/)
  if (typeSizeAdjust) return `font-size-adjust: ${typeSizeAdjust[1]};`

  const typePalette = className.match(/^type-palette:(.+)$/)
  if (typePalette) return `font-palette: ${typePalette[1]};`

  const typeVariant = className.match(/^type-variant:(.+)$/)
  if (typeVariant) return `font-variant: ${typeVariant[1]};`

  // ── LEADING / TRACKING ──
  const leading = className.match(/^leading:(.+)$/)
  if (leading) return `line-height: ${resolveValue(leading[1],'leading')};`

  const tracking = className.match(/^tracking:(.+)$/)
  if (tracking) return `letter-spacing: ${resolveValue(tracking[1],'tracking')};`

  const wordGap = className.match(/^word-gap:(.+)$/)
  if (wordGap) return `word-spacing: ${wordGap[1]};`

  const indent = className.match(/^indent:(.+)$/)
  if (indent) return `text-indent: ${resolveValue(indent[1],'spacing')};`

  const tab = className.match(/^tab:(.+)$/)
  if (tab) return `tab-size: ${tab[1]};`

  // ── TEXT composite ──
  const text = className.match(/^text:(.+)$/)
  if (text) {
    if (isRawCSSValue(text[1])) return `font-size: ${text[1]};`
    return `font-size: var(--text-${text[1]}-size); font-weight: var(--text-${text[1]}-weight); line-height: var(--text-${text[1]}-line);`
  }

  // ── TEXT DECORATION ──
  const textDecorColor = className.match(/^text-decor-color:(.+)$/)
  if (textDecorColor) return `text-decoration-color: ${resolveValue(textDecorColor[1],'color')};`

  const textDecorWidth = className.match(/^text-decor-width:(.+)$/)
  if (textDecorWidth) return `text-decoration-thickness: ${textDecorWidth[1]};`

  const textUnderOffset = className.match(/^text-under-offset:(.+)$/)
  if (textUnderOffset) return `text-underline-offset: ${textUnderOffset[1]};`

  const textEmphasisColor = className.match(/^text-emphasis-color:(.+)$/)
  if (textEmphasisColor) return `text-emphasis-color: ${resolveValue(textEmphasisColor[1],'color')};`

  const textEmphasis = className.match(/^text-emphasis:(.+)$/)
  if (textEmphasis) return `text-emphasis: ${textEmphasis[1].replace(/_/g,' ')};`

  const textSpacing = className.match(/^text-spacing:(.+)$/)
  if (textSpacing) return `text-spacing: ${textSpacing[1]};`

  const textAutospace = className.match(/^text-autospace:(.+)$/)
  if (textAutospace) return `text-autospace: ${textAutospace[1]};`

  const textStroke = className.match(/^text-stroke:(.+)$/)
  if (textStroke) return `-webkit-text-stroke: ${textStroke[1].replace(/_/g,' ')};`

  const textStrokeColor = className.match(/^text-stroke-color:(.+)$/)
  if (textStrokeColor) return `-webkit-text-stroke-color: ${resolveValue(textStrokeColor[1],'color')};`

  // ── MOVE (transforms) ──
  const moveX = className.match(/^move-x:(.+)$/)
  if (moveX) return `translate: ${moveX[1]} 0;`

  const moveY = className.match(/^move-y:(.+)$/)
  if (moveY) return `translate: 0 ${moveY[1]};`

  const moveZ = className.match(/^move-z:(.+)$/)
  if (moveZ) return `translate: 0 0 ${moveZ[1]};`

  const move3d = className.match(/^move-3d:(.+)$/)
  if (move3d) { const p = move3d[1].split('_'); return `translate: ${p[0]||'0'} ${p[1]||'0'} ${p[2]||'0'};` }

  const move = className.match(/^move:(.+)$/)
  if (move) { const p = move[1].split('_'); return `translate: ${p[0]||'0'} ${p[1]||'0'};` }

  const spinX = className.match(/^spin-x:(.+)$/)
  if (spinX) return `rotate: x ${spinX[1]};`

  const spinY = className.match(/^spin-y:(.+)$/)
  if (spinY) return `rotate: y ${spinY[1]};`

  const spinZ = className.match(/^spin-z:(.+)$/)
  if (spinZ) return `rotate: z ${spinZ[1]};`

  const spin = className.match(/^spin:(.+)$/)
  if (spin) return `rotate: ${spin[1]};`

  const scaleX = className.match(/^scale-x:(.+)$/)
  if (scaleX) return `scale: ${scaleX[1]} 1;`

  const scaleY = className.match(/^scale-y:(.+)$/)
  if (scaleY) return `scale: 1 ${scaleY[1]};`

  const scale = className.match(/^scale:(.+)$/)
  if (scale) return `scale: ${scale[1]};`

  const skewX = className.match(/^skew-x:(.+)$/)
  if (skewX) return `transform: skewX(${skewX[1]});`

  const skewY = className.match(/^skew-y:(.+)$/)
  if (skewY) return `transform: skewY(${skewY[1]});`

  const skew = className.match(/^skew:(.+)$/)
  if (skew) { const p = skew[1].split('_'); return `transform: skew(${p[0]||'0'}${p[1] ? ','+p[1] : ''});` }

  const transform = className.match(/^transform:(.+)$/)
  if (transform) return `transform: ${transform[1].replace(/_/g,' ')};`

  const origin = className.match(/^origin:(.+)$/)
  if (origin) return `transform-origin: ${origin[1].replace(/_/g,' ')};`

  const depthView = className.match(/^depth-view:(.+)$/)
  if (depthView) return `perspective: ${depthView[1]};`

  const depthOrigin = className.match(/^depth-origin:(.+)$/)
  if (depthOrigin) return `perspective-origin: ${depthOrigin[1].replace(/_/g,' ')};`

  // ── EASE ──
  const easeProp = className.match(/^ease-prop:(.+)$/)
  if (easeProp) return `transition-property: ${easeProp[1].replace(/_/g,' ')};`

  const easeSpeed = className.match(/^ease-speed:(.+)$/)
  if (easeSpeed) return `transition-duration: ${resolveValue(easeSpeed[1],'duration')};`

  const easeCurve = className.match(/^ease-curve:(.+)$/)
  if (easeCurve) return `transition-timing-function: ${resolveValue(easeCurve[1],'ease')};`

  const easeWait = className.match(/^ease-wait:(.+)$/)
  if (easeWait) return `transition-delay: ${resolveValue(easeWait[1],'duration')};`

  const ease = className.match(/^ease:(.+)$/)
  if (ease) return `transition: all ${resolveValue(ease[1],'duration')} var(--ease-smooth, cubic-bezier(0.4,0,0.2,1));`

  // ── PLAY ──
  const playName = className.match(/^play-name:(.+)$/)
  if (playName) return `animation-name: ${playName[1]};`

  const playSpeed = className.match(/^play-speed:(.+)$/)
  if (playSpeed) return `animation-duration: ${resolveValue(playSpeed[1],'duration')};`

  const playCurve = className.match(/^play-curve:(.+)$/)
  if (playCurve) return `animation-timing-function: ${resolveValue(playCurve[1],'ease')};`

  const playLoop = className.match(/^play-loop:(.+)$/)
  if (playLoop) return `animation-iteration-count: ${playLoop[1]};`

  const playWait = className.match(/^play-wait:(.+)$/)
  if (playWait) return `animation-delay: ${resolveValue(playWait[1],'duration')};`

  const playState = className.match(/^play-state:(.+)$/)
  if (playState) return `animation-play-state: ${playState[1]};`

  const playFill = className.match(/^play-fill:(.+)$/)
  if (playFill) return `animation-fill-mode: ${playFill[1]};`

  const playDir = className.match(/^play-dir:(.+)$/)
  if (playDir) return `animation-direction: ${playDir[1]};`

  const playTimeline = className.match(/^play-timeline:(.+)$/)
  if (playTimeline) return `animation-timeline: --${playTimeline[1]};`

  const playRange = className.match(/^play-range:(.+)$/)
  if (playRange) return `animation-range: ${playRange[1].replace(/_/g,' ')};`

  const playRangeStart = className.match(/^play-range-start:(.+)$/)
  if (playRangeStart) return `animation-range-start: ${playRangeStart[1].replace(/_/g,' ')};`

  const playRangeEnd = className.match(/^play-range-end:(.+)$/)
  if (playRangeEnd) return `animation-range-end: ${playRangeEnd[1].replace(/_/g,' ')};`

  const play = className.match(/^play:(.+)$/)
  if (play) return `animation: ${play[1].replace(/_/g,' ')};`

  // ── SCROLL ──
  const scrollPadTop = className.match(/^scroll-pad-top:(.+)$/)
  if (scrollPadTop) return `scroll-padding-top: ${resolveValue(scrollPadTop[1],'spacing')};`

  const scrollPadRight = className.match(/^scroll-pad-right:(.+)$/)
  if (scrollPadRight) return `scroll-padding-right: ${resolveValue(scrollPadRight[1],'spacing')};`

  const scrollPadBtm = className.match(/^scroll-pad-btm:(.+)$/)
  if (scrollPadBtm) return `scroll-padding-bottom: ${resolveValue(scrollPadBtm[1],'spacing')};`

  const scrollPadLeft = className.match(/^scroll-pad-left:(.+)$/)
  if (scrollPadLeft) return `scroll-padding-left: ${resolveValue(scrollPadLeft[1],'spacing')};`

  const scrollPadX = className.match(/^scroll-pad-x:(.+)$/)
  if (scrollPadX) { const v=resolveValue(scrollPadX[1],'spacing'); return `scroll-padding-left: ${v}; scroll-padding-right: ${v};` }

  const scrollPadY = className.match(/^scroll-pad-y:(.+)$/)
  if (scrollPadY) { const v=resolveValue(scrollPadY[1],'spacing'); return `scroll-padding-top: ${v}; scroll-padding-bottom: ${v};` }

  const scrollPad = className.match(/^scroll-pad:(.+)$/)
  if (scrollPad) return `scroll-padding: ${resolveValue(scrollPad[1],'spacing')};`

  const scrollMarTop = className.match(/^scroll-mar-top:(.+)$/)
  if (scrollMarTop) return `scroll-margin-top: ${resolveValue(scrollMarTop[1],'spacing')};`

  const scrollMarRight = className.match(/^scroll-mar-right:(.+)$/)
  if (scrollMarRight) return `scroll-margin-right: ${resolveValue(scrollMarRight[1],'spacing')};`

  const scrollMarBtm = className.match(/^scroll-mar-btm:(.+)$/)
  if (scrollMarBtm) return `scroll-margin-bottom: ${resolveValue(scrollMarBtm[1],'spacing')};`

  const scrollMarLeft = className.match(/^scroll-mar-left:(.+)$/)
  if (scrollMarLeft) return `scroll-margin-left: ${resolveValue(scrollMarLeft[1],'spacing')};`

  const scrollMar = className.match(/^scroll-mar:(.+)$/)
  if (scrollMar) return `scroll-margin: ${resolveValue(scrollMar[1],'spacing')};`

  const scrollTimelineName = className.match(/^scroll-timeline-name:(.+)$/)
  if (scrollTimelineName) return `scroll-timeline-name: --${scrollTimelineName[1]};`

  const scrollTimelineAxis = className.match(/^scroll-timeline-axis:(.+)$/)
  if (scrollTimelineAxis) return `scroll-timeline-axis: ${scrollTimelineAxis[1]};`

  const scrollTimeline = className.match(/^scroll-timeline:(.+)$/)
  if (scrollTimeline) return `scroll-timeline-name: --${scrollTimeline[1]};`

  // ── FRAME ──
  const frameName = className.match(/^frame-name:(.+)$/)
  if (frameName) return `container-name: ${frameName[1]};`

  const frameSize = className.match(/^frame-size:(.+)$/)
  if (frameSize) return `contain-intrinsic-size: ${frameSize[1].replace(/_/g,' ')};`

  const frameSizeW = className.match(/^frame-size-w:(.+)$/)
  if (frameSizeW) return `contain-intrinsic-width: ${frameSizeW[1]};`

  const frameSizeH = className.match(/^frame-size-h:(.+)$/)
  if (frameSizeH) return `contain-intrinsic-height: ${frameSizeH[1]};`

  const frameSizeX = className.match(/^frame-size-x:(.+)$/)
  if (frameSizeX) return `contain-intrinsic-inline-size: ${frameSizeX[1]};`

  const frameSizeY = className.match(/^frame-size-y:(.+)$/)
  if (frameSizeY) return `contain-intrinsic-block-size: ${frameSizeY[1]};`

  // ── SCENE ──
  const sceneName = className.match(/^scene-name:(.+)$/)
  if (sceneName) return `view-transition-name: ${sceneName[1]};`

  const sceneClass = className.match(/^scene-class:(.+)$/)
  if (sceneClass) return `view-transition-class: ${sceneClass[1]};`

  // ── BAR (scrollbar) ──
  const barColor = className.match(/^bar-color:(.+)$/)
  if (barColor) {
    const parts = barColor[1].split('_')
    const thumb = resolveValue(parts[0],'color')
    const track = resolveValue(parts[1] || parts[0],'color')
    return `scrollbar-color: ${thumb} ${track};`
  }

  // ── PATH ──
  const pathProp = className.match(/^path:(.+)$/)
  if (pathProp) return `offset-path: ${pathProp[1].replace(/_/g,' ')};`

  const pathDist = className.match(/^path-dist:(.+)$/)
  if (pathDist) return `offset-distance: ${pathDist[1]};`

  const pathSpin = className.match(/^path-spin:(.+)$/)
  if (pathSpin) return `offset-rotate: ${pathSpin[1]};`

  const pathAnchor = className.match(/^path-anchor:(.+)$/)
  if (pathAnchor) return `offset-anchor: ${pathAnchor[1].replace(/_/g,' ')};`

  const pathPos = className.match(/^path-pos:(.+)$/)
  if (pathPos) return `offset-position: ${pathPos[1].replace(/_/g,' ')};`

  // ── SHAPE ──
  const shapeMar = className.match(/^shape-mar:(.+)$/)
  if (shapeMar) return `shape-margin: ${resolveValue(shapeMar[1],'spacing')};`

  const shapeImg = className.match(/^shape-img:(.+)$/)
  if (shapeImg) return `shape-image-threshold: ${shapeImg[1]};`

  const shapeOut = className.match(/^shape:(.+)$/)
  if (shapeOut) return `shape-outside: ${shapeOut[1].replace(/_/g,' ')};`

  // ── SVG ──
  const svgStroke = className.match(/^svg-stroke:(.+)$/)
  if (svgStroke) return `stroke: ${resolveValue(svgStroke[1],'color')};`

  const svgStrokeWidth = className.match(/^svg-stroke-width:(.+)$/)
  if (svgStrokeWidth) return `stroke-width: ${svgStrokeWidth[1]};`

  const svgStrokeDash = className.match(/^svg-stroke-dash:(.+)$/)
  if (svgStrokeDash) return `stroke-dasharray: ${svgStrokeDash[1].replace(/_/g,' ')};`

  const svgStrokeOffset = className.match(/^svg-stroke-offset:(.+)$/)
  if (svgStrokeOffset) return `stroke-dashoffset: ${svgStrokeOffset[1]};`

  const svgStrokeFade = className.match(/^svg-stroke-fade:(.+)$/)
  if (svgStrokeFade) return `stroke-opacity: ${svgStrokeFade[1]};`

  const svgStrokeLimit = className.match(/^svg-stroke-limit:(.+)$/)
  if (svgStrokeLimit) return `stroke-miterlimit: ${svgStrokeLimit[1]};`

  const svgFill = className.match(/^ink-fill:(.+)$/)
  if (svgFill) return `fill: ${resolveValue(svgFill[1],'color')};`

  const svgFillFade = className.match(/^ink-fill-fade:(.+)$/)
  if (svgFillFade) return `fill-opacity: ${svgFillFade[1]};`

  const svgMarker = className.match(/^svg-marker:(.+)$/)
  if (svgMarker) return `marker: url(#${svgMarker[1]});`

  const svgMarkerStart = className.match(/^svg-marker-start:(.+)$/)
  if (svgMarkerStart) return `marker-start: url(#${svgMarkerStart[1]});`

  const svgMarkerMid = className.match(/^svg-marker-mid:(.+)$/)
  if (svgMarkerMid) return `marker-mid: url(#${svgMarkerMid[1]});`

  const svgMarkerEnd = className.match(/^svg-marker-end:(.+)$/)
  if (svgMarkerEnd) return `marker-end: url(#${svgMarkerEnd[1]});`

  const svgFloodColor = className.match(/^svg-flood-color:(.+)$/)
  if (svgFloodColor) return `flood-color: ${resolveValue(svgFloodColor[1],'color')};`

  const svgFloodFade = className.match(/^svg-flood-fade:(.+)$/)
  if (svgFloodFade) return `flood-opacity: ${svgFloodFade[1]};`

  const svgStopColor = className.match(/^svg-stop-color:(.+)$/)
  if (svgStopColor) return `stop-color: ${resolveValue(svgStopColor[1],'color')};`

  const svgStopFade = className.match(/^svg-stop-fade:(.+)$/)
  if (svgStopFade) return `stop-opacity: ${svgStopFade[1]};`

  const svgLightColor = className.match(/^svg-light-color:(.+)$/)
  if (svgLightColor) return `lighting-color: ${resolveValue(svgLightColor[1],'color')};`

  // ── ANCHOR ──
  const anchorName = className.match(/^anchor-name:(.+)$/)
  if (anchorName) return `anchor-name: --${anchorName[1]};`

  const anchorScope = className.match(/^anchor-scope:(.+)$/)
  if (anchorScope) return `anchor-scope: --${anchorScope[1]};`

  // ── RUBY ──
  const rubyAlign = className.match(/^ruby-align:(.+)$/)
  if (rubyAlign) return `ruby-align: ${rubyAlign[1]};`

  const rubyPos = className.match(/^ruby-pos:(.+)$/)
  if (rubyPos) return `ruby-position: ${rubyPos[1]};`

  // ── IMAGE ──
  const imgView = className.match(/^img-view:(.+)$/)
  if (imgView) return `object-view-box: ${imgView[1].replace(/_/g,' ')};`

  const imgRes = className.match(/^img-res:(.+)$/)
  if (imgRes) return `image-resolution: ${imgRes[1]};`

  // ── COLOR ──
  const colorRender = className.match(/^color-render:(.+)$/)
  if (colorRender) return `color-rendering: ${colorRender[1]};`

  const colorInterp = className.match(/^color-interp:(.+)$/)
  if (colorInterp) return `color-interpolation: ${colorInterp[1]};`

  // ── PAGE ──
  const pageSize = className.match(/^page-size:(.+)$/)
  if (pageSize) return `size: ${pageSize[1].replace(/_/g,' ')};`

  const pageBleed = className.match(/^page-bleed:(.+)$/)
  if (pageBleed) return `bleed: ${pageBleed[1]};`

  const pageMarks = className.match(/^page-marks:(.+)$/)
  if (pageMarks) return `marks: ${pageMarks[1]};`

  // ── SAFE AREA ──
  const safeTop = className.match(/^safe-top:(.+)$/)
  if (safeTop) return `padding-top: env(safe-area-inset-top, ${safeTop[1]});`

  const safeRight = className.match(/^safe-right:(.+)$/)
  if (safeRight) return `padding-right: env(safe-area-inset-right, ${safeRight[1]});`

  const safeBtm = className.match(/^safe-btm:(.+)$/)
  if (safeBtm) return `padding-bottom: env(safe-area-inset-bottom, ${safeBtm[1]});`

  const safeLeft = className.match(/^safe-left:(.+)$/)
  if (safeLeft) return `padding-left: env(safe-area-inset-left, ${safeLeft[1]});`

  // ── COUNTER ──
  const counterReset = className.match(/^counter-reset:(.+)$/)
  if (counterReset) return `counter-reset: ${counterReset[1]};`

  const counterInc = className.match(/^counter-inc:(.+)$/)
  if (counterInc) return `counter-increment: ${counterInc[1]};`

  const counterSet = className.match(/^counter-set:(.+)$/)
  if (counterSet) return `counter-set: ${counterSet[1]};`

  // ── MISC ──
  const will = className.match(/^will:(.+)$/)
  if (will) return `will-change: ${will[1]};`

  const content = className.match(/^content:(.+)$/)
  if (content) return `content: "${content[1]}";`

  const fieldSize = className.match(/^field-size:(.+)$/)
  if (fieldSize) return `field-sizing: ${fieldSize[1]};`

  const caretShape = className.match(/^cursor-shape:(.+)$/)
  if (caretShape) return `caret-shape: ${caretShape[1]};`

  const orphans = className.match(/^orphans:(.+)$/)
  if (orphans) return `orphans: ${orphans[1]};`

  const widows = className.match(/^widows:(.+)$/)
  if (widows) return `widows: ${widows[1]};`

  const quotes = className.match(/^quotes:(.+)$/)
  if (quotes) return `quotes: ${quotes[1].replace(/_/g,' ')};`

  // ── STATIC MAP fallback ──
  return STATIC_MAP[className] || null
}

// ============================================================
// Helper: resolve a value as a token var() or pass through
// ============================================================
function resolveValue(val, tokenGroup) {
  if (isRawCSSValue(val)) {
    return val.replace(/_/g, ' ')
  }
  return `var(--${tokenGroup}-${val})`
}

function isRawCSSValue(val) {
  if (typeof val !== 'string') return false
  const v = val.replace(/_/g, ' ')
  return (
    /^-?[0-9]/.test(v)       ||
    v.includes('px')         ||
    v.includes('rem')        ||
    v.includes('em')         ||
    v.includes('%')          ||
    v.includes('vw')         ||
    v.includes('vh')         ||
    v.includes('vmin')       ||
    v.includes('vmax')       ||
    v.includes('dvh')        ||
    v.includes('dvw')        ||
    v.includes('svh')        ||
    v.includes('lvh')        ||
    v.includes('cqi')        ||
    v.includes('cqb')        ||
    v.includes('ch')         ||
    v.includes('calc(')      ||
    v.includes('clamp(')     ||
    v.includes('min(')       ||
    v.includes('max(')       ||
    v.includes('var(')       ||
    v.includes('#')          ||
    v.startsWith('rgb')      ||
    v.startsWith('hsl')      ||
    v.startsWith('oklch')    ||
    v.startsWith('oklab')    ||
    v.startsWith('color(')   ||
    v.startsWith('linear-gradient')  ||
    v.startsWith('radial-gradient')  ||
    v.startsWith('conic-gradient')   ||
    v === 'auto'             ||
    v === 'inherit'          ||
    v === 'initial'          ||
    v === 'unset'            ||
    v === 'none'             ||
    v === 'normal'           ||
    v === 'revert'
  )
}

// ============================================================
// TOKEN UTILITY GENERATOR
// ============================================================
export function generateTokenUtilities(tokens = {}) {
  const utilities = []

  // ── Colors → ink, paint, stroke-color, ring-color etc ──
  if (tokens.colors) {
    for (const [key, value] of Object.entries(tokens.colors)) {
      if (typeof value === 'object' && value !== null) {
        for (const [shade] of Object.entries(value)) {
          const s = shade === 'DEFAULT' ? '' : `-${shade}`
          const name = `${key}${s}`
          utilities.push({ class: `ink:${name}`,             css: `color: var(--color-${name});` })
          utilities.push({ class: `paint:${name}`,           css: `background-color: var(--color-${name});` })
          utilities.push({ class: `stroke-color:${name}`,    css: `border-color: var(--color-${name});` })
          utilities.push({ class: `stroke-top-color:${name}`,css: `border-top-color: var(--color-${name});` })
          utilities.push({ class: `stroke-btm-color:${name}`,css: `border-bottom-color: var(--color-${name});` })
          utilities.push({ class: `stroke-left-color:${name}`,css:`border-left-color: var(--color-${name});` })
          utilities.push({ class: `stroke-right-color:${name}`,css:`border-right-color: var(--color-${name});` })
          utilities.push({ class: `ring-color:${name}`,      css: `outline-color: var(--color-${name});` })
          utilities.push({ class: `ink-fill:${name}`,        css: `fill: var(--color-${name});` })
          utilities.push({ class: `svg-stroke:${name}`,      css: `stroke: var(--color-${name});` })
          utilities.push({ class: `ink-caret:${name}`,       css: `caret-color: var(--color-${name});` })
          utilities.push({ class: `ink-accent:${name}`,      css: `accent-color: var(--color-${name});` })
          utilities.push({ class: `cast-text:${name}`,       css: `text-shadow: 0 2px 4px var(--color-${name});` })
          utilities.push({ class: `text-decor-color:${name}`,css: `text-decoration-color: var(--color-${name});` })
          utilities.push({ class: `text-emphasis-color:${name}`,css:`text-emphasis-color: var(--color-${name});` })
          utilities.push({ class: `cols-rule-color:${name}`, css: `column-rule-color: var(--color-${name});` })
        }
      } else {
        utilities.push({ class: `ink:${key}`,             css: `color: var(--color-${key});` })
        utilities.push({ class: `paint:${key}`,           css: `background-color: var(--color-${key});` })
        utilities.push({ class: `stroke-color:${key}`,    css: `border-color: var(--color-${key});` })
        utilities.push({ class: `stroke-top-color:${key}`,css: `border-top-color: var(--color-${key});` })
        utilities.push({ class: `stroke-btm-color:${key}`,css: `border-bottom-color: var(--color-${key});` })
        utilities.push({ class: `stroke-left-color:${key}`,css:`border-left-color: var(--color-${key});` })
        utilities.push({ class: `stroke-right-color:${key}`,css:`border-right-color: var(--color-${key});` })
        utilities.push({ class: `ring-color:${key}`,      css: `outline-color: var(--color-${key});` })
        utilities.push({ class: `ink-fill:${key}`,        css: `fill: var(--color-${key});` })
        utilities.push({ class: `svg-stroke:${key}`,      css: `stroke: var(--color-${key});` })
        utilities.push({ class: `ink-caret:${key}`,       css: `caret-color: var(--color-${key});` })
        utilities.push({ class: `ink-accent:${key}`,      css: `accent-color: var(--color-${key});` })
        utilities.push({ class: `text-decor-color:${key}`,css: `text-decoration-color: var(--color-${key});` })
        utilities.push({ class: `text-emphasis-color:${key}`,css:`text-emphasis-color: var(--color-${key});` })
        utilities.push({ class: `cols-rule-color:${key}`, css: `column-rule-color: var(--color-${key});` })
      }
    }
  }

  // ── Spacing → pad, mar, gap, pos, canvas-w/h, logical variants ──
  if (tokens.spacing) {
    for (const [key] of Object.entries(tokens.spacing)) {
      const v = `var(--spacing-${key})`
      utilities.push({ class: `pad:${key}`,          css: `padding: ${v};` })
      utilities.push({ class: `pad-x:${key}`,        css: `padding-left: ${v}; padding-right: ${v};` })
      utilities.push({ class: `pad-x-start:${key}`,  css: `padding-inline-start: ${v};` })
      utilities.push({ class: `pad-x-end:${key}`,    css: `padding-inline-end: ${v};` })
      utilities.push({ class: `pad-y:${key}`,        css: `padding-top: ${v}; padding-bottom: ${v};` })
      utilities.push({ class: `pad-y-start:${key}`,  css: `padding-block-start: ${v};` })
      utilities.push({ class: `pad-y-end:${key}`,    css: `padding-block-end: ${v};` })
      utilities.push({ class: `pad-top:${key}`,      css: `padding-top: ${v};` })
      utilities.push({ class: `pad-right:${key}`,    css: `padding-right: ${v};` })
      utilities.push({ class: `pad-btm:${key}`,      css: `padding-bottom: ${v};` })
      utilities.push({ class: `pad-left:${key}`,     css: `padding-left: ${v};` })
      utilities.push({ class: `mar:${key}`,          css: `margin: ${v};` })
      utilities.push({ class: `mar-x:${key}`,        css: `margin-left: ${v}; margin-right: ${v};` })
      utilities.push({ class: `mar-x-start:${key}`,  css: `margin-inline-start: ${v};` })
      utilities.push({ class: `mar-x-end:${key}`,    css: `margin-inline-end: ${v};` })
      utilities.push({ class: `mar-y:${key}`,        css: `margin-top: ${v}; margin-bottom: ${v};` })
      utilities.push({ class: `mar-y-start:${key}`,  css: `margin-block-start: ${v};` })
      utilities.push({ class: `mar-y-end:${key}`,    css: `margin-block-end: ${v};` })
      utilities.push({ class: `mar-top:${key}`,      css: `margin-top: ${v};` })
      utilities.push({ class: `mar-right:${key}`,    css: `margin-right: ${v};` })
      utilities.push({ class: `mar-btm:${key}`,      css: `margin-bottom: ${v};` })
      utilities.push({ class: `mar-left:${key}`,     css: `margin-left: ${v};` })
      utilities.push({ class: `gap:${key}`,          css: `gap: ${v};` })
      utilities.push({ class: `gap-x:${key}`,        css: `column-gap: ${v};` })
      utilities.push({ class: `gap-y:${key}`,        css: `row-gap: ${v};` })
      utilities.push({ class: `canvas-w:${key}`,     css: `width: ${v};` })
      utilities.push({ class: `canvas-h:${key}`,     css: `height: ${v};` })
      utilities.push({ class: `canvas-w-min:${key}`, css: `min-width: ${v};` })
      utilities.push({ class: `canvas-h-min:${key}`, css: `min-height: ${v};` })
      utilities.push({ class: `canvas-w-max:${key}`, css: `max-width: ${v};` })
      utilities.push({ class: `canvas-h-max:${key}`, css: `max-height: ${v};` })
      utilities.push({ class: `canvas-w-fit:${key}`, css: `inline-size: ${v};` })
      utilities.push({ class: `canvas-h-fit:${key}`, css: `block-size: ${v};` })
      utilities.push({ class: `pos-top:${key}`,      css: `top: ${v};` })
      utilities.push({ class: `pos-right:${key}`,    css: `right: ${v};` })
      utilities.push({ class: `pos-btm:${key}`,      css: `bottom: ${v};` })
      utilities.push({ class: `pos-left:${key}`,     css: `left: ${v};` })
      utilities.push({ class: `pos-inset:${key}`,    css: `inset: ${v};` })
      utilities.push({ class: `scroll-pad:${key}`,   css: `scroll-padding: ${v};` })
      utilities.push({ class: `scroll-mar:${key}`,   css: `scroll-margin: ${v};` })
      utilities.push({ class: `indent:${key}`,       css: `text-indent: ${v};` })
      utilities.push({ class: `stroke-gap:${key}`,   css: `border-spacing: ${v};` })
      utilities.push({ class: `shape-mar:${key}`,    css: `shape-margin: ${v};` })
      utilities.push({ class: `cols-gap:${key}`,     css: `column-gap: ${v};` })
    }
  }

  // ── Radius → curve ──
  if (tokens.radius) {
    for (const [key] of Object.entries(tokens.radius)) {
      utilities.push({ class: `curve:${key}`,       css: `border-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-tl:${key}`,    css: `border-top-left-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-tr:${key}`,    css: `border-top-right-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-bl:${key}`,    css: `border-bottom-left-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-br:${key}`,    css: `border-bottom-right-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-start:${key}`, css: `border-start-start-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-end:${key}`,   css: `border-end-end-radius: var(--radius-${key});` })
    }
  }

  // ── Shadows → cast ──
  if (tokens.shadows) {
    for (const [key] of Object.entries(tokens.shadows)) {
      utilities.push({ class: `cast:${key}`,        css: `box-shadow: var(--shadow-${key});` })
      utilities.push({ class: `cast-text:${key}`,   css: `text-shadow: var(--shadow-${key});` })
      utilities.push({ class: `cast-inner:${key}`,  css: `box-shadow: inset var(--shadow-${key});` })
      utilities.push({ class: `cast-drop:${key}`,   css: `filter: drop-shadow(var(--shadow-${key}));` })
    }
  }

  // ── Typography → text ──
  if (tokens.typography) {
    for (const [key, value] of Object.entries(tokens.typography)) {
      if (typeof value === 'object' && value !== null) {
        utilities.push({ class: `text:${key}`,       css: `font-size: var(--text-${key}-size); font-weight: var(--text-${key}-weight); line-height: var(--text-${key}-line);` })
        utilities.push({ class: `type-size:${key}`,  css: `font-size: var(--text-${key}-size);` })
        utilities.push({ class: `type-weight:${key}`,css: `font-weight: var(--text-${key}-weight);` })
        utilities.push({ class: `leading:${key}`,    css: `line-height: var(--text-${key}-line);` })
      }
    }
  }

  // ── Fonts → type-face ──
  if (tokens.fonts) {
    for (const [key] of Object.entries(tokens.fonts)) {
      utilities.push({ class: `type-face:${key}`, css: `font-family: var(--font-${key});` })
    }
  }

  // ── Easing → ease-curve, play-curve ──
  if (tokens.easing) {
    for (const [key] of Object.entries(tokens.easing)) {
      utilities.push({ class: `ease-curve:${key}`, css: `transition-timing-function: var(--ease-${key});` })
      utilities.push({ class: `play-curve:${key}`, css: `animation-timing-function: var(--ease-${key});` })
    }
  }

  // ── Duration → ease-speed, play-speed ──
  if (tokens.duration) {
    for (const [key] of Object.entries(tokens.duration)) {
      utilities.push({ class: `ease-speed:${key}`, css: `transition-duration: var(--duration-${key});` })
      utilities.push({ class: `ease-wait:${key}`,  css: `transition-delay: var(--duration-${key});` })
      utilities.push({ class: `play-speed:${key}`, css: `animation-duration: var(--duration-${key});` })
      utilities.push({ class: `play-wait:${key}`,  css: `animation-delay: var(--duration-${key});` })
    }
  }

  // ── Strokes → stroke-width, ring-width ──
  if (tokens.strokes) {
    for (const [key] of Object.entries(tokens.strokes)) {
      utilities.push({ class: `stroke-width:${key}`, css: `border-width: var(--stroke-${key});` })
      utilities.push({ class: `ring-width:${key}`,   css: `outline-width: var(--stroke-${key});` })
    }
  }

  // ── Blur → glass-blur, glow-blur ──
  if (tokens.blur) {
    for (const [key] of Object.entries(tokens.blur)) {
      utilities.push({ class: `glass-blur:${key}`, css: `backdrop-filter: blur(var(--blur-${key}));` })
      utilities.push({ class: `glow-blur:${key}`,  css: `filter: blur(var(--blur-${key}));` })
      utilities.push({ class: `glass:${key}`,      css: `backdrop-filter: blur(var(--blur-${key}));` })
    }
  }

  // ── Opacity → canvas-fade ──
  if (tokens.opacity) {
    for (const [key, value] of Object.entries(tokens.opacity)) {
      utilities.push({ class: `canvas-fade:${key}`, css: `opacity: ${value};` })
    }
  }

  // ── Z-index → layer ──
  if (tokens.zIndex) {
    for (const [key, value] of Object.entries(tokens.zIndex)) {
      utilities.push({ class: `layer:${key}`, css: `z-index: ${value};` })
    }
  }

  // ── Leading → leading ──
  if (tokens.leading) {
    for (const [key] of Object.entries(tokens.leading)) {
      utilities.push({ class: `leading:${key}`, css: `line-height: var(--leading-${key});` })
    }
  }

  // ── Tracking → tracking ──
  if (tokens.tracking) {
    for (const [key] of Object.entries(tokens.tracking)) {
      utilities.push({ class: `tracking:${key}`, css: `letter-spacing: var(--tracking-${key});` })
    }
  }

  return utilities
}

// ============================================================
// ALL UTILITIES COMBINED
// ============================================================
export function getAllUtilities(tokens = {}) {
  return [
    ...generateTokenUtilities(tokens),
    ...STATIC_UTILITIES
  ]
}

// ============================================================
// CAPABILITY → CSS PROPERTY MAP
// Used by pattern-expander for conflict detection
// ============================================================
export const CAPABILITY_PROPERTY_MAP = {
  'ink':              'color',
  'ink-caret':        'caret-color',
  'ink-accent':       'accent-color',
  'ink-fill':         'fill',
  'ink-fill-fade':    'fill-opacity',
  'ink-palette':      'font-palette',
  'paint':            'background-color',
  'paint-img':        'background-image',
  'paint-size':       'background-size',
  'paint-pos':        'background-position',
  'paint-pos-x':      'background-position-x',
  'paint-pos-y':      'background-position-y',
  'paint-blend':      'background-blend-mode',
  'paint-clip':       'background-clip',
  'paint-fix':        'background-attachment',
  'paint-origin':     'background-origin',
  'paint-tile':       'background-repeat',
  'pad':              'padding',
  'pad-x':            'padding-inline',
  'pad-x-start':      'padding-inline-start',
  'pad-x-end':        'padding-inline-end',
  'pad-y':            'padding-block',
  'pad-y-start':      'padding-block-start',
  'pad-y-end':        'padding-block-end',
  'pad-top':          'padding-top',
  'pad-right':        'padding-right',
  'pad-btm':          'padding-bottom',
  'pad-left':         'padding-left',
  'mar':              'margin',
  'mar-x':            'margin-inline',
  'mar-x-start':      'margin-inline-start',
  'mar-x-end':        'margin-inline-end',
  'mar-y':            'margin-block',
  'mar-y-start':      'margin-block-start',
  'mar-y-end':        'margin-block-end',
  'mar-top':          'margin-top',
  'mar-right':        'margin-right',
  'mar-btm':          'margin-bottom',
  'mar-left':         'margin-left',
  'gap':              'gap',
  'gap-x':            'column-gap',
  'gap-y':            'row-gap',
  'canvas-w':         'width',
  'canvas-h':         'height',
  'canvas-w-min':     'min-width',
  'canvas-h-min':     'min-height',
  'canvas-w-max':     'max-width',
  'canvas-h-max':     'max-height',
  'canvas-w-fit':     'inline-size',
  'canvas-h-fit':     'block-size',
  'canvas-w-fit-min': 'min-inline-size',
  'canvas-h-fit-min': 'min-block-size',
  'canvas-w-fit-max': 'max-inline-size',
  'canvas-h-fit-max': 'max-block-size',
  'canvas-ratio':     'aspect-ratio',
  'canvas-fade':      'opacity',
  'canvas-fit':       'object-fit',
  'canvas-fit-pos':   'object-position',
  'canvas-box':       'box-sizing',
  'canvas-show':      'visibility',
  'canvas-appear':    'appearance',
  'canvas-contain':   'contain',
  'canvas-render':    'content-visibility',
  'canvas-scheme':    'color-scheme',
  'canvas-resize':    'resize',
  'stroke':               'border',
  'stroke-color':         'border-color',
  'stroke-width':         'border-width',
  'stroke-style':         'border-style',
  'stroke-top':           'border-top',
  'stroke-top-color':     'border-top-color',
  'stroke-top-width':     'border-top-width',
  'stroke-top-style':     'border-top-style',
  'stroke-right':         'border-right',
  'stroke-right-color':   'border-right-color',
  'stroke-right-width':   'border-right-width',
  'stroke-right-style':   'border-right-style',
  'stroke-btm':           'border-bottom',
  'stroke-btm-color':     'border-bottom-color',
  'stroke-btm-width':     'border-bottom-width',
  'stroke-btm-style':     'border-bottom-style',
  'stroke-left':          'border-left',
  'stroke-left-color':    'border-left-color',
  'stroke-left-width':    'border-left-width',
  'stroke-left-style':    'border-left-style',
  'stroke-x':             'border-inline',
  'stroke-x-start':       'border-inline-start',
  'stroke-x-end':         'border-inline-end',
  'stroke-y':             'border-block',
  'stroke-y-start':       'border-block-start',
  'stroke-y-end':         'border-block-end',
  'stroke-img':           'border-image',
  'stroke-collapse':      'border-collapse',
  'stroke-gap':           'border-spacing',
  'curve':            'border-radius',
  'curve-tl':         'border-top-left-radius',
  'curve-tr':         'border-top-right-radius',
  'curve-bl':         'border-bottom-left-radius',
  'curve-br':         'border-bottom-right-radius',
  'curve-start':      'border-start-start-radius',
  'curve-end':        'border-end-end-radius',
  'ring':             'outline',
  'ring-color':       'outline-color',
  'ring-width':       'outline-width',
  'ring-style':       'outline-style',
  'ring-offset':      'outline-offset',
  'cast':             'box-shadow',
  'cast-text':        'text-shadow',
  'cast-inner':       'box-shadow',
  'cast-drop':        'filter',
  'glow':             'filter',
  'glow-blur':        'filter',
  'glow-bright':      'filter',
  'glow-contrast':    'filter',
  'glow-gray':        'filter',
  'glow-hue':         'filter',
  'glow-invert':      'filter',
  'glow-fade':        'filter',
  'glow-sat':         'filter',
  'glow-sepia':       'filter',
  'glass':            'backdrop-filter',
  'glass-blur':       'backdrop-filter',
  'glass-bright':     'backdrop-filter',
  'glass-gray':       'backdrop-filter',
  'glass-sat':        'backdrop-filter',
  'glass-contrast':   'backdrop-filter',
  'blend':            'mix-blend-mode',
  'blend-bg':         'background-blend-mode',
  'isolate':          'isolation',
  'clip':             'clip-path',
  'mask':             'mask',
  'mask-img':         'mask-image',
  'mask-pos':         'mask-position',
  'mask-size':        'mask-size',
  'mask-tile':        'mask-repeat',
  'mask-origin':      'mask-origin',
  'mask-clip':        'mask-clip',
  'mask-blend':       'mask-composite',
  'mask-mode':        'mask-mode',
  'pos':              'position',
  'pos-top':          'top',
  'pos-right':        'right',
  'pos-btm':          'bottom',
  'pos-left':         'left',
  'pos-inset':        'inset',
  'pos-inset-x':      'inset-inline',
  'pos-inset-x-start':'inset-inline-start',
  'pos-inset-x-end':  'inset-inline-end',
  'pos-inset-y':      'inset-block',
  'pos-inset-y-start':'inset-block-start',
  'pos-inset-y-end':  'inset-block-end',
  'pos-anchor':       'position-anchor',
  'pos-try':          'position-try',
  'layer':            'z-index',
  'float':            'float',
  'clear':            'clear',
  'display':          'display',
  'overflow':         'overflow',
  'overflow-x':       'overflow-x',
  'overflow-y':       'overflow-y',
  'overflow-anchor':  'overflow-anchor',
  'overscroll':       'overscroll-behavior',
  'overscroll-x':     'overscroll-behavior-x',
  'overscroll-y':     'overscroll-behavior-y',
  'flex':             'flex',
  'flex-dir':         'flex-direction',
  'flex-wrap':        'flex-wrap',
  'flex-grow':        'flex-grow',
  'flex-shrink':      'flex-shrink',
  'flex-base':        'flex-basis',
  'flex-order':       'order',
  'align-x':          'justify-content',
  'align-xi':         'justify-items',
  'align-xs':         'justify-self',
  'align-y':          'align-content',
  'align-yi':         'align-items',
  'align-ys':         'align-self',
  'place':            'place-content',
  'place-i':          'place-items',
  'place-s':          'place-self',
  'grid':             'grid',
  'grid-cols':        'grid-template-columns',
  'grid-rows':        'grid-template-rows',
  'grid-areas':       'grid-template-areas',
  'grid-col':         'grid-column',
  'grid-col-start':   'grid-column-start',
  'grid-col-end':     'grid-column-end',
  'grid-row':         'grid-row',
  'grid-row-start':   'grid-row-start',
  'grid-row-end':     'grid-row-end',
  'grid-area':        'grid-area',
  'grid-col-auto':    'grid-auto-columns',
  'grid-row-auto':    'grid-auto-rows',
  'grid-flow':        'grid-auto-flow',
  'cols':             'columns',
  'cols-n':           'column-count',
  'cols-w':           'column-width',
  'cols-gap':         'column-gap',
  'cols-rule':        'column-rule',
  'cols-rule-color':  'column-rule-color',
  'cols-rule-width':  'column-rule-width',
  'cols-rule-style':  'column-rule-style',
  'cols-fill':        'column-fill',
  'cols-span':        'column-span',
  'text':             'font-size',
  'type-face':        'font-family',
  'type-size':        'font-size',
  'type-weight':      'font-weight',
  'type-style':       'font-style',
  'type-variant':     'font-variant',
  'type-stretch':     'font-stretch',
  'type-kern':        'font-kerning',
  'type-optical':     'font-optical-sizing',
  'type-feature':     'font-feature-settings',
  'type-variation':   'font-variation-settings',
  'type-smooth':      '-webkit-font-smoothing',
  'type-size-adjust': 'font-size-adjust',
  'type-palette':     'font-palette',
  'leading':          'line-height',
  'tracking':         'letter-spacing',
  'word-gap':         'word-spacing',
  'indent':           'text-indent',
  'text-align':       'text-align',
  'text-align-last':  'text-align-last',
  'text-case':        'text-transform',
  'text-decor':       'text-decoration',
  'text-decor-color': 'text-decoration-color',
  'text-decor-line':  'text-decoration-line',
  'text-decor-style': 'text-decoration-style',
  'text-decor-width': 'text-decoration-thickness',
  'text-under-offset':'text-underline-offset',
  'text-under-pos':   'text-underline-position',
  'text-skip-ink':    'text-decoration-skip-ink',
  'text-emphasis':    'text-emphasis',
  'text-emphasis-color':'text-emphasis-color',
  'text-emphasis-pos':'text-emphasis-position',
  'text-emphasis-style':'text-emphasis-style',
  'text-overflow':    'text-overflow',
  'text-valign':      'vertical-align',
  'text-writing':     'writing-mode',
  'text-dir':         'direction',
  'text-orient':      'text-orientation',
  'text-wrap':        'text-wrap',
  'text-render':      'text-rendering',
  'text-spacing':     'text-spacing',
  'text-autospace':   'text-autospace',
  'text-justify':     'text-justify',
  'text-line-break':  'line-break',
  'text-combine':     'text-combine-upright',
  'wrap':             'white-space',
  'move':             'transform',
  'move-x':           'transform',
  'move-y':           'transform',
  'move-z':           'transform',
  'spin':             'transform',
  'spin-x':           'transform',
  'spin-y':           'transform',
  'spin-z':           'transform',
  'scale':            'transform',
  'scale-x':          'transform',
  'scale-y':          'transform',
  'skew':             'transform',
  'skew-x':           'transform',
  'skew-y':           'transform',
  'transform':        'transform',
  'origin':           'transform-origin',
  'depth-view':       'perspective',
  'depth-origin':     'perspective-origin',
  'flip':             'backface-visibility',
  'ease':             'transition',
  'ease-prop':        'transition-property',
  'ease-speed':       'transition-duration',
  'ease-curve':       'transition-timing-function',
  'ease-wait':        'transition-delay',
  'ease-mode':        'transition-behavior',
  'play':             'animation',
  'play-name':        'animation-name',
  'play-speed':       'animation-duration',
  'play-curve':       'animation-timing-function',
  'play-loop':        'animation-iteration-count',
  'play-wait':        'animation-delay',
  'play-state':       'animation-play-state',
  'play-fill':        'animation-fill-mode',
  'play-dir':         'animation-direction',
  'play-timeline':    'animation-timeline',
  'play-range':       'animation-range',
  'play-range-start': 'animation-range-start',
  'play-range-end':   'animation-range-end',
  'play-mix':         'animation-composition',
  'scroll':           'scroll-behavior',
  'scroll-snap':      'scroll-snap-type',
  'snap-align':       'scroll-snap-align',
  'scroll-snap-stop': 'scroll-snap-stop',
  'scroll-pad':       'scroll-padding',
  'scroll-pad-top':   'scroll-padding-top',
  'scroll-pad-right': 'scroll-padding-right',
  'scroll-pad-btm':   'scroll-padding-bottom',
  'scroll-pad-left':  'scroll-padding-left',
  'scroll-mar':       'scroll-margin',
  'scroll-mar-top':   'scroll-margin-top',
  'scroll-mar-right': 'scroll-margin-right',
  'scroll-mar-btm':   'scroll-margin-bottom',
  'scroll-mar-left':  'scroll-margin-left',
  'scroll-timeline':  'scroll-timeline',
  'frame-type':       'container-type',
  'frame-name':       'container-name',
  'frame-size':       'contain-intrinsic-size',
  'frame-size-w':     'contain-intrinsic-width',
  'frame-size-h':     'contain-intrinsic-height',
  'frame-size-x':     'contain-intrinsic-inline-size',
  'frame-size-y':     'contain-intrinsic-block-size',
  'scene-name':       'view-transition-name',
  'scene-class':      'view-transition-class',
  'bar-width':        'scrollbar-width',
  'bar-color':        'scrollbar-color',
  'bar-gutter':       'scrollbar-gutter',
  'path':             'offset-path',
  'path-dist':        'offset-distance',
  'path-spin':        'offset-rotate',
  'path-anchor':      'offset-anchor',
  'path-pos':         'offset-position',
  'shape':            'shape-outside',
  'shape-mar':        'shape-margin',
  'shape-img':        'shape-image-threshold',
  'svg-stroke':       'stroke',
  'svg-stroke-width': 'stroke-width',
  'svg-stroke-fade':  'stroke-opacity',
  'svg-stroke-dash':  'stroke-dasharray',
  'svg-stroke-offset':'stroke-dashoffset',
  'svg-stroke-limit': 'stroke-miterlimit',
  'anchor-name':      'anchor-name',
  'anchor-scope':     'anchor-scope',
  'pos-anchor':       'position-anchor',
  'ruby-align':       'ruby-align',
  'ruby-pos':         'ruby-position',
  'img-render':       'image-rendering',
  'img-orient':       'image-orientation',
  'img-view':         'object-view-box',
  'img-res':          'image-resolution',
  'color-render':     'color-rendering',
  'color-interp':     'color-interpolation',
  'field-size':       'field-sizing',
  'list':             'list-style',
  'list-type':        'list-style-type',
  'list-pos':         'list-style-position',
  'list-img':         'list-style-image',
  'counter-reset':    'counter-reset',
  'counter-inc':      'counter-increment',
  'counter-set':      'counter-set',
  'table':            'table-layout',
  'table-caption':    'caption-side',
  'table-empty':      'empty-cells',
  'content':          'content',
  'will':             'will-change',
  'cursor':           'cursor',
  'cursor-shape':     'caret-shape',
  'events':           'pointer-events',
  'select':           'user-select',
  'touch':            'touch-action',
  'resize':           'resize',
  'overflow-anchor':  'overflow-anchor',
  'overscroll-x':     'overscroll-behavior-x',
  'overscroll-y':     'overscroll-behavior-y',
  'hyphens':          'hyphens',
  'word-break':       'word-break',
  'word-wrap':        'overflow-wrap',
  'unicode-bidi':     'unicode-bidi',
  'orphans':          'orphans',
  'widows':           'widows',
  'quotes':           'quotes',
  'print-color':      'print-color-adjust',
  'forced-color':     'forced-color-adjust',
  'break-before':     'break-before',
  'break-after':      'break-after',
  'break-inside':     'break-inside',
}