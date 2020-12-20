

/** Get /logIn */
module.exports.getLogIn = (req, res) =>
{
    res.render('./log_reg/logIn', {title : 'Uloguj se'});
}