'use strict'
const {statSync} = require('fs')
module.exports = filename =>
  Number(statSync(filename).mtime)
