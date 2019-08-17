const express = require('express');
const router = express.Router();


router.get('/getMonetaryPolicy', function(req, res) {
    res.render('getMonetaryPolicy', { title: 'Atheios API - getMonetaryPolicy' });
});

module.exports = router;
