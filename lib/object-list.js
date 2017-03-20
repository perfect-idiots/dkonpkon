'use strict'

function toPairObjectList (objectlist) {
  const array = []
  for (const object of objectlist) {
    for (const name in object) {
      array.push({name, body: object[name]})
    }
  }
  return array
}

function toSingleObjectList ([...array]) {
  return array.map(({name, body}) => ({[name]: body}))
}

module.exports = {toPairObjectList, toSingleObjectList}
