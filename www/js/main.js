'use strict'
var Ethereum = Ethereum || {};
Ethereum.Main = (function(){
    var that = {},
    qrModule;

    const SCAN_BUTTON = '#scan-qr-button';

    function init(){
        qrModule = new Ethereum.QRModule();
        addListeners();
    }

    function addListeners(){
        $(SCAN_BUTTON)[0].addEventListener('click',scanQR);
        //$('#show-qr-button')[0].addEventListener('click',createQR);
    }

    function scanQR(){
        qrModule.scanQR();
    }

    function createQR() {
        qrModule.createQR();
    }

    init();
    return that;
})();
