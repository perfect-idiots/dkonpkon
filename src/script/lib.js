(function (window) {
  const {defineProperty} = Object
  const defineConst = (object, name, value) => defineProperty(object, name, {value, writable: false})

  const out = {
    onResizeWindow () {
      const mediaElement = document.querySelector('.media')
      if (!mediaElement) return
      mediaElement.width = window.innerWidth
      mediaElement.height = window.innerHeight
    }
  }

  for (const name in out) {
    defineConst(window, name, out[name])
  }
})(window, window)
