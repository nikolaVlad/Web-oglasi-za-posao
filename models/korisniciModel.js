
const conn = require('../config/db');


/** Vraća id i ime korisnika , selektovan pomoću Id-a */
module.exports.vratiKorisnika = (id) =>
{
    return new Promise((res,rej) =>
    {
        var query = `SELECT * FROM korisnici WHERE id = ?`;
        
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
        var query = `SELECT * FROM korisnici where email = ?`

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


/** Izmena postojećeg korisnika */
module.exports.izmeniKorisnika = (ime,prezime,lozinka,slika,id) =>
{
    return new Promise((res,rej) =>
    {
        var query = `UPDATE korisnici 
                    SET 
                    ime = ?,
                    prezime = ?,
                    lozinka = ?,
                    slika = ?
                    WHERE id = ?
        `

        conn.query(query,[ime,prezime,lozinka,slika,id], (err,result) =>
        {
            if(err)         rej(err);
            else            res(result);
        })
    })
}


/** Brisanje jednog korisnika */
module.exports.obrisiKorisnika = (id) =>
{
    return new Promise((res,rej) =>
    {
        var query = `DELETE FROM korisnici WHERE id = ?`;

        conn.query(query,[id], (err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        })
    })
}

/** Vraćanje slike korisnika selektovanog pomoću Id-a */
module.exports.vratiSlikuKorisnika = (korisnikId) =>
{
    return new Promise((res,rej) =>
    {
        var query = `SELECT slika FROM korisnici WHERE id = ? `;

        conn.query(query,[korisnikId],(err,result) =>
        {
            if (err)    rej(err);
            else        res(result);  
        });
    });
}


/** Dodavanej nove slike korisniku */
module.exports.dodajSliku = (korisnikId, nazivSlike) =>
{
    return new Promise((res,rej) =>
    {
        var query = `   UPDATE korisnici
                        SET slika = ?
                        WHERE id = ?
                    `;

        conn.query( query ,[nazivSlike,korisnikId], (err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        })
    })
}