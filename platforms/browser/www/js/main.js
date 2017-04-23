'use strict'
var Ethereum = Ethereum || {};
Ethereum.Config = {};
Ethereum.Config.SERVER_ADRESS = 'http://172.18.3.102';//'http://server.nopunkgames.space';
Ethereum.Main = function() {
    var that = {},
        qrModule,
        webInterface,
        contracts,
        ID;

    const SCAN_BUTTON = '#scan-qr-partner-button';
    const SHOW_BUTTON = '#toggle-qr-button';

    function init() {
        qrModule = new Ethereum.QRModule();
        webInterface = new Ethereum.Webinterface();
        contracts = new Ethereum.Contracts(webInterface);
        getContracts();
    }

    function scanQR() {
        qrModule.scanQR();
    }

    function createQR(value) {
        qrModule.createQR(value);
    }

    function getContracts(){
        ID = window.localStorage.getItem('id');
        if(!ID){
            return;
        }
        webInterface.getContracts(ID,onContracts);
    }

    function onContracts(contracts){
        console.log(contracts);
    }

    function test() {
        webInterface.saveContractToServer();
    }

    function getUniqueID() {
        var value = window.localStorage.getItem('id');
        if (!value) { //no id local stored
            Materialize.toast('Fetching unique ID', 3000);
            webInterface.getUniqueID(onGetID);
        } else {
            Materialize.toast('Loaded ID', 3000);
            createQR(value);
        }
    }

    function onGetID(id) {
        ID = id;
        Materialize.toast('Fetching ID success!', 3000);
        createQR(id);
        window.localStorage.setItem('id', id);
    }

    function resetListeners() {
        //addListeners();
    }

    init();
    that.getUniqueID = getUniqueID;
    that.resetListeners = resetListeners;
    return that;
};
