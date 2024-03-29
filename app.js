var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');

// Environment variables
require('dotenv').config();

// Mongoose
mongoose.connect(
    process.env.FLITS_DATABASE || 'mongodb://localhost/flitsdb',
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
);

// Models
require("./models/User");
require("./models/SpeedCamera");
require("./models/AvgSpeedCheck");
require("./models/PoliceCheck");

// Passport
require('./config/passport');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var speedCamerasRouter = require('./routes/speedCameras');
var avgSpeedChecksRouter = require('./routes/avgSpeedChecks');
var policeChecksRouter = require('./routes/policeChecks');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/API', indexRouter);
app.use('/API/users', usersRouter);
app.use('/API/speedCameras', speedCamerasRouter);
app.use('/API/avgSpeedChecks', avgSpeedChecksRouter);
app.use('/API/policeChecks', policeChecksRouter);

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
  res.json({ error: err });
});

module.exports = app;
