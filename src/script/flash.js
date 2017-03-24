(function (window) {
  'use strict'
  const {document, onResizeWindow} = window
  const mainEmbedContainer = document.getElementById('main-embed-container')
  const allArticleContainer = document.querySelectorAll('[target-game-item]')

  for (const articleContainer of allArticleContainer) {
    const targetGameItem = articleContainer.getAttribute('target-game-item')
    const button = document.createElement('button')
    articleContainer.appendChild(button)
    button.addEventListener('click', () => openNewGame(targetGameItem), false)
    button.classList.add('play')
  }

  function openNewGame (targetGameItem) {
    closeCurrentGame()

    const embed = document.createElement('embed')
    mainEmbedContainer.appendChild(embed)
    embed.classList.add('media')
    onResizeWindow()
    embed.type = 'application/x-shockwave-flash'
    embed.src = '../media/swf/' + targetGameItem

    const close = document.createElement('button')
    mainEmbedContainer.appendChild(close)
    close.textContent = 'đóng'
    close.addEventListener('click', closeCurrentGame, false)
    close.classList.add('close')
  }

  function closeCurrentGame () {
    mainEmbedContainer.textContent = ''
  }
}).call(window, window)
