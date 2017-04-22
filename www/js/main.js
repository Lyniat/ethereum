'use strict'
var Ethereum = Ethereum || {};
Ethereum.Main = function(){
    var that = {},
    qrModule;

    function init(){
        qrModule = new Ethereum.QRModule();
        addListeners();
    }

    function addListeners(){
        $('scan-qr-button')[0].addEventListener('click',scanQR);
        $('show-qr-button').addEventListener('click',createQR);
    }

    function scanQR(){
        qrModule.scanQR();
    }

    function createQR() {
        qrModule.createQR();
    }

    init();
    return that;
}();
