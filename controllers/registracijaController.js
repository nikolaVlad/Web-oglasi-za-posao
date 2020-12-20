

/** Get /registracija */
module.exports.getRegistracija = (req, res) =>
{
    res.render('./log_reg/registracija', {title : 'Registracija'});
}

