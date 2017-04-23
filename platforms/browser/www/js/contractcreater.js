'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.ContractCreater = function(){
    var that = {},
    contract = {},
    information = {};

    function createContract(){
        /*
        Sorry, hard coded :'(
         */
        information['firstPersonName'] = $('#first-contract-person').val();
        information['secondPersonName'] = $('#second-contract-person').val();
        information['objectName'] = $('#second-field').val();
        information['borrowDate'] = $('#borrow-date').val();
        information['returnDate'] = $('#return-date').val();
        contract['partner'] = 'not scanned';
        contract['owner'] = 'no information';

        contract['text'] = "Contract between "+information['firstPersonName']+" and "+information['secondPersonName']+". Object that will be lend: "+information['objectName']+". Borrowing date: "+information['borrowDate']+". Returnable date: "+information['returnDate'];
    }

    function addContractData(){
        contract['owner'] = window.localStorage.getItem('id') || 'no information';
        contract['notes'] =  $('#notes').val();
    }

    function addQRCode(){
        var code = Ethereum.Utils.scanQRCode();
        contract['partner'] = code;
    }

    function uploadContract(){
        var webInterface = new Ethereum.Webinterface();
        webInterface.saveContractToServer(contract,onSuccess);
    }

    function uploadFile(id){
        var uploader = new Ethereum.FileUploader();
        uploader.getFile(id,onFileUploaded);
    }

    function onSuccess(){
        Materialize.toast('Uploading successful!', 3000);
        Ethereum.Utils.loadSite('main-index.html');
    }

    function onFileUploaded(file){
        contract['file'] = file;
    }

    that.uploadFile = uploadFile;
    that.addContractData = addContractData;
    that.addQRCode = addQRCode;
    that.createContract = createContract;
    that.uploadContract = uploadContract;
    return that;
};
