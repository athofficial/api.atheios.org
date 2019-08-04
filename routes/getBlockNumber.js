const express = require('express');
const router = express.Router();


router.get('/getBlockNumber', function(req, res) {
    res.render('getBlockNumber', { title: 'Atheios API - getBlockNumber' });
});

module.exports = router;
