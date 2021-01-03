// Učitavanje model fajlova :
var korisniciModel = require('../models/korisniciModel');
var posloviModel   = require('../models/posloviModel');
var prijaveModel   = require('../models/prijaveModel');

// Hashovanje lozinke
var bcrypt = require('bcrypt');


/** Get /svi_korisnici */
module.exports.getSviKorisnici = (req, res)=>
{
    res.render('./korisnici/svi_korisnici', {title : 'Svi korisnici'});
}

/** Get /svi_korisnici/profil/<id> */
module.exports.getKorisnik = async (req,res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }

    
    /** Paginacija  */
        // Racunanje trenutne strane (Koji će sluziti kao limit u bazi)
        var trenutnaStrana = parseInt(req.query.strana);
        if (isNaN(trenutnaStrana) || trenutnaStrana === 0)
        {
            trenutnaStrana = 1;
        }

        // Racunanje pretgodne i sledece strane 
        var prethodnaStrana = new Number(trenutnaStrana - 1);
        var sledecaStrana =   new Number(trenutnaStrana + 1);







    // Uzimanje id korisnika
    var id = req.params.id;

    // Uzimanje parametra za prikaz oglasi-menija
        var oglasiMeni = ( typeof req.query.oglasiMeni == 'undefined' || req.query.oglasiMeni != 'prijavljeni') 
        ? 'aktivni' : req.query.oglasiMeni;


        console.log(oglasiMeni);
    
    // Mogućnost da samo ulogovani korisnik (i admin ) može da vidi prijavljene oglase
    if(oglasiMeni != 'aktivni' && (ulogovaniKorisnik.id != id && ulogovaniKorisnik.rola != 'admin'))
    {
        oglasiMeni = 'aktivni';
    }

 
    // Iscitavanje postavljenih i prijavljenih oglasa
    var oglasi = ''
    var ukupno = ''

    /** Postavljeni (Aktivni) oglasi (poslovi):  */
    if(oglasiMeni == 'aktivni')
    {
        // Prikaz oglasa koje je postavio određeni korisnik
        oglasi = await posloviModel.vratiSvePosloveZaKorisnika(id,trenutnaStrana);
        ukupno = await posloviModel.vratiSvePosloveZaKorisnika(id);
    }

    /** Prijavljeni oglasi(oglasi): */
    else
    {
        // Prikaz oglasa na koje se prijavio određeni korisnilk
        oglasi = await prijaveModel.vratiPrijavljenePosloveKorisnika(id,trenutnaStrana);
        ukupno = await prijaveModel.vratiPrijavljenePosloveKorisnika(id);
    }


    

    /** Upit ka bazi za vraćanje korisnika */
    var korisnik = await korisniciModel.vratiKorisnika(id);


    // Ako korisnik ne postoji 
    if(korisnik.length == 0)
    {
       return res.render('error_404',{title : 'Page not found - wop'});
    }

    

    res.render('./korisnici/korisnik', {
                title : 'Profil', 
                korisnik : korisnik,
                oglasiMeni : oglasiMeni,
                ulogovaniKorisnik : ulogovaniKorisnik,
                oglasi : oglasi,
                strana : trenutnaStrana,
                sledecaStrana : sledecaStrana,
                prethodnaStrana : prethodnaStrana,
                ukupno : ukupno.length
            });
}


/** Get /svi_korisnici/profil/<id>/izmena_profila */
module.exports.getIzmenaProfila = async(req,res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }

    // Uzimanje id-a korisika
    var id = req.params.id;

    // Redirektovanje ako ulogovaniKorisnik nije isti kao i korisnik za izmenu (osim ako nije admin)
    if(ulogovaniKorisnik.id != id && ulogovaniKorisnik.rola != 'admin')
    {
        res.redirect(`/svi_korisnic/profil/${id}`);
    }


    
    /** Iscitavanje podataka o korisiku */
        var korisnik = await korisniciModel.vratiKorisnika(id);

   



    



    res.render('korisnici/izmena_korisnika',{
        title : 'Izmena profila',
        korisnik : korisnik
        });
}



