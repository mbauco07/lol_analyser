var mysql = require('mysql');
//Promise based http client
const axios = require('axios');
const Path = require('path')
const fs = require('fs')
const request = require("request");
const dataDragonUrl = 'https://ddragon.leagueoflegends.com/cdn/10.3.1/img/champion/';

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "lol_data",
    multipleStatements: true
});



exports.connectToDB = function () {
    con.connect(function (err) {
        if (err) throw err;

    });
}

/*
//Custom Modules that return data to the client//

/*getChamplist
*about: This module will get all the names of the champions in aplhabetical order and return them to the client side
*input: N/A
*output: a list of all the champions and their unique id
 */
/**
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
*/

function getChamps() {
    return axios.get('http://ddragon.leagueoflegends.com/cdn/10.3.1/data/en_US/champion.json')
        //success
        .then(response => {

            champsJSON = [];
            var champs = response.data

            //console.log(champs.data);
            for (i in champs.data) {
                //console.log(ch
                var name = champs.data[i].name;
                var key = champs.data[i].key;
                var imageName = champs.data[i].image.full;
                champInfo = {};
                //download the champion sqaure asset

               //downloadChampImages(, name); //this is the image file name for each characther
                champInfo["NAME"] = name;
                champInfo["ID"] = key;
                champInfo["FULL"] = imageName;
                champInfo["URL"] = dataDragonUrl;
                champsJSON.push(champInfo)
            }
            return (champsJSON);
        })
        //failure
        .catch(error => {
            return error;
        });
}

exports.getChamps = getChamps;


/**DOWNLOAD CHAMP IMAGES
 * This Function will download the champions images and replace old images with new ones
 * or add new images for new champs*
 *
 * @inputs: champURL (the image file name for each champion), name (the name for the champion but formatted like how you would see it in game)
 */
function downloadChampImages(champNameURL, name) {
    //console.log(champNameURL)
    var url = dataDragonUrl+champNameURL; //web url where the images are hosted

    axios.get(url,  {responseType: "stream"} )
        .then(response => {
    // Saving file to working directory
            response.data.pipe(fs.createWriteStream("public/images/champSquareAssets/"+name+".png"));
        })
        .catch(error => {
            console.log(error);
        });

}

/*GET_GAMES_LIST
*about: This module will retrieve the game information (the game id and the teams names)
*input: N/A
*output: a list of the game ids and the respective teams playing in each game on the correct side (blue or red)
*ext: we will need to do 2 queries as we need both the blue and red side teams names both queries will include the game_id
 */

function  getGameListCallBack(callback) {
    //blue side teams query
    let blue_side_query = "SELECT game_id , team_information.team_name as Blue_Side, team_id FROM team_information\n" +
        "INNER JOIN \n" +
        "game_information  blue_side ON blue_side.blue_side_team = team_information.team_id\n" +
        "ORDER BY game_id";

    //red side teams query
    let red_side_query = " SELECT game_id, team_information.team_name as Red_Side, team_id FROM team_information\n" +
        "INNER JOIN \n" +
        "game_information  red_side ON red_side.red_side_team = team_information.team_id\n" +
        "ORDER BY game_id";

    con.query(blue_side_query, function (err, blue_teams_results) {
        con.query(red_side_query, function (err, red_side_results) {
            if(err) {
                return (err, null);

            }
            var results = {"blue_side" : blue_teams_results, "red_side":red_side_results}
            callback(err, results);

        });
    })

}

exports.getGameList = getGameListCallBack;


/*getTeamsInfo
about:will send team information, the players on the specified team and those players positions
input: btid: the team that is on blue side, rtid, the team that is on red side
output: team name, team id, player id, player name, player position name
NOTES: we are doing two seperate queries, one for blue side and one for red side
 */

