import { setPlaceholder, customTitle } from './interactivity_layout.js'

// variables
const documentbody = document.body
const buttonTranslate = documentbody.querySelector('.translate--content')

// change language
buttonTranslate.addEventListener('click', function () {
    const lang = this.getAttribute('lang')
    const toPage = this.getAttribute('toPage')
    setLanguageLocalStorage(lang), handleTranslate(toPage)

    location.reload()
})

const translate = (e, type, page) => {
    let translate = e

    if (!translate) { throw new Error('Parameter translate(e) is null. Please, insert a value.')}
    if (!type) { throw new Error('Parameter type is null. Please, insert a value.')}
    if (!page && page !== '') { throw new Error('Parameter page is null. Please, insert a value.') }

    if (!Array.isArray(translate)) {
        translate = []
        translate.push(e)
    }

    const translateContent = [...translate][0]
    const localStorageLanguage = getLanguageLocalStorage()
    const url = `${page === 'mainPage' ? 
        'json/' + localStorageLanguage + '_version_website.json' :
        //'/public/json/resume_' + localStorageLanguage + '.json'}` //Choose this if it development version
        '/json/resume_' + localStorageLanguage + '.json'}` //Choose this if it production version

    try {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            type.forEach(type => {
                const translateContentJSON = data[type] 
                translateContent[type].forEach((typeDOM, index) => {
                    const typeJSON = translateContentJSON[index]
                    if (typeJSON) {
                        typeDOM.textContent = typeJSON
                    }
                })

                //Specific implementations besides elements
                const genericType = type
                switch (genericType) {
                    case 'contact':
                        const inputName = documentbody.querySelector('#name')
                        const inputEmail = documentbody.querySelector('#email')
                        const textarea = documentbody.querySelector('textarea[name="message"]')
                        
                        setPlaceholder(inputName, 'Digite seu nome aqui', 'Type your name here')
                        setPlaceholder(inputEmail, 'Digite seu email aqui', 'Type your email here')
                        setPlaceholder(textarea, 'Digite sua mensagem aqui', 'Type your message here')
                        break
                    case 'home':
                        const themeLocalStorage = localStorage.theme
                        const buttonLanguage = documentbody.querySelector('.translate--content')
                        const buttonTheme = documentbody.querySelector('.theme--title')

                        customTitle(buttonLanguage, 'Alterar idioma para Inglês', 'Change language to Portuguese')
                        customTitle(buttonTheme, `Alterar tema para modo ${themeLocalStorage === 'dark' ? 'claro' : 'escuro'}`, `Change theme to ${themeLocalStorage === 'dark' ? 'light' : 'dark'} mode`)
                }
            })

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

const toPage = (page, contentFrom, dynamicProperty) => {
    if (!page || !page === '' && (!contentFrom || contentFrom === '')) { throw new Error(`The parameter "${!page ? 'page' : 'contentFrom'}" is undefined. Is necessary set a ${!page ? 'name' : 'DOM'} value.`) }
 
     // This object structure is basis on json archives (en_version_website and pt_version_website)
    if (!dynamicProperty && page === 'mainPage') { throw new Error('The "getContent" object property: dynamicProperty is undefined') }

    switch (page) {
        case 'mainPage':
            return {
                header: contentFrom.querySelectorAll('.header [lang]'),
                [dynamicProperty]: contentFrom.querySelectorAll('.main [lang]'),
                footer: contentFrom.querySelectorAll('.footer [lang]'),
            } 
        case 'resumePage':
            return {   
                header: contentFrom.querySelectorAll('.header [lang]'),
                article: contentFrom.querySelectorAll('.article [lang]'),
                section: contentFrom.querySelectorAll('.section [lang]')
            }
    }
}

const handleTranslate = (page) => {
    const contentFrom = documentbody.querySelector('.container')
    const dynamicProperty = contentFrom.querySelector('.main').getAttribute('type')

    const getContent = toPage(page, contentFrom, dynamicProperty)
    const getDOMElement =  Object.keys(toPage(page, contentFrom, dynamicProperty))

    getLanguageLocalStorage()
    translate(getContent, getDOMElement, page)
}

export { translate, handleTranslate, setLanguageLocalStorage, getLanguageLocalStorage, defineLangHTML }