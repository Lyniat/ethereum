'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.Webinterface = function(){
    var that = {};
    const SERVER_ADRESS = Ethereum.Config.SERVER_ADRESS+':3000/new-account';

    function getUniqueID(id,onCallback){
        /*
        $.get( SERVER_ADRESS, function( result ) {
            onCallback(result);
        });
        */
        $.ajax({
            type: "POST",
            url: SERVER_ADRESS,
            data: '{"identityData":'+id+'}',
            success: onCallback,
            contentType: "application/json",
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
