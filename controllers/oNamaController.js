module.exports.getONama = (req,res)=>
{
    /** Role */
    var ulogovaniKorisnik = req.session.ulogovaniKorisnik;

    res.render('o_nama' , {title : 'O nama', ulogovaniKorisnik : ulogovaniKorisnik});
    
}