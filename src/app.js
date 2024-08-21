const express = require('express')
const app = express()
const port = process.env.PORT || 3000

require('./db/monogoose')

app.use(express.json())

const userrouter = require('./routers/user')
app.use(userrouter)

const taskrouter = require('./routers/task')
app.use(taskrouter)

app.listen(port, () => { console.log('all done') })