var express = require('express');
var router = express.Router();
var util =require('util');

var {athGetBlockNumber, athGetBlock, athGetTransact, athGetBalance,athIsAddress} = require('../.././ath');

athGetTransact = util.promisify(athGetTransact);
athGetBlock=util.promisify(athGetBlock);
athGetBalance=util.promisify(athGetBalance);
athGetBlockNumber=util.promisify(athGetBlockNumber);

router.get('/', function(req, res, next) {
    var i;

    // Check richlist from the API database
    if (athIsAddress(req.query.addr)) {
        athGetBlockNumber(function (err, latestblock) {
            var sql = "SELECT * FROM address where address='" + req.query.addr + "'";
            pool.query(sql, function (err, result) {
                if (err)
                    throw(err);
                var json='{ "balance" : '+ Math.round(result[0].balance/10e15)/100+",";
                json+='"in_count":'+ result[0].inputcount+",";
                json+='"out_count":'+ result[0].outputcount+",";
                json+='"incoming": [';
                var sql = "SELECT * FROM transaction where receiver='" + req.query.addr + "' ORDER by id DESC LIMIT 25";
                pool.query(sql, function (err, tx) {
                    if (err)
                        throw(err);
                    for (i=0;i<tx.length;i++) {
                        json+='{ "tx_inhash": "'+tx[i].txid +'",' +
                            ' "value_in_gwei" : "' + numberWithCommas(Math.round(tx[i].value/1E9)) + '",' +
                            ' "txid" : "' + tx[i].id + '",' +
                            ' "timestamp" : "'+ toDateTime(tx[i].timestamp) + '",' +
                            ' "confirmations" : "'+ (latestblock-tx[i].block_id) + '",' +
                            ' "block" : "'+ tx[i].block_id+'" },';
                    }
                    json=json.slice(0, -1);

                    json+='],';
                    json+='"outgoing": [';

                    var sql = "SELECT * FROM transaction where sender='" + req.query.addr + "' ORDER by id DESC LIMIT 25";
                    pool.query(sql, function (err, tx) {
                        if (err)
                            throw(err);
                        for (i = 0; i < tx.length; i++) {
                            json += '{ "tx_outhash": "' + tx[i].txid + '",' +
                                ' "value_in_gwei" : "' + numberWithCommas(Math.round(tx[i].value/1E9)) + '",' +
                                ' "timestamp" : "' + toDateTime(tx[i].timestamp) + '",' +
                                ' "txid" : "' + tx[i].id + '",' +
                                ' "confirmations" : "'+ (latestblock-tx[i].block_id) + '",' +
                                ' "block" : "' + tx[i].block_id + '" },';
                        }
                        json = json.slice(0, -1);

                        json += ']';

                        json += '}';
                        console.log(json);
                        res.json(JSON.parse(json));
                    });
                });

            });

        });
    }
    else {
        res.status(404).send("Addr wrongly formatted!");
    }

});

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

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