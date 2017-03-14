#! /usr/bin/env node
'use strict'

const {dirname, extname, join, parse} = require('path')
const {readdirSync, readFileSync, statSync, mkdirSync, writeFileSync} = require('fs')
const {assign} = Object
const {info} = global.console
const pug = require('pug')
const stylus = require('stylus')
const markdown = require('jstransformer-markdown-it')
const less = require('less')
const jtry = require('just-try')
const rgxmap = require('./build-rules.js')
const projdir = dirname(__dirname)
const src = join(projdir, 'src')
const out = join(projdir, 'out')
const lib = join(projdir, 'lib')
const outfolder = new Set()

compile(src, out, 0)
info('done.')

function compile (source, target, level) {
  const stats = statSync(source)
  if (stats.isDirectory()) {
    jtry(() => statSync(target).isDirectory(), () => false) || mkdirSync(target)
    readdirSync(source).forEach(item => compile(join(source, item), join(target, item), level + 1))
  } else if (stats.isFile()) {
    const sourcecode = readFileSync(source)
    const {dir, name} = parse(target)
    rgxmap.some(([regex, suffix, compile]) => {
      if (regex.test(source)) {
        const target = join(dir, name + suffix)
        const locals = {projdir, src, out, source, target, dir, name, sourcecode, require, getlib, jreq}
        const output = compile(sourcecode, locals)
        writeFileSync(target, output)
        return true
      }
    }) || writeFileSync(target, sourcecode)
  } else {
    throw new Error(`Invalid type of fs entry: ${source}`)
  }
}

function getlib (...name) {
  return jreq(lib, ...name)
}

function jreq (...name) {
  return require(join(...name))
}

function renderMarkdownIt (text, options) {
  const actualOptions = assign(options, {linkify: true, langPrefix: 'markdown-it'})
  return markdown.render(text, actualOptions)
}
