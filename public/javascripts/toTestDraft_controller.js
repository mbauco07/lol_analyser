window.onload = function(){
    getChamps()
}

function getChamps() {
    jQuery.get('/champs', " ", function (data) {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]["NAME"])
        }
    });

}