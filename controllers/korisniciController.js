// Učitavanje model fajlova :
var korisniciModel = require('../models/korisniciModel');
var posloviModel   = require('../models/posloviModel');
var prijaveModel   = require('../models/prijaveModel');

// Hashovanje lozinke
var bcrypt = require('bcrypt');

// Upload slike
var formidable = require('formidable');

// Rad sa path-ovima
var path = require('path');

// Brisanje stare slike
var fs = require('fs');


/** Get /svi_korisnici */
module.exports.getSviKorisnici = async (req, res)=>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;


  
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






    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }


    /** Upit za izlistavanje svih korisnika sa limitom i offsetom sortirani po ABC */
        var korisnici = await korisniciModel.vratiSveKorisnike(trenutnaStrana);

    /** Upit za prebrojavanje svih korisnika */
        var ukupno = await korisniciModel.vratiUkupnoKorisnika();
        ukupno = ukupno[0].ukupno;
      


    res.render('./korisnici/svi_korisnici', {
        title : 'Svi korisnici',
        korisnici : korisnici,
        strana : trenutnaStrana,
        prethodnaStrana : prethodnaStrana,
        sledecaStrana : sledecaStrana,
        ukupno : ukupno,
        ucitani : korisnici.length,
        ulogovaniKorisnik : ulogovaniKorisnik
        });
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
    
    // Mogućnost da samo ulogovani korisnik (i admin ) može da vidi prijavljene oglase
    if(oglasiMeni != 'aktivni' && (ulogovaniKorisnik.id != id && ulogovaniKorisnik.rola != 'admin'))
    {
        oglasiMeni = 'aktivni';
    }


    /** Upit ka bazi za vraćanje korisnika */
    var korisnik = await korisniciModel.vratiKorisnika(id);


    // Ako korisnik ne postoji 
    if(korisnik.length == 0)
    {
       return res.render('error_404',{title : 'Page not found - wop', ulogovaniKorisnik : ulogovaniKorisnik});
    }

    



 
    // Iscitavanje postavljenih i prijavljenih oglasa
    var oglasi = ''
    var ukupno = ''

    /** Postavljeni (Aktivni) oglasi (poslovi):  */
    if(oglasiMeni == 'aktivni')
    {
        // Prikaz oglasa koje je postavio određeni korisnik
        oglasi = await posloviModel.vratiSvePosloveZaKorisnika(id,trenutnaStrana);
        ukupno = korisnik[0].br_postavljenih;
    }

    /** Prijavljeni oglasi(oglasi): */
    else
    {
        // Prikaz oglasa na koje se prijavio određeni korisnilk
        oglasi = await prijaveModel.vratiPrijavljenePosloveKorisnika(id,trenutnaStrana);
        ukupno = korisnik[0].br_prijavljenih;
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
                ukupno : ukupno,
                prikazaniOglasi : oglasi.length
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
        korisnik : korisnik,
        ulogovaniKorisnik : ulogovaniKorisnik
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
            korisnik : korisnik,
            ulogovaniKorisnik : ulogovaniKorisnik
        });

    }

    // U slučaju da je uneta lozinka okej

    // Hashovanje nove lozinke
    novaLozinka = bcrypt.hashSync(novaLozinka,3);
    


    /** Izmena korisnika u tabeli korisnici */
    console.log(await korisniciModel.izmeniKorisnika(ime,prezime,novaLozinka,id));

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
  
    /** Čuvanje svih poslova na koje se prijavio korisnik, radi ažuriranja */
        var posloviP = await prijaveModel.vratiPrijavljenePosloveKorisnika(id);

    /** Upit za brisanje svih prijava za posao, na koje se prijavio korisnik */
        console.log(await prijaveModel.obrisiPrijave(id));
    
    /** Algoritam za ažuriranje kolone br_prijava svih poslova na koje se prijavio korisnik */
        for (posao of posloviP)
        {
            await posloviModel.azurirajBrPoslova(posao.id);
        }

    //ALGORITAN za cuvanje korisnika koju su se bili prijavili na neke od poslova  korisnika za koga je pristigao zahtev za brisanje
        // Korisnici koji su se prijavili na neki od posao korisnik koji ce biti obrisan
        var osteceniKorisnici = [];
        // Vraćeni poslovi koje je postavio korisnik koji će biti obrisan 
        var sviPoslovi = await posloviModel.vratiSvePosloveZaKorisnika(id); 
        // Prolaz kroz te poslove da bi se našli korisnici koji su se prijavili za te poslove
        for(posao of sviPoslovi)
        {

             // Vraća korisnike koji su se prijavili za jedan od poslova korisnika koji će bit iobrisan
            var korisnici = await prijaveModel.vratiKorisnikeZaPosao(posao.id);
            // Prolaz kroz sve vraćene korisnik, da bi se sačuvali za kasnije
            for(korisnik of korisnici)
            {
                // Čuvanje oštećenih korisnika u nizu u kome će kasnije kolona br_prijavljenih svakog korisnika,
                // biti ažurirana.
                osteceniKorisnici.push(korisnik);
            }
        }
        
    // Kraj algoritma : korisnici sacuvani i kasnije ce se upotrebiti

    /** SLOZENI Upit za brisanje svih prijava za poslove koje je postavio korisnik */
        console.log(await prijaveModel.obrisiPrijaveZaPosloveKorisnika(id));



    /**  Upit za brisanje svih postavljenih poslova(oglasa) korisnika */
        console.log(await posloviModel.obrisiPosloveKorisnika(id));


    /** Upit za azuriranje kolone br_prijavljenih poslova, korisnika(Sačuvani preko algoritma) koju su bili prijavljeni na neki od poslova obrisanog korisnika  */
        for(korisnik of osteceniKorisnici)
        {
            await korisniciModel.azurirajBrPrijavljenihZaKorisnika(korisnik.id);
        }



    /** Algoritam za brisanje slike korisnika, sa servera */
        // Vraćanje imena slike 
        var slika = await korisniciModel.vratiSlikuKorisnika(id);
        slika = slika[0].slika;   
        // Ako ime slike postoji
        if(slika.length != 0)
        {

            // Brisanje slike
            var path = require('path');
            var fs   = require('fs');

            fs.unlinkSync(path.join(__dirname,'..','public','images','uploads','korisnici',slika));
            console.log('Slika korisnika obrisana.');
        }


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
    else 
    {
        res.redirect('/svi_korisnici');
    }
    
}



