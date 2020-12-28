var korisniciModel = require('../models/korisniciModel');


/** Get /svi_korisnici */
module.exports.getSviKorisnici = (req, res)=>
{
    res.render('./korisnici/svi_korisnici', {title : 'Svi korisnici'});
}

/** Get /svi_korisnici/profil/<id> */
module.exports.getKorisnik = async (req,res) =>
{
    // Uzimanje id korisnika
    var id = req.params.id;

    // Uzimanje parametra za prikaz menija
        var oglasiMeni = ( typeof req.query.oglasiMeni == 'undefined' ) ? 'aktivni' : req.query.oglasiMeni;

 

    /** Vraćanje korisnika */
    var korisnik = await korisniciModel.vratiKorisnika(id);



    if(korisnik.length == 0)
    {
       return res.redirect('/error_404');
    }

    console.log(oglasiMeni);

    res.render('./korisnici/korisnik', {
                title : 'Profil', 
                korisnik : korisnik,
                oglasiMeni : oglasiMeni    
            
            });
}


