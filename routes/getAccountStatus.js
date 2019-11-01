const express = require('express');
const router = express.Router();


router.get('/getAccountStatus', function(req, res) {
    res.render('getAccountStatus', { title: 'Atheios API - getAccountStatus' });
});

module.exports = router;
