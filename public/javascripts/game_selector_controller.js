/*To add:
DB functions where is loads game and their ids on page load
 */
function onload() {
 load_leagues();

}

function toTestDraft() {
    window.open("http://localhost:3000/toTestDraft?gid=-1&btid=-1&rtid=-1")
}
function addPlayerInformation() {
    window.open("http://localhost:3000/addPlayer")

}
 function addTeamRosterInformation() {
     window.open("http://localhost:3000/editTeam")

 }
function toDraft(gameID, btid, rtid) {
    // redirect the page to the drafting page for the specified game
    window.open("http://localhost:3000/draft?gid="+gameID+"&btid="+btid+"&rtid="+rtid+"&lea="+document.getElementById("leagueSelect").value);
}

function toRedSide(gameID, teamID) {
// redirect the page to the red side eventing page for the specified game
    window.open("http://localhost:3000/dentry?gid="+gameID+"&tid="+teamID+"&side=red");


}
function toBlueSide(gameID, teamID) {
    //redirect the page to the blue side eventing page for the specified game
    window.open("http://localhost:3000/dentry?gid="+gameID+"&tid="+teamID+"&side=blue");
}

function DamageCalculator(){
    //redirect the page to the blue side eventing page for the specified game
    window.open("http://localhost:3000/dmgcalculator");
}




function load_leagues() {
    $.get('/get_leagues', '', function (data) {
        let leagues = data.results;
        console.log(leagues);
        //var div = document.getElementById("leagueSelect");
        var selectList = document.getElementById("leagueSelect");
        var option = document.createElement("option");
        for(let i = 0; i < leagues.length; i++){
            option = document.createElement("option");
            option.value =leagues[i].lname.toLowerCase();
            option.text = leagues[i].lname;
            selectList.appendChild(option);
        }

    });
}

function leagueSelect() {
    var game_listDIV = document.getElementById("gamesUl");
    var playoff_data_gameIds = [];
    $("#gameTable").empty();
    $.get('/get_games_for_league', {leagueName: document.getElementById("leagueSelect").value}, function (data) {
        console.log(data.results);

        //we just want the regular season to be outputted in the loop
        for(var i = 0; i < data.results.playoffs.length; i++){
            playoff_data_gameIds.push(data.results.playoffs[i].gameID);
        }

        for (let i = 0; i < data.results.blue_side.length; i++) {
            if(!playoff_data_gameIds.includes(data.results.blue_side[i].game_id)) {
                var li = document.createElement("li");
                var game_info = data.results.blue_side[i].Blue_Side.replace(/_/g, ' ') + "(Blue Side) VS " + data.results.red_side[i].Red_Side.replace(/_/g, ' ') + " (Red Side) " + " Played On: " + data.results.blue_side[i].game_date;
                var game_button_draft = "<button class=\"btn btn-info\" id=" + data.results.blue_side[i].game_id + " onclick=\"toDraft(" + data.results.blue_side[i].game_id + "," + data.results.blue_side[i].team_id + "," + data.results.red_side[i].team_id + ")\">Draft</button></td>";
                var game_button_blue = "<button class=\"btn btn-primary\" id=" + data.results.blue_side[i].game_id + "" +
                    " onclick=\"toBlueSide(" + data.results.blue_side[i].game_id + "," + data.results.blue_side[i].team_id + ")\">Data Entry</button></td>";
                var game_button_red = "<button class=\"btn btn-danger\" id=" + data.results.blue_side[i].game_id +
                    " onclick=\"toRedSide(" + data.results.red_side[i].game_id + "," + data.results.red_side[i].team_id + ")\">Data Entry</button></td>";
                li.innerHTML = game_info + " " + game_button_draft + " " + game_button_blue + " " + game_button_red;
                li.value = data.results.blue_side[i].game_id;
                game_listDIV.appendChild(li);
            }
        }
        load_playoff(data.results.playoffs);
    });

    //load playoffs

}

function load_playoff(playoffsGames) {
    var game_listDIV = document.getElementById("gamesUl");

    for(var i=0; i < playoffsGames.length;i++){
        var li = document.createElement("li");
        console.log(playoffsGames[i]);
        li.innerHTML = playoffsGames[i].blue_side_team +"(Blue Side)  VS "+ playoffsGames[i].red_side_team + " (Blue Side), Played ON: " + playoffsGames[i].game_date +  "<button class=\"btn btn-info\" id=" +playoffsGames[i].gameID + " onclick=\"toDraft(" + playoffsGames[i].gameID  + "," + playoffsGames[i].blue_team_id + "," +playoffsGames[i].red_side_team_id + ")\">Draft</button></td>";
        li.style = "font-weight: bold";
        game_listDIV.appendChild(li);
    }

}
function gameSearch() {
    input = document.getElementById("gameInput");
    filter = input.value.toUpperCase();
    gameUl = document.getElementById("gamesUl");
    li = gamesUl.getElementsByTagName("li");
    console.log(li.length);
    for (i = 0; i < li.length; i++) {
        game = li[i].getElementsByTagName("button")[0];
        gameValue = game.id;
        if (gameValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }    }
}


