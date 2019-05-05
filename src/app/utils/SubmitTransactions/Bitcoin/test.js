// const Btc = require('bitcoinjs-lib')
// const network = Btc.networks.testnet;

// let masterSeed = '6a35ad843824a9f292da18d3168a35af2795784e9`65752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508';

// let node = Btc.bip32.fromSeed(Buffer.from(masterSeed, 'hex'), network);
// let child = node.derivePath("m/44'/1'/0'/0/0");
// let privateKey = child.toWIF()

// let address = Btc.payments.p2pkh({pubkey: child.publicKey, network}).address
// console.log(privateKey, address)

// // const Btc = require('bitcoinjs-lib')
// // const network = Btc.networks.testnet;
// // let node = Btc.bip32.fromSeed(Buffer.from('6a35ad843824a9f292da18d3168a35af2795784e965752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508', 'hex'), network);
// // let child = node.derivePath("m/44'/1'/0'/0/0")
// // let privateKey = child.toWIF()
// // // let publicKey = temp.getAddress().toString('hex')
// // let address = Btc.payments.p2pkh({pubkey: child.publicKey, network}).address
// // // let privateKey = temp.toWIF()
// // console.log( address, child.publicKey.toString('hex'), privateKey);

// // // console.log(child)

const request = require('request');
const Btc = require('bitcoinjs-lib');
const network = Btc.networks.testnet;
var pushtx = require('blockchain.info/pushtx').usingNetwork(3)
var blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3)
let masterSeed = '6a35ad843824a9f292da18d3168a35af2795784e965752584cc9114be5924c3c571aa60b307788489e5265c89d18da7f299da0363ccd4c7477ad07c84e3da508';

let node = Btc.bip32.fromSeed(Buffer.from(masterSeed, 'hex'), network);
let child = node.derivePath("m/44'/1'/0'/0/0");
let privateKey = child.toWIF()

let address = Btc.payments.p2pkh({ pubkey: child.publicKey, network }).address
let wallet = new Btc.ECPair.fromWIF(privateKey, network);
let txb = new Btc.TransactionBuilder(network);

let amountToSend = 1200;
let fee = 10000, returnAmount;
amountToSend += fee;
let sendAddress = 'mgBTTJ5XUJVc7GoMxTPUuwdJaeDVs6o1gB';
let myAddress = 'n1ZSiMXwVsnJzUU5RqBa3jXpxbkFUFudZo';
// txb.addInput('6860fe0c1799816f996189538bc72376d902ed3d26942bae937247d0e6aa5de5', 1);
// txb.addOutput(sendPublicKey, send);
// txb.addOutput(publicKey, keep);
// txb.sign(0, wallet);

// let txHash = txb.build().toHex();
// let utxoInputUrl = 'https://testnet.blockexplorer.com/api/addr/n1ZSiMXwVsnJzUU5RqBa3jXpxbkFUFudZo/utxo';
// request(utxoInputUrl, function (error, response, body) {
// 	if (error) {
// 		console.log(error);
// 	}
// 	body = JSON.parse(body);
// 	let amount = 0;
// 	for (let i = 0; i < body.length; i++) {
// 		console.log(body[i].txid)
// 		amount += body[i].satoshis;
// 		txb.addInput(body[i].txid, body[i].vout);
// 		if (amount >= amountToSend) {
// 			returnAmount = amount - amountToSend;
// 			txb.addOutput(sendAddress, amountToSend - fee);
// 			txb.addOutput(myAddress, returnAmount);
// 			break;
// 		}
// 	}
// 	console.log(returnAmount);

// 	txb.sign(0, wallet);
// 	let txHash = txb.build().toHex();
// 	console.log(txHash)

// 	pushtx.pushtx(txHash).then(res=>{
// 		console.log(res)
// 	}).catch(err=>{
// 		console.log(err)
// 	})
// })


blockexplorer.getUnspentOutputs('n1ZSiMXwVsnJzUU5RqBa3jXpxbkFUFudZo').then(res=>{
	res = res["unspent_outputs"];
	let amount = 0;
	for (let i = 0; i < res.length; i++) {
		console.log(res[i]["tx_hash_big_endian"])
		amount += res[i].value;
		txb.addInput(res[i]["tx_hash_big_endian"], res[i]["tx_output_n"]);
		if (amount >= amountToSend) {
			returnAmount = amount - amountToSend;
			txb.addOutput(sendAddress, amountToSend - fee);
			txb.addOutput(myAddress, returnAmount);
			break;
		}
	}

	console.log(returnAmount)
	txb.sign(0, wallet);
	let txHash = txb.build().toHex();
	console.log(txHash)

	pushtx.pushtx(txHash).then(res=>{
		console.log(res)
	}).catch(err=>{
		console.log(err)
	})
}).catch(err=>{
    console.log(err)
})