

module.exports.getKontakt = async (req,res) =>
{
   /** Role  */
   var ulogovaniKorisnik = req.session.ulogovaniKorisnik;



    res.render('kontakt',{title:'Kontakt', ulogovaniKorisnik: ulogovaniKorisnik});
}