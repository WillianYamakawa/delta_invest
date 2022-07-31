const express = require('express')
const {auth: authAdm} = require('../auth/auth_adm')
const Lucros = require("../repos/lucros")
const router = express.Router();

router.post("/apply", authAdm, async (req, res) => {

    // if((new Date()).getDate() != process.env.APPLY_DAY){
    //     return res.sendStatus(403)
    // }

    const {valor} = req.body;
    if(!valor) return res.sendStatus(400)

    const query = await Lucros.apply(valor)
    if(query.err) return res.sendStatus(500)

    return res.sendStatus(200)
})

module.exports = router;