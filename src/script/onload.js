(function (window) {
  'use strict'
  const {document} = window

  document.addEventListener('DOMContentLoaded', onDocumentReady, false)

  function onDocumentReady () {
    const mainSection = document.getElementById('main-section')
    const menuVisibilityCheckbox = document.getElementById('menu-visibility-checkbox')

    document.body.classList.add('ready-for-transition')
    document.documentElement.classList.add('javascript-enabled')

    menuVisibilityCheckbox.addEventListener(
      'change',
      () =>
        window.lib.dom.attribute.boolean(mainSection, 'disabled', menuVisibilityCheckbox.checked),
      false
    )
  }
}).call(window, window)
