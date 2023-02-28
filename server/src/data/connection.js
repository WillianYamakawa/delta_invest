const mysql = require("mysql");
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	dateStrings: true,
	multipleStatements: true
});

module.exports.execute = function (sql, userInput = []) {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err)
				connection.release();
				resolve({ err: err, result: null });
			}
			connection.query(sql, userInput, (err, result) => {
				connection.release();
				resolve({ err: err, result: result });
			});
		});
	});
};
