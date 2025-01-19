import formData from 'form-data'
import Mailgun from 'mailgun.js'
import dotenv from 'dotenv'

dotenv.config()
const mailgun = new Mailgun(formData)
const mg = mailgun.client({
    username: 'api', 
    key: process.env.MAILGUN_API_KEY
})

const sendEmail = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: 'Method not allowed. Check the type of method sent.'
        })
    }

    try {
        const { name, email, message } = req.body
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false,
                error: 'Is necessary fill out all the fields.'
            })
        }

        //Message's configuration
        const data = {
        from: `${name} <${email}>`,
        to: process.env.RECIPIENT_EMAIL || 'lukinhaso2206@gmail.com',
        subject: `Message from ${name}`,
        text: message,
        html: `<p>${message}</p>`,
    };

        //Send E-mail
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
        if (response.id) {
            res.status(200).json({ 
                success: true,
                message: 'Message sent successfully!' 
            })            
            //console.log('Message sent successfully!')
        } 
    } 
    catch (error) {
        //console.error('Something was wrong to send e-mail: ', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

export default sendEmail