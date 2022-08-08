const express = require('express')
const {auth} = require('../auth/auth_client')
const router = express.Router();
const fs = require('fs')


router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(fs.readFileSync(process.env.FILE_ETH))
})

module.exports = router;