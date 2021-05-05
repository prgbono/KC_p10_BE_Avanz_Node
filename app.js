var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var myAdsRouter = require('./routes/my-ads');
const loginController = require('./controllers/loginController');
const i18n = require('./lib/i18nConfig.js');

var app = express();

// db connection
require('./models/connectMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// declaramos una variable global para todas las vistas. Con esto nos evitaríamos tener que pasarle el parámetro title desde el controlador a la vista
// app.locals.title = 'NodeAPI';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Rutas del Api
 */
app.use('/api/authenticate', loginController.loginApi);
app.use('/api/ads', require('./routes/api/ads'));
app.use('/api/tags', require('./routes/api/tags'));

//i18n - Set before UI pages!
app.use(i18n.init);

/**
 * Rutas del Website
 */

app.use('/', indexRouter);
app.get('/login', loginController.index);
app.post('/login', loginController.loginApi);
app.use('/my-ads', myAdsRouter);
app.use('/change-locale', require('./routes/change-locale.js'));
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log('This is the Error middleware, err: ', err);

  // es un error de validación?
  if (err.array) {
    const errorInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${errorInfo.param} ${errorInfo.msg}`;
    err.status = 422;
  }

  if (isAPIRequest(req)) {
    // console.log('All errors go through here');
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function isAPIRequest(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