// Izmena slike 

/** get /svi_korisnici/profil/:id/slika */
module.exports.getSlika = async (req,res) =>
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


    // Ako ulogovani korisnik i korisnik cija se slika menja nisu isti
    if(ulogovaniKorisnik.id != id && ulogovaniKorisnik.rola != 'admin')
    {
        res.redirect(`/svi_korisnici/profil/${id}`);
    }

    /** Upit za vraćanje korisnika */
        var korisnik = await korisniciModel.vratiKorisnika(id);



    res.render('korisnici/dodavanjeSlike',{
        title : 'Slika profila',
        korisnik : korisnik,
        ulogovaniKorisnik : ulogovaniKorisnik
        });
}



/** POST /svi_korisnici/profil/:id/slika */
module.exports.postSlika = async (req,res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;


    // Ako koroisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }

    // Uzimanje id korisnika
    var id = req.params.id;


    // Ako ulogovani korisnik i korisnik ko menja/dodaje sliku nisu isti
    if(ulogovaniKorisnik.id != id && ulogovaniKorisnik.rola != 'admin')
    {
        res.redirect(`/svi_korisnici/profil/${id}`);
    }

    // Vracanje korisnika
    var korisnik = await korisniciModel.vratiKorisnika(id);



    // Stara slika
    var staraSlika = korisnik[0].slika;
    // Nova slika
    var slika = '';

    // Parsiranje request-a, gde je poslata slika
    var form = new formidable.IncomingForm();
    form.parse(req);

    // Handlovanje događaja koji prestavlja da je slika pristigla
    form.on('fileBegin', async function (name, file)
    {

        // U slučaju da je slika ispravna
        if( file.name && file.name.match(/\.(jpg|jpeg|png)$/i) )
        {
            // Čuvanje jedinstvenog imena slike
            slika = Date.now() + file.name;

            file.path = path.join(__dirname,'..','public','images','uploads','korisnici',slika);

            /** Upit za čuvanje slike u bazu */
                 await korisniciModel.dodajSliku(id,slika);

            // Brisanje stare slike ako ona postoji
            if(staraSlika.length != 0)
            {
                fs.unlinkSync(path.join(__dirname,'..','public','images','uploads','korisnici',staraSlika));
                console.log('Stara slika obrisana.');
            }
            console.log('Promena slike uspesna!');  
        }
    });

    
   

    // Redirektovanje korisnika na početnoj strani ako je tu 1. put
    if(req.session.prviPut == true)
    {
        req.session.save( function(err) 
        {
            req.session.reload( function (err) 
            {
                req.session.ulogovaniKorisnik.slika = (slika != '') ? slika : staraSlika;
                res.redirect('/');
            });
        });

    }
       
   
    // U suprotnom redirektovanje korisnika na starnici svog profila
    else 
    {
        req.session.save( function(err) 
        {
            req.session.reload( function (err) 
            {
                req.session.ulogovaniKorisnik.slika = (slika != '') ? slika : staraSlika;
                res.redirect(`/svi_korisnici/profil/${ulogovaniKorisnik.id}`); 
            });
        });
       
    }
}

/** POST /svi_korisnici/profil/<id>/rola */
module.exports.postRola = async (req,res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;
    
    // Ako se desi da ulogovani korisnik nije admin (ili nije ulogovan)
    if(!ulogovaniKorisnik || ulogovaniKorisnik.rola != 'admin')
    {
        res.redirect('/');
    }

    // Uzimanje role korisnika
    var id = req.params.id;

    // Vraćanje korisnika
    var korisnik = await korisniciModel.vratiKorisnika(id);

    // Uzimanje role korisnika
    var rola = korisnik[0].rola;

    // Promena role
    rola = (rola == 'admin') ? 'korisnik' : 'admin';

    console.log('Nova rola : ' + rola);

    /** Upit bazi za promenu role korisnika  */
        await korisniciModel.promeniRoluKorisnika(id,rola);
    
    res.redirect('/svi_korisnici');
}
