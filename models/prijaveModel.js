// Referenca na konekciu sa bazom
const conn = require('../config/db');


/** Vraća korisnike koji su prijavljeni za određen posao */
module.exports.vratiKorisnikeZaPosao = (posaoId, offset) =>
{
    return new Promise((res,rej) =>
    {

        if(typeof offset != 'undefined')
        {
            var query = `
                        SELECT korisnici.ime,korisnici.prezime, korisnici.id, prijave.status as status FROM prijave 
                        INNER JOIN korisnici
                        ON prijave.korisnik_id = korisnici.id
                        WHERE prijave.posao_id = ?
                        ORDER BY datum DESC
                        LIMIT ?, 5
                        `
            offset = (offset * 5) - 5;
        }

        else
        {
            var query = `   SELECT korisnici.* 
                            FROM prijave 
                            INNER JOIN korisnici
                            ON prijave.korisnik_id = korisnici.id
                            WHERE prijave.posao_id = ?`
        }

        conn.query(query,[posaoId,offset], (err,result)=>
        {
            if(err)     rej(err);
            else        res(result);
        })
    })
}

/** Vraćanje broja prijavljenih korisnika za određeni posao */
module.exports.vratiBrojPrijavljenihKorisnika = (posaoId) =>
{
    return new Promise((res,rej)=>
    {
        var query = `SELECT korisnik_id FROM prijave WHERE posao_id = ?`

        conn.query(query,[posaoId], (err, result)=>
        {
            if(err)     rej(err);
            else        res(result);
        })
    })
}


/** Vraća 1 prijavu za posao */
module.exports.vratiJednuPrijavu = (korisnikId, posaoId) =>
{
    return new Promise((res,rej) =>
    {
        var query = `SELECT * FROM prijave WHERE korisnik_id = ? AND posao_id = ?`

        conn.query(query,[korisnikId,posaoId], (err,result)=>
        {
            if(err)     rej(err);
            else        res(result);
        })
    });
}




/** Nova prijava za posao (od strane korisnika koji konkuriše za posao) */
module.exports.novaPrijava = (korisnikId, posaoId,datum,status) =>
{
    return new Promise((res,rej)=>
    {
        var query = ' INSERT INTO prijave (korisnik_id, posao_id, datum, status) VALUES(?,?,?,?)';

        conn.query(query,[korisnikId,posaoId,datum,status], (err,result)=>
        {
            if (err)       rej(err);
            else           res(err);
        })
    })
}

/** Brisanje prijave za posao (od strane korisnika koji konkuriše za posao) */
module.exports.obrisiPrijavu = (korisnikId,posaoId) =>
{
    return new Promise((res,rej) =>
    {
        var query = `DELETE FROM prijave WHERE korisnik_id = ? AND posao_id = ?`;

        conn.query(query,[korisnikId,posaoId],(err,result) =>
        {
            if (err)    rej(err);
            else        res(result);
        });
    });
}

/** Prihvatanje prijave za posao (od strane korinika koji je postavio oglas). 
 * Params : 
 *          @korisnikId - predstavlja korisnika koji se prijavio na oglas (posao).
 *          @posaoId - predstavlja posao na koji se je prijavio
 *          @datum - kad se desilo prihvatanje.*/
module.exports.prihvatiPrijavu = (korisnikId, posaoId, datum) =>
{
    return new Promise((res,rej) =>
    {
        // Upit koji će promeniti status  posla, koji je prihvaćen i dodati obavestenje.
        var query = `UPDATE prijave 
                    SET status = "prihvaćen",
                        datum = ?
                    WHERE korisnik_id = ? and posao_id = ? `;
        
        conn.query(query, [datum,korisnikId,posaoId], (err,result) =>
        {
            if (err)        rej(err);
            else            res(result);
        });

    })
}
 
 

