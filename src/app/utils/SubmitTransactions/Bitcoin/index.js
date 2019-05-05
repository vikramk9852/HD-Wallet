const request = require('request');
const Btc = require('bitcoinjs-lib');
const network = Btc.networks.testnet;
var pushtx = require('blockchain.info/pushtx').usingNetwork(3)
var blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3)

// function getWalletInfo

// let masterSeed = '6a35ad843824a9f292da18d3168a35af2795784e965752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508';

// let node = Btc.bip32.fromSeed(Buffer.from(masterSeed, 'hex'), network);
// let child = node.derivePath("m/44'/1'/0'/0/0");
// let privateKey = child.toWIF()

// let address = Btc.payments.p2pkh({pubkey: child.publicKey, network}).address
// let wallet = new Btc.ECPair.fromWIF(privateKey, network);
// let txb = new Btc.TransactionBuilder(network);

// let amount = 5030000;
// let keep = 4900000;
// let fee = 10000;
// let send = amount-keep-fee;
// let sendPublicKey = 'n1ZSiMXwVsnJzUU5RqBa3jXpxbkFUFudZo';
// let publicKey = address;
// txb.addInput('6860fe0c1799816f996189538bc72376d902ed3d26942bae937247d0e6aa5de5', 1);
// txb.addOutput(sendPublicKey, send);
// txb.addOutput(publicKey, keep);
// txb.sign(0, wallet);

// let txHash = txb.build().toHex();
// console.log(txHash);

class Bitcoin {

    constructor() {
        this.apiUrl = "https://testnet.blockexplorer.com/api/";
    }

    getWalletInfo() {

        let seed = '6a35ad843824a9f292da18d3168a35af2795784e965752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508'
        seed = Buffer.from(seed, 'hex');
        let node = Btc.bip32.fromSeed(seed, network);
        let child = node.derivePath("m/44'/1'/0'/0/0"); //testnet
        let privateKey = child.toWIF()
        let address = Btc.payments.p2pkh({ pubkey: child.publicKey, network }).address
        return ({ privateKey: privateKey, address: address });

    }

    submitTransaction(to, value) {
        let wallet = this.getWalletInfo();
        let signTransaction = new Btc.ECPair.fromWIF(wallet.privateKey, network);
        let txb = new Btc.TransactionBuilder(network);
        let utxoInputUrl = `https://testnet.blockexplorer.com/api/addr/${wallet.address}/utxo`;
        let fee = 10000, returnAmount;
        value *= 100000000;
        value += fee;
        return new Promise((resolve, reject) => {
            request(utxoInputUrl, function (error, response, body) {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                body = JSON.parse(body);
                let amount = 0;
                for (let i = 0; i < body.length; i++) {
                    amount += body[i].satoshis;
                    txb.addInput(body[i].txid, body[i].vout);
                    console.log(body[i].txid)
                    if (amount >= value) {
                        returnAmount = amount - value;
                        console.log(value-fee);
                        txb.addOutput(to, value - fee);
                        txb.addOutput(wallet.address, returnAmount);
                        break;
                    }
                }
                console.log(returnAmount);

                txb.sign(0, signTransaction);
                let txHash = txb.build().toHex();
                console.log(txHash)
                resolve(txHash);

                // pushtx.pushtx(txHash).then(res=>{
                // 	console.log(res)
                // }).catch(err=>{
                // 	console.log(err)
                // })
            })
        })
    }

    getBalance() {
        let wallet = this.getWalletInfo();
        let amount = 0;
        let utxoInputUrl = `${this.apiUrl}addr/${wallet.address}/utxo`;
        const promise = new Promise((resolve, reject) => {
            this.getDataFromAPI(utxoInputUrl).then(res => {
                res = JSON.parse(res);
                let inputLength = res.length;

                for (let i = 0; i < inputLength; i++) {
                    amount += res[i]["amount"];
                }

                resolve(amount);
            }).catch(err => {
                return reject(err);
            })
        })
        return promise;
    }

    getTransaction() {
        let wallet = this.getWalletInfo();
        let transactionUrl = `${this.apiUrl}/txs/?address=${wallet.address}`;

        const promise = new Promise((resolve, reject) => {
            this.getDataFromAPI(transactionUrl).then(body => {
                body = JSON.parse(body).txs;
                body = body.reverse();
                console.log(body);
                let transactionData = [];
                for (let i = 0; i < body.length; i++) {
                    body[i].value = body[i].valueIn - body[i].valueOut;
                    let description = { "to": JSON.stringify(body[i].vin), "from": JSON.stringify(body[i].vout), "valueIn": body[i].valueIn, "valueOut": body[i].valueOut };
                    transactionData.push({
                        key: `key${i + 2}`,
                        txHash: body[i].txid,
                        txValue: body[i].value,
                        description: description
                    })
                }
                resolve(transactionData);
            }).catch(err => {
                return reject(err);
            })
        })

        return promise;
    }

    getDataFromAPI(url) {
        const promise = new Promise((resolve, reject) => {
            request(url, function (error, response, body) {
                if (error) {
                    return reject(error);
                }
                resolve(body);
            })
        })

        return promise;
    }

    getTransactionDetails(txHash) {
        let url = `https://testnet.blockexplorer.com/tx/${txHash}`;
        return url;
    }

    getAllTransactions(address) {
        let url = `https://testnet.blockexplorer.com/address/${address}`;
        return url
    }
}

export default Bitcoin;
