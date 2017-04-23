'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.FileUploader = function() {

    var that = {};

    const CANVAS_SIZE = 300;

    function getFile(id,loaded){
        var file = $('#'+id)[0].files[0]

        console.log(file);

        var reader  = new FileReader();

        reader.onload = function () {
            //onLoaded(reader.result);
            var newCanvas = document.createElement('canvas');
            var context =  newCanvas.getContext('2d');

            context.canvas.width  = CANVAS_SIZE;
            context.canvas.height = CANVAS_SIZE;

            context.fillStyle = "white";
            context.fillRect(0, 0, newCanvas.width, newCanvas.height);

            var img = new Image();
            img.src = reader.result;
            img.onload = function() {
                //console.log(reader.result);
                context.drawImage(img,0,0,CANVAS_SIZE, CANVAS_SIZE);

                var png = newCanvas.toDataURL();
                //window.open(png);
                loaded(png);
            };
        };

        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        }
    }

    that.getFile = getFile;
    return that;
};