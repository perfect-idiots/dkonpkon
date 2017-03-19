'use strict'

const {join} = require('path')
const {statSync, readdirSync} = require('fs')
const jsDepTree = require('dependency-tree')
const {projdir, lib, src} = require('../lib/common-vars.js')
const depNODE = {}

; [lib, src, join(projdir, 'script')].forEach(genNodeDeps)

module.exports = depNODE

function genNodeDeps (name) {
  const stats = statSync(name)
  if (stats.isFile()) {
    if (/\.js$/.test(name)) {
      const filter = string => !/node_modules/.test(string)
      depNODE[name] = jsDepTree.toList({filename: name, directory: projdir, filter})
    } else {
      depNODE[name] = []
    }
  } else if (stats.isDirectory()) {
    readdirSync(name).map(item => join(name, item)).forEach(genNodeDeps)
  } else {
    throw new Error(`Unreconizable file system entry: ${name}`)
  }
}
