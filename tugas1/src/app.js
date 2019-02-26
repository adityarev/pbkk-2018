import { Home } from './routes/Home'
import { Template } from './template/template'
import { HOME_PATH } from './routes/urls'
import { PORT } from './constans/constans'

import express from 'express'
import { renderToString } from 'react-dom/server'

const app = express()

app.get(HOME_PATH, (req, res) => {
  const bodyHtml = renderToString(Home())

  res.send(Template({
    title: 'Hello World',
    body: bodyHtml
  }))
})

app.listen(PORT, () => console.log(`[Hello World] Listening on port ${PORT}!`))
