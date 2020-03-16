$( document ).ready(function() {


    $( "#submitPlayer" ).click(function() {
        var r = confirm("submit the current player list in the text box?")
        if(r){
            var playerListNames = $('textarea#playerListNames').val().split("\n");
            var playerListPositions = $('textarea#playerListPositions').val().split("\n");
            $.post("/insert_player", { playersNames:playerListNames, playersPositions:playerListPositions}, function (data) {

            });
        }
        else{
            alert("fine");
        }
    });


});


