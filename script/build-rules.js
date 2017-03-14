'use strict'

const {assign} = Object

module.exports = [
  [
    /\.(pug|jade)$/,
    '.html',
    (sourcecode, locals) => {
      const filters = {md: renderMarkdownIt}
      const options = {doctype: 'html', pretty: true, filename: locals.source, filters}
      const fn = require('pug').compile(sourcecode.toString('utf8'), options)
      return fn(assign({options, fn}, locals))
    }
  ],
  [
    /\.(stylus|styl)$/,
    '.css',
    (sourcecode, locals) => {
      const stylus = require('stylus')
      let object = stylus(sourcecode.toString('utf8'))
      for (const name in locals) {
        object = object.define(name, locals[name])
      }
      return object.render()
    }
  ]
]

function renderMarkdownIt (text, options) {
  const actualOptions = assign(options, {linkify: true, langPrefix: 'markdown-it'})
  return require('markdown-it').render(text, actualOptions)
}
