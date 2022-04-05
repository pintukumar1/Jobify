const jwt = require("jsonwebtoken")
const { UnAuthenticatedError } = require("../errors");
require("dotenv").config()

const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        throw new UnAuthenticatedError("authentication Invalid")
    }

    try {
        const token = authHeader.split(" ")[1]
        if (!token) {
            throw new UnAuthenticatedError("Authentication failed.")
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY)
        req.user = { userId: decodedToken.userId, email: decodedToken.email }
        next()
    } catch (err) {
        throw new UnAuthenticatedError("Authentication failed...")
    }
}

module.exports = isAuth