(function (window) {
  const {defineProperty, assign} = Object
  const defineConst = (object, name, value) => defineProperty(object, name, {value, writable})

  const out = {
    onResizeWindow () {
      const mediaElement = document.querySelector('.media')
      if (!mediaElement) return
      mediaElement.width = window.innerWidth
      mediaElement.height = window.innerHeight
    },

    get fromLibJs () {
      return assign({}, out)
    }
  }

  for (const name in out) {
    defineConst(window, name, out[name])
  }
})(window, window)
