//GLOBALS
 let itemsArray = [];
let tristARperLevel = 8;
let champLoaded = false;
let adaptiveForceValue = 9;
let adaptiveADScaler = 0.66; //if adaptive force is added onto your ad only .66 of the total adaptive force is added
let shardCDStartValue = 0.471;
let shardCDScaler = 0.529;
let shardHealthStartValue = 10.588;
let shardHealthScaler = 4.412;
let isMage = false;
let arRuneValue = 6;
let mrRuneValue = 8;
let attackSpeendRuneBonus = 0.1; //10% attack speed
var itemAd = 0;
var itemAp = 0;
var cooldown = 0;
var itemBuildArray = [];

//CHAMPION VALUES
let health, startingHealth, healthPerLevel, startingHealthRegen, healthRegenPerLevel,mana, manaPerLevel ,manaRegen, manaRegenPerLevel,ad,adPerLevel,ap, as, asPerLevel, ar, arPerlevel, mr,mrPerLevel, crit, critPerLevel, range, rangePerLevel;


//GLOBALS
window.onload = function(){
    getChamps();
    get_game_items();
    var select = '';
    for (i=1;i<=18;i++) {
        select += '<option val=' + i + '>' + i + '</option>';
        $('#level_selector').html(select);
    }
    $('#level_selector2').html( $('#level_selector').html());


    var lvl_selector = document.getElementById("level_selector");

    lvl_selector.addEventListener("change", function() {
        if(champLoaded){
          updateChampStats($('#level_selector').val());
        }
        else{
            alert("load achamp")
        }
    });
};

function getChamps() {
    let champsDiv = document.getElementById("champsDiv");
    jQuery.get('/champs', " ", function (data) {
    if(data.name != 'Error') {
        let url = data[0]["URL"];
        for (let i = 0; i < data.length; i++) {
            let champURL = url + data[i]["FULL"];
            let img = document.createElement('img');
            //now add champ to div with clickbale property
            img.src = champURL;
            img.id = data[i].ID;
            img.height = "75";
            img.width = "75";
            img.alt = data[i]["NAME"];
            img.addEventListener("click", function () {
                champClicked(data[i].ID, img.alt, champURL)
            })
            champsDiv.appendChild(img)
        }
    }
    else{
        alert("Error Occured:"+ data.code)
    }
    });


}



function get_game_items() {
    var itemDiv = document.getElementById("itemsUl");

    $.get('/items', {}, function (data) {
        if(data.name != 'Error' || data == undefined) {
            let url = data[0]["URL"];
            for (let i = 0; i < data.length; i++) {
                var li = document.createElement("li");
                let itemURL = url + data[i]["FULL"];
                let img = document.createElement('img');
                //now add champ to div with clickbale property
                img.id  = data[i].ID;
                img.alt =data[i]["NAME"];
                img.src = itemURL;
                img.height = "50";
                img.width = "50";
                img.addEventListener("click", function () {
                    itemClicked(data[i].ID, img.alt)
                });
                li.id = data[i].ID;
                li.appendChild(img);
                li.innerText =  data[i]["NAME"];

                li.appendChild(img);
                itemDiv.appendChild(li);
                itemsArray[data[i].ID] = data[i];
            }
        }
        else{
            alert("Error Occured:"+ data.code)
        }
    });
}

/**CHAMP CLICKED
 * When a champ is clicked we gather the information for the champ (spells, and growth per level per stats)
 * @param champID
 * @param imgID
 * @param champName
 */
