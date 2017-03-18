#! /usr/bin/env node
'use strict'

const {dirname, join, parse} = require('path')
const {readdirSync, readFileSync, statSync, rmdirSync, writeFileSync, unlinkSync} = require('fs')
const {info} = global.console
const jtry = require('just-try')
const {mkdirSync} = require('fs-force')
const rgxmap = require('./build-rules.js')
const dependencies = require('./get-deps-tree.js')
const {projdir, src, out, lib, getlib, jreq} = require('../lib/common-vars.js')
const tryGetModifiedDate = file => jtry(() => statSync(file).mtime, () => -Infinity)
const createdOutputFiles = new Set()

info({dependencies})

info('\nBUILDING...')
compile(src, out, 0)
info('\nCLEANING...')
clean(out)
info('\ndone.')

function compile (source, target, level) {
  const stats = statSync(source)
  if (stats.isDirectory()) {
    mkdirSync(target)
    readdirSync(source).forEach(item => compile(join(source, item), join(target, item), level + 1))
  } else if (stats.isFile()) {
    const {dir, name} = parse(target)
    rgxmap.some(([regex, suffix, build]) => {
      if (!regex.test(source)) return false
      const target = join(dir, name + suffix)
      const sourcemtime = stats.mtime
      const targetmtime = tryGetModifiedDate(target)
      createdOutputFiles.add(target)
      if (sourcemtime > targetmtime) {
        const sourcecode = readFileSync(source)
        const locals = {projdir, src, out, lib, source, target, dir, name, sourcecode, require, getlib, jreq, sourcemtime, targetmtime}
        info('▸▸ @bd ' + source)
        const output = build(sourcecode, locals).body
        writeFileSync(target, output)
        info(`   ${isFinite(targetmtime) ? '~~~' : '+++'} ` + target + ' (up to date)')
        return true
      } else {
        info('▸▸ @ig ' + source + ' (already up to date)')
        return true
      }
    }) || updateVersion(source, target)
  } else {
    throw new Error(`Invalid type of fs entry: ${source}`)
  }
}

function clean (target) {
  const stats = statSync(target)
  if (stats.isDirectory()) {
    readdirSync(target).forEach(item => clean(join(target, item)))
    removeEmptyDirectory(target)
  } else if (stats.isFile()) {
    createdOutputFiles.has(target) || removeFile(target)
  }
}

function updateVersion (source, target) {
  const sourcemtime = tryGetModifiedDate(source)
  const targetmtime = tryGetModifiedDate(target)
  createdOutputFiles.add(target)
  if (sourcemtime > targetmtime) {
    info('▸▸ @cp ' + source)
    writeFileSync(target, readFileSync(source))
    info(`   ${isFinite(targetmtime) ? '~~~' : '+++'} ` + target + ' (up to date)')
  } else {
    info('▸▸ @ig ' + source + ' (already up to date)')
  }
}

function removeEmptyDirectory (dirname) {
  readdirSync(dirname).length || jtry(() => {
    info('▸▸ @rm ' + dirname)
    rmdirSync(dirname)
    info('   --- ' + dirname + ' (empty directory)')
  })
}

function removeFile (filename) {
  info('▸▸ @rm ' + filename)
  unlinkSync(filename)
  info('   --- ' + filename + ' (redundant file)')
}
