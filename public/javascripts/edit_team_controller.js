

$( document ).ready(function() {

load_leagues();
load_players();

    $( "#addPlayer" ).click(function() {
        var r = confirm("Would You Like To add This Player To the Team?");
        if(r){
        }
        else{
            alert("fine");
        }
    });

});

function load_leagues() {
    $.get('/get_leagues', '', function (data) {
        let leagues = data.results;
        console.log(leagues);
        //var div = document.getElementById("leagueSelect");
        var selectList = document.getElementById("leagueSelect");
        var option = document.createElement("option");
        for(let i = 0; i < leagues.length; i++){
            option = document.createElement("option");
            option.value =leagues[i].lid;
            option.text = leagues[i].lname;
            selectList.appendChild(option);
        }

    });
}


function leagueSelect(){
//alert(document.getElementById("leagueSelect").value)
    $("#teamSelect").empty();
    $.get('/get_teams_from_league', { leagueID:document.getElementById("leagueSelect").value }, function (data) {
        let teams = data.results;

        var selectList = document.getElementById("teamSelect");
        var option = document.createElement("option");
        for(let i = 0; i < teams.length; i++){
            option = document.createElement("option");
            option.value =teams[i].tid;
            option.text = teams[i].tname.replace(/_/g, ' ');
            selectList.appendChild(option);
        }

    });

}

function teamSelect() {
    $("#teamInfo").empty();
    $.get('/get_team_roster', {teamID: document.getElementById("teamSelect").value}, function (data) {
        let team_roster = data.results;
        var div = document.getElementById("teamInfo");
        var list = document.createElement("ul");
            if(team_roster.length > 0){
                for (var i=0; i < team_roster.length; i++){
                    var item = document.createElement("li");
                    item.value = team_roster[i].playerID;
                    item.appendChild(document.createTextNode(team_roster[i].player +":"+ team_roster[i].position.replace(/_/g, ' ')));
                    div.appendChild(list.appendChild(item));                }
            }
            else{
                var item = document.createElement("li");
                item.appendChild(document.createTextNode("No Players have been added to the Roster"));
                div.appendChild(list.appendChild(item));
            }
    });
}


function load_players() {
    $.get('/get_free_players', '', function (data) {
        let free_agents = data.results;
        var selectList = document.getElementById("playerSelect");
        var option = document.createElement("option");
        for(let i = 0; i < free_agents.length; i++){
            option = document.createElement("option");
            option.value = free_agents[i].playerID;
            option.text = free_agents[i].player.replace(/_/g, ' ');
            selectList.appendChild(option);
        }
    });
}