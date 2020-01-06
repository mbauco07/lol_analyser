
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//require for the model queries
var model = require('./Model/model_queries.js');


var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/View/game_selector.html'));
})
 //DB gets
app.get('/champs', function (req, res) {
    model.getChamplist((function (err, results) {
      //console.log("app.jss" + results);
      res.send(
          {
            error:err, //the error if any occurred
            results:results //the returned results from the query
          }
      )
    }))
   //res.send("fca");
   //res.send(model.returnChamps());
});
app.get('/gameList', function(req, res){
    model.getGameList((function (err, results) {
        res.send(
            {
                error:err, //the error if any occurred
                results:results //the returned results from the query
            }
        )
    }))
});
//DB gets


app.get('/dentry', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/data_entry_page.html'));
})


app.get('/draft', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/draft_page.html'));
})

app.get('/redSide', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/draft_page.html'));
})
app.get('/blueSide', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/draft_page.html'));
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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


//db connections
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "lol_data"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = app;