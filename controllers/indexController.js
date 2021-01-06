// Učitavanje potrebnih modela za rad sa bazom
const kategorijeModel = require('../models/kategorijeModel');
const posloviModel = require('../models/posloviModel');

/**Get index */
module.exports = async (req, res)=>
{
    /** Role */
    const ulogovaniKorisnik = req.session.ulogovaniKorisnik;
    

    // Iscitavanje 3 kategorija 
    var kategorije = await kategorijeModel.vratiKategorije(3);

    
    // Iscitavanje 6 poslova
    var poslovi = await posloviModel.vratiPoslove(6);
   

    /** Obavestenje */
    var obavestenje = false;
    if(req.session.prviPut == true)
    {
        req.session.prviPut = false;
        obavestenje = true;
    }

    // Modifikacija kratkog opis za svakog posla : 67
    for(posao of poslovi)
    {
        posao.kratak_opis = posao.kratak_opis.slice(0,67);
    }



    res.render('index', {
        title : 'Web oglasi za posao', 
        kategorije : kategorije, 
        poslovi : poslovi,
        ulogovaniKorisnik : ulogovaniKorisnik,    
        obavestenje : obavestenje
    });
};