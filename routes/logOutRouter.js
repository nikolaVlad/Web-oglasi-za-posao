var express = require('express');
var router = express.Router();

// Ucitavanje logOutController-a
const logOutController = require('../controllers/logOutController');
const { route } = require('./logInRouter');

router.get('/', logOutController.logOut);


module.exports = router;