import Ractive from 'ractive'

const element = 7

const parserOptions = {
  interpolate: { script: false, style: false },
  includeLinePositions: true
}

const containerElements = ['template', 'style', 'script']
const contentPatterns = {
  template: /(<template[\s\S]*?>)([\s\S]*?)(<\/template>)/i,
  style: /(<style[\s\S]*?>)([\s\S]*?)(<\/style>)/i,
  script: /(<script[\s\S]*?>)([\s\S]*?)(<\/script>)/i
}

const trimEnd = s => s.replace(/[\s\uFEFF\xA0]+$/, '')

const isElement = i => i && i.t === element
const isImport = i => isElement(i) && i.e === 'link'
const isContainerElement = i => isElement(i) && containerElements.indexOf(i.e) > -1
const isWhitespace = i => i === ' '

const getAttribute = (name, node) => {
  return node.a && node.a[name] ? node.a[name]
    : node.m ? (node.m.find(a => a.t === 13 && a.n === name) || {}).f
      : undefined
}

export default function parse (source) {
  const parsed = Ractive.parse(source, parserOptions)
  const items = parsed.t

  const parts = {
    components: {},
    template: { code: '', map: '' },
    script: { code: '', map: '' },
    style: { code: '', map: '' }
  }

  let remainingContent = trimEnd(source)
  let itemIndex = items.length

  while (itemIndex--) {
    const item = items[itemIndex]

    if (isImport(item)) {
      const module = getAttribute('href', item)
      if (!module) throw new Error('Linked components must have the href attribute.')

      const name = getAttribute('name', item)
      if (!name) throw new Error('Linked components must have the name attribute.')
      if (parts.components.hasOwnProperty(name)) throw new Error(`Linked component name ${name} is already taken by ${parts.components[name].module}.`)

      parts.components[name] = { module }
      remainingContent = remainingContent.slice(0, item.p[2])
    } else if (isContainerElement(item)) {
      const elementName = item.e

      if (parts[elementName].code) throw new Error(`There can only be one top-level <${elementName}>.`)

      const itemOffset = item.p[2]
      const itemParts = remainingContent.slice(itemOffset).match(contentPatterns[elementName])
      const code = itemParts[2]
      const map = ''

      // TODO: Construct source map

      parts[elementName] = { code, map }
      remainingContent = remainingContent.slice(0, itemOffset)
    } else if (isWhitespace(item)) {
      remainingContent = trimEnd(remainingContent)
    } else {
      throw new Error(`Unexpected top-level element ${item}.`)
    }
  }

  return parts
}
