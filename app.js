const express = require('express');
// const mysql = require(`mysql-await`);
const path = require('path');
const logger = require('./middleware/logger');
const routes = require('./routes/index');
const helpers = require('./helpers');
const passport = require('passport');
const bodyParser = require('body-parser');
const errorHandlers = require('./handlers/errorHandlers');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');

// create our Express app
const app = express();

const port = 7000;

// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({
  extended: false
}));
app.use(expressValidator());

// set express to use this port
app.set('port', process.env.port || port);

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// // Passport JS is what we use to handle our logins
// app.use(passport.initialize());
// app.use(passport.session());

// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.currentPath = req.path;
  next();
});

// routes for the app
app.use('/', routes);
// Doctors Routes
app.use('/medici', require('./routes/medici'));
// Polyclinics Routes
app.use('/policlinici', require('./routes/policlinici'));
// Users Routes
app.use('/utilizatori', require('./routes/utilizatori'));
// Pacients Routes
app.use('/pacienti', require('./routes/pacienti'));
// Programari Routes
app.use('/programari', require('./routes/programari'));
// Programari Routes
app.use('/servicii', require('./routes/servicii'));
// Programari Routes
app.use('/asigurari', require('./routes/asigurari'));

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});