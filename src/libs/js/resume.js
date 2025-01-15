// -- RESUME FUNCTIONS --
const resume = $('.resume-page-body .download')

resume.on('click', function(){
    downloadArchive()
})

function downloadArchive () {
    const link = document.createElement('a')
    const language = languageLocalStorage(undefined, 'getLanguage', false)
    link.href = `../doc/${language === 'pt' ? 'resumept.pdf' : 'resumeen.pdf'}`
    link.download = 'Lucas_Oliveira_resume'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function languageLocalStorage (e, nameCallOnly, callAllStatus) {

    const action = {
        setLanguage: (typeButton) => {
            if (typeButton !== undefined) {
                typeButton.hasClass('pt') ? localStorage.setItem('languageResume', 'pt') : localStorage.setItem('languageResume', 'en')
            }
        },
        getLanguage: () => {
            if (localStorage.languageResume === undefined) {
                localStorage.setItem('languageResume', 'pt')
            }

            const language = localStorage.languageResume
            $('.button-translate').removeClass('active')
            
            if (language === 'pt') {
                contentLanguageJSON(ptbr = true, en = false)
                $(`.button-translate.${language}`).addClass('active')
            }
            else {
                contentLanguageJSON(ptbr = false, en = true)
                $(`.button-translate.${language}`).addClass('active')
            }

            return language
        }
    }

    const callOnly = (namef) => {
        if (e === undefined && namef === 'getLanguage') {
            return action.getLanguage()
        }
        else if (action[namef]) {  action[namef](e) }
    }

    const callAll = () => {
        action.setLanguage(e)
        action.getLanguage()
    }

    if (nameCallOnly) { return callOnly(nameCallOnly) }
    if (callAllStatus) { return callAll() }
}
languageLocalStorage(undefined, 'getLanguage', false)

//TRANSLATE (PT-EN)
const buttonTranslate = $('.button-translate')

buttonTranslate.on('click', function () {
    //Change activity
    $(this).parent().find('.button-translate').removeClass('active') 
    $(this).toggleClass('active')

    //Change language content
    const typeButton = $(this)
    typeButton.hasClass('pt') ? contentLanguageJSON(ptbr = true, en = false)
        : contentLanguageJSON(ptbr = false, en = true)

    languageLocalStorage(typeButton, 'setLanguage', false)
})

function contentLanguageJSON (ptbr = undefined, en = undefined) {    
    let typearchive = ''
    
    ptbr === true ? typearchive = 'resume_portuguese' : undefined 
    en === true ? typearchive = 'resume_english' : undefined 

    //LOAD TRANSLATE CONTENT
    $.getJSON(`../json/${typearchive}.json`, function (data) {  
        setContentJSON(data)
    })
}

function setContentJSON (data) {
    //map selector jquery
    const mapJquery = (selector, item, i) => $(selector).eq(i).html(item)

    const defineObject = (object, valueOfKey) => {
        return Object.keys(object).reduce((defined, key) => {
            defined = defined || {}
            defined[key] = valueOfKey
            return defined
        }, {})
    }

    const structure = {
        article: {
            //key (object json), values(selector html to jquery)
            'titles': 'article h3',
            'others': 'article .chld-li',
            'contacts': 'article .article-contacs li:nth-of-type(2)',
            'last_p': 'article .article-country'
        },
        section: {
            //key (object json), values(selector html to jquery)
            'titles_h2': 'section h2',
            'titles_h3': 'section h3',
            'titles_h4': 'section h4',
            'p_section': '.chld-p-lv1',
            'li_section': 'section li > p',
            'label_section': 'section label'
        }
    }

    Object.entries(structure).forEach(([key, value]) => {
        const targetObject = key === 'article' ? data.article : data.section
        const reference = defineObject(value, mapJquery)
        applyContentJSON(value, reference, targetObject)
    })
}

function applyContentJSON (map, objectReference, objectJson) {
    Object.entries(objectJson).forEach(([keyJson, contentJson]) => {
        const selector = map[keyJson]
        if (selector) {
            contentJson.forEach((item, i) => {
                objectReference[keyJson]?.(selector, item, i)
            })  
        }
    })
}