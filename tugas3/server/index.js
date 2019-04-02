import express from 'express'
import * as User from './api/user'

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

app.post('/api/auth/login', User.login)
app.post('/api/auth/register', User.register)
app.post('/api/auth/logout', User.logout)

app.get('/api/users', User.getUsers)
app.get('/api/users/:id', User.getUserById)

app.listen(PORT, () => {
    console.log(`[express Server] Running on port ${PORT}.`)
})
