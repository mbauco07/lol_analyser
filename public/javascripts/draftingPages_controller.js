/**TODO:
 * ADD FUNCTIONALITY TO MAKE IMAGES NON CLICKBALE ONCE THEY ARE ALREADY CLICKED *
 */
//globals
let clockStarted = true;
var counter = 30;

var pbValue = 1 //this will hold what are the current pick or ban it is
let pickBlue = [] //will hold all the picks for the blue side team and, it will also hold the id of the player who will be playing each champ
let picksRed = [] //this will hold all the picks for the red side team and, it will also hold the id of the player who will be playing each champ
let bansBlue = [] //this will hold all the bans for the blue team
let bansRed = [] //this will hold all the bans for the blue team
let blueTeamComp = []; //hold the team composition for blue team
let redTeamComp = []; //hold the team composition for the red team
let gameResult = [];
let readyToSubmit = false;
let blue_side, red_side;

//globals
window.onload = function(){
    getChamps();
    get_teams_info();
}



/**GET_TEAM_INFO
 * get the information for the teams that we are making the draft data for
 *We will send the team ids
 * We will receive the team names, and the current players for the teams
 */
function get_teams_info(){
    $.get('/get_teams_info', { btid:getUrlParameter("btid"), rtid: getUrlParameter("rtid"), league: getUrlParameter("lea")}, function (data) {
        blue_side = data.results.blue_side;
        red_side =  data.results.red_side;
        document.getElementById("blueSideTeam").innerHTML = blue_side[0]["Team"].replace(/_/g, ' ');
        document.getElementById("redSideTeam").innerHTML = red_side[0]["Team"].replace(/_/g, ' ');
    });
}




function getChamps() {
    let champsDiv = document.getElementById("champsDiv");
    jQuery.get('/champs', " ", function (data) {

        let url = data[0]["URL"];
        for (let i = 0; i < data.length; i++) {
                let champURL = url+data[i]["FULL"];
                let img = document.createElement('img');
                //now add champ to div with clickbale property
                img.src = champURL;
                img.id = data[i].ID;
                console.log( data[i].ID+"  "+data[i]["FULL"]);
                img.height = "75";
                img.width = "75";
                img.alt = data[i]["NAME"];
                img.addEventListener("click", function () {champClicked(data[i].ID, img.id)
            })
           champsDiv.appendChild(img)
        }
    });

}


function champClicked(champID, imgID){
    if(clockStarted){
        var img = document.getElementById(imgID)
        span = document.getElementById("count");
        //alert(champID+ "time left : " + span.innerHTML)
        img.style.opacity = "0.2" //grey out image to show that the champ has been picked
        //make sure that the image is no longer clickable for the rest of the current draft
        //TODO:img.removeEventListener('click' , champClicked)
        pickOrBanChamp(champID, img.alt, span.innerHTML);
        //reset the clock
        counter = 31;
    }
    else {
        alert("sorry Picks, Bans can Only start once the timer has begun")
    }

}

/**PICK OR BAN CHAMP
 * This function will be the main driver for picking or banning or champ it will be called by champClicked
 * and will use the champID, champsName and pbValue constant to know what to do
 */
