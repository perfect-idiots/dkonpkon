(function (window) {
  const {defineProperty} = Object
  const defineConst = (object, name, value) => defineProperty(object, name, {value, writable: false})

  const out = {
    onResizeWindow,
    mediaCommonAction
  }

  for (const name in out) {
    defineConst(window, name, out[name])
  }

  function onResizeWindow () {
    const mediaElement = document.querySelector('.media')
    if (!mediaElement) return
    mediaElement.width = window.innerWidth
    mediaElement.height = window.innerHeight
  }

  function mediaCommonAction (tagName, type, directory) {
    const {document} = window
    const mainEmbedContainer = document.querySelector('.media-container')
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

      const player = document.createElement(tagName)
      mainEmbedContainer.appendChild(player)
      player.classList.add('media')
      onResizeWindow()
      player.type = type
      player.src = directory + '/' + targetGameItem

      const close = document.createElement('button')
      mainEmbedContainer.appendChild(close)
      close.textContent = 'đóng'
      close.addEventListener('click', closeCurrentGame, false)
      close.classList.add('close')
    }

    function closeCurrentGame () {
      mainEmbedContainer.textContent = ''
    }
  }
})(window, window)
