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
            url: Ethereum.Config.SERVER_ADRESS+':3000/new-contract/',
            data: text,
            success: onSuccess,
            contentType: "application/json",
            });
        //$.post(Ethereum.Config.SERVER_ADRESS+':3000',text);
    }

    function getContracts(id,onCallback){
        $.ajax({
            type: "POST",
            url: Ethereum.Config.SERVER_ADRESS+':3000/contracts/',
            data: '{"address":'+id+'}',
            success: onCallback,
            contentType: "application/json",
        });
    }

    that.getContracts = getContracts;
    that.saveContractToServer = saveContractToServer;
    that.getUniqueID = getUniqueID;
    return that;
};
