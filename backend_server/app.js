/**
 * Created by Julien on 22.04.2017.
 */
var express = require('express');
var app = express();
var async = require('async');
var PythonShell = require('python-shell');
var PORT = 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var accountCounter = 0;
var users = {};

app.post('/new-contract', function (req, res) {
    var owner = req.body.owner;
    var partner = req.body.partner;
    var text = req.body.text;

    console.log('newContract');

    var options = {
      args: ['newContract', owner, partner, text]
    };

    PythonShell.run('smartContract.py', options, function (err, results) {
      if (err) res.send(err);
      var transID = results[0];

      if(!users[owner]) users[owner] = {};

      if(!users[owner]['transactions']) {
        users[owner]['transactions'] = [transID]
      } else {
        users[owner]['transactions'].push(transID)
      }

      if(!users[partner]) users[partner] = {};

      if(!users[partner]['transactions']) {
        users[partner]['transactions'] = [transID]
      } else {
        users[partner]['transactions'].push(transID)
      }
      //console.log(users);
      res.send(users);
    });
});

app.post('/contract-data', function (req, res) {
    var transID = req.body.address;

    getContractData(transID, function(result) {
        console.log(result);
        res.send(result);
    });
});

app.post('/contracts', function (req, res) {
    var userAddress = req.body.address;
    var contracts = [];
    var counter = 0;

    console.log(users);

    if(!users[userAddress] || !users[userAddress]['transactions']) res.send("No transactions");

    for(id in users[userAddress]['transactions']) {

        var transID = users[userAddress]['transactions'][id];
        console.log(transID);

        getContractData(transID, function(result) {
            counter ++;
            contracts.push(result);
            if (counter == users[userAddress]['transactions'].length) {
                res.send(contracts);
            }
        })
    }
});

app.post('/identity-data', function (req, res) {
    var userAddress = req.body.address;
    var identityData = users[userAddress]['identityData'];
    res.send(identityData);
});

app.post('/new-account', function (req, res) {
    var data = req.body.data;

    var options = {
      mode: 'text',
      args: ['accounts', accountCounter++]
    };

    PythonShell.run('smartContract.py', options, function (err, result) {
        if (err) res.send(err);
        userAddress = result[0];
        users[userAddress] = {
            'identityData': data
        };
        res.send(userAddress);
    });
});

app.listen(PORT, function () {
    console.log('ethereum backend online on port ' + PORT);
});

function getContractData(transID, callback) {
    var options = {
      args: ['contractData', transID]
    };

    PythonShell.run('smartContract.py', options, function (err, result) {
      if (err) callback(err);
      callback(result);
    });
}
