import { StatusCodes } from 'http-status-codes';
import User from '../models/user.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()
import BadRequestError from '../errors/bad-request.js';
import InternalServerError from '../errors/internal-server-error.js';
import UnAuthenticatedError from '../errors/un-authenticated.js';

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
            userId: createdUser.id, email: createdUser.email
        },
            process.env.JWT_KEY, { expiresIn: process.env.JWT_LIFETIME })
    } catch (err) {
        const error = new InternalServerError("Signing up failed, please try again.")
        return next(error)
    }

    res.status(StatusCodes.CREATED).json({
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


const login = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        const error = new BadRequestError("Please provide all values..")
        return next(error)
    }

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    }
    catch (err) {
        const error = new InternalServerError("Logging in failed, Please try again")
        return next(error)
    }

    if (!existingUser) {
        const error = new UnAuthenticatedError("Invalid credentials, user does not exist...")
        return next(error)
    }

    let isMatch;
    try {
        isMatch = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new InternalServerError("Could not log you in, Please check your credentials and try again..")
        return next(error)
    }

    if (!isMatch) {
        const error = new UnAuthenticatedError("Invalid credentials, could not log you in... ")
        return next(error)
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: process.env.JWT_LIFETIME })
    } catch (err) {
        const error = new InternalServerError("Logging in failed ,Please try again..")
        return next(error)
    }

    res.status(StatusCodes.CREATED).json({
        user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            lastName: existingUser.lastName,
            location: existingUser.location
        },
        location: existingUser.location,
        token: token
    })
}

const updateUser = async (req, res, next) => {

    const { email, name, lastName, location } = req.body
    if (!email || !name || !lastName || !location) {
        const error = new BadRequestError("Please provide all values...")
        return next(error)
    }

    let user;
    try {
        user = await User.findById(req.user.userId)
    } catch (err) {
        const error = new InternalServerError("Updating user failed, please try again")
        return next(error)
    }

    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    try {
        await user.save()
    } catch (err) {
        const error = new InternalServerError("Something went wrong, could not update place")
        return next(error)
    }

    let token;
    try {
        token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_KEY,
            { expiresIn: process.env.JWT_LIFETIME })
    } catch (err) {
        const error = new InternalServerError("updating user failed ,Please try again..")
        return next(error)
    }

    res.status(StatusCodes.OK).json({ user: user, token: token })
}

export default { register, login, updateUser}