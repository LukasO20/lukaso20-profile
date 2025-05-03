import { handleTranslate } from './translate_layout.js'
import { getLanguageLocalStorage } from './translate_layout.js'
import { loader, customTitle } from './interactivity_layout.js'

// -- RESUME FUNCTIONS --
const documentbody = document.body
const buttonresumeDownload = documentbody.querySelector('.resume-page-body .download')
const buttonresumeLanguage = documentbody.querySelector('.resume-page-body .translate--content')
const language = getLanguageLocalStorage()

buttonresumeDownload.addEventListener('click', function(){
    downloadArchive()
})

function downloadArchive () {
    const link = document.createElement('a')
    link.href = `../doc/resume-${language}.pdf`;
    link.download = 'Lucas_Oliveira_resume'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

//TRANSLATE (PT-EN)
window.addEventListener('load', () => {
    loader('show')

    customTitle(buttonresumeDownload, 'Baixar currículo', 'Download resume')
    customTitle(buttonresumeLanguage, 'Alterar idioma para Inglês', 'Change language to Portuguese')

    setTimeout(function () {
        handleTranslate('resumePage')
    }, 500)

    setTimeout(function () {
        loader('hide')
    }, 1500)
})