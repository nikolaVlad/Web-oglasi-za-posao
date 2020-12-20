var express = require('express');
var router = express.Router();

// Učitavanje poslovi kontrolera
var posloviController = require('../controllers/posloviController');



/**Get /svi_poslovi */
router.get('/', posloviController.getSviPoslovi);




/**Get /svi_poslovi/novi_posao */
router.get('/novi_posao', posloviController.getNoviPosao);


module.exports = router;