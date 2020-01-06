var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "lol_data"
});



exports.connectToDB = function () {
    con.connect(function (err) {
        if (err) throw err;

    });
}


//Custom Modules that return data to the client//

/*getChamplist
*about: This module will get all the names of the champions in aplhabetical order and return them to the client side
*input: N/A
*output: a list of all the champions and their unique id
 */
function getChampListCallback (callback) {
    con.query("SELECT DISTINCT  champ_id as ID, champ_name as NAME FROM lol_data.champs ORDER BY champ_name", function (err, result, fields)
    {
        if(err) {
            return (err, null);

        }

        //console.log("model side "+ JSON.stringify(result));
        callback(err, result);

    });

}
exports.getChamplist = getChampListCallback;
/*GET_GAME
*about: This module will retrieve the game information (the game id and the teams names)
*input: N/A
*output: a list of the game ids and the respective teams playing in each game on the correct side (blue or red)
*ext: we will need to do 2 queries as we need both the blue and red side teams names both queries will include the game_id
 */

function  getGameListCallBack(callback) {
    //blue side teams query
    let blue_side_query = "SELECT game_id , team_information.team_name as Blue_Side, team_id FROM team_information\n" +
        "inner join \n" +
        "game_information  blue_side on blue_side.blue_side_team = team_information.team_id\n" +
        "order by game_id";

    //red side teams query
    let red_side_query = " SELECT game_id, team_information.team_name as Red_Side, team_id FROM team_information\n" +
        "inner join \n" +
        "game_information  red_side on red_side.red_side_team = team_information.team_id\n" +
        "order by game_id";

    con.query(blue_side_query, function (err, blue_teams_results) {
        con.query(red_side_query, function (err, red_side_results) {
            if(err) {
                return (err, null);

            }
               var results = {"blue_side" : blue_teams_results, "red_side":red_side_results}
             callback(err, results);
           // callback(err, result);
        });
    })

}

exports.getGameList = getGameListCallBack;
