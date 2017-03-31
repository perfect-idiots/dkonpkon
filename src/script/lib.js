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

  const dashToCamel = string => {
    const [first, ...rest] = String(string).split('-')
    return first + rest.map(capitalize).join('')
  }

  const camelToDash = string => Array.from(String(string))
    .map(x => x < 'A' || x > 'Z' ? x : '-' + x.toLowerCase())
    .join('')

  const capitalize = string => {
    const [first, ...rest] = String(string)
    return first.toUpperCase() + rest.join('')
  }

  const parseHashObject = hash => String(hash)
    .slice(1)
    .split('&')
    .map(pair => pair.split('='))
    .reduce((prev, [key, val]) => assign({[dashToCamel(key)]: val}, prev), {})

  const stringifyHashObject = object => {
    const buffer = []
    for (const key in object) {
      const value = object[key]
      new Set([undefined, null, '']).has(value) || buffer.push(camelToDash(key) + '=' + value)
    }
    return '#' + buffer.join('&')
  }

  const newFirstChild = (parent, child) =>
    parent.insertBefore(child, parent.firstChild)

  const attribute = {
    string (element, name, value) {
      value
        ? element.setAttribute(name, value)
        : element.removeAttribute(name)
    },
    boolean (element, name, value) {
      attribute.string(element, name, value && name)
    }
  }

  const diacritic = {
    a: 'áàảãạăắằẳẵặâấầẩẫậ',
    d: 'đ',
    e: 'éèẻẽẹêếềểễệ',
    i: 'íìỉĩị',
    o: 'óòỏõọôốồổỗộơờởỡợ',
    u: 'úùủũụưứừửữự',
    y: 'ýỳỷỹỵ'
  }
  for (const nonDiaChar in diacritic) {
    diacritic[nonDiaChar.toUpperCase()] = diacritic[nonDiaChar].toUpperCase()
  }

  const reverseDiacritic = {}
  for (const nonDiaChar in diacritic) {
    for (const diaChar of diacritic[nonDiaChar]) {
      reverseDiacritic[diaChar] = nonDiaChar
    }
  }

  const getNonDiaStr = diaString =>
    Array.from(diaString).map(diaChar => reverseDiacritic[diaChar] || diaChar).join('')

  const notSubStr = (container, substring) => container.indexOf(substring) === -1

  const lib = freeze({
    donothing,
    onResizeWindow,
    mediaCommonAction,
    dom: freeze({newFirstChild, attribute}),
    urlParser: {parseHashObject, stringifyHashObject},
    polyfill: freeze({fullscreen}),
    search: freeze({
      check (content, text) {
        return notSubStr(content, text) && notSubStr(getNonDiaStr(content), text)
      }
    }),
    utils: freeze({
      dashToCamel,
      capitalize,
      diacritic: freeze({
        table: diacritic,
        reverse: reverseDiacritic,
        convert: getNonDiaStr
      }),
      notSubStr
    })
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
      close.addEventListener('click', fullscreen.exit, false)
      close.classList.add('close-button')

      onOpenMedia({targetGameItem, mediaContainer, player, controller, close})
    }

    function closeCurrentGame () {
      mediaContainer.textContent = ''
      onCloseMedia({mediaContainer})
    }
  }
})(window, window)
