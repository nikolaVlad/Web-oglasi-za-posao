

/**Get /svi_poslovi */
module.exports.getSviPoslovi = (req, res) =>
{
    res.render('./poslovi/svi_poslovi',{title : 'Svi poslovi'});
}


/**Get /svi_poslovi/novi_posao */
module.exports.getNoviPosao = (req, res) =>
{
    res.render('./poslovi/novi_posao',{title : 'Novi posao'});
}

