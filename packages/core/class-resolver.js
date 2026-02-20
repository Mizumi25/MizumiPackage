// packages/core/class-resolver.js
// Single source of truth for "what CSS does a Mizumi class name produce?"
// Used by UtilityGenerator, PatternExpander, and VariantGenerator.

export const STATIC_UTILITIES = [
  { class: 'flex',            css: 'display: flex;' },
  { class: 'flex-col',        css: 'flex-direction: column;' },
  { class: 'flex-wrap',       css: 'flex-wrap: wrap;' },
  { class: 'inline-flex',     css: 'display: inline-flex;' },
  { class: 'grid',            css: 'display: grid;' },
  { class: 'block',           css: 'display: block;' },
  { class: 'inline',          css: 'display: inline;' },
  { class: 'inline-block',    css: 'display: inline-block;' },
  { class: 'hidden',          css: 'display: none;' },
  { class: 'items-center',    css: 'align-items: center;' },
  { class: 'items-start',     css: 'align-items: flex-start;' },
  { class: 'items-end',       css: 'align-items: flex-end;' },
  { class: 'justify-center',  css: 'justify-content: center;' },
  { class: 'justify-between', css: 'justify-content: space-between;' },
  { class: 'justify-start',   css: 'justify-content: flex-start;' },
  { class: 'justify-end',     css: 'justify-content: flex-end;' },
  { class: 'relative',        css: 'position: relative;' },
  { class: 'absolute',        css: 'position: absolute;' },
  { class: 'fixed',           css: 'position: fixed;' },
  { class: 'sticky',          css: 'position: sticky; top: 0;' },
  { class: 'w-full',          css: 'width: 100%;' },
  { class: 'h-full',          css: 'height: 100%;' },
  { class: 'min-h-screen',    css: 'min-height: 100vh;' },
  { class: 'mx-auto',         css: 'margin-left: auto; margin-right: auto;' },
  { class: 'cursor-pointer',  css: 'cursor: pointer;' },
  { class: 'overflow-hidden', css: 'overflow: hidden;' },
  { class: 'transition',      css: 'transition: all 0.3s ease;' },
  { class: 'text-center',     css: 'text-align: center;' },
  { class: 'font-bold',       css: 'font-weight: 700;' },
  { class: 'font-medium',     css: 'font-weight: 500;' },
  { class: 'list-none',       css: 'list-style: none;' },
  { class: 'border',          css: 'border-width: 1px; border-style: solid;' },
  { class: 'max-w-sm',        css: 'max-width: 640px;' },
  { class: 'max-w-md',        css: 'max-width: 768px;' },
  { class: 'max-w-lg',        css: 'max-width: 1024px;' },
  { class: 'max-w-xl',        css: 'max-width: 1280px;' },
]

// Build a fast lookup map from the static list
const STATIC_MAP = Object.fromEntries(
  STATIC_UTILITIES.map(u => [u.class, u.css])
)

/**
 * Given a class name + tokens, return the CSS string it produces.
 * Returns null if the class is unknown.
 *
 * Examples:
 *   resolveClass('pad-md', tokens)    → 'padding: var(--spacing-md);'
 *   resolveClass('bg-primary', tokens) → 'background-color: var(--color-primary);'
 *   resolveClass('flex', tokens)       → 'display: flex;'
 */
