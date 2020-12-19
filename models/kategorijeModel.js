// Referenca na konekciju sa bazom
const conn = require('../config/db');

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
