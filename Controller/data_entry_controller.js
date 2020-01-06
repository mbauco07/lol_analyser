
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


};

function getMousePosition(canvas, event){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coor X: " + x, "Coor Y: " + y);
}


