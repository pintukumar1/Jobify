const express = require('express')

const authControllers = require('../controllers/authController')

const router = express.Router()

router.post("/register", authControllers.register)

router.post("/login", authControllers.login)

router.patch("/updateuser", authControllers.updateUser)

module.exports = router