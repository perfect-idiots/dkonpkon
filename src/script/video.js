(function (window) {
  'use strict'
  const {document, polyfill, mediaCommonAction} = window
  const {fullscreen} = polyfill
  const subpage = document.documentElement.getAttribute('subpage-name')
  mediaCommonAction('video', 'video/mp4', '../media/video/' + subpage, {onOpenMedia})

  function onOpenMedia ({player, close}) {
    setTimeout(() => player.play(), 500)
    player.controls = player.autoplay = true
    close.addEventListener('click', fullscreen.exit, false)
  }
}).call(window, window)
