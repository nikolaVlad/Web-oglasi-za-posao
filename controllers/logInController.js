// Učitavanje model fajlova
var korisniciModel = require('../models/korisniciModel');

// Hashovanje lozinke
var bcrypt = require('bcrypt');



/** Get /logIn */
module.exports.getLogIn = async (req, res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako je korisnik već ulogovan
    if(ulogovaniKorisnik)
    {
        res.redirect('/');
    }

    res.render('./log_reg/logIn', {title : 'Uloguj se', obavestenje: '', greska: ''});
}

/** POST /logIn */
module.exports.postLogIn = async(req,res) =>
{   
    // Uzimanje podataka iz forme
        var email = req.body.email;
        var lozinka = req.body.lozinka;

    /**  Identifikacija korisnika pomoću maila */
        var korisnik = await korisniciModel.vratiKorisnikaSaEmailom(email);

    // Provera da li korisnik postoji 

    // U sličaju da email nije ispravan
    if(korisnik.length == 0)
    {
        // generisanje greske
        var greska = 
        {
            textEmail : 'Neispravna e-mail adresa!',
            textLozinka : '',
            email : email,
            lozinka : lozinka
        }
        
        res.render('./log_reg/login',{title:'Uloguj se' , obavestenje : '', greska : greska})
    }


    // U slučaju da je email ispravan
    else
    {
        // Provera lozinke
        // Neispravno 
        if(bcrypt.compareSync(lozinka,korisnik[0].lozinka) == false)
        {
            var greska = 
            {
                textEmail : '',
                textLozinka : 'Neistavna lozinka!',
                email : email,
                lozinka : lozinka
            }
            
            res.render('./log_reg/login',{title:'Uloguj se' , obavestenje : '', greska : greska})
        }

        // Isptavno - Loguje se korisnik u sesiji
        else
        {

            // Upisivanje korisnika u sesiji :
            req.session.ulogovaniKorisnik = await korisniciModel.vratiKorisnikaSaEmailom(email);
            req.session.ulogovaniKorisnik = req.session.ulogovaniKorisnik[0];

            // Redirektovanje na index stranici
            res.redirect('/');
        }
    }


}

