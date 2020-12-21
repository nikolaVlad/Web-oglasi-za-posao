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

        // Kljucna rec
        var kljucnaRec = ( typeof req.query.kljucnaRec != 'undefined') ?
                            req.query.kljucnaRec : '';
        
        // Sortiranje
        var sortiranje = (typeof req.query.sortiranje != 'undefined') ? 
                           req.query.sortiranje : 'id'; 
      
        

    // Id kategorije uzet od URL upita
    var id = parseInt(req.params.id);
       
   /**Dobijanje podataka iz baze: */

    // Dobijanje iz baze 1 kategorije selektovane pomoću Id-em ( Označava onu u kojoj je korisnik pristigao)
    var kategorija = await kategorijeModel.vratiKategoriju(id); 
    
    
    // Dobijanje iz baze sve poslove, koje se odnose na datu kategoriju
    var poslovi = await posloviModel.vratiPosloveIzKategoriju(id, kljucnaRec ,sortiranje,trenutnaStrana);

    console.log(poslovi);
    res.render('./kategorije/kategorija',{
        title : kategorija[0].naziv,
        kategorija : kategorija,
        strana : trenutnaStrana,
        prethodnaStrana : prethodnaStrana,
        sledecaStrana : sledecaStrana,
        kljucnaRec : kljucnaRec,
        sortiranje : sortiranje,
        poslovi : poslovi
    });
}