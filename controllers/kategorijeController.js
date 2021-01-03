// Učitavanje potrebnih model fajlova
var kategorijeModel = require('../models/kategorijeModel');
var posloviModel = require('../models/posloviModel')
var prijaveModel = require('../models/prijaveModel');




/** Get /sve_kategorije */ 
module.exports.getSveKategorije = async (req, res) =>
{

    /** Role */
    const ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    
    /** Paginacija */
     // RaČunanje trenutne strane (Koji će sluziti kao limit u bazi)
     var trenutnaStrana = parseInt(req.query.strana);
     if (isNaN(trenutnaStrana) || trenutnaStrana === 0)
     {
         trenutnaStrana = 1;
     }

     // Racunanje prethodne i sledece strane 
     var prethodnaStrana = new Number(trenutnaStrana - 1);
     var sledecaStrana =   new Number(trenutnaStrana + 1);


    /** Pretraživanje i sortiranje */
     var pretrazi = ( typeof req.query.pretrazi != 'undefined' ) ? req.query.pretrazi : '';
     var sortiraj = req.query.sortiraj;

     if(typeof sortiraj == 'undefined' || (sortiraj != 'asc' && sortiraj != 'desc'))
     {
         sortiraj = 'asc';
     }
    
     console.log("SORTIRA SE PO : ",sortiraj )

    // Vraćamo određeniroj kategorija iz baze
    var kategorije = await kategorijeModel.vratiSveKategorije(pretrazi,sortiraj,trenutnaStrana);
    
    // Broj vracenih i broj ukupnih kategorija
     var ukupnoKategorija = await kategorijeModel.vratiBrojKategorija();
     ukupnoKategorija = ukupnoKategorija[0].ukupnoKategorija;
    


    // Renderovanje stranice 
    res.render('./kategorije/sve_kategorije',{
                title : 'Sve kategorije',
                pretrazi : pretrazi,
                sortiraj : sortiraj,
                kategorije : kategorije,
                strana : trenutnaStrana,
                sledecaStrana : sledecaStrana,
                prethodnaStrana : prethodnaStrana,
                ukupnoKategorija : ukupnoKategorija,
                prikazaneKategorije : kategorije.length * trenutnaStrana,
                ulogovaniKorisnik : ulogovaniKorisnik
            });
}

/** Get /sve_kategorije/kategorija/<id> */
module.exports.getKategorija = async (req, res) =>
{  
  
    /** Role */
        const ulogovaniKorisnik = req.session.ulogovaniKorisnik;



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
      
        

    // Id kategorije uzet od URL upita
    var id = req.params.id;

    
   /**Dobijanje podataka iz baze: */

    // Dobijanje iz baze 1 kategorije selektovane pomoću Id-jem ( Označava onu u kojoj je korisnik pristigao)
    var kategorija = await kategorijeModel.vratiKategoriju(id,trenutnaStrana); 

    if(kategorija.length == 0)
    {
        res.end('Izabrana kategorija ne postoji !');
    }

    // Vracanje poslova iz baze za kategoriju na kojoj je prostoigao korisnik
    // pomoću parametara prosleđenih preko URL
     if(sortiranje != 'asc' && sortiranje != 'desc')
     {
        // Dobijanje iz baze sve poslove iz date kategorije
        var poslovi = await posloviModel.vratiPosloveIzKategorije(kategorija[0].id,kljucneReci,trenutnaStrana);
     }

     else
     {
         // Sortiranje po datumu - najstraiji
         if (sortiranje == 'asc')
         {
            var poslovi = await posloviModel.vratiPosloveIzKategorijeSort(kategorija[0].id,kljucneReci,trenutnaStrana,'ASC');
         }
         // Sortiranje po datumu - najnoviji
         if (sortiranje == 'desc') 
         {
            var poslovi = await posloviModel.vratiPosloveIzKategorijeSort(kategorija[0].id,kljucneReci,trenutnaStrana,'DESC');
         }
     }
    
     // Proracunavanje broja ukupnih i prikazanih poslova
     var ukupnoPoslova = await posloviModel.vratiPosloveIzKategorije(id,[''],1);
     var prikazaniPoslovi = poslovi.length * trenutnaStrana;

     
  
    // Renderovanje :
    res.render('./kategorije/kategorija',{
        title : kategorija[0].naziv,
        kategorija : kategorija,
        strana : trenutnaStrana,
        prethodnaStrana : prethodnaStrana,
        sledecaStrana : sledecaStrana,
        kljucneReci : kljucneReci.join(','),
        sortiranje : sortiranje,
        poslovi : poslovi,
        ukupnoPoslova : ukupnoPoslova.length,
        prikazaniPoslovi : prikazaniPoslovi,
        ulogovaniKorisnik : ulogovaniKorisnik,
    });
}


// Izmena kategorije

