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

  // ── TEXT ALIGN ──
  { class: 'text-align:left',      css: 'text-align: left;' },
  { class: 'text-align:center',    css: 'text-align: center;' },
  { class: 'text-align:right',     css: 'text-align: right;' },
  { class: 'text-align:justify',   css: 'text-align: justify;' },
  { class: 'text-align:start',     css: 'text-align: start;' },
  { class: 'text-align:end',       css: 'text-align: end;' },

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

  // ── TEXT DECORATION ──
  { class: 'text-decor:none',      css: 'text-decoration: none;' },
  { class: 'text-decor:under',     css: 'text-decoration: underline;' },
  { class: 'text-decor:over',      css: 'text-decoration: overline;' },
  { class: 'text-decor:strike',    css: 'text-decoration: line-through;' },

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

  // ── VERTICAL ALIGN ──
  { class: 'text-valign:top',      css: 'vertical-align: top;' },
  { class: 'text-valign:middle',   css: 'vertical-align: middle;' },
  { class: 'text-valign:bottom',   css: 'vertical-align: bottom;' },
  { class: 'text-valign:baseline', css: 'vertical-align: baseline;' },

  // ── STROKE STYLE ──
  { class: 'stroke-style:solid',   css: 'border-style: solid;' },
  { class: 'stroke-style:dashed',  css: 'border-style: dashed;' },
  { class: 'stroke-style:dotted',  css: 'border-style: dotted;' },
  { class: 'stroke-style:double',  css: 'border-style: double;' },
  { class: 'stroke-style:none',    css: 'border-style: none;' },

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
  { class: 'transform-style:flat',     css: 'transform-style: flat;' },
  { class: 'transform-style:3d',      css: 'transform-style: preserve-3d;' },
  { class: 'flip:visible',            css: 'backface-visibility: visible;' },
  { class: 'flip:hidden',             css: 'backface-visibility: hidden;' },

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
  { class: 'stroke-collapse:yes',  css: 'border-collapse: collapse;' },
  { class: 'stroke-collapse:no',   css: 'border-collapse: separate;' },

  // ── WRITING MODE ──
  { class: 'text-writing:h',       css: 'writing-mode: horizontal-tb;' },
  { class: 'text-writing:v-right', css: 'writing-mode: vertical-rl;' },
  { class: 'text-writing:v-left',  css: 'writing-mode: vertical-lr;' },

  // ── DIRECTION ──
  { class: 'text-dir:ltr',         css: 'direction: ltr;' },
  { class: 'text-dir:rtl',         css: 'direction: rtl;' },

  // ── APPEARANCE ──
  { class: 'canvas-appear:none',   css: 'appearance: none;' },
  { class: 'canvas-appear:auto',   css: 'appearance: auto;' },

  // ── CONTENT VISIBILITY ──
  { class: 'canvas-render:auto',   css: 'content-visibility: auto;' },
  { class: 'canvas-render:hidden', css: 'content-visibility: hidden;' },
  { class: 'canvas-render:visible',css: 'content-visibility: visible;' },

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

  // ── FIELD SIZE ──
  { class: 'field-size:fixed',     css: 'field-sizing: fixed;' },
  { class: 'field-size:content',   css: 'field-sizing: content;' },

  // ── IMG RENDER ──
  { class: 'img-render:auto',      css: 'image-rendering: auto;' },
  { class: 'img-render:crisp',     css: 'image-rendering: crisp-edges;' },
  { class: 'img-render:pixel',     css: 'image-rendering: pixelated;' },
  { class: 'img-render:smooth',    css: 'image-rendering: smooth;' },

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

  // ── UNICODE ──
  { class: 'unicode-bidi:normal',  css: 'unicode-bidi: normal;' },
  { class: 'unicode-bidi:embed',   css: 'unicode-bidi: embed;' },
  { class: 'unicode-bidi:isolate', css: 'unicode-bidi: isolate;' },
  { class: 'unicode-bidi:override',css: 'unicode-bidi: bidi-override;' },

  // ── SVG STROKE CAP ──
  { class: 'svg-stroke-cap:butt',  css: 'stroke-linecap: butt;' },
  { class: 'svg-stroke-cap:round', css: 'stroke-linecap: round;' },
  { class: 'svg-stroke-cap:square',css: 'stroke-linecap: square;' },

  // ── SVG STROKE JOIN ──
  { class: 'svg-stroke-join:miter',css: 'stroke-linejoin: miter;' },
  { class: 'svg-stroke-join:round',css: 'stroke-linejoin: round;' },
  { class: 'svg-stroke-join:bevel',css: 'stroke-linejoin: bevel;' },

  // ── PRINT ──
  { class: 'print-color:exact',    css: 'print-color-adjust: exact;' },
  { class: 'print-color:economy',  css: 'print-color-adjust: economy;' },
  { class: 'forced-color:none',    css: 'forced-color-adjust: none;' },
  { class: 'forced-color:auto',    css: 'forced-color-adjust: auto;' },

  // ── BREAK ──
  { class: 'break-before:auto',    css: 'break-before: auto;' },
  { class: 'break-before:page',    css: 'break-before: page;' },
  { class: 'break-before:avoid',   css: 'break-before: avoid;' },
  { class: 'break-after:auto',     css: 'break-after: auto;' },
  { class: 'break-after:page',     css: 'break-after: page;' },
  { class: 'break-after:avoid',    css: 'break-after: avoid;' },
  { class: 'break-inside:auto',    css: 'break-inside: auto;' },
  { class: 'break-inside:avoid',   css: 'break-inside: avoid;' },

  // ── SHAPE ──
  { class: 'shape:circle',         css: 'shape-outside: circle();' },
  { class: 'shape:ellipse',        css: 'shape-outside: ellipse();' },
  { class: 'shape:none',           css: 'shape-outside: none;' },

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
  { class: 'ease:default',         css: 'transition: all 0.3s ease;' },
]

