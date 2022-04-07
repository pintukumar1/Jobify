import mongoose from 'mongoose'
import Validator from 'validator'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minLength: 3,
        maxLength: 20,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validate: {
            validator: Validator.isEmail,
            message: "Please provide a valid email.."
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 6
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 20,
        default: 'lastName'
    },
    location: {
        type: String,
        trim: true,
        maxLength: 20,
        default: "my city"
    }
})

export default mongoose.model("User", userSchema)