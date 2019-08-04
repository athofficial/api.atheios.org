const express = require('express');
const router = express.Router();


router.get('/getMonitaryPolicy', function(req, res) {
    res.render('getMonitaryPolicy', { title: 'Atheios API - getEpoch' });
});

module.exports = router;