function getTeamsInfo(btid, rtid, callback){
    let blue_side_query = "SELECT DISTINCT team_name as Team, team_information.team_id as tID, player_information.player_id as plyID, player_name as plyName, positions.position_name as posName\n" +
        "FROM team_rosters_lcs_spring_2020\n" +
        "INNER JOIN team_information\n" +
        "ON team_rosters_lcs_spring_2020.team_id = team_information.team_id\n" +
        "INNER JOIN game_information\n" +
        "ON game_information.blue_side_team = team_information.team_id\n" +
        "INNER JOIN player_information \n" +
        "ON player_information.player_id = team_rosters_lcs_spring_2020.player_id\n" +
        "INNER JOIN positions\n" +
        "ON positions.position_id = player_information.positions_position_id\n" +
        "WHERE team_information.team_id ="+con.escape(btid);

    let red_side_query = "SELECT DISTINCT team_name as Team, team_information.team_id as tID, player_information.player_id as plyID, player_name as plyName, positions.position_name as posName\n" +
        "FROM team_rosters_lcs_spring_2020\n" +
        "INNER JOIN team_information\n" +
        "ON team_rosters_lcs_spring_2020.team_id = team_information.team_id\n" +
        "INNER JOIN game_information\n" +
        "ON game_information.blue_side_team = team_information.team_id\n" +
        "INNER JOIN player_information \n" +
        "ON player_information.player_id = team_rosters_lcs_spring_2020.player_id\n" +
        "INNER JOIN positions\n" +
        "ON positions.position_id = player_information.positions_position_id\n" +
        "WHERE team_information.team_id ="+con.escape(rtid);

    con.query(blue_side_query, function (err, blue_side_results) {
        con.query(red_side_query, function (err, red_side_results) {
            if (err) {
                return (err, null);

            }
            var results = {"blue_side": blue_side_results, "red_side": red_side_results}
            callback(err, results);

        });
    });


}
exports.getTeamsInfo = getTeamsInfo;


/**INSERT DRAFT INFO
 * will insert all the draft and ban information for a specific match
 * @param gameID: the current game that's data is being inserted
 * @param blueBans: the blue teams Bans and the order in which they banned
 * @param bluePicks: the blue teams Picks, the order in which they banned and the player who is politing the champ
 * @param redBans: the red teams Bans and the order in which they banned
 * @param redPicks: the red teams Picks, the order in which they banned and the player who is politing the champ
 * @param curPatch: this is the current Patch that the game is being played on
 * @param gameResults: holds the information regarding which team won and lost the match
 *
 */
