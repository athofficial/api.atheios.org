var express = require('express');
var router = express.Router();
var util =require('util');

var {athGetBlockNumber, athGetBlock, athGetTransact, athGetBalance} = require('../.././ath');

athGetTransact = util.promisify(athGetTransact);
athGetBlock=util.promisify(athGetBlock);
athGetBalance=util.promisify(athGetBalance);
athGetBlockNumber=util.promisify(athGetBlockNumber);

router.get('/', function(req, res, next) {
    var i;
    athGetBalance(req.query.addr, function(err,result) {
        var json='{ "balance" : '+ Math.round(result/10e15)/100;
        json+='}';
        res.json(JSON.parse(json));

    });
});

async function test(query) {
    var balance;

    console.log("Wait:",query);

    try {
        balance = await athGetBalance(query);
    } catch (e) {
        throw e;
    }
    return(balance);
}

module.exports = router;