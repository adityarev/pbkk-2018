import express from 'express'
import * as User from './queries/user'

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/api/auth/login', User.login)
app.post('/api/auth/register', User.register)

app.get('/api/users', User.getUsers)
app.get('/api/users/:id', User.getUserById)

app.listen(PORT, () => {
    console.log(`[express Server] Running on port ${PORT}.`)
})
