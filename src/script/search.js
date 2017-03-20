(function (window) {
  'use strict'
  const {document} = window
  const {body} = document
  // const input = document.getElementById('search-input')

  const toggleSearchBox = () =>
    isSearchBoxShown() ? hideSearchBox() : showSearchBox()

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
      toggleSearchBox()
    }, false)

  document.addEventListener('click', hideSearchBox, false)
}).call(window, window)
