'use strict'

const {dirname, join} = require('path')
const projdir = dirname(__dirname)
const src = join(projdir, 'src')
const out = join(projdir, 'out')
const lib = join(projdir, 'lib')
const dep = join(projdir, 'dep')

function getlib (...name) {
  return jreq(lib, ...name)
}

function jreq (...name) {
  return require(join(...name))
}

module.exports = {dirname, join, src, out, lib, dep, getlib, jreq}
