const Btc = require('bitcoinjs-lib');

const network = Btc.networks.dash={
    messagePrefix: 'unused',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc
};

class Dash {

    constructor(){
        
    }

    getWalletInfo() {

        let seed = localStorage.getItem("masterSeed");
        seed = Buffer.from(seed, 'hex');
        let node = Btc.bip32.fromSeed(seed, network);
        let child = node.derivePath("m/44'/5'/0'/0/0"); //testnet
        let privateKey = child.toWIF()
        let address = Btc.payments.p2pkh({ pubkey: child.publicKey, network }).address
        return ({ privateKey: privateKey, address: address });

    }

    submitTransaction(to, value) {
        const promise = new Promise((resolve, reject) => {
            reject();
        })
        return promise;
    }

    getBalance() {
        return new Promise((resolve, reject) => {
            resolve(0);
        })
    }

    getTransaction() {
        const promise = new Promise((resolve, reject) => {
            reject();
        })
        return promise;
    }

    getTransactionDetails(txHash) {
        return null;
    }

    getAllTransactions(address) {
        return null;
    }
}

export default Dash;