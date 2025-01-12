import express from 'express'
import cors from 'cors'
import { sendEmail } from './email_provider/send.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.test || 5000

app.use(cors())
app.use(express.json())

// routes set
app.post('/email_provider/send', sendEmail)

// server status
app.get('/', (req, res) => {
    res.send('Server is running!')
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})