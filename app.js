var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
const cors = require('cors')

var index = require('./routes/index');
var users = require('./routes/users');
const token = require('./routes/Token');
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
// app.use(function(req, res, next) { 
//   res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("X-Powered-By",' express')
//   // res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });
// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1')
//   if(req.method=="OPTIONS") res.status(200);/*让options请求快速返回*/
//   else  next();
// });

app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users); 
app.use('/api/v1/token',token)
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
