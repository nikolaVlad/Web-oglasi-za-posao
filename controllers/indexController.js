const indexModel = require('../models/indexModel');

module.exports = (req, res)=>
{
    res.render('index', {title : 'Web oglasi za posao'});
};