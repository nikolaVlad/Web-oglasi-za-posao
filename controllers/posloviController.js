// Učitavanje potrebnih model fajlova
var posloviModel = require('../models/posloviModel');

var kategorijeModel = require('../models/kategorijeModel');

var korisniciModel = require('../models/korisniciModel');

var prijaveModel = require('../models/prijaveModel');

/**Get /svi_poslovi */
module.exports.getSviPoslovi = async(req, res) =>
{
   


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

    
     /** Filtriranje i pretrazivanje */

        // Kljucne reci
        var kljucneReci = ( typeof req.query.kljucneReci != 'undefined') ?
                            req.query.kljucneReci.split(',') : [''];
        
        // Sortiranje
        var sortiranje = (typeof req.query.sortiranje != 'undefined') ? 
                           req.query.sortiranje : 'br_prijava'; 

    /** Izlistavanje svih kategorija za padajući meni */
        var sveKategorije = await kategorijeModel.vratiNaziviIdKategorije();
        
    
    /** Uzimanje izabranje kategorije */
        var kategorijaId = req.query.kategorijaId;

    /** Izlistavanje poslova */
        // U slucaju da nije izabrana kategorija
        if(typeof kategorijaId == 'undefined' || kategorijaId == 'sve')
        {
            // Izlistaj poslove iz svih kategorija, odnosno sve poslove
            if(sortiranje == 'desc' || sortiranje == 'desc')
            {
                var poslovi = await posloviModel.vratiPosloveIzKategorijeSort('%%',kljucneReci,trenutnaStrana,sortiranje);
            }
            else
            {
                var poslovi = await posloviModel.vratiPosloveIzKategorije("%%",kljucneReci,trenutnaStrana);
            }
            
        }

        // U slucaju da je izabrana kategorija
        else
        {
            // Izlistaj poslove iz svih kategorija, odnosno sve poslove
            if(sortiranje == 'desc' || sortiranje == 'desc')
            {
                var poslovi = await posloviModel.vratiPosloveIzKategorijeSort(kategorijaId,kljucneReci,trenutnaStrana,sortiranje);
            }
            else
            {
                var poslovi = await posloviModel.vratiPosloveIzKategorije(kategorijaId,kljucneReci,trenutnaStrana);
            }
        }

        
        // Dodavanje novog svojstca poslovima, koje predstavlja kategoriju u kojoj dati posao pripada.
            for(posao of poslovi)
            {
                var p = await kategorijeModel.vratiNaziviIdKategorije(posao.kategorija_id);
                posao.nazivKategorije = p[0].naziv;
            }

        // Računanje isčitanih i ukupan broj podataka
            var ukupnoPoslova = await posloviModel.vratiPosloveIzKategorije("%%",[''],1);
            




    res.render('./poslovi/svi_poslovi', {
        title : 'Svi poslovi',
        sveKategorije : sveKategorije,
        poslovi : poslovi,
        kljucneReci : kljucneReci,
        kategorijaId : kategorijaId,
        sortiranje : sortiranje,
        kategorijaId : kategorijaId,
        strana : trenutnaStrana,
        sledecaStrana : sledecaStrana,
        prethodnaStrana : prethodnaStrana,
        ukupnoPoslova : ukupnoPoslova.length,
        prikazaniPoslovi : poslovi.length * trenutnaStrana, 
    })
    
    
}