function champClicked(champID, champName, champImgURL) {
    let champDiv = document.getElementById("champImg");
    var r = confirm("Get "+ champName+ " ?");
    if(r) {
        $.get('/get_champ_info', {champ: champName}, function (data) {
            if(data.name != 'Error') {

                let img = document.createElement('img');
                //now add champ to div with clickbale property
                champDiv.innerHTML = "";
                img.src = champImgURL;
                img.id = champID;
                img.height = "75";
                img.width = "75";
                img.alt = champName;
                champDiv.appendChild(img);
                console.log(data[0].STATS);
                //add champions stats to table
                isMage  = data[0].TAG.includes('Mage');

                //HEALTH//
                document.getElementById("hp_lvl1Stats").innerHTML = data[0].STATS.hp;
                document.getElementById("hp_lvl18Stats").innerHTML = (data[0].STATS.hp+(18*data[0].STATS.hpperlevel)).toFixed(2);
                document.getElementById("hp_perLevelStats").innerHTML = data[0].STATS.hpperlevel;
                document.getElementById("hp_specificLevelStat").innerHTML = 0;

                startingHealth = data[0].STATS.hp;
                healthPerLevel = data[0].STATS.hpperlevel;

                //HEALTH//

                //HEALTH REGEN//
                document.getElementById("hpRen_lvl1Stats").innerHTML = data[0].STATS.hpregen;
                document.getElementById("hpRen_lvl18Stats").innerHTML = (data[0].STATS.hpregen+(18*data[0].STATS.hpregenperlevel)).toFixed(2);
                document.getElementById("hpRen_perLevelStats").innerHTML = data[0].STATS.hpregenperlevel;
                document.getElementById("hpRen_specificLevelStat").innerHTML = 0;


                startingHealthRegen = data[0].STATS.hpregen;
                healthRegenPerLevel = data[0].STATS.hpregenperlevel;

                //HEALTH REGEN//

                //MANA//
                document.getElementById("mana_lvl1Stats").innerHTML = data[0].STATS.mp;
                document.getElementById("mana_lvl18Stats").innerHTML = (data[0].STATS.mp+(18*data[0].STATS.mpperlevel)).toFixed(2);
                document.getElementById("mana_perLevelStats").innerHTML = data[0].STATS.mpperlevel;
                document.getElementById("mana_specificLevelStat").innerHTML = 0;


                mana = data[0].STATS.mp;
                manaPerLevel = data[0].STATS.mpperlevel;

                //MANA//

                //MANA REGEN//
                document.getElementById("manaRen_lvl1Stats").innerHTML = data[0].STATS.mpregen;
                document.getElementById("manaRen_lvl18Stats").innerHTML = (data[0].STATS.mpregen+(18*data[0].STATS.mpregenperlevel)).toFixed(2);
                document.getElementById("manaRen_perLevelStats").innerHTML = data[0].STATS.mpregenperlevel;
                document.getElementById("manaRen_specificLevelStat").innerHTML = 0;


                manaRegen = data[0].STATS.mpregen;
                manaRegenPerLevel = data[0].STATS.mpregenperlevel;
                //MANA REGEN//

                //ATTACK DAMAGE//
                document.getElementById("ad_lvl1Stats").innerHTML = data[0].STATS.attackdamage;
                document.getElementById("ad_lvl18Stats").innerHTML = (data[0].STATS.attackdamage+(18*data[0].STATS.attackdamageperlevel)).toFixed(2);
                document.getElementById("ad_perLevelStats").innerHTML = data[0].STATS.attackdamageperlevel;
                document.getElementById("ad_specificLevelStat").innerHTML = 0;

                ad = data[0].STATS.attackdamage;
                adPerLevel = data[0].STATS.attackdamageperlevel;

                ap = 0;

                //ATTACK DAMAGE//

                //ATTACK SPEED//
                document.getElementById("as_lvl1Stats").innerHTML = data[0].STATS.attackspeed;
                document.getElementById("as_lvl18Stats").innerHTML = (data[0].STATS.attackspeed+(18*data[0].STATS.attackspeedperlevel)).toFixed(2);
                document.getElementById("as_perLevelStats").innerHTML = data[0].STATS.attackspeedperlevel;
                document.getElementById("as_specificLevelStat").innerHTML = 0;

                as = data[0].STATS.attackspeed;
                asPerLevel = data[0].STATS.attackspeedperlevel;


                //AP//
                document.getElementById("ap_lvl1Stats").innerHTML = 0;
                document.getElementById("ap_specificLevelStat").innerHTML = 0;

                //AP//
                //ATTACK SPEED//

                //ARMOR//
                document.getElementById("ar_lvl1Stats").innerHTML = data[0].STATS.armor;
                document.getElementById("ar_lvl18Stats").innerHTML = (data[0].STATS.armor+(18*data[0].STATS.armorperlevel)).toFixed(2);
                document.getElementById("ar_perLevelStats").innerHTML = data[0].STATS.armorperlevel;
                document.getElementById("ar_specificLevelStat").innerHTML = 0;



                ar = data[0].STATS.armor;
                arPerlevel = data[0].STATS.armorperlevel;
                //ARMOR//

                //MR//
                document.getElementById("mr_lvl1Stats").innerHTML = data[0].STATS.spellblock;
                document.getElementById("mr_lvl18Stats").innerHTML = (data[0].STATS.spellblock+(18*data[0].STATS.spellblockperlevel)).toFixed(2);
                document.getElementById("mr_perLevelStats").innerHTML = data[0].STATS.spellblockperlevel;
                document.getElementById("mr_specificLevelStat").innerHTML = 0;


                mr = data[0].STATS.spellblock;
                mrPerLevel = data[0].STATS.spellblockperlevel;

                //MR//

                //CRITCAL//
                document.getElementById("cr_lvl1Stats").innerHTML = data[0].STATS.crit;
                document.getElementById("cr_lvl18Stats").innerHTML = (data[0].STATS.crit+(18*data[0].STATS.critperlevel)).toFixed(2);
                document.getElementById("cr_perLevelStats").innerHTML = data[0].STATS.critperlevel;
                document.getElementById("cr_specificLevelStat").innerHTML = 0;


                crit = data[0].STATS.crit;
                critPerLevel = data[0].STATS.critperlevel;

                //CRITCAL//

                //RANGE//
                if(champName != "Tristana" && champName != 'Kayle' && champName != 'Kled') {
                    document.getElementById("r_lvl1Stats").innerHTML = data[0].STATS.attackrange;
                    document.getElementById("r_lvl18Stats").innerHTML = data[0].STATS.attackrange;
                    document.getElementById("r_perLevelStats").innerHTML = 0;
                    document.getElementById("r_specificLevelStat").innerHTML = 0;
                    document.getElementById("specialCaseInfo").innerText = "";
                    range = data[0].STATS.attackrange;
                    rangePerLevel = 0;
                }
                else if(champName == 'Tristana'){ //TRISTANA IS A CORNER CASE BECAUSE HER PASSIVE INCREASES HER ATTACK RANGE AND SPELL CAST RANGE PER LEVEL BY 8 UNITS
                    document.getElementById("r_lvl1Stats").innerHTML = data[0].STATS.attackrange;
                    document.getElementById("r_lvl18Stats").innerHTML = (data[0].STATS.attackrange + (17 * 8))+'****';
                    document.getElementById("r_perLevelStats").innerHTML = 8;
                    document.getElementById("r_specificLevelStat").innerHTML = 0;
                    document.getElementById("specialCaseInfo").innerText = "****Tristana's Passive increases her range each level***";
                    range = data[0].STATS.attackrange;
                    rangePerLevel = 8
                }
                else if(champName == 'Kayle'){ //KAYLE IS ANOTHER CORNER CASE BECAUSE AT LVL 6 RANGE = 525 AND AT LVL 16 RANGE = 575
                    document.getElementById("r_lvl1Stats").innerHTML = data[0].STATS.attackrange;
                    document.getElementById("r_lvl18Stats").innerHTML = 575+'***';
                    document.getElementById("specialCaseInfo").innerText = "****Kayle's Passive increases her range at specific Levels: at LVL 6 her range grows to 525 and at LVL 16 it grows to 575***";
                    document.getElementById("r_specificLevelStat").innerHTML = 0;
                    range = data[0].STATS.attackrange;
                    rangePerLevel = 0;

                }
                else if (champName == 'Kled') { //KLED IS ANOTHER CORNER CASE BECAUSE WHILE MONTED RANGE = 125 BUT UNMONUTED RANGE = 250
                    document.getElementById("r_lvl1Stats").innerHTML = data[0].STATS.attackrange;
                    document.getElementById("r_lvl18Stats").innerHTML = data[0].STATS.attackrange + '****';
                    document.getElementById("r_perLevelStats").innerHTML = 0;
                    document.getElementById("r_specificLevelStat").innerHTML = 0;
                    document.getElementById("specialCaseInfo").innerText = "Kled's Passive makes him have two ranges: while MOUNTED his range = 125 but if he is UNMONTED his range increases to = 250";
                    range = data[0].STATS.attackrange;
                    rangePerLevel = 0;
                }

                //RANGE//

                //MS//
                document.getElementById("ms_lvl1Stats").innerHTML = data[0].STATS.movespeed;
                //MS//

                champLoaded = true

                updateChampStats() //we will add the runes values stats

            }
            else{
                alert("Error Occured:"+ data.code)
            }

        })
    }
    else{
        alert("ok");
    }

}

