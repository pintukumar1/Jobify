const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
    const user = await User.create(req.body)
    res.status(StatusCodes.OK).json({ user })
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