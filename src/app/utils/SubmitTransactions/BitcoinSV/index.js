
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));
const hdKey = require("ethereumjs-wallet/hdkey");
const request = require("request");

class BitcoinSV {

    constructor(){
        
    }

    getWalletInfo() {

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

    submitTransaction(to, value) {

        value = web3.utils.toWei(value.toString(), 'ether');
        let wallet = this.getWalletInfo();
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
                        resolve(result);
                    })
                })
            })
        })
        return promise;
    }

    fromWeiToEther(value) {
        return web3.utils.fromWei(value, 'ether');
    }

    validateAddress(address) {
        return web3.utils.isAddress(address)
    }

    getBalance() {
        let that = this;
        let address = this.getWalletInfo().address;
        return new Promise((resolve, reject) => {
            web3.eth.getBalance(address, function (error, result) {
                if (error) {
                    reject(error);
                }
                result = that.fromWeiToEther(result);
                resolve(result);
            })
        })
    }

    getTransaction() {
        let address = this.getWalletInfo().address;
        let that = this;
        let url = `https://blockscout.com/eth/ropsten/api?module=account&action=txlist&address=0x${address}`;
        const promise = new Promise((resolve, reject) => {
            request(url, function (error, response, body) {
                if (error) {
                    return reject(error);
                }
                
                body = JSON.parse(body).result;
                if(body.length == 0){
                    return reject(0);
                }
                body = body.reverse();
                let transactionData = [];
                for (let i = 0; i < body.length; i++) {
                    body[i].value = that.fromWeiToEther(body[i].value);
                    let description = { "to": body[i].to, "from": body[i].from, "txValue": body[i].value };
                    transactionData.push({
                        key: `key${i + 2}`,
                        txHash: body[i].hash,
                        txValue: body[i].value,
                        description: description
                    })
                }
                resolve(transactionData)

            })
        })
        return promise;
    }

    getTransactionDetails(txHash) {
        return `https://ropsten.etherscan.io/tx/${txHash}`;
    }

    getAllTransactions(address) {
        return `https://ropsten.etherscan.io/address/${address}`;
    }
}

export default BitcoinSV;