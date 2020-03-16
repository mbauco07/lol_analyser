/*To add:
DB functions where is loads game and their ids on page load
 */
function onload() {
 getGameList();
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
    window.open("http://localhost:3000/draft?gid="+gameID+"&btid="+btid+"&rtid="+rtid);
}

function toRedSide(gameID, teamID) {
// redirect the page to the red side eventing page for the specified game
    window.open("http://localhost:3000/dentry?gid="+gameID+"&tid="+teamID+"&side=red");


}
function toBlueSide(gameID, teamID) {
    //redirect the page to the blue side eventing page for the specified game
    window.open("http://localhost:3000/dentry?gid="+gameID+"&tid="+teamID+"&side=blue");
}

/*getGameList
This function will get the data from the db and send in back to the client as a row in the table
 */
function getGameList() {
    jQuery.get('/gameList', " ", function (data) {
        console.log(data.results.blue_side[9]);
        let tableToPopulate = document.getElementById("gameTable")
        for(let i = 0; i < data.results.blue_side.length; i++){
            //create new row to add
            var newTableRow = tableToPopulate.insertRow(i);
            //create the new cells for the row
            var gameCell = newTableRow.insertCell(0);
            var draftCell = newTableRow.insertCell(1);
            var blueSideDentryCell = newTableRow.insertCell(2);
            var redSideDentryCell = newTableRow.insertCell(3);
            //populate each cell with the correct information
            gameCell.innerHTML = data.results.blue_side[i].Blue_Side.replace(/_/g, ' ') + "(Blue Side) VS " +data.results.red_side[i].Red_Side.replace(/_/g, ' ')+"(Red Side)";
            draftCell.innerHTML = "<button class=\"btn btn-info\" id="+data.results.blue_side[i].game_id+" onclick=\"toDraft("+data.results.blue_side[i].game_id+","+data.results.blue_side[i].team_id+","+data.results.red_side[i].team_id+")\">Draft</button></td>";
            blueSideDentryCell.innerHTML = "<button class=\"btn btn-primary\" id="+data.results.blue_side[i].game_id+""+
                " onclick=\"toBlueSide("+data.results.blue_side[i].game_id+","+data.results.blue_side[i].team_id+")\">Data Entry</button></td>";
            redSideDentryCell.innerHTML = "<button class=\"btn btn-danger\" id="+data.results.blue_side[i].game_id+
                " onclick=\"toRedSide("+data.results.red_side[i].game_id+","+data.results.red_side[i].team_id+")\">Data Entry</button></td>";

        }

    } );

}