// Fast lookup map
const STATIC_MAP = Object.fromEntries(
  STATIC_UTILITIES.map(u => [u.class, u.css])
)

// ============================================================
// TOKEN-BASED CLASS RESOLVER
// Handles: capability:token pairs from your token config
// All 481 Mizumi vocabulary properties
// ============================================================
export function resolveClass(className, tokens = {}) {

  // ── INK (color) ──
  const ink = className.match(/^ink:(.+)$/)
  if (ink) return `color: var(--color-${ink[1]});`

  const inkCaret = className.match(/^ink-caret:(.+)$/)
  if (inkCaret) return `caret-color: var(--color-${inkCaret[1]});`

  const inkAccent = className.match(/^ink-accent:(.+)$/)
  if (inkAccent) return `accent-color: var(--color-${inkAccent[1]});`

  const inkFill = className.match(/^ink-fill:(.+)$/)
  if (inkFill) return `fill: var(--color-${inkFill[1]});`

  // ── PAINT (background) ──
  const paint = className.match(/^paint:(.+)$/)
  if (paint) return `background-color: var(--color-${paint[1]});`

  const paintImg = className.match(/^paint-img:(.+)$/)
  if (paintImg) return `background-image: var(--${paintImg[1]});`

  const paintSize = className.match(/^paint-size:(.+)$/)
  if (paintSize) return `background-size: ${paintSize[1]};`

  const paintPos = className.match(/^paint-pos:(.+)$/)
  if (paintPos) return `background-position: ${paintPos[1]};`

  const paintBlend = className.match(/^paint-blend:(.+)$/)
  if (paintBlend) return `background-blend-mode: ${paintBlend[1]};`

  const paintOrigin = className.match(/^paint-origin:(.+)$/)
  if (paintOrigin) return `background-origin: ${paintOrigin[1]};`

  // ── CANVAS (sizing) ──
  const canvasW = className.match(/^canvas-w:(.+)$/)
  if (canvasW) return `width: ${resolveValue(canvasW[1], 'spacing')};`

  const canvasH = className.match(/^canvas-h:(.+)$/)
  if (canvasH) return `height: ${resolveValue(canvasH[1], 'spacing')};`

  const canvasWMin = className.match(/^canvas-w-min:(.+)$/)
  if (canvasWMin) return `min-width: ${resolveValue(canvasWMin[1], 'spacing')};`

  const canvasHMin = className.match(/^canvas-h-min:(.+)$/)
  if (canvasHMin) return `min-height: ${resolveValue(canvasHMin[1], 'spacing')};`

  const canvasWMax = className.match(/^canvas-w-max:(.+)$/)
  if (canvasWMax) return `max-width: ${resolveValue(canvasWMax[1], 'spacing')};`

  const canvasHMax = className.match(/^canvas-h-max:(.+)$/)
  if (canvasHMax) return `max-height: ${resolveValue(canvasHMax[1], 'spacing')};`

  const canvasRatio = className.match(/^canvas-ratio:(.+)$/)
  if (canvasRatio) return `aspect-ratio: ${canvasRatio[1].replace(/_/g, ' ')};`

  const canvasFitPos = className.match(/^canvas-fit-pos:(.+)$/)
  if (canvasFitPos) return `object-position: ${canvasFitPos[1]};`

  const canvasFade = className.match(/^canvas-fade:(.+)$/)
  if (canvasFade) return `opacity: ${canvasFade[1]};`

  // ── PAD (padding) ──
  const padX = className.match(/^pad-x:(.+)$/)
  if (padX) return `padding-left: var(--spacing-${padX[1]}); padding-right: var(--spacing-${padX[1]});`

  const padY = className.match(/^pad-y:(.+)$/)
  if (padY) return `padding-top: var(--spacing-${padY[1]}); padding-bottom: var(--spacing-${padY[1]});`

  const padTop = className.match(/^pad-top:(.+)$/)
  if (padTop) return `padding-top: var(--spacing-${padTop[1]});`

  const padRight = className.match(/^pad-right:(.+)$/)
  if (padRight) return `padding-right: var(--spacing-${padRight[1]});`

  const padBtm = className.match(/^pad-btm:(.+)$/)
  if (padBtm) return `padding-bottom: var(--spacing-${padBtm[1]});`

  const padLeft = className.match(/^pad-left:(.+)$/)
  if (padLeft) return `padding-left: var(--spacing-${padLeft[1]});`

  const pad = className.match(/^pad:(.+)$/)
  if (pad) return `padding: var(--spacing-${pad[1]});`

  // ── MAR (margin) ──
  const marX = className.match(/^mar-x:(.+)$/)
  if (marX) return `margin-left: var(--spacing-${marX[1]}); margin-right: var(--spacing-${marX[1]});`

  const marY = className.match(/^mar-y:(.+)$/)
  if (marY) return `margin-top: var(--spacing-${marY[1]}); margin-bottom: var(--spacing-${marY[1]});`

  const marTop = className.match(/^mar-top:(.+)$/)
  if (marTop) return `margin-top: var(--spacing-${marTop[1]});`

  const marRight = className.match(/^mar-right:(.+)$/)
  if (marRight) return `margin-right: var(--spacing-${marRight[1]});`

  const marBtm = className.match(/^mar-btm:(.+)$/)
  if (marBtm) return `margin-bottom: var(--spacing-${marBtm[1]});`

  const marLeft = className.match(/^mar-left:(.+)$/)
  if (marLeft) return `margin-left: var(--spacing-${marLeft[1]});`

  const mar = className.match(/^mar:(.+)$/)
  if (mar) return `margin: var(--spacing-${mar[1]});`

  // ── GAP ──
  const gapX = className.match(/^gap-x:(.+)$/)
  if (gapX) return `column-gap: var(--spacing-${gapX[1]});`

  const gapY = className.match(/^gap-y:(.+)$/)
  if (gapY) return `row-gap: var(--spacing-${gapY[1]});`

  const gap = className.match(/^gap:(.+)$/)
  if (gap) return `gap: var(--spacing-${gap[1]});`

  // ── STROKE (border) ──
  const strokeColor = className.match(/^stroke-color:(.+)$/)
  if (strokeColor) return `border-color: var(--color-${strokeColor[1]});`

  const strokeWidth = className.match(/^stroke-width:(.+)$/)
  if (strokeWidth) return `border-width: var(--stroke-${strokeWidth[1]}, ${strokeWidth[1]});`

  const strokeTopColor = className.match(/^stroke-top-color:(.+)$/)
  if (strokeTopColor) return `border-top-color: var(--color-${strokeTopColor[1]});`

  const strokeBtmColor = className.match(/^stroke-btm-color:(.+)$/)
  if (strokeBtmColor) return `border-bottom-color: var(--color-${strokeBtmColor[1]});`

  const strokeLeftColor = className.match(/^stroke-left-color:(.+)$/)
  if (strokeLeftColor) return `border-left-color: var(--color-${strokeLeftColor[1]});`

  const strokeRightColor = className.match(/^stroke-right-color:(.+)$/)
  if (strokeRightColor) return `border-right-color: var(--color-${strokeRightColor[1]});`

  const strokeGap = className.match(/^stroke-gap:(.+)$/)
  if (strokeGap) return `border-spacing: var(--spacing-${strokeGap[1]});`

  // ── CURVE (border-radius) ──
  const curveTl = className.match(/^curve-tl:(.+)$/)
  if (curveTl) return `border-top-left-radius: var(--radius-${curveTl[1]});`

  const curveTr = className.match(/^curve-tr:(.+)$/)
  if (curveTr) return `border-top-right-radius: var(--radius-${curveTr[1]});`

  const curveBl = className.match(/^curve-bl:(.+)$/)
  if (curveBl) return `border-bottom-left-radius: var(--radius-${curveBl[1]});`

  const curveBr = className.match(/^curve-br:(.+)$/)
  if (curveBr) return `border-bottom-right-radius: var(--radius-${curveBr[1]});`

  const curveStart = className.match(/^curve-start:(.+)$/)
  if (curveStart) return `border-start-start-radius: var(--radius-${curveStart[1]});`

  const curveEnd = className.match(/^curve-end:(.+)$/)
  if (curveEnd) return `border-end-end-radius: var(--radius-${curveEnd[1]});`

  const curve = className.match(/^curve:(.+)$/)
  if (curve) return `border-radius: var(--radius-${curve[1]});`

  // ── RING (outline) ──
  const ringColor = className.match(/^ring-color:(.+)$/)
  if (ringColor) return `outline-color: var(--color-${ringColor[1]});`

  const ringWidth = className.match(/^ring-width:(.+)$/)
  if (ringWidth) return `outline-width: ${ringWidth[1]};`

  const ringOffset = className.match(/^ring-offset:(.+)$/)
  if (ringOffset) return `outline-offset: ${ringOffset[1]};`

  const ring = className.match(/^ring:(.+)$/)
  if (ring) return `outline: var(--stroke-${ring[1]}, ${ring[1]}) solid var(--color-primary);`

  // ── CAST (shadows) ──
  const castText = className.match(/^cast-text:(.+)$/)
  if (castText) return `text-shadow: var(--shadow-${castText[1]});`

  const castInner = className.match(/^cast-inner:(.+)$/)
  if (castInner) return `box-shadow: inset var(--shadow-${castInner[1]});`

  const cast = className.match(/^cast:(.+)$/)
  if (cast) return `box-shadow: var(--shadow-${cast[1]});`

  // ── GLOW (filter) ──
  const glowBlur = className.match(/^glow-blur:(.+)$/)
  if (glowBlur) return `filter: blur(${glowBlur[1]});`

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

  const glowSat = className.match(/^glow-sat:(.+)$/)
  if (glowSat) return `filter: saturate(${glowSat[1]});`

  const glowDrop = className.match(/^cast-drop:(.+)$/)
  if (glowDrop) return `filter: drop-shadow(var(--shadow-${glowDrop[1]}));`

  // ── GLASS (backdrop-filter) ──
  const glassBlur = className.match(/^glass-blur:(.+)$/)
  if (glassBlur) return `backdrop-filter: blur(${glassBlur[1]});`

  const glassBright = className.match(/^glass-bright:(.+)$/)
  if (glassBright) return `backdrop-filter: brightness(${glassBright[1]});`

  const glassSat = className.match(/^glass-sat:(.+)$/)
  if (glassSat) return `backdrop-filter: saturate(${glassSat[1]});`

  const glass = className.match(/^glass:(.+)$/)
  if (glass) return `backdrop-filter: blur(${glass[1]});`

  // ── CLIP ──
  const clip = className.match(/^clip:(.+)$/)
  if (clip) return `clip-path: ${clip[1]};`

  const clipMar = className.match(/^clip-mar:(.+)$/)
  if (clipMar) return `overflow-clip-margin: ${clipMar[1]};`

  // ── POSITION VALUES ──
  const posTop = className.match(/^pos-top:(.+)$/)
  if (posTop) return `top: var(--spacing-${posTop[1]}, ${posTop[1]});`

  const posRight = className.match(/^pos-right:(.+)$/)
  if (posRight) return `right: var(--spacing-${posRight[1]}, ${posRight[1]});`

  const posBtm = className.match(/^pos-btm:(.+)$/)
  if (posBtm) return `bottom: var(--spacing-${posBtm[1]}, ${posBtm[1]});`

  const posLeft = className.match(/^pos-left:(.+)$/)
  if (posLeft) return `left: var(--spacing-${posLeft[1]}, ${posLeft[1]});`

  const posInset = className.match(/^pos-inset:(.+)$/)
  if (posInset) return `inset: var(--spacing-${posInset[1]}, ${posInset[1]});`

  // ── LAYER (z-index) ──
  const layer = className.match(/^layer:(.+)$/)
  if (layer) return `z-index: ${layer[1]};`

  // ── FLEX ──
  const flexGrow = className.match(/^flex-grow:(.+)$/)
  if (flexGrow) return `flex-grow: ${flexGrow[1]};`

  const flexShrink = className.match(/^flex-shrink:(.+)$/)
  if (flexShrink) return `flex-shrink: ${flexShrink[1]};`

  const flexBase = className.match(/^flex-base:(.+)$/)
  if (flexBase) return `flex-basis: var(--spacing-${flexBase[1]}, ${flexBase[1]});`

  const flexOrder = className.match(/^flex-order:(.+)$/)
  if (flexOrder) return `order: ${flexOrder[1]};`

  const flex = className.match(/^flex:(.+)$/)
  if (flex) return `flex: ${flex[1]};`

  // ── GRID ──
  const gridCols = className.match(/^grid-cols:(.+)$/)
  if (gridCols) return `grid-template-columns: ${gridCols[1].replace(/_/g, ' ')};`

  const gridRows = className.match(/^grid-rows:(.+)$/)
  if (gridRows) return `grid-template-rows: ${gridRows[1].replace(/_/g, ' ')};`

  const gridArea = className.match(/^grid-area:(.+)$/)
  if (gridArea) return `grid-area: ${gridArea[1]};`

  const gridCol = className.match(/^grid-col:(.+)$/)
  if (gridCol) return `grid-column: ${gridCol[1].replace(/_/g, ' ')};`

  const gridRow = className.match(/^grid-row:(.+)$/)
  if (gridRow) return `grid-row: ${gridRow[1].replace(/_/g, ' ')};`

  const gridColAuto = className.match(/^grid-col-auto:(.+)$/)
  if (gridColAuto) return `grid-auto-columns: ${gridColAuto[1].replace(/_/g, ' ')};`

  const gridRowAuto = className.match(/^grid-row-auto:(.+)$/)
  if (gridRowAuto) return `grid-auto-rows: ${gridRowAuto[1].replace(/_/g, ' ')};`

  // ── TYPE (typography) ──
  const typeFace = className.match(/^type-face:(.+)$/)
  if (typeFace) return `font-family: var(--font-${typeFace[1]}, ${typeFace[1]});`

  const typeSize = className.match(/^type-size:(.+)$/)
  if (typeSize) return `font-size: var(--text-${typeSize[1]}-size, ${typeSize[1]});`

  const typeWeight = className.match(/^type-weight:(\d+)$/)
  if (typeWeight) return `font-weight: ${typeWeight[1]};`

  const typeStretch = className.match(/^type-stretch:(.+)$/)
  if (typeStretch) return `font-stretch: ${typeStretch[1]};`

  const typeKern = className.match(/^type-kern:(.+)$/)
  if (typeKern) return `font-kerning: ${typeKern[1]};`

  const typeFeature = className.match(/^type-feature:(.+)$/)
  if (typeFeature) return `font-feature-settings: "${typeFeature[1].replace(/_/g, ' ')}";`

  const typeVariation = className.match(/^type-variation:(.+)$/)
  if (typeVariation) return `font-variation-settings: "${typeVariation[1]}";`

  const typeSizeAdjust = className.match(/^type-size-adjust:(.+)$/)
  if (typeSizeAdjust) return `font-size-adjust: ${typeSizeAdjust[1]};`

  const typeLang = className.match(/^type-lang:(.+)$/)
  if (typeLang) return `font-language-override: "${typeLang[1]}";`

  // ── LEADING / TRACKING ──
  const leading = className.match(/^leading:(.+)$/)
  if (leading) return `line-height: var(--leading-${leading[1]}, ${leading[1]});`

  const tracking = className.match(/^tracking:(.+)$/)
  if (tracking) return `letter-spacing: var(--tracking-${tracking[1]}, ${tracking[1]});`

  const wordGap = className.match(/^word-gap:(.+)$/)
  if (wordGap) return `word-spacing: ${wordGap[1]};`

  const indent = className.match(/^indent:(.+)$/)
  if (indent) return `text-indent: var(--spacing-${indent[1]}, ${indent[1]});`

  const tab = className.match(/^tab:(.+)$/)
  if (tab) return `tab-size: ${tab[1]};`

  // ── TEXT (typography token) ──
  const text = className.match(/^text:(.+)$/)
  if (text) return `font-size: var(--text-${text[1]}-size); font-weight: var(--text-${text[1]}-weight); line-height: var(--text-${text[1]}-line);`

  // ── TEXT DECORATION ──
  const textDecorColor = className.match(/^text-decor-color:(.+)$/)
  if (textDecorColor) return `text-decoration-color: var(--color-${textDecorColor[1]});`

  const textDecorWidth = className.match(/^text-decor-width:(.+)$/)
  if (textDecorWidth) return `text-decoration-thickness: ${textDecorWidth[1]};`

  const textUnderOffset = className.match(/^text-under-offset:(.+)$/)
  if (textUnderOffset) return `text-underline-offset: ${textUnderOffset[1]};`

  const textEmphasisColor = className.match(/^text-emphasis-color:(.+)$/)
  if (textEmphasisColor) return `text-emphasis-color: var(--color-${textEmphasisColor[1]});`

  const textShadow = className.match(/^cast-text:(.+)$/)
  if (textShadow) return `text-shadow: var(--shadow-${textShadow[1]});`

  // ── MOVE (transforms) ──
  const moveX = className.match(/^move-x:(.+)$/)
  if (moveX) return `transform: translateX(${moveX[1]});`

  const moveY = className.match(/^move-y:(.+)$/)
  if (moveY) return `transform: translateY(${moveY[1]});`

  const moveZ = className.match(/^move-z:(.+)$/)
  if (moveZ) return `transform: translateZ(${moveZ[1]});`

  const move = className.match(/^move:(.+)$/)
  if (move) return `transform: translate(${move[1].replace(/_/g, ', ')});`

  const spinX = className.match(/^spin-x:(.+)$/)
  if (spinX) return `transform: rotateX(${spinX[1]});`

  const spinY = className.match(/^spin-y:(.+)$/)
  if (spinY) return `transform: rotateY(${spinY[1]});`

  const spin = className.match(/^spin:(.+)$/)
  if (spin) return `transform: rotate(${spin[1]});`

  const scaleX = className.match(/^scale-x:(.+)$/)
  if (scaleX) return `transform: scaleX(${scaleX[1]});`

  const scaleY = className.match(/^scale-y:(.+)$/)
  if (scaleY) return `transform: scaleY(${scaleY[1]});`

  const scale = className.match(/^scale:(.+)$/)
  if (scale) return `transform: scale(${scale[1]});`

  const skewX = className.match(/^skew-x:(.+)$/)
  if (skewX) return `transform: skewX(${skewX[1]});`

  const skewY = className.match(/^skew-y:(.+)$/)
  if (skewY) return `transform: skewY(${skewY[1]});`

  const origin = className.match(/^origin:(.+)$/)
  if (origin) return `transform-origin: ${origin[1].replace(/_/g, ' ')};`

  const depthView = className.match(/^depth-view:(.+)$/)
  if (depthView) return `perspective: ${depthView[1]};`

  // ── EASE (transition) ──
  const easeProp = className.match(/^ease-prop:(.+)$/)
  if (easeProp) return `transition-property: ${easeProp[1]};`

  const easeSpeed = className.match(/^ease-speed:(.+)$/)
  if (easeSpeed) return `transition-duration: var(--duration-${easeSpeed[1]}, ${easeSpeed[1]});`

  const easeCurve = className.match(/^ease-curve:(.+)$/)
  if (easeCurve) return `transition-timing-function: var(--ease-${easeCurve[1]}, ${easeCurve[1]});`

  const easeWait = className.match(/^ease-wait:(.+)$/)
  if (easeWait) return `transition-delay: var(--duration-${easeWait[1]}, ${easeWait[1]});`

  const ease = className.match(/^ease:(.+)$/)
  if (ease) return `transition: all var(--duration-${ease[1]}, 0.3s) ease;`

  // ── PLAY (CSS animation) ──
  const playName = className.match(/^play-name:(.+)$/)
  if (playName) return `animation-name: ${playName[1]};`

  const playSpeed = className.match(/^play-speed:(.+)$/)
  if (playSpeed) return `animation-duration: var(--duration-${playSpeed[1]}, ${playSpeed[1]});`

  const playLoop = className.match(/^play-loop:(.+)$/)
  if (playLoop) return `animation-iteration-count: ${playLoop[1]};`

  const playWait = className.match(/^play-wait:(.+)$/)
  if (playWait) return `animation-delay: var(--duration-${playWait[1]}, ${playWait[1]});`

  const playState = className.match(/^play-state:(.+)$/)
  if (playState) return `animation-play-state: ${playState[1]};`

  // ── SCROLL ──
  const scrollPad = className.match(/^scroll-pad:(.+)$/)
  if (scrollPad) return `scroll-padding: var(--spacing-${scrollPad[1]});`

  const scrollMar = className.match(/^scroll-mar:(.+)$/)
  if (scrollMar) return `scroll-margin: var(--spacing-${scrollMar[1]});`

  const scrollTimeline = className.match(/^scroll-timeline:(.+)$/)
  if (scrollTimeline) return `scroll-timeline-name: --${scrollTimeline[1]};`

  // ── FRAME (container) ──
  const frameName = className.match(/^frame-name:(.+)$/)
  if (frameName) return `container-name: ${frameName[1]};`

  const frameSize = className.match(/^frame-size:(.+)$/)
  if (frameSize) return `contain-intrinsic-size: ${frameSize[1].replace(/_/g, ' ')};`

  const frameSizeW = className.match(/^frame-size-w:(.+)$/)
  if (frameSizeW) return `contain-intrinsic-width: ${frameSizeW[1]};`

  const frameSizeH = className.match(/^frame-size-h:(.+)$/)
  if (frameSizeH) return `contain-intrinsic-height: ${frameSizeH[1]};`

  // ── SCENE (view transitions) ──
  const sceneName = className.match(/^scene-name:(.+)$/)
  if (sceneName) return `view-transition-name: ${sceneName[1]};`

  // ── BAR (scrollbar) ──
  const barColor = className.match(/^bar-color:(.+)$/)
  if (barColor) {
    const parts = barColor[1].split('_')
    const track = parts[0]
    const thumb = parts[1] || parts[0]
    return `scrollbar-color: var(--color-${thumb}) var(--color-${track});`
  }

  // ── PATH (motion path) ──
  const pathProp = className.match(/^path:(.+)$/)
  if (pathProp) return `offset-path: ${pathProp[1].replace(/_/g, ' ')};`

  const pathDist = className.match(/^path-dist:(.+)$/)
  if (pathDist) return `offset-distance: ${pathDist[1]};`

  const pathSpin = className.match(/^path-spin:(.+)$/)
  if (pathSpin) return `offset-rotate: ${pathSpin[1]};`

  const pathAnchor = className.match(/^path-anchor:(.+)$/)
  if (pathAnchor) return `offset-anchor: ${pathAnchor[1].replace(/_/g, ' ')};`

  // ── SHAPE ──
  const shapeMar = className.match(/^shape-mar:(.+)$/)
  if (shapeMar) return `shape-margin: var(--spacing-${shapeMar[1]}, ${shapeMar[1]});`

  const shapeImg = className.match(/^shape-img:(.+)$/)
  if (shapeImg) return `shape-image-threshold: ${shapeImg[1]};`

  // ── SVG ──
  const svgStroke = className.match(/^svg-stroke:(.+)$/)
  if (svgStroke) return `stroke: var(--color-${svgStroke[1]});`

  const svgStrokeWidth = className.match(/^svg-stroke-width:(.+)$/)
  if (svgStrokeWidth) return `stroke-width: ${svgStrokeWidth[1]};`

  const svgStrokeDash = className.match(/^svg-stroke-dash:(.+)$/)
  if (svgStrokeDash) return `stroke-dasharray: ${svgStrokeDash[1].replace(/_/g, ' ')};`

  const svgStrokeOffset = className.match(/^svg-stroke-offset:(.+)$/)
  if (svgStrokeOffset) return `stroke-dashoffset: ${svgStrokeOffset[1]};`

  const svgFillFade = className.match(/^ink-fill-fade:(.+)$/)
  if (svgFillFade) return `fill-opacity: ${svgFillFade[1]};`

  const svgStrokeFade = className.match(/^svg-stroke-fade:(.+)$/)
  if (svgStrokeFade) return `stroke-opacity: ${svgStrokeFade[1]};`

  // ── ANCHOR POSITIONING ──
  const anchorName = className.match(/^anchor-name:(.+)$/)
  if (anchorName) return `anchor-name: --${anchorName[1]};`

  const anchorScope = className.match(/^anchor-scope:(.+)$/)
  if (anchorScope) return `anchor-scope: --${anchorScope[1]};`

  // ── WILL CHANGE ──
  const will = className.match(/^will:(.+)$/)
  if (will) return `will-change: ${will[1]};`

  // ── CONTENT ──
  const content = className.match(/^content:(.+)$/)
  if (content) return `content: "${content[1]}";`

  // ── STATIC MAP fallback ──
  return STATIC_MAP[className] || null
}

