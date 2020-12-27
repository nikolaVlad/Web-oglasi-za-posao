const { Router } = require('express');
var express = require('express');
var router = express.Router();

// Ucitavanje kategorijeControllera
const kategorijeController = require('../controllers/kategorijeController');

/** Get /sve_kategorije */
router.get('/', kategorijeController.getSveKategorije);

/** Get /sve_kategorije/<kategorijaId> */
router.get('/kategorija/:id', kategorijeController.getKategorija);

/** Get /sve_kategorije/<kategorijaId>/izmeni_kategoriju */
router.get('/kategorija/:id/izmena_kategorije', kategorijeController.getIzmenaKategorije);

/** POST /sve_kategorije/<kategorijaId>/izmeni_kategoriju */
router.post('/kategorija/:id/izmena_kategorije', kategorijeController.postIzmenaKategorije);

/** Get /sve_kategorije/nova_kategorija */
router.get('/nova_kategorija', kategorijeController.getNovaKategorija);

/** POST /sve_kategorije/nova_kategorija */
router.post('/nova_kategorija', kategorijeController.postNovaKategorija);

/**Delete /sve_kategorije/<kategorijaId> */ // Brisanje kategorije
router.post('/kategorija/:id/brisanje_kategorije', kategorijeController.obrisiKategoriju);



module.exports = router;
