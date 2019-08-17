var express = require('express');
var router = express.Router();

const {athGetTransaction} = require('./../../ath');

/* GET home page. */
router.get('/', function(req, res, next) {
    athGetTransaction(function(error,result) {
                res.json(result);
            });
});

module.exports = router;