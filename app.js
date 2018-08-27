var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');
var user = require('./routes/user');
var list = require('./routes/list');
var angular = require('./routes/angular');
var home = require('./routes/home');
var article = require('./routes/article');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'key', // 建议使用 128 个字符的随机字符串
  cookie: {
    maxAge: 60 * 60 * 1000
  }, // 设置时间
  resave: false,
  saveUninitialized: true
}));
app.use('/', indexRouter);
app.use('/user', user);
app.use('/list', list);
app.use('/angular', angular);
app.use('/home', home);
app.use('/article', article);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use(function (req, res, next) {
  // 如果session中存在，则说明已经登录
  if (req.session.user) {
    res.locals.user = {
      uid: req.session.user.uid,
      username: req.session.user.username
    }
  } else {
    res.locals.user = {};
  }
  next();
})

module.exports = app;