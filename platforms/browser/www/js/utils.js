'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.Utils = (function(){
    var that = {};
    function loadSite(file,onLoaded){
        $('#content')[0].innerHTML = '';
        $('#content').load('./'+file,null,function(){
            if(!onLoaded){
                return;
            }
            onLoaded();
        });
    }

    function scanQRCode(){
        var qrModule = new Ethereum.QRModule();
        return qrModule.scanQR();
    }
    that.scanQRCode = scanQRCode;
    that.loadSite = loadSite;
    return that;
})();
