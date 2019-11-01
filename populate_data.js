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

var {athGetBlockNumber, athGetBlock, athGetTransact, athGetBalance} = require('./ath');


var latestSyncedBlock = 0;
var txcount = 0;
var blockcount =0;

pool.query = util.promisify(pool.query);
athGetTransact = util.promisify(athGetTransact);
athGetBlock=util.promisify(athGetBlock);
athGetBalance=util.promisify(athGetBalance);
athGetBlockNumber=util.promisify(athGetBlockNumber);

if (debugon)
    console.log("Starting ...");
syncBlockChain();

// Check first the latest blockchain entry
// we go in steps of 10000 blocks
async function syncBlockChain() {
    var segment = 0;
    var unsync = true;

    var result;

    if (debugon)
        console.log("Sync ...");


    try {
        result = await athGetBlockNumber();
    } catch (e) {
        throw e;
    }
    latestBlock = result;
    console.log("Current last block: ", latestBlock);
    // Check if the blockchain is in sync with DB
    var sql = "SELECT * FROM block ORDER BY id DESC LIMIT 1;";
    try {
        result = await pool.query(sql);
    } catch (e) {
        throw e;
    }
    console.log(result.length);
    if (result.length == 1) {
        latestSyncedBlock = result[0].id;
        blockcount = latestSyncedBlock;
    } else
        latestSyncedBlock = 0;
    // AS db ids are offsetted by one we need to subtract 1
    if ((latestSyncedBlock - 1) === latestBlock) {
        unsync = false;
    }
    console.log("Latest block in DB:", latestSyncedBlock);
    console.log("Latest block in Blockchain:", latestBlock);
    var start=new Date();
    var end;
    while (blockcount < latestBlock) {
        try {
            block = await athGetBlock(blockcount);
        } catch (e) {
            throw e;
        }
        if (block.number % 100 == 0){
            end= new Date - start;
            console.log("Current block: %d, execution time: %dms, Total time: %d min", block.number, end, ((latestBlock-blockcount)*end/6000000));
            start = new Date;
        }

        if (block.transactions.length != 0) {
            var sql = "INSERT INTO block (id,blockhash, miner, timestamp, size, transactions, number, uncle_hash, data, gasused) VALUES ('" + (block['number'] + 1) + "','" + block.hash + "', '" + block.miner +
                "', '" + block.timestamp + "', '" + block.size + "', '" + block.transactions.length + "', '" + block['number'] + "', '" + block.sha3Uncles + "', '" + block.extraData + "', '" + block.gasUsed +
                "') ON DUPLICATE KEY UPDATE id=id";

            try {
                result = await pool.query(sql);
            } catch (e) {
                throw e;
            }
            var timestamp = block.timestamp;
            var tx;
            for (var i = 0; i < block.transactions.length; i++) {
                try {
                    tx = await athGetTransact(block.transactions[i]);
                } catch (e) {
                    console.log(e);
                }
                var txsql = "INSERT INTO transaction (txid, value, gas, gasprice, nonce, txdata, block_id,sender,receiver,timestamp) VALUES ('" + tx.hash + "', '" + tx.value + "', '" + tx.gas + "', '" +
                    tx.gasPrice + "', '" + tx.nonce + "', '" + tx['input'] + "', '" + tx.blockNumber + "','" + tx.from + "','" + tx.to + "','" + timestamp + "')";
                try {
                    result = await pool.query(txsql);
                } catch (e) {
                    console.log(e);
                }

                var tosql = "INSERT INTO address (address,inputcount,outputcount) VALUES ('" + tx["to"] + "','0','0') ON DUPLICATE KEY UPDATE address=address";
                try {
                    result = await pool.query(tosql);
                } catch (e) {
                    console.log(e);
                }

                var fromsql = "INSERT INTO address (address,outputcount,inputcount) VALUES ('" + tx["from"] + "','0','0') ON DUPLICATE KEY UPDATE address=address";
                try {
                    result = await pool.query(fromsql);
                } catch (e) {
                    console.log(e);
                }

                sql = "UPDATE address SET inputcount = inputcount + 1 WHERE address = '" + tx["to"] + "'";
                try {
                    result = await pool.query(sql);
                } catch (e) {
                    console.log(e);
                }

                sql = "UPDATE address SET outputcount = outputcount + 1 WHERE address = '" + tx["from"] + "'";
                try {
                    result = await pool.query(sql);
                } catch (e) {
                    console.log(e);
                }
            }


            // Now do some postprcessing
            // Add the total value to the account

        }
        blockcount++;
        segment++;
    }

    console.log("DB in sync");
    console.log("Update all address balances");
    // Check if the blockchain is in sync with DB
    var sql = "SELECT * FROM address";
    try {
        result = await pool.query(sql);
    } catch (e) {
        throw e;
    }
    console.log(result.length);

    var balance;
    for (i=0;i<result.length;i++) {
        console.log(i);
        try {
            balance = await athGetBalance(result[i].address);
        } catch (e) {
            throw e;
        }
        console.log("Balance %s, %d",result[i].address, balance);
        sql = "UPDATE address SET balance = "+ balance +" WHERE address = '" + result[i].address + "'";
        try {
            await pool.query(sql);
        } catch (e) {
            console.log(e);
        }
    }

}
