const express = require('express')
const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const cors = require("cors")
const morgan = require("morgan")
const connectDB = require("./db/connect")
require('dotenv').config()
const isAuth = require("./middleware/is-auth")

const app = express()

if(process.env.NODE_ENV !== "production"){
    app.use(morgan("dev"))
}

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Welcome!!")
})

app.use("/api/auth", authRoutes);
app.use("/api/job", isAuth ,jobRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log("MongoDB database connected...")
        app.listen(port, () => {
            console.log(`app is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start();