function pickOrBanChamp(champID, champName, pickTime) {
    //create switch function to decipher whos pick or ban it is
        switch (pbValue) {

            //blue bans
            case 1:
            case 3:
            case 5:
            case 14:
            case 16:
                //add champ img to blue ban list
                var currentBan = bansBlue.length + 1;
                let banBlueDiv = document.getElementById("blueBan" + currentBan);
                var banImg = document.createElement('img');
                banImg.src = document.getElementById(champID).src;
                banImg.height = "45";
                banImg.width = "45";
                banImg.alt = champName;
                banBlueDiv.appendChild(banImg);
                //and champ to blueban array
                banInfo = {};
                banInfo["tID"] = getUrlParameter("btid");
                banInfo["cID"] = champID;
                banInfo["plyID"] = -1;
                banInfo["TIME"] = pickTime;
                banInfo["pTYPE"] = 'ban';
                banInfo["pbNum"] = currentBan;
                banInfo["TEAM_SIDE"] = 'blue'
                bansBlue.push(banInfo);
                addTimer(banBlueDiv);
                pbValue++;
                //createPBAlert(champName, pickTime, false, "b");
                break;
            //red bans
            case 2:
            case 4:
            case 6:
            case 13:
            case 15:
                //add champ img to ban list
                var currentBan = bansRed.length + 1;
                let banRedDiv = document.getElementById("redBan" + currentBan);
                banImg = document.createElement('img');
                banImg.src = document.getElementById(champID).src;
                banImg.height = "45";
                banImg.width = "45";
                banImg.alt = champName;
                banRedDiv.appendChild(banImg);
                //and champ to redBand array
                banInfo = {};
                banInfo["tID"] = getUrlParameter("rtid");
                banInfo["cID"] = champID;
                banInfo["plyID"] = -1;
                banInfo["TIME"] = pickTime;
                banInfo["pTYPE"] = 'ban';
                banInfo["pbNum"] = currentBan;
                banInfo["TEAM_SIDE"] = 'red';
                bansRed.push(banInfo);
                addTimer(banRedDiv);
                //createPBAlert(champName, pickTime, false, "r");
                pbValue++;
                break;
            //blue picks
            case 7:
            case 10:
            case 11:
            case 18:
            case 19:
                //add champ to blue pick list
                var currentPick = pickBlue.length + 1;
                var pickBlueDiv = document.getElementById("bluePick" + currentPick);
                var pickImg = document.createElement('img');
                pickImg.src = document.getElementById(champID).src;
                pickImg.height = "75";
                pickImg.width = "150";
                pickImg.alt = champName;
                pickBlueDiv.appendChild(pickImg);
                addTimer(pickBlueDiv);
                load_players(pickBlueDiv, 'b');
                //and champ to blue pick array
                pickInfo = {};
                pickInfo["tID"] = getUrlParameter("btid");
                pickInfo["cID"] = champID;
                pickInfo["plyID"] = -1;
                pickInfo["pTYPE"] = 'pick';
                pickInfo["pbNum"] = currentPick;
                pickInfo["TEAM_SIDE"] = 'blue';
                pickBlue.push(pickInfo);
                //createPBAlert(champName, pickTime, true, "b");
                pbValue++;
                break;
            //red picks
            case 8:
            case 9:
            case 12:
            case 17:
                //add champ to red pick list
                currentPick = picksRed.length + 1;
                var pickRedDiv = document.getElementById("redPick" + currentPick);
                var pickImg = document.createElement('img');
                pickImg.src = document.getElementById(champID).src;
                pickImg.height = "75";
                pickImg.width = "150";
                pickImg.alt = champName;
                pickRedDiv.appendChild(pickImg);
                addTimer(pickRedDiv);
                load_players(pickRedDiv, 'r');
                //and champ to blue pick array
                pickInfo = {};
                pickInfo["tID"] = getUrlParameter("rtid");
                pickInfo["cID"] = champID;
                pickInfo["plyID"] = -1;
                pickInfo["pTYPE"] = 'pick';
                pickInfo["pbNum"] = currentPick;
                pickInfo["TEAM_SIDE"] = 'red';
                picksRed.push(pickInfo);
                //createPBAlert(champName, pickTime, true, "r");
                pbValue++;
                break;
            //we make 20 a seperate case because we need it to do more thna just add an image and information
            case 20:
                //add champ to red pick list
                currentPick = picksRed.length + 1;
                pickRedDiv = document.getElementById("redPick" + currentPick);
                pickImg = document.createElement('img');
                pickImg.src = document.getElementById(champID).src;
                pickImg.height = "75";
                pickImg.width = "150";
                pickImg.alt = champName;
                pickRedDiv.appendChild(pickImg);
                addTimer(pickRedDiv);
                load_players(pickRedDiv, 'r');
                //and champ to blue pick array
                pickInfo = {};
                pickInfo["tID"] = getUrlParameter("rtid");
                pickInfo["cID"] = champID;
                pickInfo["plyID"] = -1;
                pickInfo["pTYPE"] = 'pick';
                pickInfo["pbNum"] = currentPick;
                pickInfo["TEAM_SIDE"] = 'red';
                picksRed.push(pickInfo);
                //createPBAlert(champName, pickTime, true, "r");
                readyToSubmit = true;
                pbValue++;
                break;
            default:
                alert("there was an error with the pick ban system");
        }


}

