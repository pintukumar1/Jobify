const express = require('express')
const mongoose = require('mongoose')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
require('dotenv').config()

const app = express()

app.get("/", (req, res) => {
    // throw new Error("error")
    res.send("Welcome to node.js!!")
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.btsfj.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
        )
        console.log("DB connected..!!")
        app.listen(port, () => {
            console.log(`app is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start();