
const conn = require('../config/db');


/** Vraća korisnika , selektovan pomoću Id-a */
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



/** Vraćanje svih korisnika limitirani i sortirani */
module.exports.vratiSveKorisnike = (offset) =>
{
    return new Promise((res,rej) =>
    {
        var query = `   SELECT * FROM korisnici 
                        ORDER BY ime ASC
                        LIMIT ?,10
                    `
        offset = (offset * 10) - 10;
        conn.query(query,[offset], (err,result) =>
        {
            if (err)        rej(err);
            else            res(result);
        });

    })
}

/** Vraćanje broja korisnika */
module.exports.vratiUkupnoKorisnika = () =>
{
    return new Promise(( res,rej) =>
    {
        var query = `SELECT COUNT(*) as ukupno FROM korisnici`;

        conn.query(query,(err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        })
    });
    
}



/** Azuriranje br_prijavljenih poslova(oglasa) */
module.exports.azurirajBrPrijavljenihZaKorisnika = (korisnikId) =>
{
    return new Promise((res,rej) =>
    {
        var query = `   UPDATE korisnici 
                        SET br_prijavljenih = (SELECT COUNT(*) FROM prijave WHERE korisnik_id = ?)
                        WHERE id = ?
                        `;
        conn.query(query,[korisnikId,korisnikId], (err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        });
    });
}



/** Azuriranje br_postavljenih poslova(oglasa) */
module.exports.azurirajBrPostavljenihZaKorisnika = (korisnikId) =>
{
    return new Promise((res,rej) =>
    {
        var query = `   UPDATE korisnici 
                        SET br_postavljenih = (SELECT COUNT(*) FROM poslovi WHERE korisnik_id = ?)
                        WHERE id = ?
                        `;
        conn.query(query,[korisnikId,korisnikId], (err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        });
    });
}