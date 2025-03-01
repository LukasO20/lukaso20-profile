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
            console.log('DATA FROM JSON PT - ', translateContentJSON)
        })
        .catch(error => console.error('Error during load json archive: ', error))

    } catch (error) {
        throw new Error('Ops! Something got wrong during translation... ', error)       
    }
    
    console.log('TRANSLATE CONTENT - ', translateContent, ' TYPE - ', type)
}

export { translate }