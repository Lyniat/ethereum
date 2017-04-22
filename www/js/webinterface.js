'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.Webinterface = function(){
    var that = {};
    const SERVER_ADRESS = 'http://172.18.3.102:3000/create-account';

    function getUniqueID(onCallback){
        $.get( SERVER_ADRESS, function( result ) {
            onCallback(result);
        });
    }

    that.getUniqueID = getUniqueID;
    return that;
};
