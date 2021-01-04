// Učitavanje model fajloca

const korisniciModel = require('../models/korisniciModel');

// Hashovanje lozinke
var bcrypt = require('bcrypt');



/** Get /registracija */
module.exports.getRegistracija = async (req, res) =>
{   
    /** Rola */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(ulogovaniKorisnik)
    {
        res.redirect('/');
    }

    res.render('./log_reg/registracija', {title : 'Registracija', greska : ''});
}

/** POST /registracija */
module.exports.postRegistracija = async (req,res) =>
{
   // Uzimanje podataka
    var ime = req.body.ime;
    var prezime = req.body.prezime;
    var email = req.body.email;
    var lozinka = req.body.lozinka;
    var slika = ''; 
    

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


    // U slucaju da ne postoji - novi korisnik se upisuje u bazi
    else
    {
        // Hashovanje lozinke  
            var hashovanaLozinka = bcrypt.hashSync(lozinka,3); 

        /** Upisivanje novnog korisnika u bazi */
            var noviKorisnik = await korisniciModel.dodajKorisnika(ime,prezime,email,hashovanaLozinka,slika);

        
        /** Upisivanje novnog korisnika u sesiji */
            req.session.ulogovaniKorisnik = await korisniciModel.vratiKorisnikaSaEmailom(email);
            req.session.ulogovaniKorisnik = req.session.ulogovaniKorisnik[0];

        /** Promenljiva koja će služiti da korisniku koji se prvi put registruje na sajt - prikaže obaveštenje */
            req.session.prviPut = true;



        // Redirektovanje korisnika na sledeci korak registracije - gde dodaje sliku profila
            return res.redirect(`/svi_korisnici/profil/${req.session.ulogovaniKorisnik.id}/slika`);
            

    }

}