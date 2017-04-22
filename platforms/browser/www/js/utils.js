'use strict'
/*
 global cordova
 */
var Ethereum = Ethereum || {};
Ethereum.Utils = (function(){
    var that = {};
    function loadSite(file){
        $('#content')[0].innerHTML = '';
        $('#content').load('./'+file);
    }

    that.loadSite = loadSite;
    return that;
})();