function insert_draft_info(gameID, blueBans, bluePicks, redBans, redPicks,curPatch, gameResults) {
        var insertSQL = "INSERT INTO draft_information (game_id, team_id, champ_id, player_id, pb_time, pb_type, pb_number, team_side, patch) VALUES ?";
        var values = [
            [gameID, blueBans[0]["tID"], blueBans[0]["cID"], blueBans[0]["plyID"], blueBans[0]["TIME"], blueBans[0]["pTYPE"], blueBans[0]["pbNum"], blueBans[0]["TEAM_SIDE"], curPatch ],
            [gameID, blueBans[1]["tID"], blueBans[1]["cID"], blueBans[1]["plyID"], blueBans[1]["TIME"], blueBans[1]["pTYPE"], blueBans[1]["pbNum"], blueBans[1]["TEAM_SIDE"], curPatch ],
            [gameID, blueBans[2]["tID"], blueBans[2]["cID"], blueBans[2]["plyID"],blueBans[2]["TIME"], blueBans[2]["pTYPE"], blueBans[2]["pbNum"], blueBans[2]["TEAM_SIDE"], curPatch ],
            [gameID, blueBans[3]["tID"], blueBans[3]["cID"], blueBans[3]["plyID"], blueBans[3]["TIME"], blueBans[3]["pTYPE"], blueBans[3]["pbNum"], blueBans[3]["TEAM_SIDE"], curPatch ],
            [gameID, blueBans[4]["tID"], blueBans[4]["cID"], blueBans[4]["plyID"], blueBans[4]["TIME"], blueBans[4]["pTYPE"], blueBans[4]["pbNum"], blueBans[4]["TEAM_SIDE"], curPatch ],
            [gameID, bluePicks[0]["tID"], bluePicks[0]["cID"], bluePicks[0]["plyID"], bluePicks[0]["TIME"], bluePicks[0]["pTYPE"], bluePicks[0]["pbNum"], bluePicks[0]["TEAM_SIDE"], curPatch ],
            [gameID, bluePicks[1]["tID"], bluePicks[1]["cID"], bluePicks[1]["plyID"],  bluePicks[1]["TIME"], bluePicks[1]["pTYPE"], bluePicks[1]["pbNum"], bluePicks[1]["TEAM_SIDE"], curPatch ],
            [gameID, bluePicks[2]["tID"], bluePicks[2]["cID"], bluePicks[2]["plyID"], bluePicks[2]["TIME"], bluePicks[2]["pTYPE"], bluePicks[2]["pbNum"], bluePicks[2]["TEAM_SIDE"], curPatch ],
            [gameID, bluePicks[3]["tID"], bluePicks[3]["cID"], bluePicks[3]["plyID"], bluePicks[3]["TIME"], bluePicks[3]["pTYPE"], bluePicks[3]["pbNum"], bluePicks[3]["TEAM_SIDE"], curPatch ],
            [gameID, bluePicks[4]["tID"], bluePicks[4]["cID"], bluePicks[4]["plyID"], bluePicks[4]["TIME"], bluePicks[4]["pTYPE"], bluePicks[4]["pbNum"], bluePicks[4]["TEAM_SIDE"] , curPatch],
            [gameID, redBans[0]["tID"], redBans[0]["cID"], redBans[0]["plyID"], redBans[0]["TIME"], redBans[0]["pTYPE"], redBans[0]["pbNum"], redBans[0]["TEAM_SIDE"], curPatch ],
            [gameID, redBans[1]["tID"], redBans[1]["cID"], redBans[1]["plyID"],  redBans[1]["TIME"], redBans[1]["pTYPE"], redBans[1]["pbNum"], redBans[1]["TEAM_SIDE"] , curPatch],
            [gameID, redBans[2]["tID"], redBans[2]["cID"], redBans[2]["plyID"],  redBans[2]["TIME"], redBans[2]["pTYPE"], redBans[2]["pbNum"], redBans[2]["TEAM_SIDE"], curPatch ],
            [gameID, redBans[3]["tID"], redBans[3]["cID"], redBans[3]["plyID"],  redBans[3]["TIME"], redBans[3]["pTYPE"], redBans[3]["pbNum"], redBans[3]["TEAM_SIDE"] , curPatch],
            [gameID, redBans[4]["tID"], redBans[4]["cID"], redBans[4]["plyID"],  redBans[4]["TIME"], redBans[4]["pTYPE"], redBans[4]["pbNum"], redBans[4]["TEAM_SIDE"] , curPatch],
            [gameID, redPicks[0]["tID"], redPicks[0]["cID"], redPicks[0]["plyID"], redPicks[0]["TIME"], redPicks[0]["pTYPE"], redPicks[0]["pbNum"], redPicks[0]["TEAM_SIDE"], curPatch ],
            [gameID, redPicks[1]["tID"], redPicks[1]["cID"], redPicks[1]["plyID"], redPicks[1]["TIME"], redPicks[1]["pTYPE"], redPicks[1]["pbNum"], redPicks[1]["TEAM_SIDE"], curPatch ],
            [gameID, redPicks[2]["tID"], redPicks[2]["cID"], redPicks[2]["plyID"],  redPicks[2]["TIME"], redPicks[2]["pTYPE"], redPicks[2]["pbNum"], redPicks[2]["TEAM_SIDE"] , curPatch],
            [gameID, redPicks[3]["tID"], redPicks[3]["cID"], redPicks[3]["plyID"],redPicks[3]["TIME"], redPicks[3]["pTYPE"], redPicks[3]["pbNum"], redPicks[3]["TEAM_SIDE"] , curPatch],
            [gameID, redPicks[4]["tID"], redPicks[4]["cID"], redPicks[4]["plyID"],  redPicks[4]["TIME"], redPicks[4]["pTYPE"], redPicks[4]["pbNum"], redPicks[4]["TEAM_SIDE"], curPatch ],
        ];
        con.query(insertSQL, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });

        var winloseInsert = "INSERT INTO win_lose_information  (game_id, team_id, win_lose, team_side) VALUES ? ";
        var winloseValues = [
            [gameID, gameResults[0]['tID'], gameResults[0]['result'], gameResults[0]['team_side']],
            [gameID, gameResults[1]['tID'], gameResults[1]['result'],gameResults[1]['team_side']]
        ];
        con.query(winloseInsert, [winloseValues], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });

}

