

/** Get /svi_korisnici */
module.exports.getSviKorisnici = (req, res)=>
{
    res.render('./korisnici/svi_korisnici', {title : 'Svi korisnici'});
}

/** Get /svi_korisnici/profil/<id> */
module.exports.getKorisnik = async (req,res) =>
{
    res.render('./korisnici/korisnik', {title : 'Profil'});
}