/** Get /svi_poslovi/posao/<id> */
module.exports.getPosao = async (req,res) =>
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





    // Dobijanje id posla
    var id = req.params.id;

    
    /** Proveravanje da li se ulogovani korisnik prijavio na posao  */
    var prijava = '';
    if(ulogovaniKorisnik)
    {
        var prijava = await prijaveModel.vratiJednuPrijavu(ulogovaniKorisnik.id,id);
        if(prijava.length == 0)
        {
            prijava = '';
        }
        
    }

   




    /** Vraćanje podatke o poslu iz tabele poslovi  */
        // Vraća posao (oglas) na koje je korisnik pristigao
        var posao = await posloviModel.vratiPosao(id);

        // U slucaju da posao ne postoji
        if(posao.length == 0)
        {
            res.render('error_404',{title : 'Page not foint - wop'});
        }
    

        // Vraća korsinika, koji je postavio taj posao
        var korisnik = await korisniciModel.vratiKorisnika((posao[0].korisnik_id));


        // Provera da li je ulogovani korisnik postavio oglas na koji je pristigao
        if(ulogovaniKorisnik && ulogovaniKorisnik.id == korisnik[0].id)
        {
            var locked = 1;
        }




        // Modifikovanje podataka iz tabele posao - kolona potrebne_vestine i datum
            posao[0].potrebne_vestine = posao[0].potrebne_vestine.split(',');
            posao[0].datum  = (posao[0].datum + '').slice(0,25);

        // Kategorija kojoj pripada određeni posao
        var kategorija = await kategorijeModel.vratiKategoriju(posao[0].kategorija_id);
       
        // Prijave na posao
        var prijaveKorisnici = await prijaveModel.vratiKorisnikeZaPosao(posao[0].id,trenutnaStrana);

     
        // Ukupno korisnika prijavljenih za posao
        var ukupno = await prijaveModel.vratiBrojPrijavljenihKorisnika(id);
        var ukupno = ukupno.length;
        
        
        // Vraćanje statusa prijave za korisnika koji se je pirjvaio za posao na koji je pristigao
        var status = '';
        if(ulogovaniKorisnik)
        {
            status = await prijaveModel.vratiStatus(ulogovaniKorisnik.id, id);
            if(status.length == 0)
            {
                status = '';
            }
            else
            {
                status = status[0].status;
            }
        }


        console.log(status);

    // Renderovanje stranice
    res.render('./poslovi/posao', {
        title : posao[0].naziv,
        posao : posao,
        korisnik : korisnik,
        kategorija : kategorija,
        prijaveKorisnici : prijaveKorisnici,
        brPrijava : prijaveKorisnici.length,
        ulogovaniKorisnik : ulogovaniKorisnik,
        prijava : prijava,
        strana : trenutnaStrana,
        prethodnaStrana : prethodnaStrana,
        sledecaStrana : sledecaStrana,
        ukupno : ukupno,
        locked : locked,
        status : status
    
    });
}


/**Get /svi_poslovi/novi_posao */
module.exports.getNoviPosao = async(req, res) =>
{
    /** Role */
    const ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }


    // Proveravamo da li je prosledjena kategorija preko upita
    var kategorijaId = ( typeof req.query.kategorijaId == 'undefined') ? '' : req.query.kategorijaId;
    
    
   
    /** Iscitavamo sve kategorije iz baze radi upisa u padajći meni */
        var sveKategorije = await kategorijeModel.vratiNaziviIdKategorije();


    res.render('./poslovi/novi_posao',{
        greska : '',
        title : 'Novi oglas', 
        sveKategorije : sveKategorije,
        kategorijaId : kategorijaId
    });
}


/** POST /svi_poslovi/novi_posao */
module.exports.postNoviPosao = async(req,res) =>
{
    /** Uzimanje podataka iz forme */
        var naziv = req.body.naziv;
        var kratakOpis = req.body.kratakOpis;
        var punOpis = req.body.punOpis;
        var potrebneVestine = req.body.potrebneVestine;
        var pozeljneVestine = req.body.pozeljneVestine;
        var datum =  new Date();
        var kategorijaId = req.body.kategorijaId;
        // POINT 
        var korisnikId = req.session.ulogovaniKorisnik.id;

        var brPrijava = 0;

    /** Iscitavamo sve kategorije iz baze radi upisa u padajći meni */
        var sveKategorije = await kategorijeModel.vratiNaziviIdKategorije();


    /** Provera posla da li već postoji u toj kategorije */
        var posao = await posloviModel.vratiPosaoIzKategorijeSaNazivom(naziv,kategorijaId);
       

    // Promenljiva koja sliži za čuvanje greske
        var greska;


    // U slučaju da ovakav posao već postoji u datoj kategoriji
    if(posao.length != 0)
    {
       greska = {
           ime : 'Posao sa ovim nazivom već postoji u ovoj kategoriji!',
           naziv : naziv,
           kratakOpis : kratakOpis,
           punOpis : punOpis,
           potrebneVestine : potrebneVestine,
           pozeljneVestine : pozeljneVestine,
           kategorijaId : kategorijaId,
       }

       return res.render('./poslovi/novi_posao',{
            greska : greska,
            title : 'Novi oglas',
            sveKategorije : sveKategorije,
            kategorijaId : kategorijaId
       })
    }


    // U slusaju da posao ne postoji upisujemo posao u bazi

    /** Upit ka bazi za upis posla */
      var noviPosao = await posloviModel.dodajPosao(naziv,kratakOpis,punOpis,potrebneVestine,pozeljneVestine,datum,kategorijaId,korisnikId,brPrijava);

    // Vracanje stranice sa dodatim poslom :
    res.redirect(`/svi_poslovi/posao/${noviPosao.insertId}`);
}


