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

export { createMessage, accentColors, clearFields, checkClass, iconChange }