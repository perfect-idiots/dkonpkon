'use strict'

function * generator (fn, count = 0) {
  while (count) {
    yield fn(count)
    --count
  }
}

generator.function = generator
generator.value = (value, count) => generator(() => value, count)

function array (fn, count) {
  return Array.from(generator(count))
}

array.function = array
array.value = (value, count) => array(() => value, count)

module.exports = {generator, array}
