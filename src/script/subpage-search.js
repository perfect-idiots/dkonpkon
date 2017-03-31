(function (window) {
  'use strict'
  const {document, search: {check}} = window
  const searchTextBox = document.getElementById('search-input')
  const list = document.querySelectorAll('#main-list .article-container')
  const filterFieldSelect = document.getElementById('filter-field-select')
  const caseSensitiveCheckbox = document.getElementById('case-sensitive-checkbox')

  searchTextBox.showSearchResult = showSearchResult

  document
    .getElementById('search-button')
    .addEventListener('click', showSearchResult, false)

  searchTextBox.addEventListener('keydown', showSuggestionList, false)

  function showSuggestionList () {
    setTimeout(showSearchResult)
  }

  function showSearchResult () {
    const getText = caseSensitiveCheckbox.checked
      ? string => string
      : string => string.toUpperCase()
    const text = getText(searchTextBox.value)
    const filterField = filterFieldSelect.value
    const getContentElement = filterField === 'all'
      ? articleContainer => articleContainer
      : articleContainer => articleContainer.querySelector('.' + filterField)

    for (const articleContainer of list) {
      const content = getText(getContentElement(articleContainer).textContent)
      articleContainer.hidden = check(content, text)
    }
  }
}).call(window, window)
