// Connect to database
// Establishing connection to the database
// Instatiate database
console.log("Reading config data");
var config = require("./config")();

var util =require('util');
const Database=require('./database');
global.pool=new Database();

global.debugon=true;
global.version="0.04";

if (process.env.production) {
    console.log('This is a development env...');
}
else {
    console.log('This is a production env...')
}

var {athGetBlockNumber, athGetBlock, athGetTransact, athGetBalance, athSubscribePending, athSubscribeNewBlock} = require('./ath');


var latestSyncedBlock = 0;
var txcount = 0;
var blockcount =0;

pool.query = util.promisify(pool.query);
athGetTransact = util.promisify(athGetTransact);
athGetBlock=util.promisify(athGetBlock);
athGetBalance=util.promisify(athGetBalance);
athGetBlockNumber=util.promisify(athGetBlockNumber);
athSubscribePending=util.promisify(athSubscribePending);
athSubscribeNewBlock=util.promisify(athSubscribeNewBlock);

if (debugon)
    console.log("Subscribing to ETH event");
var subscription1;
var subscription2;

subscription1 = athSubscribePending('pendingTransactions',logTransaction, function (error, result) {});
subscription2 = athSubscribeNewBlock('newBlockHeaders',logData, function (error, result) {});


if (debugon)
    console.log("Starting ...");
async function logData(transaction) {
    console.log(">>> New Block");
    try {
        result = await athGetBlock(transaction.number);
    } catch (e) {
        throw e;
    }

    console.log(result);

}

function logTransaction(transaction) {
    console.log(">>> Pending Transaction");
    console.log(transaction);

}