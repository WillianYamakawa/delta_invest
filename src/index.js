require("dotenv").config({ path: __dirname + "/../.env" }); //Set env
const fs = require("fs");
const axios = require("axios").default;
const port = process.env.PORT || 8080;

setInterval(async function () {
	try{
		const response = await axios.get(
			"https://api.cryptowat.ch/markets/kraken/ethusd/ohlc?after=1628007311&periods=3600"
		);
		const responseJson = response.data;
		fs.writeFileSync(process.env.FILE_ETH, JSON.stringify(responseJson));
		console.log('write')
	}catch(e){
		console.log('ERRO AO CARREGAR ETH')
	}
}, 60*60*1000);

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

fs.readdirSync(__dirname + "/routes").forEach((file) => {
	app.use(
		"/" + file.substring(0, file.length - 3),
		require(`./routes/${file}`)
	);
});

app.listen(port, () =>
	console.log(`[+] Running on port ${port}, http://localhost:${port}`)
);
