'use strict'

module.exports = compare

function compare (left, right) {
  if (left.size !== right.size) return false
  for (const x of left) {
    if (!right.has(x)) return false
  }
  return true
}
