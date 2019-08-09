
var date;
date = new Date();
date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' +
    ('00' + date.getUTCHours()).slice(-2) + ':' +
    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
    ('00' + date.getUTCSeconds()).slice(-2);

var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8696"));

var web3;
const net = require('net');
if (!process.env.production) {
    console.log("production");
    web3 = new Web3(new Web3.providers.IpcProvider(process.env.HOME + '/.atheios/gath.ipc', net));
}
else {
    console.log("Development");
    web3 = new Web3(new Web3.providers.IpcProvider(process.env.HOME +'/Library/atheios/gath.ipc', net));
}


var version = web3.version;
console.log(" >>> DEBUG version: " + version);


exports.athGetBlockNumber = function(cb) {
    web3.eth.getBlockNumber(function(error, result) {
        if(!error) {
            console.log(result);
            cb(null, result);
        } else {
            console.log("error", error);
            cb(error, null);
        }
    });
};

exports.athGetHashrate = function(cb) {
    web3.eth.getBlockNumber(function(error, blockNum) {
        let sampleSize=4;
        if(!error) {
            web3.eth.getBlock(blockNum, true, function(error, result) {
                let t1=result.timestamp;
                web3.eth.getBlock(blockNum-sampleSize, true, function(error, result2) {
                    let t2=result2.timestamp;
                    let blockTime=(t1-t2)/sampleSize;
                    let difficulty=result.difficulty;
                    let hashrate=difficulty / blockTime;
                    cb(null, hashrate);
                });
            });


        } else {
            console.log("error", error);
            cb(error, null);
        }
    });

};

exports.athGetBlockTime = function(cb) {
    web3.eth.getBlockNumber(function(error, blockNum) {
        let sampleSize=4;
        if(!error) {
            web3.eth.getBlock(blockNum, true, function(error, result) {
                let t1=result.timestamp;
                web3.eth.getBlock(blockNum-sampleSize, true, function(error, result2) {
                    let t2=result2.timestamp;
                    let blockTime=(t1-t2)/sampleSize;
                    cb(null, blockTime);
                });
            });


        } else {
            console.log("error", error);
            cb(error, null);
        }
    });

};

exports.athGetDifficulty = function(cb) {
    web3.eth.getBlockNumber(function(error, blockNum) {
        if(!error) {
            web3.eth.getBlock(blockNum, true, function(error, result) {
                let difficulty=result.difficulty;
                cb(null, difficulty);
            });


        } else {
            console.log("error", error);
            cb(error, null);
        }
    });

};

