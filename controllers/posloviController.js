// Učitavanje potrebnih model fajlova
var posloviModel = require('../models/posloviModel');

var kategorijeModel = require('../models/kategorijeModel');



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
        prikazaniPoslovi : poslovi.length * trenutnaStrana    
    })
    
    
}


/**Get /svi_poslovi/novi_posao */
module.exports.getNoviPosao = (req, res) =>
{
    res.render('./poslovi/novi_posao',{title : 'Novi posao'});
}


/** Get /svi_poslovi/posao/<id> */
module.exports.getPosao = (req,res) =>
{
    res.render('./poslovi/posao', {title : 'Posao'});
}


/** Get /svi_poslovi/posao<id>/izmena_posla */
module.exports.getIzmenaPosla = (req,res) =>
{
    res.render('./poslovi/izmena_posla', {title : 'Izmena posla'});
}