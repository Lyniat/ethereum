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

    function saveContractToServer(data){
        data = {
            owner: "id",
            partner: "id",
            timestamp: new Date(),
            text: "",
            attachments: new Array()
        };

        $.ajax({
            type: "POST",
            url: Ethereum.Config.SERVER_ADRESS,
            data: data,
            /*
             success: success,
             dataType: dataType
             */
        });
    }

    that.saveContractToServer = saveContractToServer;
    that.getUniqueID = getUniqueID;
    return that;
};
