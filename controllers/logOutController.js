
/** Get /logOut */
module.exports.logOut = (req,res) =>
{
    req.session.destroy((err) => {
        res.redirect('/logIn'); 
      })
      
}