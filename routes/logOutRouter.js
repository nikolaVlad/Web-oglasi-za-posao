var express = require('express');
var router = express.Router();

// Ucitavanje logOutController-a
const logOutController = require('../controllers/logOutController');

/** GET /logOut */
router.get('/', logOutController.logOut);


module.exports = router;