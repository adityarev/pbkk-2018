import Express from 'express'
import * as BodyParser from 'body-parser'

const App = Express()
const PORT = 5000

App.use(BodyParser.json())
App.use(
  BodyParser.urlencoded({
    extended: true
  })
)

App.get('/', (req, res) => {
  res.json({
    info: 'Node.js, Express, and Postgres API'
  })
})

// const db = require('./queries')
import * as User from './queries/user'

App.get('/users/:id', User.getUserById)

App.listen(PORT, () => {
  console.log(`[Express Server] Running on port ${PORT}.`)
})
