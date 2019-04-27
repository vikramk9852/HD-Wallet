// import { bitcoin } from "bitcoinjs-lib/types/networks";

// // const Btc = require('bitcoinjs-lib')
// // const TestNet = Btc.networks.testnet
    
// // let keyPair = Btc.ECPair.makeRandom({ network: TestNet })
// // console.log(keyPair)
// // let publicKey = keyPair.getAddress()
// // let privateKey = keyPair.toWIF()
// // console.log(`Public: ${publicKey} \n Private: ${privateKey}`)

const Btc = require('bitcoinjs-lib')
// const network = Btc.networks.bitcoin;
// let node = Btc.bip32.fromSeed(Buffer.from('6a35ad843824a9f292da18d3168a35af2795784e965752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508', 'hex'), network);
// let child = node.derivePath("m/44'/0'/0'/0/0")
// let temp = Btc.ECPair.fromWIF(child.toWIF(), null, {network: network});
// // let privateKey = child.toWIF()
// // let keyPair = Btc.ECPair(child.__d, null, { network: Btc.networks.bitcoin, compress: false });
// // let publicKey = temp.getAddress().toString('hex')
// let address = Btc.payments.p2pkh({pubkey: temp.publicKey, network}).address
// // let privateKey = temp.toWIF()
// // console.log( address, child.publicKey.toString('hex'), privateKey);
// console.log(temp.toWIF(), address)


const TestNet = Btc.networks.testnet;
const privateKey = 'cPBxvZ6VkNzUztn9oB4xq4XX38p6CZ9GjKYTSYgFKuMpp9QVG1nt';
let wallet = new Btc.ECPair.fromWIF(privateKey, TestNet);
let txb = new Btc.TransactionBuilder(TestNet);

let amount = 5030000;
let keep = 4900000;
let fee = 10000;
let send = amount-keep-fee;
let sendPublicKey = 'n1ZSiMXwVsnJzUU5RqBa3jXpxbkFUFudZo';
let publicKey = 'mgBTTJ5XUJVc7GoMxTPUuwdJaeDVs6o1gB';
txb.addInput('6860fe0c1799816f996189538bc72376d902ed3d26942bae937247d0e6aa5de5', 1);
txb.addOutput(sendPublicKey, send);
txb.addOutput(publicKey, keep);
txb.sign(0, wallet);

let txHash = txb.build().toHex();
console.log(txHash);