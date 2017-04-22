'use strict'
var Ethereum = Ethereum || {};
Ethereum.Main = (function(){
    var that = {},
    qrModule,
    webInterface,
    contracts,
    utils;

    const SCAN_BUTTON = '#scan-qr-partner-button';
    const SHOW_BUTTON = '#toggle-qr-button';

    function init(){
        qrModule = new Ethereum.QRModule();
        webInterface = new Ethereum.Webinterface();
        contracts = new Ethereum.Contracts(webInterface);
        utils = new Ethereum.Utils();
        addListeners();
    }

    function addListeners(){
        //$(SCAN_BUTTON)[0].addEventListener('click',scanQR);
        $(SHOW_BUTTON)[0].addEventListener('click',getUniqueID);
        $('#test')[0].addEventListener('click',test);
    }

    function scanQR(){
        qrModule.scanQR();
    }

    function createQR(value) {
        qrModule.createQR(value);
    }

    function test(){
        webInterface.saveContractToServer();
    }

    function getUniqueID() {
        var value = window.localStorage.getItem('id');
        if (!value) { //no id local stored
            Materialize.toast('Fetching unique ID', 3000);
            webInterface.getUniqueID(onGetID);
        }else{
            Materialize.toast('Loaded ID', 3000);
            createQR(value);
        }
    }

    function onGetID(id){
        Materialize.toast('Fetching ID success!', 3000);
        createQR(id);
        window.localStorage.setItem('id',id);
    }

    function resetListeners() {
        addListeners();
    }

    init();
    that.resetListeners = resetListeners;
    return that;
})();

Ethereum.Config = {};
Ethereum.Config.SERVER_ADRESS = 'server.nopunkgames.space';
