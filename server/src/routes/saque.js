const express = require("express");
const crypto = require("crypto");
const { auth: authCliente } = require("../auth/auth_client");
const { auth: authAdm } = require("../auth/auth_adm");
const Clientes = require("../repos/clientes");
const Saques = require("../repos/saques");
const mailer = require("../utils/mail");
const router = express.Router();
const request_day = process.env.REQUEST_DAY;

router.post("/request", authCliente, async (req, res) => {
	//CHECK

	const uuid = crypto.randomUUID();

	const query = await Clientes.getById(req.cliente_id);
	if (query.err) return res.sendStatus(500);

	const user = query.result[0];

	const query2 = await Saques.getLastRequestDateFromClient(user.id);
	if (query2.err) return res.sendStatus(500);

	//Checa se cliente pode fazer saque
	const now = new Date(); //Dia de hoje
	const lastRequestDate = query2.result[0]; //data do ultimo pedido
	if(now.getDate() == 10 && user.saldo > 0)	//Checa se hj e dia 10 e se o user tem saldo
	{
		if(lastRequestDate){ //Se houve pedido
			const lrdData = new Date(lastRequestDate.data); //Cast
			if(lrdData.getDate() == 10){ //Se o user ja fez um pedido hj
				return res.sendStatus(403);
			}
		}
	}else{ //Hj nao 'e dia 10 ou user nao tem saldo
		return res.sendStatus(403);
	}
	 

	const query3 = await Saques.insert(req.cliente_id, uuid);
	if (query3.err) return res.sendStatus(500);

	res.sendStatus(200);
	await mailer.sendRequest(user, uuid);
	await mailer.sendConfirmation(user.email, user.saldo);
});

router.get("/payed/:uuid", async (req, res) => {
	const { uuid } = req.params;
	if (!uuid) return res.sendStatus(400);

	const query = await Saques.getClientIdFromUUID(uuid);
	if (query.err) return res.sendStatus(500);

	const query2 = await Saques.setPayed(query.result[0].cliente_id, uuid);
	if (query2.err) return res.sendStatus(500);

	return res.send("<h1>Pagamento Confirmado</h1>");
});

router.post("/payedblind", async (req, res) => {
	const { id } = req.body;
	if (!id) return res.sendStatus(400);

	const query2 = await Saques.setPayedBlind(id);
	if (query2.err) return res.sendStatus(500);

	return res.sendStatus(200);
});

router.get("/allowed", authCliente, async (req, res) => {
	const query = await Clientes.getById(req.cliente_id);
	if (query.err) return res.sendStatus(500);

	const user = query.result[0];

	const query2 = await Saques.getLastRequestDateFromClient(user.id);
	if (query2.err) return res.sendStatus(500);

	//Checa se cliente pode fazer saque
	const now = new Date(); //Dia de hoje
	const lastRequestDate = query2.result[0]; //data do ultimo pedido
	if(now.getDate() == 10 && user.saldo > 0)	//Checa se hj e dia 10 e se o user tem saldo
	{
		if(lastRequestDate){ //Se houve pedido
			const lrdData = new Date(lastRequestDate.data); //Cast
			if(lrdData.getDate() == 10){ //Se o user ja fez um pedido hj
				return res.json({allowed: false});
			}
		}
	}else{ //Hj nao 'e dia 10 ou user nao tem saldo
		return res.json({allowed: false});
	}
	return res.json({allowed: true});
});

module.exports = router;
