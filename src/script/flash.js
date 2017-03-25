(function (window) {
  'use strict'
  const {document, polyfill, mediaCommonAction} = window
  const {fullscreen} = polyfill
  mediaCommonAction('embed', 'application/x-shockwave-flash', '../media/swf', {onOpenMedia})

  const toggleFullscreenMode = element =>
    fullscreen.element() ? fullscreen.request(element) : fullscreen.exit()

  function onOpenMedia ({mediaContainer, controller}) {
    const fullscreenButton = document.createElement('button')
    controller.insertBefore(fullscreenButton, controller.firstChild)
    fullscreenButton.addEventListener('click', () => toggleFullscreenMode(mediaContainer), false)
    fullscreenButton.classList.add('fullscreen-button')
  }
}).call(window, window)
