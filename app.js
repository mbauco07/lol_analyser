const http = require('http');
var createError = require('http-errors');
var express = require('express')
    , bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var url = require('url');
const axios = require('axios');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//require for the model queries
var model = require('./Model/model_queries.js');


var app = express();



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


 //DB gets
app.get('/champs', function (req, res) {
   model.getChamps().then(function (data) {
        res.send(data);
   });

});

app.get('/get_champ_info', function (req, res) {
    model.get_champ_info(req.query.champ).then(function (data) {
        res.send(data);
    });
});


app.get('/items', function (req, res) {
    model.getItems().then(function (data) {
        res.send(data);
    });

});
app.get('/sspells', function (req, res) {
    model.getSummonerSpells().then(function (data) {
        res.send(data);
    });

});
app.get('/get_games_for_league', function(req, res){
    model.getGameList(req.query.leagueName, (function (err, results) {
        res.send(
            {

                error:err, //the error if any occurred
                results:results //the returned results from the query
            }
        )
    }))
});

app.get('/get_teams_info', function(req, res){

    model.getTeamsInfo( req.query.btid, req.query.rtid,req.query.league, (function (err, results) {
         res.send(
            {
                error:err, //the error if any occurred
                results:results //the returned results from the query
            }
        )
    }))
});

app.get("/get_general_game_actions", function (req, res) {

    model.get_general_game_actions( (function (err, results) {
        res.send(
            {
                error: err,
                results: results
            }
        )
    }))
});



app.get('/get_game_team_info', function (req, res) {
     model.get_game_team_info(req.query.gameID, (function (err, results) {
       res.send(
           {
               error:err,
               results:results
           }
       )
    }))
});

app.get('/get_game_actions_info', function (req, res) {
    model.get_game_action_info(req.query.gameID, (function (err, results) {
        res.send(
            {
                error:err,
                results:results
            }
        )
    }))
});

app.get('/get_team_roster', function (req, res) {
    model.get_team_roster(req.query.teamID, (function (err, results) {
        res.send(
            {
                error:err,
                results:results
            }
        )
    }))
});

app.get('/get_teams_from_league', function (req, res) {
    model.get_teams_from_league(req.query.leagueID, (function (err, results) {
        res.send({
            error:err,
            results:results
        })
    }))
});





app.get('/get_leagues', function (req, res) {
    model.get_leagues((function (err, results) {
        res.send(
            {
                error:err,
                results:results
            }
        )
    }))
});

app.get('/get_free_players', function (req, res) {
    model.get_free_players((function (err, results) {
        res.send(
            {
                error:err,
                results:results
            }
        )
    }))
});
//DB gets
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/game_selector.html'));
})

app.get('/toTestDraft', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/toTestDraft.html'));
})

app.get('/editTeam', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/edit_team.html'));
})
app.get('/dentry', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/data_entry_page.html'));
})

app.get('/dmgcalculator', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/damage_calculator.html'));
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

app.get('/blueSide', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/draft_page.html'));
})

app.get('/blueSide', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/draft_page.html'));
})

app.get('/addPlayer', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/add_player.html'));
})

app.get('/blueSide', function (req, res) {
    res.sendFile(path.join(__dirname + '/View/edit_team.html'));
})






///POST///
app.post('/insert_player', function (req, res) {
    var jsonPlayers  = JSON.stringify(req.body);
    var playerInfo = JSON.parse(jsonPlayers);
    model.insert_player(playerInfo.playersNames, playerInfo.playersPositions)
});

app.post('/action_data_insert', function (req, res) {
    var jsonAction = JSON.stringify(req.body);
    var actionInfo = JSON.parse(jsonAction);
    model.insert_game_action(actionInfo.gameID, actionInfo.playerID, actionInfo.teamID, actionInfo.gameActionID, actionInfo.champID, actionInfo.turretType, actionInfo.time, actionInfo.xCoor, actionInfo.yCoor, actionInfo.solo_action, actionInfo.baron_buff);
});

app.post('/draft_data', function (req, res) {
   var jsonDraft = JSON.stringify(req.body);
    var draftInfo = JSON.parse(jsonDraft);

   // console.log('Got Body:', draftInfo);
    model.insert_draft_info(draftInfo.gameID, draftInfo.blueBans, draftInfo.bluePicks, draftInfo.redBans, draftInfo.redPicks, draftInfo.curPatch, draftInfo.gameResult, draftInfo.league);

});

app.post('/delete_action_row', function (req, res) {
    var game_action_data = JSON.stringify(req.body);
    var game_action = JSON.parse(game_action_data);

    model.delete_game_action_row(game_action.gaiID, (function (err, results) {
        res.send(
            {
                error:err,
                results:results
            }
        )
    }))
});

app.post('/add_player_to_team_roster', function (req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    model.add_player_to_team_roster(data.teamID, data.playerID, (function (err, results) {
        res.send(
            {
                error:err,
                results:results
            }
        )
    }))
});

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
