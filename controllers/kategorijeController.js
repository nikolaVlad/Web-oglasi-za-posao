

/**Get sve_kategorije */
module.exports.getSveKategorije = (req, res) =>
{
    res.render('./kategorije/sve_kategorije',{title : 'Sve kategorije'});
}

