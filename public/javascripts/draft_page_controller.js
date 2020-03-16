
function  onload(){
    document.cookie = "AC-C=ac-c;expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/;SameSite=None";
    //get_Game();
    populateChampDropDown();
}


/**GET_GAME
 * get the video feed for the current game
 */
/*function get_Game() {
  var gid = getUrlVars()["gid"];
    jQuery.get('/getGameFeed',  { gid:gid}, function (data) {
        console.log(data.results[0]["game_link"]);
        let videoFrame = document.getElementById("gameVideo");
        videoFrame.src = data.results[0]["game_link"];
        videoFrame.setAttribute("sameSite", "Lax");
    } );

}*/
function populateChampDropDown() {
    jQuery.get('/champs', " ", function (data) {
         for (let i = 0; i < data.length; i++) {
           let selectToPopulate = document.getElementById("cur_Champ");
            var newElement = document.createElement("option");
            newElement.textContent = data[i]["NAME"];
            newElement.id = data[i]["ID"];
            newElement.value = data[i]["NAME"];
            selectToPopulate.appendChild(newElement);
        }
    });
}

function addChampToDraft() {
    //check to make sure that a champ was chosen
    if($("#cur_Champ option:selected").attr("id") !=-1){
        addChampToTable(document.getElementById("gameDraftOrder").rows.length+1, $("#cur_Champ option:selected").attr("value"), $("#cur_Champ option:selected").attr("id"));$("#cur_Champ option:selected").attr("id")
        //once a champion has been added he cant be added again to the
        $("#cur_Champ option:selected").attr('disabled','disabled')
            .siblings().removeAttr('disabled');;
    }
    else{
        alert("Sorry Please Choose a Champion or One who has not already been chosen");
    }
    console.log( $("#cur_Champ option:selected").attr("id"));

}
function addChampToTable(pickNumber, champName, champID){

    let tableToPopulate = document.getElementById("gameDraftOrder")

    var newRow = document.createElement('tr');

    var pickTd = document.createElement('td');
    var champNameTd = document.createElement('td');
    var champIDTd = document.createElement('td');
    /*find way to add champ Image*/
    //populate each cell with the correct information
    newRow.appendChild(pickTd.appendChild(document.createTextNode(pickNumber)));
    newRow.appendChild( champNameTd.appendChild(document.createTextNode(champName)));
    newRow.appendChild( champIDTd.appendChild(document.createTextNode(champID)));
    tableToPopulate.appendChild(newRow);

}



