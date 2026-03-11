var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Đăng ký các Route API
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/roles', require('./routes/roles'));

// Cấu hình kết nối MongoDB
const mongoURI = 'mongodb://localhost:27017/NNPTUD-S4';
mongoose.connect(mongoURI)
  .then(() => console.log(">>> Kết nối MongoDB thành công!"))
  .catch(err => console.error(">>> Lỗi kết nối MongoDB:", err));

mongoose.connection.on('connected', function () {
  console.log("Mongoose default connection is open to " + mongoURI);
});

mongoose.connection.on('disconnected', function () {
  console.log("Mongoose default connection is disconnected");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  // Trả về JSON nếu là lỗi từ API, nếu không thì render trang error
  if (req.originalUrl.startsWith('/api/v1')) {
    return res.json({ error: err.message });
  }
  res.render('error');
});

module.exports = app;