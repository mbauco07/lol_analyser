//GLOBALS VARIABLES//
let xLocation, yLocation;
let currentGenAction = -1;




$( document ).ready(function() {
    //load the layout into the canvas
    //load the champs name into console
    var canvas = document.getElementById("mapCanvas");
    var canvasContext = canvas.getContext("2d");
    var img = document.getElementById("mapLayout");
    canvasContext.drawImage(img, 0,0);
    canvas.addEventListener("mousedown", function(e)
    {
        getMousePosition(canvas, e);
    });
    get_game_team_information();
    load_game_actions();
    set_game_actions();
    get_game_items();
    get_sspells();


});


function get_game_items() {
        $.get('/items', {}, function (data) {
            console.log(data);
        });
}

function get_sspells() {
        $.get('sspells', {}, function (data) {
            console.log(data);
        })
}
function getMousePosition(canvas, event){

    let rect = canvas.getBoundingClientRect();
    xLocation = event.clientX - rect.left;
    yLocation = event.clientY - rect.top;

    canvas.getContext("2d").fillRect(xLocation,yLocation,5,5);
}


function get_game_team_information() {

        $.get('/get_game_team_info', { gameID:getUrlParameter("gid")}, function (data) {
                 let result = data.results;
            document.getElementById("blueSideTeam").innerHTML = result[0]["tName"].replace(/_/g, ' ');
            document.getElementById("redSideTeam").innerHTML = result[6]["tName"].replace(/_/g, ' ');
            for(var i = 0; i < 5; i++){
                //add the champions images to the corresponding team div
                let blueSideChamp = document.getElementById("blueChamp"+(i+1));
                blueSideChamp.id = result[i]["cID"];
                blueSideChamp.value = result[i]["plyID"]+"_"+ result[i]["cID"];
                $('label[for=blueChamp'+(i+1)+']').html(result[i]["cName"].replace(/_/g, ' ') + ":" + result[i]["plyName"]);
            }
            for(var j = 5; j < 10; j++){
                let redSideChamp = document.getElementById("redChamp" + (j-4));
                redSideChamp.id = result[j]["cID"];
                redSideChamp.value = result[j]["plyID"]+"_"+ result[j]["cID"];
                $('label[for=redChamp'+(j-4)+']').html(result[j]["cName"].replace(/_/g, ' ')+ ":" + result[j]["plyName"]);

            }

        });
}


function set_game_actions() {
    $.get('get_general_game_actions', " ", function (data) {
        var general_actions = data.results.general_actions_results;

        var div = document.getElementById("typeOfGenAction");
        var selectList = document.getElementById("typeOfGenActionsSelect");
        var option = document.createElement("option");
         for(let i = 0; i < general_actions.length; i++){
              option = document.createElement("option");
                option.value =general_actions[i].ggID;
                option.text = general_actions[i].gAType;
             selectList.appendChild(option);
            }
        div.appendChild(selectList);

        //load the specific actions as buttons but keep them hidden
        var specific_actions = data.results.actions_results;
         var buttonDiv = document.getElementById("specificActionButtons");

        for(let i = 0; i < specific_actions.length; i++) {
            var newActionButton = document.createElement("BUTTON");
            newActionButton.className = "btn btn-dark";
            newActionButton.innerHTML = specific_actions[i].gAction;
            newActionButton.name = specific_actions[i].ggID;
            newActionButton.id = specific_actions[i].gID;
            newActionButton.addEventListener("click", function () {
                action_selected(specific_actions[i].gID)
            });
            newActionButton.hidden =true;
            buttonDiv.appendChild(newActionButton);

        }
    });
}

function generalActionSelected() {
    //reset the div to make everything hidden before showing any new actions
    for(var i =0; i < document.getElementsByName(currentGenAction).length;i++){
        document.getElementsByName(currentGenAction)[i].hidden = true;
    }
     var generalAction = document.getElementById("typeOfGenActionsSelect").value;
    for(var i =0; i < document.getElementsByName(generalAction).length;i++){
        document.getElementsByName(generalAction)[i].hidden = false;
    }
    currentGenAction = generalAction;


}

