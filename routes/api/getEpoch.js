var express = require('express');
var router = express.Router();

const {athGetBlockNumber} = require('./../../ath');

/* GET home page. */
router.get('/', function(req, res, next) {
    athGetBlockNumber(function(error,result) {
        var i;
        var monitary_block= [716727, 716727, 222101, 1433454,  1433454,  1433454,  1433454,  1433454,  1433454,  1433454, 2866908];
        for (i=0; i<monitary_block.length;i++)
        {
            if (result-monitary_block[i]<0)
                break;
            else {
                result-=monitary_block[i];
            }
        }
        var secs=(monitary_block[i]-result)*22;
        var days=secs/86400;
        res.json({ currentEpoch : i , secsToNextEpoch : secs , daysToNextEpoch : Math.round(days)});
    });
});

module.exports = router;