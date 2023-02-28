const mysql = require("mysql");
const db = require("../data/connection");

module.exports.apply = async function (valor) {
	return await db.execute(
		`
        INSERT INTO lucros SET data=NOW(), valor = ?;
        UPDATE clientes 
        SET saldo = saldo + (valor_contrato * (?/100)), rendeu = rendeu + (valor_contrato * (?/100))
        WHERE ativo = 1
	    AND DATEDIFF(NOW(), data_inicio_contrato) >= 30;
        `, [valor, valor, valor]
	);
};


module.exports.getAll = async function () {
	return await db.execute(
		`
        SELECT id, data, DATE_FORMAT(data, "%d/%m/%Y") as date, valor FROM lucros ORDER BY data DESC
        `
	);
};