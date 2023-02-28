const express = require('express')
const db = require('../data/connection')
const jwt = require('../auth/tokenHandler')
const auth = require('../auth/auth_client')
const router = express.Router();

router.post('/', async (req, res) => {
    const {user, password} = req.body; 
    if(!user || !password) return res.sendStatus(400); //Valores nulos

    const query = await db.execute("SELECT id FROM clientes WHERE user = ? AND password = md5(?) AND ativo = 1", [user, password])
    if(query.err) return res.sendStatus(500);

    if(query.result.length == 0) return res.sendStatus(400);
    const id = query.result[0].id;

    return res.json({token: jwt.generateCliente(id)}) //Gerar token
})

router.post('/adm', async (req, res) => {
    const {user, password} = req.body; 
    if(!user || !password) return res.sendStatus(400); //Valores nulos

    const query = await db.execute("SELECT id FROM adm WHERE user = ? AND password = md5(?)", [user, password])
    if(query.err) return res.sendStatus(500);

    if(query.result.length == 0) return res.sendStatus(400);
    const id = query.result[0].id;

    return res.json({token: jwt.generateAdm(id)}) //Gerar token
})

module.exports = router;
