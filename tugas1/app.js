const express = require('express')
const App = express()
const PORT = 3000

App.get('/hello/', (req, res) => {
  res.send('Hello World!')
})

App.listen(PORT, () => console.log(`[Hello World] Listening on port ${PORT}!`))
