'use strict'

const capitalize = require('./capitalize.js')

module.exports = string =>
  String(string).split('-').map(capitalize).join(' ')
