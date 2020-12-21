// Referenca na konekciju sa bazom
const conn = require('../config/db');

// Učitavanje globalnih funkcija
const globalneFje = require('../globalneFje');



// Vraća limitiran broj poslova 
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

/** Vraća sve poslove iz date kategorije sortirane po datumu ASC/DESC sa Limitom 10 i kljucnom rejcu za pretrazivanje  */
module.exports.vratiPosloveIzKategorijeSort = (idKategorije, kljucnaRec,strana, sortiranje) => //idKategorije, kljucnaRec, sortiranje
{
    return new Promise((res, rej)=>
    {
        var query = `   SELECT * 
                        FROM poslovi    
                        WHERE kategorija_id = ? AND
                        
                        ((
                        naziv LIKE "%${kljucnaRec}%" OR
                        pozeljne_vestine LIKE "%${kljucnaRec}%" OR
                        potrebne_vestine LIKE "%${kljucnaRec}%"))
                        ORDER BY datum ${sortiranje}
                        LIMIT ?,10
                        `

        strana = parseInt((strana * 10) - 10);
        
        conn.query(query,[idKategorije, strana],(err, result)=>
        {
            console.log(query);
            if (err)    rej(err);
            else        res(result);
        });
    });
        
}

/**Vraća sve poslove iz date kategorije, sa kljucnom rečju za pretraživanje, sortirane po br_prijava, DESC */
module.exports.vratiPosloveIzKategorije = (idKategorije, kljucneReci, strana) =>
{
    return new Promise((res,rej) =>
    {
        var query = `
                    SELECT * FROM poslovi 
                    WHERE (( 
                        
                        ${globalneFje.stringZaPretrazivanje(['naziv','pozeljne_vestine','potrebne_vestine'],
                                                            kljucneReci
                        )} 
                        ))


                    AND
                    poslovi.kategorija_id = ?
                    ORDER BY br_prijava DESC
                    LIMIT ?,10
                    `;

        // Pagincaija
        strana = parseInt( strana * 10 - 10);

        // Izvršenje upita
        conn.query(query,[idKategorije,strana], (err, result)=>
        {
            console.log(query);
            if (err)    rej(err);
            else        res(result);
        });
    });
}

  