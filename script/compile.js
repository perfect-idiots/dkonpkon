#! /usr/bin/env node
'use strict'

const {dirname, join, parse, resolve} = require('path')
const {readdirSync, readFileSync, statSync, rmdirSync, unlinkSync} = require('fs')
const {info} = global.console
const jtry = require('just-try')
const {mkdirSync, writeFileSync} = require('fs-force')
const rgxmap = require('./build-rules.js')
const depsTree = require('./get-deps-tree.js')
const {projdir, src, out, lib, dep, getlib, jreq, tryReadJSON} = require('../lib/common-vars.js')
const createdOutputFiles = new Set()
const markedChanges = new Set()
const mtimeTable = tryReadJSON(join(dep, 'mtime.json'))
const genDepsTree = {}

info('\nINFO')
info({depsTree, mtimeTable})
updateMarkedChanges()
info(`\t${markedChanges.size} files are marked as modified.`)
info('\nBUILDING...')
compile(src, out, 0)
writeFileSync(join(dep, 'dependencies.json'), JSON.stringify(genDepsTree, {space: 2}))
info('\nCLEANING...')
clean(out)
info('\ndone.')

function updateMarkedChanges () {
  for (const dependent in depsTree) {
    const prevmtime = mtimeTable[dependent]
    const currmtime = Number(statSync(dependent).mtime)
    if (!prevmtime || currmtime > prevmtime) {
      mtimeTable[dependent] = currmtime
      markedChanges.add(dependent)
    }
    for (const dependency of depsTree[dependent]) {
      const prevmtime = mtimeTable[dependent]
      const currmtime = Number(statSync(dependency).mtime)
      if (prevmtime && prevmtime >= currmtime) continue
      mtimeTable[dependency] = currmtime
      markedChanges.add(dependent)
    }
  }
  writeFileSync(join(dep, 'mtime.json'), JSON.stringify(mtimeTable, {space: 2}))
}

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
      createdOutputFiles.add(target)
      if (markedChanges.has(source)) {
        const sourcecode = readFileSync(source)
        const locals = {projdir, src, out, lib, source, target, dir, name, sourcecode, require, getlib, jreq, markedChanges}
        info('▸▸ @bd ' + source)
        const {body, dependencies} = build(sourcecode, locals)
        genDepsTree[source] = dependencies
        writeFileSync(target, body)
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
  createdOutputFiles.add(target)
  if (markedChanges.has(source)) {
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
