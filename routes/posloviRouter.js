var express = require('express');
var router = express.Router();

// Učitavanje poslovi kontrolera
var posloviController = require('../controllers/posloviController');



/**Get /svi_poslovi */
router.get('/', posloviController.getSviPoslovi);


/** Get /svi_poslovi/posao/<id> */
router.get('/posao/:id', posloviController.getPosao);


/**Get /svi_poslovi/novi_posao */
router.get('/novi_posao', posloviController.getNoviPosao);

/** POST /svi_poslovi/novi_posao */
router.post('/novi_posao', posloviController.postNoviPosao);


/** Get /svi_poslovi/posao/<id>/izmena_posla */
router.get('/posao/:id/izmena_posla', posloviController.getIzmenaPosla);

/** POST /svi_poslovi/posao/<id>/izmena_posla */
router.post('/posao/:id/izmena_posla', posloviController.postIzmenaPosla);

/** POST /svi_poslovi/posao/<id>/brisanje_posla */
router.post('/posao/:id/brisanje_posla',posloviController.postBrisanjePosla);

module.exports = router;