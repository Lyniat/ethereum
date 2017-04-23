/**
 * Created by Julien on 22.04.2017.
 */
var express = require('express');
var app = express();

var PythonShell = require('python-shell');
var PORT = 3000;

app.post('/new-contract', function (req, res) {

});

app.get('/identification', function (req, res) {

});

app.get('/contracts', function (req, res) {

    var options = {
      args: ['contract', 0x866d9f0b315afa2dcf31be291882ae9a1965f86a]
    };

    PythonShell.run('smartContract.py', options, function (err, results) {
      if (err) throw err;
      console.log('results: %j', results);
      res.send(results);
    });
});

app.get('/new-account', function (req, res) {

});

app.listen(PORT, function () {
    console.log('ethereum backend online on port ' + PORT);
});
