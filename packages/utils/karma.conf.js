const baseConf = require('../../karma.conf')

module.exports = baseConf({
  files: [
    { pattern: 'node_modules/@ractivejs/utils-samples/samples/*/*.+(html|json|js|map)', watched: false, included: false },
    'node_modules/@ractivejs/core/dist/lib.umd.js',
    'dist/lib.umd.js',
    'tmp/test.umd.js'
  ],
  proxies: {
    '/samples/': '/base/node_modules/@ractivejs/utils-samples/samples/'
  }
})
