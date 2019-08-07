const express = require('express');
const router = express.Router();


router.get('/getHashRate', function(req, res) {
    res.render('getHashRate', { title: 'Atheios API - getHashRate' });
});

module.exports = router;
