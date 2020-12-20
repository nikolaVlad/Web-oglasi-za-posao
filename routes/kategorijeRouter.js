var express = require('express');
var router = express.Router();

// Ucitavanje kategorijeControllera
const kategorijeController = require('../controllers/kategorijeController');

/**Get /sve_kategorije */
router.get('/', kategorijeController.getSveKategorije);




module.exports = router;