const express = require('express')
const chatrouter = express.Router()

chatrouter.get('/dashboard', (req, res) => {
    res.send('socket server is working and running')
})

module.exports = chatrouter