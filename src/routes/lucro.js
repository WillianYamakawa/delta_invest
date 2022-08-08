const express = require('express')
const {auth: authAdm} = require('../auth/auth_adm')
const {auth: authClient} = require('../auth/auth_client')
const Lucros = require("../repos/lucros")
const router = express.Router();

router.post("/apply", authAdm, async (req, res) => {
    const {valor} = req.body;
    if(!valor) return res.sendStatus(400)

    const query = await Lucros.apply(valor)
    if(query.err) return res.sendStatus(500)

    return res.sendStatus(200)
})

router.get('/get', authClient,async  (req, res) => {
    const query = await Lucros.getAll()
    if(query.err) return res.sendStatus(500)

    return res.json(query.result)
})

module.exports = router;