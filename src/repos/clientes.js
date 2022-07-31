const mysql = require('mysql')
const db = require("../data/connection")
const {createHash} = require("crypto")

module.exports.getAll = async function(){
    return await db.execute(`
    SELECT clientes.id, clientes.nome, clientes.CPF, clientes.saldo, clientes.ativo, COUNT(CASE WHEN pedidos_saque.status = 1 THEN 1 ELSE NULL END) as pedidos
    FROM clientes 
    LEFT JOIN pedidos_saque ON clientes.id = pedidos_saque.cliente_id
    GROUP BY clientes.id
    ORDER BY clientes.ativo, clientes.nome
    `);
}

module.exports.getById = async function(id){
    return await db.execute(`
    SELECT clientes.*, COUNT(CASE WHEN pedidos_saque.status = 1 THEN 1 ELSE NULL END) as pedidos
    FROM clientes 
    LEFT JOIN pedidos_saque ON clientes.id = pedidos_saque.cliente_id
    WHERE clientes.id = ?
    GROUP BY clientes.id`
    , [id])
}

module.exports.changeActive = async function(id, state){
    return await db.execute("UPDATE clientes SET ativo = ? WHERE id = ?", [state == 0 ? 0 : 1, id])
}

module.exports.update = async function(id, opt){
    if (opt.id != undefined) delete opt.id; //Removes possibility to change id
    if(opt.password != undefined) opt.password = createHash('md5').update(opt.password).digest('hex'); //Hashes Passoword
    return await db.execute(`UPDATE clientes SET ? WHERE id = ${mysql.escape(id)}`, opt)
}

module.exports.insert = async function(opt){
    if (opt.id != undefined) delete opt.id; //Removes possibility to insert id
    if(opt.password != undefined) opt.password = createHash('md5').update(opt.password).digest('hex'); //Hashes Passoword
    return await db.execute("INSERT INTO clientes SET ?, ativo=1", opt)
}
