const express = require('express');
const router = express.Router();


router.get('/getRichList', function(req, res) {
    res.render('getRichList', { title: 'Atheios API - getRichList' });
});

module.exports = router;
