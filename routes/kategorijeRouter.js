var express = require('express');
var router = express.Router();

// Ucitavanje kategorijeControllera
const kategorijeController = require('../controllers/kategorijeController');

/**Get kategorije */
router.get('/', (req,res)=>
{
    res.render('./kategorije/sve_kategorije',{title : 'Sve kategorije'});
});



module.exports = router;