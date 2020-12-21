// Referenca na konekciju sa bazom
const conn = require('../config/db');


/** Vraća određeni broj kategorija */
module.exports.vratiKategorije = (limit) =>
{
    return new Promise((res, rej)=>
    {
        var query;
        if(typeof limit == 'undefined')
        {
            query = `SELECT * FROM kategorije`;
        }
        else
        {
            query = `SELECT * FROM kategorije LIMIT ?`;
        }

        conn.query(query, [limit], (err, result)=>
        {
            if (err) rej(err);
            else res(result);
        });


    });
    
}

/** Vraća određenu 1 kategoriju selektovanu pomoću kategorija.id */
module.exports.vratiKategoriju = (id) =>
{
    return new Promise((res, rej) =>
    {
        var query = `SELECT * FROM kategorije WHERE id = ?`
        
        conn.query(query, [id], (err,result)=>
        {
            if (err) rej (err);
            else res(result);
        })
    })
}

