(function (window) {
  'use strict'
  const {document} = window
  const {body} = document
  const input = document.getElementById('search-input')

  const isSearchBoxShown = () =>
    body.classList.contains('show-search-box')

  const showSearchBox = () =>
    body.classList.add('show-search-box')

  const hideSearchBox = () =>
    body.classList.remove('show-search-box')

  document
    .getElementById('search-button')
    .addEventListener('click', event => {
      event.stopPropagation()
      if (isSearchBoxShown()) {
        const {value} = input
        if (!value) return hideSearchBox()
      } else {
        showSearchBox()
      }
    }, false)

  document.addEventListener('click', hideSearchBox, false)
  input.addEventListener('click', event => event.stopPropagation(), false)
}).call(window, window)
