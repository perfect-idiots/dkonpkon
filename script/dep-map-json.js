'use strict'
const {dep, tryReadJSON} = require('../lib/common-vars.js')
module.exports = tryReadJSON(require('path').join(dep, 'dependencies.json'))
