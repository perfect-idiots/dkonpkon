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

  function mediaCommonAction (tagName, type, directory, callback) {
    const {document} = window
    const mediaContainer = document.querySelector('.media-container')
    const allArticleContainer = document.querySelectorAll('[target-game-item]')

    const {
      onEachIteration = () => {},
      onOpenMedia = () => {},
      onCloseMedia = () => {}
    } = callback || {}

    for (const articleContainer of allArticleContainer) {
      const targetGameItem = articleContainer.getAttribute('target-game-item')
      const button = document.createElement('button')
      articleContainer.appendChild(button)
      button.addEventListener('click', () => openNewGame(targetGameItem), false)
      button.classList.add('play')
      onEachIteration({articleContainer, targetGameItem, button})
    }

    function openNewGame (targetGameItem) {
      closeCurrentGame()

      const player = document.createElement(tagName)
      mediaContainer.appendChild(player)
      player.classList.add('media')
      onResizeWindow()
      player.type = type
      player.src = directory + '/' + targetGameItem

      const controller = document.createElement('div')
      controller.classList.add('controller')

      const close = document.createElement('button')
      mediaContainer.appendChild(close)
      close.addEventListener('click', closeCurrentGame, false)
      close.classList.add('close')

      onOpenMedia({targetGameItem, player, controller, close})
    }

    function closeCurrentGame () {
      mediaContainer.textContent = ''
      onCloseMedia({mediaContainer})
    }
  }
})(window, window)
