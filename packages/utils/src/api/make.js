import Ractive from 'ractive'
import MagicString from 'magic-string'
import serialize from 'serialize-javascript'
import dedent from 'dedent'
import { parse } from 'acorn'

const ractiveImport = `import Ractive from 'ractive'\n`
const defaultComponents = {}
const defaultTemplate = ``
const defaultStyle = ``
const defaultScript = `export default {}\n`

const replaceExtension = path => path.replace(/\.ractive\.html$/, '.js')

export default function make (parts) {
  // TL;DR:
  // - Use acorn to get the indexes of parts in the source.
  // - Use magic-string to replace parts of the source.

  const components = parts.components || defaultComponents
  const template = parts.template.code || defaultTemplate
  const style = dedent(parts.style.code || defaultStyle)
  const script = dedent(parts.script.code || defaultScript)

  // Create ES imports from component file links.
  const imports = Object.keys(components).reduce((s, k) => `${s}import ${k} from '${replaceExtension(components[k].module)}'\n`, '')

  // Create initialization options from component file markup.
  const componentInit = `"components":{${Object.keys(components).join(',')}}`
  const templateInit = `"template":${serialize(Ractive.parse(template))}`
  const cssInit = `"css":${serialize(style)}`

  // Find the default export and extract it.
  const program = parse(script, { sourceType: 'module' })
  const exportDeclaration = program.body.find(node => node.type === 'ExportDefaultDeclaration')

  if (!exportDeclaration) throw new Error('Component has no default export')

  const exportStart = exportDeclaration.declaration.start
  const exportEnd = exportDeclaration.declaration.end
  const exportInit = script.slice(exportStart, exportEnd)

  // Assemble everything onto the script.
  const module = new MagicString(script)
  module.trimLines()
  module.overwrite(exportStart, exportEnd, `Ractive.extend({${componentInit},${templateInit},${cssInit}}, ${exportInit})`)
  module.prependLeft(0, imports)
  module.prependLeft(0, ractiveImport)

  const code = module.toString()
  const map = ''

  // TODO: Construct source map

  return { code, map }
}
