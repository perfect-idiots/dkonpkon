(function (window) {
  'use strict'
  const {document} = window
  const {body} = document
  const input = document.getElementById('search-input')
  const menuVisibilityCheckbox = document.getElementById('menu-visibility-checkbox')

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
      menuVisibilityCheckbox.checked = false
      input.value ? showSearchResult() : toggleSearchBox()
    }, false)

  document.addEventListener('click', () => input.value || hideSearchBox(), false)
  input.addEventListener('keydown', onkeydown, false)
  input.addEventListener('click', event => event.stopPropagation(), false)

  function onkeydown ({keyCode}) {
    if (keyCode === 27) {
      if (input.value) {
        input.value = ''
      } else {
        hideSearchBox()
      }
    } else if (keyCode === 13) {
      showSearchResult()
    } else {
      showSuggestionList()
    }
  }

  function showSuggestionList () {}

  function showSearchResult () {}
}).call(window, window)
