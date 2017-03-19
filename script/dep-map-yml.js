'use strict'

const {join, dirname} = require('path')
const {readFileSync} = require('fs')
const projdir = dirname(__dirname)
const yaml = readFileSync(join(projdir, 'dependency-map.yaml'))
const json = require('js-yaml').load(yaml.toString('utf8'))
const result = {}

for (const dependent in json) {
  const mapper = dependency => join(projdir, dependency)
  const dependencies = json[dependent].map(mapper)
  result[join(projdir, dependent)] = dependencies
}

module.exports = result
