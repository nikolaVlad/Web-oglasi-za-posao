// Imports modules 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




// My imports modules:

// Layouts za kreiranje templejta
const expressLayouts = require('express-ejs-layouts');

// Sesije za login sistem i role
const session = require('express-session');

// Favicon
var favicon = require('serve-favicon');



// Ruteri---------------------------------------------------

    /** Index */  
    var indexRouter = require('./routes/indexRouter');

    /** Kategorije */
    var kategorijeRouter = require('./routes/kategorijeRouter');

    /** Poslovi */
    var posloviRouter = require('./routes/posloviRouter');

    /** Korisnici */
    var korisniciRouter = require('./routes/korisniciRouter');

    /** LogIn */
    var logInRouter = require('./routes/logInRouter');

    /** Registracija */
    var registracijaRouter = require('./routes/registracijaRouter');

    /** O nama */
    var oNamaRouter = require('./routes/oNamaRouter');

    /** LogOut */
    var logOutRouter = require('./routes/logOutRouter');

    /** Kontakt */
    var kontaktRouter = require('./routes/kontaktRouter');

// end Ruteri----------------------------------------------




// Inicijalizacija express fameworka app 
var app = express();

// Podesavanja
{

// Layouts setup
app.use(expressLayouts);
app.set('layout','./template/base');


// view engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// Express default setup :
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// Static files :
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + 'public/stylesheets'));
app.use('/js', express.static(__dirname + 'public/javascript'));
app.use('/img', express.static(__dirname + 'public/images')); 
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap')));
app.use(express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery')));

// Sesije
app.use(session({
  secret : 'secret-key',
  resave : true,
  saveUninitialized : false,
}))


// Favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));

}
// end Podesavanja


// Rute----------------------------------------------------------

    // index
    app.use('/', indexRouter);


    // sve_kategorije 
    app.use('/sve_kategorije', kategorijeRouter);

    // svi_poslovi
    app.use('/svi_poslovi', posloviRouter);

    // svi_korisnici
    app.use('/svi_korisnici', korisniciRouter);

    app.use('/logIn', logInRouter);

    // registracija
    app.use('/registracija', registracijaRouter);

    // o_nama
    app.use('/o_nama', oNamaRouter);

    // logOut
    app.use('/logOut', logOutRouter);

    // kontakt
    app.use('/kontakt',kontaktRouter);

// end Rute





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('error_404', {title : 'Page not found - wop',ulogovaniKorisnik : req.session.ulogovaniKorisnik});
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




// Pokretanje aplikacije
module.exports = app;
