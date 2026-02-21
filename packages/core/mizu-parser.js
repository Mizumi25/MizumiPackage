// packages/core/mizu-parser.js
// Parses .mizu files into the same config object as mizumi.config.js
// CSS-brained developers write .mizu, JS-brained write mizumi.config.js
// Both compile to identical output

// ── .mizu syntax ──────────────────────────────────────────
//
// @token {
//   colors {
//     primary: #3B82F6;
//     surface: #ffffff;
//   }
//   spacing {
//     sm: 8px;
//     md: 16px;
//     lg: 24px;
//   }
//   radius {
//     md: 8px;
//     lg: 12px;
//   }
// }
//
// @pattern card {
//   pad: md;
//   paint: surface;
//   curve: lg;
//   cast: md;
// }
//
// @pattern btn extends card {
//   paint: primary;
//   ink: white;
// }
//
// @animate hover-lift {
//   hover {
//     move-y: -8px;
//     ease-speed: fast;
//     ease-curve: smooth;
//   }
// }
//
// @rule {
//   responsive: true;
//   darkMode: class;
//   containers {
//     card { sm: 300px; md: 500px; }
//   }
// }
// ──────────────────────────────────────────────────────────

import fs   from 'node:fs'
import path from 'node:path'

export class MizuParser {
  constructor() {
    this.config = {
      tokens    : {},
      patterns  : {},
      animations: {},
      rules     : {}
    }
  }

