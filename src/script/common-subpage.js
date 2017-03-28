(function (window) {
  'use strict'
  const {assign} = Object
  const {document, urlParser} = window

  let hashObject = {}

  window.addEventListener('hashchange', () => setTimeout(onHashChange), false)
  setTimeout(onHashChange)

  document
    .getElementById('no-zoomed-article')
    .addEventListener('change', createCheckboxHashUpdater(''), false)

  for (const checkbox of document.querySelectorAll('#main-list .zoom-in-radio')) {
    const targetGameItem = checkbox.nextElementSibling.getAttribute('target-game-item')
    checkbox.addEventListener('change', createCheckboxHashUpdater(targetGameItem), false)
  }

  function onHashChange () {
    hashObject = urlParser.parseHashObject(window.location.hash)
    const {targetGameItem} = hashObject
    const targetGameElement = document.querySelector(`#main-list [target-game-item="${targetGameItem}"]`)
    const targetCheckbox = targetGameElement
      ? targetGameElement.previousElementSibling
      : document.getElementById('no-zoomed-article')
    targetCheckbox.checked = true
  }

  function createCheckboxHashUpdater (targetGameItem) {
    return event => event.target.checked && assignHashObject({targetGameItem})
  }

  function assignHashObject (addend) {
    const newHashObject = assign({}, hashObject, addend)
    window.location.hash = urlParser.stringifyHashObject(newHashObject)
  }
}).call(window, window)
