const jwt = require("./tokenHandler");
const db = require('../data/connection');

module.exports.auth = async function (req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	const id = jwt.getClienteIdFromToken(token);
	if (id == -1) return res.sendStatus(401);

	const query = await db.execute("SELECT nome FROM clientes WHERE id=? AND ativo = 1", [id])
    if(query.err) return res.sendStatus(500);
	if(query.result.length == 0) return res.sendStatus(400);

	req.cliente_id = id;
    next();
};
