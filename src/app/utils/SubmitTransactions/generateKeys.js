var hdKey = require("hdkey")
var bip39 = require("bip39")


var mnemonic = 'lottery barely struggle slam honey review news hollow address midnight blame parent'

bip39.mnemonicToSeed(mnemonic).then((seed)=>{

    console.log(seed.toString('hex'));

    var masterKey = hdKey.fromMasterSeed
    (Buffer.from(
    '6a35ad843824a9f292da18d3168a35af2795784e965752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508',
    'hex'))

    var path = "m/44'/60'/0'/0/0"

    console.log(masterKey.derive(path).privateKey.toString('hex'))

    // var masterNode = masterKey.derive(path)

    // console.log(masterNode.privateKey.toString('hex'))

    // var keyStore = wallet.toV3String("password")
    // console.log(keyStore)
})
// const Btc = require('bitcoinjs-lib')
// const network = Btc.networks.bitcoin;
// let node = Btc.bip32.fromSeed(Buffer.from('6a35ad843824a9f292da18d3168a35af2795784e965752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508', 'hex'), network);
// let masterBuffer = Buffer.from('b803f8dbe8bff5e4d4c45ff12374d0bedf112cac07e678a27b63e68a41e819a7', 'hex');
// let child = node.derivePath("m/44'/145'/0'/0/0")
// let privateKey = child.toWIF()
// let keyPair = Btc.ECPair.fromPrivateKey(masterBuffer, { network: Btc.networks.bitcoin, compress: true });
// // let publicKey = temp.getAddress().toString('hex')
// let address = Btc.payments.p2pkh({pubkey: child.publicKey, network}).address
// // let privateKey = temp.toWIF()
// console.log( address, child.publicKey.toString('hex'), privateKey);

// // // console.log(child)
// console.log(keyPair)