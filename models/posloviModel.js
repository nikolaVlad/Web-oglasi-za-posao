// Referenca na konekciju sa bazom
const { type } = require('jquery');
const conn = require('../config/db');

module.exports.vratiPoslove = (limit) =>
{
    return new Promise((res, rej)=>
    {
        var query;

        if(typeof limit == 'undefined')
        {
            query = `SELECT * FROM poslovi`;
        }
        else
        {
            query = `SELECT * FROM poslovi LIMIT ?`;
        }

        conn.query(query,[limit], (err,result)=>
        {
            if(err) rej(err);
            else    res(result);
        });

    });
}