/**Item CLICKED
 * When an item is clicked we get the stats for the specific item and add them to the champion selected
 * ITEM ADDITION PROCESS
 *we check if the item is a basic, advanced or finished item
 * we do this buy checking if the item has item that it is built from or items it is built into
 *BASICS items aren't built from anything but built into ADVANCED ITEMS
 * ADVANCED items are built from something and built into FINISHED ITEMS
 * FINISHED ITEMS are built from advanced built are built into anything
 * HOWEVER Ornn Passive items are exceptions and because of items that ornn can upgrade as advanced items ex Sunfire Cape and Abyssal Mask, etc
 * When a item has been chosen we check if there is anything items currently in the build that it is built from ie BAMI'S CINDER is built from a RUBY CRYSTAL
 * we ask the user if they wish to build the advanced or finished item from the current items in the buid.
 * If they say YES we remove all the built from items and replace with the built from item
 * If they say NO we keep the built from items and just add the built into
 * But we must make sure that there is room or the new item before it is added
 * Once this process is complete we add the gold cost of the item to the total current build cost.
 * We also add the stats values to the current champion stats to see the change
 */

function itemClicked(itemID, itemName) {
    console.log(itemsArray[itemID]);
    var componentItems = []
    var r = confirm("Add "+ itemName+ " to Build?");


    if(r && champLoaded) {
            if(itemBuildArray.length < 6){
                //check if the new item can be built from any existing items in the build
                //if the item is a basic item we skip this and just try to add it to the buildArray
                if(itemsArray[itemID].FROM != undefined  && builtFromItem(itemsArray[itemID].FROM).length > 0 ){
                     componentItems = builtFromItem(itemsArray[itemID].FROM);
                     r = confirm("There is " +componentItems.length+ " item(s) in your build that build into: "+ itemName+ " Remove Them?");
                    if(r){
                        //remove component items
                        removeItemsFromBuild(componentItems);

                    }
                    else{

                    }

                }
                //it is a basic item so just try to add it to the build
                else{
                    if(itemBuildArray.length < 6) {
                        itemLocationInfo = {}
                        createImageIcon(itemsArray[itemID]);
                        itemLocationInfo["itemID"] = itemID;
                        itemLocationInfo["GOLD"] = itemsArray[itemID].GOLD;
                        itemLocationInfo["itemDivNumber"] =  itemBuildArray.length + 1;
                        itemBuildArray.push(itemLocationInfo);
                    }

                }
            }
            else{
                alert("SORRY TOO MANY ITEMS");
            }

        calculateBuildCost(itemID);
    }
    else{
        alert("NO WORRIES but MAKE SURE A CHAMP IS LOADED BEFORE THIS");
    }

}