/**CREATE PICK BAN ALERT
 * This function is just used to create a simple alert that appears at the bottom of the screen was a champions is picked and the time they where picked at
 */
function createPBAlert(champName, clockTime, picked, team) {
    let pbOrderDiv = document.getElementById("pbOrder");
     let newAlert = document.createElement("div");
     let alertType = "";
    //to know if it was a pick or ban we use the picked bool
    //what color will the alert be
    if(team == "b"){
        alertType = "primary"
    }
    else{
        alertType = "danger"
    }
    if(picked){
        newAlert.className ="alert alert-"+alertType+"";
        newAlert.innerHTML = "<strong>"+champName+" was PICKED with: "+ clockTime+" seconds left </strong>"

    }
    else {
        newAlert.className ="alert alert-"+alertType+"";
        newAlert.innerHTML = "<strong>"+champName+" was BANNED with: "+ clockTime+" seconds left </strong>"

    }
pbOrderDiv.appendChild(newAlert)
}

/**SUBMIT DRAFT INFO
 * Function will send a post request to the back end about the draft information
 * this will include: the ban and pick order for each team
 * and will also include the final postions picks for each team after PB is complete
 */
function submitDraftInfo() {
    if(readyToSubmit){
        //get the team compositions
        get_team_comp();
        //get which team won the game
        var didBlueWin = document.querySelector('input[name="blueSideWin"]:checked');
        //get the patch that they are playing on
        var currPatch = $( "#curPatch").val();
        console.log(didBlueWin);
        if(didBlueWin != null){
            //the blueSideTeamWon
            var resultInfo = {};
            resultInfo["tID"] = getUrlParameter("btid");
            resultInfo["result"] = "win";
            resultInfo["team_side"] = "blue";
            gameResult.push(resultInfo);
            resultInfo = {};
            resultInfo["tID"] = getUrlParameter("rtid");
            resultInfo["result"] = "lose";
            resultInfo["team_side"] = "red";
            gameResult.push(resultInfo);
        }
        else{
            //redSideWon
            var resultInfo = {};
            resultInfo["tID"] = getUrlParameter("btid");
            resultInfo["result"] = "lose";
            resultInfo["team_side"] = "blue";
            gameResult.push(resultInfo);
            resultInfo = {};
            resultInfo["tID"] = getUrlParameter("rtid");
            resultInfo["result"] = "win";
            resultInfo["team_side"] = "red";
            gameResult.push(resultInfo);
        }
        var r = confirm("Would You Like To Submit the Information?");
       if (r == true) {
            let draft_data = {
                "gameID": getUrlParameter("gid"),
                "blueBans": bansBlue,
                "bluePicks": pickBlue,
                "redBans": bansRed,
                "redPicks": picksRed,
                "curPatch": currPatch,
                "gameResult":gameResult,
                "league":getUrlParameter("lea")
            };



            $.post({
                url: "/draft_data",
                data: draft_data,
                dataType: "json",
            });

        }
        else {
            alert("Ok Then when ready click submit");
        }
    }
    else{
        alert("Can Not submit yet data is not complete");
    }


}

/**GET TEAM COMP
 * After the pick ban is complete we need to get team composition for each team, IE: who did top play, who did mid play etc...
 * as well as the times the champs where picked at
 */
