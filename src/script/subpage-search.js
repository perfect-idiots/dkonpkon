(function (window) {
  'use strict'
  const {document} = window
  const {body} = document
  const searchTextBox = document.getElementById('search-input')
  const menuVisibilityCheckbox = document.getElementById('menu-visibility-checkbox')
  const list = document.querySelectorAll('#main-list .article-container')
  const filterFieldSelect = document.getElementById('filter-field-select')
  const caseSensitiveCheckbox = document.getElementById('case-sensitive-checkbox')

  const diacritic = {
    a: 'áàảãạăắằẳẵặâấầẩẫậ',
    d: 'đ',
    e: 'éèẻẽẹêếềểễệ',
    i: 'íìỉĩị',
    o: 'óòỏõọôốồổỗộơờởỡợ',
    u: 'úùủũụưứừửữự',
    y: 'ýỳỷỹỵ'
  }
  for (const nonDiaChar in diacritic) {
    diacritic[nonDiaChar.toUpperCase()] = diacritic[nonDiaChar].toUpperCase()
  }

  const reverseDiacritic = {}
  for (const nonDiaChar in diacritic) {
    for (const diaChar of diacritic[nonDiaChar]) {
      reverseDiacritic[diaChar] = nonDiaChar
    }
  }

  const getNonDiaStr = diaString =>
    Array.from(diaString).map(diaChar => reverseDiacritic[diaChar] || diaChar).join('')

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
      searchTextBox.value ? showSearchResult() : toggleSearchBox()
    }, false)

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
    } else if (keyCode === 13) {
      showSearchResult()
    } else {
      showSuggestionList()
    }
  }

  function showSuggestionList () {
    showSearchResult()
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

    function check (content, text) {
      return notSubStr(content, text) && notSubStr(getNonDiaStr(content), text)
    }

    function notSubStr (container, substring) {
      return container.indexOf(substring) === -1
    }
  }
}).call(window, window)
