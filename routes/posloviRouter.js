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



// Prijavljivanje i odjavljivanje posla

/** POST /svi_poslovi/posao/<id>/prijavljivanje_posla */
router.post('/posao/:id/prijavljivanje_posla', posloviController.postPrijavljivanjePosla);


/** POST /svi_poslovi/posao/<id>/odjavljivanje_posla */
router.post('/posao/:id/odjavljivanje_posla', posloviController.postOdjavljivanjePosla);



// Prihvatanje i odbijanje prijave za posao (oglas) (od strane korisnika koji je postavio posao)

/** POST /svi_poslovi/posao/<id>/prihvatanje_prijave */
router.post('/posao/:id/prihvatanje_prijave', posloviController.postPrihvatanjePrijave);


/** POST /svi_poslovi/<id>/odbijanje_prijave */
router.post('/posao/:id/odbijanje_prijave', posloviController.postOdbijanjePrijave);





module.exports = router;