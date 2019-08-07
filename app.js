var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


let indexRouter = require('./routes/index');
let api_currentSupplyRouter = require('./routes/api/currentSupply');
let api_getBlockNumberRouter = require('./routes/api/getBlockNumber');
let api_getEpoch = require('./routes/api/getEpoch');
let api_getMonitaryPolicy = require('./routes/api/getMonitaryPolicy');
let api_getHashRate = require('./routes/api/getHashRate');
let getBlockNumberRouter = require('./routes/getBlockNumber');
let getEpoch = require('./routes/getEpoch');
let getHashRate = require('./routes/getHashRate');
let getMonitaryPolicy = require('./routes/getMonitaryPolicy');
let currentSupply = require('./routes/currentSupply');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.set('json spaces', 2)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', getBlockNumberRouter);
app.use('/', getEpoch);
app.use('/', getHashRate);
app.use('/', getMonitaryPolicy);
app.use('/', currentSupply);
app.use('/api/currentSupply', api_currentSupplyRouter);
app.use('/api/getBlockNumber', api_getBlockNumberRouter);
app.use('/api/getEpoch', api_getEpoch);
app.use('/api/getMonitaryPolicy', api_getMonitaryPolicy);
app.use('/api/getHashRate', api_getHashRate);

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

module.exports = app;
