const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/users')

//post 
router.post('/user', auth, async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    user.save()
        .then((user) => { res.status(200).send(user) })
        .catch((e) => { res.status(404).send({ Error: 'error post user' }) })
})
 //get all
router.get('/users', auth, async (req, res) => {
    User.find({})
        .then((user) => { res.status(200).send(user) })
        .catch((e) => { res.status(500).send(e) })
})


//get by id
router.get('/users/:id', auth, async (req, res) => {
    const _id = req.params.id
    User.findById(_id)
        .then((user) => {
            if (!user) {
                return res.status(400).send("Not Found User")
            }
            res.send(user)
        })
        .catch((e) => { res.status(500).send(e.message) })
})

//patch by patch
router.patch('/users/:id', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        console.log(updates)
        const _id = req.params.id

        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('not found user')
        }
        updates.forEach((ele) => { (user[ele] = req.body[ele]) })
        await user.save()
        res.status(200).send(user)
    }
    catch (e) { res.status(404).send({ Error: 'error patch user' }) }
})
//delete by id
router.delete('/users/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const user = User.findByIdAndDelete(_id)
        if (!user) {
            return res.status(404).send({ Error: 'error delete user' })
        }
        res.status(200).send(user)
    }
    catch (e) { res.status(404).send('error delete user') }
})


//login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.status(200).send({ user, token })
    }
    catch (e) {
        res.status(400).send({ Error: 'erroe login user' })
    }
})


//token
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateToken()
        await user.save()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//profile
router.get('/profile', auth, async (req, res) => {
    res.status(200).send(req.user)
})


//logout
router.delete('/logout', auth, async (req, res) => {
    try {
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((el) => {
            return el !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})


//logoutAll
router.delete('/logoutAll', auth, async (req, res) => {
    try {
        req.user.token = []
        await req.user.save()
        res.send
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})


module.exports = router