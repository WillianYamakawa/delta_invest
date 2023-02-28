const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports.sendRequest = function (user, uuid) {
	return new Promise((resolve, reject) => {
		const now = new Date();
		const mailOptions = {
			from: process.env.MAIL_USER, // sender address
			to: process.env.MAIL_TO, // list of receivers
			subject: `PEDIDO DE SAQUE: ${user.nome} - ${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`, // Subject line
			html: `
      <h1>Pedido de saque</h1>
      <hr>
      <p>Cliente: ${user.nome}</p>
      <p>PIX: ${user.PIX}</p>
      <p>Phone: ${user.celular}</p>
      <p>Conta Bancaria: ${user.agencia_banco}-${user.conta_banco}</p>
      <h3>Valor: R$${user.saldo.toFixed(2)}</h3>
      <a target="_blank" href="http://localhost:8081/saque/payed/${uuid}"> CONFIRMAR PAGAMENTO</a>
      `,
		};
		transporter.sendMail(mailOptions, function (err, info) {
			if (err) resolve(false);
			else resolve(true);
		});
	});
};

module.exports.sendConfirmation = function (email, valor) {
	return new Promise((resolve, reject) => {
		const now = new Date();
		const mailOptions = {
			from: process.env.MAIL_USER, // sender address
			to: email, // list of receivers
			subject: `PEDIDO DE SAQUE - ${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`, // Subject line
			html: `
      <h1>Pedido de saque</h1>
      <p>Pedido de saque com valor de: R$${valor.toFixed(2)} foi enviado!</p>
      <p>Dentro de 5 dias o valor sera depositado!</p>
      `, // plain text body
		};
		transporter.sendMail(mailOptions, function (err, info) {
			if (err) resolve(false);
			else resolve(true);
		});
	});
};
