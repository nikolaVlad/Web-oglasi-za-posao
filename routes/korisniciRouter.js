var express = require('express');
var router = express.Router();

// Učitavanje korisnici kontrolera
var korisniciController = require('../controllers/korisniciController');

/**Get /svi_korisnici */
router.get('/', korisniciController.getSviKorisnici);

/** Get /svi_korisnici/profil/<id> */
router.get('/profil/:id', korisniciController.getKorisnik)



/** Get /svi_korisnici/profil/<id>/izmena_profila */
router.get('/profil/:id/izmena_profila', korisniciController.getIzmenaProfila);
/** POST /svi_korisnici/profil/<id>/izmena_profila */
router.post('/profil/:id/izmena_profila', korisniciController.postIzmenaProfila);



/** POST /svi_korisnici/profil/<id>/brisanje_profila */
router.post('/profil/:id/brisanje_profila', korisniciController.postBrisanjeProfila);


// Dodavanje slike

/** Get /svi_korisnici/profil/<id>/slika */
router.get('/profil/:id/slika', korisniciController.getSlika);

/**  POST /svi_korisnici/profil/<id>/slika */ 
router.post('/profil/:id/slika', korisniciController.postSlika);



/** POST /svi_korisnici/profil/<id>/rola */
router.post('/profil/:id/rola', korisniciController.postRola);


module.exports = router;