import { handleTranslate } from './translate_layout.js'
import { getLanguageLocalStorage } from './translate_layout.js'
import { loader } from './interactivity_layout.js'

// -- RESUME FUNCTIONS --
const resume = $('.resume-page-body .download')

resume.on('click', function(){
    downloadArchive()
})

function downloadArchive () {
    const link = document.createElement('a')
    const language = getLanguageLocalStorage()
    link.href = `../doc/resume-${language}.pdf`;
    link.download = 'Lucas_Oliveira_resume'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

//TRANSLATE (PT-EN)
window.addEventListener('load', () => {
    loader('show')
    
    setTimeout(function () {
        handleTranslate('resumePage')
    }, 500)

    setTimeout(function () {
        loader('hide')
    }, 1500)
})