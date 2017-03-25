(function (window) {
  const {defineProperty, freeze, assign} = Object
  const {document} = window
  const defineConst = (object, name, value) => defineProperty(object, name, {value, writable: false})
  const donothing = () => {}

  const fullscreen = {}
  if (document.fullscreenEnabled) {
    assign(fullscreen, {
      enabled: true,
      prefix: null,
      element: () => document.fullscreenElement,
      request: element => element.requestFullscreen(),
      exit: () => document.exitFullscreen()
    })
  } else if (document.webkitFullscreenEnabled) {
    assign(fullscreen, {
      enabled: true,
      prefix: 'webkit',
      element: () => document.webkitFullscreenElement,
      request: element => element.webkitRequestFullscreen(),
      exit: () => document.webkitExitFullscreen()
    })
  } else if (document.mozFullscreenEnabled) {
    assign(fullscreen, {
      enabled: true,
      prefix: 'moz',
      element: () => document.mozFullscreenElement,
      request: element => element.mozRequestFullscreen(),
      exit: () => document.mozExitFullscreen()
    })
  } else {
    const enabled = false
    const prefix = null
    const element = donothing
    const request = donothing
    const exit = donothing
    assign(fullscreen, {enabled, prefix, element, request, exit})
  }
  freeze(fullscreen)

  const lib = freeze({
    donothing,
    onResizeWindow,
    mediaCommonAction,
    dom: freeze({newFirstChild}),
    polyfill: freeze({fullscreen})
  })

  for (const name in lib) {
    defineConst(window, name, lib[name])
  }

  defineConst(window, 'lib', lib)

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
      onEachIteration = donothing,
      onOpenMedia = donothing,
      onCloseMedia = donothing
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
      mediaContainer.appendChild(controller)
      controller.classList.add('controller')

      const close = document.createElement('button')
      controller.appendChild(close)
      close.addEventListener('click', closeCurrentGame, false)
      close.classList.add('close')

      onOpenMedia({targetGameItem, mediaContainer, player, controller, close})
    }

    function closeCurrentGame () {
      mediaContainer.textContent = ''
      onCloseMedia({mediaContainer})
    }

    function newFirstChild (parent, child) {
      parent.insertBefore(child, parent.firstChild)
    }
  }
})(window, window)
