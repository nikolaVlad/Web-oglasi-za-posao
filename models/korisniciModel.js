
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

/** Vraća korisnika selektovanog pomoću email-a */
module.exports.vratiKorisnikaSaEmailom = (email) =>
{
    return new Promise((res,rej)=>
    {
        var query = `SELECT email FROM korisnici where email = ?`

        conn.query(query,[email],(err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        })
    })
}


/** Dodavanje novog korisnika */
module.exports.dodajKorisnika = (ime,prezime,email,lozinka,slika) =>
{
    return new Promise((res,rej)=>
    {
        var query = ` INSERT INTO korisnici(ime,prezime,email,lozinka,slika,br_prijavljenih,br_postavljenih,rola)
                      VALUES(? , ? , ? , ? , ? , ? , ? , ?)
        `;

        conn.query(query,[ime,prezime,email,lozinka,slika,0,0,'korisnik'], (err,result) =>
        {
            if (err)     rej(err);
            else        res(result);
        });
    });
}