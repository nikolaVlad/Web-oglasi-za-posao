// Referenca na konekciju sa bazom
const e = require('express');
const conn = require('../config/db');

// Učitavanje globalnih funkcija
const globalneFje = require('../globalneFje');



// Vraća limitiran broj poslova 
module.exports.vratiPoslove = (limit,offset) =>
{
    return new Promise((res, rej)=>
    {
        var query;

        if(typeof limit == 'undefined')
        {
            query = `SELECT * FROM poslovi`;
        }

        if(typeof offset == 'undefined')
        {
            query = 'SELECT * FROM poslovi ORDER BY br_prijava DESC  LIMIT ?';
        }

        else
        {
            query = `SELECT * FROM poslovi ORDER BY br_prijava DESC LIMIT ?,?`;
            offset = (offset * 10) - 10;
        }
        

        if (typeof offset == 'undefined' || typeof limit == 'undefined')
        {
            conn.query(query,[limit], (err,result)=>
            {
                console.log(query);
                if(err) rej(err);
                else    res(result);
            });
        }

        else
        {
            conn.query(query,[offset,limit], (err,result)=>
            {
                console.log(query);
                if(err) rej(err);
                else    res(result);
            });
        }



    });
}

/** Vraća sve poslove iz date kategorije sortirane po datumu ASC/DESC sa Limitom 10 i kljucnom rejcu za pretrazivanje  */
module.exports.vratiPosloveIzKategorijeSort = (idKategorije, kljucneReci,strana, sortiranje) => //idKategorije, kljucnaRec, sortiranje
{
    return new Promise((res, rej)=>
    {
        var query = `   SELECT * 
                        FROM poslovi    
                        WHERE kategorija_id LIKE ? AND
                        
                        ((
                            ${globalneFje.stringZaPretrazivanje(['naziv','pozeljne_vestine','potrebne_vestine'],
                                                            kljucneReci
                        )} 
                        ))
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
                    poslovi.kategorija_id LIKE ?
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


/** Vraća 1 posao selektovan pomoću id-a */
module.exports.vratiPosao = (id) =>
{
    return new Promise((res,rej)=>
    {
        var query = ` SELECT * FROM poslovi WHERE id = ?`;

        conn.query(query,[id],(err,result)=>
        {
            if(err)     rej(err);
            else        res(result);
        })
    })
}


/** Vraća posao selektovan pomoću naziva i id kategorije */
module.exports.vratiPosaoIzKategorijeSaNazivom = (naziv,kategorijaId) =>
{
    return new Promise((res,rej) =>
    {
        var query = `SELECT * FROM poslovi WHERE naziv = ? AND kategorija_id = ?`;

        conn.query(query,[naziv,kategorijaId],(err,result)=>
        {
            if(err)     rej(err);
            else        res(result);
        });
    })
}




/** Upisuje 1 novog oglasa(posla) u tabeli poslovi */
module.exports.dodajPosao = (naziv, kratakOpis, punOpis, potrebneVestine,pozeljneVestine,datum,kategorijaId,korisnikId,brPrijava) =>
{
    return new Promise((res,rej) =>
    {
        var query = `
                INSERT INTO poslovi(naziv, kratak_opis,pun_opis,potrebne_vestine,pozeljne_vestine,datum,kategorija_id,korisnik_id,br_prijava)
                VALUES(?,?,?,?,?,?,?,?,?)
                `
        conn.query(query,
            [naziv,kratakOpis,punOpis,potrebneVestine,pozeljneVestine,datum,kategorijaId,korisnikId,brPrijava],
            (err,result)=>
            {
                if(err)     rej(err);
                else        res(result);
            })

    });
}


/** Izmena 1 posla(oglasa) u tabeli poslovi */
module.exports.izmeniPosao = (naziv,kratakOpis,punOpis,potrebneVestine,pozeljneVestine,datum,kategorijaId, id) =>
{
    return new Promise((res,rej) =>
    {
        var query = `
                        UPDATE poslovi 
                        SET naziv = ?,
                        kratak_opis = ?,
                        pun_opis = ?,
                        pozeljne_vestine = ?,
                        potrebne_vestine = ?,
                        datum = ?,
                        kategorija_id = ?

                        WHERE id = ?
                    `

        conn.query(query, [naziv,kratakOpis,punOpis,pozeljneVestine,potrebneVestine,datum,kategorijaId,id],
            (err,result)=>
            {
                if (err)    rej(err);
                else        { res(result)};
            });
    })
}

/** Brisanje 1 posla(oglasa) u tabeli poslovi */
module.exports.obrisiPosao = (id) =>
{
    return new Promise((res,rej)=>
    {
        var query = `DELETE FROM poslovi WHERE id = ?`;

        conn.query(query,[id],(err,result)=>
        {
            if (err)    rej(err);
            else        res(result);
        })
    });
}


/** Brisanje svih poslova iz kategorije  */
module.exports.obrisiPosloveIzKategoriju = (idKategorije) =>
{
    return new Promise((res, rej)=>
    {
        var query = `DELETE FROM poslovi WHERE kategorija_id = ?`;

        conn.query(query,[idKategorije], (err,result) =>
        {
            if(err)     rej(err);
            else        res(result);
        });

    });
}

/** Brisanje svih poslova odredjenog korisnika selektovanog pomoću Id-a */
module.exports.obrisiPosloveKorisnika = (korisnikId) =>
{
    return new Promise( (res,rej) =>
    {
        var query = `DELETE FROM poslovi WHERE korisnik_id = ?`;
        conn.query(query,[korisnikId],(err,result)=>
        {
            if (err)    rej(err);
            else        res(result);
        })
    });
}




 /** Vraća limitiran br poslova, koje je postavio određeni korisnik selektovane pomoću korisnik.id */
 module.exports.vratiSvePosloveZaKorisnika = (korisnikId, offset) =>
 {
     return new Promise((res, rej) =>
     {

        if(typeof offset != 'undefined')
        {
            var query = `  SELECT poslovi.naziv, poslovi.id
                            FROM poslovi 
                            INNER JOIN korisnici 
                            ON poslovi.korisnik_id = korisnici.id 
                            WHERE poslovi.korisnik_id = ?
                            ORDER by datum DESC 
                            LIMIT ?,8
                        `
            offset = (offset * 8) - 8;
        }

        else
        {
            var query = ` SELECT poslovi.naziv, poslovi.id
                            FROM poslovi 
                            INNER JOIN korisnici 
                            ON poslovi.korisnik_id = korisnici.id 
                            WHERE poslovi.korisnik_id = ?
                            ORDER by datum DESC 
                        `
        }


        conn.query(query,[korisnikId,offset], (err,result) =>
        {
            if (err)    rej(err);
            else        res(result);
        })
     })
 }



 /** Izmmena (ažuriranje) kolone br_poslova za jedan posao selektovan pomoću id posla */
 module.exports.azurirajBrPoslova = (posaoId) =>
 {
     return new Promise((res,rej) =>
     {
         var query = `  UPDATE poslovi 
                        SET 
                        br_prijava = (SELECT COUNT(posao_id) FROM prijave WHERE posao_id = ?)
                        WHERE id = ?
         `;

         conn.query(query,[posaoId,posaoId], (err,result)=>
         {
             if(err)        rej(err);
             else           res(result);
         })

     })
 }

module.exports.azurirajBrPolsovaZaKorisnika = (korisnikId) =>
{
    return new Promise((res,rej) =>
    {
       
       
    })
}
