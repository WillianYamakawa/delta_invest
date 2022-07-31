// const user = {
//     data_inicio_contrato: '2022-07-29 11:36:42'
// }

// const query = {
//     result: [
//         {data: '2022-06-28 11:36:42'}
//     ]
// }
// console.log(isAllowed(user, query))

// function isAllowed(user, query){
//     const now = new Date()

//     if(query.result.length == 0){ //Se o cliente ainda nao fez nenhum pedido
//         let date = new Date(user.data_inicio_contrato)
//         let day = date.getDate();
//         let month = date.getMonth();
//         if(day >= 15){ //Se o dia do contrato for maior que ou igual a 15
//             if((now.getMonth() + (12 * now.getFullYear())) - (month + (12* date.getFullYear())) >= 2){ //O cliente so podera retirar o dinheiro apos 2 meses
//                 return true;
//             }
//         }else{ // Se o dia do contrato for menor que 10
//             if(now.getMonth() + (12 * now.getFullYear()) != month + (12* date.getFullYear())){ // Se passou-se pelo menos um mes do contrato
//                 return true;
//             }
//         }
//     }else{ // Se o cliente ja teve algum pedido
//         let date = new Date(query.result[0].data)
//         let month = date.getMonth();
//         if(now.getMonth() + (12 * now.getFullYear()) != month + (12* date.getFullYear())){ // Se passou-se pelo menos um mes do ultimo pedido
//             return true;
//         }
//     }

//     return false;
// }