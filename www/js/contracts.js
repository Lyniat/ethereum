'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.Contracts = function(){
    var that = {},
    contracts = [],
    maxContractNum,
    contractList = [];

    function loadAllContracts(){
        loadContractList();
        loadContractByID();
        return contracts;
    }

    function loadMaxContractNum() {
        maxContractNum = window.localStorage.getItem('max-contract-num');
        maxContractNum = maxContractNum || 0;
    }

    function loadContractList(){
        contractList = window.localStorage.getItem('contract-list');
        contractList = contractList || [];
    }

    function loadContractByID(){
        for(var i = 0; i < contractList.length; i++){
            var contractID = contractList[i];
            var contract = window.localStorage.getItem('contract-'+contractID);
            if(contract){
                contracts.push(contract);
            }
        }
    }

    function getMaxContractNum() {
        return maxContractNum;
    }

    function saveContract(content) {
        maxContractNum++;
        window.localStorage.setItem('contract-'+maxContractNum,content);
        window.localStorage.setItem('max-contract-num',maxContractNum);
        contractList.push(maxContractNum);
        var stringContractList = JSON.stringify(contractList);
        window.localStorage.setItem('contract-list',stringContractList);
    }

    function removeContract(id) {
        var newList = [];
        for(var i = 0; i < contractList.length; i++){
            var entry = contractList[i];
            if(entry != id){
                newList.push(entry);
            }
        }
        contractList = newList;
    }

    that.removeContract = removeContract;
    that.saveContract = saveContract;
    that.loadAllContracts = loadAllContracts;
    that.getMaxContractNum = getMaxContractNum;
    return that;
};