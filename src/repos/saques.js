const mysql = require("mysql");
const db = require("../data/connection");

module.exports.insert = async function (cliente_id, uuid) {
	return await db.execute(
		"INSERT INTO pedidos_saque SET cliente_id = ?, data=now(), status=1, uuid=?",
		[cliente_id, uuid]
	);
};

module.exports.setPayed = async function (cliente_id, uuid) {
	return await db.execute("UPDATE pedidos_saque SET status=2 WHERE uuid = ?;UPDATE clientes SET saldo=0 WHERE id = ?", [uuid, cliente_id]);
};

module.exports.getClientIdFromUUID = async function (uuid) {
	return await db.execute("SELECT cliente_id FROM pedidos_saque WHERE uuid = ?", [uuid]);
};

module.exports.getLastRequestDateFromClient = async function(id){
	return await db.execute(`
	SELECT data FROM pedidos_saque
	WHERE cliente_id = ?
	ORDER BY data DESC
	LIMIT 1`
	, [id]);
}