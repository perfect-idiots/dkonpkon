'use strict'

const {rng, prng} = require('crypto')
const {fromCharCode} = String
const a = 'a'.charCodeAt()

const incChar = (char, inc) =>
  fromCharCode(String(char).charCodeAt() + parseInt(inc))

const getTwoChar = byte =>
  [byte & 0xF, byte >> 4].map(x => fromCharCode(x + a)).join('')

const encode = buffer =>
  [...buffer].map(getTwoChar).join('')

const rngString = size => encode(rng(size))
const prngString = size => encode(prng(size))

module.exports = {
  getTwoChar, encode, rngString, prngString
}
