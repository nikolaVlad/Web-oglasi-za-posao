

/**Get /svi_korisnici */
module.exports.getSviKorisnici = (req, res)=>
{
    res.render('./korisnici/svi_korisnici', {title : 'Svi korisnici'});
}

