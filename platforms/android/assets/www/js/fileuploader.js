'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.FileUploader = function() {

    var that = {};

    function getFile(id,onLoaded){
        var file = $('#'+id)[0].files[0]

        console.log(file);

        var reader  = new FileReader();

        reader.onloadend = function () {
            onLoaded(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        }
    }

    that.getFile = getFile;
    return that;
};