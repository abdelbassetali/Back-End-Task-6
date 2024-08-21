const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userShema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if (!password.test(value)) {
                throw new Error('password must include Upercase , Lowercase, number , speacial characters')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('email is invaliad')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(val) {
            if (val === String) {
                throw new Error('age mast positive number')
            }
        }
    },
    city: {
        type: String,
        required: false,
    },
    tokens: [
        {
            type: String,
            required: true
        }
    ]
})

userShema.pre("save", async function () {
    const user = this
    console.log(user)
    if (user.isModified('password'))
        user.password = await bcryptjs.hash(user.password, 8)
})



userShema.statics.findByCredentials = async (em, pass) => {
    const user = await User.findOne({ email: em })
    if (!user) {
        throw new Error("unable to login")
    }

    const ispass = await bcryptjs.compare(pass, user.password)
    if (!ispass) {
        throw new Error("unable to password")
    }
    return user
}


userShema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "task-6")
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}

userShema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}





const User = mongoose.model('User', userShema)
module.exports = User