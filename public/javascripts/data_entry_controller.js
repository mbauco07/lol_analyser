
function onload() {
    //load the layout into the canvas
    var canvas = document.getElementById("mapCanvas");
    var canvasContext = canvas.getContext("2d");
    var img = document.getElementById("mapLayout");
    canvasContext.drawImage(img, 0,0);
    canvas.addEventListener("mousedown", function(e)
    {
        getMousePosition(canvas, e);
    });
    populateChampDropDown();
    //load the champs name into console

};

function getMousePosition(canvas, event){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coor X: " + x, "Coor Y: " + y);
}

function populateChampDropDown() {
    jQuery.get('/champs', " ", function (data) {
        //console.log(data.results);
        for(let i = 0; i < data.results.length; i++){
            //console.log(data.results[i]["NAME"]);

            let selectToPopulate = document.getElementById("cur_Champ");
            var newElement = document.createElement("option");
            newElement.textContent = data.results[i]["NAME"].replace(/_/g, ' ');
            newElement.id = data.results[i]["ID"];
            newElement.value = data.results[i]["NAME"];
            selectToPopulate.appendChild(newElement);
        }
    } );
}
