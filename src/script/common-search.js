(function (window) {
  'use strict'
  const {document} = window
  const {body} = document
  const searchTextBox = document.getElementById('search-input')
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
      menuVisibilityCheckbox.dispatchEvent(new window.CustomEvent('change'))
      searchTextBox.value || toggleSearchBox()
    }, false)

  document
    .getElementById('filter-field-select')
    .addEventListener('click', () => searchTextBox.showSearchResult(), false)

  document
    .getElementById('search-option-container')
    .addEventListener('click', event => event.stopPropagation(), false)

  document
    .getElementById('case-sensitive-checkbox')
    .addEventListener('change', () => searchTextBox.showSearchResult(), false)

  document.addEventListener('click', () => searchTextBox.value || hideSearchBox(), false)
  searchTextBox.addEventListener('keydown', onkeydown, false)
  searchTextBox.addEventListener('click', event => event.stopPropagation(), false)

  function onkeydown ({keyCode}) {
    if (keyCode === 27) {
      if (searchTextBox.value) {
        searchTextBox.value = ''
      } else {
        hideSearchBox()
      }
    }
  }
}).call(window, window)