// Helper: resolve a value as a token or pass through as raw
function resolveValue(val, tokenGroup) {
  // If it looks like a token name (no units, no spaces)
  if (/^[a-zA-Z0-9-]+$/.test(val) && !val.includes('px') && !val.includes('%')) {
    return `var(--${tokenGroup}-${val}, ${val})`
  }
  return val
}

// ============================================================
// TOKEN UTILITY GENERATOR
// Generates utility classes from user's token config
// ============================================================
export function generateTokenUtilities(tokens = {}) {
  const utilities = []

  // ── Colors → ink, paint, stroke-color, ring-color ──
  if (tokens.colors) {
    for (const [key, value] of Object.entries(tokens.colors)) {
      if (typeof value === 'object' && value !== null) {
        for (const [shade] of Object.entries(value)) {
          const s = shade === 'DEFAULT' ? '' : `-${shade}`
          const name = `${key}${s}`
          utilities.push({ class: `ink:${name}`,          css: `color: var(--color-${name});` })
          utilities.push({ class: `paint:${name}`,        css: `background-color: var(--color-${name});` })
          utilities.push({ class: `stroke-color:${name}`, css: `border-color: var(--color-${name});` })
          utilities.push({ class: `ring-color:${name}`,   css: `outline-color: var(--color-${name});` })
          utilities.push({ class: `cast-drop:${name}`,    css: `filter: drop-shadow(var(--shadow-${name}));` })
          utilities.push({ class: `ink-fill:${name}`,     css: `fill: var(--color-${name});` })
          utilities.push({ class: `svg-stroke:${name}`,   css: `stroke: var(--color-${name});` })
          utilities.push({ class: `ink-caret:${name}`,    css: `caret-color: var(--color-${name});` })
          utilities.push({ class: `ink-accent:${name}`,   css: `accent-color: var(--color-${name});` })
        }
      } else {
        utilities.push({ class: `ink:${key}`,          css: `color: var(--color-${key});` })
        utilities.push({ class: `paint:${key}`,        css: `background-color: var(--color-${key});` })
        utilities.push({ class: `stroke-color:${key}`, css: `border-color: var(--color-${key});` })
        utilities.push({ class: `ring-color:${key}`,   css: `outline-color: var(--color-${key});` })
        utilities.push({ class: `ink-fill:${key}`,     css: `fill: var(--color-${key});` })
        utilities.push({ class: `svg-stroke:${key}`,   css: `stroke: var(--color-${key});` })
        utilities.push({ class: `ink-caret:${key}`,    css: `caret-color: var(--color-${key});` })
        utilities.push({ class: `ink-accent:${key}`,   css: `accent-color: var(--color-${key});` })
      }
    }
  }

  // ── Spacing → pad, mar, gap, pos, canvas-w/h ──
  if (tokens.spacing) {
    for (const [key] of Object.entries(tokens.spacing)) {
      utilities.push({ class: `pad:${key}`,       css: `padding: var(--spacing-${key});` })
      utilities.push({ class: `pad-x:${key}`,     css: `padding-left: var(--spacing-${key}); padding-right: var(--spacing-${key});` })
      utilities.push({ class: `pad-y:${key}`,     css: `padding-top: var(--spacing-${key}); padding-bottom: var(--spacing-${key});` })
      utilities.push({ class: `pad-top:${key}`,   css: `padding-top: var(--spacing-${key});` })
      utilities.push({ class: `pad-right:${key}`, css: `padding-right: var(--spacing-${key});` })
      utilities.push({ class: `pad-btm:${key}`,   css: `padding-bottom: var(--spacing-${key});` })
      utilities.push({ class: `pad-left:${key}`,  css: `padding-left: var(--spacing-${key});` })
      utilities.push({ class: `mar:${key}`,       css: `margin: var(--spacing-${key});` })
      utilities.push({ class: `mar-x:${key}`,     css: `margin-left: var(--spacing-${key}); margin-right: var(--spacing-${key});` })
      utilities.push({ class: `mar-y:${key}`,     css: `margin-top: var(--spacing-${key}); margin-bottom: var(--spacing-${key});` })
      utilities.push({ class: `mar-top:${key}`,   css: `margin-top: var(--spacing-${key});` })
      utilities.push({ class: `mar-right:${key}`, css: `margin-right: var(--spacing-${key});` })
      utilities.push({ class: `mar-btm:${key}`,   css: `margin-bottom: var(--spacing-${key});` })
      utilities.push({ class: `mar-left:${key}`,  css: `margin-left: var(--spacing-${key});` })
      utilities.push({ class: `gap:${key}`,       css: `gap: var(--spacing-${key});` })
      utilities.push({ class: `gap-x:${key}`,     css: `column-gap: var(--spacing-${key});` })
      utilities.push({ class: `gap-y:${key}`,     css: `row-gap: var(--spacing-${key});` })
      utilities.push({ class: `canvas-w:${key}`,  css: `width: var(--spacing-${key});` })
      utilities.push({ class: `canvas-h:${key}`,  css: `height: var(--spacing-${key});` })
      utilities.push({ class: `pos-top:${key}`,   css: `top: var(--spacing-${key});` })
      utilities.push({ class: `pos-right:${key}`, css: `right: var(--spacing-${key});` })
      utilities.push({ class: `pos-btm:${key}`,   css: `bottom: var(--spacing-${key});` })
      utilities.push({ class: `pos-left:${key}`,  css: `left: var(--spacing-${key});` })
      utilities.push({ class: `pos-inset:${key}`, css: `inset: var(--spacing-${key});` })
      utilities.push({ class: `scroll-pad:${key}`,css: `scroll-padding: var(--spacing-${key});` })
      utilities.push({ class: `scroll-mar:${key}`,css: `scroll-margin: var(--spacing-${key});` })
      utilities.push({ class: `indent:${key}`,    css: `text-indent: var(--spacing-${key});` })
      utilities.push({ class: `stroke-gap:${key}`,css: `border-spacing: var(--spacing-${key});` })
      utilities.push({ class: `shape-mar:${key}`, css: `shape-margin: var(--spacing-${key});` })
    }
  }

  // ── Radius → curve ──
  if (tokens.radius) {
    for (const [key] of Object.entries(tokens.radius)) {
      utilities.push({ class: `curve:${key}`,    css: `border-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-tl:${key}`, css: `border-top-left-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-tr:${key}`, css: `border-top-right-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-bl:${key}`, css: `border-bottom-left-radius: var(--radius-${key});` })
      utilities.push({ class: `curve-br:${key}`, css: `border-bottom-right-radius: var(--radius-${key});` })
    }
  }

  // ── Shadows → cast, cast-text, cast-inner ──
  if (tokens.shadows) {
    for (const [key] of Object.entries(tokens.shadows)) {
      utilities.push({ class: `cast:${key}`,       css: `box-shadow: var(--shadow-${key});` })
      utilities.push({ class: `cast-text:${key}`,  css: `text-shadow: var(--shadow-${key});` })
      utilities.push({ class: `cast-inner:${key}`, css: `box-shadow: inset var(--shadow-${key});` })
      utilities.push({ class: `cast-drop:${key}`,  css: `filter: drop-shadow(var(--shadow-${key}));` })
    }
  }

  // ── Typography → text ──
  if (tokens.typography) {
    for (const [key, value] of Object.entries(tokens.typography)) {
      if (typeof value === 'object' && value !== null) {
        utilities.push({
          class: `text:${key}`,
          css: `font-size: var(--text-${key}-size); font-weight: var(--text-${key}-weight); line-height: var(--text-${key}-line);`
        })
        utilities.push({ class: `type-size:${key}`,   css: `font-size: var(--text-${key}-size);` })
        utilities.push({ class: `type-weight:${key}`, css: `font-weight: var(--text-${key}-weight);` })
        utilities.push({ class: `leading:${key}`,     css: `line-height: var(--text-${key}-line);` })
      }
    }
  }

  // ── Fonts → type-face ──
  if (tokens.fonts) {
    for (const [key] of Object.entries(tokens.fonts)) {
      utilities.push({ class: `type-face:${key}`, css: `font-family: var(--font-${key});` })
    }
  }

  // ── Easing → ease-curve ──
  if (tokens.easing) {
    for (const [key] of Object.entries(tokens.easing)) {
      utilities.push({ class: `ease-curve:${key}`, css: `transition-timing-function: var(--ease-${key});` })
      utilities.push({ class: `play-curve:${key}`, css: `animation-timing-function: var(--ease-${key});` })
    }
  }

  // ── Duration → ease-speed ──
  if (tokens.duration) {
    for (const [key] of Object.entries(tokens.duration)) {
      utilities.push({ class: `ease-speed:${key}`, css: `transition-duration: var(--duration-${key});` })
      utilities.push({ class: `ease-wait:${key}`,  css: `transition-delay: var(--duration-${key});` })
      utilities.push({ class: `play-speed:${key}`, css: `animation-duration: var(--duration-${key});` })
      utilities.push({ class: `play-wait:${key}`,  css: `animation-delay: var(--duration-${key});` })
    }
  }

  // ── Blur → glass-blur, glow-blur ──
  if (tokens.blur) {
    for (const [key, value] of Object.entries(tokens.blur)) {
      utilities.push({ class: `glass-blur:${key}`, css: `backdrop-filter: blur(${value});` })
      utilities.push({ class: `glow-blur:${key}`,  css: `filter: blur(${value});` })
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
  'paint':            'background-color',
  'paint-img':        'background-image',
  'paint-size':       'background-size',
  'paint-pos':        'background-position',
  'paint-blend':      'background-blend-mode',
  'paint-clip':       'background-clip',
  'paint-fix':        'background-attachment',
  'paint-tile':       'background-repeat',
  'pad':              'padding',
  'pad-x':            'padding-inline',
  'pad-y':            'padding-block',
  'pad-top':          'padding-top',
  'pad-right':        'padding-right',
  'pad-btm':          'padding-bottom',
  'pad-left':         'padding-left',
  'mar':              'margin',
  'mar-x':            'margin-inline',
  'mar-y':            'margin-block',
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
  'stroke':           'border',
  'stroke-color':     'border-color',
  'stroke-width':     'border-width',
  'stroke-style':     'border-style',
  'stroke-top-color': 'border-top-color',
  'stroke-btm-color': 'border-bottom-color',
  'curve':            'border-radius',
  'curve-tl':         'border-top-left-radius',
  'curve-tr':         'border-top-right-radius',
  'curve-bl':         'border-bottom-left-radius',
  'curve-br':         'border-bottom-right-radius',
  'ring':             'outline',
  'ring-color':       'outline-color',
  'ring-width':       'outline-width',
  'ring-offset':      'outline-offset',
  'cast':             'box-shadow',
  'cast-text':        'text-shadow',
  'cast-inner':       'box-shadow',
  'cast-drop':        'filter',
  'glow':             'filter',
  'glow-blur':        'filter',
  'glass':            'backdrop-filter',
  'glass-blur':       'backdrop-filter',
  'blend':            'mix-blend-mode',
  'blend-bg':         'background-blend-mode',
  'isolate':          'isolation',
  'clip':             'clip-path',
  'mask':             'mask',
  'pos':              'position',
  'pos-top':          'top',
  'pos-right':        'right',
  'pos-btm':          'bottom',
  'pos-left':         'left',
  'pos-inset':        'inset',
  'layer':            'z-index',
  'float':            'float',
  'clear':            'clear',
  'display':          'display',
  'overflow':         'overflow',
  'overflow-x':       'overflow-x',
  'overflow-y':       'overflow-y',
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
  'grid-cols':        'grid-template-columns',
  'grid-rows':        'grid-template-rows',
  'grid-col':         'grid-column',
  'grid-row':         'grid-row',
  'grid-area':        'grid-area',
  'grid-flow':        'grid-auto-flow',
  'text':             'font-size',
  'type-face':        'font-family',
  'type-size':        'font-size',
  'type-weight':      'font-weight',
  'type-style':       'font-style',
  'type-stretch':     'font-stretch',
  'leading':          'line-height',
  'tracking':         'letter-spacing',
  'word-gap':         'word-spacing',
  'indent':           'text-indent',
  'text-align':       'text-align',
  'text-case':        'text-transform',
  'text-decor':       'text-decoration',
  'text-decor-color': 'text-decoration-color',
  'text-overflow':    'text-overflow',
  'text-valign':      'vertical-align',
  'text-writing':     'writing-mode',
  'text-dir':         'direction',
  'text-wrap':        'text-wrap',
  'wrap':             'white-space',
  'move':             'transform',
  'move-x':           'transform',
  'move-y':           'transform',
  'spin':             'transform',
  'scale':            'transform',
  'skew':             'transform',
  'origin':           'transform-origin',
  'depth-view':       'perspective',
  'flip':             'backface-visibility',
  'ease':             'transition',
  'ease-prop':        'transition-property',
  'ease-speed':       'transition-duration',
  'ease-curve':       'transition-timing-function',
  'ease-wait':        'transition-delay',
  'play':             'animation',
  'play-name':        'animation-name',
  'play-speed':       'animation-duration',
  'play-loop':        'animation-iteration-count',
  'play-state':       'animation-play-state',
  'scroll':           'scroll-behavior',
  'scroll-snap':      'scroll-snap-type',
  'snap-align':       'scroll-snap-align',
  'scroll-pad':       'scroll-padding',
  'scroll-mar':       'scroll-margin',
  'overscroll':       'overscroll-behavior',
  'bar-width':        'scrollbar-width',
  'bar-color':        'scrollbar-color',
  'bar-gutter':       'scrollbar-gutter',
  'cursor':           'cursor',
  'events':           'pointer-events',
  'select':           'user-select',
  'touch':            'touch-action',
  'resize':           'resize',
  'will':             'will-change',
  'frame-type':       'container-type',
  'frame-name':       'container-name',
  'scene-name':       'view-transition-name',
  'path':             'offset-path',
  'path-dist':        'offset-distance',
  'path-spin':        'offset-rotate',
  'shape':            'shape-outside',
  'shape-mar':        'shape-margin',
  'svg-stroke':       'stroke',
  'svg-stroke-width': 'stroke-width',
  'anchor-name':      'anchor-name',
  'ruby-align':       'ruby-align',
  'ruby-pos':         'ruby-position',
  'img-render':       'image-rendering',
  'field-size':       'field-sizing',
  'list':             'list-style',
  'list-pos':         'list-style-position',
  'table':            'table-layout',
  'content':          'content',
}