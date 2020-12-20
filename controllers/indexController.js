// Učitavanje potrebnih modela za rad sa bazom
const kategorijeModel = require('../models/kategorijeModel');
const posloviModel = require('../models/posloviModel');

/**Get index */
module.exports = async (req, res)=>
{

    // Iscitavanje 3 kategorija 
    var kategorije = await kategorijeModel.vratiKategorije(3);

    
    // Iscitavanje 6 poslova
    var poslovi = await posloviModel.vratiPoslove(6);
   


    res.render('index', {
        title : 'Web oglasi za posao', 
        kategorije : kategorije, 
        poslovi : poslovi});
};