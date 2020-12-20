var express = require('express');
var router = express.Router();

// Ucitavanje indexControllera
const logInController = require('../controllers/logInController');

/** Get logIn */
router.get('/', logInController.getLogIn);



module.exports = router;
