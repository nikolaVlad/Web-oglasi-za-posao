// Učitavanje model fajloca

const korisniciModel = require('../models/korisniciModel');

// Hashovanje lozinke
var passwordHash = require('password-hash');


/** Get /registracija */
module.exports.getRegistracija = async (req, res) =>
{
    res.render('./log_reg/registracija', {title : 'Registracija', greska : ''});
}

/** POST /registracija */
module.exports.postRegistracija = async (req,res) =>
{
   // Uzimanje podataka
    var ime = req.body.ime;
    var prezime = req.body.prezime;
    var email = req.body.email;
    var lozinka = req.body.email;
    var slika = 'nema';
   



   /** Provera email-a */
    var proveraEmail = await korisniciModel.vratiKorisnikaSaEmailom(email);
    


    // U slucaju da već postoji takav email 
    if(proveraEmail.length != 0)
    {
        // Pakovanje podataka o korisniuku
        var greska = 
        {
            tekst : 'Ovaj email već postoji!',
            ime : ime,
            prezime : prezime,
            email : email,
            lozinka : lozinka,
            slika : slika
        }
        
        res.render('./log_reg/registracija',{title:'registracija', greska : greska});
    }


    // U slucaju da ne postoji - novi korisnik se upisuhe u bazi
    else
    {
        // Hashovanje lozinke  
            var hashovanaLozinka = passwordHash.generate(lozinka);
        /** Upisivanje korisnika */
            await korisniciModel.dodajKorisnika(ime,prezime,email,hashovanaLozinka,slika);

        // Kreiranje obavetenja kad je registracija uspela
        var obavestenje = {
            text : 'Registracija uspešna!',
            email : email
        }

        // Redirektovanje na login formu
        res.render('./log_reg/logIn', {title: 'Uloguj se', obavestenje : obavestenje});
    }
    // U slučaju da ne postoji - registracija uspešna
    




}