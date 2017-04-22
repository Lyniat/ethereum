'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.QRModule = function(){
    var that = {};
    const QR_ELEMENT = '#qr-display';

    function scanQR(){
        var value;
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    // In this case we only want to process QR Codes
                    if (result.format == 'QR_CODE') {
                        value = result.text;
                        // This is the retrieved content of the qr code
                        convertQR(value);
                    } else {
                        alert('Only QR codes');
                    }
                } else {
                    alert('Dismissed the scan');
                }
            },
            function (error) {
                alert('An error ocurred: ' + error);
            }
        );

        createQR(value);
        return value;

    }

    function createQR(value){
        new QRCode(document.getElementById(QR_ELEMENT), value);
    }

    that.scanQR = scanQR;
    that.createQR = createQR;
    return that;
};