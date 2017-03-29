(function (window) {
  'use strict'
  const {document} = window

  document.addEventListener('DOMContentLoaded', onDocumentReady, false)

  function onDocumentReady () {
    document.body.classList.add('ready-for-transition')
    document.documentElement.classList.add('javascript-enabled')
  }
}).call(window, window)
