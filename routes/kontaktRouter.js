var express = require('express');
var router = express.Router();

var kontaktController = require('../controllers/kontaktController');


/** Get /kontakt */
router.get('/', kontaktController.getKontakt);


module.exports = router;