/** Get /svi_poslovi/posao<id>/izmena_posla */
module.exports.getIzmenaPosla = async (req,res) =>
{
    /** Rola */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        return res.redirect('/logIn');
    }


     // Uzimanje id posla(oglasa) prosleđen preko URL putanje
     var id = req.params.id;


     /** Selektovanje posla pomoću dobijenog id-a */
        var posao = await posloviModel.vratiPosao(id);
    


    //** Redirektovanje korisnika ako je pokušao da menja posao koji nije on postavio */
        if(posao[0].korisnik_id != ulogovaniKorisnik.id && ulogovaniKorisnik.rola != 'admin')
        {
            return res.redirect(`/svi_poslovi/posao/${id}`);
        }


    // Pronalazenje kategorija posla
        kategorijaId = posao[0].kategorija_id;
    

    
    /** Dobijanje svih kategorija radi upisa u padajući meni */
        var sveKategorije = await kategorijeModel.vratiKategorije(); 
        



    res.render('./poslovi/izmena_posla', {
        title : 'Izmena posla',
        posao : posao,
        greska : '',
        sveKategorije: sveKategorije,
        kategorijaId : kategorijaId
    });
}

/** POST /svi_poslovi/posao/<id>/izmena_posla */
module.exports.postIzmenaPosla = async (req,res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Uzimanje podataka prosledjeni putem fome
    var kategorijaId = req.body.kategorijaId;
    var naziv = req.body.naziv;
    var kratakOpis = req.body.kratakOpis;
    var punOpis = req.body.punOpis;
    var potrebneVestine = req.body.potrebneVestine;
    var pozeljneVestine = req.body.pozeljneVestine;

    // Id posla poslat preko parametra
    var posaoId = req.params.id;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }

    // Proveravanje posla da li pripada ulogovanom korisniku
    var posaoP = await posloviModel.vratiPosao(posaoId);
      //** Redirektovanje korisnika ako je pokušao da menja posao koji nije on postavio */
      if(posaoP[0].korisnik_id != ulogovaniKorisnik.id && ulogovaniKorisnik.rola != 'admin')
      {
          return res.redirect(`/svi_poslovi/posao/${posaoId}`);
      }
  
 




    /** Dobijanje svih kategorija radi upisa u padajući meni */
        var sveKategorije = await kategorijeModel.vratiKategorije(); 

   

    /** Proveravanje posla */
        var posao = await posloviModel.vratiPosaoIzKategorijeSaNazivom(naziv,kategorijaId); 
      

    
 



    /** U SLUČAJU DA DOLAZI DO GREŠKE : Uneti naziv posla već postoji u izabranoj kategoriji */

    if(posao.length != 0)
    {
        if(posao[0].id !=  posaoId)
        {
                 
            // Čuvanje naziva ako dodje do greške
            var posaoKojiPostojiNaziv = posao[0].naziv;


            // Ponovo dobijanje podataka o poslu nad kojim se vrši izmena, da bi se taj
            // posao vratio nazad, jer selektovani posao nije taj koji treba da bude  
                posao = await posloviModel.vratiPosao(posaoId);

            // Izmena naziva posla, da bi korisnik u formi dobio ime koje je uneo(neispravno ime)
                posao[0].naziv = posaoKojiPostojiNaziv;

            var greska = 'U izabranoj kategoriji već postoji posao sa ovakvim imenom. Molimo promenite naziv posla ili izaberite drugu sličnu kategoriju!'
            
            // Renderovanje strane u slucaju da je došlo do greške
            return res.render('./poslovi/izmena_posla', {
                title : 'Izmena posla',
                posao : posao,
                greska : greska,
                sveKategorije : sveKategorije,
                kategorijaId : kategorijaId
            })
        }
    }


    /** U SLUČAJU DA NE DOLAZI DO GREŠKE - Upisujemo izmene posla u bazi */
    
    // Kreiranje datuma
    var datum = new Date();


    console.log('Posao id je  :' + posaoId);
    /** Izvršenje upita za upis ka bazi */
        console.log(await posloviModel.izmeniPosao(naziv,kratakOpis,punOpis,potrebneVestine,pozeljneVestine,datum,kategorijaId,posaoId));
    
    return res.redirect(`/svi_poslovi/posao/${posaoId}`);


}

