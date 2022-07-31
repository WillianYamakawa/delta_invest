const express = require('express')
const {auth: authCliente} = require('../auth/auth_client')
const {auth: authAdm} = require('../auth/auth_adm')
const Clientes = require("../repos/clientes")
const router = express.Router();

router.get('/info', authCliente, async (req, res) => {
    const query = await Clientes.getById(req.cliente_id);
    if(query.err) return res.sendStatus(500)
    const cliente = query.result[0];

    delete cliente.password

    res.json(query.result[0]);
})

router.get('/id/:id', authAdm, async (req, res) => {
    const id = req.params.id;
    if(!id) return res.sendStatus(400);
    const query = await Clientes.getById(id);
    if(query.err) return res.sendStatus(500)
    res.json(query.result[0]);
})

router.get('/all', authAdm, async (req, res) => {
    const query = await Clientes.getAll();
    if(query.err) return res.sendStatus(500)
    res.json(query.result);
});

router.post('/insert', authAdm, async (req, res) => {
    const {cliente} = req.body;
    if(!cliente) return res.sendStatus(400); //Valores nulos

    const query = await Clientes.insert(cliente);
    if(query.err) return res.sendStatus(400)

    return res.sendStatus(200);
})

router.post('/update', authAdm, async (req, res) => {
    const {cliente, id} = req.body;
    if(!cliente || !id) return res.sendStatus(400); //Valores nulos

    const query = await Clientes.update(id, cliente);
    if(query.err) return res.sendStatus(400)

    return res.sendStatus(200);
})

router.post('/deactivate', authAdm, async (req, res) => {
    const {id} = req.body;
    if(!id) return res.sendStatus(400); //Valores nulos

    const query = await Clientes.changeActive(id, 0);
    if(query.err) return res.sendStatus(400)

    return res.sendStatus(200);
})

router.post('/activate', authAdm, async (req, res) => {
    const {id} = req.body;
    if(!id) return res.sendStatus(400); //Valores nulos

    const query = await Clientes.changeActive(id, 1);
    if(query.err) return res.sendStatus(400)

    return res.sendStatus(200);
})


module.exports = router;
