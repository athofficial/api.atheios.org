var express = require('express');
var router = express.Router();

const {athGetHashrate, athGetDifficulty, athGetBlockTime} = require('./../../ath');

/* GET home page. */
router.get('/', function(req, res, next) {
    athGetHashrate(function(error,result) {
        var i;
        athGetDifficulty(function(error,result2) {
            athGetBlockTime(function(error,result3) {
                var hashstr=Math.round(result / 1E7) / 100 + "GH/s";
                res.json({getHashrate: hashstr , getDifficulty: result2, getBlockTime: result3});
            });
        });
    });
});

module.exports = router;