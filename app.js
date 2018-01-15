var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');

var index = require('./routes/index');
var users = require('./routes/users');
const admin = require('./routes/AdminRouter')
const tag = require('./routes/TagRouter')
const article = require('./routes/ArticleRouter')
const category = require('./routes/CategoryRouter')
const comment = require('./routes/CommentRouter')

var app = express();
const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1:27017/blog'
mongoose.connect(mongoDB, {
  useMongoClient: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connet error.'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/v1/', admin)
app.use('/api/v1/tags', tag)
app.use('/api/v1/articles', article)
app.use('/api/v1/categories', category)
app.use('/api/v1/comments', comment)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