/**
 * Once a action is selected this will get all clicked information necessary and attempt to insert it into the db
 * @param action_id: the action the is being inserteed
 * We will make sure that all necesary information is fufilled before we send to the server side,
 * necessarry information includes: the champion and player the action is linked to, the location on the map the location occured
 * if the action was done solo or not, what type of general action was performed and the specific action done based on the general selector.
 */
function action_selected(action_id){
    //check if all the necesarry information is filled out or not blank
    //check if a player/champ has been selected
    let time;
    let action_data = {};
    let radioBoxName;

    //we check the side that we are eventing
    if(getUrlParameter("side") == 'blue'){
        radioBoxName = "blueSideChamps";
    }
    else{
        radioBoxName = "redSideChamps";

    }

    //get the time
    if(document.getElementById("actionMinuteTime").value != "" && document.getElementById("actionSecondTime").value != ""){
        //check to make sure the chose where the action took place
        if(xLocation != null && yLocation != null){
            if($('input[name='+radioBoxName+']:checked').length  > 0 ){
                //now that we have check the input that has a possibility of being null we can send it to server side for the blue side team
                time = "00:"+document.getElementById("actionMinuteTime").value+":"+document.getElementById("actionSecondTime").value;
                action_data = {
                    "gameID": getUrlParameter("gid"),
                    "playerID": $('input[name='+radioBoxName+']:checked').val().split("_")[0],
                    "teamID": getUrlParameter("tid"),
                    "gameActionID": action_id,
                    "champID": $('input[name='+radioBoxName+']:checked').val().split("_")[1],
                    "turretType": document.getElementById("turretType").value,
                    "time":time,
                    "xCoor": xLocation,
                    "yCoor": yLocation,
                    "solo_action": ($('input[name=solo]:checked').length > 0 ? 1 : 0),
                    "baron_buff": ($('input[name=baronBuff]:checked').length > 0 ? 1 : 0)

                };

                $.post({
                    url: "/action_data_insert",
                    data: action_data,
                    dataType: "json",
                });
                location.reload(true);
            }
            else{
                alert("please make sure you click an player ");
            }
        }
        else{
            alert("please make sure you have selected a location of the rift map");
        }

    }
    else{
        alert("There was an Issue with Processing the Action check your Minute and Second boxes");
    }

}


function load_game_actions() {
    $.get('/get_game_actions_info', { gameID:getUrlParameter("gid")}, function (data) {
        let actions = data.results;
        console.log(actions);
        let actionTable = document.getElementById("gameActionsData");
        if(actions.length <= 0){
            let newRow = document.createElement('tr');
            newRow.innerHTML = "No Actions Have Been Recorded Yet";
            newRow.style.border = "thick solid black";
            actionTable.appendChild(newRow);

        }
        for(let i =0; i < actions.length; i++){
            let newRow = document.createElement('tr');
            newRow.innerHTML = actions[i].plyName+":"+actions[i].action_name+" at:"+actions[i].time;
            newRow.id = actions[i].gai_id;
            if(actions[i].teamID == actions[i].blue_side){
                newRow.style.color = 'blue';
            }
            else {
                newRow.style.color = 'red' ;

            }
            newRow.style.border = "thick solid #0000FF";
            newRow.addEventListener("click", removeRow);
            actionTable.appendChild(newRow);
        }

    });

}
function removeRow() {
   var r = confirm("Are you Sure You Want To Delete This Event Permanently?");
   if(r==true){
        console.log($(this).closest('tr').attr('id'));
       $.post("/delete_action_row", { gaiID:$(this).closest('tr').attr('id')}, function (data) {
           let results = data.results;

           //we only remove the data from the client side if we know the databse acvtually removed a row
           if(results > 0){
               location.reload(true);
           }
           else{
               alert("DB error");
           }
       });


   }

}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}