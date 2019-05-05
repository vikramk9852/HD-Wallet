
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));
const hdKey = require("ethereumjs-wallet/hdkey");
const request = require("request");

class EthereumClassic {

    constructor(){
        
    }

    getWalletInfo() {

        let seed = localStorage.getItem("masterSeed");
        seed = Buffer.from(seed, 'hex');
        let masterKey = hdKey.fromMasterSeed(seed);
        var path = "m/44'/61'/0'/0"
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
        return new Promise((resolve, reject) => {
            resolve(0);
        })
    }

    getTransaction() {
        const promise = new Promise((resolve, reject) => {
            reject(0);
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

export default EthereumClassic;