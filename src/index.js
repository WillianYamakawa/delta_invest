require('dotenv').config({path: __dirname+"/../.env"}); //Set env
const port = process.env.PORT || 8080;

const express = require('express')
const fs = require('fs');
const app = express();

app.use(express.json())

fs.readdirSync(__dirname+"/routes").forEach(file => {
    app.use("/"+file.substring(0, file.length-3), require(`./routes/${file}`))
})

app.listen(port, () => console.log(`[+] Running on port ${port}, http://localhost:${port}`));