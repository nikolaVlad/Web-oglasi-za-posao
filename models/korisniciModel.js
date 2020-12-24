const { query } = require('../config/db');
const conn = require('../config/db');


/** Vraća id i ime korisnika , selektovan pomoću Id-a */
module.exports.vratiKorisnika = (id) =>
{
    return new Promise((res,rej) =>
    {
        var query = `SELECT id, ime FROM korisnici WHERE id = ?`;
        
        conn.query(query,[id],(err,result)=>
        {
            if(err)     rej(err);
            else        res(result);
        });
    });
}