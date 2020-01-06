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

/*RETURN_CHAMPS
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
 /*exports.returnChamps = function(err, data, ) {

        con.query("SELECT champ_id, champ_name FROM lol_data.champs ORDER BY champ_name", function (err, result, fields)
        {
            if(err) {
                console.log(err)
                return
            }

           console.log("model side "+ JSON.stringify(result));

        })

    };
*/