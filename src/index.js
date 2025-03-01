import { sendEmailAction } from './js/actions.js'
import { iconChange } from './js/interactivity_layout.js'
import { translate } from './js/translate_layout.js'

const documentbody = document.body

const renderPage = (route) => {
    const container = document.getElementById('container-content')
    const page = `pages/${route}.html`
    fetch(page)
        .then(response => response.text())
        .then(html => container.innerHTML = html)
        .then(handleTranslate)
        .catch(error => {
            console.log('Error loading page: ', error)
            container.innerHTML = `<div class="message alert">
                    <img src="libs/icon/logo-dark-mode.svg" alt="logo">
                    <h1>404 - Page not found :[</h1>
                </div>`
            throw error
        })
}

const handleRouteChange = (route) => {
    // Update history to navegator
    const currentState = history.state?.route;
    if (currentState !== route) {
        history.pushState({ route }, '', `#${route}`);
    }
}

const handleIconChange = (header, iconChangeIcon) => {
    if (iconChangeIcon && header) {
        if (header.classList.contains('expand')) {
            iconChange(iconChangeIcon, 'fa-bars', 'fa-circle-xmark')
        } else {
            iconChange(iconChangeIcon, 'fa-circle-xmark', 'fa-bars')
        }
    }
}

const handleTranslate = () => {
    return // FUNCTION PAUSE ON PRODUCTION ENVIRONMENT
    const contentFrom = documentbody.querySelector('.container')
    const typeContentFrom = contentFrom.querySelector('main')

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

    translate(getContent, getDOMElement)
}

const linkManipulate = document.querySelectorAll('.link-page')
const linkPage = documentbody
const header = documentbody.querySelector('.header')
const iconChangeIcon = documentbody.querySelector('.menu--bar .icon')       

linkPage.addEventListener('click', function (e) {
    const link = e.target.closest('.link-page')

    if (link) {
        if (link.matches('.link-page')) {
            linkManipulate.forEach(e => {
                e.classList.remove('active')   

                //manipulated class of navbar button when link event is external 
                e.classList.toggle('active', e.getAttribute('href') === link.getAttribute('href'))
            })
            link.classList.add('active')
            header.classList.remove('expand')
            handleIconChange(header, iconChangeIcon)

            const route = link.getAttribute('href').replace('#', '')
            handleRouteChange(route)
        }
    }
})

window.addEventListener('popstate', (e) => {
    const route = e.state?.route || history.state?.route || 'home'
    renderPage(route)
})

window.addEventListener('load', () => {
    const route = location.hash.replace('#', '') || 'home'
    renderPage(route)

    const year = new Date().getFullYear()
    const yearElement = documentbody.querySelector('.footer--info .info--info-left span')
    yearElement.innerHTML = year
})

const buttonSendEmail = documentbody
buttonSendEmail.addEventListener('click', function (e) {
    const filter = e.target.closest('.send-email') || e.target.classList.contains('send-email')
    const formEmail = document.getElementById('emailForm')

    if (filter) {
        const formData = {
            name: formEmail.name.value || null,
            email: formEmail.email.value || null,
            message: formEmail.message.value || null
        }
        sendEmailAction(formData)
    }
})

const buttonExpandHeader = documentbody
buttonExpandHeader.addEventListener('click', function (e) {
    const filter = e.target.closest('.menu--bar') || e.target.classList.contains('menu--bar')

    if (filter) {
        header.classList.toggle('expand')
        handleIconChange(header, iconChangeIcon)
    }
})

const buttonTranslate = documentbody.querySelector('.translate--content')
buttonTranslate.addEventListener('click', function () {
    handleTranslate()
})


//PRODUCTION ENVIRONMENT (USED TO HANDLE ELEMENTS ON PRODUCTION MODE (WILL BE REMOVED SOON))
const handleProductionEnvironment = () => {
    const removeElement = documentbody.querySelector('.translate--content')
    removeElement.remove()
}
handleProductionEnvironment()