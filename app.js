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
import { dirname } from "path"
import { fileURLToPath } from "url"
import path from "path"
import helmet from "helmet"
import xss from "xss-clean"
import mongoSanitize from "express-mongo-sanitize"

const app = express()

if(process.env.NODE_ENV !== "production"){
    app.use(morgan("dev"))
}

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.resolve(__dirname, "./client/build")))
app.use(express.json())

app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.use(cors())

app.use("/api/auth", authRoutes);
app.use("/api/job", isAuth ,jobRoutes)

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port)
    } catch (error) {}
}

start();