const Btc = require('bitcoinjs-lib');

const network = Btc.networks.digibyte={
    messagePrefix: '\x18DigiByte Signed Message:\n',
    bip32: {
      public: 0x0488B21E,
      private: 0x0488ADE4,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x05,
    wif: 0x80,
};

class DigiByte {

    constructor(){
        
    }

    getWalletInfo() {

        let seed = localStorage.getItem("masterSeed");
        seed = Buffer.from(seed, 'hex');
        let node = Btc.bip32.fromSeed(seed, network);
        let child = node.derivePath("m/44'/20'/0'/0/0"); //testnet
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

export default DigiByte;