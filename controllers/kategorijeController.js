// Učitavanje potrebnih model fajlova
var kategorijeModel = require('../models/kategorijeModel');
var posloviModel = require('../models/posloviModel')



/** Get sve_kategorije */
module.exports.getSveKategorije = (req, res) =>
{
    res.render('./kategorije/sve_kategorije',{title : 'Sve kategorije'});
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
      
        

        console.log(kljucneReci);


    // Id kategorije uzet od URL upita
    var id = parseInt(req.params.id);
    if(isNaN(id))
    {
        res.end('Izabrana kategorija ne postoji !');
    }


    
   /**Dobijanje podataka iz baze: */

    // Dobijanje iz baze 1 kategorije selektovane pomoću Id-jem ( Označava onu u kojoj je korisnik pristigao)
    var kategorija = await kategorijeModel.vratiKategoriju(id,trenutnaStrana); 

    if(kategorija == '')
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