const jwt = require("./tokenHandler");

module.exports.auth = async function (req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	const id = jwt.getClienteIdFromToken(token);
	if (id == -1) return res.sendStatus(401);
	req.cliente_id = id;
    next();
};
