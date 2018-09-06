var mysql = require('mysql');
 
var pool = mysql.createPool({
 host : '127.0.0.1',
 user : 'root',
 password : '123456',
 database : 'expres_users',
 connectTimeout: 20000,
 adquireTimeout: 20000,
});
 
module.exports = pool;