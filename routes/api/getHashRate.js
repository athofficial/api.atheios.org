var express = require('express');
var router = express.Router();

const {athGetHashrate, athGetDifficulty, athGetBlockTime} = require('./../../ath');

/* GET home page. */
router.get('/', function(req, res, next) {
    athGetHashrate(function(error,result) {
        var i;
        athGetDifficulty(function(error,result2) {
            athGetBlockTime(function(error,result3) {
                var hashrate=Math.round(result / 1E6);
                var difficulty=Math.round(result2);
                res.json({getHashRate: hashrate , getDifficulty: difficulty, getBlockTime: result3});
            });
        });
    });
});

module.exports = router;