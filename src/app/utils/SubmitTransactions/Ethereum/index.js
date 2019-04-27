
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));
const hdKey = require("ethereumjs-wallet/hdkey");
const request = require("request");

function walletDetails() {

    let seed = localStorage.getItem("masterSeed");
    seed = Buffer.from(seed, 'hex');
    let masterKey = hdKey.fromMasterSeed(seed);
    var path = "m/44'/60'/0'/0"
    var masterNode = masterKey.derivePath(path)
    var wallet = masterNode.deriveChild(0).getWallet()
    var address = wallet.getAddress().toString('hex');
    var privateKey = wallet.getPrivateKey().toString('hex');

    return ({ privateKey: privateKey, address: address });
}

export function submitTransaction(to, value) {

    value = web3.utils.toWei(value.toString(), 'ether');
    let wallet = walletDetails();
    let address = wallet.address;
    let privateKey = wallet.privateKey;

    const rawTx = {
        "from": address,
        "to": to,
        "value": value,
        "gas": 53000,
        "chainId": 3,
    };

    const promise = new Promise((resolve, reject) => {
        web3.eth.accounts.getTransactionCount(address, function (err, result) {
            if (err) {
                reject(err)
            }
            rawTx["nonce"] = result;
            web3.eth.accounts.signTransaction(rawTx, privateKey, function (err, result) {
                if (err) {
                    reject(err)
                }
                web3.eth.sendSignedTransaction(result.rawTransaction, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    console.log(result);
                    resolve(result);
                })
            })
        })
    })
    return promise;
}

export function fromWeiToEther(value){
    return web3.utils.fromWei(value, 'ether');
}

export function validateAddress(address){
    return web3.utils.isAddress(address)
}

export function getBalance() {
    let address = walletDetails().address;
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address, function (error, result) {
            if (error) {
                reject(error);
            }
            result = fromWeiToEther(result);
            resolve(result);
        })
    })
}

export function getTransaction(){
    let address = walletDetails().address;
    let url = `https://blockscout.com/eth/ropsten/api?module=account&action=txlist&address=0x${address}`;
    const promise = new Promise((resolve, reject)=>{
        //console.log("proposals-->", buyerId)
        request(url, function (error, response, body){
            if(error){
                console.log(error)
                return reject(error);
            }  

            resolve(body)

        })
    })
    return promise;
}
