'use strict'

const {dirname, join} = require('path')
const {readFileSync, statSync, readdirSync} = require('fs')
const merge = require('deepmerge')
const jsDepTree = require('dependency-tree').toList
const jtry = require('just-try')
const {projdir, lib, src, dep, tryReadJSON} = require('../lib/common-vars.js')
const depYAML = require('./dep-map-yml.js')
const depJSON = tryReadJSON(join(dep, 'dependencies.json'))
const depNODE = {}

; [lib, src, join(projdir, 'script')]).forEach(genNodeDeps)

function genNodeDeps (name) {
  const stats = statSync(name)
  if (stats.isFile()) {
    if (/\.js$/.test(name)) {
      const filter = string => !/node_modules/.test(string)
      depNODE[name] = jsDepTree({filename: name, directory: projdir, filter})
    }
  } else if (stats.isDirectory()) {
    readdirSync(name).map(item => join(name, item)).forEach(genNodeDeps)
  } else {
    throw new Error(`Unreconizable file system entry: ${name}`)
  }
}

module.exports = merge.all([depYAML, depJSON, depNODE])
