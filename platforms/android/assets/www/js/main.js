'use strict'
var Ethereum = Ethereum || {};
Ethereum.Main = (function(){
    var that = {},
    qrModule,
    webInterface;

    const SCAN_BUTTON = '#scan-qr-button';
    const SHOW_BUTTON = '#toggle-qr-button';

    function init(){
        qrModule = new Ethereum.QRModule();
        webInterface = new Ethereum.Webinterface();
        addListeners();
    }

    function addListeners(){
        //$(SCAN_BUTTON)[0].addEventListener('click',scanQR);
        $(SHOW_BUTTON)[0].addEventListener('click',getUniqueID);
    }

    function scanQR(){
        qrModule.scanQR();
    }

    function createQR(value) {
        qrModule.createQR(value);
    }

    function getUniqueID(){
        Materialize.toast('Fetching unique ID', 3000);
        webInterface.getUniqueID(onGetID);
    }

    function onGetID(id){
        Materialize.toast('Fetching ID success!', 3000);
        createQR(id);
    }

    init();
    return that;
})();
