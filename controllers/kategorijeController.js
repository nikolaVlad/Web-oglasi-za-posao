

/** Get sve_kategorije */
module.exports.getSveKategorije = (req, res) =>
{
    res.render('./kategorije/sve_kategorije',{title : 'Sve kategorije'});
}

/** Get /sve_kategorije/kategorija/<kategorijaId> */
module.exports.getKategorija = (req, res) =>
{
    var kategorijaId = req.params.id;
   
    res.render('./kategorije/kategorija',{title : 'Naziv kategorije'});
}