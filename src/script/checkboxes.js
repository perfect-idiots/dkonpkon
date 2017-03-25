(function (window) {
  'use strict'
  const {document} = window
  const {body} = document
  const allZoomOutRadio = document.querySelectorAll('.zoom-out-radio')
  const allZoomInRadio = document.querySelectorAll('.zoom-in-radio')

  const onZoomOutChecked = target =>
    () => target.checked && body.classList.remove('zero-scrollbar')

  const onZoomInChecked = target =>
    () => target.checked && body.classList.add('zero-scrollbar')

  makeZoomRadio(allZoomOutRadio, onZoomOutChecked)
  makeZoomRadio(allZoomInRadio, onZoomInChecked)

  function makeZoomRadio (targetlist, ...handle) {
    for (const target of targetlist) {
      for (const fn of handle) {
        target.addEventListener('change', fn(target), false)
      }
    }
  }
}).call(window, window)
