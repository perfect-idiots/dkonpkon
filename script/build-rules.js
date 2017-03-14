'use strict'

const {assign, getOwnPropertyNames} = Object

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
    (sourcecode, locals) =>
      getOwnPropertyNames(locals)
        .reduce(
          (object, name) => object.define(name, locals[name]),
          require('stylus')(sourcecode.toString('utf8'))
        )
        .render()
  ],
  [
    /\.(markdown-it|markdown|md)$/,
    '.html',
    (sourcecode) =>
      require('jstransformer-markdown-it').render(sourcecode.toString('utf8'))
  ]
]

function renderMarkdownIt (text, options) {
  const defaultOptions = {
    linkify: true,
    typographer: true,
    html: true,
    breaks: false,
    highlight: true,
    langPrefix: 'markdown-language-'
  }
  const actualOptions = assign({}, defaultOptions, options)
  return require('jstransformer-markdown-it').render(text, actualOptions)
}
