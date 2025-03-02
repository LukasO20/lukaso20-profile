// variables
const documentbody = document.body

const translate = (e, type) => {
    //OS ELEMENTOS DE ATRIBUTO lang serão agrupados em um array
    //O array irá percorrer elementos de acordo com o index e efetuará a tradução

    //com elementos de atributo lang juntos em um array, evitará qualquer tipo de erro caso novos elementos sejam adicionados na tela
    let translate = e

    if (!translate) { throw new Error('Parameter translate(e) is null. Please, insert a value.')}
    if (!type) { throw new Error('Parameter type is null. Please, insert a value.')}

    if (!Array.isArray(translate)) {
        translate = []
        translate.push(e)
    }

    const translateContent = [...translate][0]

    try {
        fetch('json/pt_version_website.json')
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
        })
        .catch(error => console.error('Error during load json archive: ', error))

    } catch (error) {
        throw new Error('Ops! Something got wrong during translation... ', error)       
    }
    
    console.log('TRANSLATE CONTENT - ', translateContent, ' TYPE - ', type)
}

const setLanguageLocalStorage = (lang, element) => {
    if (lang && element) {
        localStorage.languageLayout = element.setAttribute('lang', lang)
    } else if (!element) {
        throw new Error(`The parameter element: ${element} is not a DOM element. A DOM element is needed.`)
    }
}

const getLanguageLocalStorage = (lang, element) => {
    if (!localStorage.languageLayout) {
        localStorage.setItem('languageLayout', 'en')
    }

    if (lang && element) {
        localStorage.languageLayout = element.setAttribute('lang', lang)
    }
}

// change language
const buttonTranslate = documentbody.querySelector('.translate--content')
buttonTranslate.addEventListener('click', function () {
    handleTranslate()
})

const handleTranslate = () => {
    //return // FUNCTION PAUSE ON PRODUCTION ENVIRONMENT
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

export { translate, handleTranslate, setLanguageLocalStorage, getLanguageLocalStorage }