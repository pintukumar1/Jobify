const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
require('dotenv').config()
require("express-async-errors");

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome!!")
})

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes)

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