/** Odbijanje prijave za posao (od strane korinika koji je postavio oglas) 
 * Params : 
 *          @korisnikId - predstavlja korisnika koji se prijavio na oglas (posao).
 *          @posaoId - predstavlja posao na koji se je prijavio
 *          @datum - kad se desilo odbijanje. */
 module.exports.odbijPrijavu = (korisnikId, posaoId,datum) =>
 {
     return new Promise((res,rej) =>
     {
         // Upit koji će promeniti status  posla, koji je prihvaćen i dodati obavestenje.
         var query = `UPDATE prijave 
                     SET status = "odbijen",
                         datum = ?
                     WHERE korisnik_id = ? and posao_id = ? `;
         
         conn.query(query, [datum,korisnikId,posaoId], (err,result) =>
         {
             if (err)        rej(err);
             else            res(result);
         });
 
     })
 }






 /** Vraća limitiran broj poslova, na koje se prijavio određeni korisnik */
 module.exports.vratiPrijavljenePosloveKorisnika = (korisnikId, offset) =>
 {
    return new Promise((res,rej) =>
    {
        if(typeof offset != 'undefined')
        {

        
        var query = `   SELECT poslovi.naziv, poslovi.id,
                        prijave.status as status
                        FROM poslovi 
                        INNER JOIN prijave
                        ON poslovi.id = prijave.posao_id
                        WHERE prijave.korisnik_id = ?
                        ORDER BY prijave.datum ASC
                        LIMIT ?,8
                    `
        }
        else
        {
            query =  `   SELECT poslovi.naziv, poslovi.id,
                        prijave.status as status
                        FROM poslovi 
                        INNER JOIN prijave
                        ON poslovi.id = prijave.posao_id
                        WHERE prijave.korisnik_id = ?
                        ORDER BY prijave.datum ASC
                    `
        }

        offset = (offset * 8) - 8;

        conn.query(query,[korisnikId, offset], (err,result) =>
        {
            if (err)        rej(err);
            else            res(result);
        })
    });
 }


 /** Vraćanje statusa prijave za ulogovanog korisnika i posla na koji je pristigao */
 module.exports.vratiStatus = (korisnikId, posaoId) =>
 {
     return new Promise((res,rej) =>
     {
        var query = `SELECT status FROM prijave WHERE korisnik_id = ? AND posao_id = ?`;

        conn.query(query,[korisnikId,posaoId],(err,result) =>
            {
                if(err)     rej(err);
                else        res(result);
            })
     })
 }


 /** Brisanje svih prijava za posao, na koje se prijavio odredjeni korisnik */
 module.exports.obrisiPrijave = (korisnikId) =>
 {
     return new Promise((res,rej) =>
     {
        var query = `DELETE FROM prijave WHERE korisnik_id = ?`;

        conn.query(query,[korisnikId],(err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        })
     });
 }



/** SLOZENI upit : Brisanje svih prijava koje se odnose na te poslove, koje je postavio odredjeni korisnik*/
module.exports.obrisiPrijaveZaPosloveKorisnika = (korisnikId) =>
{
    return new Promise( (res,rej) =>
    {
        // SLOŽENI UPIT (Tabele : poslovi, prijave)
        var query = `   DELETE prijave.*
                        FROM poslovi 
                        INNER JOIN prijave
                        ON poslovi.id = prijave.posao_id
                        WHERE poslovi.korisnik_id = ?
                    `;



        conn.query(query,[korisnikId],(err,result)=>
        {
            if (err)    rej(err);
            else        res(result);
        })
    });
}



/** SLOZENI upit : Brisanje svih prijava za posao iz određene kategorije */
module.exports.obrisiPrijaveZaPosloveIzKategorije = (kategorijaId) =>
{
    return new Promise((res,rej) =>
    {
        // Slozeni upit
        var query = ` DELETE prijave.*
                     FROM prijave 
                     INNER JOIN poslovi
                     ON prijave.posao_id = poslovi.id
                     WHERE poslovi.kategorija_id = ?`;
        conn.query(query,[kategorijaId],(err,result) =>
        {
            if (err)    rej(err);
            else        res(result);
        })
    })
}


/** Brisanje svih prijavljenih poslova selektovanih pomoću id posla */
module.exports.obrisiPrijaveZaPosao = (posaoId) =>
{
    return new Promise((res,rej) =>
    {
        var query = `DELETE FROM prijave WHERE posao_id = ?`;

        conn.query(query,[posaoId], (err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        });
    })
}