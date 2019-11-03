console.log("Reading config data");
var config = require("./config")();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

global.debugon=true;
global.version="0.03";

// Instatiate database
const Database=require('./database');
global.pool=new Database();


let indexRouter = require('./routes/index');
let api_currentSupplyRouter = require('./routes/api/currentSupply');
let api_getBlockNumberRouter = require('./routes/api/getBlockNumber');
let api_getEpoch = require('./routes/api/getEpoch');
let api_getMonetaryPolicy = require('./routes/api/getMonetaryPolicy');
let api_getHashRate = require('./routes/api/getHashRate');
let api_getGas = require('./routes/api/getGas');
let api_getAccountStatus = require('./routes/api/getAccountStatus');
let api_getRichList = require('./routes/api/getRichList');
let getBlockNumberRouter = require('./routes/getBlockNumber');
let getEpoch = require('./routes/getEpoch');
let getHashRate = require('./routes/getHashRate');
let getAccountStatus = require('./routes/getAccountStatus');
let getRichList = require('./routes/getRichList');
let getMonetaryPolicy = require('./routes/getMonetaryPolicy');
let currentSupply = require('./routes/currentSupply');
let getGas = require('./routes/getGas');
let whatsnew = require('./routes/whatsnew');
let users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());




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
app.use('/', getMonetaryPolicy);
app.use('/', getAccountStatus);
app.use('/', getRichList);
app.use('/', currentSupply);
app.use('/', getGas);
app.use('/', whatsnew);
app.use('/', users);

app.use('/api/currentSupply', api_currentSupplyRouter);
app.use('/api/getBlockNumber', api_getBlockNumberRouter);
app.use('/api/getEpoch', api_getEpoch);
app.use('/api/getMonetaryPolicy', api_getMonetaryPolicy);
app.use('/api/getHashRate', api_getHashRate);
app.use('/api/getGas', api_getGas);
app.use('/api/getAccountStatus', api_getAccountStatus);
app.use('/api/getRichList', api_getRichList);

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
