'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.QRModule = function(){
    var that = {};

    function scanQR(){
        var value;
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    // In this case we only want to process QR Codes
                    if (result.format == "QR_CODE") {
                        value = result.text;
                        // This is the retrieved content of the qr code
                        convertQR(value);
                    } else {
                        alert("Only QR codes");
                    }
                } else {
                    alert("Dismissed the scan");
                }
            },
            function (error) {
                alert("An error ocurred: " + error);
            }
        );

        return value;

    }

    function createQR(){


    }

    that.scanQR = scanQR;
    that.createQR = createQR;
    return that;
};