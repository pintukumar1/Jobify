const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res, next) => {
    try{
        const user = await User.create(req.body)
        res.status(201).json({ user })
    } catch (error){
        next(error)
    }
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