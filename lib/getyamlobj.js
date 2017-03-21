'use strict'
const yaml = require('js-yaml')
const getlibfile = require('./getlibfile.js')
module.exports = name => yaml.load(getlibfile(name))
