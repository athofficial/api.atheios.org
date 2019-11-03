
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




exports.athIsAddress = function(address) {
    return(web3.utils.isAddress(address));
};

exports.athSubscribePending = async function(type, hlpfunc,  cb) {
    await web3.eth.subscribe(type, async function(error, result) {
        if(!error) {

            cb(null, result);
        } else {
            console.log("error", error);
            cb(error, null);
        }
    })
        .on("data", function (transactionHash) {
            web3.eth.getTransaction(transactionHash)
                .then(function (transaction) {
                    hlpfunc(transaction);
                });
        })

};

exports.athSubscribeNewBlock = async function(type, hlpfunc,  cb) {
    await web3.eth.subscribe(type, async function(error, result) {
        if(!error) {

            cb(null, result);
        } else {
            console.log("error", error);
            cb(error, null);
        }
    })
        .on("data", function (blockheader) {
            hlpfunc(blockheader);
        });
};


exports.athGetBlockNumber = async function(cb) {
    await web3.eth.getBlockNumber(async function(error, result) {
        if(!error) {
            cb(null, result);
        } else {
            console.log("error", error);
            cb(error, null);
        }
    });
};

exports.athGetTransact = async function(hash, cb) {
    await web3.eth.getTransaction(hash, async function(error, trans) {
        if(!error) {
            cb(null, trans);
        } else {
            console.log("error", error);
            cb(error, null);
        }
    });
};

exports.athGetBlock = async function(nr, cb) {
    await web3.eth.getBlock(nr, async function(error, result) {
        if(!error) {
            cb(null, result);
        } else {
            console.log("error", error);
            cb(error, null);
        }
    });
};

exports.athGetBalance = async function(addr, cb) {
    await web3.eth.getBalance(addr, async function (error, result) {
        if (!error) {
            cb(null, result);
        } else {
            console.log("error", error);
            cb(error, null);
        }
    });
};


exports.athGetHashrate = async function(cb) {
    await web3.eth.getBlockNumber(async function(error, blockNum) {
        let sampleSize=4;
        if(!error) {
            await web3.eth.getBlock(blockNum, true, async function(error, result) {
                let t1=result.timestamp;
                await web3.eth.getBlock(blockNum-sampleSize, true, async function(error, result2) {
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

exports.athGetBlockTime = async function(cb) {
    await web3.eth.getBlockNumber(async function(error, blockNum) {
        let sampleSize=4;
        if(!error) {
            await web3.eth.getBlock(blockNum, true, async function(error, result) {
                let t1=result.timestamp;
                await web3.eth.getBlock(blockNum-sampleSize, true, async function(error, result2) {
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

exports.athGetTransaction = function(cb) {
    var gasUsed=[];

    web3.eth.getBlockNumber(function(error, blockNum) {
        if(!error) {
            web3.eth.getBlock(blockNum, function(error, res) {
                if(!error) {
                    gasUsed[0]=res.gasUsed;
                    web3.eth.getBlock(blockNum-1, function(error, res) {
                        if(!error) {
                            gasUsed[1]=res.gasUsed;
                            web3.eth.getBlock(blockNum-2, function(error, res) {
                                if(!error) {
                                    gasUsed[2]=res.gasUsed;
                                    web3.eth.getBlock(blockNum-3, function(error, res) {
                                        if(!error) {
                                            gasUsed[3]=res.gasUsed;
                                            jsonstr='{ "gas" : [{"blocknr" : '+blockNum+', "gasUsed" : '+gasUsed[0]+'},'+
                                                '{"blocknr" : '+(blockNum-1)+',"gasUsed" : '+gasUsed[1]+'},'+
                                                '{"blocknr" : '+(blockNum-2)+',"gasUsed" : '+gasUsed[2]+'},'+
                                                '{"blocknr" : '+(blockNum-3)+',"gasUsed" : '+gasUsed[3]+'}]}';
                                            cb(null, jsonstr);


                                        } else {
                                            console.log("error", error);
                                            cb(error, null);
                                        }
                                    });

                                } else {
                                    console.log("error", error);
                                    cb(error, null);
                                }
                            });

                        } else {
                            console.log("error", error);
                            cb(error, null);
                        }
                    });


                } else {
                    console.log("error", error);
                    cb(error, null);
                }
            });



        } else {
            console.log("error", error);
            cb(error, null);
        }
    });


};