function get_team_comp(){
    //get Player to Champ info
    //we set it to 5 because they can only be 5 players on one team at once
    pickBlue[0].plyID = document.getElementById("blueSideSelect1").value;
    pickBlue[1].plyID = document.getElementById("blueSideSelect2").value;
    pickBlue[2].plyID = document.getElementById("blueSideSelect3").value;
    pickBlue[3].plyID = document.getElementById("blueSideSelect4").value;
    pickBlue[4].plyID = document.getElementById("blueSideSelect5").value;

    picksRed[0].plyID = document.getElementById("redSideSelect1").value;
    picksRed[1].plyID = document.getElementById("redSideSelect2").value;
    picksRed[2].plyID = document.getElementById("redSideSelect3").value;
    picksRed[3].plyID = document.getElementById("redSideSelect4").value;
    picksRed[4].plyID = document.getElementById("redSideSelect5").value;

    //get pick time for each champ that is picked
    pickBlue[0].TIME = document.getElementById("numberbluePick1").value;
    pickBlue[1].TIME = document.getElementById("numberbluePick2").value;
    pickBlue[2].TIME = document.getElementById("numberbluePick3").value;
    pickBlue[3].TIME = document.getElementById("numberbluePick4").value;
    pickBlue[4].TIME = document.getElementById("numberbluePick5").value;

    picksRed[0].TIME = document.getElementById("numberredPick1").value;
    picksRed[1].TIME = document.getElementById("numberredPick2").value;
    picksRed[2].TIME = document.getElementById("numberredPick3").value;
    picksRed[3].TIME = document.getElementById("numberredPick4").value;
    picksRed[4].TIME = document.getElementById("numberredPick5").value;

    //get pick time info for each champ ban
    bansBlue[0].TIME = document.getElementById("numberblueBan1").value;
    bansBlue[1].TIME = document.getElementById("numberblueBan2").value;
    bansBlue[2].TIME = document.getElementById("numberblueBan3").value;
    bansBlue[3].TIME = document.getElementById("numberblueBan4").value;
    bansBlue[4].TIME = document.getElementById("numberblueBan5").value;

    bansRed[0].TIME = document.getElementById("numberredBan1").value;
    bansRed[1].TIME = document.getElementById("numberredBan2").value;
    bansRed[2].TIME = document.getElementById("numberredBan3").value;
    bansRed[3].TIME = document.getElementById("numberredBan4").value;
    bansRed[4].TIME = document.getElementById("numberredBan5").value;

}

function addTimer(div){
    var pickTimer = document.createElement("input");
    pickTimer.type = "number";
    pickTimer.id = "number"+div.id;
    pickTimer.min = 1;
    pickTimer.max = 30;
    pickTimer.value = 30;
    div.appendChild(pickTimer);
}
/**LOAD PLAYERS
 * this function will load the players select for each champ so we can attach a player to each champ
 * @param div
 * @param team
 */
function load_players(div, team){
    var selectList = document.createElement("select");

    if(team == 'b'){
        for(let i = 0; i < blue_side.length; i++){
            selectList.id = "blueSideSelect"+ (pickBlue.length + 1)
            var option = document.createElement("option");
            option.value = blue_side[i].plyID;
            option.text = blue_side[i].plyName;
            selectList.appendChild(option);
        }
    }
    else{
        for(let i = 0; i < red_side.length; i++){
            selectList.id = "redSideSelect"+ (picksRed.length + 1)
            var option = document.createElement("option");
            option.value = red_side[i].plyID;
            option.text = red_side[i].plyName;
            selectList.appendChild(option);
        }
    }

    div.appendChild(selectList);

}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}


function startClock(){
    var intervalID = setInterval(function() {
        clockStarted = true;
        document.getElementById("progressBar").value = 30 - counter;
        counter--;
        if (counter >= 0) {
            span = document.getElementById("count");
            span.innerHTML = counter;
        }
        if (counter === 0) {
            clockStarted= false;
            alert('sorry, out of time');
            clearInterval(counter);
            button = document.getElementById("startClock");
            span = document.getElementById("count");
            span.innerHTML = 30;
        }
        else if(pbValue > 20){
            alert("Pick And Ban is Complete");
            clearInterval(intervalID);
        }
    }, 1000);

}


