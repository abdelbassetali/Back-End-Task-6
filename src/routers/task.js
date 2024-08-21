const express = require('express')
const Task = require('../models/task')
const router = express.Router()
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, owner: req.user._id })
        await task.save()
        res.status(200).send(task)
    }
    catch (e) { req.status(400).send({ Error: 'error post task' }) }
})


router.get('/tasks', auth, async (req, res) => {
    try {
        const task = await Task.find({})
        res.status(200).send(task)
    }
    catch (e) {
        res.status(400).send({ Error: 'errorget task' })
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findOne({ _id: id, owner: req.user._id })

        if (!task) {
            return res.status(500).send({ Error: "not found task=> get" })
        }
        res.stuts(200).send(task)
    }
    catch (e) {
        res.status(400).send({ Error: "Not Found TASK" })
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = rea.params.id
        const task = await Task.findByIdAndUpdate({ _id }, req.body, {
            new: true,
            runValidators: true
        })
        if (!task) {
            res.status(404).send('not found task=> patch')
        }
        res.status(200).send(task)
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send('not found task => delete')
        }
        res.status(200).send(task)
    }
    catch (e) {
        res.status(404).send({ Error: 'deleted task' })
    }
})

module.exports = router