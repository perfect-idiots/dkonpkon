(function (window) {
  'use strict'
  const {document} = window

  document.addEventListener('DOMContentLoaded', onDocumentReady, false)

  function onDocumentReady () {
    document.body.classList.add('ready-for-transition')
  }
}).call(window, window)
