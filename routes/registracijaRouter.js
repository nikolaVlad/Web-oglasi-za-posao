var express = require('express');
var router = express.Router();

// Ucitavanje indexControllera
const registracijaController = require('../controllers/registracijaController');

/** GET /registracija */
router.get('/', registracijaController.getRegistracija);


/** Post /registracija */
router.post('/', registracijaController.postRegistracija);



module.exports = router;