/** Get /sve_kategorije/kategorija<id>/izmena_kategorije */
module.exports.getIzmenaKategorije = async(req,res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }

    

    // Uzimanje id-a sa URL putanje:
    var id = req.params.id;


    // Ako koirnsik nije ulogovan kao admin
    if(ulogovaniKorisnik.rola != 'admin')
    {
        res.redirect(`/sve_kategorije/kategorija/${id}`);
    }


    /** Dobijanje podataka iz baze za datu kategoriju */
        var kategorija = await kategorijeModel.vratiKategoriju(id);

    // Proveravanje rezultata
    if(kategorija.length == 0)
    {
        res.end('Izabrana kategorija ne postoji ili je obrisana.');
    }

    res.render('./kategorije/izmena_kategorije', {title : 'Izmena kategorije', kategorija : kategorija, greska : ''});
}


/** POST /sve_kategorije/kategorija<id>/izmena_kategorije */
module.exports.postIzmenaKategorije = async(req,res) =>
{
    /** Role  */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Dobijanje podataka iz forme
    var naziv = req.body.naziv;
    var kratakOpis = req.body.kratakOpis;
    var slika = req.body.slika;
    var id = req.params.id;

    // Provera da li je ulogovani korisnik
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }

    // Provera da li je ulogovani korisnik kao admin
    if(ulogovaniKorisnik.rola != 'admin')
    {
        console.log(ulogovaniKorisnik.rola);
        console.log('desio se');
        res.redirect(`/sve_kategorije/kategorija/${id}`);
    }



    /** Provera unetog naziva kategorije */
        var kategorija = await kategorijeModel.vratiNazivKategorije(naziv);

    // U slucaju da naziv kategorije već postoji
    if(kategorija.length != 0)
    {
        // Modifikacija naziva kategorije
        kategorija[0].naziv = naziv;
        kategorija[0].kratak_opis = kratakOpis;

        // Vracanje stranice sa upozorenjem o gresci
        return res.render('./kategorije/izmena_kategorije', {
            title : 'Izmena kategorije', 
            greska : 'Kategorija sa ovim nazivom već postoji!',
            kategorija : kategorija
            });
    }

    
    // U slučaju da je naziv ispravno izmenjen
    /** Cuvanje izmena kategorije u bazi */
        console.log(kategorijeModel.izmeniKategoriju(naziv,kratakOpis,slika,id));


    res.redirect(`/sve_kategorije/kategorija/${id}`);

}




// end Izmena kategorije




// Nova kategorija

/** Get /sve_kategorije/nova_kategorija */
module.exports.getNovaKategorija = async(req,res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    // Ako korisnik nije ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }

    // Ako korinik nije ulogovan kao admin
    if(ulogovaniKorisnik.rola != 'admin')
    {
        res.redirect('/sve_kategorije');
    }


    res.render('./kategorije/nova_kategorija', {title : 'Nova kategorija', greska: ''});
}



/** POST /sve_kategorije/nova_kategorija */ 
module.exports.postNovaKategorija = async (req,res) =>
{
    // Dobijanje podataka iz forme 
    var naziv =       req.body.naziv
    var kratakOpis =  req.body.kratakOpis;
    var slika = req.body.slika;

    /** Provera unete kategorija da li već postoji u bazi */
    var kategorija = await kategorijeModel.vratiNazivKategorije(naziv);
   
    // U slucaju da naziv kategorija postoji :
    if(kategorija.length != 0)
    {
       
        // Modifikovanje naziva kategorije
        kategorija[0].naziv = naziv;
        kategorija[0].kratakOpis = kratakOpis;


        return res.render('./kategorije/nova_kategorija',{
            title : 'Nova kategorija', 
            greska : 'Kategorija sa ovim nazivom već postoji!',
            kategorija : kategorija
        });
    }

    // U slucaju da kategorija ne postoji
    /** Upisivanje kategorije u bazi */
        var novaKategorija = await kategorijeModel.dodajKategoriju(naziv, kratakOpis, slika);
        res.redirect(`/sve_kategorije/kategorija/${novaKategorija.insertId}`);
    
}

// end Nova kategorija


// Brisanje kategorije

/** Post /sve_kategorije/kategorija/<id>/brisanje_kategorije */
module.exports.obrisiKategoriju = async (req, res) =>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;
    

    // Uzimanja id kategorije za brisanje iz forme
    var id = req.params.id;


    // Proveravanje da li je korisnik ulogovan
    if(!ulogovaniKorisnik)
    {
        res.redirect('/logIn');
    }


    // Proveravanje da li je ulogovani korisnik admin
    if(ulogovaniKorisnik.rola != 'admin')
    {
        res.redirect(`/sve_kategorije/${id}`);
    }



    /** Brisanje prijava za poslove iz te kategorije */
        console.log(await prijaveModel.obrisiPrijaveZaPosloveIzKategorije(id));

    /**  Brisanje svih poslova iz te kategorije */
        await posloviModel.obrisiPosloveIzKategoriju(id);

    /** Brisanje kategorije */
        console.log(await kategorijeModel.obrisiKategoriju(id));

    res.redirect('/sve_kategorije');
}



// end Brisanje kategorije
