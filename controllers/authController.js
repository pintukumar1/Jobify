const { StatusCodes } = require('http-status-codes')
// const BadRequestError = require("../errors/bad-request")
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
require("dotenv").config();
const { 
    BadRequestError, 
    NotFoundError, 
    InternalServerError
 } = require("../errors")

const register = async (req, res, next) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        const error = new BadRequestError("Please provide all values.")
        return next(error)
    }

    let userAlreadyExists
    try {
        userAlreadyExists = await User.findOne({ email: email })
    } catch (err) {
        const error = new InternalServerError("Signing Up failed,Please try again later.")
        return next(error)
    }

    if (userAlreadyExists) {
        const error = new BadRequestError("E-mail already in use.Please Login instead")
        return next(error)
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new InternalServerError("Could not create user.please try again.")
        return next(error)
    }

    const createdUser = new User({
        name: name,
        email: email,
        password: hashedPassword
    })

    try {
        await createdUser.save()
    } catch (err) {
        const error = new InternalServerError("Signing Up failed, please try again.")
        return next(error)
    }

    let token
    try {
        token = jwt.sign({ 
            userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY, { expiresIn: process.env.JWT_LIFETIME })
    } catch (err) {
        const error = new InternalServerError("Signing up failed, please try again.")
        return next(error)
    }

    res.status(StatusCodes.OK).json({
        user: {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            lastName: createdUser.lastName,
            location: createdUser.location,
        },
        location: createdUser.location,
        token: token
    })
}

const login = async (req, res) => {
    res.send("login")
}

const updateUser = async (req, res) => {
    res.send('Update user')
}

exports.register = register
exports.login = login
exports.updateUser = updateUser