var express = require('express');
var router = express.Router();

const {athGetBlockNumber} = require('./../../ath');

/* GET home page. */
router.get('/', function(req, res, next) {
    athGetBlockNumber(function(error,result) {
        res.json({ 'getBlockNumber': result });
    });
});

module.exports = router;