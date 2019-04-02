import express from 'express'

const app = express()
const PORT = 5000

app.post('/login', (req, res) => {
    const { username, password } = req.params

    // Put validation here

    res.status(200).json({ message: "OK" });
})

app.listen(PORT, () => {
    console.log(`[ Express ] Running on port ${PORT}.`)
})
