import express from "express"
import authControllers from "../controllers/authController.js"
import isAuth from "../middleware/is-auth.js"
import rateLimiter from "express-rate-limit"
const router = express.Router()

const apiLimiter = rateLimiter({
    windowMs: 15*60*1000,
    max: 10, 
    message: "Too many request from this IP, Please try again after 15 minutes."
})

router.post("/register",apiLimiter, authControllers.register)

router.post("/login",apiLimiter, authControllers.login)

router.patch("/updateuser",isAuth, authControllers.updateUser)

export default router