/**check for a basic item to build the new item from
 * returns a true or false */


function builtFromItem(itemFromList) {
    var componenItems = [];
    for(var i = 0; i < itemBuildArray.length; i++){
        //check if the current build has an item  that is in the new items from list
        if(itemFromList.includes(itemBuildArray[i]["itemID"].toString()))
            componenItems.push(itemBuildArray[i])
    }

    return componenItems;
}

/**
 * WILL remove all component items from the new item
 * @param componentItems
 */
function removeItemsFromBuild(componentItems) {

     for(var i = 0; i < componentItems.length; i++){
         for(var j = 0; j < itemBuildArray.length; j++){
            if(itemBuildArray[j] != undefined && componentItems[i].itemID == itemBuildArray[j].itemID){
                document.getElementById("item"+itemBuildArray[j].itemDivNumber).innerHTML = "";
                //delete item from array
                delete itemBuildArray[j];
            }
         }
     }

     //clean the array that we just deleted from
    for(i = 0; i < itemBuildArray.length; i++){
        if(itemBuildArray[i] == undefined){
            console.log("un");
            itemBuildArray.splice(i, 1);
        }
    }


}

/***
 * because we will be reusing this function and the itemArray  wont be always orderd
 * we will just find the first availible position and add the item there
 * @param itemInfo
 */
