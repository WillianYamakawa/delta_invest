const express = require('express')
const crypto = require('crypto')
const {auth: authCliente} = require('../auth/auth_client')
const {auth: authAdm} = require('../auth/auth_adm')
const Clientes = require("../repos/clientes")
const Saques = require("../repos/saques")
const mailer = require('../utils/mail')
const router = express.Router();
const request_day = process.env.REQUEST_DAY

router.post("/request", authCliente, async (req, res) => {
    //CHECK

    const uuid = crypto.randomUUID();
    
    // if(new Date().getDate() != request_day){ //Apenas no dia de saques
    //     return res.sendStatus(403);
    // }

    const query = await Clientes.getById(req.cliente_id);
    if(query.err) return res.sendStatus(500)

    const user = query.result[0];

    const query2 = await Saques.getLastRequestDateFromClient(user.id);
    if(query2.err) return res.sendStatus(500);

    // const allowed = isAllowed(user, query2); //Checa se cliente pode realizar saque
    // if(!allowed) return res.sendStatus(403);
    
    const query3 = await Saques.insert(req.cliente_id, uuid)
    if(query3.err) return res.sendStatus(500)

    res.sendStatus(200);
    await mailer.sendRequest(user, uuid)
    await mailer.sendConfirmation(user.email, user.saldo)
})

router.get("/payed/:uuid", async (req, res) => {
    const {uuid} = req.params;
    if(!uuid) return res.sendStatus(400);

    const query = await Saques.getClientIdFromUUID(uuid)
    if(query.err) return res.sendStatus(500)

    const query2 = await Saques.setPayed(query.result[0].cliente_id, uuid)
    if(query2.err) return res.sendStatus(500)

    return res.send("<h1>Pagamento Confirmado</h1>");
})

function isAllowed(user, query){
    const now = new Date()

    if(query.result.length == 0){ //Se o cliente ainda nao fez nenhum pedido
        let date = new Date(user.data_inicio_contrato)
        let day = date.getDate();
        let month = date.getMonth();
        if(day >= 15){ //Se o dia do contrato for maior que ou igual a 15
            if((now.getMonth() + (12 * now.getFullYear())) - (month + (12* date.getFullYear())) >= 2){ //O cliente so podera retirar o dinheiro apos 2 meses
                return true;
            }
        }else{ // Se o dia do contrato for menor que 10
            if(now.getMonth() + (12 * now.getFullYear()) != month + (12* date.getFullYear())){ // Se passou-se pelo menos um mes do contrato
                return true;
            }
        }
    }else{ // Se o cliente ja teve algum pedido
        let date = new Date(query.result[0].data)
        let month = date.getMonth();
        if(now.getMonth() + (12 * now.getFullYear()) != month + (12* date.getFullYear())){ // Se passou-se pelo menos um mes do ultimo pedido
            return true;
        }
    }

    return false;
}

module.exports = router;