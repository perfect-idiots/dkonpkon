'use strict'

const {dirname, join} = require('path')
const {readFileSync} = require('fs')
const jtry = require('just-try')
const projdir = dirname(__dirname)
const src = join(projdir, 'src')
const out = join(projdir, 'out')
const lib = join(projdir, 'lib')
const dep = join(projdir, 'dep')

const tryReadJSON = filename =>
  jtry(() => JSON.parse(readFileSync(filename).toString('utf8')), () => new Object())

function getlib (...name) {
  return jreq(lib, ...name)
}

function jreq (...name) {
  return require(join(...name))
}

module.exports = {src, out, lib, dep, getlib, jreq, tryReadJSON}
