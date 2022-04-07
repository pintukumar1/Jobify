import express from "express"
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import notFoundMiddleware from "./middleware/not-found.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./db/connect.js"
import dotenv from "dotenv"
dotenv.config()
import isAuth from "./middleware/is-auth.js"

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