const conn = require('../config/db');


module.exports.vratiKorisnikeZaPosao = (posaoId) =>
{
    return new Promise((res,rej) =>
    {
        var query = `
                    SELECT korisnici.ime,korisnici.prezime, korisnici.id FROM prijave 
                    INNER JOIN korisnici
                    ON prijave.korisnik_id = korisnici.id
                    WHERE prijave.posao_id = ?
                    `
        conn.query(query,[posaoId], (err,result)=>
        {
            if(err)     rej(err);
            else        res(result);
        })
    })
}