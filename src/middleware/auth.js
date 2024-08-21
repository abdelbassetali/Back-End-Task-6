const jwt = require('jsonwebtoken')
const User = require('../models/users')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        const code = jwt.verify(token, "task-6")
        console.log(code)

        const user = await User.findOne({ _id: code._id, tokens: token })
        console.log(user)
        if (!user) {
            throw new Error("Error auth")
        }
        req.user = user
        req.token = token
        next()
    }
    catch (e) {
        res.status(500).send({ Error: 'please Authorization' })
    }
}
module.exports = auth