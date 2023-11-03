const colorsDisplay = document.getElementById('colors')
const colorInput = document.getElementById('colorInput')
const typeInput = document.getElementById('typeInput')
const codeInput = document.getElementById('codeInput')

const colorError = document.getElementById('colorError')
const codeError = document.getElementById('codeError')

let cookies = getCookiesJSON()
if (cookies !== undefined) {
    let colors = JSON.parse(cookies['colors'])
    for (const savedColor of colors) {
        addColor(savedColor)
    }
} else
    colors = []

function Color(name, type, code) {
    this.name = name
    this.type = type
    this.code = code
}

function addColor(color) {
    let colorMain = document.createElement('div')
    colorMain.classList.add('color-main')
    colorsDisplay.appendChild(colorMain)
    switch (color.type) {
        case 'rgb':
            colorMain.style.backgroundColor = `rgb(${color.code})`;
            break;
        case 'rgba':
            colorMain.style.backgroundColor = `rgba(${color.code})`;
            break;
        case 'hex':
            colorMain.style.backgroundColor = color.code
    }
    let colorLabel = document.createElement('div')
    colorLabel.classList.add('color-label')
    colorMain.appendChild(colorLabel)

    let colorHead = document.createElement('h4')
    colorHead.classList.add('text')
    colorHead.appendChild(document.createTextNode(color.name))
    colorLabel.appendChild(colorHead)

    let colorType = document.createElement('p')
    colorType.classList.add('text')
    colorType.appendChild(document.createTextNode(color.type.toUpperCase()))
    colorLabel.appendChild(colorType)

    let colorCode = document.createElement('p')
    colorCode.classList.add('text')
    colorCode.classList.add('bold')
    colorCode.appendChild(document.createTextNode(color.code))
    colorLabel.appendChild(colorCode)
}

function addColorForm(event) {
    event.preventDefault()
    colorError.innerHTML = codeError.innerHTML = ''

    if (!/^[a-zA-Z]+$/.test(colorInput.value)) {
        colorError.innerHTML = 'Only letters available'
        return
    }
    for (const color of colors) {
        if (color.name === colorInput.value) {
            colorError.innerHTML = 'This name is already used'
            return
        }
    }

    switch (typeInput.value) {
        case 'rgb': {
            if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*,\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*,\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(codeInput.value)) {
                codeError.innerHTML = 'RGB code must match the pattern [0-255], [0-255], [0-255]'
                return
            }
            break;
        }
        case 'rgba': {
            if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*,\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*,\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*,\s*(?:1|0\.\d{1,2})$/.test(codeInput.value)) {
                codeError.innerHTML = 'RGBA code must match the pattern [0-255], [0-255], [0-255], [0.00-1.00]'
                return
            }
            break;
        }
        case 'hex': {
            if (!/^#([0-9A-Fa-f]{6})$/.test(codeInput.value)) {
                codeError.innerHTML = 'HEX code must match the pattern #[000000-FFFFFF]'
                return
            }
        }
    }

    let newColor = new Color(colorInput.value, typeInput.value, codeInput.value)
    colors.push(newColor)
    addColor(newColor)
    let expire = new Date()
    expire.setHours(expire.getHours() + 3)
    document.cookie = `colors=${JSON.stringify(colors)};expires=${expire.toUTCString()};`
    colorInput.value = codeInput.value = ''
}

function getCookiesJSON() {
    let cookies = document.cookie.split(';')
    if (cookies[0] === '')
        return undefined
    let json = {}
    for (const element of cookies) {
        let tmp = element.split('=')
        json[tmp[0]] = tmp[1]
    }
    return json
}

function deleteColors() {
    colorsDisplay.innerHTML = ''
    document.cookie = 'colors=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
}