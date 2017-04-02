(function (window) {
  'use strict'
  const {document, search: {check}} = window
  const dataGenre = JSON.parse(document.getElementById('data-genre').textContent)
  const dataGameList = JSON.parse(document.getElementById('data-game-list').textContent)
  const singleSearchResultTemplate = document.getElementById('single-search-result-template')
  const searchTextBox = document.getElementById('search-input')
  const searchResult = document.getElementById('search-result')
  const filterFieldSelect = document.getElementById('filter-field-select')
  const caseSensitiveCheckbox = document.getElementById('case-sensitive-checkbox')

  searchTextBox.showSearchResult = showSearchResult

  document
    .getElementById('search-button')
    .addEventListener('click', showSearchResult, false)

  for (const type of ['keydown', 'change', 'paste']) {
    searchTextBox.addEventListener(type, showSuggestionList, false)
  }

  function showSuggestionList () {
    setTimeout(showSearchResult)
  }

  function showSearchResult () {
    searchResult.textContent = ''
    searchResult.removeAttribute('match-count')
    if (!searchTextBox.value) return

    const getText = caseSensitiveCheckbox.checked
      ? string => string
      : string => string.toUpperCase()
    const text = getText(searchTextBox.value)
    const filterField = filterFieldSelect.value
    const getContent = filterField === 'all'
      ? object => {
        const {key, subpage, name, genre, description} = object
        return [key, subpage, name, genre, description].join('\n')
      }
      : object => object[filterField]

    const filtered = dataGameList.filter(object => !check(getText(getContent(object)), text))
    searchResult.setAttribute('match-count', filtered.length)

    if (!filtered.length) {
      const noSearchResult = document.createElement('p')
      searchResult.appendChild(noSearchResult)
      noSearchResult.classList.add('no-search-result')
      noSearchResult.textContent = `No result for "${searchTextBox.value}"`
      return
    }

    for (const object of filtered) {
      const {key, subpage, name, genre, description} = object

      const div = document
        .importNode(singleSearchResultTemplate.content, true)
        .firstElementChild

      searchResult.appendChild(div)
      div.setAttribute('data-json', JSON.stringify(object))

      Object.assign(
        div.querySelector('.link'),
        {
          textContent: name,
          href: `page/${subpage}.html#target-game-item=${key}`
        }
      )

      div
        .querySelector('.genre')
        .textContent = `Thể loại: ${genre.map(x => dataGenre[x]).join(', ')}`

      div
        .querySelector('.description')
        .innerHTML = description

      for (const property in object) {
        div.setAttribute(`data-${property}`, object[property])
      }
    }
  }
}).call(window, window)
