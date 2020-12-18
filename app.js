// Imports modules 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// My imports modules:

// Layouts za kreiranje templejta
const expressLayouts = require('express-ejs-layouts');

// MySQL konfiguracija za bazu podataka
const con = require('./config/db');


// Ruteri---------------------------------------------------

    // Index 
    var indexRouter = require('./routes/indexRouter');


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

// MySQL middleware funkcija za aktiviranje konekcije sa bazom
app.use((req,res,next)=>
{
  req.con = con;
  next();

}); 

}
// end Podesavanja


// Rute----------------------------------------------------------

    // index
    app.use('/', indexRouter);


// end Rute





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
