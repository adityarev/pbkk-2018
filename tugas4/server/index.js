import express from 'express'
import * as config from './config'
import * as routes from './routes'

const app = express()
const PORT = 5000

config.use(app)
routes.initialize_endpoints(app)
app.listen(PORT)
