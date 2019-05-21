import express from 'express'

export const use = app => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        res.setHeader('Access-Control-Allow-Credentials', true)
        next()
    })
}
