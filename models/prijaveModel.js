const { queue } = require('jquery');
const conn = require('../config/db');


/** Vraća korisnike koji su prijavljeni za određen posao */
module.exports.vratiKorisnikeZaPosao = (posaoId, offset) =>
{
    return new Promise((res,rej) =>
    {
        var query = `
                    SELECT korisnici.ime,korisnici.prezime, korisnici.id FROM prijave 
                    INNER JOIN korisnici
                    ON prijave.korisnik_id = korisnici.id
                    WHERE prijave.posao_id = ?
                    LIMIT ?, 5
                    `
        offset = (offset * 5) - 5;
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




/** Nova prijava za posao  */
module.exports.novaPrijava = (korisnikId, posaoId,datum,status,obavestenje) =>
{
    return new Promise((res,rej)=>
    {
        var query = ' INSERT INTO prijave (korisnik_id, posao_id, datum, status, obavestenje) VALUES(?,?,?,?,?)';

        conn.query(query,[korisnikId,posaoId,datum,status,obavestenje], (err,result)=>
        {
            if (err)       rej(err);
            else           res(err);
        })
    })
}

/** Brisanje prijave za posao */
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

