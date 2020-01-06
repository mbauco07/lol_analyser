/*To add:
DB functions where is loads game and their ids on page load
 */
function onload() {
 getGameList();
}


function toDraft(gameID) {
    // redirect the page to the drafting page for the specified game
    window.open("http://localhost:3000/draft?id="+gameID);
}

function toRedSide(gameID) {
// redirect the page to the red side eventing page for the specified game
    window.open("http://localhost:3000/dentry?id="+gameID+"&teamID");


}
function toBlueSide(gameID) {
    //redirect the page to the blue side eventing page for the specified game
    window.open("http://localhost:3000/dentry?id="+gameID+"&teamID");

}

/*getGameList
This function will get the data from the db and send in back to the client as a row in the table
 */
function getGameList() {

}