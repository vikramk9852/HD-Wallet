const Btc = require('bitcoinjs-lib');
const network = Btc.networks.testnet;
var pushtx = require('blockchain.info/pushtx').usingNetwork(3);
var blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3);

class Bitcoin {

    getWalletInfo() {

        let seed = localStorage.getItem("masterSeed");
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
        let fee = 10000, returnAmount;
        value *= 100000000;
        value += fee;

        return new Promise((resolve, reject) => {
            blockexplorer.getUnspentOutputs(wallet.address).then(res=>{
                res = res.unspent_outputs;
                let amount = 0;
                for(let i = 0; i < res.length; i++) {
                    amount += res[i].value;
                    txb.addInput(res[i].tx_hash_big_endian, res[i].tx_output_n);
                    if(amount >= value) {
                        returnAmount = amount-value;
                        txb.addOutput(to, value-fee);
                        txb.addOutput(wallet.address, returnAmount);
                        break;
                    }
                }
                txb.sign(0, signTransaction);
                let txHash = txb.build().toHex();

                pushtx.pushtx(txHash).then(res=>{
                    resolve(res);
                }).catch(err=>{
                    return reject(err);
                })
            })
        })
    }

    getBalance() {
        let wallet = this.getWalletInfo();
        const promise = new Promise((resolve, reject) => {
            blockexplorer.getBalance(wallet.address).then(res=>{
                let amount = res[wallet.address].final_balance;
                amount = parseFloat(amount);
                amount /= 100000000;
                resolve(amount);
            }).catch(err=>{
                reject(err);
            })
        })
        return promise;
    }

    getTransaction() {
        let wallet = this.getWalletInfo();
        return new Promise((resolve, reject) => {

            blockexplorer.getAddress(wallet.address).then(res=>{
                res = res.txs;
                let transactionData = [];
                for(let i = 0; i < res.length; i++){
                    res[i].result = parseFloat(res[i].result);
                    res[i].result /= 100000000;
                    let description = {"to": JSON.stringify(res[i].inputs), "from": JSON.stringify(res[i].out)};
                    transactionData.push({
                        key: `key${i+2}`,
                        txHash: res[i].hash,
                        txValue: res[i].result,
                        description: description
                    })
                }
                resolve(transactionData);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    getTransactionDetails(txHash) {
        let url = `https://www.blockchain.com/btctest/tx/${txHash}`;
        return url;
    }

    getAllTransactions(address) {
        let url = `https://www.blockchain.com/btctest/address/${address}`;
        return url
    }
}

export default Bitcoin;
