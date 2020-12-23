// Referenca na konekciju sa bazom
const { query } = require('../config/db');
const conn = require('../config/db');

// Vraćanje podataka ----------------------------------------------------------------------

/**Vraca ukupan broj kategorija */
module.exports.vratiBrojKategorija = () =>
{
    return new Promise((res, rej)=>
    {
        
        conn.query( `SELECT COUNT(*) as ukupnoKategorija FROM kategorije`, (err, result) =>
        {
            if(err)     rej(err);
            else        res(result);
        })

    })
    
}


/** Vraća određeni broj kategorija za prikaz na stranici index */
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
            query = `SELECT * FROM kategorije LIMIT ?  `;
        }

        conn.query(query, [limit], (err, result)=>
        {
            console.log(query);
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
            if (err)    rej (err);
            else        res(result);
            
        })
    })
}


/** Vraća sve kategorije sa mogućnostima za : pretraživanje, sortiranje i paginaciju */
module.exports.vratiSveKategorije = (pretrazi, sortiraj, offset) =>
{
    return new Promise((res,rej)=>
    {
        var query = `   SELECT 
                        * FROM kategorije
                        WHERE naziv LIKE'%${pretrazi}%'
                        ORDER BY naziv ${sortiraj}
                        LIMIT ? , 9 `

        offset = (offset  * 10)-10; 
        conn.query(query,[offset], (err,result)=>
        {
            console.log(query);
            if (err)    rej(err);
            else        res(result);
        })
    });
}

/** Vraća naziv jedne kategorije ili nijedne selektovanu pomoću imena */
module.exports.vratiNazivKategorije = (ime) =>
{
    return new Promise((res,rej)=>
    {
        var query = 'SELECT * FROM kategorije WHERE naziv = ?';
        conn.query(query,[ime], (err, resoult)=>
        {
            console.log(query);
            if (err)    rej(err);
            else        res(resoult);
        }) 
    })
}






// end Vraćanje podataka ----------------------------------------------------------------------






// Upisivanje podataka ----------------------------------------------------------------------

/** Upisuje 1 kategoriju u tabeli kategorije */
module.exports.dodajKategoriju = (naziv, kratakOpis, slika) =>
{
    return new Promise((res, rej)=>
    {
        var query = ` 
                        INSERT INTO kategorije(naziv, kratak_opis, slika)
                        VALUES(? , ?, ?)
                    ` 

        conn.query(query, [naziv,kratakOpis,slika], (err,result)=>
        {
            if(err)     rej(err)
            else        res(result);
        })
    })
}

// end Upisivanje podataka ----------------------------------------------------------------------



// Izmena podataka  ----------------------------------------------------------------------

/** Izmenjuje jednu kategoriju u tabeli kategorije selektovanu pomoću id-a*/
module.exports.izmeniKategoriju = (naziv, kratakOpis, slika,id) =>
{
    return new Promise((res, rej) =>
    {
        
        var query =  `
                    UPDATE kategorije 
                    SET naziv = ?,
                    kratak_opis = ?,
                    slika = ?
                    WHERE id = ?
        
                    `;
        
        // Izršavanje upita
        conn.query(query,[naziv,kratakOpis,slika,id],(err,resoult)=>
        {
            if(err)     rej(err);
            else        res(err);

        })
    });
}

// end Izmena podataka  ----------------------------------------------------------------------


// Brisanje podataka  ----------------------------------------------------------------------
module.exports.obrisiKategoriju = (id) =>
{
    return new Promise((res,rej)=>
    {
        var query = 'DELETE FROM kategorije WHERE id = ?';

        conn.query(query,[id],(err,resoult)=>
        {
            console.log('QUERYYYYYY : ' + query)
            if(err)     rej(err);
            else        res(resoult);
        })


    })
}

// Brisanje podataka  ----------------------------------------------------------------------