exports.insert_draft_info = insert_draft_info;


/** GET TEAM INFORMATION PER GAME
 *
 * @param gameID: the game ID for the specific game
 * @param teamID: the team ID for the team we need the draft information
 * @param callback: used for asyn calls
 */

function get_game_team_info(gameID, callback){
    var team_info_sql = "SELECT game_id as gID, draft_id as dID, champs.champ_id as cID, champs.champ_name as cName,\n" +
        " player_information.player_id as plyID, player_name as plyName, team_information.team_id as tID, team_information.team_name as tName, draft_information.team_side FROM draft_information\n" +
        "INNER JOIN champs\n" +
        "ON draft_information.champ_id = champs.champ_id\n" +
        "INNER JOIN team_information\n" +
        "ON draft_information.team_id = team_information.team_id\n" +
        "INNER JOIN player_information\n" +
        "ON draft_information.player_id = player_information.player_id\n" +
        "WHERE game_id ="+ con.escape(gameID)+" AND draft_information.pb_type = 'pick' \n" +
        "ORDER BY draft_information.team_id";

    con.query(team_info_sql, function (err, results) {

        if (err) {
            return (err, null);

        }
        callback(err, results);

    });

}

exports.get_game_team_info = get_game_team_info;

/**GET GENERAL GAME ACTIONS
 * this function will get the general game actions when a data entry page is loaded
 */
function get_general_game_actions(callback) {
let general_action_sql = "SELECT general_action_id as ggID, general_action_type as gAType  FROM game_general_actions";
let game_actions_sql = "SELECT general_game_action_id as ggID, game_action_id as gID, game_action_name as gAction FROM lol_data.game_actions\n" +
    "ORDER BY general_game_action_id";

    con.query(general_action_sql, function (err, general_results) {
        con.query(game_actions_sql, function (err, actions_results) {
            if (err) {
                return (err, null);

            }
            var results = {"general_actions_results": general_results, "actions_results": actions_results}
            callback(err, results);

        });
    });
}

exports.get_general_game_actions = get_general_game_actions;

/**INSERT GAME ACTION
 * This funtion will insert a row for a game action
 * @param game_id : the current game the is being evented
 * @param player_id: the player associated with the event
 * @param team_id: the team that player is currently playing on
 * @param game_action_id: the game_action that was performed
 * @param turret_type: if their was a turret that was involved
 * @param time: the time the action took place
 * @param xCoor: the X coordinate of the action location
 * @param yCoor: the Y coordinate of the action location
 * @param solo_acion: if the action was done alone by the player or not
 * @param baron_buff: did the player have a baron buff while the action happened
 */
function insert_game_action(game_id, player_id, team_id, game_action_id, champ_id,  turret_type, time, xCoor, yCoor, solo_acion, baron_buff) {
    var insertSQL = "insert into game_actions_information (game_id, player_id, team_id, game_action_id, champ_id, turret_type, action_time, x_coor, y_coor, solo_action, baron_buff) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    var values =
        [game_id,player_id, team_id,game_action_id,champ_id,turret_type, time, xCoor, yCoor, solo_acion, baron_buff];
    con.query(insertSQL, values, function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
}

exports.insert_game_action = insert_game_action;