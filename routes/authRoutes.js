const express = require('express')

const authControllers = require('../controllers/authController')
const isAuth = require("../middleware/is-auth")
const router = express.Router()

router.post("/register", authControllers.register)

router.post("/login", authControllers.login)

router.patch("/updateuser",isAuth, authControllers.updateUser)

module.exports = router