/** POST /svi_korisnici/profil/<id>/izmena_profila */
module.exports.postIzmenaProfila = async (req, res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;


    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }


    // Uzimanje id korisnika
    var id = req.params.id;

    // Redirektovanje ako ulogovaniKorisnik nije isti kao i korisnik za izmenu
    if(ulogovaniKorisnik.id != id && ulogovaniKorisnik.rola != 'admin')
    {
        res.redirect(`/svi_korisnic/profil/${id}`);
    }


    // Uzimanej podataka poslati putem forme
    var slika = '';
    var ime = req.body.ime;
    var prezime = req.body.prezime;
    // Email nema pravo da se menja
    var lozinka = req.body.lozinka;
    var novaLozinka = req.body.novaLozinka;
  


    /** Isčitavanje korisnika iz baze radi provere lozinke */
        var korisnik = await korisniciModel.vratiKorisnika(id);

    
    // U slučaju da je stara lozinka koaj je uneta neispravna 
    if(bcrypt.compareSync(lozinka,korisnik[0].lozinka) == false)
    {
        // Modifikovanje korisnika
        korisnik[0].ime = ime;
        korisnik[0].prezime = prezime;
        var greska = {
            text : 'Neispravna lozinka.',
        }

        // Renderovanje odgovarajuće stranice
        res.render(`korisnici/izmena_korisnika`, {
            title : 'Izmena profila',
            greska : greska,
            korisnik : korisnik
        });

    }

    // U slučaju da je uneta lozinka okej

    // Hashovanje nove lozinke
    novaLozinka = bcrypt.hashSync(novaLozinka,3);
    


    /** Izmena korisnika u tabeli korisnici */
    console.log(await korisniciModel.izmeniKorisnika(ime,prezime,novaLozinka,slika,id));

    // Uspesna izmena korisnika, redirektujemo ga na svoj profil
    res.redirect(`/svi_korisnici/profil/${id}`);

    
}




/** POST /svi_korisnici/profil/<id>/brisanje_profila */
module.exports.postBrisanjeProfila = async (req,res) =>
{
    /** Rola */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        // Redirect na logIn stranicu]
        return res.redirect('/logIn');
    }

    // Uzimanje id korisnika za brisanje
    var id = req.params.id;


    // Ako ulogovani korisnik i korisnik za brisanje nisu isti i ako rola nije admin
    if(ulogovaniKorisnik.id != id && ulogovaniKorisnik.rola != 'admin')
    {
        return res.redirect(`/svi_korisnici/profil/${id}`);
    }

    
    /** Ažuriranje kolone br_prijava, za sve poslove, na koje se korisnik prijavio */
        //console.log(await posloviModel.)


    /** Upit za brisanje svih prijava za posao, na koje se prijavio korisnika */
        console.log(await prijaveModel.obrisiPrijave(id));

    /** SLOZENI Upit za brisanje svih prijava za poslove koje je postavio korisnik */
        console.log(await prijaveModel.obrisiPrijaveZaPosloveKorisnika(id));

    /**  Upit za brisanje svih postavljenih poslova(oglasa) korisnika i brisanje prijava za te poslove */
        console.log(await posloviModel.obrisiPosloveKorisnika(id));

    /** Upit za brisanje korisnika */
        console.log(await korisniciModel.obrisiKorisnika(id));



    // Redirektovanje na stranici logIn ako admin nije ulogovan
    if(ulogovaniKorisnik.rola != 'admin')
    {
        // Brisanje sesije
        req.session.destroy((err) => {
            res.redirect('/logIn'); 
          })
    }




    // Redirektovanje na stranici svi_korisnici ako je admin 
    if(ulogovaniKorisnik.rola == 'admin')
    {
        res.redirect('/svi_korisnici');
    }
    
}