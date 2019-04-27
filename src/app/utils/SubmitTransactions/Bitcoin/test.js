let coinSelect = require('coinselect')
let feeRate = 55 // satoshis per byte
let utxos = [
  {
    txId: '73bd6287a73f46066fd1503cd2b4032230d5e016bbc9ee51d7e4584fe6a8608b',
    vout: 0,
    value: 670
  }
]
let targets = [
  {
    address: 'n1ZSiMXwVsnJzUU5RqBa3jXpxbkFUFudZo',
    value: 100
  }
]

// ...
let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate)

// the accumulated fee is always returned for analysis
console.log(inputs, outputs, fee)

// // .inputs and .outputs will be undefined if no solution was found
// if (!inputs || !outputs) return

// let txb = new bitcoin.TransactionBuilder()

// inputs.forEach(input => txb.addInput(input.txId, input.vout))
// outputs.forEach(output => {
//   // watch out, outputs may have been added that you need to provide
//   // an output address/script for
//   if (!output.address) {
//     output.address = wallet.getChangeAddress()
//     wallet.nextChangeAddress()
//   }

//   txb.addOutput(output.address, output.value)
// })