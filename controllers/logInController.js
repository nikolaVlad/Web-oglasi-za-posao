

/** Get /logIn */
module.exports.getLogIn = async (req, res) =>
{
    res.render('./log_reg/logIn', {title : 'Uloguj se', obavestenje: ''});
}

/** POST /logIn */