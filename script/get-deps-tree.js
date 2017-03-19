'use strict'

const merge = require('deepmerge')
const depYAML = require('./dep-map-yml.js')
const depJSON = require('./dep-map-json.js')
const depNODE = require('./dep-map-deduced.js')

module.exports = merge.all([depYAML, depJSON, depNODE])
