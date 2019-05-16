const hdKey = require("ethereumjs-wallet/hdkey");
var bip39 = require("bip39")


var mnemonic = 'lottery barely struggle slam honey review news hollow address midnight blame parent'

// bip39.mnemonicToSeed(mnemonic).then((seed)=>{


//     let masterKey = hdKey.fromMasterSeed(seed);
//     var path = "m/44'/20'/0'/0"
//     var masterNode = masterKey.derivePath(path)
//     var wallet = masterNode.deriveChild(0).getWallet()
//     var address = wallet.getAddress().toString('hex');
//     var privateKey = wallet.getPrivateKey().toString('hex');

//     // var masterNode = masterKey.derive(path)

//     console.log(address, privateKey)

//     // var keyStore = wallet.toV3String("password")
//     // console.log(keyStore)
// })
const Btc = require('bitcoinjs-lib')
const network = Btc.networks.bitcoin;
console.log(network);
let node = Btc.bip32.fromSeed(Buffer.from('6a35ad843824a9f292da18d3168a35af2795784e965752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508', 'hex'), network);
let child = node.derivePath("m/44'/144'/0'/0/0")
let privateKey = child.toWIF()
// let publicKey = temp.getAddress().toString('hex')
let address = Btc.payments.p2pkh({pubkey: child.publicKey, network}).address
// let privateKey = temp.toWIF()
console.log( address, child.publicKey.toString('hex'), privateKey);

// console.log(child)
