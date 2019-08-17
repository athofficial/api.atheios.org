var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    var i;
    var json='{ "monitaryPolicy" : {';
    var startblock=0;
    var monitary_block= [716727, 716727, 222101, 1433454,  1433454,  1433454,  1433454,  1433454,  1433454,  1433454, 2866908];
    var monitary_reward= [12, 10, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    var monitary_devreward= [0.1, 0.2, 0.3, 1.35, 1.2, 1.05, 0.9, 0.75, 0.6, 0.45, 0.3, 0.15];
    for (i=0; i<monitary_block.length;i++)
    {
        json+=' "epoch'+ i +'" : {"startBlock" : "' + startblock + '", ';
        startblock+=monitary_block[i];
        endblock=startblock-1;
        json+=' "endBlock" : "'+ endblock  +'", "minerReward" : ' + monitary_reward[i] + ', "devReward" : ' + monitary_devreward[i] +'}, ';
    }
    json+='"epoch11" : { "startblock" : "' + startblock +'", "endblock" : "infinite" , "minerReward" : "1", "devReward" : "0.15"}';
    json+='}}';
    res.json(JSON.parse(json));
});

module.exports = router;