var express = require('express');
var router = express.Router();

const {athGetBlockNumber} = require('./../../ath');

/* GET home page. */
router.get('/', function(req, res, next) {
    athGetBlockNumber(function(error,result) {
        var i;
        var coins=0;
        var monitary_block= [716727, 716727, 222101, 1433454,  1433454,  1433454,  1433454,  1433454,  1433454,  1433454, 2866908];
        var monitary_reward= [12.1, 10.2, 9.3, 10.35, 9.2, 8.05, 6.9, 5.75, 4.6, 3.45, 2.3, 1.15];
        for (i=0; i<monitary_block.length;i++)
        {
            if (result-monitary_block[i]<0)
                break;
            else {
                result-=monitary_block[i];
                coins+=monitary_reward[i]*monitary_block[i];
            }
        }
        coins+=result*monitary_reward[i];
        res.json({ currentSupply : Math.round(coins) });
    });
 });

module.exports = router;