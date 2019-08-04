const express = require('express');
const router = express.Router();


router.get('/getEpoch', function(req, res) {
    res.render('getEpoch', { title: 'Atheios API - getEpoch' });
});

module.exports = router;
