(function (window) {
  'use strict'
  const {document} = window
  const allArticleContainer = document.querySelectorAll('[target-game-item]')

  for (const articleContainer of allArticleContainer) {
    const button = document.createElement('button')
    articleContainer.appendChild(button)
    button.textContent = 'chơi ngay'
    button.addEventListener('click', onClickPlayNow, false)
  }

  function onClickPlayNow () {}
}).call(window, window)