function createImageIcon(itemInfo) {
    //find an open position in the array for the new item
    var newItemDivNumber;
    if(itemBuildArray[0] == undefined){
        newItemDivNumber = 1;
        console.log("1st");
    }
    for(var i=0; i < itemBuildArray.length; i++){
        if(i+1 < itemBuildArray[i].itemDivNumber){
            newItemDivNumber = i+1
        }
        else if(i+1 > itemBuildArray[i].itemDivNumber){
            newItemDivNumber = i+1
        }
        else{
            newItemDivNumber = i+1;
        }

    }
    console.log(newItemDivNumber);
    var itemBox = document.getElementById("item"+newItemDivNumber);
    let itemURL = itemInfo["URL"]+itemInfo["FULL"];
    let img = document.createElement('img');
    //now add champ to div with clickbale property
    img.id  = itemInfo.ID;
    img.alt =itemInfo["NAME"];
    img.src = itemURL;
    img.height = "50";
    img.width = "50";
    img.addEventListener("click", function () {
        removeItemFromBuild(itemBox, itemInfo["NAME"])
    });
    itemBox.appendChild(img);
}

function calculateBuildCost(itemID) {
    var costDiv = document.getElementById("buildCost");
    var totalCost =0;
    for(var i=0; i < itemBuildArray.length;i++){
        totalCost += itemBuildArray[i]["GOLD"].total;
    }
    //change the cost dive Text
    costDiv.innerText = "Current Build Cost: "+ totalCost;

}

function itemSearch() {
    input = document.getElementById("itemInput");
    filter = input.value.toUpperCase();
    itemUl = document.getElementById("itemsUl");
    li = itemUl.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        itemName = li[i].getElementsByTagName("img")[0];
        txtValue = itemName.alt; //get the name of the item for the alt of the img tag
        if (txtValue.toUpperCase().indexOf(filter) > -1) { //search the list of items and hides the ones that dont match the query
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
//this will be called when a champion is initially added
function updateChampStats(champLvl = 1) {
    if(champLoaded) {
        var shardOffense = document.getElementById("shardOffense").value;
        var shardFlex = document.getElementById("shardFlex").value;
        var shardDefense = document.getElementById("shardDefense").value;

        var adaptiveForceRunes,attackSpeedRune, armorRunes, mrRunes, healthRunes, coolDownRune;

        adaptiveForceRunes = attackSpeedRune = armorRunes = mrRunes = healthRunes = coolDownRune = 0;


     if(shardOffense == 'af'){
         adaptiveForceRunes++;
     }
     else if(shardOffense == 'as'){
         attackSpeedRune++;

     }
     else{//cooldown chosen
            coolDownRune++
        }
    }

    if(shardFlex == 'af'){
        adaptiveForceRunes++;
    }
    else if(shardFlex == 'ar'){
        armorRunes++;

    }
    else{//mr chosen
        mrRunes++
    }

    if(shardDefense == 'ht'){
        healthRunes
    }
    else if(shardDefense == 'ar'){
        armorRunes++;

    }
    else{//cooldown chosen
        mrRunes++
    }


    //CALCULATE THE INCREASED STAT VALUES

     //add adaptive force
    if(isMage){
        document.getElementById("ap_lvl1Stats").innerHTML = ((adaptiveForceValue*adaptiveForceRunes)).toFixed(2);
        document.getElementById("ap_specificLevelStat").innerHTML = ((adaptiveForceValue*adaptiveForceRunes)+itemAp).toFixed(2);
     }
    else if(ad > ap){
        document.getElementById("ad_specificLevelStat").innerHTML = ((ad+(adPerLevel*(champLvl-1))+itemAd) + ((adaptiveForceValue*adaptiveForceRunes)*adaptiveADScaler)).toFixed(2);
    }
    else{
        document.getElementById("ap_lvl1Stats").innerHTML = ((adaptiveForceValue*adaptiveForceRunes)).toFixed(2);
        document.getElementById("ap_specificLevelStat").innerHTML = (ap+(adaptiveForceValue*adaptiveADScaler)+itemAp).toFixed(2);
    }

    //add attack speed
        document.getElementById("as_specificLevelStat").innerText = ((as * (attackSpeendRuneBonus*attackSpeedRune))+as).toFixed(2);

    //add cooldown
        cooldown = (shardCDStartValue+(shardCDScaler*champLvl))*coolDownRune;
        document.getElementById("cd_specificLevelStat").innerText = cooldown;

    //add health
        health = (startingHealth + (healthPerLevel*(champLvl-1)) + (shardHealthStartValue)+(shardHealthScaler*champLvl));
        document.getElementById("hp_specificLevelStat").innerHTML = health.toFixed(0);

    //armour and mr
        document.getElementById("ar_specificLevelStat").innerHTML = ar+(arRuneValue*armorRunes);
        document.getElementById("mr_specificLevelStat").innerHTML = mr+(mrRuneValue*mrRunes);

}


