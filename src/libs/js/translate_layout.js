// variables
const documentbody = document.body
const buttonTranslate = documentbody.querySelector('.translate--content')

// change language
buttonTranslate.addEventListener('click', function () {
    const lang = this.getAttribute('lang')
    setLanguageLocalStorage(lang), handleTranslate()

    location.reload()
})

const translate = (e, type) => {
    let translate = e

    if (!translate) { throw new Error('Parameter translate(e) is null. Please, insert a value.')}
    if (!type) { throw new Error('Parameter type is null. Please, insert a value.')}

    if (!Array.isArray(translate)) {
        translate = []
        translate.push(e)
    }

    const translateContent = [...translate][0]
    const localStorageLanguage = getLanguageLocalStorage()

    try {
        fetch(`json/${localStorageLanguage}_version_website.json`)
        .then(response => response.json())
        .then(data => {
            type.forEach(type => {
                const translateContentJSON = data[type] 
                translateContent[type].forEach((typeDOM, index) => {
                    const typeJSON = translateContentJSON[index]
                    if (typeJSON) {
                        typeDOM.textContent = typeJSON
                    }
                    console.log('TYPE DOM - ', typeDOM)
                })
            })
            console.log('DATA FROM JSON PT - ', data)

        }).then(data => {
            const textButtonTranslate = buttonTranslate.querySelector('.translate--text')
            
            textButtonTranslate.textContent = localStorageLanguage === 'pt' ? 'EN' : 'PT'
            buttonTranslate.setAttribute('lang', localStorageLanguage === 'pt' ? 'en' : 'pt')
            defineLangHTML()
        })
        .catch(error => console.error('Error during load json archive: ', error))

    } catch (error) {
        throw new Error('Ops! Something got wrong during translation... ', error)       
    }
    
    console.log('TRANSLATE CONTENT - ', translateContent, ' TYPE - ', type)
}

const setLanguageLocalStorage = (lang) => {
    if (!lang || typeof lang !== 'string') {
        throw new Error(`The parameter lang is ${lang}. A string value (pt/en) is needed to set a language.`)
    }

    if (lang) {
        localStorage.languageLayout = lang
    }
}

const getLanguageLocalStorage = () => {
    if (!localStorage.languageLayout) {
        localStorage.setItem('languageLayout', 'en')
        return
    }

    return localStorage.languageLayout
}

const defineLangHTML = () => {
    if (localStorage.languageLayout) {
        document.documentElement.lang = localStorage.languageLayout === 'pt' ? 'pt-BR' : 'en'
    }
}

const handleTranslate = () => {
    const contentFrom = documentbody.querySelector('.container')

    // This object structure (getContent) is basis on json archives (en_version_website and pt_version_website)
    const dynamicProperty = contentFrom.querySelector('.main').getAttribute('type')
    if (!dynamicProperty) { throw new Error('The "getContent" object property: dynamicProperty is undefined') }

    const getContent = {
        header: contentFrom.querySelectorAll('.header [lang]'),
        [dynamicProperty]: contentFrom.querySelectorAll('.main [lang]'),
        footer: contentFrom.querySelectorAll('.footer [lang]')
    }

    const getDOMElement = [
        'header', 
        `${[dynamicProperty]}`,
        'footer' 
    ]

    getLanguageLocalStorage()
    translate(getContent, getDOMElement)
}

export { translate, handleTranslate, setLanguageLocalStorage, getLanguageLocalStorage, defineLangHTML }