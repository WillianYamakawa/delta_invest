const jwt = require("./tokenHandler");
const db = require('../data/connection');

module.exports.auth = async function (req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	const id = jwt.getAdmIdFromToken(token);
	if (id == -1) return res.sendStatus(401);

	req.adm_id = id;
    next();
};
