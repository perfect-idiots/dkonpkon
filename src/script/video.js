(function (window) {
  'use strict'
  const {document, mediaCommonAction} = window
  const subpage = document.documentElement.getAttribute('subpage-name')
  mediaCommonAction('video', 'video/mp4', '../media/video/' + subpage, {onOpenMedia})

  function onOpenMedia ({player}) {
    player.controls = player.autoplay = true
  }
}).call(window, window)
