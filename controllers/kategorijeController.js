// Učitavanje potrebnih model fajlova
var kategorijeModel = require('../models/kategorijeModel');



/** Get sve_kategorije */
module.exports.getSveKategorije = (req, res) =>
{
    res.render('./kategorije/sve_kategorije',{title : 'Sve kategorije'});
}




/** Get /sve_kategorije/kategorija/<kategorijaId> */
module.exports.getKategorija = async (req, res) =>
{
    // Id koji ću prolsediti bazi
    var id = parseInt(req.params.id);

    console.log("ID  JEEEEEEEE :" + id); 
       

    // Uzimanje iz baze 1 kategorije selektovane pomoću Id-em dobijenim iz URL parametra
    var kategorija = await kategorijeModel.vratiKategoriju(id); 
    console.log(kategorija);



    res.render('./kategorije/kategorija',{
        title : kategorija[0].naziv,
        kategorija : kategorija
    });
}