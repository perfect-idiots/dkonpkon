(function (window) {
  'use strict'
  const {document} = window
  const searchTextBox = document.getElementById('search-input')
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

  searchTextBox.showSearchResult = showSearchResult

  document
    .getElementById('search-button')
    .addEventListener('click', showSearchResult, false)

  searchTextBox.addEventListener('keydown', showSuggestionList, false)

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
      // Sửa từ dòng này
      const content = getText(getContentElement(articleContainer).textContent)
      articleContainer.hidden = check(content, text)
      // Đến dòng này
    }

    function check (content, text) {
      return notSubStr(content, text) && notSubStr(getNonDiaStr(content), text)
    }

    function notSubStr (container, substring) {
      return container.indexOf(substring) === -1
    }
  }
}).call(window, window)
