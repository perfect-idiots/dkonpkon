'use strict'
const {join} = require('path')
const {readFileSync} = require('fs')
const options = {encoding: 'utf8'}
module.exports = name => readFileSync(join(__dirname, name), options)