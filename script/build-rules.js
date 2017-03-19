'use strict'

const jstransformer = require('jstransformer')
const getJsTrfm = name => jstransformer(require(`jstransformer-${name}`))
const {assign} = Object

module.exports = [
  [
    /\.(pug|jade)$/,
    '.html',
    (sourcecode, locals) => {
      const filters = {md: renderMarkdownIt}
      const options = {doctype: 'html', pretty: true, filename: locals.source, filters}
      return getJsTrfm('pug').render(sourcecode.toString('utf8'), options, locals)
    }
  ],
  [
    /\.(stylus|styl)$/,
    '.css',
    (sourcecode, locals) =>
      getJsTrfm('stylus').render(sourcecode.toString('utf8'), {filename: locals.source}, locals)
  ],
  [
    /\.(markdown-it|markdown|md)$/,
    '.html',
    sourcecode =>
      getJsTrfm('markdown-it').render(sourcecode.toString('utf8'))
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