/** POST /svi_poslovi/posao/<id>/brisanje_posla */
module.exports.postBrisanjePosla = async (req,res) =>
{
    

    /** Rola */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }


    // Dobijanje id posla za brisanje iz URL putanje
    var id = req.params.id;

    // Proveravanje posla da li pripada ulogovanom korisniku
    var posaoP = await posloviModel.vratiPosao(id);
        //** Redirektovanje korisnika ako je pokušao da menja posao koji nije on postavio */
        if(posaoP[0].korisnik_id != ulogovaniKorisnik.id && ulogovaniKorisnik.rola != 'admin')
        {
            return res.redirect(`/svi_poslovi/posao/${id}`);
        }



    /** Upit za brisanjea svih prijava koje se odnose na posao koji se briše */
        await prijaveModel.obrisiPrijaveZaPosao(id);
    /** Upit za brisanje jednog posla */
        console.log(await posloviModel.obrisiPosao(id));

    res.redirect('/svi_poslovi');
}




// Prijavljivanje i odjavljivanje posla

/** POST /svi_poslovi/posao/<id>/prijavljivanje_posla */
module.exports.postPrijavljivanjePosla = async (req,res) => 
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        return res.redirect('/logIn');
    }


    // Ako je ulogovan
    

    // Uzimanje korisnika
    var korisnikId = ulogovaniKorisnik.id;

    // Uzimanje id posla
    var posaoId = req.params.id; 



    /** Unos podataka u bazi - tabela prijave */
        console.log(await prijaveModel.novaPrijava(korisnikId,posaoId,new  Date(),'na cekanju',''));

    
    /** Azuriranje kolone br_prijava u tabeli poslovi za odredjenog posla - tabela poslovi*/
        console.log(await posloviModel.azurirajBrPoslova(posaoId));


    // Redirektovanje 
    res.redirect('back');

}


/** POST /svi_poslovi/posao/<id>/odjavljivanje_posla */
module.exports.postOdjavljivanjePosla = async (req, res) =>
{
    /** Role */ 
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Dobijanje id posla za odjavljivanje
    var id = req.params.id;

    /** Brisanje prijave za posao */
        console.log(await prijaveModel.obrisiPrijavu(ulogovaniKorisnik.id,id));

     /** Azuriranje kolone br_prijava u tabeli poslovi za odredjenog posla - tabela poslovi*/
     console.log(await posloviModel.azurirajBrPoslova(id));


    return res.redirect('back');
}




// Prihvatanje i odbijanje prijave za posao (oglas) (od strane korisnika koji je postavio oglas)

/** POST /svi_poslovi/posao/<id>/prihvatanje_prijave */
module.exports.postPrihvatanjePrijave = async (req,res) =>
{
    // Uzimanje podataka iz forme

    // Korisnik koji se prijavio na posao
    var prijavljeniKorisnikId = req.body.prijavljeniKorisnikId;
    // Posao na koji se prijavio
    var prijavljeniPosaoId = req.body.prijavljeniPosaoId;

   

    /** Upit ka bazi za promenu statusa prijave */
        console.log(await prijaveModel.prihvatiPrijavu(prijavljeniKorisnikId,prijavljeniPosaoId,new Date()));
    


    // Vracanje na stranici sa poslom
    res.redirect('back');
   
   
}




/** POST /svi_poslovi/<id>/odbijanje_prijave */
module.exports.postOdbijanjePrijave = async (req,res) =>
{
    // Uzimanje podataka iz forme

    // Korisnik koji se prijavio na posao
    var prijavljeniKorisnikId = req.body.prijavljeniKorisnikId;
    // Posao na koji se prijavio
    var prijavljeniPosaoId = req.body.prijavljeniPosaoId;

   
    /** Upit ka bazi za promenu statusa prijave */
        console.log(await prijaveModel.odbijPrijavu(prijavljeniKorisnikId,prijavljeniPosaoId,new Date()));
    

    // Vracanje na stranici sa poslom
    res.redirect('back');
   

   

}