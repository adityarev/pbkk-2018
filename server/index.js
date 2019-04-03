import express from 'express'
import Validator from './validator'

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
    const { username, password } = req.params

    // Put validation here
    // res.status(400).send({ message: 'Cih' });

    res.status(200).send({ message: "OK" });
})

app.listen(PORT, () => {
    console.log(`[ Express ] Running on port ${PORT}.`)
})
