import { sendEmail } from './api/email_provider/actions.js'
import { iconChange } from './libs/js/interactivity_layout.js'

const documentbody = document.body

const renderPage = (route) => {
    const container = document.getElementById('container-content')
    const page = `pages/${route}.html`
    fetch(page)
        .then(response => response.text())
        .then(html => container.innerHTML = html)
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
        sendEmail(formData)
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