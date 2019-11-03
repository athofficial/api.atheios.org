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

    // Check richlist from the API database
    var sql = "SELECT * FROM address ORDER BY balance DESC";
    pool.query(sql, function(err, result) {
        if (err)
            throw(err);
        console.log(result.length);

        var json='{ "richlist_accountnr" :' + result.length + ',\n"richlist" : [\n';
        for (i=0;i<100;i++) {
            json+='{ "address" : "'+result[i].address+'", \n';
            json+=' "balance" : "'+numberWithCommas(Math.round(result[i].balance/10E15)/100) +'" },';
        }
        json=json.slice(0, -1);
        json+=']}';

        console.log(json);
        res.json(JSON.parse(json));

    });
});

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

module.exports = router;