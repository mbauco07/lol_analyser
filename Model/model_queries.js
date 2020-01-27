var mysql = require('mysql');
//Promise based http client
const axios = require('axios');
const Path = require('path')
const fs = require('fs')
const request = require("request");
const dataDragonUrl = "http://ddragon.leagueoflegends.com/cdn/10.2.1/img/champion/";

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
    return axios.get('http://ddragon.leagueoflegends.com/cdn/10.1.1/data/en_US/champion.json')
        //success
        .then(response => {

            champsJSON = [];
            var champs = response.data

            //console.log(champs.data);
            for (i in champs.data) {
                //console.log(ch
                var name = champs.data[i].name;
                var key = champs.data[i].key;
                champInfo = {};
                //download the champion sqaure asset
                downloadChampImages(name);
                champInfo["NAME"] = name;
                champInfo["ID"] = key;
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
 * @param callback
 */
function downloadChampImages(champName) {
    console.log(champName)
    var url = dataDragonUrl+champName+".png" //web url where the images are hosted
    url = url.replace(" ", "") //remove spaces from url if any appear
    url = url.replace("'", "") //remove ' from url if any appear
    url = url.replace(".", "") //remove . from url if any appear
    axios.get(url,  {responseType: "stream"} )
        .then(response => {
// Saving file to working directory
            response.data.pipe(fs.createWriteStream("public/images/champSquareAssets/"+champName+".png"));
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

        });
    })

}

exports.getGameList = getGameListCallBack;


/*getGame
about: it will get the game source and the teams so we can send it to the client
input: gameID
output: game video, team info (players and side select)
 */

function getGameInfo(gameID, callback){
    con.query("SELECT game_link FROM lol_data.lcs_games_spring_2019 where game_id = ?",
        [
                    gameID
                ],
        function (err, gameResults) {
            if(err) {
                return (err, null);

            }
            callback(err, gameResults);

    })

}
exports.getGameInfo = getGameInfo;
