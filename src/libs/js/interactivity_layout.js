import { getLanguageLocalStorage } from './translate_layout.js'

const createMessage = ({ elementCreate, elementTarget, elementClass = '', text = '', add = null, remove = null } = {}) => {

    const multipleValidation = 
    (typeof elementTarget !== 'string' && !Array.isArray(elementTarget)) || 
    (Array.isArray(elementTarget) && elementTarget.some(item => typeof item !== 'string' || item === '')) || 
    (typeof elementTarget === 'string' && elementTarget === '')

    if (add) {
        if (typeof elementCreate !== 'string' || elementCreate === '') {
            return console.error('Parameter "element" needs to be a non-empty string to create elements...')
        }  
        if (multipleValidation) {
            return console.error('Parameter "elementTarget" needs to be a non-empty string...')
        }
        if (!elementTarget.startsWith('#') && !elementTarget.startsWith('.')) {
            return console.error('Parameter "elementTarget" should be an ID (starting with "#") or a class (starting with ".")')
        }    
    }

    const container = document.querySelector('.container')
    const popupmessage = document.createElement(elementCreate)
    popupmessage.textContent = text

    if (Array.isArray(elementClass)) {
        popupmessage.classList.add(...elementClass)
    } else if (elementClass) {
        popupmessage.classList.add(elementClass)
    }

    if (add) {
        return container.querySelector(elementTarget).appendChild(popupmessage)
    } else if (remove) {
        if (multipleValidation) {
            return console.error('Parameter "elementTarget" needs especificed to remove an element')
        }

        if (Array.isArray(elementTarget)) {
            elementTarget.forEach(item => {
                const remove = container.querySelectorAll(item)
                if (remove) { 
                    remove.forEach(removeFiltered => {
                        removeFiltered.remove()
                    })
                }
            })
        } else if (elementTarget) {
            const remove = container.querySelector(elementTarget)
            if (remove) { return remove.remove() }
        }
    }

    //Temporary remove to pop-up messages
    setTimeout(() => {
        createMessage({elementTarget: '.message-pop-up.valid', remove: true})
    }, 6500)
}

const accentColors = (type, elements, classE) => {
    const container = document.querySelector('.container')
    const elementAccentColor = container.querySelectorAll(elements)
    switch (type) {
        case 'add':
            elementAccentColor.forEach(item => {
                item.classList.add(classE)
            })
            break
        case 'remove':
            elementAccentColor.forEach(item => {
                item.classList.remove(classE)
            })
            break
    }
}

const clearFields = (elements) => {
    if (elements) {
        elements.forEach(item => { item.value = '' })
    }
}

const checkClass = (elements) => {
    if (elements) {
        return true
    } else {
        return false
    }
}

const iconChange = (iconFa, oldClass, newClass) => {
    try {
        if (!(iconFa instanceof Element)) {throw new Error(`Element ${iconFa} is not a DOM element. DOM element is necessary.`)}
        if (!iconFa.classList.contains('icon')) {throw new Error(`Element ${iconFa} needs a 'icon' class.`)}

        if (Array.isArray(oldClass) && Array.isArray(newClass)) {
            iconFa.classList.remove(...oldClass)
            iconFa.classList.add(...newClass)
        } else {
            iconFa.classList.remove(oldClass)
            iconFa.classList.add(newClass)
        }
    } catch (error) {
        console.error('Somethin was wrong: ', error.message)
    }
}

const toggleAtribute = (element, atribute) => {
    if (!element) { throw new Error(`The parameter 'element' is null. Parameter required`) }
    if (!atribute) { throw new Error(`The parameter 'atribute' is null. Parameter required`) }

    if (element.hasAttribute(atribute)) {
        element.removeAttribute(atribute)
    } else {
        element.setAttribute(atribute, "")
    }
}

const setPlaceholder = (element, ptVersion, enVersion) => {
    const localStorageLanguage = getLanguageLocalStorage()

    if (element) {
        element.setAttribute(
            'placeholder',
            localStorageLanguage === 'pt' ? ptVersion : enVersion
        )
    } else {
        console.error('Parameter (element) is necessary!')
    }
}

const loader = (action) => {
    const container = document.querySelector('.container')
    const body = document.querySelector('body')
    const footer = container.querySelector('.footer')

    const loader = {
        show() {
            const loader = document.createElement('div')
            const spinner = document.createElement('div')

            loader.classList.add('loader')
            loader.classList.add(localStorage.theme === 'dark' ? 'dark' : 'light')
            spinner.classList.add('loader-spinner')

            loader.appendChild(spinner)
            footer?.classList.add('hide')
            body.style.overflowY = 'hidden'
            body.appendChild(loader)
        },
        hide() {
            const loader = document.querySelector('.loader')
            if (loader) {
                body.style.overflowY = 'auto'
                footer?.classList.remove('hide')
                loader.remove()
            }
        }
    }

    if (loader[action]) {
        return loader[action]()
    } else {
        return console.error('Loader: Method not found...')
    }
}

const customTitle = (element, ptVersion, enVersion) => {
    const elements = document.querySelectorAll('[custom-title]')
    const localStorageLanguage = getLanguageLocalStorage()

    if (window.innerWidth <= 600) {
        const tooltipRemove = document.querySelector('div.custom-title')
        return tooltipRemove.remove()
    }

    if (typeof ptVersion === 'string' || typeof enVersion === 'string') {
        return element.setAttribute('custom-title', localStorageLanguage === 'pt' ? ptVersion : enVersion)
    }

    const positionTooltip = (e, tooltip) => {
        const tooltipWidth = tooltip.offsetWidth
        const tooltipHeight = tooltip.offsetHeight

        let left = e.target.offsetLeft - 75
        let top = e.target.offsetTop + 50

        if (left + tooltipWidth > window.innerWidth) {
            left = window.innerWidth - tooltipWidth - 10
        }
        if (top + tooltipHeight > window.innerHeight) {
            top = window.innerHeight - tooltipHeight - 10
        }

        tooltip.style.left = `${left}px`
        tooltip.style.top = `${top}px`
    }

    const ensureTooltipExists = () => {
        let customTitleElement = document.querySelector('div.custom-title')
        !customTitleElement && (customTitleElement = createTitle())
        return customTitleElement
    }

    const createTitle = () => {
        const tooltip = document.createElement('div')
        tooltip.className = 'custom-title'
        document.body.appendChild(tooltip) 
    }
 
    if (elements) {
        let customTitleElement = ensureTooltipExists() 

        elements.forEach(dom => {
            dom.addEventListener('mouseenter', (e) => {
                customTitleElement = ensureTooltipExists() 
                customTitleElement.textContent = dom.getAttribute('custom-title')
                customTitleElement.classList.add('show')
                positionTooltip(e, customTitleElement)
            })
            dom.addEventListener('mouseleave', (e) => {  
                customTitleElement.classList.remove('show')
            })
        })
    }
}

export { createMessage, accentColors, clearFields, checkClass, iconChange, toggleAtribute, setPlaceholder, loader, customTitle }