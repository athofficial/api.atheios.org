const express = require('express');
const router = express.Router();


router.get('/getGas', function(req, res) {
    res.render('getGas', { title: 'Atheios API - getGas' });
});

module.exports = router;
