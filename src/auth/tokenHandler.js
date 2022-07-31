const jwt = require("jsonwebtoken")

module.exports.generateCliente = function(id){
    return jwt.sign({id:id, type:"cliente"}, process.env.TOKEN_PRIVATE, {
        expiresIn: process.env.TOKEN_EXPIRES
    })
}

module.exports.getClienteIdFromToken = function(token){
    try{
        const result = jwt.verify(token, process.env.TOKEN_PRIVATE)
        if(result.type == "cliente") return result.id;
        else return -1;
    }catch(e){
        return -1;
    }
}