  // Parse a .mizu file from path
  parseFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Mizumi: .mizu file not found — ${filePath}`)
    }
    const src = fs.readFileSync(filePath, 'utf8')
    return this.parse(src)
  }

  // Parse a .mizu string directly
  parse(src) {
    this.config = {
      tokens    : {},
      patterns  : {},
      animations: {},
      rules     : {}
    }

    // Strip comments
    const clean = this.stripComments(src)

    // Extract all @blocks
    const blocks = this.extractBlocks(clean)

    for (const block of blocks) {
      this.processBlock(block)
    }

    return this.config
  }

  // Strip // and /* */ comments
  stripComments(src) {
    return src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
  }

  // Extract all top-level @keyword name? { ... } blocks
  extractBlocks(src) {
    const blocks = []
    let i = 0

    while (i < src.length) {
      // Skip whitespace
      while (i < src.length && /\s/.test(src[i])) i++
      if (i >= src.length) break

      // Must start with @
      if (src[i] !== '@') { i++; continue }

      // Read keyword
      let j = i + 1
      while (j < src.length && /\w/.test(src[j])) j++
      const keyword = src.slice(i + 1, j)
      if (!keyword) { i++; continue }

      // Skip whitespace after keyword
      while (j < src.length && src[j] === ' ') j++

      // Read optional name — everything up to {
      let nameEnd = j
      while (nameEnd < src.length && src[nameEnd] !== '{') nameEnd++
      const name = src.slice(j, nameEnd).trim() || null

      // Find opening brace
      const braceOpen = nameEnd
      if (src[braceOpen] !== '{') { i = j; continue }

      // Extract balanced body
      const { body, end } = this.extractBalanced(src, braceOpen + 1)

      blocks.push({ keyword, name, body })
      i = end
    }

    return blocks
  }

  // Extract balanced braces body — handles nesting
  extractBalanced(src, start) {
    let depth = 1
    let i     = start
    let body  = ''

    while (i < src.length && depth > 0) {
      const ch = src[i]
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) break
      }
      body += ch
      i++
    }

    return { body, end: i + 1 }
  }

  // Route block to correct processor
  processBlock(block) {
    switch (block.keyword) {
      case 'token':
      case 'tokens':
        this.processTokens(block.body)
        break

      case 'pattern':
        this.processPattern(block.name, block.body)
        break

      case 'animate':
      case 'animation':
        this.processAnimation(block.name, block.body)
        break

      case 'rule':
      case 'rules':
        this.processRules(block.body)
        break

      default:
        console.warn(`Mizumi: unknown .mizu directive "@${block.keyword}"`)
    }
  }

  // Parse @token { colors { primary: #3B82F6; } spacing { md: 16px; } }
  processTokens(body) {
    // Find sub-blocks like colors { ... }
    const subBlocks = this.extractSubBlocks(body)

    for (const { name, body: subBody } of subBlocks) {
      const category = name.trim()
      if (!this.config.tokens[category]) {
        this.config.tokens[category] = {}
      }

      // Parse key: value; pairs inside
      const pairs = this.parsePairs(subBody)
      for (const [key, value] of Object.entries(pairs)) {
        // Handle nested objects — primary { DEFAULT: #3B82F6; 50: #EFF6FF; }
        if (value && typeof value === 'object') {
          this.config.tokens[category][key] = value
        } else {
          this.config.tokens[category][key] = value
        }
      }
    }

    // Also parse any loose key: value pairs directly in @token
    const loosePairs = this.parseLoosePairs(body)
    for (const [key, value] of Object.entries(loosePairs)) {
      // Loose pairs at root level of @token go to a 'misc' category
      if (!this.config.tokens.misc) this.config.tokens.misc = {}
      this.config.tokens.misc[key] = value
    }
  }

  // Parse @pattern card { pad: md; paint: surface; curve: lg; }
  // Parse @pattern btn extends card { paint: primary; }
  processPattern(nameStr, body) {
    if (!nameStr) return

    // Handle extends — "btn extends card"
    const extendsMatch = nameStr.match(/^(\S+)\s+extends\s+(\S+)$/)
    let patternName, extendsName

    if (extendsMatch) {
      patternName = extendsMatch[1]
      extendsName = extendsMatch[2]
    } else {
      patternName = nameStr.trim()
      extendsName = null
    }

    // Parse properties — pad: md; → pad:md
    const pairs   = this.parsePairs(body)
    const classes = []

    // Add parent classes first if extends
    if (extendsName && this.config.patterns[extendsName]) {
      classes.push(this.config.patterns[extendsName])
    }

    for (const [capability, token] of Object.entries(pairs)) {
      classes.push(`${capability}:${token}`)
    }

    this.config.patterns[patternName] = classes.join(' ')
  }

  // Parse @animate hover-lift { hover { move-y: -8px; ease-speed: fast; } }
  processAnimation(name, body) {
    if (!name) return

    const animName = name.trim()
    const config   = {}
    const subBlocks = this.extractSubBlocks(body)

    for (const { name: trigger, body: triggerBody } of subBlocks) {
      const pairs = this.parsePairs(triggerBody)
      config[trigger.trim()] = pairs
    }

    // Also parse root-level animation props
    const rootPairs = this.parseLoosePairs(body)
    Object.assign(config, rootPairs)

    this.config.animations[animName] = config
  }

  // Parse @rule { responsive: true; darkMode: class; containers { card { sm: 300px; } } }
  processRules(body) {
    // Parse simple key: value pairs
    const pairs = this.parseLoosePairs(body)
    for (const [key, value] of Object.entries(pairs)) {
      this.config.rules[key] = this.coerceValue(value)
    }

    // Parse nested blocks like containers { } and breakpoints { }
    const subBlocks = this.extractSubBlocks(body)
    for (const { name, body: subBody } of subBlocks) {
      const category = name.trim()
      const pairs    = this.parsePairs(subBody)
      this.config.rules[category] = pairs
    }
  }

  // Extract named sub-blocks: name { ... } within a body
  extractSubBlocks(body) {
    const blocks = []
    let i = 0

    while (i < body.length) {
      // Find word before {
      const match = body.slice(i).match(/^[\s\n]*([a-zA-Z][\w-]*)[\s\n]*\{/)
      if (!match) { i++; continue }

      const name     = match[1]
      const braceIdx = body.indexOf('{', i + match.index + match[1].length)
      if (braceIdx === -1) break

      const { body: subBody, end } = this.extractBalanced(body, braceIdx + 1)
      blocks.push({ name, body: subBody })
      i = end
    }

    return blocks
  }

  // Parse key: value; pairs — returns object
  // Also handles nested blocks: name { key: value; }
  parsePairs(body) {
    const result = {}

    // Remove sub-blocks first to avoid parsing their contents as pairs
    const withoutSubBlocks = body.replace(/[\w-]+\s*\{[^}]*\}/g, '')

    const lines = withoutSubBlocks.split(/[\n;]+/)

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      const colonIdx = trimmed.indexOf(':')
      if (colonIdx === -1) continue

      const key   = trimmed.slice(0, colonIdx).trim()
      const value = trimmed.slice(colonIdx + 1).trim().replace(/;$/, '').trim()

      if (key && value) {
        result[key] = this.coerceValue(value)
      }
    }

    // Also parse nested sub-blocks within this body
    const subBlockMatches = body.matchAll(/([\w-]+)\s*\{([^}]*)\}/g)
    for (const match of subBlockMatches) {
      const subName  = match[1]
      const subBody  = match[2]
      const subPairs = this.parsePairs(subBody)
      result[subName] = subPairs
    }

    return result
  }

  // Parse ONLY loose key: value pairs — no sub-blocks
  parseLoosePairs(body) {
    const result = {}

    // Remove sub-blocks entirely
    const withoutBlocks = body.replace(/[\w-]+\s*\{[^{}]*\}/g, '')
    const lines = withoutBlocks.split(/[\n;]+/)

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      const colonIdx = trimmed.indexOf(':')
      if (colonIdx === -1) continue

      const key   = trimmed.slice(0, colonIdx).trim()
      const value = trimmed.slice(colonIdx + 1).trim().replace(/;$/, '').trim()

      if (key && value) {
        result[key] = this.coerceValue(value)
      }
    }

    return result
  }

  // Coerce string values to correct JS types
  coerceValue(value) {
    if (value === 'true')  return true
    if (value === 'false') return false
    if (value === 'null')  return null

    // Number — but NOT CSS values like 16px, 1.5rem
    if (/^\d+$/.test(value)) return parseInt(value, 10)

    return value
  }
}

// ── Merge multiple .mizu files into one config ──
export function mergeMizuConfigs(...configs) {
  const merged = {
    tokens    : {},
    patterns  : {},
    animations: {},
    rules     : {}
  }

  for (const config of configs) {
    // Deep merge tokens
    for (const [category, values] of Object.entries(config.tokens || {})) {
      merged.tokens[category] = { ...(merged.tokens[category] || {}), ...values }
    }
    // Merge patterns (last wins)
    Object.assign(merged.patterns,   config.patterns   || {})
    Object.assign(merged.animations, config.animations || {})
    Object.assign(merged.rules,      config.rules      || {})
  }

  return merged
}

// ── Find and parse all .mizu files in a directory ──
export function loadMizuFiles(dir) {
  if (!fs.existsSync(dir)) return {}

  const parser  = new MizuParser()
  const configs = []

  const walk = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.mizu')) {
        try {
          configs.push(parser.parseFile(fullPath))
          console.log(`🌊 Mizumi: loaded ${fullPath}`)
        } catch (e) {
          console.warn(`⚠️  Mizumi: failed to parse ${fullPath} — ${e.message}`)
        }
      }
    }
  }

  walk(dir)
  return mergeMizuConfigs(...configs)
}