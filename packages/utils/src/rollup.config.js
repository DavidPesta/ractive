const pkg = require('../package.json')
const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

export default {
  sourcemap: true,
  plugins: [
    nodeResolve(),
    commonjs(),
    buble({transforms: { modules: false }})
  ],
  input: 'src/index.js',
  output: [
    { file: pkg.main, format: 'umd', name: pkg.name },
    { file: pkg.module, format: 'es' }
  ],
  globals: {
    ractive: 'Ractive'
  },
  external: [
    'ractive'
  ]
}
