import express from 'express'

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
})

app.post('/login', (req, res) => {
    const { username, password } = req.body

    const sendError = message => res.status(400).send({ 'message': message })

    const username_alphanumeric = /^[\w]+$/
    const password_length = /^(.{8,})$/
    const password_strength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9 ]).+$/i

    if (!username_alphanumeric.test(username))
        sendError('Username must contain alphanumeric characters only')

    else if (!password_length.test(password))
        sendError('Password must be 8 characters or longer')

    else if (!password_strength.test(password))
        sendError('Password must contain at least 1 lowercase, 1 uppercase, 1 numeric, and 1 special character')

    else
        res.status(200).send({ message: "GAS" })
})

app.listen(PORT, () => {
    console.log(`[ Express ] Running on port ${PORT}.`)
})
