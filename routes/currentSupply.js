const express = require('express');
const router = express.Router();


router.get('/currentSupply', function(req, res) {
    res.render('currentSupply', { title: 'Atheios API - currentSupply' });
});

module.exports = router;
