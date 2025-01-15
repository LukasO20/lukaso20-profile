import { createMessage, accentColors, clearFields, checkClass } from '../../public/js/interactivity_layout.js'
const API_URL = 'http://localhost:5000'

const sendEmail = async (form) => {
    const container = document.querySelector('.container')
    let messageResult = ''

    try {
        const response = await fetch(`${API_URL}/email_provider/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })

        const messagesPopUp = container.querySelectorAll('.message-pop-up.valid, .message-pop-up.invalid')
        if (messagesPopUp.length > 0) {
            createMessage({elementTarget: ['.message-pop-up.valid', '.message-pop-up.invalid'], remove: true})
        }

        if (!response.ok) {
            const error = await response.json()
            messageResult = typeof error.error === 'string' ? error.error : 'Something wrong!'
            createMessage({elementCreate: 'label', elementTarget: '#emailForm', elementClass: ['message-pop-up', 'invalid'], text: `${messageResult}`, add: true})
            accentColors('add', 'input[type="text"], input[type="email"], textarea', 'warning')

            throw new Error(error.error || 'Failed to send e-mail.')
        }
        
        const data = await response.json()
        messageResult = typeof data.message === 'string' ? data.message : 'Successfully!'
        createMessage({elementCreate: 'label', elementTarget: '#emailForm', elementClass: ['message-pop-up', 'valid'], text: `${messageResult}`, add: true})
        clearFields(container.querySelectorAll('input[type="text"], input[type="email"], textarea'))        

        const warningElements = checkClass(container.querySelectorAll('.warning'))
        if (warningElements) { accentColors('remove', 'input[type="text"], input[type="email"], textarea', 'warning') }
        return data
        
    } catch (error) {
        console.error('Server connection failed: ', error.message)
        throw error
    }
}

export { sendEmail }