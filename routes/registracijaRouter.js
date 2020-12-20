var express = require('express');
var router = express.Router();

// Ucitavanje indexControllera
const registracijaController = require('../controllers/registracijaController');

router.get('/', registracijaController.getRegistracija);



module.exports = router;