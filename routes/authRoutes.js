import express from "express"
import authControllers from "../controllers/authController.js"
import isAuth from "../middleware/is-auth.js"

const router = express.Router()

router.post("/register", authControllers.register)

router.post("/login", authControllers.login)

router.patch("/updateuser",isAuth, authControllers.updateUser)

export default router