// Učitavanje model fajlova :
var korisniciModel = require('../models/korisniciModel');
var posloviModel   = require('../models/posloviModel');
var prijaveModel   = require('../models/prijaveModel');



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


