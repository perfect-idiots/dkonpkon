'use strict'

module.exports = string => {
  const [first, ...rest] = String(string)
  return first.toUpperCase() + rest.map(x => x.toLowerCase()).join('')
}
