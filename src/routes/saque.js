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

    const now = new Date();
	const dayAllowed = whenAllowed(user, query2.result); //Checa se cliente pode realizar saque
    if(dayAllowed.getFullYear() === now.getFullYear() && dayAllowed.getMonth() === now.getMonth() && dayAllowed.getDate() === now.getDate()){
        //ALLOWED
    }else{
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

	const query2 = await Saques.setPayedBlind(id)
	if (query2.err) return res.sendStatus(500);

	return res.sendStatus(200);
});

router.get("/allowed", authCliente, async (req, res) => {

	const query = await Clientes.getById(req.cliente_id);
	if (query.err) return res.sendStatus(500);

	const user = query.result[0];

	const query2 = await Saques.getLastRequestDateFromClient(user.id);
	if (query2.err) return res.sendStatus(500);

    const now = new Date();
    const dayAllowed = whenAllowed(user, query2.result);
	console.log(dayAllowed)
    
    if(dayAllowed.getFullYear() === now.getFullYear() && dayAllowed.getMonth() === now.getMonth() && dayAllowed.getDate() === now.getDate()){
        return res.json({allowed: true});
    }else{
        return res.json({allowed: `${dayAllowed.getDate()}/${dayAllowed.getMonth() + 1}/${dayAllowed.getFullYear()}`});
    }
});

function whenAllowed(user, pedidos) {
	let date_next = null

	if (pedidos.length == 0) {
		const day = new Date(user.data_inicio_contrato);
		
		// if (day.getDate() <= 10) {
		// 	const firstDay = new Date(day.setDate(1))
		// 	const nextMonth = new Date(firstDay.setMonth(firstDay.getMonth() + 1));
		// 	date_next = new Date(nextMonth.setDate(10));
		// } else {
			const firstDay = new Date(day.setDate(1))
			const nextMonth = new Date(firstDay.setMonth(firstDay.getMonth() + 2));
			date_next = new Date(nextMonth.setDate(10));
		// }
	}else{
        const day = new Date(pedidos[0].data)
        const now = new Date()
        if(now.getMonth() + (12 * now.getFullYear()) == day.getMonth() + (12 * day.getFullYear())){
            const nextMonth = new Date(now.setMonth(now.getMonth + 1));
            date_next = new Date(nextMonth.setDate(10));
        }else{
            date_next = new Date(now.setDate(10))
        }
    }

    return date_next;
}

module.exports = router;
