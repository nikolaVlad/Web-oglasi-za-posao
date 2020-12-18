const mysql = require('mysql');


// Konekcija sa bazom sajta 
module.exports = mysql.createConnection(
    {
        host : 'localhost',
        user : 'root',
        database : 'wop'
    }
);
