const mysql = require("mysql");
const db = require("../data/connection");

module.exports.apply = async function (valor) {
	return await db.execute(
		`
        INSERT INTO lucros SET data=NOW(), valor = ?;
        UPDATE clientes 
        SET saldo = saldo + (valor_contrato * (3/100)) 
        WHERE ativo = 1
	    AND MONTH(NOW()) + (12 * YEAR(NOW())) - MONTH(data_inicio_contrato) + (12 * YEAR(data_inicio_contrato)) >= 2;
        `, [valor]
	);
};