export function resolveClass(className, tokens = {}) {
  // --- Token-based dynamic classes ---

  const bg = className.match(/^bg-(.+)$/)
  if (bg) return `background-color: var(--color-${bg[1]});`

  const color = className.match(/^color-(.+)$/)
  if (color) return `color: var(--color-${color[1]});`

  const borderColor = className.match(/^border-color-(.+)$/)
  if (borderColor) return `border-color: var(--color-${borderColor[1]});`

  // border-primary etc (legacy shorthand)
  const border = className.match(/^border-(.+)$/)
  if (border && border[1] !== 'color') return `border-color: var(--color-${border[1]});`

  const padX = className.match(/^pad-x-(.+)$/)
  if (padX) return `padding-left: var(--spacing-${padX[1]}); padding-right: var(--spacing-${padX[1]});`

  const padY = className.match(/^pad-y-(.+)$/)
  if (padY) return `padding-top: var(--spacing-${padY[1]}); padding-bottom: var(--spacing-${padY[1]});`

  const pad = className.match(/^pad-(.+)$/)
  if (pad) return `padding: var(--spacing-${pad[1]});`

  const marX = className.match(/^mar-x-(.+)$/)
  if (marX) return `margin-left: var(--spacing-${marX[1]}); margin-right: var(--spacing-${marX[1]});`

  const marY = className.match(/^mar-y-(.+)$/)
  if (marY) return `margin-top: var(--spacing-${marY[1]}); margin-bottom: var(--spacing-${marY[1]});`

  const mar = className.match(/^mar-(.+)$/)
  if (mar) return `margin: var(--spacing-${mar[1]});`

  const gap = className.match(/^gap-(.+)$/)
  if (gap) return `gap: var(--spacing-${gap[1]});`

  const rounded = className.match(/^rounded-(.+)$/)
  if (rounded) return `border-radius: var(--radius-${rounded[1]});`

  const shadow = className.match(/^shadow-(.+)$/)
  if (shadow) return `box-shadow: var(--shadow-${shadow[1]});`

  const text = className.match(/^text-(.+)$/)
  if (text) return `font-size: var(--text-${text[1]}-size); font-weight: var(--text-${text[1]}-weight); line-height: var(--text-${text[1]}-line);`

  // --- Static utilities ---
  return STATIC_MAP[className] || null
}

/**
 * Generate all token-based utility entries from a tokens config.
 * Returns array of { class, css } objects.
 * Used by UtilityGenerator and VariantGenerator.
 */
export function generateTokenUtilities(tokens = {}) {
  const utilities = []

  if (tokens.colors) {
    for (const [key, value] of Object.entries(tokens.colors)) {
      if (typeof value === 'object') {
        for (const [shade] of Object.entries(value)) {
          const s = shade === 'DEFAULT' ? '' : `-${shade}`
          utilities.push({ class: `bg-${key}${s}`,           css: `background-color: var(--color-${key}${s});` })
          utilities.push({ class: `color-${key}${s}`,        css: `color: var(--color-${key}${s});` })
          utilities.push({ class: `border-${key}${s}`,       css: `border-color: var(--color-${key}${s});` })
        }
      } else {
        utilities.push({ class: `bg-${key}`,     css: `background-color: var(--color-${key});` })
        utilities.push({ class: `color-${key}`,  css: `color: var(--color-${key});` })
        utilities.push({ class: `border-${key}`, css: `border-color: var(--color-${key});` })
      }
    }
  }

  if (tokens.spacing) {
    for (const [key] of Object.entries(tokens.spacing)) {
      utilities.push({ class: `pad-${key}`,   css: `padding: var(--spacing-${key});` })
      utilities.push({ class: `pad-x-${key}`, css: `padding-left: var(--spacing-${key}); padding-right: var(--spacing-${key});` })
      utilities.push({ class: `pad-y-${key}`, css: `padding-top: var(--spacing-${key}); padding-bottom: var(--spacing-${key});` })
      utilities.push({ class: `mar-${key}`,   css: `margin: var(--spacing-${key});` })
      utilities.push({ class: `mar-x-${key}`, css: `margin-left: var(--spacing-${key}); margin-right: var(--spacing-${key});` })
      utilities.push({ class: `mar-y-${key}`, css: `margin-top: var(--spacing-${key}); margin-bottom: var(--spacing-${key});` })
      utilities.push({ class: `gap-${key}`,   css: `gap: var(--spacing-${key});` })
    }
  }

  if (tokens.radius) {
    for (const [key] of Object.entries(tokens.radius)) {
      utilities.push({ class: `rounded-${key}`, css: `border-radius: var(--radius-${key});` })
    }
  }

  if (tokens.shadows) {
    for (const [key] of Object.entries(tokens.shadows)) {
      utilities.push({ class: `shadow-${key}`, css: `box-shadow: var(--shadow-${key});` })
    }
  }

  if (tokens.typography) {
    for (const [key, value] of Object.entries(tokens.typography)) {
      if (typeof value === 'object') {
        utilities.push({
          class: `text-${key}`,
          css: `font-size: var(--text-${key}-size); font-weight: var(--text-${key}-weight); line-height: var(--text-${key}-line);`
        })
      }
    }
  }

  return utilities
}

/**
 * All utilities combined (token-based + static).
 * This is what VariantGenerator needs to wrap in @media / :hover etc.
 */
export function getAllUtilities(tokens = {}) {
  return [
    ...generateTokenUtilities(tokens),
    ...STATIC_UTILITIES
  ]
}