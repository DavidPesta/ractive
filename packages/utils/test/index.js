/* eslint-env browser */
import { module, test } from 'qunit'
import { parse, make } from '@ractivejs/utils'

module('utils toParts')

const specs = [
  'EmptyTopLevels',
  'Full',
  'FullReordered',
  'IndirectExport',
  'LinksOnly',
  'ScriptAfterExport',
  'ScriptOnly',
  'Simple',
  'StyleOnly',
  'TemplateOnly'
]

specs.forEach((spec, index) => {
  test(`${spec}`, assert => {
    const done = assert.async()
    const specPath = `/samples/${spec}/${spec}`
    const source = fetch(`${specPath}.ractive.html`).then(r => r.text())
    const expectedParse = fetch(`${specPath}.parsed.json`).then(r => r.json())
    const expectedCode = fetch(`${specPath}.js`).then(r => r.text())
    const expectedMap = fetch(`${specPath}.js.map`).then(r => r.text())

    Promise.all([source, expectedParse, expectedCode, expectedMap]).then(([source, expectedParse, expectedCode, expectedMap]) => {
      const actualParse = parse(source)
      const { code: actualCode, map: actualMap } = make(actualParse)

      assert.deepEqual(actualParse, expectedParse, `Parse ${spec} correctly.`)
      assert.strictEqual(actualCode, expectedCode, `Code ${spec} correctly.`)
      assert.strictEqual(actualMap, expectedMap, `Map ${spec} correctly.`)
      done()
    })
  })
})
