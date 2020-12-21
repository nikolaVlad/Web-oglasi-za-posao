// Referenca na konekciju sa bazom
const conn = require('../config/db');

// Vraća određeni broj poslova
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

/** Vraća sve poslove iz date kategorije */
module.exports.vratiPosloveIzKategoriju = (idKategorije, kljucnaRec, sortiranje,strana) => //idKategorije, kljucnaRec, sortiranje
{
    return new Promise((res, rej)=>
    {
        

        
        // Prvi deo querya
        var query1 = `  SELECT * 
                        FROM poslovi 
                        WHERE kategorija_id = ${idKategorije} AND

                        naziv LIKE "%${kljucnaRec}%" OR
                        pozeljne_vestine LIKE '%${kljucnaRec}%' OR
                        potrebne_vestine LIKE '%${kljucnaRec}%'
                       
                        `;

                         


        //Drugi deo querya, koji zavisi od parametara posle znaka ?
        if (sortiranje == 'br_prijava')
        {
            query1 += `  ORDER BY br_prijava DESC `;
        }

        if (sortiranje == 'asc')
        {
            query1 += `ORDER BY id ASC `;
        }

        if(sortiranje == 'desc')
        {
            query1+= `ORDER BY id DESC `
        }

         query1 += `\n LIMIT ? , 3`
 
        strana = (strana * 10)-10;

        // Izvršenje querya
        conn.query(query1,[strana],(err,result)=>
        {
            console.log(query1);
            if (err) rej(err);
            else res(result);
        });

    });
}