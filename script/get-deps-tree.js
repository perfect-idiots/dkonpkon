'use strict'

const {dirname, join} = require('path')
const {readFileSync} = require('fs')
const merge = require('deepmerge')
const jtry = require('just-try')
const {projdir, dep, tryReadJSON} = require('../lib/common-vars.js')
const depYAML = require('./dep-map-yml.js')
const depJSON = tryReadJSON(join(dep, 'dependencies.json'))

module.exports = merge(depYAML, depJSON)
