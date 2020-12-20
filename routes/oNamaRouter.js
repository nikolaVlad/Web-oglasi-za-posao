var express = require('express');
var router = express.Router();

// Ucitavanje oNama kontrolera
const oNamaController = require('../controllers/oNamaController');

/**Get /o_nama */
router.get('/', oNamaController.getONama);



module.exports = router;