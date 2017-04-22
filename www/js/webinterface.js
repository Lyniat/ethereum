'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.Webinterface = function(){
    var that = {};
    const SERVER_ADRESS = Ethereum.Config.SERVER_ADRESS+':3000/create-account';

    function getUniqueID(onCallback){
        $.get( SERVER_ADRESS, function( result ) {
            onCallback(result);
        });
    }

    function saveContractToServer(data,onSuccess){
        /*
        data = {
            owner: "id",
            partner: "id",
            timestamp: new Date(),
            text: "",
            attachments: new Array()
        };
        */

        var text = JSON.stringify(data);
        console.log(data);
        $.ajax({
            type: "POST",
            url: 'http://server.nopunkgames.space:3000/',
            data: text,
            success: onSuccess,
            contentType: "application/json",
            });
        //$.post(Ethereum.Config.SERVER_ADRESS+':3000',text);
    }

    that.saveContractToServer = saveContractToServer;
    that.getUniqueID = getUniqueID;
    return that;
};
