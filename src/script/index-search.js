(function (window) {
  'use strict'
  const {document, search: {check}} = window
  const dataGenre = JSON.parse(document.getElementById('data-genre').textContent)
  const dataGameList = JSON.parse(document.getElementById('data-game-list').textContent)
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

      const div = document.createElement('div')
      searchResult.appendChild(div)
      div.setAttribute('data-json', JSON.stringify(object))

      const heading = document.createElement('h2')
      div.appendChild(heading)
      heading.classList.add('name', 'heading', 'title')

      const anchor = document.createElement('a')
      heading.appendChild(anchor)
      anchor.textContent = name
      anchor.href = `page/${subpage}.html#target-game-item=${key}`
      anchor.classList.add('link', 'hyperlink', 'pointer-cursor')

      const genreParagraph = document.createElement('p')
      div.appendChild(genreParagraph)
      genreParagraph.textContent = `Thể loại: ${genre.map(x => dataGenre[x]).join(', ')}`
      genreParagraph.classList.add('genre')

      const descriptionParagraph = document.createElement('p')
      div.appendChild(descriptionParagraph)
      descriptionParagraph.innerHTML = description
      descriptionParagraph.classList.add('description', 'details')

      for (const property in object) {
        div.setAttribute(`data-${property}`, object[property])
      }
    }
  }
}).call(window, window)
