var express = require('express');
var router = express.Router();

// Učitavanje korisnici kontrolera
var korisniciController = require('../controllers/korisniciController');

/**Get /svi_korisnici */
router.get('/', korisniciController.getSviKorisnici);

/** Get /svi_korisnici/profil/<id> */
router.get('/profil/:id', korisniciController.getKorisnik)




module.exports = router;