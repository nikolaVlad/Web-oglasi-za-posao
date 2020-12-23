// Učitavanje potrebnih model fajlova
var kategorijeModel = require('../models/kategorijeModel');
var posloviModel = require('../models/posloviModel')



/** Get sve_kategorije */
module.exports.getSveKategorije = async (req, res) =>
{
   
    
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
                prikazaneKategorije : kategorije.length
            });
}

/** Get /sve_kategorije/kategorija/<id> */
module.exports.getKategorija = async (req, res) =>
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
    
     // Proracunavanje poslova
     var ukupnoPoslova = poslovi.length;
     var prikazaniPoslovi = (ukupnoPoslova < 10) ? ukupnoPoslova : trenutnaStrana * 10; 



  
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
        ukupnoPoslova : ukupnoPoslova,
        prikazaniPoslovi : prikazaniPoslovi
    });
}


// Izmena kategorije

/** Get /sve_kategorije/kategorija<id>/izmena_kategorije */
module.exports.getIzmenaKategorije = async(req,res) =>
{
    // Uzimanje id-a sa URL putanje:
    var id = req.params.id;

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
    // Dobijanje podataka iz forme
    var naziv = req.body.naziv;
    var kratakOpis = req.body.kratakOpis;
    var slika = req.body.slika;
    var id = req.params.id;

    /** Provera unetog naziva kategorije */
        var kategorija = await kategorijeModel.vratiNazivKategorije(naziv);

    // U slucaju da naziv kategorije već postoji
    if(kategorija.length != 0)
    {

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
    console.log("Kategorija : " + kategorija);

    // U slucaju da kategorija postoji :
    if(kategorija.length != 0)
    {
        var greska = {

            nazivKategorije : naziv,
            kratakOpis : kratakOpis
        }
        return res.render('./kategorije/nova_kategorija',{
            title : 'Nova kategorija', 
            greska : 'Kategorija sa ovim nazivom već postoji!',
            kategorija : kategorija
        });
    }

    // U slucaju da kategorija ne postoji
    /** Upisivanje kategorije u bazi */
        console.log( await kategorijeModel.dodajKategoriju(naziv, kratakOpis, slika));
        res.redirect('/sve_kategorije');





    
}

// end Nova kategorija


// Brisanje kategorije

module.exports.obrisiKategoriju = async (req, res) =>
{
    // Uzimanja id kategorije za brisanje iz forme
    var id = req.params.id;

    /** Upit za brisanje */
        console.log(await kategorijeModel.obrisiKategoriju(id));

    res.redirect('/sve_kategorije');



}



// end Brisanje kategorije
